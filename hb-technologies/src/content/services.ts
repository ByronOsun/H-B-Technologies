export type Service = {
  slug: string;
  name: string;
  summary: string;
  problem: string[];
  solution: string[];
  technologies: string[];
  benefits: string[];
  keywords: string[];
};

export const services: Service[] = [
  {
    slug: "web-development",
    name: "Web Development",
    summary:
      "High-performance, SEO-ready web applications built with secure-by-design engineering.",
    problem: [
      "Slow pages reduce conversions and search visibility.",
      "Security gaps (auth, access control, data exposure) increase risk.",
      "Teams need maintainable architecture that scales with features and traffic.",
    ],
    solution: [
      "SSR/SSG Next.js applications with clean information architecture.",
      "API-first design with input validation, least-privilege access, and auditing.",
      "Modular components and repeatable patterns for fast iteration.",
    ],
    technologies: [
      "Next.js (App Router)",
      "TypeScript",
      "Node.js + Express",
      "Supabase Postgres + Storage",
    ],
    benefits: [
      "90+ Lighthouse-ready foundations (performance, SEO, accessibility)",
      "Secure architecture aligned to OWASP Top 10",
      "Scalable codebase and clear delivery milestones",
    ],
    keywords: [
      "software development company",
      "web development",
      "Next.js",
      "enterprise web applications",
    ],
  },
  {
    slug: "mobile-app-development",
    name: "Mobile App Development",
    summary:
      "Reliable mobile experiences with secure APIs and production-grade release practices.",
    problem: [
      "Unreliable integrations create broken user journeys.",
      "Authentication and offline data handling are often brittle.",
      "Performance issues impact retention and ratings.",
    ],
    solution: [
      "Mobile-first product planning and API contract design.",
      "JWT-based auth with robust session and token expiry policies.",
      "Observability-ready backend patterns for faster incident response.",
    ],
    technologies: [
      "REST APIs",
      "JWT Authentication",
      "Supabase Postgres",
      "Secure storage + least privilege",
    ],
    benefits: [
      "Fewer production defects via validated inputs and stable APIs",
      "Stronger security posture for customer data",
      "Clear rollout plan and maintenance strategy",
    ],
    keywords: ["mobile app development", "API development", "secure mobile"],
  },
  {
    slug: "cyber-security",
    name: "Cyber Security",
    summary:
      "OWASP-aligned security controls, reviews, and hardening for apps and infrastructure.",
    problem: [
      "Common web risks (broken access control, injection, XSS) persist in production.",
      "Misconfigured headers, weak auth flows, and excessive permissions expose systems.",
      "Security fixes are expensive when discovered late.",
    ],
    solution: [
      "Threat modeling, secure-by-default API patterns, and hardened headers.",
      "Access control design with RLS policies and least-privilege roles.",
      "Security review of authentication, authorization, and data flows.",
    ],
    technologies: [
      "OWASP Top 10",
      "Helmet + secure headers",
      "Rate limiting",
      "Supabase RLS",
    ],
    benefits: [
      "Reduced attack surface and safer release cycles",
      "Auditable controls and consistent security standards",
      "Better incident readiness and risk reporting",
    ],
    keywords: ["cyber security firm", "OWASP", "application security"],
  },
  {
    slug: "data-science",
    name: "Data Science",
    summary:
      "Turn operational data into insight with practical models, dashboards, and pipelines.",
    problem: [
      "Teams collect data but lack reliable metrics.",
      "Manual reporting slows decisions.",
      "Data quality and governance are inconsistent.",
    ],
    solution: [
      "Define metrics, events, and data models that match real business questions.",
      "Implement repeatable pipelines and analytics-ready schemas.",
      "Deliver dashboards and automated reports.",
    ],
    technologies: ["PostgreSQL", "ETL design", "Analytics modeling"],
    benefits: [
      "Faster decision-making with trustworthy metrics",
      "Reduced manual reporting workload",
      "Data foundations ready for ML and automation",
    ],
    keywords: ["data science", "analytics", "data platform"],
  },
  {
    slug: "network-engineering",
    name: "Network Engineering",
    summary:
      "Design and optimize secure networks for reliability, performance, and controlled access.",
    problem: [
      "Unsegmented networks increase breach impact.",
      "Poor monitoring makes outages hard to diagnose.",
      "Scaling sites and offices can introduce inconsistent configuration.",
    ],
    solution: [
      "Segmentation, access control, and monitoring-first network design.",
      "Documented configuration and change management practices.",
      "Performance optimization and resilience planning.",
    ],
    technologies: ["Network segmentation", "Secure access", "Monitoring"],
    benefits: [
      "Reduced downtime and faster diagnostics",
      "Improved security through layered controls",
      "Repeatable configurations across environments",
    ],
    keywords: ["network engineering", "secure networks"],
  },
  {
    slug: "automation-systems",
    name: "Automation Systems",
    summary:
      "Automate workflows, reduce manual effort, and increase operational reliability.",
    problem: [
      "Manual processes introduce delays and errors.",
      "Inconsistent approvals and audit trails cause compliance gaps.",
      "Operational load increases as organizations scale.",
    ],
    solution: [
      "Workflow design with clear approval steps and traceability.",
      "Integration-first automation using secure APIs.",
      "Role-based access and audit logging for controlled operations.",
    ],
    technologies: ["API integrations", "Role-based access", "Audit logging"],
    benefits: [
      "Lower operational cost and reduced errors",
      "Faster turnaround times",
      "More consistent governance and auditing",
    ],
    keywords: ["automation systems", "workflow automation"],
  },
  {
    slug: "iot-solutions",
    name: "IoT Solutions",
    summary:
      "Connected systems with secure device data flows and scalable monitoring.",
    problem: [
      "Device fleets are hard to monitor and secure.",
      "Telemetry pipelines can become unreliable at scale.",
      "Poor access control exposes sensitive operational data.",
    ],
    solution: [
      "Secure ingestion patterns and least-privilege service access.",
      "Reliable telemetry storage, indexing, and alerting hooks.",
      "Dashboards for operational visibility.",
    ],
    technologies: ["Secure APIs", "PostgreSQL", "Monitoring dashboards"],
    benefits: [
      "Better uptime and operational visibility",
      "Reduced risk through controlled access",
      "Scalable architecture for device growth",
    ],
    keywords: ["IoT automation company", "IoT solutions"],
  },
  {
    slug: "smart-cctv-installation",
    name: "Smart CCTV Installation",
    summary:
      "Modern surveillance systems with secure deployment practices and operational guidance.",
    problem: [
      "Insecure camera networks can become an entry point for attackers.",
      "Poor retention planning leads to missing evidence and storage issues.",
      "Teams need clear operational playbooks.",
    ],
    solution: [
      "Network segmentation and secure configuration.",
      "Storage and retention planning with least-privilege access.",
      "Operational training and documentation.",
    ],
    technologies: ["Network segmentation", "Secure configuration", "Storage planning"],
    benefits: [
      "Safer deployments and reduced breach risk",
      "Clear retention and access procedures",
      "Operational readiness for incident response",
    ],
    keywords: ["smart CCTV installation", "security cameras"],
  },
  {
    slug: "it-consultation",
    name: "IT Consultation",
    summary:
      "Architecture reviews, delivery planning, and risk reduction for mission-critical systems.",
    problem: [
      "Teams ship without clear architecture, increasing long-term cost.",
      "Security and performance requirements arrive too late.",
      "Stakeholders need predictable delivery and measurable outcomes.",
    ],
    solution: [
      "Discovery workshops and a delivery blueprint.",
      "Security-first requirements and non-functional acceptance criteria.",
      "Roadmaps that align stakeholders and engineering.",
    ],
    technologies: ["Architecture review", "Threat modeling", "Performance planning"],
    benefits: [
      "Clear delivery plan and reduced rework",
      "Improved security posture early",
      "Better alignment across stakeholders",
    ],
    keywords: ["IT consultation", "enterprise architecture"],
  },
  {
    slug: "artificial-intelligence",
    name: "Artificial Intelligence (AI)",
    summary:
      "Applied AI systems that automate decisions while staying secure and observable.",
    problem: [
      "Automation projects fail without clear success metrics.",
      "Models can be hard to monitor in production.",
      "Security and privacy risks increase with data access.",
    ],
    solution: [
      "Define measurable outcomes and integrate AI safely into workflows.",
      "Implement monitoring hooks and evaluation checkpoints.",
      "Apply least-privilege data access and audit trails.",
    ],
    technologies: ["Model evaluation", "Secure data access", "Observability"],
    benefits: [
      "Faster operations through targeted automation",
      "Safer deployment with measurable performance",
      "Reduced risk via controlled data flows",
    ],
    keywords: ["AI solutions provider", "AI automation"],
  },
  {
    slug: "machine-learning",
    name: "Machine Learning (ML)",
    summary:
      "Production-ready ML pipelines with validation, versioning, and measurable impact.",
    problem: [
      "Proof-of-concepts stall without a production path.",
      "Data drift reduces accuracy over time.",
      "Unvalidated inputs create unpredictable outcomes.",
    ],
    solution: [
      "Data validation, repeatable training pipelines, and evaluation criteria.",
      "Deployment patterns with rollback and monitoring.",
      "Governance-friendly documentation and auditability.",
    ],
    technologies: ["Data validation", "Model monitoring", "Pipeline design"],
    benefits: [
      "More predictable model performance",
      "Faster iteration with repeatable pipelines",
      "Improved reliability and governance readiness",
    ],
    keywords: ["machine learning", "ML pipelines"],
  },
  {
    slug: "natural-language-processing",
    name: "Natural Language Processing (NLP)",
    summary:
      "Extract and operationalize insights from text: classification, search, and workflow automation.",
    problem: [
      "Manual handling of documents and messages slows operations.",
      "Search and classification accuracy is inconsistent.",
      "Sensitive text data needs careful access control.",
    ],
    solution: [
      "Define taxonomy and evaluation for text workloads.",
      "Implement secure processing pipelines and structured storage.",
      "Deliver automation integrated into existing systems.",
    ],
    technologies: ["Text processing", "Evaluation", "Secure pipelines"],
    benefits: [
      "Reduced manual processing time",
      "Better triage and routing accuracy",
      "Controlled access for sensitive information",
    ],
    keywords: ["natural language processing", "NLP"],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}
