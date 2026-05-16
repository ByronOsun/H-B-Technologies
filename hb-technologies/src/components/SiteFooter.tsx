import Link from "next/link";

import styles from "./SiteFooter.module.css";
import { WhatsAppLink } from "./WhatsAppLink";

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

          <div className={styles.contact}>
            <p className={styles.contactLabel}>Get in touch</p>
            <div className={styles.contactLinks}>
              <a href="mailto:htechnob@gmail.com" className={styles.contactLink}>
                htechnob@gmail.com
              </a>
              <a href="tel:+254113747654" className={styles.contactLink}>
                +254 113 747 654
              </a>
              <WhatsAppLink
                label="Chat on WhatsApp"
                ariaLabel="Chat with H&B Technologies on WhatsApp"
                className={styles.contactLink}
                variant="inline"
              />
            </div>
          </div>

          <p className={styles.meta}>
            © {new Date().getFullYear()} H&B Technologies. All rights reserved.
          </p>
        </div>

        <nav aria-label="Footer" className={styles.links}>
          <Link className={styles.link} href="/services">
            Services
          </Link>
          <Link className={styles.link} href="/blog">
            Blog
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
