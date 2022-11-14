from abc import ABC, abstractmethod
from typing import Union
import sys
import importlib


class ServerApi(ABC):
    def __init__(self, apiPath, driver):
        assert apiPath[0] == "/" and apiPath[-1] != "/", "Invalid api path: must start (but not end) with a slash"
        self._apiPath = apiPath
        self._driver = driver
        self._lastFileRequest = None

    # overridable methods
    def onGet(self):
        pass

    def onPost(self):
        pass

    # base implementations
    def get(self, queryParams) -> Union[dict, None]:
        self.onGet()
        return self._lastFileRequest

    def post(self, queryParams, requestDict) -> Union[dict, None]:
        self.onPost()
        self._execPyFile(requestDict['pyfile'])
        self._lastFileRequest = requestDict

    def _execPyFile(self, fileData):
        oldPath = sys.path
        sys.path = [f"./{self._apiPath}"]
        importlib.reload(self._driver)
        self._driver._syncSelf(self)
        self._exec_noVarsInContext(fileData)
        sys.path = oldPath

    @abstractmethod
    def _exec_noVarsInContext(_, fileData):
        pass # just exec(); context switch allows importing driver module

    # required overridable methods
    @abstractmethod
    def getAction(self, action, queryParams) -> Union[dict, None]:
        return # a dict or None from processing the GET request

    @abstractmethod
    def postAction(self, action, queryParams, requestDict) -> Union[dict, None]:
        return # a dict or None from processing the POST request
