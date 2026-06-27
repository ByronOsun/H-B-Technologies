import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import AnimateIn from "@/components/AnimateIn";
import CountUp from "@/components/CountUp";
import styles from "./page.module.css";
import type { SiteContent } from "@/lib/content";
import { loadSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "VIZIA Technologies",
  description:
    "VIZIA Technologies is a software engineering company delivering security-first product development, AI-powered automation, and scalable enterprise systems.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "VIZIA Technologies",
    description: "Security-first engineering, AI-powered innovation, and scalable enterprise systems.",
    url: "/",
  },
  keywords: ["software engineering company", "AI development firm", "cyber security specialists", "IoT solution provider", "enterprise software development"],
};

export default async function Home() {
  const c: SiteContent = await loadSiteContent();

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <HeroSection config={c.hero} />

      {/* ── Stats ── */}
      <section className={styles.statsBar} aria-label="Key statistics">
        <div className={`container ${styles.statsGrid}`}>
          {c.stats.map((s, i) => (
            <AnimateIn key={s.label} delay={i * 100} variant="up">
              <div className={styles.statItem}>
                <div className={styles.statValue}>
                  <CountUp end={s.value} suffix={s.suffix} />
                </div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* ── Deliver ── */}
      <section className="section sectionAlt" aria-labelledby="deliver-heading">
        <div className="container">
          <AnimateIn variant="up">
            <span className="pill">{c.deliver.badge}</span>
            <h2 id="deliver-heading" className={styles.sectionHeading}>{c.deliver.heading}</h2>
            <p className={`muted ${styles.sectionIntro}`}>{c.deliver.intro}</p>
          </AnimateIn>
          <div className={styles.grid3}>
            {c.deliver.cards.map((card, i) => (
              <AnimateIn key={card.title} delay={i * 120} variant="up">
                <Link href={card.href} className={`card ${styles.deliverCard}`}>
                  <div className={styles.deliverIcon}>{card.icon}</div>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={`muted ${styles.cardDesc}`}>{card.desc}</p>
                  <span className={styles.cardArrow}>Learn more →</span>
                </Link>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why VIZIA ── */}
      <section className="section" aria-labelledby="why-heading">
        <div className="container">
          <AnimateIn variant="up">
            <span className="pill">{c.why.badge}</span>
            <h2 id="why-heading" className={styles.sectionHeading}>{c.why.heading}</h2>
            <p className={`muted ${styles.sectionIntro}`}>{c.why.intro}</p>
          </AnimateIn>
          <div className={styles.grid5}>
            {c.why.items.map((d, i) => (
              <AnimateIn key={d.title} delay={i * 100} variant="up">
                <article className={`card ${styles.diffCard}`}>
                  <div className={styles.diffIcon}>{d.icon}</div>
                  <h3 className={styles.cardTitle}>{d.title}</h3>
                  <p className={`muted ${styles.cardDesc}`}>{d.copy}</p>
                </article>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Industries ── */}
      <section className="section sectionAlt" aria-labelledby="industries-heading">
        <div className="container">
          <AnimateIn variant="up">
            <span className="pill">{c.industries.badge}</span>
            <h2 id="industries-heading" className={styles.sectionHeading}>{c.industries.heading}</h2>
            <p className={`muted ${styles.sectionIntro}`}>{c.industries.intro}</p>
          </AnimateIn>
          <div className={styles.grid3}>
            {c.industries.items.map((ind, i) => (
              <AnimateIn key={ind.name} delay={i * 80} variant="up">
                <article className={`card ${styles.industryCard}`}>
                  <div className={styles.industryIcon}>{ind.icon}</div>
                  <h3 className={styles.cardTitle}>{ind.name}</h3>
                  <p className={`muted ${styles.cardDesc}`}>{ind.desc}</p>
                </article>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stack ── */}
      <section className="section" aria-labelledby="stack-heading">
        <div className="container">
          <AnimateIn variant="up">
            <span className="pill">{c.stack.badge}</span>
            <h2 id="stack-heading" className={styles.sectionHeading}>{c.stack.heading}</h2>
            <p className={`muted ${styles.sectionIntro}`}>{c.stack.intro}</p>
          </AnimateIn>
          <div className={styles.stackGrid}>
            {c.stack.items.map((cat, i) => (
              <AnimateIn key={cat.title} delay={i * 90} variant="scale">
                <article className={`card ${styles.stackCard}`}>
                  <h3 className={styles.stackTitle}>{cat.title}</h3>
                  <ul className={styles.stackList}>
                    {cat.items.map((it) => (
                      <li key={it} className={styles.stackItem}>
                        <span className={styles.stackDot} />{it}
                      </li>
                    ))}
                  </ul>
                </article>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section sectionAlt" aria-labelledby="testimonials-heading">
        <div className="container">
          <AnimateIn variant="up">
            <span className="pill">{c.testimonials.badge}</span>
            <h2 id="testimonials-heading" className={styles.sectionHeading}>{c.testimonials.heading}</h2>
            <p className={`muted ${styles.sectionIntro}`}>{c.testimonials.intro}</p>
          </AnimateIn>
          <div className={styles.grid3}>
            {c.testimonials.items.map((t, i) => (
              <AnimateIn key={t.name} delay={i * 120} variant="up">
                <figure className={`card ${styles.testimonialCard}`}>
                  <div className={styles.quoteIcon}>"</div>
                  <blockquote>
                    <p className={`muted ${styles.quoteText}`}>{t.quote}</p>
                  </blockquote>
                  <figcaption className={styles.testimonialMeta}>
                    <div className={styles.avatar}>{t.initials}</div>
                    <div>
                      <strong className={styles.testimonialName}>{t.name}</strong>
                      <span className={`muted ${styles.testimonialOrg}`}>{t.org}</span>
                    </div>
                  </figcaption>
                </figure>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section">
        <div className="container">
          <AnimateIn variant="scale">
            <div className={styles.ctaCard}>
              <div className={styles.ctaGlow} aria-hidden="true" />
              <span className="pill">{c.cta.badge}</span>
              <h2 className={styles.ctaHeading}>{c.cta.heading}</h2>
              <p className={`muted ${styles.ctaCopy}`}>{c.cta.copy}</p>
              <div className={styles.ctaActions}>
                <Link className="btn btnPrimary" href="/book-consultation">Book Consultation</Link>
                <Link className="btn" href="/services">View All Services</Link>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
