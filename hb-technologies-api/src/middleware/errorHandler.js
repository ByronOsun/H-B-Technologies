const { env } = require("../config/env");

function errorHandler(err, req, res, next) {
  // Log the error server-side (keep client response generic).
  if (env.isProd) {
    console.error(`[api error] id=${req.id} message=${err?.message || err}`);
  } else {
    console.error(err);
  }

  if (res.headersSent) return next(err);

  return res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred.",
    requestId: req.id,
  });
}

module.exports = { errorHandler };
