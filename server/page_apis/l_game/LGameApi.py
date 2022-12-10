from ..ServerApi import ServerApi
from ..l_game import driver


class Position:
    DIR_LEFT = "DIR_LEFT"
    DIR_RIGHT = "DIR_RIGHT"
    DIR_UP = "DIR_UP"
    DIR_DOWN = "DIR_DOWN"
    DIR_REL_FORWARD = "DIR_REL_FORWARD"
    DIR_REL_LEFT = "DIR_REL_LEFT"
    DIR_REL_RIGHT = "DIR_REL_RIGHT"
    DIR_REL_BACKWARD = "DIR_REL_BACKWARD"

    @classmethod
    def getAbsMoveDirection(cls, fromPosition, toPosition):
        if fromPosition is None or toPosition is None:
            return None

        rowDiff = toPosition.rowIdx - fromPosition.rowIdx
        colDiff = toPosition.colIdx - fromPosition.colIdx
        if rowDiff == 0:
            if colDiff == -1:
                return Position.DIR_LEFT
            elif colDiff == 1:
                return Position.DIR_RIGHT
        elif colDiff == 0:
            if rowDiff == -1:
                return Position.DIR_UP
            elif rowDiff == 1:
                return Position.DIR_DOWN

        raise ValueError("Position.getAbsMoveDirection() -- positions are not adjacent")

    @classmethod
    def getRelMoveDirection(cls, lastDir, currDir):
        if currDir is None:
            return None

        if lastDir == currDir or lastDir is None:
            return Position.DIR_REL_FORWARD

        isLeftTurn = cls.applyRelDir(lastDir, Position.DIR_REL_LEFT) == currDir
        if isLeftTurn:
            return Position.DIR_REL_LEFT

        isRightTurn = cls.applyRelDir(lastDir, Position.DIR_REL_RIGHT) == currDir
        if isRightTurn:
            return Position.DIR_REL_RIGHT

        return Position.DIR_REL_BACKWARD

    @classmethod
    def isAbsDir(cls, direction):
        absDirs = (
            Position.DIR_LEFT,
            Position.DIR_RIGHT,
            Position.DIR_UP,
            Position.DIR_DOWN,
        )
        return direction in absDirs

    @classmethod
    def isRelDir(cls, direction):
        relDirs = (
            Position.DIR_REL_FORWARD,
            Position.DIR_REL_LEFT,
            Position.DIR_REL_RIGHT,
            Position.DIR_REL_BACKWARD,
        )
        return direction in relDirs

    @classmethod
    def reverseDir(cls, direction):
        revDirs = {
            Position.DIR_LEFT: Position.DIR_RIGHT,
            Position.DIR_RIGHT: Position.DIR_LEFT,
            Position.DIR_UP: Position.DIR_DOWN,
            Position.DIR_DOWN: Position.DIR_UP,
            Position.DIR_REL_FORWARD: Position.DIR_REL_BACKWARD,
            Position.DIR_REL_LEFT: Position.DIR_REL_RIGHT,
            Position.DIR_REL_RIGHT: Position.DIR_REL_LEFT,
            Position.DIR_REL_BACKWARD: Position.DIR_REL_FORWARD,
        }
        return revDirs[direction]

    @classmethod
    def applyAbsDir(cls, position, absDir):
        if not Position.isAbsDir(absDir):
            raise ValueError("Invalid absDir")
        
        dirMoves = {
            Position.DIR_LEFT: [0, -1],
            Position.DIR_RIGHT: [0, 1],
            Position.DIR_UP: [-1, 0],
            Position.DIR_DOWN: [1, 0],
        }
        move = dirMoves[absDir]
        return Position(position.rowIdx + move[0], position.colIdx + move[1])

    @classmethod
    def applyRelDir(cls, absDir, relDir):
        if not Position.isAbsDir(absDir):
            ValueError("Invalid absDir")

        if relDir is Position.DIR_REL_FORWARD:
            return absDir
        elif relDir is Position.DIR_REL_BACKWARD:
            return Position.reverseDir(absDir)
        elif relDir is Position.DIR_REL_LEFT:
            leftTurns = {
                Position.DIR_LEFT: Position.DIR_DOWN,
                Position.DIR_RIGHT: Position.DIR_UP,
                Position.DIR_UP: Position.DIR_LEFT,
                Position.DIR_DOWN: Position.DIR_RIGHT,
            }
            return leftTurns[absDir]
        elif relDir is Position.DIR_REL_RIGHT:
            rightTurns = {
                Position.DIR_LEFT: Position.DIR_UP,
                Position.DIR_RIGHT: Position.DIR_DOWN,
                Position.DIR_UP: Position.DIR_RIGHT,
                Position.DIR_DOWN: Position.DIR_LEFT,
            }
            return rightTurns[absDir]
        else:
            raise ValueError("Invalid relDir")

    @classmethod
    def equals(cls, position1, position2):
        if not isinstance(position1, Position) or not isinstance(position2, Position):
            raise TypeError("Cannot compare non-Position instances")
        
        rowsMatch = position1.rowIdx == position2.rowIdx
        colsMatch = position1.colIdx == position2.colIdx
        return rowsMatch and colsMatch
    
    def __init__(self, rowIdx, colIdx):
        self.__rowIdx = rowIdx
        self.__colIdx = colIdx

    def __repr__(self):
        return f"<Position {self.__rowIdx}, {self.__colIdx}>"

    @property
    def rowIdx(self):
        return self.__rowIdx

    @property
    def colIdx(self):
        return self.__colIdx

    def __eq__(self, otherPosition):
        if not isinstance(otherPosition, Position):
            return False
        return Position.equals(self, otherPosition)


class PlayerPosition(Position):
    @classmethod
    def fromPositionPath(cls, posPathList):
        if len(posPathList) != 4:
            raise ValueError("Invalid position path (length != 4)")

        [edge1, mid1, mid2, edge2] = posPathList
        edge1_mid1 = Position.getAbsMoveDirection(edge1, mid1)
        mid1_mid2 = Position.getAbsMoveDirection(mid1, mid2)
        mid2_edge2 = Position.getAbsMoveDirection(mid2, edge2)
        edge1_mid1_mid2 = Position.getRelMoveDirection(edge1_mid1, mid1_mid2)
        mid1_mid2_edge2 = Position.getRelMoveDirection(mid1_mid2, mid2_edge2)

        mid1Straight = edge1_mid1_mid2 is Position.DIR_REL_FORWARD
        mid2Straight = mid1_mid2_edge2 is Position.DIR_REL_FORWARD
        bothStraight = mid1Straight and mid2Straight
        neitherStraight = not mid1Straight and not mid2Straight
        if bothStraight or neitherStraight:
            raise ValueError("Invalid position path (not L-shape path)")

        longEdgePosition = edge1 if mid1Straight else edge2
        longEdgeDirection = edge1_mid1 if mid1Straight else Position.reverseDir(mid2_edge2)
        shortEdgeRelDirection = mid1_mid2_edge2 if mid1Straight else Position.reverseDir(edge1_mid1_mid2)
        return PlayerPosition(
            longEdgePosition.rowIdx,
            longEdgePosition.colIdx,
            longEdgeDirection,
            shortEdgeRelDirection,
        )

    def __init__(self, startRowIdx, startColIdx, orientation, flip):
        if not Position.isAbsDir(orientation):
            raise ValueError("PlayerPosition received an invalid orientation")
        
        validFlips = (
            Position.DIR_REL_LEFT,
            Position.DIR_REL_RIGHT,
        )
        if flip not in validFlips:
            raise ValueError("PlayerPosition received an invalid flip")

        super().__init__(startRowIdx, startColIdx)
        self._orientation = orientation
        self._flip = flip

    def __repr__(self):
        return f"<PlayerPosition {self.toPositionPath()}>"

    @property
    def orientation(self):
        return self._orientation

    @property
    def flip(self):
        return self._flip

    def __eq__(self, otherPosition):
        if not isinstance(otherPosition, PlayerPosition):
            return False
        
        superEquals = super().__eq__(otherPosition)
        orientationsMatch = self.orientation == otherPosition.orientation
        flipsMatch = self.flip == otherPosition.flip
        return superEquals and orientationsMatch and flipsMatch

    def toPositionPath(self):
        edge1 = Position(self.rowIdx, self.colIdx)
        mid1 = Position.applyAbsDir(self, self.orientation)
        mid2 = Position.applyAbsDir(mid1, self.orientation)
        flipDir = Position.applyRelDir(self.orientation, self.flip)
        edge2 = Position.applyAbsDir(mid2, flipDir)
        return (edge1, mid1, mid2, edge2)


class LGameApi(ServerApi):
    def __init__(self):
        super().__init__("/l-game", driver)
        self._useDefaultImplementation = True
        self._gameState = None
        self._initGameState()
        driver._syncApi(self)
        self._defaultResetGame()

    def _initGameState(self):
        self._gameState = {
            'playerTurn': None,
            'moveMode': None,
            'bluePositionPath': None,
            'redPositionPath': None,
            'token1Position': None,
            'token2Position': None,
            'gameOver': None,
            'winningPlayer': None,
        }

    def onPostFile(self, queryParams, requestDict):
        self._useDefaultImplementation = False
        self._initGameState()

    def getAction(self, action, queryParams):
        if action == "/game-state":
            return self._gameState

    def postAction(self, action, queryParams, requestDict):
        if action == '/player-position':
            positionPath = requestDict['positionPath']
            if self._useDefaultImplementation:
                self._defaultSetActivePlayerPosition(positionPath)
            else:
                self._setActivePlayer(positionPath)
        elif action == '/token-position':
            id = requestDict['id']
            position = requestDict['position']
            if self._useDefaultImplementation:
                self._defaultSetTokenPiecePosition(id, position)
            else:
                self._setTokenPiecePosition(id, position)
        elif action == '/reset':
            if self._useDefaultImplementation:
                self._defaultResetGame()
            else:
                self._resetGame()

    # default implementations
    def _defaultSetActivePlayerPosition(self, newPositionPath):
        currPlayerTurn = self._gameState['playerTurn']
        if currPlayerTurn is driver.PLAYER_BLUE:
            driver.setPlayerBluePosition(newPositionPath)
        else:
            driver.setPlayerRedPosition(newPositionPath)
        driver.setMoveMode(driver.MODE_MOVE_TOKEN)

    def _defaultSetTokenPiecePosition(self, id, newPosition):
        currPlayerTurn = self._gameState['playerTurn']
        if id == 1:
            driver.setToken1Position(newPosition)
        elif id == 2:
            driver.setToken2Position(newPosition)
        driver.setPlayerTurn(self._defaultHelper_opposite(currPlayerTurn))
        driver.setMoveMode(driver.MODE_MOVE_PLAYER)
        lastPlayer = currPlayerTurn
        
        if self._defaultHelper_checkPlayerStuck():
            driver.setGameOver(True)
            driver.setWinningPlayer(
                "Blue" if lastPlayer is driver.PLAYER_BLUE
                else "Red"
            )

    def _defaultResetGame(self):
        driver.setPlayerTurn(driver.PLAYER_BLUE)
        driver.setMoveMode(driver.MODE_MOVE_PLAYER)
        driver.setPlayerBluePosition([
            {'row': 1, 'col': 1},
            {'row': 2, 'col': 1},
            {'row': 3, 'col': 1},
            {'row': 3, 'col': 2},
        ])
        driver.setPlayerRedPosition([
            {'row': 2, 'col': 2},
            {'row': 1, 'col': 2},
            {'row': 0, 'col': 2},
            {'row': 0, 'col': 1},
        ])
        driver.setToken1Position({'row': 0, 'col': 0})
        driver.setToken2Position({'row': 3, 'col': 3})
        driver.setGameOver(False)
        driver.setWinningPlayer(None)

    def _defaultHelper_opposite(self, player):
        oppositeTurn = {
            driver.PLAYER_BLUE: driver.PLAYER_RED,
            driver.PLAYER_RED: driver.PLAYER_BLUE,
        }[player]
        return oppositeTurn

    def _defaultHelper_checkPlayerStuck(self):
        currMoveMode = self._gameState['moveMode']
        if currMoveMode is driver.MODE_MOVE_TOKEN:
            return False

        bluePositionPath = self._gameState['bluePositionPath']
        redPositionPath = self._gameState['redPositionPath']
        bluePlayerPosition = PlayerPosition.fromPositionPath([
            Position(row, col)
            for position in bluePositionPath
            for row in [position['row']]
            for col in [position['col']]
        ])
        redPlayerPosition = PlayerPosition.fromPositionPath([
            Position(row, col)
            for position in redPositionPath
            for row in [position['row']]
            for col in [position['col']]
        ])
        tokenPiece1Position = Position(self._gameState['token1Position']['row'], self._gameState['token1Position']['col'])
        tokenPiece2Position = Position(self._gameState['token2Position']['row'], self._gameState['token2Position']['col'])

        for currRowIdx in range(4):
            for currColIdx in range(4):
                position = Position(currRowIdx, currColIdx)
                if self._defaultHelper_checkOpenLPath([position], bluePlayerPosition, redPlayerPosition, tokenPiece1Position, tokenPiece2Position):
                    # DEBUG
                    print("\tNO PATH")
                    return False
        # DEBUG
        print("\tYES PATH")
        return True

    def _defaultHelper_checkOpenLPath(self, positionStack, bluePlayerPosition, redPlayerPosition, tokenPiece1Position, tokenPiece2Position):
        currPlayerTurn = self._gameState['playerTurn']
        bluePositionPath = self._gameState['bluePositionPath']
        redPositionPath = self._gameState['redPositionPath']

        position = positionStack[-1]
        rowIdxInBounds = position.rowIdx >= 0 and position.rowIdx < 4
        colIdxInBounds = position.colIdx >= 0 and position.colIdx < 4
        inBounds = rowIdxInBounds and colIdxInBounds
        if inBounds:
            if position == tokenPiece1Position:
                # DEBUG
                print("\tposition == tokenPiece1Position")
                return False
            if position == tokenPiece2Position:
                # DEBUG
                print("\tposition == tokenPiece2Position")
                return False
            if currPlayerTurn is not driver.PLAYER_BLUE:
                for playerPosition in bluePositionPath:
                    if position == Position(playerPosition['row'], playerPosition['col']):
                        # DEBUG
                        print("\tposition == Position (blue)")
                        return False
            if currPlayerTurn is not driver.PLAYER_RED:
                for playerPosition in redPositionPath:
                    if position == Position(playerPosition['row'], playerPosition['col']):
                        # DEBUG
                        print("\tposition == Position (red)")
                        return False

            forwardPaths = 0
            sidePaths = 0
            lastMove = None
            for positionIdx in range(len(positionStack) - 3, len(positionStack)):
                position = positionStack[positionIdx] if positionIdx >= 0 else None
                lastPosition = positionStack[positionIdx - 1] if positionIdx - 1 >= 0 else None
                currMove = Position.getAbsMoveDirection(lastPosition, position)
                relDir = Position.getRelMoveDirection(lastMove, currMove)
                if relDir is Position.DIR_REL_FORWARD:
                    forwardPaths += 1
                elif relDir is Position.DIR_REL_LEFT or relDir is Position.DIR_REL_RIGHT:
                    sidePaths += 1
                lastMove = currMove

            if forwardPaths == 2 and sidePaths == 1:
                stackAsPlayerPosition = PlayerPosition.fromPositionPath(positionStack[-4:])
                playerPosition = bluePlayerPosition \
                    if currPlayerTurn == driver.PLAYER_BLUE \
                    else redPlayerPosition
                pathsAreJustPlayerPosition = stackAsPlayerPosition == playerPosition
                # DEBUG
                print(f"\t{stackAsPlayerPosition}")
                if not pathsAreJustPlayerPosition:
                    # DEBUG
                    print("\tnot pathsAreJustPlayerPosition")
                    return True

            applyDirs = (
                Position.DIR_LEFT,
                Position.DIR_RIGHT,
                Position.DIR_UP,
                Position.DIR_DOWN,
            )
            for dir in applyDirs:
                newPosition = Position.applyAbsDir(position, dir)
                alreadyUsedPosition = any(
                    position == newPosition
                    for position in positionStack
                )
                if not alreadyUsedPosition:
                    newPositionStack = positionStack + [newPosition]
                    foundPath = self._defaultHelper_checkOpenLPath(newPositionStack, bluePlayerPosition, redPlayerPosition, tokenPiece1Position, tokenPiece2Position)
                    if foundPath:
                        # DEBUG
                        print("\tfoundPath")
                        return True
            # DEBUG
            print("\t(no positions found)")
            return False
        else:
            # DEBUG
            print("\t(out of bounds)")
            return False

    # overridden implementations
    def _setActivePlayerPosition(self, newPositionPath):
        return NotImplemented

    def _setTokenPiecePosition(self, id, newPosition):
        return NotImplemented

    def _resetGame(self):
        return NotImplemented

    # required subclass method overrides
    def _getGlobals(self):
        return globals()

    def _exec_noVarsInContext(self, fileData, globalVars, localVars):
        exec(fileData, globalVars, localVars)
