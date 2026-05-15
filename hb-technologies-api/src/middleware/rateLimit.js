const rateLimit = require("express-rate-limit");

/**
 * Rate limiter for consultation submissions
 * Limits to 3 submissions per IP per hour
 */
const consultationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per windowMs
  message: "Too many consultation submissions from this IP. Please try again in an hour.",
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skip: (_req) => {
    // Don't rate limit in development
    return process.env.NODE_ENV !== "production";
  },
});

module.exports = { consultationRateLimiter };
