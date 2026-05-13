import type { Metadata } from "next";

import marketing from "@/styles/marketing.module.css";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join H&B Technologies to build secure, high-performance systems across web, AI, and infrastructure.",
  alternates: { canonical: "/careers" },
};

const roles = [
  {
    title: "Full-Stack Engineer",
    summary:
      "Build SSR/SSG web apps, secure APIs, and production-ready integrations.",
  },
  {
    title: "Security Engineer (AppSec)",
    summary:
      "Threat model systems, review code, and help ship OWASP-aligned defaults.",
  },
  {
    title: "Data / ML Engineer",
    summary:
      "Design data models and deliver reliable pipelines and applied ML systems.",
  },
] as const;

export default function CareersPage() {
  return (
    <section className="section">
      <div className="container">
        <h1>Careers</h1>
        <p className={`muted ${marketing.lead}`}>
          We’re building a team that values security, clarity, and pragmatic
          delivery.
        </p>

        <div className={marketing.twoCol}>
          <div className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>How we work</h2>
            <ul>
              <li>Security and performance are default requirements</li>
              <li>Clear engineering ownership and measurable outcomes</li>
              <li>Strong documentation and dependable delivery practices</li>
            </ul>
          </div>

          <div className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Open roles</h2>
            <div className={marketing.stack2}>
              {roles.map((r) => (
                <div key={r.title} className={`card ${marketing.pad2}`}>
                  <h3>{r.title}</h3>
                  <p className="muted">{r.summary}</p>
                </div>
              ))}
            </div>
            <p className={`muted ${marketing.mt2}`}>
              To apply, send a short note and your CV to: careers@hb-technologies
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
