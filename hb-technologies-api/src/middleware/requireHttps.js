const { env } = require("../config/env");

function requireHttps(req, res, next) {
  if (!env.isProd) return next();

  const forwardedProto = String(req.headers["x-forwarded-proto"] || "");
  const isSecure = req.secure || forwardedProto === "https";

  if (!isSecure) {
    // Redirect to HTTPS version of the request with 308 Permanent Redirect
    const host = req.get("host") || "";
    const url = `https://${host}${req.originalUrl}`;
    return res.redirect(308, url);
  }

  return next();
}

module.exports = { requireHttps };
