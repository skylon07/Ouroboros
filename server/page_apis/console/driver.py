_self = None
def _syncSelf(newSelf):
    global _self
    _self = newSelf

def printToConsole(msg):
    _self.printToConsole(msg)
