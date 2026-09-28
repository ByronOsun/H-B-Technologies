import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

/**
 * Production robots.txt
 *
 * Allows search engines to crawl all public pages while blocking
 * administrative, API, and internal utility routes.
 *
 * Public pages:
 * - /
 * - /services/*
 * - /blog/*
 * - /about
 * - /contact
 * - /book-consultation
 *
 * Blocked:
 * - /admin/*
 * - /api/*
 *
 * Sitemap:
 * https://vizia.co.ke/sitemap.xml
 */

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api",
          "/api/",
        ],
      },

      // Optional: Block commercial SEO crawlers
      {
        userAgent: "AhrefsBot",
        disallow: "/",
      },
      {
        userAgent: "SemrushBot",
        disallow: "/",
      },
      {
        userAgent: "DotBot",
        disallow: "/",
      },

      // Optional: Block AI crawlers
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "ChatGPT-User",
        disallow: "/",
      },
      {
        userAgent: "Claude-Web",
        disallow: "/",
      },
      {
        userAgent: "Bard-Web",
        disallow: "/",
      },
    ],

    sitemap: new URL("/sitemap.xml", base).toString(),
  };
}