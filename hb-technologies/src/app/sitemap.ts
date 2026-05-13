import type { MetadataRoute } from "next";

import { blogPosts } from "@/content/blog";
import { services } from "@/content/services";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/portfolio",
    "/blog",
    "/careers",
    "/contact",
    "/book-consultation",
  ];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: new URL(path || "/", base).toString(),
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

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
      lastModified: new Date(p.date),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
