from http.server import SimpleHTTPRequestHandler, HTTPServer
import json
import traceback
from urllib import parse

from page_apis import apis_by_path

HOSTNAME = "localhost"
PORT = 3001


class ServerHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        print(f"Server handling GET request to {self.path}")
        try:
            requestPath = self.assure_no_trailing_slash(self.path)
            (apiPath, actionPath, queryParams) = self.parse_request_path(requestPath)
            
            api = apis_by_path[apiPath]
            if actionPath is None:
                responseDict = api.get(queryParams)
            else:
                responseDict = api.getAction(actionPath, queryParams)
            assert type(responseDict) is dict, "Returned `responseDict` was not a dict"
            
            self.send_response(200)
            self.send_cors_headers()
            self.end_headers()

            self.write_json(responseDict)
        except Exception as error:
            self.send_error_response(error)

    def do_POST(self):
        print(f"Server handling POST request to {self.path}")
        try:
            requestPath = self.assure_no_trailing_slash(self.path)
            (apiPath, actionPath, queryParams) = self.parse_request_path(requestPath)

            length = int(self.headers['content-length'])
            data = self.rfile.read(length)
            dataDict = json.loads(data)
            
            api = apis_by_path[apiPath]
            if actionPath is None:
                responseDict = api.post(queryParams, dataDict)
            else:
                responseDict = api.postAction(actionPath, queryParams, dataDict)
            assert responseDict is None or type(responseDict) is dict, "Returned `responseDict` was not a dict or None"

            self.send_response(200)
            self.send_cors_headers()
            self.end_headers()

            self.write_json(responseDict)
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
        parseResult = parse.urlsplit(requestPath)
        try:
            noActionSlash = False
            actionSlashIdx = parseResult.path.index("/", 1)
        except ValueError:
            noActionSlash = True
        
        if noActionSlash:
            apiPath = parseResult.path
            actionPath = None
            queryParams = None
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
                queryParams = None
        return (apiPath, actionPath, queryParams)

    def raise_bad_query_string(self, queryKey, queryVal):
        raise ValueError(f"Invalid query parameter {queryKey}={queryVal}")

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
    with HTTPServer((HOSTNAME, PORT), ServerHandler) as server:
        print("Server started sucessfully!")
        print("Access at http://{}:{}".format(HOSTNAME, PORT))

        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass # to avoid a nasty traceback

    print("Server stopped")
