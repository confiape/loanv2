const https = require('https');

const keepaliveAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 30000,
  maxSockets: 50,
  maxFreeSockets: 10,
  timeout: 60000,
  family: 4,
  scheduling: 'fifo',
});

const PROXY_CONFIG = {
  '/api': {
    target: 'http://localhost:3001',  // Mock API server for E2E tests
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    onProxyReq: function (proxyReq, req, res) {
      console.log(`[${new Date().toISOString()}] → Proxying to Mock API: ${req.method} ${req.url}`);
    },
    onProxyRes: function (proxyRes, req, res) {
      console.log(`[${new Date().toISOString()}] ← Mock API Response: ${proxyRes.statusCode}`);
    },
    onError: function (err, req, res) {
      console.error(`[${new Date().toISOString()}] ✗ Mock API Error: ${err.code} - ${req.url}`);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Mock API error', code: err.code }));
      }
    },
  },
};

module.exports = PROXY_CONFIG;
