import type { HeroConfig } from "@/components/HeroSection";

/* ── Types ────────────────────────────────────────────────────────── */

export interface NavLink {
  label: string;
  href: string;
}

export interface NavSection {
  links: NavLink[];
  ctaLabel: string;
  ctaHref: string;
}

export interface AboutCard {
  title: string;
  type: "paragraph" | "list" | "numbered-list";
  content?: string;
  items?: string[];
}

export interface AboutSection {
  heading: string;
  lead: string;
  cards: AboutCard[];
}

export interface ServicePageItem {
  slug: string;
  name: string;
  summary: string;
  full_description: string;
  technologies: string[];
  benefits: string[];
  case_examples: string[];
}

export interface ServicesPageSection {
  heading: string;
  lead: string;
  items: ServicePageItem[];
}

export interface TeamMember {
  name: string;
  role: string;
  photo: string;
  bio: string;
}

export interface TeamSection {
  enabled: boolean;
  badge: string;
  heading: string;
  intro: string;
  members: TeamMember[];
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

export interface DeliverCard {
  icon: string;
  title: string;
  desc: string;
  href: string;
}

export interface WhyItem {
  icon: string;
  title: string;
  copy: string;
}

export interface IndustryItem {
  name: string;
  icon: string;
  desc: string;
}

export interface StackCategory {
  title: string;
  items: string[];
}

export interface TestimonialItem {
  quote: string;
  name: string;
  org: string;
  initials: string;
}

export interface SiteContent {
  nav: NavSection;
  hero: HeroConfig;
  stats: StatItem[];
  deliver: {
    badge: string;
    heading: string;
    intro: string;
    cards: DeliverCard[];
  };
  why: {
    badge: string;
    heading: string;
    intro: string;
    items: WhyItem[];
  };
  industries: {
    badge: string;
    heading: string;
    intro: string;
    items: IndustryItem[];
  };
  stack: {
    badge: string;
    heading: string;
    intro: string;
    items: StackCategory[];
  };
  testimonials: {
    badge: string;
    heading: string;
    intro: string;
    items: TestimonialItem[];
  };
  cta: {
    badge: string;
    heading: string;
    copy: string;
  };
  contact: {
    email: string;
    phones: string[];
  };
  team: TeamSection;
  about: AboutSection;
  services_page: ServicesPageSection;
}

/* ── Server-side loader ───────────────────────────────────────────── */

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url || !key || url.includes("YOUR_PROJECT_ID")) return null;
  // Dynamic import to avoid bundling supabase into client-side code
  const { createClient } = require("@supabase/supabase-js");
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function loadSiteContent(): Promise<SiteContent> {
  // Try Supabase DB first (production)
  try {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("site_content")
        .select("content")
        .eq("id", 1)
        .single();
      if (!error && data?.content) {
        return data.content as SiteContent;
      }
    }
  } catch {
    /* fall through */
  }

  // Fallback: static public file (local dev or first deploy before any save)
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/site-content.json`, {
      next: { revalidate: 30 },
    });
    if (res.ok) return res.json();
  } catch {
    /* fall through to default */
  }

  return (await import("../../public/site-content.json")) as unknown as SiteContent;
}
