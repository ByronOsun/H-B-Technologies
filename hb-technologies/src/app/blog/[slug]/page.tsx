import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { blogPosts, getPostBySlug } from "@/content/blog";
import { getSiteUrl } from "@/lib/site";
import marketing from "@/styles/marketing.module.css";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const url = new URL(`/blog/${post.slug}`, getSiteUrl()).toString();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url,
    author: {
      "@type": "Organization",
      name: "H&B Technologies",
    },
  };

  return (
    <article className="section">
      <div className="container">
        <h1>{post.title}</h1>
        <p className="muted">
          {new Date(post.date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}{" "}
          • {post.readingTime}
        </p>
        <p className={`muted ${marketing.mt2}`}>
          {post.description}
        </p>

        <div className={marketing.prose}>
          {post.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </div>
    </article>
  );
}
