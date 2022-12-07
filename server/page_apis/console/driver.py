_api = None
def _syncApi(newApi):
    global _api
    _api = newApi

def echo(msg):
    _api.echo(msg)
