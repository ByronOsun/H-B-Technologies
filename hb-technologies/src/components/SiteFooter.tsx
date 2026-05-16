import Link from "next/link";

import styles from "./SiteFooter.module.css";
import { WhatsAppLink } from "./WhatsAppLink";

const CONTACT_PHONES = [
  "+254 113 747 654",
  "+254 724 121 679",
  "+254 797 749 346",
  "+254 785 773 554",
];

const CONTACT_EMAIL = "htechnob@gmail.com";

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
              <a href={`mailto:${CONTACT_EMAIL}`} className={styles.contactLink}>
                {CONTACT_EMAIL}
              </a>

              {CONTACT_PHONES.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className={styles.contactLink}
                >
                  {phone}
                </a>
              ))}

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
