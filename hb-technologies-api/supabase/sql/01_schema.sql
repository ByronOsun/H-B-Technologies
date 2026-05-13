-- H&B Technologies baseline schema
-- Apply in Supabase SQL editor.

create table if not exists public.services (
  id bigserial primary key,
  slug text not null unique,
  name text not null,
  summary text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.portfolio_projects (
  id bigserial primary key,
  slug text not null unique,
  title text not null,
  summary text not null,
  outcomes text[] not null default '{}',
  stack text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id bigserial primary key,
  slug text not null unique,
  title text not null,
  description text not null,
  body text not null default '',
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.consultations (
  id bigserial primary key,
  name text not null,
  email text not null,
  phone text not null default '',
  company text not null default '',
  service text not null,
  message text not null,
  source text not null default 'contact',
  created_at timestamptz not null default now()
);

create table if not exists public.careers (
  id bigserial primary key,
  title text not null,
  location text not null default 'Remote',
  type text not null default 'Full-time',
  description text not null default '',
  created_at timestamptz not null default now()
);

-- Minimal users table for custom JWT auth (optional)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists consultations_created_at_idx on public.consultations (created_at desc);
create index if not exists blog_posts_published_at_idx on public.blog_posts (published_at desc);
