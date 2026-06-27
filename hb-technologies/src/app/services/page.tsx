import type { Metadata } from "next";
import Link from "next/link";

import { services as staticServices } from "@/content/services";
import { getServices } from "@/lib/api";
import marketing from "@/styles/marketing.module.css";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore VIZIA Technologies services: web and mobile development, cyber security, data & AI, network engineering, automation, IoT, and Smart CCTV.",
  alternates: { canonical: "/services" },
  openGraph: {
    type: "website",
    title: "VIZIA Technologies Services",
    description:
      "Security-first engineering services across web, mobile, AI, infrastructure, and cyber security.",
    url: "/services",
  },
};

export const revalidate = 60;

export default async function ServicesPage() {
  const res = await getServices({ revalidate });
  const services = res.ok
    ? res.data
    : staticServices.map((s, idx) => ({
        id: idx + 1,
        slug: s.slug,
        title: s.name,
        short_description: s.summary,
        created_at: null,
      }));

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
                <h2 className={marketing.cardTitle}>{s.title}</h2>
                <p className={`muted ${marketing.cardDesc}`}>{s.short_description}</p>
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
