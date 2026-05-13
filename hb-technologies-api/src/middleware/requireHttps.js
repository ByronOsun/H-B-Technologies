const { env } = require("../config/env");

function requireHttps(req, res, next) {
  if (!env.isProd) return next();

  const forwardedProto = String(req.headers["x-forwarded-proto"] || "");
  const isSecure = req.secure || forwardedProto === "https";

  if (!isSecure) {
    return res.status(403).json({
      error: "HTTPS_REQUIRED",
      message: "HTTPS is required.",
      requestId: req.id,
    });
  }

  return next();
}

module.exports = { requireHttps };
