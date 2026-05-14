export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  readingTime: string;
  tags: string[];
  body: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "secure-by-design-nextjs",
    title: "Secure-by-design Next.js: practical defaults for real teams",
    description:
      "Security controls that don’t slow delivery: access control, validation, and safe data boundaries.",
    date: "2026-05-13",
    readingTime: "6 min",
    tags: ["Security", "Next.js", "OWASP"],
    body: [
      "Secure-by-design means security is built into your system architecture, not bolted on during QA. It's not about adding features late in the development cycle; it's about starting with security as a foundational requirement from day one.",
      "Start with least privilege, strict input validation, and clear separation between public and secret keys. This means every user, service, and request should have the minimum permissions needed to do their job. Validate all inputs as if they came from an untrusted source, even if they come from your own frontend.",
      "Practical examples include: using Next.js middleware to validate authorization on every route, storing sensitive data server-side only, using strong TypeScript types to prevent injection vulnerabilities, and implementing audit logging for sensitive operations.",
      "Measure outcomes: fewer incidents, faster fixes, and less production uncertainty. Track security metrics like time-to-detect, time-to-fix, and MTBF (mean time between failures). This data drives continuous improvement and builds team confidence in your security practices.",
    ],
  },
  {
    slug: "supabase-rls-patterns",
    title: "Supabase RLS patterns for multi-tenant apps",
    description:
      "How to model authorization in Postgres with policies that scale.",
    date: "2026-05-13",
    readingTime: "7 min",
    tags: ["Supabase", "Postgres", "Security"],
    body: [
      "Row Level Security (RLS) is most effective when paired with clear ownership and tenant boundaries. Define your data model with tenant/organization IDs first, then write policies that enforce access control at the database layer.",
      "Treat every query as untrusted by default and validate access through policies. Don't rely on application-layer filtering alone. Use Postgres policies to ensure that even if your application has a bug, the database enforces correct permissions.",
      "Keep service role keys server-only and prefer parameterized queries and validated inputs. Never expose the service role key to your frontend or client applications. Use row-level security with proper JWT claims to validate requests.",
      "Real-world example: for a multi-tenant SaaS, create a policy that compares auth.jwt() against the organizations.id column. This ensures users can only see and modify data belonging to their organization, enforced by Postgres itself.",
    ],
  },
  {
    slug: "lighthouse-90-checklist",
    title: "Lighthouse 90+ checklist: performance, SEO, accessibility",
    description:
      "A practical checklist for teams shipping SSR/SSG sites.",
    date: "2026-05-13",
    readingTime: "5 min",
    tags: ["Performance", "SEO", "Accessibility"],
    body: [
      "Build for Core Web Vitals: avoid layout shift, ship minimal JS, and optimize images. Core Web Vitals measure real user experience: Largest Contentful Paint (LCP) for loading performance, Cumulative Layout Shift (CLS) for visual stability, and Interaction to Next Paint (INP) for interactivity.",
      "Use semantic HTML and consistent heading hierarchy. This helps both screen readers and search engines understand your content structure. Use h1 for your main title, h2 for section headings, and h3 for subsections. Avoid skipping levels.",
      "Treat metadata, canonical URLs, and structured data as first-class features. Add Open Graph tags for social sharing, canonical URLs to prevent duplicate content issues, and JSON-LD structured data to help search engines understand your content better.",
      "Implementation checklist: minimize unused CSS/JavaScript, defer non-critical scripts, use next/image for optimized images, implement proper heading hierarchy, add ARIA labels where needed, and include structured data for your content type.",
    ],
  },
  {
    slug: "api-security-best-practices",
    title: "Building secure REST APIs: authentication, validation, and rate limiting",
    description:
      "Essential patterns for production-grade API security without sacrificing developer experience.",
    date: "2026-05-12",
    readingTime: "8 min",
    tags: ["Security", "API", "Backend"],
    body: [
      "API security starts with strong authentication. Use JWT tokens with short expiry times (15 minutes) and refresh tokens for longer sessions. Store refresh tokens securely in HTTP-only cookies on the server.",
      "Validate all inputs strictly. Reject requests that don't match your schema, use TypeScript to catch type errors at compile time, and validate request bodies before processing. This prevents injection attacks and malformed data from crashing your service.",
      "Implement rate limiting per user and per IP. Use libraries like express-rate-limit to prevent brute force attacks and denial-of-service attempts. Combine with monitoring to alert on suspicious patterns.",
      "Use CORS correctly: set explicit allowed origins, restrict HTTP methods to what's needed, and validate the Origin header. Never use Access-Control-Allow-Origin: * with credentials.",
    ],
  },
  {
    slug: "database-migrations-strategy",
    title: "Zero-downtime database migrations: strategies for production systems",
    description:
      "How to evolve your database schema without breaking live applications.",
    date: "2026-05-11",
    readingTime: "9 min",
    tags: ["Database", "DevOps", "PostgreSQL"],
    body: [
      "Zero-downtime migrations follow a strict sequence: add new column, deploy application code that writes to both old and new columns, migrate existing data, deploy application code that reads from the new column, drop the old column.",
      "Never lock the entire table during migrations. Use online migration tools for large tables, or batch updates with scheduled maintenance windows. Supabase provides pg_partman for table partitioning, which enables large updates without full locks.",
      "Test migrations on production-like data before deploying. Use database staging environments with realistic data volumes and run the exact migration command you'll use in production.",
      "Coordinate application deployments with database changes. Deploy application code that's compatible with both old and new schema first, then run the migration, then deploy code that uses the new schema exclusively.",
    ],
  },
  {
    slug: "monitoring-observability-guide",
    title: "From logs to insights: building observability into your stack",
    description:
      "Practical guide to metrics, logs, and traces that actually help you debug production issues.",
    date: "2026-05-10",
    readingTime: "7 min",
    tags: ["DevOps", "Monitoring", "Performance"],
    body: [
      "Observability isn't just logging; it's the combination of metrics, logs, and traces. Metrics tell you what happened (request count, error rate, latency). Logs tell you why (error messages, stack traces). Traces show you how requests flow through your system.",
      "Start with the metrics that matter to your business: request latency, error rate, and resource utilization. Set alerts on these metrics to catch issues before customers report them.",
      "Use structured logging (JSON format) instead of text logs. Include request IDs to correlate logs across services, include stack traces for errors, and avoid logging sensitive data like passwords or tokens.",
      "Implement distributed tracing if you have microservices. Tools like Jaeger help you see exactly which services are slowing down requests and where errors occur.",
    ],
  },
  {
    slug: "performance-optimization-nextjs",
    title: "Next.js performance: image optimization, code splitting, and caching",
    description:
      "Practical techniques to keep your Next.js app fast as it grows.",
    date: "2026-05-09",
    readingTime: "6 min",
    tags: ["Performance", "Next.js", "Frontend"],
    body: [
      "Use next/image for all image rendering. It automatically optimizes images for different screen sizes, lazy-loads below-the-fold images, and serves modern formats like WebP. This alone can cut image bandwidth by 50%+.",
      "Implement code splitting with dynamic imports. Next.js automatically code-splits at route boundaries; use dynamic() for components that are conditionally rendered or below-the-fold.",
      "Enable ISR (Incremental Static Regeneration) for pages that change infrequently. Set revalidate times based on how often content changes: 60 seconds for frequently updated content, 3600 for daily updates.",
      "Use font stacks instead of web fonts or minimize font requests. Google Fonts add extra requests and parsing overhead. A good system font stack is faster and still looks professional.",
    ],
  },
];

export function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
