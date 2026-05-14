import { getServiceBySlug } from '@/content/services';
import marketing from '@/styles/marketing.module.css';
import Link from 'next/link';

export default function Page() {
  const s = getServiceBySlug('smart-cctv-installation');
  if (!s) return <div className="container">Service not found</div>;

  return (
    <section className="section">
      <div className="container">
        <h1>{s.name}</h1>
        <p className={`muted ${marketing.lead}`}>{s.summary}</p>
        <div className={marketing.gridCards}>
          <article className={`card ${marketing.cardPad}`}>
            <h2>Security best practices</h2>
            <ul>{s.solution.map((p) => <li key={p}>{p}</li>)}</ul>
          </article>
          <article className={`card ${marketing.cardPad}`}>
            <h2>Deployment</h2>
            <ul>{s.technologies.map((p) => <li key={p}>{p}</li>)}</ul>
          </article>
        </div>
        <div className={marketing.mt4}>
          <Link className="btn btnPrimary" href="/book-consultation">Book consultation</Link>
        </div>
      </div>
    </section>
  );
}
