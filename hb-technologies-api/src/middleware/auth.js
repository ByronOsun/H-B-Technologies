const jwt = require("jsonwebtoken");

const { env } = require("../config/env");

function requireAuth(req, res, next) {
  const header = String(req.headers.authorization || "");
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Missing bearer token.",
      requestId: req.id,
    });
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Invalid or expired token.",
      requestId: req.id,
    });
  }
}

module.exports = { requireAuth };
