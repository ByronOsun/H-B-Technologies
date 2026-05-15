/**
 * Input sanitization middleware
 * Removes XSS vulnerabilities and cleans data
 */

function sanitizeString(str) {
  if (typeof str !== "string") return str;

  // Remove null bytes
  str = str.replace(/\0/g, "");

  // Trim whitespace
  str = str.trim();

  // Remove control characters except newlines/tabs
  // eslint-disable-next-line no-control-regex
  str = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/gu, "");

  return str;
}

function sanitizeInput(data) {
  const sanitized = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeInput(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

function sanitizeMiddleware(req, _res, next) {
  if (req.body) {
    req.body = sanitizeInput(req.body);
  }
  if (req.query) {
    req.query = sanitizeInput(req.query);
  }
  if (req.params) {
    req.params = sanitizeInput(req.params);
  }
  next();
}

module.exports = { sanitizeMiddleware, sanitizeString };
