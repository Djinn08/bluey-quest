-- Jaydan Edition: bug reports, flare days, store redemptions, screenshot storage

create type public.bug_category as enum (
  'bug',
  'suggestion',
  'complaint',
  'feature_request'
);

create table public.bug_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  category public.bug_category not null,
  message text not null check (char_length(trim(message)) > 0),
  screenshot_url text,
  created_at timestamptz not null default now()
);

create index bug_reports_created_idx on public.bug_reports (created_at desc);

create table public.flare_days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  flare_date date not null default (current_date),
  created_at timestamptz not null default now(),
  unique (user_id, flare_date)
);

create index flare_days_user_date_idx on public.flare_days (user_id, flare_date desc);

create table public.store_redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  item_id text not null,
  item_name text not null,
  cost integer not null check (cost > 0),
  created_at timestamptz not null default now()
);

create index store_redemptions_user_idx on public.store_redemptions (user_id, created_at desc);

alter table public.bug_reports enable row level security;
alter table public.flare_days enable row level security;
alter table public.store_redemptions enable row level security;

create policy "Users insert own bug reports"
  on public.bug_reports for insert
  with check (auth.uid() = user_id);

create policy "Users read own bug reports"
  on public.bug_reports for select
  using (auth.uid() = user_id);

create policy "Users read own flare days"
  on public.flare_days for select
  using (auth.uid() = user_id);

create policy "Users insert own flare days"
  on public.flare_days for insert
  with check (auth.uid() = user_id);

create policy "Users read own store redemptions"
  on public.store_redemptions for select
  using (auth.uid() = user_id);

create policy "Users insert own store redemptions"
  on public.store_redemptions for insert
  with check (auth.uid() = user_id);

-- Admin read-all policies (Jaydan Edition — private build)
create policy "Admin read all bug reports"
  on public.bug_reports for select
  using (true);

create policy "Admin read all flare days"
  on public.flare_days for select
  using (true);

create policy "Admin read all store redemptions"
  on public.store_redemptions for select
  using (true);

-- Storage bucket for bug screenshots
insert into storage.buckets (id, name, public)
values ('bug-screenshots', 'bug-screenshots', true)
on conflict (id) do nothing;

create policy "Users upload bug screenshots"
  on storage.objects for insert
  with check (
    bucket_id = 'bug-screenshots'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Public read bug screenshots"
  on storage.objects for select
  using (bucket_id = 'bug-screenshots');
