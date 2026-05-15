const { supabaseAdmin } = require("../config/supabase");
const { sendConsultationEmail } = require("../config/email");

async function createConsultation(req, res) {
  const payload = req.validated.body;
  const clientIp = req.ip || req.connection.remoteAddress || "unknown";

  if (!supabaseAdmin) {
    return res.status(503).json({
      error: "SUPABASE_NOT_CONFIGURED",
      message:
        "Supabase is not configured on the API. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      requestId: req.id,
    });
  }

  // Insert consultation into Supabase
  const { error } = await supabaseAdmin.from("consultations").insert({
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    company: payload.company,
    service: payload.service,
    message: payload.message,
    source: payload.source,
  });

  if (error) {
    console.error("Supabase insert error:", error.message);
    return res.status(500).json({
      error: "SUPABASE_ERROR",
      message: error.message,
      requestId: req.id,
    });
  }

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
  ).catch((error) => {
    console.error("Email notification failed:", error);
    // Log but don't fail the consultation submission
  });

  return res.status(201).json({
    ok: true,
    message:
      "Consultation submitted successfully. We'll review it and get back to you shortly.",
    requestId: req.id,
  });
}

module.exports = { createConsultation };
