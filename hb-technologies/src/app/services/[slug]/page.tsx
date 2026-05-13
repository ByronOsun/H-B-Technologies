import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getServiceBySlug, services } from "@/content/services";
import marketing from "@/styles/marketing.module.css";
import { getSiteUrl } from "@/lib/site";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const service = getServiceBySlug(params.slug);
  if (!service) return {};

  return {
    title: service.name,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
    keywords: service.keywords,
    openGraph: {
      type: "website",
      title: service.name,
      description: service.summary,
      url: `/services/${service.slug}`,
    },
  };
}

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `H&B Technologies — ${service.name}`,
    url: new URL(`/services/${service.slug}`, getSiteUrl()).toString(),
    serviceType: service.name,
    description: service.summary,
    areaServed: "Global",
  };

  return (
    <section className="section">
      <div className="container">
        <h1>{service.name}</h1>
        <p className={`muted ${marketing.lead}`}>{service.summary}</p>

        <div className={marketing.twoCol}>
          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Problem</h2>
            <ul>
              {service.problem.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </article>

          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Solution</h2>
            <ul>
              {service.solution.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </article>

          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Technology stack</h2>
            <ul>
              {service.technologies.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </article>

          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Benefits</h2>
            <ul>
              {service.benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </article>
        </div>

        <div className={`card ${marketing.pad4} ${marketing.mt4}`}>
          <h2>Talk to an engineer</h2>
          <p className="muted">
            Get a scoped plan, timeline, and security considerations for this
            service.
          </p>
          <div className={marketing.mt2}>
            <Link className="btn btnPrimary" href="/book-consultation">
              Book consultation
            </Link>
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </div>
    </section>
  );
}
