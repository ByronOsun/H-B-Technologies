-- H&B Technologies complete Supabase schema
-- Paste this entire file into the Supabase SQL editor and run it once.

create extension if not exists pgcrypto;

-- Core content tables
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

-- Consultation requests
create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  full_name varchar(120) not null,
  email varchar(254) not null,
  phone varchar(40) not null default '',
  company varchar(120) not null default '',
  service_interest varchar(120) not null,
  message text not null,
  source varchar(50) not null default 'contact',
  status varchar(50) not null default 'new',
  ip_address varchar(45),
  email_sent boolean not null default false,
  email_sent_at timestamptz,
  email_error text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Audit and request logs
create table if not exists public.audit_logs (
  id bigserial primary key,
  level text not null,
  category text not null,
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Optional auth users table
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists services_slug_idx on public.services (slug);
create index if not exists blog_posts_created_at_idx on public.blog_posts (created_at desc);
create index if not exists blog_posts_slug_idx on public.blog_posts (slug);
create index if not exists consultations_created_at_idx on public.consultations (created_at desc);
create index if not exists consultations_email_idx on public.consultations (email);
create index if not exists consultations_status_idx on public.consultations (status);
create index if not exists consultations_source_idx on public.consultations (source);
create index if not exists audit_logs_created_at_idx on public.audit_logs (created_at desc);
create index if not exists audit_logs_category_idx on public.audit_logs (category);
create index if not exists audit_logs_level_idx on public.audit_logs (level);

-- Row Level Security
alter table public.services enable row level security;
alter table public.blog_posts enable row level security;
alter table public.consultations enable row level security;
alter table public.users enable row level security;
alter table public.audit_logs enable row level security;

-- Public read access
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'services'
      and policyname = 'services_read_public'
  ) then
    create policy "services_read_public"
      on public.services for select
      using (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'blog_posts'
      and policyname = 'blog_read_public'
  ) then
    create policy "blog_read_public"
      on public.blog_posts for select
      using (true);
  end if;
end $$;

-- Public insert access for consultations
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'consultations'
      and policyname = 'consultations_insert_public'
  ) then
    create policy "consultations_insert_public"
      on public.consultations for insert
      with check (true);
  end if;
end $$;

-- Documentation comments
comment on table public.consultations is 'Stores consultation requests from website contact forms';
comment on column public.consultations.status is 'Tracking status: new (unreviewed), contacted (client reached), closed (resolved)';
comment on column public.consultations.email_sent is 'Whether confirmation email was sent successfully';
comment on column public.consultations.ip_address is 'Client IP for audit trail and spam detection';
