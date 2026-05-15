const fs = require("fs");
const path = require("path");

const { supabaseAdmin } = require("../config/supabase");

const LOG_DIR = path.join(__dirname, "../../logs");
const AUDIT_TABLE = "audit_logs";

// Ensure logs directory exists
function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function getLogFile(type) {
  ensureLogDir();
  const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  return path.join(LOG_DIR, `${type}-${date}.log`);
}

function formatLogEntry(level, message, metadata = {}) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...metadata,
  });
}

function persistAuditLog(level, message, category, metadata = {}) {
  if (!supabaseAdmin) return;

  void supabaseAdmin
    .from(AUDIT_TABLE)
    .insert({
      level,
      message,
      category,
      metadata,
    })
    .catch(() => {
      // Logging must never break the request flow.
    });
}

/**
 * Log email sending events
 * @param {string} type - 'sent', 'failed', 'retry'
 * @param {string} recipientEmail - Email recipient
 * @param {Object} metadata - Additional context
 */
function logEmailEvent(type, recipientEmail, metadata = {}) {
  ensureLogDir();
  const logFile = getLogFile("email");
  const entry = formatLogEntry("INFO", `Email ${type}`, {
    recipient: recipientEmail,
    ...metadata,
  });

  fs.appendFileSync(logFile, entry + "\n");
  persistAuditLog("INFO", `Email ${type}`, "email", {
    recipient: recipientEmail,
    ...metadata,
  });
}

/**
 * Log API errors
 * @param {string} endpoint - API endpoint
 * @param {Error} error - Error object
 * @param {Object} metadata - Additional context
 */
function logApiError(endpoint, error, metadata = {}) {
  ensureLogDir();
  const logFile = getLogFile("api-errors");
  const entry = formatLogEntry("ERROR", `API Error: ${endpoint}`, {
    error: error.message,
    stack: error.stack,
    ...metadata,
  });

  fs.appendFileSync(logFile, entry + "\n");
  persistAuditLog("ERROR", `API Error: ${endpoint}`, "api-error", {
    error: error.message,
    stack: error.stack,
    ...metadata,
  });
}

/**
 * Log consultation events
 * @param {string} action - 'submitted', 'processed', 'failed'
 * @param {Object} consultation - Consultation data
 * @param {Object} metadata - Additional context
 */
function logConsultationEvent(action, consultation, metadata = {}) {
  ensureLogDir();
  const logFile = getLogFile("consultations");
  const entry = formatLogEntry("INFO", `Consultation ${action}`, {
    email: consultation.email,
    service: consultation.service,
    source: consultation.source,
    ...metadata,
  });

  fs.appendFileSync(logFile, entry + "\n");
  persistAuditLog("INFO", `Consultation ${action}`, "consultation", {
    email: consultation.email,
    service: consultation.service,
    source: consultation.source,
    ...metadata,
  });
}

/**
 * Log security events (rate limit, validation failures, etc.)
 * @param {string} event - Event type
 * @param {string} ip - Client IP
 * @param {Object} metadata - Additional context
 */
function logSecurityEvent(event, ip, metadata = {}) {
  ensureLogDir();
  const logFile = getLogFile("security");
  const entry = formatLogEntry("WARN", `Security Event: ${event}`, {
    ip,
    ...metadata,
  });

  fs.appendFileSync(logFile, entry + "\n");
  persistAuditLog("WARN", `Security Event: ${event}`, "security", {
    ip,
    ...metadata,
  });
}

function logRequestEvent(req, res, durationMs) {
  ensureLogDir();
  const logFile = getLogFile("requests");
  const entry = formatLogEntry("INFO", `${req.method} ${req.originalUrl}`, {
    requestId: req.id,
    statusCode: res.statusCode,
    durationMs,
    ip: req.ip,
  });

  fs.appendFileSync(logFile, entry + "\n");
  persistAuditLog("INFO", `${req.method} ${req.originalUrl}`, "request", {
    requestId: req.id,
    statusCode: res.statusCode,
    durationMs,
    ip: req.ip,
    method: req.method,
    path: req.originalUrl,
  });
}

module.exports = {
  logEmailEvent,
  logApiError,
  logConsultationEvent,
  logSecurityEvent,
  logRequestEvent,
};
