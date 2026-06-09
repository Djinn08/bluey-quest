-- Daily documentation (mood + future fields) and analytics events

-- Unified daily entry — one row per user per day
create table if not exists public.daily_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  entry_date date not null default (current_date),
  mood_score integer check (mood_score is null or (mood_score >= 1 and mood_score <= 10)),
  mood_notes text check (mood_notes is null or char_length(mood_notes) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, entry_date)
);

create index if not exists daily_entries_user_date_idx
  on public.daily_entries (user_id, entry_date desc);

alter table public.daily_entries enable row level security;

drop policy if exists "Users read own daily entries" on public.daily_entries;
create policy "Users read own daily entries"
  on public.daily_entries for select
  using (auth.uid() = user_id);

drop policy if exists "Users insert own daily entries" on public.daily_entries;
create policy "Users insert own daily entries"
  on public.daily_entries for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users update own daily entries" on public.daily_entries;
create policy "Users update own daily entries"
  on public.daily_entries for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop trigger if exists daily_entries_updated_at on public.daily_entries;
create trigger daily_entries_updated_at
  before update on public.daily_entries
  for each row execute function public.set_updated_at();

-- Generic analytics events (reusable across features)
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  event_name text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_user_created_idx
  on public.analytics_events (user_id, created_at desc);

create index if not exists analytics_events_name_created_idx
  on public.analytics_events (event_name, created_at desc);

alter table public.analytics_events enable row level security;

drop policy if exists "Users insert own analytics events" on public.analytics_events;
create policy "Users insert own analytics events"
  on public.analytics_events for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users read own analytics events" on public.analytics_events;
create policy "Users read own analytics events"
  on public.analytics_events for select
  using (auth.uid() = user_id);
