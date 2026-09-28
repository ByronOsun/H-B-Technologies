import type { MetadataRoute } from "next";

import { blogPosts as staticBlogPosts } from "@/content/blog";
import { getBlogPosts } from "@/lib/api";
import { loadSiteContent } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";
import { cleanPathname, getCanonicalServiceSlug } from "@/lib/url-governance";

/**
 * Production XML Sitemap for VIZIA Technologies
 *
 * Includes all public route-backed pages that are indexable.
 *
 * Excludes (by design):
 * - /admin (marked noindex)
 * - /api/* (API routes)
 * - /blog/external/* (marked noindex, follow - external content)
 * - /og (image generation route, not a page)
 * - /not-found (error page)
 *
 * Priorities:
 * - Homepage: 1.0 (highest)
 * - Services index: 0.8
 * - Service details: 0.8
 * - Blog index: 0.7
 * - Blog posts: 0.6
 * - About, Contact, Book: 0.7
 *
 * Change frequency:
 * - Services: monthly (change when service offerings update)
 * - Blog: monthly (change when new posts added)
 * - Static pages: weekly (change when content updated)
 * - Homepage: weekly (stats, testimonials, hero rotate)
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const seenUrls = new Set<string>();

  // Static routes with priority and change frequency
  const staticRoutes: Array<{
    path: string;
    priority: number;
    changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  }> = [
    { path: "", priority: 1.0, changeFrequency: "weekly" }, // Homepage with hero video
    { path: "/services", priority: 0.8, changeFrequency: "monthly" }, // Services index
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" }, // Blog index with featured images
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
    { path: "/book-consultation", priority: 0.7, changeFrequency: "yearly" },
  ];

  const entries: MetadataRoute.Sitemap = [];

  function addEntry(
    path: string,
    options: Pick<MetadataRoute.Sitemap[number], "lastModified" | "changeFrequency" | "priority">
  ) {
    const cleanPath = cleanPathname(path);
    const url = new URL(cleanPath || "/", base).toString();
    if (seenUrls.has(url)) return;
    seenUrls.add(url);
    entries.push({ url, ...options });
  }

  for (const route of staticRoutes) {
    addEntry(route.path, {
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    });
  }

  // Dynamic routes: prefer API (Supabase-backed) but keep a safe static fallback.
  // Note: sitemap runs server-side; keep failures non-fatal.
  const [siteContent, blogRes] = await Promise.all([
    loadSiteContent(),
    getBlogPosts({ revalidate: 3600 }),
  ]);

  // Service detail pages
  const serviceSlugs = Array.from(
    new Set(
      siteContent.services_page.items
        .map((s) => getCanonicalServiceSlug(s.slug))
        .filter(Boolean)
    )
  );

  for (const slug of serviceSlugs) {
    addEntry(`/services/${slug}`, {
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // Blog post pages must exist in the static catalog; external and unknown API records are excluded.
  const indexableBlogSlugs = new Set(staticBlogPosts.map((post) => post.slug));
  const blogPosts = blogRes.ok
    ? blogRes.data
    : staticBlogPosts.map((p) => ({ slug: p.slug, created_at: p.date }));

  for (const p of blogPosts) {
    if (!indexableBlogSlugs.has(p.slug)) continue;

    const parsedDate = p.created_at ? new Date(p.created_at) : undefined;
    addEntry(`/blog/${p.slug}`, {
      ...(parsedDate && !Number.isNaN(parsedDate.getTime())
        ? { lastModified: parsedDate }
        : {}),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
