const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");
const { env } = require("../config/env");

/**
 * Rate limiter for consultation submissions
 * Configurable limits per IP based on environment variables
 */
const consultationRateLimiter = rateLimit({
  windowMs: env.consultationRateLimitWindow, // 15 minutes (900000 ms)
  max: env.consultationRateLimitMax, // Default: 5 requests per window
  message: "Too many consultation submissions from this IP. Please try again later.",
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (_req, res, options) => {
    res.status(429).json({
      status: "error",
      code: "RATE_LIMIT_EXCEEDED",
      message: options.message,
      retryAfter: Math.ceil(options.windowMs / 1000),
      requestId: _req.id,
    });
  },
  skip: (_req) => {
    // Don't rate limit in development
    return env.NODE_ENV === "development";
  },
  keyGenerator: ipKeyGenerator,
});

module.exports = { consultationRateLimiter };

