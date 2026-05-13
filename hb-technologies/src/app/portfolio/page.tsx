import type { Metadata } from "next";

import { portfolioProjects } from "@/content/portfolio";
import marketing from "@/styles/marketing.module.css";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Case studies and delivery outcomes across secure product engineering, data & AI, and infrastructure.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <section className="section">
      <div className="container">
        <h1>Portfolio</h1>
        <p className={`muted ${marketing.lead}`}>
          Representative case studies focused on outcomes, security controls, and
          maintainable architecture.
        </p>

        <div className={marketing.gridCards}>
          {portfolioProjects.map((p) => (
            <article key={p.slug} className="card">
              <div className={marketing.cardBody}>
                <h2 className={marketing.cardTitle}>{p.title}</h2>
                <p className={`muted ${marketing.cardDesc}`}>{p.summary}</p>
                <h3 className={marketing.mt2}>Outcomes</h3>
                <ul>
                  {p.outcomes.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
                <p className={`muted ${marketing.cardDesc}`}>
                  Stack: {p.stack.join(", ")}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
