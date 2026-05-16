/**
 * Email Service Module
 * Handles secure transactional email sending via Nodemailer
 *
 * Features:
 * - Secure TLS configuration
 * - HTML + plain-text templates
 * - Async/await support
 * - Error logging
 * - Meaningful error messages
 */

const nodemailer = require('nodemailer');
const { logger } = require('../utils/logger');

let transporter = null;

/**
 * Initialize email transporter with environment variables
 * @returns {Object} Nodemailer transporter instance
 */
function initializeTransporter() {
  if (transporter) return transporter;

  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM } =
    process.env;

  // Validation
  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
    logger.warn('email', 'Email configuration incomplete - notifications disabled', {
      hasHost: !!EMAIL_HOST,
      hasPort: !!EMAIL_PORT,
      hasUser: !!EMAIL_USER,
      hasPass: !!EMAIL_PASS,
    });
    return null;
  }

  try {
    transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: parseInt(EMAIL_PORT, 10),
      secure: EMAIL_PORT == 465, // TLS for 587, SSL for 465
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
      // Production pool settings
      pool: {
        maxConnections: 3,
        maxMessages: 100,
        rateDelta: 2000, // 2 seconds between messages
        rateLimit: 5, // 5 messages per rateDelta
      },
    });

    logger.info('email', 'Email transporter initialized successfully', {
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      user: EMAIL_USER,
    });

    return transporter;
  } catch (error) {
    logger.error('email', 'Failed to initialize email transporter', {
      error: error.message,
      host: EMAIL_HOST,
      port: EMAIL_PORT,
    });
    return null;
  }
}

/**
 * Send email via configured transporter
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML body
 * @param {string} options.text - Plain text body
 * @param {string} options.from - Sender email (optional)
 * @returns {Promise<Object>} Result object { sent, messageId, error }
 */
async function sendEmail({
  to,
  subject,
  html,
  text,
  from = process.env.EMAIL_FROM,
}) {
  // Validation
  if (!to || !subject || !html) {
    const error = 'Missing required email fields: to, subject, html';
    logger.error('email', error, { to, subject });
    throw new Error(error);
  }

  const transport = initializeTransporter();
  if (!transport) {
    const error = 'Email service not configured';
    logger.warn('email', error, {});
    return {
      sent: false,
      error,
      messageId: null,
    };
  }

  try {
    const result = await transport.sendMail({
      from,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Fallback to HTML stripped of tags
      replyTo: from,
    });

    logger.info('email', 'Email sent successfully', {
      to,
      subject,
      messageId: result.messageId,
    });

    return {
      sent: true,
      messageId: result.messageId,
      error: null,
    };
  } catch (error) {
    logger.error('email', 'Failed to send email', {
      to,
      subject,
      error: error.message,
      code: error.code,
    });

    return {
      sent: false,
      error: error.message,
      messageId: null,
    };
  }
}

/**
 * Build consultation confirmation email (HTML template)
 * @param {Object} consultation - Consultation data
 * @returns {Object} { subject, html, text }
 */
function buildConsultationEmailTemplate(consultation) {
  const {
    full_name,
    email,
    phone,
    company,
    service_interest,
    message,
    created_at,
  } = consultation;

  const submissionDate = new Date(created_at).toLocaleString('en-KE', {
    timeZone: 'Africa/Nairobi',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const subject = 'New Consultation Request – H&B Technologies';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #1a3a52 0%, #2c5aa0 100%);
      color: white;
      padding: 32px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .content {
      padding: 32px;
    }
    .section {
      margin-bottom: 24px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #1a3a52;
      margin-bottom: 12px;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 8px;
    }
    .field {
      margin-bottom: 16px;
    }
    .field-label {
      font-weight: 600;
      color: #2c5aa0;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }
    .field-value {
      margin-top: 4px;
      color: #555;
      font-size: 14px;
      word-break: break-word;
    }
    .divider {
      height: 1px;
      background-color: #e0e0e0;
      margin: 24px 0;
    }
    .message-box {
      background-color: #f9f9f9;
      border-left: 4px solid #2c5aa0;
      padding: 16px;
      margin-top: 12px;
      border-radius: 4px;
      font-style: italic;
      color: #555;
      font-size: 14px;
    }
    .footer {
      background-color: #f5f5f5;
      padding: 24px 32px;
      text-align: center;
      font-size: 12px;
      color: #999;
      border-top: 1px solid #e0e0e0;
    }
    .footer-text {
      margin: 8px 0;
    }
    .cta-note {
      background-color: #fffbf0;
      border: 1px solid #ffe4c4;
      padding: 16px;
      border-radius: 4px;
      margin-top: 24px;
      font-size: 13px;
      color: #8b6f47;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 New Consultation Request</h1>
    </div>
    
    <div class="content">
      <p>A new consultation request has been received. Details are below:</p>
      
      <div class="divider"></div>
      
      <div class="section">
        <div class="section-title">📋 Submission Details</div>
        
        <div class="field">
          <div class="field-label">Submitted At</div>
          <div class="field-value">${submissionDate}</div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">👤 Contact Information</div>
        
        <div class="field">
          <div class="field-label">Full Name</div>
          <div class="field-value">${escapeHtml(full_name)}</div>
        </div>
        
        <div class="field">
          <div class="field-label">Email</div>
          <div class="field-value">
            <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
          </div>
        </div>
        
        <div class="field">
          <div class="field-label">Phone</div>
          <div class="field-value">
            <a href="tel:${escapeHtml(phone.replace(/\s+/g, ''))}">${escapeHtml(phone)}</a>
          </div>
        </div>
        
        ${company ? `
        <div class="field">
          <div class="field-label">Company</div>
          <div class="field-value">${escapeHtml(company)}</div>
        </div>
        ` : ''}
      </div>
      
      <div class="section">
        <div class="section-title">💼 Service Interest</div>
        <div class="field-value">${escapeHtml(service_interest || 'Not specified')}</div>
      </div>
      
      <div class="section">
        <div class="section-title">💬 Message</div>
        <div class="message-box">
          ${escapeHtml(message).replace(/\n/g, '<br/>')}
        </div>
      </div>
      
      <div class="cta-note">
        <strong>Next Steps:</strong> Please follow up with the client within 24 hours via email or phone. Reference the submission time for internal tracking.
      </div>
    </div>
    
    <div class="footer">
      <div class="footer-text">H&B Technologies – Secure Engineering & AI Solutions</div>
      <div class="footer-text">This is an automated notification. Please do not reply to this email.</div>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
New Consultation Request – H&B Technologies

SUBMISSION DETAILS
Submitted: ${submissionDate}

CONTACT INFORMATION
Full Name: ${full_name}
Email: ${email}
Phone: ${phone}
${company ? `Company: ${company}\n` : ''}

SERVICE INTEREST
${service_interest || 'Not specified'}

MESSAGE
${message}

---
Next Steps: Please follow up with the client within 24 hours via email or phone.
H&B Technologies – Secure Engineering & AI Solutions
  `.trim();

  return { subject, html, text };
}

/**
 * Escape HTML special characters to prevent injection
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

module.exports = {
  sendEmail,
  buildConsultationEmailTemplate,
  initializeTransporter,
};
