import type { Metadata } from "next";
import Link from "next/link";
import { loadSiteContent } from "@/lib/content";
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

export const revalidate = 0;

export default async function ServicesPage() {
  const c = await loadSiteContent();
  const { heading, lead, items } = c.services_page;

  return (
    <section className="section">
      <div className="container">
        <h1>{heading}</h1>
        <p className={`muted ${marketing.lead}`}>{lead}</p>

        <div className={marketing.gridCards}>
          {items.map((s) => (
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
