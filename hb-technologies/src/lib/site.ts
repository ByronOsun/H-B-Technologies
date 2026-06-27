export const siteConfig = {
  name: "VIZIA Technologies",
  description:
    "Secure-by-design software engineering and technology solutions: web & mobile development, cyber security, data & AI, network engineering, automation, IoT, and Smart CCTV.",
  keywords: [
    "software development company",
    "web development",
    "mobile app development",
    "cyber security firm",
    "AI solutions provider",
    "machine learning",
    "natural language processing",
    "IoT automation company",
    "smart CCTV installation",
    "IT consultation",
  ],
  jsonLdOrganization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VIZIA Technologies",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    description:
      "Secure-by-design software engineering and technology solutions for startups, SMEs, enterprises, and government institutions.",
    knowsAbout: [
      "Web Development",
      "Mobile App Development",
      "Cyber Security",
      "Data Science",
      "Network Engineering",
      "Automation Systems",
      "IoT Solutions",
      "Smart CCTV Installation",
      "IT Consultation",
      "Artificial Intelligence",
      "Machine Learning",
      "Natural Language Processing",
    ],
  },
} as const;

export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return new URL(raw);
}
