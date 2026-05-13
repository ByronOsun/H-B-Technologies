export type PortfolioProject = {
  slug: string;
  title: string;
  summary: string;
  outcomes: string[];
  stack: string[];
};

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "secure-client-portal",
    title: "Secure Client Portal",
    summary:
      "A role-based portal for sensitive records with audit trails and least-privilege access.",
    outcomes: [
      "Hardened authentication and authorization flows",
      "RLS-backed data access controls",
      "Performance-first pages for fast navigation",
    ],
    stack: ["Next.js", "Node.js + Express", "Supabase Postgres", "JWT"],
  },
  {
    slug: "iot-monitoring-dashboard",
    title: "IoT Monitoring Dashboard",
    summary:
      "Telemetry ingestion and monitoring views designed for high-volume device fleets.",
    outcomes: [
      "Reliable ingestion patterns and indexed storage",
      "Operational views for incidents and device health",
      "Security boundaries between tenants and sites",
    ],
    stack: ["PostgreSQL", "API Design", "Access Control", "Observability hooks"],
  },
  {
    slug: "nlp-document-triage",
    title: "NLP Document Triage",
    summary:
      "Text classification and routing to reduce manual processing across teams.",
    outcomes: [
      "Defined taxonomy and measurable evaluation",
      "Secure processing for sensitive text",
      "Workflow automation and reporting",
    ],
    stack: ["NLP", "Data validation", "Secure pipelines", "PostgreSQL"],
  },
];
