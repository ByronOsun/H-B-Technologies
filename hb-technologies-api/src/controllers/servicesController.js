const { supabaseAdmin } = require("../config/supabase");

const staticServices = [
  { slug: "web-development", name: "Web Development" },
  { slug: "mobile-app-development", name: "Mobile App Development" },
  { slug: "cyber-security", name: "Cyber Security" },
  { slug: "data-science", name: "Data Science" },
  { slug: "network-engineering", name: "Network Engineering" },
  { slug: "automation-systems", name: "Automation Systems" },
  { slug: "iot-solutions", name: "IoT Solutions" },
  { slug: "smart-cctv-installation", name: "Smart CCTV Installation" },
  { slug: "it-consultation", name: "IT Consultation" },
  { slug: "artificial-intelligence", name: "Artificial Intelligence (AI)" },
  { slug: "machine-learning", name: "Machine Learning (ML)" },
  {
    slug: "natural-language-processing",
    name: "Natural Language Processing (NLP)",
  },
];

async function listServices(req, res) {
  if (!supabaseAdmin) {
    return res.json({
      data: staticServices,
      source: "static",
      requestId: req.id,
    });
  }

  const { data, error } = await supabaseAdmin
    .from("services")
    .select("id, slug, name, summary")
    .order("name", { ascending: true });

  if (error) {
    return res.status(500).json({
      error: "SUPABASE_ERROR",
      message: error.message,
      requestId: req.id,
    });
  }

  return res.json({ data, source: "supabase", requestId: req.id });
}

module.exports = { listServices };
