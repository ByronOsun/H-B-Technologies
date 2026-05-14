import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { blogPosts as staticBlogPosts } from "@/content/blog";
import { getBlogPosts } from "@/lib/api";
import marketing from "@/styles/marketing.module.css";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical notes on secure engineering, performance, Supabase RLS, and AI delivery.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    title: "H&B Technologies Blog",
    description:
      "Practical notes on secure engineering, performance, Supabase RLS, and AI delivery.",
    url: "/blog",
  },
};

export const revalidate = 60;

function toDisplayDate(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function BlogIndexPage() {
  const res = await getBlogPosts({ revalidate });
  const posts = res.ok
    ? res.data
    : staticBlogPosts.map((p, idx) => ({
        id: idx + 1,
        slug: p.slug,
        title: p.title,
        excerpt: p.description,
        featured_image: "",
        author: "H&B Technologies",
        created_at: p.date,
      }));

  return (
    <section className="section">
      <div className="container">
        <h1>Blog</h1>
        <p className={`muted ${marketing.lead}`}>
          Security, performance, and delivery practices — written for teams that
          ship.
        </p>

        <div className={marketing.gridCards}>
          {posts.map((p) => (
            <article key={p.slug} className="card">
              {p.featured_image ? (
                <div className={marketing.cardMedia}>
                  <Image
                    className={marketing.cardImage}
                    src={p.featured_image}
                    alt={`Featured image for ${p.title}`}
                    width={1200}
                    height={630}
                    unoptimized
                  />
                </div>
              ) : null}
              <div className={marketing.cardBody}>
                <h2 className={marketing.cardTitle}>
                  <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                </h2>
                <p className={`muted ${marketing.cardDesc}`}>{p.excerpt}</p>
                <p className={`muted ${marketing.cardDesc}`}>
                  {toDisplayDate(p.created_at)}
                  {p.author ? ` • ${p.author}` : ""}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
