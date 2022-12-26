from ..ServerApi import ServerApi
from ..tic_tac_toe import driver


class TicTacToeApi(ServerApi):
    def __init__(self):
        super().__init__("/tic-tac-toe", driver)
        self._useDefaultImplementation = True
        self._gameState = None
        self._initGameState()
        driver._syncApi(self)
        self._defaultResetGame(first = True)

    def _initGameState(self):
        self._gameState = {
            'playerTurn': None,
            'score': {
                driver.PLAYER_EX: None,
                driver.PLAYER_OH: None,
            },
            'boardState': None,
            'gameOver': None,
            'winningPlayer': None,
        }

    def onPostFile(self, queryParams, requestDict):
        self._useDefaultImplementation = False
        self._initGameState()

    def getAction(self, action, queryParams):
        if action == '/game-state':
            return self._gameState
        else:
            return ValueError("Invalid action path")

    def postAction(self, action, queryParams, requestDict):
        if action == '/square-select':
            position = requestDict['position']
            if self._useDefaultImplementation:
                self._defaultSelectSquare(position)
            else:
                self._runInContext(lambda: self._selectSquare(position))
        elif action == '/reset':
            if self._useDefaultImplementation:
                self._defaultResetGame()
            else:
                self._runInContext(lambda: self._resetGame())
        else:
            return ValueError("Invalid action path")

    # default implementations
    def _defaultSelectSquare(self, position):
        isEmptySquare = self._gameState['boardState'][position['row']][position['col']] is None
        if isEmptySquare:
            currPlayer = self._gameState['playerTurn']
            self._gameState['boardState'][position['row']][position['col']] = currPlayer
            driver.setBoardState(self._gameState['boardState'])

            self._defaultHelper_countPlayerAction(position)
            self._defaultHelper_updateGameOver(position)

            gameOver = self._gameState['gameOver']
            # when a game is over, even turn count means "defender" actually
            # won, which is an unusual but possible game; "avoid" the future
            # turn toggle by toggling it now and later instead
            turnCountIsEven = self._defaultHelper__turnCount % 2 == 0
            shouldTogglePlayerTurn = not gameOver or turnCountIsEven
            if shouldTogglePlayerTurn:
                nextPlayer = self._defaultHelper_oppositePlayerOf(currPlayer)
                driver.setPlayerTurn(nextPlayer)

    def _defaultResetGame(self, first = False):
        self._defaultHelper_initCounterHelperVars()

        if first:
            driver.setPlayerTurn(driver.PLAYER_EX)
        else:
            currPlayer = self._gameState['playerTurn']
            otherPlayer = self._defaultHelper_oppositePlayerOf(currPlayer)
            driver.setPlayerTurn(otherPlayer)
        
        if first:
            driver.setPlayerScore(driver.PLAYER_EX, 0)
            driver.setPlayerScore(driver.PLAYER_OH, 0)
        else:
            winningPlayer = self._gameState['winningPlayer']
            if winningPlayer is not None:
                driver.setPlayerScore(winningPlayer, self._gameState['score'][winningPlayer] + 1)

        emptyBoardState = [
            [None, None, None],
            [None, None, None],
            [None, None, None],
        ]
        driver.setBoardState(emptyBoardState)

        driver.setGameOver(False)

    def _defaultHelper_initCounterHelperVars(self):
        self._defaultHelper__turnCount = 0
        self._defaultHelper__rowCounts = {
            driver.PLAYER_EX: [0, 0, 0],
            driver.PLAYER_OH: [0, 0, 0],
        }
        self._defaultHelper__colCounts = {
            driver.PLAYER_EX: [0, 0, 0],
            driver.PLAYER_OH: [0, 0, 0],
        }
        self._defaultHelper__diagCounts = {
            driver.PLAYER_EX: [0, 0],
            driver.PLAYER_OH: [0, 0],
        }

    def _defaultHelper_oppositePlayerOf(self, player):
        if player is driver.PLAYER_EX:
            return driver.PLAYER_OH
        elif player is driver.PLAYER_OH:
            return driver.PLAYER_EX

    def _defaultHelper_countPlayerAction(self, position):
        self._defaultHelper__turnCount += 1

        rowIdx = position['row']
        colIdx = position['col']
        currPlayer = self._gameState['playerTurn']

        self._defaultHelper__rowCounts[currPlayer][rowIdx] += 1
        self._defaultHelper__colCounts[currPlayer][colIdx] += 1

        isLeftDiag = rowIdx == colIdx
        if isLeftDiag:
            self._defaultHelper__diagCounts[currPlayer][0] += 1
        
        maxIdx = len(self._gameState['boardState']) - 1
        isRightDiag = rowIdx + colIdx == maxIdx
        if isRightDiag:
            self._defaultHelper__diagCounts[currPlayer][1] += 1

    def _defaultHelper_updateGameOver(self, positionJustUpdated):
        rowIdx = positionJustUpdated['row']
        colIdx = positionJustUpdated['col']
        currPlayer = self._gameState['playerTurn']
        
        ownsRow = self._defaultHelper__rowCounts[currPlayer][rowIdx] == 3
        ownsCol = self._defaultHelper__colCounts[currPlayer][colIdx] == 3
        
        isLeftDiag = rowIdx == colIdx
        maxIdx = len(self._gameState['boardState']) - 1
        isRightDiag = rowIdx + colIdx == maxIdx
        if isLeftDiag:
            ownsDiag = self._defaultHelper__diagCounts[currPlayer][0] == 3
        elif isRightDiag:
            ownsDiag = self._defaultHelper__diagCounts[currPlayer][1] == 3
        else:
            ownsDiag = False

        noMoreMoves = self._defaultHelper__turnCount == 9
        
        playerWon = ownsRow or ownsCol or ownsDiag
        isDraw = noMoreMoves
        gameOver = playerWon or isDraw
        driver.setGameOver(gameOver)

        if playerWon:
            driver.setWinningPlayer(currPlayer)
        else:
            driver.setWinningPlayer(None)

    # overridden implementations
    def _selectSquare(self, position):
        return NotImplemented

    def _resetGame(self):
        return NotImplemented

    # required subclass method overrides
    def _getGlobals(self):
        return globals()

    def _exec_noVarsInContext(self, fileData, globalVars, localVars):
        exec(fileData, globalVars, localVars)
