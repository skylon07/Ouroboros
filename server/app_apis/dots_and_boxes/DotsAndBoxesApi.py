from ..ServerApi import ServerApi
from ..dots_and_boxes import driver


class DotsAndBoxesApi(ServerApi):
    def __init__(self):
        super().__init__("/dots-and-boxes", driver)
        self._useDefaultImplementation = True
        self._gameState = None
        self._initGameState()
        driver._syncApi(self)
        self._defaultResetGame()

    def _initGameState(self):
        self._gameState = {
            'playerTurn': None,
            'boardState': None,
            'gameOver': None,
            'winningPlayer': None,
            'menuState': None,
            'menuData': None,
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
        if action == '/line-select':
            elementRow = requestDict['elementRow']
            elementCol = requestDict['elementCol']
            if self._useDefaultImplementation:
                self._defaultSelectBoardLine(elementRow, elementCol)
            else:
                self._runInContext(lambda: self._selectBoardLine(elementRow, elementCol))
        elif action == '/board':
            boardShape = requestDict['boardShape']
            if self._useDefaultImplementation:
                self._defaultSelectBoard(boardShape)
            else:
                self._runInContext(lambda: self._selectBoard(boardShape))
        elif action == '/new-board':
            newBoardShape = requestDict['newBoardShape']
            if self._useDefaultImplementation:
                self._defaultRecordNewBoard(newBoardShape)
            else:
                self._runInContext(lambda: self._recordNewBoard(newBoardShape))
        elif action == '/reset':
            if self._useDefaultImplementation:
                self._defaultResetGame()
            else:
                self._runInContext(lambda: self._resetGame())
        elif action == '/editor-activate':
            if self._useDefaultImplementation:
                self._defaultActivateEditor()
            else:
                self._runInContext(lambda: self._activateEditor())
        elif action == '/selector-activate':
            if self._useDefaultImplementation:
                self._defaultActivateBoardSelector()
            else:
                self._runInContext(lambda: self._activateBoardSelector())
        elif action == '/menu-cancel':
            if self._useDefaultImplementation:
                self._defaultCancelMenu()
            else:
                self._runInContext(lambda: self._cancelMenu())
        elif action == '/menu-submit':
            menuData = requestDict['menuData']
            if self._useDefaultImplementation:
                self._defaultSubmitMenu(menuData)
            else:
                self._runInContext(lambda: self._submitMenu(menuData))
        else:
            return ValueError("Invalid action path")

    # default implementations
    def _defaultSelectBoardLine(self, elementRow, elementCol):
        pass # TODO

    def _defaultSelectBoard(self, boardShape):
        pass # TODO

    def _defaultRecordNewBoard(self, newBoardShape):
        pass # TODO

    def _defaultResetGame(self):
        pass # TODO

    def _defaultActivateEditor(self):
        pass # TODO

    def _defaultActivateBoardSelector(self):
        pass # TODO

    def _defaultCancelMenu(self):
        pass # TODO

    def _defaultSubmitMenu(self, menuData):
        pass # TODO

    # overridden implementations
    def _selectBoardLine(self, elementRow, elementCol):
        return NotImplemented

    def _selectBoard(self, boardShape):
        return NotImplemented

    def _recordNewBoard(self, newBoardShape):
        return NotImplemented

    def _resetGame(self):
        return NotImplemented

    def _activateEditor(self):
        return NotImplemented

    def _activateBoardSelector(self):
        return NotImplemented

    def _cancelMenu(self):
        return NotImplemented

    def _submitMenu(self, menuData):
        return NotImplemented


    # required subclass method overrides
    def _getGlobals(self):
        return globals()

    def _exec_noVarsInContext(self, fileData, globalVars, localVars):
        exec(fileData, globalVars, localVars)
