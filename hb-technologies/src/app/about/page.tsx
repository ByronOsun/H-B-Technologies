import type { Metadata } from "next";

import marketing from "@/styles/marketing.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "VIZIA Technologies is a software engineering company delivering security-first product development, AI-powered innovation, and compliance-driven engineering standards.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    title: "About VIZIA Technologies",
    description:
      "Security-first engineering, AI development, and enterprise-grade technology delivery.",
    url: "/about",
  },
  keywords: [
    "software engineering company",
    "AI development firm",
    "cyber security specialists",
    "IoT solution provider",
    "secure software development",
  ],
};

export default function AboutPage() {
  return (
    <section className="section">
      <div className="container">
        <h1>About VIZIA Technologies</h1>
        <p className={`muted ${marketing.lead}`}>
          We’re a software engineering company and technology partner focused on
          security-first delivery, AI-powered automation, and enterprise-grade
          reliability.
        </p>

        <div className={marketing.twoCol}>
          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Company overview</h2>
            <p className="muted">
              VIZIA Technologies builds secure web and mobile products, modern data
              platforms, and resilient infrastructure. We combine disciplined
              engineering practices with a pragmatic approach to delivery — from
              discovery to maintenance.
            </p>
            <p className={`muted ${marketing.mt2}`}>
              If you’re looking for cyber security specialists, an AI development
              firm, or an IoT solution provider with enterprise engineering
              discipline, you’re in the right place.
            </p>
          </article>

          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Founding story</h2>
            <p className="muted">
              VIZIA was founded to solve a common delivery problem: teams need to
              move fast, but they can’t afford security shortcuts, performance
              regressions, or fragile infrastructure. Our work focuses on
              building systems that withstand real production constraints.
            </p>
          </article>
        </div>

        <div className={`${marketing.twoCol} ${marketing.mt3}`}>
          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Vision</h2>
            <p className="muted">
              A world where secure-by-default software is the standard — and
              organizations can adopt AI and automation responsibly.
            </p>
          </article>

          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Mission</h2>
            <p className="muted">
              Deliver high-trust systems with clear outcomes: secure
              architectures, reliable performance, and maintainable codebases.
            </p>
          </article>
        </div>

        <div className={`${marketing.twoCol} ${marketing.mt3}`}>
          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Core values</h2>
            <ul>
              <li>Security and privacy are default requirements</li>
              <li>Clarity: documented decisions and measurable outcomes</li>
              <li>Quality: testing, reviews, and dependable release practices</li>
              <li>Ownership: we build maintainable systems, not prototypes</li>
            </ul>
          </article>

          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Leadership & expertise</h2>
            <p className="muted">
              We bring senior engineering experience across product development,
              application security, data systems, and infrastructure. Engagements
              are led with strong technical ownership and transparent delivery.
            </p>
          </article>
        </div>

        <div className={`${marketing.twoCol} ${marketing.mt3}`}>
          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Engineering culture</h2>
            <ul>
              <li>Clean architecture and well-defined interfaces</li>
              <li>Code reviews, automated checks, and repeatable patterns</li>
              <li>Performance budgets and SEO as first-class features</li>
              <li>Operational readiness: monitoring and incident workflows</li>
            </ul>
          </article>

          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Security & compliance</h2>
            <p className="muted">
              Our security compliance approach uses secure coding standards,
              least-privilege access controls, and compliance-driven processes.
              We align practices to best-practice methodologies like OWASP
              guidance and risk-based reviews.
            </p>
          </article>
        </div>

        <div className={`${marketing.twoCol} ${marketing.mt3}`}>
          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Innovation philosophy</h2>
            <p className="muted">
              Innovation is only valuable when it’s safe to run in production.
              We prioritize AI systems that are measurable, auditable, and
              maintainable — with clear data boundaries and monitoring.
            </p>
          </article>

          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Our approach</h2>
            <ol>
              <li>
                <strong>Discovery:</strong> goals, users, risks, and scope.
              </li>
              <li>
                <strong>Architecture design:</strong> data models, APIs, security
                controls, and deployment plan.
              </li>
              <li>
                <strong>Development:</strong> incremental delivery with clear
                acceptance criteria.
              </li>
              <li>
                <strong>Testing:</strong> automated checks, reviews, and
                performance validation.
              </li>
              <li>
                <strong>Deployment:</strong> secure configuration, observability,
                and rollout strategy.
              </li>
              <li>
                <strong>Maintenance:</strong> monitoring, updates, and continuous
                improvement.
              </li>
            </ol>
          </article>
        </div>

        <div className={`${marketing.twoCol} ${marketing.mt3}`}>
          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Certifications & standards</h2>
            <p className="muted">
              We build with secure coding standards and best-practice
              methodologies. When compliance requirements apply, we implement
              documented controls, audit-friendly workflows, and policy-aligned
              delivery processes.
            </p>
          </article>

          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Who we serve</h2>
            <ul>
              <li>SMEs building reliable customer-facing platforms</li>
              <li>Startups moving fast without sacrificing security</li>
              <li>Enterprises modernizing systems and infrastructure</li>
              <li>Government institutions requiring robust controls</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
