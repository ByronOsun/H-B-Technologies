-- Enable Row Level Security (RLS)

alter table public.services enable row level security;
alter table public.blog_posts enable row level security;
alter table public.consultations enable row level security;
alter table public.users enable row level security;

-- Public read access (adjust as needed)
create policy if not exists "services_read_public"
  on public.services for select
  using (true);

create policy if not exists "blog_read_public"
  on public.blog_posts for select
  using (true);

-- Consultations: allow inserts only (public) - consider adding rate limiting and validation
create policy if not exists "consultations_insert_public"
  on public.consultations for insert
  with check (true);

-- Users: no public access by default
