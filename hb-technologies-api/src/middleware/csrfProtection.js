const { env } = require("../config/env");

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET;

function matchesAllowedOrigin(origin) {
  if (!origin) return false;
  return env.corsOrigins.includes(origin);
}

function csrfProtection(req, res, next) {
  if (SAFE_METHODS.has(req.method)) return next();

  // Trust server-to-server requests from our own Next.js proxy.
  if (INTERNAL_SECRET && req.headers["x-internal-secret"] === INTERNAL_SECRET) {
    return next();
  }

  // For bearer-token APIs, CSRF is mitigated primarily by not relying on cookies.
  // This middleware enforces Origin/Referer validation for unsafe methods.
  const origin = req.headers.origin;
  const referer = req.headers.referer;

  // In production, require an allowed origin.
  if (env.isProd) {
    const ok = matchesAllowedOrigin(origin) ||
      (typeof referer === "string" &&
        env.corsOrigins.some((o) => referer.startsWith(o)));

    if (!ok) {
      return res.status(403).json({
        error: "CSRF_BLOCKED",
        message: "Request origin is not allowed.",
        requestId: req.id,
      });
    }
  }

  return next();
}

module.exports = { csrfProtection };
