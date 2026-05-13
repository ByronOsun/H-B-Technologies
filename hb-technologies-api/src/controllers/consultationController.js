const { supabaseAdmin } = require("../config/supabase");

async function createConsultation(req, res) {
  const payload = req.validated.body;

  if (!supabaseAdmin) {
    return res.status(503).json({
      error: "SUPABASE_NOT_CONFIGURED",
      message:
        "Supabase is not configured on the API. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      requestId: req.id,
    });
  }

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
    return res.status(500).json({
      error: "SUPABASE_ERROR",
      message: error.message,
      requestId: req.id,
    });
  }

  return res.status(201).json({ ok: true, requestId: req.id });
}

module.exports = { createConsultation };
