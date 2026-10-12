import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

const BRAND_BACKGROUND = "#080102";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "VIZIA",
    description: siteConfig.description,
    lang: siteConfig.language,
    start_url: "/",
    scope: "/",
    // Keep normal browser behaviour; the site is not packaged as an installable app.
    display: "browser",
    theme_color: BRAND_BACKGROUND,
    background_color: BRAND_BACKGROUND,
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
