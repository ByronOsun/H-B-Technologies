const { supabaseAdmin } = require("../config/supabase");

const staticBlogPosts = [
  {
    slug: "secure-by-design-nextjs",
    title: "Secure-by-design Next.js: practical defaults for real teams",
    excerpt:
      "Security controls that don’t slow delivery: access control, validation, and safe data boundaries.",
    content:
      "Secure-by-design means security is built into your system architecture, not bolted on during QA.\n\nStart with least privilege, strict input validation, and clear separation between public and secret keys.\n\nMeasure outcomes: fewer incidents, faster fixes, and less production uncertainty.",
    featured_image: "",
    author: "H&B Technologies",
    created_at: "2026-05-13T00:00:00.000Z",
  },
  {
    slug: "supabase-rls-patterns",
    title: "Supabase RLS patterns for multi-tenant apps",
    excerpt: "How to model authorization in Postgres with policies that scale.",
    content:
      "Row Level Security (RLS) is most effective when paired with clear ownership and tenant boundaries.\n\nTreat every query as untrusted by default and validate access through policies.\n\nKeep service role keys server-only and prefer validated inputs.",
    featured_image: "",
    author: "H&B Technologies",
    created_at: "2026-05-13T00:00:00.000Z",
  },
  {
    slug: "lighthouse-90-checklist",
    title: "Lighthouse 90+ checklist: performance, SEO, accessibility",
    excerpt: "A practical checklist for teams shipping SSR/SSG sites.",
    content:
      "Build for Core Web Vitals: avoid layout shift, ship minimal JS, and optimize images.\n\nUse semantic HTML and consistent heading hierarchy.\n\nTreat metadata, canonical URLs, and structured data as first-class features.",
    featured_image: "",
    author: "H&B Technologies",
    created_at: "2026-05-13T00:00:00.000Z",
  },
];

function toSummary(row) {
  const excerpt = row.excerpt || row.description || "";
  const createdAt = row.created_at || row.published_at || null;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt,
    featured_image: row.featured_image || "",
    author: row.author || "H&B Technologies",
    created_at: createdAt,
  };
}

function toDetail(row) {
  const excerpt = row.excerpt || row.description || "";
  const content = row.content || row.body || "";
  const createdAt = row.created_at || row.published_at || null;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt,
    content,
    featured_image: row.featured_image || "",
    author: row.author || "H&B Technologies",
    created_at: createdAt,
  };
}

async function listBlogPosts(req, res) {
  if (!supabaseAdmin) {
    return res.json({
      data: staticBlogPosts.map((p, idx) => ({
        id: idx + 1,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        featured_image: p.featured_image,
        author: p.author,
        created_at: p.created_at,
      })),
      source: "static",
      requestId: req.id,
    });
  }

  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select(
      "id, slug, title, excerpt, content, featured_image, author, created_at, description, body, published_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({
      error: "SUPABASE_ERROR",
      message: error.message,
      requestId: req.id,
    });
  }

  return res.json({
    data: (data || []).map(toSummary),
    source: "supabase",
    requestId: req.id,
  });
}

async function getBlogPostBySlug(req, res) {
  const slug = String(req.params.slug || "").trim();
  if (!slug) {
    return res.status(400).json({
      error: "INVALID_SLUG",
      message: "Missing slug.",
      requestId: req.id,
    });
  }

  if (!supabaseAdmin) {
    const post = staticBlogPosts.find((p) => p.slug === slug);
    if (!post) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Blog post not found.",
        requestId: req.id,
      });
    }

    return res.json({ data: post, source: "static", requestId: req.id });
  }

  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select(
      "id, slug, title, excerpt, content, featured_image, author, created_at, description, body, published_at"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    return res.status(500).json({
      error: "SUPABASE_ERROR",
      message: error.message,
      requestId: req.id,
    });
  }

  if (!data) {
    return res.status(404).json({
      error: "NOT_FOUND",
      message: "Blog post not found.",
      requestId: req.id,
    });
  }

  return res.json({ data: toDetail(data), source: "supabase", requestId: req.id });
}

module.exports = { getBlogPostBySlug, listBlogPosts };
