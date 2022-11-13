from http.server import SimpleHTTPRequestHandler, HTTPServer
import json
import traceback

from page_apis import apis_by_path

HOSTNAME = "localhost"
PORT = 3001


class ServerHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        print(f"Server handling GET request to {self.path}")
        try:
            apiPath = self.assure_trailing_slash(self.path)
            api = apis_by_path[apiPath]
            responseDict = api.get()
            assert type(responseDict) is dict, "Returned `responseDict` was not a dict"
            
            self.send_response(200)
            self.send_cors_headers()
            self.end_headers()

            self.write_json(responseDict)
        except Exception as error:
            errorStr = f"{type(error)}: {str(error)}"
            print(traceback.format_exc())
            self.send_error(500, errorStr)
            self.send_cors_headers()
            self.end_headers()

    def do_POST(self):
        print(f"Server handling POST request to {self.path}")
        try:
            length = int(self.headers['content-length'])
            data = self.rfile.read(length)
            dataDict = json.loads(data)

            apiPath = self.assure_trailing_slash(self.path)
            api = apis_by_path[apiPath]
            responseDict = api.post(dataDict)
            assert type(responseDict) is dict, "Returned `responseDict` was not a dict"

            self.send_response(200)
            self.send_cors_headers()
            self.end_headers()

            self.write_json(responseDict)
        except Exception as error:
            errorStr = f"{type(error)}: {str(error)}"
            print(traceback.format_exc())
            self.send_error(500, errorStr)
            self.send_cors_headers()
            self.end_headers()

    def assure_trailing_slash(self, path):
        if path[-1] != "/":
            path += "/"
        return path

    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "*")
        self.send_header("Access-Control-Allow-Headers", "*")

    def write_json(self, jsonDict):
        jsonBytes = bytes(json.dumps(jsonDict))
        self.wfile.write(jsonBytes)


if __name__ == "__main__":
    with HTTPServer((HOSTNAME, PORT), ServerHandler) as server:
        print("Server started sucessfully!")
        print("Access at http://{}:{}".format(HOSTNAME, PORT))

        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass # to avoid a nasty traceback

    print("Server stopped")
