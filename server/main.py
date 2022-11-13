from http.server import SimpleHTTPRequestHandler, HTTPServer
import subprocess

HOSTNAME = "localhost"
PORT = 3001


class ServerHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        print(f"Server got GET request to {self.path}")

        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

        self.wfile.write(bytes("GET succeeded", "utf8"))

    def do_POST(self):
        print(f"Server got POST request to {self.path}")
        length = int(self.headers['content-length'])
        print("Data:")
        print(self.rfile.read(length))

        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

        self.wfile.write(bytes("POST succeeded", "utf8"))

    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "*")
        self.send_header("Access-Control-Allow-Headers", "*")


if __name__ == "__main__":
    with HTTPServer((HOSTNAME, PORT), ServerHandler) as server:
        print("Server started sucessfully!")
        print("Access at http://{}:{}".format(HOSTNAME, PORT))

        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass # to avoid a nasty traceback

    print("Server stopped")
