import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <section className="section">
        <div className="container">
          <p className="pill">Secure-by-design engineering • AI-driven automation</p>
          <h1>Enterprise-grade software engineering & technology solutions.</h1>
          <p className={`muted ${styles.heroSubcopy}`}>
            H&B Technologies builds secure web and mobile products, modern data
            platforms, and resilient infrastructure for startups, SMEs,
            enterprises, and public-sector teams.
          </p>
          <div className={styles.heroCtas}>
            <Link className="btn btnPrimary" href="/book-consultation">
              Book a consultation
            </Link>
            <Link className="btn" href="/services">
              Explore services
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>What we deliver</h2>
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

      <section className="section">
        <div className={`container card ${styles.ctaCard}`}>
          <h2>Ready to scope a secure build?</h2>
          <p className={`muted ${styles.ctaCopy}`}>
            Get a clear plan, timeline, and risk assessment.
          </p>
          <div className={styles.ctaActions}>
            <Link className="btn btnPrimary" href="/book-consultation">
              Book consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
