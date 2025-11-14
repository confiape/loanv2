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
    target: 'https://dev.confiape.org',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    agent: keepaliveAgent,
    headers: {
      Connection: 'keep-alive',
    },
    onProxyReq: function (proxyReq, req, res) {
      console.log(`[${new Date().toISOString()}] → Proxying: ${req.method} ${req.url}`);
    },
    onProxyRes: function (proxyRes, req, res) {
      console.log(`[${new Date().toISOString()}] ← Response: ${proxyRes.statusCode}`);
    },
    onError: function (err, req, res) {
      console.error(`[${new Date().toISOString()}] ✗ Error: ${err.code} - ${req.url}`);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Proxy timeout', code: err.code }));
      }
    },
  },
  '/ws/hub/user-state': {
    target: 'https://dev.confiape.org',
    secure: false,
    changeOrigin: true,
    ws: true,
    logLevel: 'debug',
    agent: keepaliveAgent,
  },
};

module.exports = PROXY_CONFIG;
