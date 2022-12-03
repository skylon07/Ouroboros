_api = None
def _syncApi(newApi):
    global _api
    _api = newApi

def printToConsole(msg):
    _api.printToConsole(msg)
