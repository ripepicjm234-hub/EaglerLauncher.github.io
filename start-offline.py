from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import threading
import webbrowser


site_root = Path(__file__).resolve().parent
handler = partial(SimpleHTTPRequestHandler, directory=str(site_root))
server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
url = f"http://127.0.0.1:{server.server_port}/"

print(f"Serving Eagler Launcher at {url}")
print("Press Ctrl+C to stop the local server.")
threading.Timer(0.5, webbrowser.open, args=(url,)).start()

try:
    server.serve_forever()
except KeyboardInterrupt:
    print("\nStopping the local server.")
finally:
    server.server_close()
