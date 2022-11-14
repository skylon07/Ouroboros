from abc import ABC, abstractmethod
import sys
import importlib

class ServerApi(ABC):
    __logCount = 0

    def __init__(self, apiPath, driver):
        assert apiPath[0] == "/" and apiPath[-1] != "/", "Invalid api path: must start (but not end) with a slash"
        self._apiPath = apiPath
        self._driver = driver
        self._lastFileRequest = None
        self._logs = []

    # overridable methods
    def onGet(self, queryParams):
        pass

    def onPost(self, queryParams, requestDict):
        pass

    # base implementations
    def get(self, queryParams):
        self.onGet(queryParams)
        if 'logs' in queryParams:
            return self._logs
        else:
            return self._lastFileRequest

    def post(self, queryParams, requestDict):
        self.onPost(queryParams, requestDict)
        self.__execPyFile(requestDict['pyfile'])
        self._lastFileRequest = requestDict

    def __execPyFile(self, fileData):
        oldPath = sys.path
        sys.path = [f"./{self._apiPath}"]
        importlib.reload(self._driver)
        self._driver._syncApi(self)

        globalVars = dict(self._getGlobals())
        globalsToDelete = (
            type(self).__name__,
            'ServerApi',
            'driver',
        )
        for globalName in globalsToDelete:
            if globalName in globalVars:
                del globalVars[globalName]
        localVars = {
            'input': None,
            'print': lambda msg: self.__appendLog("log", str(msg)),
        }
        self._exec_noVarsInContext(fileData, globalVars, localVars)
        
        sys.path = oldPath

    @abstractmethod
    def _exec_noVarsInContext(self, fileData, globalVars, localVars):
        pass # just exec(); context switch allows importing driver module

    @abstractmethod
    def _getGlobals(self, fileData, localVars):
        pass # globals() needs to be called in correct context class

    # required overridable methods
    @abstractmethod
    def getAction(self, action, queryParams):
        return # a dict or None from processing the GET request

    @abstractmethod
    def postAction(self, action, queryParams, requestDict):
        return # a dict or None from processing the POST request

    def __appendLog(self, logType, logMsg):
        assert logType in ("log", "warn", "error", "info")
        newLog = {
            'type': logType,
            'message': logMsg,
            'id': ServerApi.__logCount,
        }
        ServerApi.__logCount += 1
        self._logs.append(newLog)
