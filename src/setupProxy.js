const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://ahm.inspirasienergiprimanusa.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
      secure: false,
      onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('Origin', 'https://ahm.inspirasienergiprimanusa.com');
      },
    })
  );
};