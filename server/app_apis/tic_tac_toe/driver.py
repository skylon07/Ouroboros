_api = None
def _syncApi(newApi):
    global _api
    _api = newApi

PLAYER_EX = "PLAYER_EX"
PLAYER_OH = "PLAYER_OH"

def setPlayerTurn(player):
    if player not in (PLAYER_EX, PLAYER_OH):
        raise ValueError("setPlayerTurn(player) -- player was not a valid <player id>")
    
    _api._gameState['playerTurn'] = player

def setPlayerScore(player, score):
    if player not in (PLAYER_EX, PLAYER_OH):
        raise ValueError("setPlayerScore(player, score) -- player was not a valid <player id>")
    
    if type(score) is not int:
        raise ValueError("setPlayerScore(player, score) -- score was not an int")
    
    _api._gameState['score'][player] = score

def setBoardState(boardState):
    if type(boardState) not in (tuple, list):
        raise ValueError("setBoardState(boardState) -- boardState was not a valid <board state> (bad type)")
    
    for boardStateRow in boardState:
        if type(boardStateRow) not in (tuple, list):
            raise ValueError("setBoardState(boardState) -- boardState was not a valid <board state> (bad row type)")

    for boardStateRow in boardState:
        for boardSquareState in boardStateRow:
            if boardSquareState not in (PLAYER_EX, PLAYER_OH, None):
                raise ValueError("setBoardState(boardState) -- boardState row contained an invalid item (not a <player id> or None)")

    _api._gameState['boardState'] = boardState

def setGameOver(gameOver):
    if type(gameOver) is not bool:
        raise ValueError("setGameOver(gameOver) -- gameOver was not a boolean value")

    _api._gameState['gameOver'] = gameOver

def setWinningPlayer(player):
    if player not in (PLAYER_EX, PLAYER_OH, None):
        raise ValueError("setWinningPlayer(player) -- player was not a valid <player id> or None")
    
    _api._gameState['winningPlayer'] = player

def onSelectSquare(selectSquareFn):
    class Class:
        def method(self):
            pass
    
    if type(selectSquareFn) is type(onSelectSquare):
        if selectSquareFn.__code__.co_argcount != 1:
            raise ValueError("onSelectSquare(selectSquareFn) -- selectSquareFn should take one argument")
    elif type(selectSquareFn) is type(Class().method):
        if selectSquareFn.__code__.co_argcount != 2:
            raise ValueError("onSelectSquare(selectSquareFn) -- selectSquareFn should take one argument")
    else:
        raise ValueError("onSelectSquare(selectSquareFn) -- selectSquareFn was not a function")
    
    _api._selectSquare = selectSquareFn

def onResetGame(resetGameFn):
    class Class:
        def method(self):
            pass
    
    if type(resetGameFn) is type(onResetGame):
        if resetGameFn.__code__.co_argcount != 0:
            raise ValueError("onResetGame(resetGameFn) -- resetGameFn should take no arguments")
    elif type(resetGameFn) is type(Class().method):
        if resetGameFn.__code__.co_argcount != 1:
            raise ValueError("onResetGame(resetGameFn) -- resetGameFn should take no arguments")
    else:
        raise ValueError("onResetGame(resetGameFn) -- resetGameFn was not a function")
    
    _api._resetGame = resetGameFn
