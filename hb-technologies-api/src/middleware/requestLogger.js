const { env } = require("../config/env");

function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const ms = Date.now() - start;

    if (!env.isProd) {
      console.log(
        `${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms (id=${req.id})`
      );
    }
  });

  next();
}

module.exports = { requestLogger };
