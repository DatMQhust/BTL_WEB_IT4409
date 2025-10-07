// A middleware to log request method, URL, status code, and response time.
const requestLogger = (req, res, next) => {
  const start = Date.now();
  console.log(`[Test Middleware] ${req.method} ${req.originalUrl} - start`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[Test Middleware] ${req.method} ${req.originalUrl} - ${res.statusCode} ${res.statusMessage || ''} - ${duration}ms`
    );
  });

  next();
};

module.exports = {
  requestLogger,
};
