const { supabaseAdmin } = require("../config/supabase");

async function listBlogPosts(req, res) {
  if (!supabaseAdmin) {
    return res.json({
      data: [],
      source: "static",
      requestId: req.id,
    });
  }

  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select("id, slug, title, description, published_at")
    .order("published_at", { ascending: false });

  if (error) {
    return res.status(500).json({
      error: "SUPABASE_ERROR",
      message: error.message,
      requestId: req.id,
    });
  }

  return res.json({ data, source: "supabase", requestId: req.id });
}

module.exports = { listBlogPosts };
