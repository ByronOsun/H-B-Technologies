const { supabaseAdmin } = require("../config/supabase");

const staticServices = [
  {
    slug: "web-development",
    title: "Web Development",
    short_description:
      "High-performance, SEO-ready web applications built with secure-by-design engineering.",
    full_description:
      "We design and build modern web applications with security, performance, and maintainability as first-class requirements. Engagements typically include information architecture, API design, authentication/authorization, validation, observability, and deployment hardening.",
    technologies: ["Next.js", "TypeScript", "Node.js", "PostgreSQL"],
    benefits: [
      "Faster pages and better Core Web Vitals",
      "OWASP-aligned defaults and safer data boundaries",
      "Maintainable architecture that scales with features",
    ],
    case_examples: [
      "SSR/SSG marketing and product sites with strong SEO",
      "Secure dashboards and internal tools",
      "API-backed portals with role-based access control",
    ],
    keywords: ["software engineering company", "web development"],
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    short_description:
      "Reliable mobile experiences backed by secure APIs and production-ready release practices.",
    full_description:
      "We build mobile products that integrate cleanly with backend systems, ship with predictable release processes, and protect customer data. We focus on stable API contracts, authentication, and performance.",
    technologies: ["REST APIs", "JWT", "PostgreSQL"],
    benefits: ["Higher retention", "Fewer production defects", "Secure data handling"],
    case_examples: ["Customer apps", "Field service apps", "Secure onboarding flows"],
    keywords: ["software development company", "mobile app development"],
  },
  {
    slug: "cyber-security",
    title: "Cyber Security",
    short_description:
      "Application security reviews, hardening, and secure-by-default engineering practices.",
    full_description:
      "We help teams reduce risk with secure coding standards, threat modeling, hardened headers, access control design, and continuous improvement practices aligned to OWASP guidance.",
    technologies: ["OWASP", "Secure headers", "Rate limiting"],
    benefits: ["Reduced attack surface", "Clear risk reporting", "Safer release cycles"],
    case_examples: ["AppSec reviews", "Auth hardening", "RLS policy design"],
    keywords: ["cyber security specialists", "application security"],
  },
  {
    slug: "data-science",
    title: "Data Science",
    short_description:
      "Practical analytics, data modeling, and pipelines that turn data into decisions.",
    full_description:
      "We design data foundations and reporting that teams can trust, then build toward automation and AI. The focus is reliable metrics, governance, and repeatable pipelines.",
    technologies: ["PostgreSQL", "ETL", "Analytics modeling"],
    benefits: ["Faster decision-making", "Reduced manual reporting", "AI-ready foundations"],
    case_examples: ["Dashboards", "Pipelines", "Data quality improvements"],
    keywords: ["AI development firm", "data engineering"],
  },
  {
    slug: "network-engineering",
    title: "Network Engineering",
    short_description:
      "Secure, reliable network design with monitoring-first operational practices.",
    full_description:
      "We design and optimize networks for segmentation, controlled access, resilience, and faster diagnostics. Work includes documentation and change management.",
    technologies: ["Segmentation", "Secure access", "Monitoring"],
    benefits: ["Reduced downtime", "Improved security posture", "Repeatable configurations"],
    case_examples: ["Site connectivity", "Office networks", "Secure access reviews"],
    keywords: ["network engineering", "cyber security specialists"],
  },
  {
    slug: "automation-systems",
    title: "Automation Systems",
    short_description:
      "Workflow automation that reduces manual work and increases reliability.",
    full_description:
      "We map workflows, design approvals and audit trails, and implement automation through secure integrations. The goal is measurable operational efficiency with governance.",
    technologies: ["Secure APIs", "Audit logging", "RBAC"],
    benefits: ["Lower operational cost", "Faster turnaround", "Better governance"],
    case_examples: ["Approval workflows", "Integrations", "Automated reporting"],
    keywords: ["automation systems", "software engineering company"],
  },
  {
    slug: "iot-solutions",
    title: "IoT Solutions",
    short_description:
      "Secure IoT systems with scalable telemetry, monitoring, and device data flows.",
    full_description:
      "We help teams connect device fleets securely, store and analyze telemetry, and build monitoring dashboards that scale. Security and least privilege are treated as defaults.",
    technologies: ["Secure ingestion", "PostgreSQL", "Monitoring"],
    benefits: ["Operational visibility", "Improved uptime", "Controlled access"],
    case_examples: ["Telemetry pipelines", "Device dashboards", "Alerting hooks"],
    keywords: ["IoT solution provider", "IoT solutions"],
  },
  {
    slug: "smart-cctv-installation",
    title: "Smart CCTV Installation",
    short_description:
      "Modern surveillance deployments with secure configuration and operational guidance.",
    full_description:
      "We deploy smart CCTV systems with secure networking practices, retention planning, and clear operational playbooks to support incident response and compliance needs.",
    technologies: ["Segmentation", "Secure configuration", "Retention planning"],
    benefits: ["Safer deployments", "Clear access procedures", "Operational readiness"],
    case_examples: ["Office CCTV", "Multi-site deployments", "Retention + access planning"],
    keywords: ["IoT solution provider", "cyber security specialists"],
  },
  {
    slug: "it-consultation",
    title: "IT Consultation",
    short_description:
      "Architecture reviews, delivery planning, and risk reduction for critical systems.",
    full_description:
      "We run discovery and architecture reviews to define a practical plan: scope, risks, non-functional requirements, and delivery milestones. Ideal for teams modernizing systems or preparing for security reviews.",
    technologies: ["Discovery", "Architecture", "Threat modeling"],
    benefits: ["Clear plan", "Reduced rework", "Stronger security posture"],
    case_examples: ["Architecture audits", "Roadmaps", "Risk assessments"],
    keywords: ["software engineering company", "IT consultation"],
  },
  {
    slug: "artificial-intelligence",
    title: "Artificial Intelligence (AI)",
    short_description:
      "Applied AI systems that automate decisions while staying secure and observable.",
    full_description:
      "We deliver AI automation where it matters: measurable outcomes, safe data access, and deployable systems. We pair engineering discipline with pragmatic model evaluation and monitoring.",
    technologies: ["Model evaluation", "Secure data access", "Monitoring"],
    benefits: ["Faster operations", "Measured performance", "Reduced risk"],
    case_examples: ["Automation", "Classification", "Workflow intelligence"],
    keywords: ["AI development firm", "AI solutions"],
  },
  {
    slug: "machine-learning",
    title: "Machine Learning (ML)",
    short_description:
      "Production-ready ML pipelines with validation, monitoring, and governance.",
    full_description:
      "We help teams move from prototypes to production with repeatable training pipelines, evaluation criteria, drift monitoring, and deployment patterns designed for rollback and reliability.",
    technologies: ["Data validation", "Model monitoring", "Pipelines"],
    benefits: ["Predictable performance", "Faster iteration", "Governance readiness"],
    case_examples: ["Forecasting", "Risk scoring", "Recommendation systems"],
    keywords: ["AI development firm", "machine learning"],
  },
  {
    slug: "natural-language-processing",
    title: "Natural Language Processing (NLP)",
    short_description:
      "Extract insight from text with secure pipelines for classification, search, and automation.",
    full_description:
      "We design NLP solutions for document processing, routing, and search. We prioritize evaluation, privacy, and least-privilege access for sensitive text data.",
    technologies: ["Text processing", "Evaluation", "Secure pipelines"],
    benefits: ["Reduced manual processing", "Improved triage", "Controlled access"],
    case_examples: ["Document automation", "Ticket routing", "Semantic search"],
    keywords: ["AI development firm", "natural language processing"],
  },
];

function toServiceSummary(row) {
  const title = row.title || row.name || "";
  const shortDescription = row.short_description || row.summary || "";

  return {
    id: row.id,
    slug: row.slug,
    title,
    short_description: shortDescription,
    created_at: row.created_at || null,
  };
}

function toServiceDetail(row) {
  const title = row.title || row.name || "";
  const shortDescription = row.short_description || row.summary || "";
  const fullDescription = row.full_description || "";

  return {
    id: row.id,
    slug: row.slug,
    title,
    short_description: shortDescription,
    full_description: fullDescription,
    technologies: row.technologies || [],
    benefits: row.benefits || [],
    case_examples: row.case_examples || [],
    keywords: row.keywords || [],
    created_at: row.created_at || null,
  };
}

async function listServices(req, res) {
  if (!supabaseAdmin) {
    return res.json({
      data: staticServices.map((s, idx) => ({ id: idx + 1, ...s })),
      source: "static",
      requestId: req.id,
    });
  }

  const { data, error } = await supabaseAdmin
    .from("services")
    .select(
      "id, slug, title, short_description, full_description, technologies, benefits, case_examples, keywords, created_at, name, summary"
    )
    .order("title", { ascending: true });

  if (error) {
    return res.status(500).json({
      error: "SUPABASE_ERROR",
      message: error.message,
      requestId: req.id,
    });
  }

  return res.json({
    data: (data || []).map(toServiceSummary),
    source: "supabase",
    requestId: req.id,
  });
}

async function getServiceBySlug(req, res) {
  const slug = String(req.params.slug || "").trim();
  if (!slug) {
    return res.status(400).json({
      error: "INVALID_SLUG",
      message: "Missing slug.",
      requestId: req.id,
    });
  }

  if (!supabaseAdmin) {
    const service = staticServices.find((s) => s.slug === slug);
    if (!service) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Service not found.",
        requestId: req.id,
      });
    }

    return res.json({ data: service, source: "static", requestId: req.id });
  }

  const { data, error } = await supabaseAdmin
    .from("services")
    .select(
      "id, slug, title, short_description, full_description, technologies, benefits, case_examples, keywords, created_at, name, summary"
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
      message: "Service not found.",
      requestId: req.id,
    });
  }

  return res.json({ data: toServiceDetail(data), source: "supabase", requestId: req.id });
}

module.exports = { getServiceBySlug, listServices };
