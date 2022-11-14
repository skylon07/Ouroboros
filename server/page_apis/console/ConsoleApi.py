from ..ServerApi import ServerApi
from ..console import driver


class ConsoleApi(ServerApi):
    def __init__(self):
        super().__init__("/console", driver)
        self._msgs = []

    def onPost(self):
        self._msgs = []

    def getAction(self, action, queryParams):
        if action == "/messages":
            return {'messages': "\n".join(self._msgs)}

    def postAction(self, action, queryParams, requestDict):
        return None

    def printToConsole(self, msg):
        self._msgs.append(str(msg))

    def _exec_noVarsInContext(self, fileData):
        globalVars = dict(globals())
        del globalVars['ServerApi']
        del globalVars['ConsoleApi']
        del globalVars['driver']
        exec(fileData, globalVars, {})
