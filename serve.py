#!/usr/bin/env python3
"""Static file server with HTTP Range support (needed for large MP4 playback)."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5173

class RangeRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()
        if not os.path.exists(path) or not os.path.isfile(path):
            self.send_error(404, "File not found")
            return None
        ctype = self.guess_type(path)
        try:
            f = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None
        fs = os.fstat(f.fileno())
        size = fs.st_size
        range_header = self.headers.get("Range")
        if range_header:
            # bytes=start-end
            try:
                units, rng = range_header.strip().split("=", 1)
                if units != "bytes":
                    raise ValueError
                start_s, end_s = rng.split("-", 1)
                start = int(start_s) if start_s else 0
                end = int(end_s) if end_s else size - 1
                end = min(end, size - 1)
                if start > end or start >= size:
                    self.send_error(416, "Requested Range Not Satisfiable")
                    f.close()
                    return None
                length = end - start + 1
                self.send_response(206)
                self.send_header("Content-Type", ctype)
                self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
                self.send_header("Content-Length", str(length))
                self.send_header("Last-Modified", self.date_time_string(fs.st_mtime))
                self.end_headers()
                f.seek(start)
                # wrap to limit read length
                class LimitedFile:
                    def __init__(self, fh, remaining):
                        self.fh = fh
                        self.remaining = remaining
                    def read(self, n=-1):
                        if self.remaining <= 0:
                            return b""
                        if n is None or n < 0:
                            n = self.remaining
                        n = min(n, self.remaining)
                        data = self.fh.read(n)
                        self.remaining -= len(data)
                        return data
                    def close(self):
                        self.fh.close()
                return LimitedFile(f, length)
            except Exception:
                f.seek(0)
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(size))
        self.send_header("Last-Modified", self.date_time_string(fs.st_mtime))
        self.end_headers()
        return f

if __name__ == "__main__":
    httpd = ThreadingHTTPServer(("127.0.0.1", PORT), RangeRequestHandler)
    print(f"Serving {ROOT} on http://127.0.0.1:{PORT} (Range enabled)", flush=True)
    httpd.serve_forever()
