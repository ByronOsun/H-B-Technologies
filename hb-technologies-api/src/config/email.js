const nodemailer = require("nodemailer");
const { env } = require("./env");
const { logEmailEvent, logApiError } = require("../utils/logger");
const dns = require("dns");

const DEFAULT_SMTP_TIMEOUT_MS = 10000;

let emailTransporter = null;

function hasSmtpConfig() {
  return Boolean(env.EMAIL_HOST && env.EMAIL_PORT && env.EMAIL_USER && env.EMAIL_PASS);
}

function createEmailTransporter(port = env.EMAIL_PORT) {
  if (!hasSmtpConfig()) {
    logEmailEvent("failed", env.EMAIL_USER || "unknown", {
      error: "Email configuration incomplete. Email notifications disabled.",
    });
    return null;
  }

  try {
    const numericPort = parseInt(port, 10);
    const transportOptions = {
      host: env.EMAIL_HOST,
      port: numericPort,
      secure: numericPort === 465,
      requireTLS: numericPort !== 465,
      connectionTimeout: Number(process.env.EMAIL_CONNECTION_TIMEOUT_MS || DEFAULT_SMTP_TIMEOUT_MS),
      greetingTimeout: Number(process.env.EMAIL_GREETING_TIMEOUT_MS || DEFAULT_SMTP_TIMEOUT_MS),
      socketTimeout: Number(process.env.EMAIL_SOCKET_TIMEOUT_MS || DEFAULT_SMTP_TIMEOUT_MS),
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    };

    // Optionally force IPv4 DNS lookups when environment lacks IPv6
    if (String(process.env.EMAIL_FORCE_IPV4 || "false").toLowerCase() === "true") {
      transportOptions.lookup = (hostname, options, callback) => {
        return dns.lookup(hostname, { family: 4 }, callback);
      };
    }

    const transport = nodemailer.createTransport(transportOptions);

    // Verify transporter connectivity (non-blocking, but useful for diagnostics)
    transport
      .verify()
      .then(() => {
        logEmailEvent("sent", env.EMAIL_USER, { info: "SMTP transporter verified" });
      })
      .catch((err) => {
        logEmailEvent("failed", env.EMAIL_USER, { error: `Transport verify failed: ${err.message}` });
      });

    return transport;
  } catch (err) {
    logApiError("email.createTransporter", err, { host: env.EMAIL_HOST });
    return null;
  }
}

function getEmailTransporter() {
  if (!emailTransporter) {
    emailTransporter = createEmailTransporter();
  }
  return emailTransporter;
}

function buildFallbackPorts() {
  const primaryPort = String(env.EMAIL_PORT || "587");
  const fallbackPorts = [primaryPort];

  if (primaryPort === "587") {
    fallbackPorts.push("465");
  }

  return [...new Set(fallbackPorts)];
}

/**
 * Send consultation notification email
 * @param {Object} consultation - Consultation data
 * @param {string} consultation.name - Full name
 * @param {string} consultation.email - Requester email
 * @param {string} consultation.phone - Phone number
 * @param {string} consultation.company - Company name
 * @param {string} consultation.service - Service interested in
 * @param {string} consultation.message - Message
 * @param {string} [consultation.source] - Source (contact or book-consultation)
 * @param {string} [clientIp] - Client IP for audit
 * @returns {Promise<Object>} Send result
 */
async function sendConsultationEmail(consultation, clientIp = null) {
  const htmlContent = buildConsultationEmailHtml(consultation, clientIp);
  const textContent = buildConsultationEmailText(consultation, clientIp);

  const baseTransporter = getEmailTransporter();

  if (!baseTransporter) {
    const errorMsg = "Email service not configured";
    logEmailEvent("failed", consultation.email, { error: errorMsg });
    return {
      sent: false,
      error: errorMsg,
    };
  }

  const attemptedPorts = buildFallbackPorts();
  let lastError = null;

  for (const port of attemptedPorts) {
    const transporter = port === String(env.EMAIL_PORT) ? baseTransporter : createEmailTransporter(port);

    if (!transporter) {
      continue;
    }

    try {
      const result = await transporter.sendMail({
        from: env.EMAIL_FROM || env.EMAIL_USER,
        to: "htechnob@gmail.com",
        replyTo: consultation.email,
        subject: `New Consultation Request – H&B Technologies`,
        html: htmlContent,
        text: textContent,
      });

      logEmailEvent("sent", consultation.email, {
        messageId: result.messageId,
        smtpPort: port,
      });

      return {
        sent: true,
        messageId: result.messageId,
      };
    } catch (error) {
      lastError = error;
      logEmailEvent("failed", consultation.email, {
        error: error.message,
        smtpPort: port,
      });

      // Retry once on the alternate SMTP port when the first connection times out or fails to connect.
      const retryable =
        /timeout|ETIMEDOUT|ENETUNREACH|ECONNRESET|ECONNREFUSED/i.test(error.message || "");

      if (retryable && port !== "465" && attemptedPorts.includes("465")) {
        continue;
      }

      // If the error was non-retryable, no point trying more ports.
      if (!retryable) {
        break;
      }
    }
  }

  logApiError("email.sendConsultationEmail", lastError || new Error("Unknown email failure"), {
    to: "htechnob@gmail.com",
    from: env.EMAIL_USER,
    attemptedPorts,
  });

  return {
    sent: false,
    error: lastError ? lastError.message : "Email send failed",
  };
}

async function sendDiagnosticEmail() {
  const transporter = getEmailTransporter();

  if (!transporter) {
    const errorMsg = "Email service not configured";
    logEmailEvent("failed", env.EMAIL_USER || "unknown", { error: errorMsg, diagnostic: true });
    return {
      sent: false,
      error: errorMsg,
    };
  }

  const subject = "H&B Technologies Email Diagnostic Test";
  const text = [
    "This is a diagnostic email from the H&B Technologies API.",
    "If you received this, the Gmail SMTP path is working.",
    `Timestamp: ${new Date().toISOString()}`,
  ].join("\n");

  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
        <h2>Email Diagnostic Test</h2>
        <p>This is a diagnostic email from the H&amp;B Technologies API.</p>
        <p>If you received this, the Gmail SMTP path is working.</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      </body>
    </html>
  `;

  try {
    const result = await transporter.sendMail({
      from: env.EMAIL_FROM || env.EMAIL_USER,
      to: env.EMAIL_USER,
      subject,
      text,
      html,
    });

    logEmailEvent("sent", env.EMAIL_USER, {
      messageId: result.messageId,
      diagnostic: true,
    });

    return {
      sent: true,
      messageId: result.messageId,
    };
  } catch (error) {
    logEmailEvent("failed", env.EMAIL_USER, {
      error: error.message,
      diagnostic: true,
    });
    logApiError("email.sendDiagnosticEmail", error, {
      to: env.EMAIL_USER,
      from: env.EMAIL_FROM || env.EMAIL_USER,
      diagnostic: true,
    });

    return {
      sent: false,
      error: error.message,
    };
  }
}

function buildConsultationEmailHtml(consultation, clientIp) {
  const timestamp = new Date().toLocaleString("en-KE", {
    timeZone: "Africa/Nairobi",
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #f8f9fa; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
    .section { margin-bottom: 20px; }
    .label { font-weight: 700; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
    .value { color: #333; margin-bottom: 16px; }
    .footer { color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0; color: #222;">New Consultation Request</h2>
      <p style="margin: 8px 0 0 0; color: #666; font-size: 14px;">Submitted at ${timestamp}</p>
    </div>

    <div class="section">
      <div class="label">Full Name</div>
      <div class="value">${escapeHtml(consultation.name)}</div>

      <div class="label">Email</div>
      <div class="value"><a href="mailto:${escapeHtml(consultation.email)}">${escapeHtml(consultation.email)}</a></div>

      ${consultation.phone ? `
      <div class="label">Phone</div>
      <div class="value"><a href="tel:${escapeHtml(consultation.phone)}">${escapeHtml(consultation.phone)}</a></div>
      ` : ""}

      ${consultation.company ? `
      <div class="label">Company / Organization</div>
      <div class="value">${escapeHtml(consultation.company)}</div>
      ` : ""}

      <div class="label">Service Interested In</div>
      <div class="value">${escapeHtml(consultation.service)}</div>

      <div class="label">Message</div>
      <div class="value" style="white-space: pre-wrap; word-break: break-word;">${escapeHtml(consultation.message)}</div>

      <div class="label">Source</div>
      <div class="value">${escapeHtml(consultation.source || "contact")}</div>
    </div>

    ${clientIp ? `
    <div class="footer">
      <p><strong>Client IP:</strong> ${escapeHtml(clientIp)}</p>
    </div>
    ` : ""}

    <div class="footer">
      <p>This is an automated notification from H&B Technologies contact system.</p>
    </div>
  </div>
</body>
</html>
  `;
}

function buildConsultationEmailText(consultation, clientIp) {
  const timestamp = new Date().toLocaleString("en-KE", {
    timeZone: "Africa/Nairobi",
  });

  let text = `NEW CONSULTATION REQUEST
Submitted: ${timestamp}

FULL NAME
${consultation.name}

EMAIL
${consultation.email}

`;

  if (consultation.phone) {
    text += `PHONE
${consultation.phone}

`;
  }

  if (consultation.company) {
    text += `COMPANY / ORGANIZATION
${consultation.company}

`;
  }

  text += `SERVICE INTERESTED IN
${consultation.service}

MESSAGE
${consultation.message}

SOURCE
${consultation.source || "contact"}

`;

  if (clientIp) {
    text += `CLIENT IP
${clientIp}

`;
  }

  text += `---
This is an automated notification from H&B Technologies contact system.
`;

  return text;
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

module.exports = {
  sendConsultationEmail,
  sendDiagnosticEmail,
  getEmailTransporter,
};
