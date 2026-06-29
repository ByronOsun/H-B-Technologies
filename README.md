# Vizia Technologies

Enterprise-grade website + API scaffold (Next.js App Router + Node/Express + Supabase).

## Scope (Phase 1 baseline)
- Frontend: Next.js (SSR/SSG), TypeScript, semantic HTML, custom 8px spacing system, high-contrast typography
- Backend: Node.js + Express REST API, JWT auth, security middleware
- Data: Supabase Postgres + Storage + RLS (SQL scripts included)
- SEO: metadata per page, robots.txt, sitemap.xml, canonical URLs, OpenGraph/Twitter, JSON-LD

## Repos/Folders
- `hb-technologies/` — Next.js frontend
- `hb-technologies-api/` — Express API

## Quick start
### Frontend
```bash
cd hb-technologies
npm install
npm run dev
```

### Backend
```bash
cd hb-technologies-api
npm install
cp .env.example .env
npm run dev
```

## Environment variables
Frontend uses **only** public values (`NEXT_PUBLIC_*`).
Backend holds all secrets (Supabase service role, JWT secret).

## Security rule
Never expose Supabase service role key to the frontend.
