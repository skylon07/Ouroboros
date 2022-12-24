from ..ServerApi import ServerApi
from ..tic_tac_toe import driver


class TicTacToeApi(ServerApi):
    def __init__(self):
        super().__init__("/tic-tac-toe", driver)
        self._useDefaultImplementation = True
        self._gameState = None
        self._initGameState()
        driver._syncApi(self)
        self._defaultHelper_initGame()

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
        else:
            return ValueError("Invalid action path")

    # default implementations
    def _defaultSelectSquare(self, position):
        pass # TODO

    def _defaultHelper_initGame(self):
        pass # TODO

    # overridden implementations
    def _selectSquare(self, position):
        return NotImplemented

    # required subclass method overrides
    def _getGlobals(self):
        return globals()

    def _exec_noVarsInContext(self, fileData, globalVars, localVars):
        exec(fileData, globalVars, localVars)
