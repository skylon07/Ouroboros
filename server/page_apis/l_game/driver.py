_api = None
def _syncApi(newApi):
    global _api
    _api = newApi

PLAYER_BLUE = "PLAYER_BLUE"
PLAYER_RED = "PLAYER_RED"
MODE_MOVE_PLAYER = "MODE_MOVE_PLAYER"
MODE_MOVE_TOKEN = "MODE_MOVE_TOKEN"

def setPlayerTurn(player):
    if player not in (PLAYER_BLUE, PLAYER_RED):
        raise ValueError("setPlayerTurn(player) -- player was not a valid <player id>")
    
    _api._gameState['playerTurn'] = player

def setMoveMode(moveMode):
    if moveMode not in (MODE_MOVE_PLAYER, MODE_MOVE_TOKEN):
        raise ValueError("setMoveMode(moveMode) -- moveMode was not a valid <move mode>")
    
    _api._gameState['moveMode'] = moveMode

def setPlayerBluePosition(positionPath):
    if type(positionPath) not in (list, tuple):
        raise ValueError("setPlayerBluePosition(positionPath) -- positionPath was not a valid <player position path>")
    
    for position in positionPath:
        isValidPosition = type(position) is dict and \
            'row' in position and type(position['row']) is int or \
            'col' in position and type(position['col']) is int
        if not isValidPosition:
            raise ValueError("setPlayerBluePosition(positionPath) -- positionPath contained an invalid <position> element")

    _api._gameState['bluePositionPath'] = positionPath

def setPlayerRedPosition(positionPath):
    if type(positionPath) not in (list, tuple):
        raise ValueError("setPlayerRedPosition(positionPath) -- positionPath was not a valid <player position path>")
    
    for position in positionPath:
        isValidPosition = type(position) is dict and \
            'row' in position and type(position['row']) is int or \
            'col' in position and type(position['col']) is int
        if not isValidPosition:
            raise ValueError("setPlayerRedPosition(positionPath) -- positionPath contained an invalid <position> element")
    
    _api._gameState['redPositionPath'] = positionPath

def setToken1Position(position):
    isValidPosition = type(position) is dict and \
        'row' in position and type(position['row']) is int or \
        'col' in position and type(position['col']) is int
    if not isValidPosition:
        raise ValueError("setToken1Position(position) -- position was not a valid <position>")
    
    _api._gameState['token1Position'] = position

def setToken2Position(position):
    isValidPosition = type(position) is dict and \
        'row' in position and type(position['row']) is int or \
        'col' in position and type(position['col']) is int
    if not isValidPosition:
        raise ValueError("setToken1Position(position) -- position was not a valid <position>")
    
    _api._gameState['token2Position'] = position

def setGameOver(gameOver):
    if type(gameOver) is not bool:
        raise ValueError("setGameOver(gameOver) -- gameOver was not a boolean value")

    _api._gameState['gameOver'] = gameOver

def setWinningPlayer(playerName):
    if type(playerName) is not str:
        raise ValueError("setWinningPlayer(playerName) -- playerName was not a string")
    
    if playerName in (PLAYER_BLUE, PLAYER_RED):
        raise ValueError("setWinningPlayer(playerName) -- playerName should not be a <player id>")
    
    _api._gameState['winningPlayer'] = playerName

def onSetActivePlayerPosition(setActivePlayerPositionFn):
    if type(setActivePlayerPositionFn) is not type(onSetActivePlayerPosition):
        raise ValueError("onSetActivePlayerPosition(setActivePlayerPositionFn) -- setActivePlayerPositionFn was not a function")

    if setActivePlayerPositionFn.__code__.co_argcount != 1:
        raise ValueError("onSetActivePlayerPosition(setActivePlayerPositionFn) -- setActivePlayerPositionFn should take one argument")
    
    _api._setActivePlayerPosition = setActivePlayerPositionFn

def onSetTokenPiecePosition(setTokenPiecePositionFn):
    if type(setTokenPiecePositionFn) is not type(onSetTokenPiecePosition):
        raise ValueError("onSetTokenPiecePosition(setTokenPiecePositionFn) -- setTokenPiecePositionFn was not a function")

    if setTokenPiecePositionFn.__code__.co_argcount != 0:
        raise ValueError("onSetTokenPiecePosition(setTokenPiecePositionFn) -- setTokenPiecePositionFn should take two arguments")
    
    _api._setTokenPiecePosition = setTokenPiecePositionFn

def onResetGame(resetGameFn):
    if type(resetGameFn) is not type(onResetGame):
        raise ValueError("onResetGame(resetGameFn) -- resetGameFn was not a function")

    if resetGameFn.__code__.co_argcount != 1:
        raise ValueError("onResetGame(resetGameFn) -- resetGameFn should take no arguments")
    
    _api._resetGame = resetGameFn
