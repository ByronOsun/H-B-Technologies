# VIZIA Technologies — Website

Marketing website and content editor for [VIZIA Technologies](https://vizia.co.ke): service pages, blog, consultation booking, and a password-protected visual editor at `/admin`.

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router) with React 19 and TypeScript
- [Supabase](https://supabase.com) (`@supabase/supabase-js`) for editable site content and media uploads
- CSS Modules for styling
- The consultation form is forwarded to the separate Express API in [`../hb-technologies-api`](../hb-technologies-api)

## Local development

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
```

Without Supabase configured, the admin editor reads and writes `public/site-content.json` locally.

## Environment variables

`.env.example` lists the public configuration. Server-only values are set in the hosting environment and in `.env.local` for development. Never commit real values.

| Variable | Scope | Production | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | public | Required (startup check) | Site origin for local/preview builds. Production always uses `https://vizia.co.ke`. |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Required (startup check) | Supabase project |
| `ADMIN_PASSWORD` | server | Required | Password for `/admin`. If unset, a built-in default is used; never set it to an empty value. |
| `SUPABASE_SERVICE_ROLE_KEY` | server | Required | Content saves and media uploads from the admin editor |
| `API_URL` | server | Required | Base URL of the Express API used by `/api/consultation` |
| `INTERNAL_API_SECRET` | server | Optional | Shared secret sent to the Express API; must match the API's value |
| `VIZIA_DOMAIN_NAME` | server | Optional | Canonical host override (non-production only) |
| `NEXT_PUBLIC_API_URL` | public | Optional | Fallback for `API_URL` |
| `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_CLARITY_ID` | public | Optional | Analytics |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION` | public / server | Optional | Search-console verification tags |

"Required (startup check)" variables are enforced by `src/lib/env-validation.ts`; the server will not start in production without them.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type-check |

There is no automated test suite in this package yet.

## Project structure

```
src/
  app/            Routes (pages, API route handlers, sitemap, robots, manifest, OG image)
    admin/        Visual content editor
    api/          Route handlers: site-content, hero-config, upload, consultation
    favicon.ico, icon.png, apple-icon.png   Browser and app icons
  components/     Shared UI (header, footer, hero, forms)
  content/        Static service and blog content
  lib/            SEO, site URL, security headers, Supabase and analytics helpers
  proxy.ts        Host canonicalisation, HTTPS, rate limiting, security headers
public/           Static assets, including the official logo (vizia-logo.png)
```

## Deployment

Production is served at `https://vizia.co.ke`; `www.vizia.co.ke` redirects to it. Deployment and hosting steps are documented in [`../docs/deployment.md`](../docs/deployment.md).
