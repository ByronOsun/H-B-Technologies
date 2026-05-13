const { supabaseAdmin } = require("../config/supabase");

async function listPortfolio(req, res) {
  if (!supabaseAdmin) {
    return res.json({
      data: [],
      source: "static",
      requestId: req.id,
    });
  }

  const { data, error } = await supabaseAdmin
    .from("portfolio_projects")
    .select("id, slug, title, summary, stack, outcomes")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({
      error: "SUPABASE_ERROR",
      message: error.message,
      requestId: req.id,
    });
  }

  return res.json({ data, source: "supabase", requestId: req.id });
}

module.exports = { listPortfolio };
