import type { Metadata } from "next";
import Link from "next/link";

import { blogPosts } from "@/content/blog";
import marketing from "@/styles/marketing.module.css";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical notes on secure engineering, performance, Supabase RLS, and AI delivery.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  return (
    <section className="section">
      <div className="container">
        <h1>Blog</h1>
        <p className={`muted ${marketing.lead}`}>
          Security, performance, and delivery practices — written for teams that
          ship.
        </p>

        <div className={marketing.gridCards}>
          {blogPosts.map((p) => (
            <article key={p.slug} className="card">
              <div className={marketing.cardBody}>
                <h2 className={marketing.cardTitle}>
                  <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                </h2>
                <p className={`muted ${marketing.cardDesc}`}>{p.description}</p>
                <p className={`muted ${marketing.cardDesc}`}>
                  {new Date(p.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  • {p.readingTime}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
