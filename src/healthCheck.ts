import http from 'http';

export const healthCheck = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('OK');
  res.end();
});
