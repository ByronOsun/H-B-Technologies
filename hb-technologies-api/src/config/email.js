const nodemailer = require("nodemailer");
const { env } = require("./env");

let emailTransporter = null;

function createEmailTransporter() {
  if (!env.EMAIL_HOST || !env.EMAIL_PORT || !env.EMAIL_USER || !env.EMAIL_PASS) {
    console.warn("Email configuration incomplete. Email notifications disabled.");
    return null;
  }

  return nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: parseInt(env.EMAIL_PORT, 10),
    secure: parseInt(env.EMAIL_PORT, 10) === 465, // true for 465, false for other ports
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });
}

function getEmailTransporter() {
  if (!emailTransporter) {
    emailTransporter = createEmailTransporter();
  }
  return emailTransporter;
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
  const transporter = getEmailTransporter();

  if (!transporter) {
    return {
      sent: false,
      error: "Email service not configured",
    };
  }

  const htmlContent = buildConsultationEmailHtml(consultation, clientIp);
  const textContent = buildConsultationEmailText(consultation, clientIp);

  try {
    const result = await transporter.sendMail({
      from: env.EMAIL_USER,
      to: "htechnob@gmail.com",
      replyTo: consultation.email,
      subject: `New Consultation Request – H&B Technologies`,
      html: htmlContent,
      text: textContent,
    });

    return {
      sent: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error("Failed to send consultation email:", error.message);
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
  getEmailTransporter,
};
