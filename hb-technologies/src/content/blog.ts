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
      "Secure-by-design means security is built into your system architecture, not bolted on during QA.",
      "Start with least privilege, strict input validation, and clear separation between public and secret keys.",
      "Measure outcomes: fewer incidents, faster fixes, and less production uncertainty.",
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
      "Row Level Security (RLS) is most effective when paired with clear ownership and tenant boundaries.",
      "Treat every query as untrusted by default and validate access through policies.",
      "Keep service role keys server-only and prefer parameterized queries and validated inputs.",
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
      "Build for Core Web Vitals: avoid layout shift, ship minimal JS, and optimize images.",
      "Use semantic HTML and consistent heading hierarchy.",
      "Treat metadata, canonical URLs, and structured data as first-class features.",
    ],
  },
];

export function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
