from abc import ABC, abstractmethod


class Api(ABC):
    @abstractmethod
    def get(self):
        return # a dict from processing the GET request

    @abstractmethod
    def post(self, requestDict):
        return # a dict from processing the POST request
