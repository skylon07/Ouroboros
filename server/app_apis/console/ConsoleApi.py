from ..ServerApi import ServerApi
from ..console import driver


class ConsoleApi(ServerApi):
    def __init__(self):
        super().__init__("/console", driver)
        self._msgs = []

    def onPostFile(self, queryParams, requestDict):
        self._msgs = []

    def getAction(self, action, queryParams):
        if action == "/messages":
            return {'messages': "\n".join(self._msgs)}

    def postAction(self, action, queryParams, requestDict):
        return None

    def echo(self, msg):
        self._msgs.append(str(msg))

    def _getGlobals(self):
        return globals()

    def _exec_noVarsInContext(self, fileData, globalVars, localVars):
        exec(fileData, globalVars, localVars)
