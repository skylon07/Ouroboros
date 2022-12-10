_api = None
def _syncApi(newApi):
    global _api
    _api = newApi

PLAYER_BLUE = "PLAYER_BLUE"
PLAYER_RED = "PLAYER_RED"
MODE_MOVE_PLAYER = "MODE_MOVE_PLAYER"
MODE_MOVE_TOKEN = "MODE_MOVE_TOKEN"

def setPlayerTurn(player):
    # TODO: validation
    _api._gameState['playerTurn'] = player

def setMoveMode(moveMode):
    # TODO: validation
    _api._gameState['moveMode'] = moveMode

def setPlayerBluePosition(positionPath):
    # TODO: validation
    _api._gameState['bluePositionPath'] = positionPath

def setPlayerRedPosition(positionPath):
    # TODO: validation
    _api._gameState['redPositionPath'] = positionPath

def setToken1Position(position):
    # TODO: validation
    _api._gameState['token1Position'] = position

def setToken2Position(position):
    # TODO: validation
    _api._gameState['token2Position'] = position

def setGameOver(gameOver):
    # TODO: validation
    _api._gameState['gameOver'] = gameOver

def setWinningPlayer(playerName):
    # TODO: validation
    _api._gameState['winningPlayer'] = playerName

def onSetActivePlayerPosition(setActivePlayerPositionFn):
    _api._setActivePlayerPosition = setActivePlayerPositionFn

def onSetTokenPiecePosition(setTokenPiecePositionFn):
    _api._setTokenPiecePosition = setTokenPiecePositionFn

def onResetGame(resetGameFn):
    _api._resetGame = resetGameFn
