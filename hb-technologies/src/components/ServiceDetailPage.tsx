import type { Service } from "@/content/services";
import { getServiceBySlug } from "@/content/services";
import Link from "next/link";
import marketing from "@/styles/marketing.module.css";

type Props = {
  slug: string;
};

function buildSeoSummary(service: Service) {
  const keywords = service.keywords.slice(0, 4).join(", ");
  return `${service.name} services for teams that need ${keywords}. We design secure, SEO-ready, and scalable delivery plans tailored to your business goals.`;
}

function buildAudience(service: Service) {
  return [
    `Businesses that need ${service.name.toLowerCase()} with strong security and performance foundations.`,
    `Teams that want SEO-friendly, conversion-focused digital experiences backed by reliable engineering.`,
    `Organizations that need a clear roadmap, predictable delivery, and long-term maintainability.`,
  ];
}

export default function ServiceDetailPage({ slug }: Props) {
  const service = getServiceBySlug(slug);

  if (!service) {
    return <div className="container">Service not found</div>;
  }

  const seoSummary = buildSeoSummary(service);
  const audience = buildAudience(service);

  return (
    <section className="section">
      <div className="container">
        <div className={marketing.stack2}>
          <p className="eyebrow">Professional service</p>
          <h1>{service.name}</h1>
          <p className={`muted ${marketing.lead}`}>{service.summary}</p>
          <p className="muted">{seoSummary}</p>
        </div>

        <div className={marketing.twoCol}>
          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>What this service solves</h2>
            <p className="muted">
              We focus on reducing risk, improving search visibility, and delivering a
              better user experience with measurable business outcomes.
            </p>
            <ul>
              {service.problem.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Why clients choose H&B Technologies</h2>
            <ul>
              {service.benefits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Delivery approach</h2>
            <p className="muted">
              Every engagement is planned around security-first delivery, scalable
              implementation, and clear acceptance criteria.
            </p>
            <ul>
              {service.solution.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Core technologies and capabilities</h2>
            <ul>
              {service.technologies.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Who this service is for</h2>
            <ul>
              {audience.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>SEO and content focus</h2>
            <p className="muted">
              {service.name}, {service.keywords.join(", ")}, secure development,
              performance optimization, and conversion-focused digital delivery.
            </p>
            <div className={marketing.stack2}>
              {service.keywords.map((keyword) => (
                <p key={keyword} className={`muted ${marketing.kicker}`}>
                  {keyword}
                </p>
              ))}
            </div>
          </article>
        </div>

        <div className={`card ${marketing.pad4} ${marketing.mt4}`}>
          <h2>Talk to an engineer</h2>
          <p className="muted">
            Get a scoped plan, timeline, and delivery strategy for {service.name.toLowerCase()}.
          </p>
          <div className={marketing.mt2}>
            <Link className="btn btnPrimary" href="/book-consultation">
              Book consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
