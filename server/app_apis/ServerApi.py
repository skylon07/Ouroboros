from abc import ABC, abstractmethod
import sys
import importlib
import traceback
import re
from datetime import datetime

class ServerApi(ABC):
    __logCount = 0

    def __init__(self, apiPath, driver):
        assert apiPath[0] == "/" and apiPath[-1] != "/", "Invalid api path: must start (but not end) with a slash"
        self.__driver = driver
        self.__apiPath = apiPath
        self.__lastRequestDate = None
        self.__logs = []

    # overridable methods
    def onGetLogs(self, queryParams):
        pass

    def onGetFileUpdated(self, queryParams):
        pass

    def onPostFile(self, queryParams, requestDict):
        pass

    # base implementations
    def get(self, queryParams):
        if 'logs' in queryParams:
            self.onGetLogs(queryParams)
            return self.__logs
        else:
            self.onGetFileUpdated(queryParams)
            return self.__lastRequestDate

    def post(self, queryParams, requestDict):
        self.onPostFile(queryParams, requestDict)
        self.__execPyFile(requestDict['pyfile'])
        self.__lastRequestDate = str(datetime.utcnow())

    def _runInContext(self, execFn):
        oldPath = sys.path
        importlib.reload(self.__driver)
        sys.path = [f"./{self.__apiPath}"]
        self.__driver._syncApi(self)
        globalVars = dict(self._getGlobals())

        globalsToDelete = (
            type(self).__name__,
            'ServerApi',
            'driver',
        )
        for globalName in globalsToDelete:
            if globalName in globalVars:
                del globalVars[globalName]
        
        globalVars['print'] = lambda msg: self.__appendLog("log", str(msg))
        globalVars['driver'] = self.__driver
        globalVars['input'] = None
        
        try:
            if execFn.__code__.co_argcount == 1:
                execFn(globalVars)
            else:
                execFn()
        except Exception as error:
            rawTracebackStr = traceback.format_exc()
            firstFileIdx = rawTracebackStr.index("File")
            userFileIdx = rawTracebackStr.index("File \"<string>\"", firstFileIdx + 1) if "File \"<string>\"" in rawTracebackStr else 0
            tracebackStr = f"{rawTracebackStr[0:firstFileIdx]}{rawTracebackStr[userFileIdx:]}"
            self.__appendLog("error", f"{type(error).__name__}: {str(error)}\n{tracebackStr}")
        
        sys.path = oldPath

    def __execPyFile(self, fileData):
        def execPyFile(globalVars):
            self.__checkFileDataBuiltins(fileData)
            self._exec_noVarsInContext(fileData, globalVars, None)
        self._runInContext(execPyFile)

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
        self.__logs.append(newLog)

    def __checkFileDataBuiltins(self, fileData):
        badRegexes = [
            r"((?<![_a-zA-Z0-9])(__builtins__|exec|eval|compile|_api|_syncApi)(?![_a-zA-Z0-9]))",
            r"(from (?!re|\.|\.driver.*)([^\s]+) import|import (?!re|\.|driver.*)([^\s]+)$)"
        ]
        matches = re.findall("|".join(badRegexes), fileData)
        if len(matches) > 0:
            print("========= FILE BEGIN =========")
            print(fileData)
            print("========== FILE END ==========")
            print(f"ERROR: User tried to use a dangerous function! Exiting... ({matches})")
            exit(1)
