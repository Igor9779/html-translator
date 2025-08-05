console.log('🔀 setupProxy.js подключён и выполняется');
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/translate',
    createProxyMiddleware({
      target: 'https://libretranslate.de',
      changeOrigin: true,
      secure: true,
      // Переписываем путь /api/translate → /translate
      pathRewrite: {
        '^/api/translate': '/translate'
      },
      // Следовать редиректам, если они есть
      followRedirects: true,
      // (Опционально) логировать proxy-запросы
      onProxyReq(proxyReq, req, res) {
        console.log(`[Proxy] ${req.method} ${req.url} → ${proxyReq.protocol}//${proxyReq.getHeader('host')}${proxyReq.path}`);
      }
    })
  );
};

