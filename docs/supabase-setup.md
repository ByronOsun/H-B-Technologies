# Supabase setup (Phase 7)

You don’t *strictly* need Supabase to view the site, but you **do** need it for:
- Storing consultation submissions (`POST /consultation`)
- Dynamic content from the API (`/services`, `/portfolio`, `/blog`)
- Custom JWT auth (`POST /auth`) if you choose to use it

This project is set up so that:
- The **Express API** talks to Supabase using the **service role key** (server-only).
- The **Next.js frontend does not talk to Supabase directly**.

## 1) Create a Supabase project
- In Supabase, create a new project (pick region closest to your users).
- After the project is ready, go to **Project Settings → API** and copy:
  - **Project URL** → `SUPABASE_URL`
  - **Service role key** → `SUPABASE_SERVICE_ROLE_KEY`

Important:
- `SUPABASE_SERVICE_ROLE_KEY` must only be set on the backend (Render), never in the frontend.

## 2) Apply schema + RLS
In Supabase, open **SQL Editor** and run these files in order:
1. `hb-technologies-api/supabase/sql/01_schema.sql` (tables + indexes)
2. `hb-technologies-api/supabase/sql/02_rls.sql` (RLS + starter policies)

Then verify in **Table Editor** that tables exist:
- `services`
- `portfolio_projects`
- `blog_posts`
- `consultations`
- `users`

And verify in **Authentication → Policies** (or the table’s policies panel) that RLS is enabled and policies exist.

## 3) Configure backend environment variables
In hb-technologies-api/.env:
- SUPABASE_URL=...
- SUPABASE_SERVICE_ROLE_KEY=...
- JWT_SECRET=... (use a long random string in production)
- CORS_ORIGINS=https://<your-frontend-domain>

Restart the API.

## 4) (Optional) Seed content
You can insert initial rows into:
- services
- portfolio_projects
- blog_posts

This is optional because:
- the current Next.js site already renders static marketing content
- the API endpoints `/services`, `/portfolio`, `/blog` return empty arrays when Supabase isn’t configured

## Notes on security
- Never put the service role key in the frontend.
- Keep RLS enabled; only grant the minimum required policies.
- Consultations are insert-only in the starter policy; adjust as needed.

## Common pitfalls
- **Forgetting to run the RLS script**: inserts/reads may fail in unexpected ways.
- **Using the anon key on the backend**: the API is designed for the service role key.
- **Wrong frontend origin**: set `CORS_ORIGINS` to your deployed frontend domain (Render/Vercel), not `localhost`.
