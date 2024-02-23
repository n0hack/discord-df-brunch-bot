import http from 'http';

/**
 * koyeb 클라우드 무중단 배포를 위한 체크 함수
 */
export const healthCheck = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('OK');
  res.end();
});
