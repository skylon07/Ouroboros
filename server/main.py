from http.server import SimpleHTTPRequestHandler, HTTPServer
import json
import traceback
from urllib import parse
from datetime import datetime

from app_apis import apis_by_path


HOSTNAME = "0.0.0.0"
DIRECTORY = '/ouroboros-api'
PORT = 30167


def datestamp():
    return datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")


class ServerHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        print(f"{datestamp()} Server handling GET request to {self.path}")
        try:
            requestPath = self.assure_no_trailing_slash(self.path)
            (apiPath, actionPath, queryParams) = self.parse_request_path(requestPath)
            
            api = apis_by_path[apiPath]
            if actionPath is None:
                responseObj = api.get(queryParams)
            else:
                responseObj = api.getAction(actionPath, queryParams)
            self.check_response_obj(responseObj)
            
            self.send_response(200)
            self.send_cors_headers()
            self.end_headers()

            self.write_json(responseObj)
        except Exception as error:
            self.send_error_response(error)

    def do_POST(self):
        print(f"{datestamp()} Server handling POST request to {self.path}")
        try:
            requestPath = self.assure_no_trailing_slash(self.path)
            (apiPath, actionPath, queryParams) = self.parse_request_path(requestPath)

            length = int(self.headers['content-length'])
            data = self.rfile.read(length)
            dataDict = json.loads(data)
            
            api = apis_by_path[apiPath]
            if actionPath is None:
                responseObj = api.post(queryParams, dataDict)
            else:
                responseObj = api.postAction(actionPath, queryParams, dataDict)
            self.check_response_obj(responseObj)

            self.send_response(200)
            self.send_cors_headers()
            self.end_headers()

            self.write_json(responseObj)
        except Exception as error:
            self.send_error_response(error)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    def assure_no_trailing_slash(self, path):
        if path[-1] == "/":
            path = path[:-1]
        return path

    def parse_request_path(self, requestPath):
        requestPath = requestPath[len(DIRECTORY):]
        parseResult = parse.urlsplit(requestPath)
        try:
            noActionSlash = False
            actionSlashIdx = parseResult.path.index("/", 1)
        except ValueError:
            noActionSlash = True
        
        if noActionSlash:
            apiPath = parseResult.path
            actionPath = None
        else:
            apiPath = parseResult.path[0:actionSlashIdx]
            actionPath = parseResult.path[actionSlashIdx:]
        
        if parseResult.query != "":
            joinedQueryDict = parse.parse_qs(parseResult.query)
            queryParams = {
                actionKey: actionVal
                for (queryKey, queryVal) in joinedQueryDict.items()
                for actionKey in (
                    [queryKey]
                    if queryKey[-2:] != "[]"
                    else [queryKey[:-2]]
                )
                for actionVal in (
                    [queryVal[0]]
                    if queryKey[-2:] != "[]"
                    else [queryVal]
                    if queryKey[-1] != "]"
                    else self.raise_bad_query_string(queryKey, queryVal)
                )
            }
        else:
            queryParams = dict()
        return (apiPath, actionPath, queryParams)

    def raise_bad_query_string(self, queryKey, queryVal):
        raise ValueError(f"Invalid query parameter {queryKey}={queryVal}")

    def check_response_obj(self, responseObj):
        assert type(responseObj) in (dict, list, str, type(None)), "A ServerApi returned an invalid response object type"

    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "*")
        self.send_header("Access-Control-Allow-Headers", "*")

    def write_json(self, jsonDict):
        jsonBytes = bytes(json.dumps(jsonDict), "utf-8")
        self.wfile.write(jsonBytes)

    def send_error_response(self, error):
        errorStr = f"{type(error).__name__}: {str(error)}"
        print(traceback.format_exc())
        self.send_response(500)
        self.send_cors_headers()
        self.end_headers()
        self.write_json({'error': errorStr})


if __name__ == "__main__":
    # allow address from last instance to free itself
    # (when restarting in debug mode)
    from time import sleep
    sleep(0.6)

    with HTTPServer((HOSTNAME, PORT), ServerHandler) as server:
        print("Server started sucessfully!")
        print(f"Access at http://{HOSTNAME}:{PORT}{DIRECTORY}")

        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass # to avoid a nasty traceback

    print("Server stopped")
