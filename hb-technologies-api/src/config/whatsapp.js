const { env } = require("./env");

const DEFAULT_API_VERSION = "v22.0";

function normalizePhoneNumber(value) {
  return String(value || "").replace(/\D/g, "");
}

function truncateText(value, maxLength) {
  const text = String(value || "");
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

function buildConsultationWhatsAppMessage(consultation, clientIp, requestId) {
  const lines = [
    "New consultation request",
    "",
    `Name: ${consultation.name || "-"}`,
    `Email: ${consultation.email || "-"}`,
    `Phone: ${consultation.phone || "-"}`,
    `Company: ${consultation.company || "-"}`,
    `Service: ${consultation.service || "-"}`,
    `Source: ${consultation.source || "contact"}`,
  ];

  if (requestId) {
    lines.push(`Request ID: ${requestId}`);
  }

  if (clientIp) {
    lines.push(`IP: ${clientIp}`);
  }

  lines.push("", "Message:");
  lines.push(truncateText(consultation.message || "", 1200));

  return lines.join("\n");
}

function isConfigured() {
  return Boolean(
    env.WHATSAPP_ACCESS_TOKEN &&
      env.WHATSAPP_PHONE_NUMBER_ID &&
      env.WHATSAPP_RECIPIENT_NUMBER
  );
}

async function sendConsultationWhatsAppNotification(
  consultation,
  clientIp = null,
  requestId = null
) {
  if (!isConfigured()) {
    return {
      sent: false,
      skipped: true,
      error: "WhatsApp service not configured",
    };
  }

  const recipient = normalizePhoneNumber(env.WHATSAPP_RECIPIENT_NUMBER);

  if (!recipient) {
    return {
      sent: false,
      skipped: true,
      error: "WhatsApp recipient number is invalid",
    };
  }

  const apiVersion = env.WHATSAPP_API_VERSION || DEFAULT_API_VERSION;
  const url = `https://graph.facebook.com/${apiVersion}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const messageBody = buildConsultationWhatsAppMessage(
    consultation,
    clientIp,
    requestId
  );
  const templateName = String(env.WHATSAPP_TEMPLATE_NAME || "").trim();

  const payload = templateName
    ? {
        messaging_product: "whatsapp",
        to: recipient,
        type: "template",
        template: {
          name: templateName,
          language: {
            code: String(env.WHATSAPP_TEMPLATE_LANGUAGE || "en_US"),
          },
          components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: truncateText(messageBody, 1024),
                },
              ],
            },
          ],
        },
      }
    : {
        messaging_product: "whatsapp",
        to: recipient,
        type: "text",
        text: {
          preview_url: false,
          body: messageBody,
        },
      };

  const response = await globalThis.fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      sent: false,
      error:
        data?.error?.message ||
        data?.error?.error_user_msg ||
        `WhatsApp API request failed with status ${response.status}`,
      response: data,
    };
  }

  return {
    sent: true,
    messageId: data?.messages?.[0]?.id || null,
    response: data,
  };
}

module.exports = {
  sendConsultationWhatsAppNotification,
};