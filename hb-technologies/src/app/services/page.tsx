import type { Metadata } from "next";
import Link from "next/link";

import { services } from "@/content/services";
import marketing from "@/styles/marketing.module.css";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore H&B Technologies services: web and mobile development, cyber security, data & AI, network engineering, automation, IoT, and Smart CCTV.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <section className="section">
      <div className="container">
        <h1>Services</h1>
        <p className={`muted ${marketing.lead}`}>
          Each engagement is scoped with security requirements, clear acceptance
          criteria, and measurable outcomes.
        </p>

        <div className={marketing.gridCards}>
          {services.map((s) => (
            <article key={s.slug} className="card">
              <div className={marketing.cardBody}>
                <h2 className={marketing.cardTitle}>{s.name}</h2>
                <p className={`muted ${marketing.cardDesc}`}>{s.summary}</p>
                <div className={marketing.mt2}>
                  <Link className="btn" href={`/services/${s.slug}`}>
                    View details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
