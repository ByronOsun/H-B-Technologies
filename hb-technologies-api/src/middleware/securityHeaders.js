/**
 * Security Headers Middleware
 * Applies recommended security headers for web applications
 */

function securityHeadersMiddleware(req, res, next) {
  // Strict Transport Security (HSTS)
  // Tells browsers to only communicate over HTTPS
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

  // X-Content-Type-Options
  // Prevents MIME sniffing attacks
  res.setHeader("X-Content-Type-Options", "nosniff");

  // X-Frame-Options
  // Prevents clickjacking attacks
  res.setHeader("X-Frame-Options", "DENY");

  // X-XSS-Protection
  // Legacy protection for older browsers
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Referrer-Policy
  // Controls how much referrer information is shared
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions-Policy (formerly Feature-Policy)
  // Controls which browser features can be used
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), magnetometer=(), gyroscope=()"
  );

  // Content-Security-Policy (CSP)
  // Prevents injection attacks
  const csp =
    "default-src 'self'; " +
    "script-src 'self'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self'; " +
    "connect-src 'self'; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'";
  res.setHeader("Content-Security-Policy", csp);

  next();
}

module.exports = { securityHeadersMiddleware };
