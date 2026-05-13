import type { Metadata } from "next";

import marketing from "@/styles/marketing.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how H&B Technologies delivers secure-by-design engineering and enterprise-grade infrastructure.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <section className="section">
      <div className="container">
        <h1>About H&B Technologies</h1>
        <p className={`muted ${marketing.lead}`}>
          We’re a software engineering and technology solutions partner focused
          on security, performance, and long-term maintainability.
        </p>

        <div className={marketing.twoCol}>
          <div className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Who we serve</h2>
            <ul>
              <li>SMEs building reliable customer-facing platforms</li>
              <li>Startups moving fast without sacrificing security</li>
              <li>Enterprises modernizing systems and infrastructure</li>
              <li>Government institutions requiring robust controls</li>
            </ul>
          </div>

          <div className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Why H&B</h2>
            <ul>
              <li>Secure-by-design engineering aligned to OWASP Top 10</li>
              <li>AI-driven automation that ships with measurable outcomes</li>
              <li>Enterprise-grade infrastructure patterns and governance</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
