from abc import ABC, abstractmethod
import sys
import importlib

class ServerApi(ABC):
    _logCount = 0

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
        self._execPyFile(requestDict['pyfile'])
        self._lastFileRequest = requestDict

    def _execPyFile(self, fileData):
        oldPath = sys.path
        sys.path = [f"./{self._apiPath}"]
        importlib.reload(self._driver)
        self._driver._syncSelf(self)

        localVars = {
            'input': None,
            'print': lambda msg: self._appendLog("log", msg),
        }
        self._exec_noVarsInContext(fileData, localVars)
        
        sys.path = oldPath

    @abstractmethod
    def _exec_noVarsInContext(self, fileData, localVars):
        pass # just exec(); context switch allows importing driver module

    # required overridable methods
    @abstractmethod
    def getAction(self, action, queryParams):
        return # a dict or None from processing the GET request

    @abstractmethod
    def postAction(self, action, queryParams, requestDict):
        return # a dict or None from processing the POST request

    def _appendLog(self, logType, logMsg):
        assert logType in ("log", "warn", "error", "info")
        newLog = {
            'type': logType,
            'message': logMsg,
            'id': ServerApi._logCount,
        }
        ServerApi._logCount += 1
        self._logs.append(newLog)
