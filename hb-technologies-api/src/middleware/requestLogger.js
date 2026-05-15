const { env } = require("../config/env");
const { logRequestEvent } = require("../utils/logger");

function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const ms = Date.now() - start;

    logRequestEvent(req, res, ms);

    if (!env.isProd) {
      console.log(
        `${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms (id=${req.id})`
      );
    }
  });

  next();
}

module.exports = { requestLogger };
