const http = require('http');
const fs = require('fs');
const path = require('path');
const { getChaptersData, getProjectRoot } = require('./parser');

const PORT = process.env.PORT || 3333;

const server = http.createServer((req, res) => {
  // CORS & encoding
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // Endpoint API: Obtener datos procesados de todos los capítulos
  if (url.pathname === '/api/chapters') {
    try {
      const data = getChaptersData();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(data));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // Servir frontend index.html
  if (url.pathname === '/' || url.pathname === '/index.html') {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(indexPath).pipe(res);
      return;
    }
  }

  // Servir archivos estáticos dentro de public/
  const safePath = path.normalize(path.join(__dirname, 'public', url.pathname));
  if (safePath.startsWith(path.join(__dirname, 'public')) && fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
    const ext = path.extname(safePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.jpg': 'image/jpeg'
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(safePath).pipe(res);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('404 Not Found');
});

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Extramuros Outliner (Corkboard & Escaleta) activo:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`==================================================\n`);
});
