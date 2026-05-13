import type { Metadata } from "next";
import Link from "next/link";

import { ConsultationForm } from "@/components/ConsultationForm";
import marketing from "@/styles/marketing.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact H&B Technologies — secure engineering, AI automation, and enterprise infrastructure.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="section">
      <div className="container">
        <h1>Contact</h1>
        <p className={`muted ${marketing.lead}`}>
          Tell us what you’re building. We’ll respond with next steps and a
          scoping plan.
        </p>

        <div className={marketing.twoCol}>
          <div className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Send a message</h2>
            <ConsultationForm source="contact" />
          </div>

          <div className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>What happens next</h2>
            <ol>
              <li>We confirm goals, constraints, and timelines</li>
              <li>We identify security and performance requirements</li>
              <li>We deliver a scoped plan and delivery roadmap</li>
            </ol>
            <p className={`muted ${marketing.mt2}`}>
              Prefer a scheduled call? Use the consultation page.
            </p>
            <Link className="btn" href="/book-consultation">
              Book consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
