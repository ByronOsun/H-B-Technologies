import type { MetadataRoute } from "next";

import { blogPosts as staticBlogPosts } from "@/content/blog";
import { services as staticServices } from "@/content/services";
import { getBlogPosts, getServices } from "@/lib/api";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/blog",
    "/contact",
    "/book-consultation",
  ];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: new URL(path || "/", base).toString(),
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  // Dynamic routes: prefer API (Supabase-backed) but keep a safe static fallback.
  // Note: sitemap runs server-side; keep failures non-fatal.
  // We intentionally do not throw here.
  const [servicesRes, blogRes] = await Promise.all([
    getServices({ revalidate: 3600 }),
    getBlogPosts({ revalidate: 3600 }),
  ]);

  const services = servicesRes.ok
    ? servicesRes.data
    : staticServices.map((s) => ({ slug: s.slug }));

  const blogPosts = blogRes.ok
    ? blogRes.data
    : staticBlogPosts.map((p) => ({ slug: p.slug, created_at: p.date }));

  for (const s of services) {
    entries.push({
      url: new URL(`/services/${s.slug}`, base).toString(),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  for (const p of blogPosts) {
    entries.push({
      url: new URL(`/blog/${p.slug}`, base).toString(),
      lastModified: p.created_at ? new Date(p.created_at) : now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
