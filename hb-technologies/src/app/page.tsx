import type { Metadata } from "next";
import styles from "./page.module.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "H&B Technologies",
  description:
    "H&B Technologies is a software engineering company delivering security-first product development, AI-powered automation, and scalable enterprise systems.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "H&B Technologies",
    description:
      "Security-first engineering, AI-powered innovation, and scalable enterprise systems.",
    url: "/",
  },
  keywords: [
    "software engineering company",
    "AI development firm",
    "cyber security specialists",
    "IoT solution provider",
    "enterprise software development",
  ],
};

const differentiators = [
  {
    title: "Security-first engineering",
    copy: "Secure coding standards, threat modeling, and OWASP-aligned defaults built into delivery — not added at the end.",
  },
  {
    title: "AI-powered innovation",
    copy: "Applied AI and automation focused on measurable outcomes, safe data boundaries, and observability in production.",
  },
  {
    title: "Scalable enterprise systems",
    copy: "Architecture that stays maintainable as your product grows: clean interfaces, reliable APIs, and resilient infrastructure.",
  },
  {
    title: "Certified professionals",
    copy: "Experienced engineers who ship production systems with governance, documentation, and predictable delivery practices.",
  },
  {
    title: "24/7 support",
    copy: "Operational readiness, incident response workflows, and maintenance plans designed for uptime and continuity.",
  },
] as const;

const industries = [
  "Finance",
  "Healthcare",
  "Government",
  "Retail",
  "Telecommunications",
  "Education",
] as const;

const stack = [
  {
    title: "Frontend technologies",
    items: ["Next.js", "React", "TypeScript", "Performance & SEO best practices"],
  },
  {
    title: "Backend technologies",
    items: ["Node.js", "Express", "PostgreSQL", "Supabase (RLS + Storage)"],
  },
  {
    title: "Cloud infrastructure",
    items: ["Vercel", "Render", "Cloud-ready architecture", "Secure networking"],
  },
  {
    title: "AI/ML tools",
    items: ["Model evaluation", "NLP workflows", "Data pipelines", "Automation systems"],
  },
  {
    title: "DevOps practices",
    items: ["CI/CD", "Observability", "Secrets management", "Infrastructure hardening"],
  },
] as const;

const testimonials = [
  {
    quote:
      "H&B Technologies delivered a secure, scalable platform with clear milestones and practical security controls. Communication was crisp and outcomes were measurable.",
    name: "Operations Lead",
    org: "SME Client",
  },
  {
    quote:
      "Their security-first approach helped us ship faster by removing uncertainty. The architecture and documentation made handover easy.",
    name: "CTO",
    org: "Startup Team",
  },
  {
    quote:
      "We needed enterprise-grade reliability and governance. H&B brought disciplined engineering, strong testing practices, and dependable delivery.",
    name: "Program Manager",
    org: "Enterprise Client",
  },
] as const;

export default function Home() {
  return (
    <div>
      <section className="section">
        <div className="container">
          <p className="pill">
            Security-first engineering • AI-powered innovation • Enterprise systems
          </p>
          <h1>Build secure, scalable systems that outperform in production.</h1>
          <p className={`muted ${styles.heroMission}`}>
            Our mission is to help teams ship high-trust software — with secure
            defaults, measurable outcomes, and architecture that stays
            maintainable as you grow.
          </p>
          <p className={`muted ${styles.heroSubcopy}`}>
            H&B Technologies builds secure web and mobile products, modern data
            platforms, and resilient infrastructure for startups, SMEs,
            enterprises, and public-sector teams.
          </p>
          <div className={styles.heroCtas}>
            <Link className="btn btnPrimary" href="/book-consultation">
              Request consultation
            </Link>
            <Link className="btn" href="/services">
              View services
            </Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="deliver-heading">
        <div className="container">
          <h2 id="deliver-heading">What we deliver</h2>
          <div className={styles.grid3}>
            <article className={`card ${styles.cardPad}`}>
              <h3>Secure Product Engineering</h3>
              <p className={`muted ${styles.cardCopy}`}>
                Web, mobile, and API development with OWASP-aligned controls.
              </p>
            </article>
            <article className={`card ${styles.cardPad}`}>
              <h3>Data & AI Systems</h3>
              <p className={`muted ${styles.cardCopy}`}>
                Data science, machine learning, and NLP to automate decisions.
              </p>
            </article>
            <article className={`card ${styles.cardPad}`}>
              <h3>Infrastructure & IoT</h3>
              <p className={`muted ${styles.cardCopy}`}>
                Networks, automation systems, IoT solutions, and Smart CCTV.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="why-heading">
        <div className="container">
          <h2 id="why-heading">Why choose H&B Technologies</h2>
          <p className={`muted ${styles.sectionIntro}`}>
            We’re a software engineering company built for security, reliability,
            and delivery speed — without sacrificing compliance or quality.
          </p>

          <div className={styles.grid3}>
            {differentiators.map((d) => (
              <article key={d.title} className={`card ${styles.cardPad}`}>
                <h3>{d.title}</h3>
                <p className={`muted ${styles.cardCopy}`}>{d.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="industries-heading">
        <div className="container">
          <h2 id="industries-heading">Industries served</h2>
          <p className={`muted ${styles.sectionIntro}`}>
            Experience across regulated and high-availability environments.
          </p>
          <div className={styles.grid3}>
            {industries.map((i) => (
              <article key={i} className={`card ${styles.cardPad}`}>
                <h3>{i}</h3>
                <p className={`muted ${styles.cardCopy}`}>
                  Secure systems, dependable delivery, and clear governance.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="stack-heading">
        <div className="container">
          <h2 id="stack-heading">Technology stack</h2>
          <p className={`muted ${styles.sectionIntro}`}>
            Modern tooling selected for performance, maintainability, and
            security-by-default.
          </p>

          <div className={styles.stackGrid}>
            {stack.map((c) => (
              <article key={c.title} className={`card ${styles.cardPad}`}>
                <h3>{c.title}</h3>
                <ul className={styles.stackList}>
                  {c.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="testimonials-heading">
        <div className="container">
          <h2 id="testimonials-heading">Testimonials</h2>
          <p className={`muted ${styles.sectionIntro}`}>
            What clients say about working with our cyber security specialists
            and delivery teams.
          </p>

          <div className={styles.grid3}>
            {testimonials.map((t) => (
              <figure key={t.name} className={`card ${styles.cardPad}`}>
                <blockquote className={styles.quote}>
                  <p className={`muted ${styles.cardCopy}`}>“{t.quote}”</p>
                </blockquote>
                <figcaption className={styles.testimonialMeta}>
                  <strong>{t.name}</strong>
                  <span className="muted"> — {t.org}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className={`container card ${styles.ctaCard}`}>
          <h2>Ready to scope a secure build?</h2>
          <p className={`muted ${styles.ctaCopy}`}>
            Get a clear plan, timeline, and risk assessment — from a team that
            treats compliance-driven engineering as a default.
          </p>
          <div className={styles.ctaActions}>
            <Link className="btn btnPrimary" href="/book-consultation">
              Book consultation
            </Link>
            <Link className="btn" href="/services">
              View services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
