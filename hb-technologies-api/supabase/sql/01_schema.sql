-- H&B Technologies baseline schema
-- Apply in Supabase SQL editor.

create table if not exists public.services (
  id bigserial primary key,
  slug text not null unique,
  title text not null,
  short_description text not null,
  full_description text not null default '',
  technologies text[] not null default '{}',
  benefits text[] not null default '{}',
  case_examples text[] not null default '{}',
  keywords text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id bigserial primary key,
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null default '',
  featured_image text not null default '',
  author text not null default 'H&B Technologies',
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

-- Minimal users table for custom JWT auth (optional)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists consultations_created_at_idx on public.consultations (created_at desc);
create index if not exists blog_posts_created_at_idx on public.blog_posts (created_at desc);
create index if not exists blog_posts_slug_idx on public.blog_posts (slug);
create index if not exists services_slug_idx on public.services (slug);
