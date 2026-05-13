import Link from "next/link";

import styles from "./SiteHeader.module.css";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Careers" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link className={styles.brand} href="/">
          <span>H&B</span>
          <span className={styles.tagline}>Technologies</span>
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary">
          <ul className={styles.navList}>
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link className={styles.navLink} href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link className="btn btnPrimary" href="/book-consultation">
                Book consultation
              </Link>
            </li>
          </ul>
        </nav>

        <details className={styles.mobileNav}>
          <summary className={styles.summary}>Menu</summary>
          <div className={styles.mobilePanel}>
            <nav aria-label="Mobile primary">
              <ul className={styles.mobileList}>
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <Link className={styles.mobileLink} href={l.href}>
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link className={`btn btnPrimary`} href="/book-consultation">
                    Book consultation
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
