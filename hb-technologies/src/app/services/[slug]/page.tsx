import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getServiceBySlug, services as staticServices } from "@/content/services";
import { getService, getServices } from "@/lib/api";
import marketing from "@/styles/marketing.module.css";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 60;

type ServiceView = {
  slug: string;
  title: string;
  short_description: string;
  full_description: string;
  technologies: string[];
  benefits: string[];
  case_examples: string[];
  keywords: string[];
};

function toViewFromStatic(slug: string): ServiceView | null {
  const s = getServiceBySlug(slug);
  if (!s) return null;

  return {
    slug: s.slug,
    title: s.name,
    short_description: s.summary,
    full_description: s.summary,
    technologies: s.technologies,
    benefits: s.benefits,
    case_examples: [
      "Discovery and architecture workshop",
      "Secure API + data model implementation",
      "Deployment, monitoring, and maintenance plan",
    ],
    keywords: s.keywords,
  };
}

function mergeServiceView(fallback: ServiceView, apiData?: Partial<ServiceView>): ServiceView {
  if (!apiData) return fallback;

  return {
    ...fallback,
    ...apiData,
    title: apiData.title || fallback.title,
    short_description: apiData.short_description || fallback.short_description,
    full_description: apiData.full_description || fallback.full_description,
    technologies: apiData.technologies?.length ? apiData.technologies : fallback.technologies,
    benefits: apiData.benefits?.length ? apiData.benefits : fallback.benefits,
    case_examples: apiData.case_examples?.length ? apiData.case_examples : fallback.case_examples,
    keywords: apiData.keywords?.length ? apiData.keywords : fallback.keywords,
  };
}

async function resolveService(slug: string) {
  const fallback = toViewFromStatic(slug);
  if (!fallback) return null;

  const apiRes = await getService(slug, { revalidate });
  if (!apiRes.ok) return fallback;

  return mergeServiceView(fallback, {
    slug: apiRes.data.slug,
    title: apiRes.data.title,
    short_description: apiRes.data.short_description,
    full_description: apiRes.data.full_description,
    technologies: apiRes.data.technologies,
    benefits: apiRes.data.benefits,
    case_examples: apiRes.data.case_examples,
    keywords: apiRes.data.keywords,
  });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const service = await resolveService(params.slug);
  if (!service) return {};

  return {
    title: service.title,
    description: service.short_description,
    alternates: { canonical: `/services/${service.slug}` },
    keywords: service.keywords,
    openGraph: {
      type: "website",
      title: service.title,
      description: service.short_description,
      url: `/services/${service.slug}`,
    },
    twitter: {
      card: "summary",
      title: service.title,
      description: service.short_description,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = await resolveService(params.slug);
  if (!service) notFound();

  const relatedRes = await getServices({ revalidate });
  const related = (relatedRes.ok
    ? relatedRes.data.map((s) => ({ slug: s.slug, title: s.title }))
    : staticServices.map((s) => ({ slug: s.slug, title: s.name }))
  )
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `H&B Technologies — ${service.title}`,
    url: new URL(`/services/${service.slug}`, getSiteUrl()).toString(),
    serviceType: service.title,
    description: service.short_description,
    areaServed: "Global",
    provider: {
      "@type": "Organization",
      name: "H&B Technologies",
    },
  };

  return (
    <section className="section">
      <div className="container">
        <h1>{service.title}</h1>
        <p className={`muted ${marketing.lead}`}>{service.short_description}</p>

        <div className={marketing.twoCol}>
          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Overview</h2>
            <p className="muted">{service.full_description}</p>
          </article>

          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Technologies used</h2>
            {service.technologies.length ? (
              <ul>
                {service.technologies.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            ) : (
              <p className="muted">Selected based on your requirements.</p>
            )}
          </article>

          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Benefits</h2>
            {service.benefits.length ? (
              <ul>
                {service.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            ) : (
              <p className="muted">
                Security-first delivery, improved reliability, and clearer operations.
              </p>
            )}
          </article>

          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Case examples</h2>
            {service.case_examples.length ? (
              <ul>
                {service.case_examples.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            ) : (
              <ul>
                <li>Secure implementation with validated inputs and access control</li>
                <li>Performance and SEO improvements for production traffic</li>
                <li>Deployment hardening and monitoring for reliable operations</li>
              </ul>
            )}
          </article>
        </div>

        {related.length ? (
          <div className={`card ${marketing.pad4} ${marketing.mt4}`}>
            <h2>Related services</h2>
            <p className="muted">
              Explore additional capabilities that complement this engagement.
            </p>
            <div className={marketing.mt2}>
              {related.map((s) => (
                <Link key={s.slug} className="btn" href={`/services/${s.slug}`}>
                  {s.title}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className={`card ${marketing.pad4} ${marketing.mt4}`}>
          <h2>Talk to an engineer</h2>
          <p className="muted">
            Get a scoped plan, timeline, and security considerations for this service.
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
