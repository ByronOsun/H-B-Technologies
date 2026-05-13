import Link from "next/link";

import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <div className={styles.brand}>H&B Technologies</div>
          <p className={`muted ${styles.subcopy}`}>
            Secure-by-design engineering, AI-driven automation, and
            enterprise-grade infrastructure.
          </p>
          <p className={styles.meta}>
            © {new Date().getFullYear()} H&B Technologies. All rights reserved.
          </p>
        </div>

        <nav aria-label="Footer" className={styles.links}>
          <Link className={styles.link} href="/services">
            Services
          </Link>
          <Link className={styles.link} href="/portfolio">
            Portfolio
          </Link>
          <Link className={styles.link} href="/blog">
            Blog
          </Link>
          <Link className={styles.link} href="/careers">
            Careers
          </Link>
          <Link className={styles.link} href="/about">
            About
          </Link>
          <Link className={styles.link} href="/contact">
            Contact
          </Link>
          <Link className={styles.link} href="/book-consultation">
            Book consultation
          </Link>
        </nav>
      </div>
    </footer>
  );
}
