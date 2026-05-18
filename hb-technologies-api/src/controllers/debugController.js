const { env } = require("../config/env");
const { sendDiagnosticEmail } = require("../config/email");

function requireEmailTestToken(req, res, next) {
  const token = String(req.headers["x-email-test-token"] || "").trim();

  if (!env.EMAIL_TEST_TOKEN) {
    return res.status(503).json({
      error: "EMAIL_TEST_NOT_CONFIGURED",
      message: "Set EMAIL_TEST_TOKEN in the API environment to enable diagnostic email testing.",
      requestId: req.id,
    });
  }

  if (!token || token !== env.EMAIL_TEST_TOKEN) {
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Invalid or missing email test token.",
      requestId: req.id,
    });
  }

  return next();
}

async function testEmail(req, res) {
  const result = await sendDiagnosticEmail();

  if (!result.sent) {
    return res.status(500).json({
      ok: false,
      error: "EMAIL_TEST_FAILED",
      message: result.error || "Diagnostic email failed.",
      requestId: req.id,
    });
  }

  return res.status(200).json({
    ok: true,
    message: "Diagnostic email sent successfully.",
    messageId: result.messageId || null,
    requestId: req.id,
  });
}

module.exports = {
  requireEmailTestToken,
  testEmail,
};
