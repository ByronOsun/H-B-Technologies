-- Audit and request logging table
-- Apply in Supabase SQL editor after the base schema.

create table if not exists public.audit_logs (
  id bigserial primary key,
  level text not null,
  category text not null,
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_created_at_idx on public.audit_logs (created_at desc);
create index if not exists audit_logs_category_idx on public.audit_logs (category);
create index if not exists audit_logs_level_idx on public.audit_logs (level);

alter table public.audit_logs enable row level security;