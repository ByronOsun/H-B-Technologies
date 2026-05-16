const { supabaseAdmin } = require("../config/supabase");
const { sendConsultationEmail } = require("../config/email");
const { sendConsultationWhatsAppNotification } = require("../config/whatsapp");
const {
  logEmailEvent,
  logWhatsAppEvent,
  logApiError,
  logConsultationEvent,
  logSecurityEvent,
} = require("../utils/logger");

const DUPLICATE_CHECK_WINDOW = 5 * 60 * 1000; // 5 minutes in milliseconds
const recentSubmissions = new Map(); // In-memory cache for duplicate detection

/**
 * Check if this is a duplicate submission
 * @param {string} email - Requester email
 * @param {string} ip - Client IP
 * @returns {boolean} True if duplicate detected
 */
function isDuplicateSubmission(email, ip) {
  const key = `${email}:${ip}`;
  const lastSubmission = recentSubmissions.get(key);

  if (lastSubmission && Date.now() - lastSubmission < DUPLICATE_CHECK_WINDOW) {
    return true;
  }

  // Record this submission
  recentSubmissions.set(key, Date.now());

  // Clean up old entries every 100 submissions
  if (recentSubmissions.size > 100) {
    const cutoff = Date.now() - DUPLICATE_CHECK_WINDOW;
    for (const [k, v] of recentSubmissions) {
      if (v < cutoff) {
        recentSubmissions.delete(k);
      }
    }
  }

  return false;
}

async function createConsultation(req, res) {
  const payload = req.validated.body;
  const clientIp = req.ip || req.connection.remoteAddress || "unknown";

  if (!supabaseAdmin) {
    logApiError("/consultation", new Error("Supabase not configured"), {
      ip: clientIp,
    });
    return res.status(503).json({
      error: "SUPABASE_NOT_CONFIGURED",
      message:
        "Supabase is not configured on the API. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      requestId: req.id,
    });
  }

  // Check for duplicate submissions
  if (isDuplicateSubmission(payload.email, clientIp)) {
    logSecurityEvent("duplicate_submission_attempt", clientIp, {
      email: payload.email,
      requestId: req.id,
    });

    return res.status(429).json({
      error: "DUPLICATE_SUBMISSION",
      message:
        "You have already submitted a consultation request recently. Please wait a few minutes before submitting again.",
      requestId: req.id,
    });
  }

  try {
    // Insert consultation into Supabase with initial tracking fields
    const { data, error } = await supabaseAdmin.from("consultations").insert({
      full_name: payload.name,
      email: payload.email,
      phone: payload.phone,
      company: payload.company,
      service_interest: payload.service,
      message: payload.message,
      source: payload.source,
      ip_address: clientIp,
      status: "new",
      email_sent: false,
    });

    if (error) {
      logApiError("/consultation", error, {
        email: payload.email,
        requestId: req.id,
      });

      return res.status(500).json({
        error: "SUPABASE_ERROR",
        message: error.message,
        requestId: req.id,
      });
    }

    logConsultationEvent("submitted", payload, {
      ip: clientIp,
      requestId: req.id,
    });

    // Send email notification (fire-and-forget, don't block response)
    sendConsultationEmail(
      {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        company: payload.company,
        service: payload.service,
        message: payload.message,
        source: payload.source,
      },
      clientIp
    )
      .then((result) => {
        if (result.sent) {
          logEmailEvent("sent", payload.email, {
            messageId: result.messageId,
            consultationId: data?.[0]?.id,
            requestId: req.id,
          });

          // Update Supabase with email send status
          supabaseAdmin
            .from("consultations")
            .update({
              email_sent: true,
              email_sent_at: new Date().toISOString(),
            })
            .eq("email", payload.email)
            .is("email_sent", false)
            .then(() => {
              // Email tracked successfully
            })
            .catch((error) => {
              logApiError("/consultation (email status update)", error, {
                email: payload.email,
              });
            });
        } else {
          logEmailEvent("failed", payload.email, {
            error: result.error,
            consultationId: data?.[0]?.id,
            requestId: req.id,
          });

          // Update Supabase with email error
          supabaseAdmin
            .from("consultations")
            .update({
              email_sent: false,
              email_error: result.error,
            })
            .eq("email", payload.email)
            .is("email_sent", false)
            .then(() => {
              // Error tracked successfully
            })
            .catch((error) => {
              logApiError("/consultation (email error update)", error, {
                email: payload.email,
              });
            });
        }
      })
      .catch((error) => {
        logApiError("/consultation (email notification)", error, {
          email: payload.email,
          requestId: req.id,
        });
        // Log but don't fail the submission
      });

    // Send WhatsApp notification to the business (fire-and-forget, don't block response)
    sendConsultationWhatsAppNotification(
      {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        company: payload.company,
        service: payload.service,
        message: payload.message,
        source: payload.source,
      },
      clientIp,
      req.id
    )
      .then((result) => {
        if (result.sent) {
          logWhatsAppEvent("sent", process.env.WHATSAPP_RECIPIENT_NUMBER || "", {
            messageId: result.messageId,
            consultationId: data?.[0]?.id,
            requestId: req.id,
          });
        } else if (!result.skipped) {
          logWhatsAppEvent("failed", process.env.WHATSAPP_RECIPIENT_NUMBER || "", {
            error: result.error,
            consultationId: data?.[0]?.id,
            requestId: req.id,
          });
        }
      })
      .catch((error) => {
        logApiError("/consultation (whatsapp notification)", error, {
          email: payload.email,
          requestId: req.id,
        });
      });

    return res.status(201).json({
      ok: true,
      message:
        "Consultation submitted successfully. We'll review it and get back to you shortly.",
      requestId: req.id,
    });
  } catch (error) {
    logApiError("/consultation (unexpected)", error, {
      email: payload.email,
      requestId: req.id,
    });

    return res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "An unexpected error occurred. Please try again later.",
      requestId: req.id,
    });
  }
}

module.exports = { createConsultation };
