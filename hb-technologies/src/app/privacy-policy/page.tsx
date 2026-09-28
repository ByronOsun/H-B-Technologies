import Link from "next/link";

import Breadcrumbs from "@/components/Breadcrumbs";
import { createPageMetadata, noIndexFollowRobots } from "@/lib/seo";
import marketing from "@/styles/marketing.module.css";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "Learn how VIZIA Technologies handles contact submissions, analytics, cookies, and privacy choices.",
  path: "/privacy-policy",
  robots: noIndexFollowRobots,
});

export default function PrivacyPolicyPage() {
  return (
    <section className="section">
      <div className="container">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
        <h1>Privacy Policy</h1>
        <p className={`muted ${marketing.lead}`}>
          VIZIA Technologies uses information submitted through its forms and contact channels to respond to enquiries and deliver requested services.
        </p>

        <div className={marketing.stack}>
          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Information we receive</h2>
            <p className="muted">
              Contact and consultation forms may collect the details you choose to submit, such as your name, email address, phone number, company, and project requirements.
            </p>
          </article>

          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Cookies and analytics</h2>
            <p className="muted">
              Optional analytics and measurement tools may be enabled through the site&apos;s consent controls. You can reject optional categories or change your choices through the cookie preferences interface.
            </p>
          </article>

          <article className={`card ${marketing.pad3}`}>
            <h2 className={marketing.sectionTitle}>Questions</h2>
            <p className="muted">
              For privacy questions or requests about information you submitted, please <Link href="/contact">contact VIZIA Technologies</Link>.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
