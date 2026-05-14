import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getSiteUrl } from "@/lib/site";
import { getBlogPost } from "@/lib/api";
import marketing from "@/styles/marketing.module.css";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const res = await getBlogPost(params.slug, { revalidate });
  if (!res.ok) return {};
  const post = res.data;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      images: post.featured_image ? [{ url: post.featured_image }] : undefined,
    },
    twitter: {
      card: post.featured_image ? "summary_large_image" : "summary",
      title: post.title,
      description: post.excerpt,
      images: post.featured_image ? [post.featured_image] : undefined,
    },
  };
}

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

function splitParagraphs(content: string) {
  return String(content || "")
    .split(/\n\s*\n/g)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const res = await getBlogPost(params.slug, { revalidate });
  if (!res.ok) notFound();
  const post = res.data;

  const paragraphs = splitParagraphs(post.content);

  const url = new URL(`/blog/${post.slug}`, getSiteUrl()).toString();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.created_at,
    url,
    image: post.featured_image || undefined,
    author: {
      "@type": "Organization",
      name: post.author || "H&B Technologies",
    },
  };

  return (
    <article className="section">
      <div className="container">
        <h1>{post.title}</h1>
        <p className="muted">
          {toDisplayDate(post.created_at)}
          {post.author ? ` • ${post.author}` : ""}
        </p>

        {post.featured_image ? (
          <div className={marketing.postMedia}>
            <Image
              className={marketing.postImage}
              src={post.featured_image}
              alt={`Featured image for ${post.title}`}
              width={1200}
              height={630}
              priority={false}
              unoptimized
            />
          </div>
        ) : null}

        <p className={`muted ${marketing.mt2}`}>{post.excerpt}</p>

        <div className={marketing.prose}>
          {paragraphs.length > 0
            ? paragraphs.map((p) => <p key={p}>{p}</p>)
            : null}
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </div>
    </article>
  );
}
