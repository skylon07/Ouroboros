_api = None
def _syncApi(newApi):
    global _api
    _api = newApi

PLAYER_BLUE = "PLAYER_BLUE"
PLAYER_RED = "PLAYER_RED"
BOARD_ELEM_DOT = "BOARD_ELEM_DOT"
BOARD_ELEM_LINE_H = "BOARD_ELEM_LINE_H"
BOARD_ELEM_LINE_V = "BOARD_ELEM_LINE_V"
BOARD_ELEM_BOX = "BOARD_ELEM_BOX"

def setPlayerTurn(player):
    if player not in (PLAYER_BLUE, PLAYER_RED):
        raise ValueError("setPlayerTurn(player) -- player was not a valid <player id>")
    
    _api._gameState['playerTurn'] = player

def setBoardState(boardState):
    if type(boardState) not in (tuple, list):
        raise ValueError("setBoardState(boardState) -- boardState was not a valid <board state> (bad type)")
    
    for boardStateRow in boardState:
        if type(boardStateRow) not in (tuple, list):
            raise ValueError("setBoardState(boardState) -- boardState was not a valid <board state> (bad row type)")

    for boardStateRow in boardState:
        for boardElemState in boardStateRow:
            if type(boardElemState) is not dict:
                raise ValueError("setBoardState(boardState) -- boardState row did not contain a valid <board element state> (bad type)")
            if 'type' not in boardElemState or boardElemState['type'] not in (BOARD_ELEM_DOT, BOARD_ELEM_LINE_H, BOARD_ELEM_LINE_V, BOARD_ELEM_BOX):
                raise ValueError("setBoardState(boardState) -- boardState row did not contain a valid <board element state> (bad key 'type')")
            if 'active' not in boardElemState or type(boardElemState['active']) is not bool:
                raise ValueError("setBoardState(boardState) -- boardState row did not contain a valid <board element state> (bad key 'active')")

    _api._gameState['boardState'] = boardState

def setGameOver(gameOver):
    if type(gameOver) is not bool:
        raise ValueError("setGameOver(gameOver) -- gameOver was not a boolean value")

    _api._gameState['gameOver'] = gameOver

def setWinningPlayer(player):
    if player not in (PLAYER_BLUE, PLAYER_RED):
        raise ValueError("setWinningPlayer(player) -- player was not a valid <player id>")
    
    _api._gameState['winningPlayer'] = player

def onSelectBoard(selectBoardFn):
    class Class:
        def method(self):
            pass
    
    if type(selectBoardFn) is type(onSelectBoard):
        if selectBoardFn.__code__.co_argcount != 1:
            raise ValueError("onSelectBoard(selectBoardFn) -- selectBoardFn should take one argument")
    elif type(selectBoardFn) is type(Class().method):
        if selectBoardFn.__code__.co_argcount != 2:
            raise ValueError("onSelectBoard(selectBoardFn) -- selectBoardFn should take one argument")
    else:
        raise ValueError("onSelectBoard(selectBoardFn) -- selectBoardFn was not a function")
    
    _api._selectBoard = selectBoardFn

def onRecordNewBoard(recordNewBoardFn):
    class Class:
        def method(self):
            pass
    
    if type(recordNewBoardFn) is type(onRecordNewBoard):
        if recordNewBoardFn.__code__.co_argcount != 1:
            raise ValueError("onRecordNewBoard(recordNewBoardFn) -- recordNewBoardFn should take one argument")
    elif type(recordNewBoardFn) is type(Class().method):
        if recordNewBoardFn.__code__.co_argcount != 2:
            raise ValueError("onRecordNewBoard(recordNewBoardFn) -- recordNewBoardFn should take one argument")
    else:
        raise ValueError("onRecordNewBoard(recordNewBoardFn) -- recordNewBoardFn was not a function")
    
    _api._recordNewBoard = recordNewBoardFn

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

# menu stuffs
MENU_EDITOR_ROWS_COLS = "MENU_EDITOR_ROWS_COLS"
MENU_EDITOR_BOARD_SHAPE = "MENU_EDITOR_BOARD_SHAPE"
MENU_SELECT_BOARD = "MENU_SELECT_BOARD"
MENU_CLEAR_CONFIRMATION = "MENU_CLEAR_CONFIRMATION"
MENU_NONE = "MENU_NONE"

def setMenuState(menuState, menuData = None):
    if menuState not in (MENU_NONE, MENU_EDITOR_ROWS_COLS, MENU_EDITOR_BOARD_SHAPE, MENU_SELECT_BOARD, MENU_CLEAR_CONFIRMATION):
        raise ValueError("setMenuState(menuState) -- menuState was not a valid <menu state>")
    
    _api._gameState['menuState'] = menuState
    _api._gameState['menuData'] = menuData

def onActivateEditor(activateEditorFn):
    class Class:
        def method(self):
            pass
    
    if type(activateEditorFn) is type(onActivateEditor):
        if activateEditorFn.__code__.co_argcount != 0:
            raise ValueError("onActivateEditor(activateEditorFn) -- activateEditorFn should take no arguments")
    elif type(activateEditorFn) is type(Class().method):
        if activateEditorFn.__code__.co_argcount != 1:
            raise ValueError("onActivateEditor(activateEditorFn) -- activateEditorFn should take no arguments")
    else:
        raise ValueError("onActivateEditor(activateEditorFn) -- activateEditorFn was not a function")
    
    _api._activateEditor = activateEditorFn

def onActivateBoardSelector(activateBoardSelectorFn):
    class Class:
        def method(self):
            pass
    
    if type(activateBoardSelectorFn) is type(onActivateBoardSelector):
        if activateBoardSelectorFn.__code__.co_argcount != 0:
            raise ValueError("onActivateBoardSelector(activateBoardSelectorFn) -- activateBoardSelectorFn should take no arguments")
    elif type(activateBoardSelectorFn) is type(Class().method):
        if activateBoardSelectorFn.__code__.co_argcount != 1:
            raise ValueError("onActivateBoardSelector(activateBoardSelectorFn) -- activateBoardSelectorFn should take no arguments")
    else:
        raise ValueError("onActivateBoardSelector(activateBoardSelectorFn) -- activateBoardSelectorFn was not a function")
    
    _api._activateBoardSelector = activateBoardSelectorFn

def onCancelMenu(cancelMenuFn):
    class Class:
        def method(self):
            pass
    
    if type(cancelMenuFn) is type(onCancelMenu):
        if cancelMenuFn.__code__.co_argcount != 0:
            raise ValueError("onCancelMenu(cancelMenuFn) -- cancelMenuFn should take no arguments")
    elif type(cancelMenuFn) is type(Class().method):
        if cancelMenuFn.__code__.co_argcount != 1:
            raise ValueError("onCancelMenu(cancelMenuFn) -- cancelMenuFn should take no arguments")
    else:
        raise ValueError("onCancelMenu(cancelMenuFn) -- cancelMenuFn was not a function")
    
    _api._cancelMenu = cancelMenuFn

def onSubmitMenu(submitMenuFn):
    class Class:
        def method(self):
            pass
    
    if type(submitMenuFn) is type(onSubmitMenu):
        if submitMenuFn.__code__.co_argcount != 1:
            raise ValueError("onSubmitMenu(submitMenuFn) -- submitMenuFn should take one argument")
    elif type(submitMenuFn) is type(Class().method):
        if submitMenuFn.__code__.co_argcount != 2:
            raise ValueError("onSubmitMenu(submitMenuFn) -- submitMenuFn should take one argument")
    else:
        raise ValueError("onSubmitMenu(submitMenuFn) -- submitMenuFn was not a function")
    
    _api._submitMenu = submitMenuFn

