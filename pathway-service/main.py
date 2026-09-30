from http.server import BaseHTTPRequestHandler, HTTPServer
import json

class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        event = json.loads(self.rfile.read(length) or '{}')
        normalized = {'event': event.get('event', 'evidence.received'), 'media_id': event.get('media_id'), 'project_id': event.get('project_id'), 'normalized': True}
        body = json.dumps(normalized).encode()
        self.send_response(200); self.send_header('Content-Type', 'application/json'); self.send_header('Content-Length', str(len(body))); self.end_headers(); self.wfile.write(body)

if __name__ == '__main__':
    print('GroundTruth Pathway-compatible normalizer listening on :8090')
    HTTPServer(('0.0.0.0', 8090), Handler).serve_forever()
