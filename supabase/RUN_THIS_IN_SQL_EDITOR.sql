-- ============================================================
-- Bluey Quest — run this ENTIRE file in Supabase SQL Editor
-- Dashboard → SQL Editor → New query → Paste → Run
-- ============================================================

-- 1) Theme constraint: allow bluey / bingo / muffin (fixes error 23514)
alter table public.profiles
  drop constraint if exists profiles_theme_preference_check;

update public.profiles
set theme_preference = case theme_preference
  when 'cozy' then 'bluey'
  when 'bright' then 'bluey'
  when 'calm' then 'bingo'
  else theme_preference
end
where theme_preference in ('cozy', 'bright', 'calm');

alter table public.profiles
  alter column theme_preference set default 'bluey';

alter table public.profiles
  add constraint profiles_theme_preference_check
    check (theme_preference in ('bluey', 'bingo', 'muffin'));

alter table public.profiles
  add column if not exists character_sounds_enabled boolean not null default true;

-- 2) Profile RLS: allow insert + auto-backfill (fixes error 42501)
drop policy if exists "Users insert own profile" on public.profiles;

create policy "Users insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create or replace function public.ensure_user_profile()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    return;
  end if;

  insert into public.profiles (id)
  values (uid)
  on conflict (id) do nothing;

  insert into public.streaks (user_id)
  values (uid)
  on conflict (user_id) do nothing;
end;
$$;

grant execute on function public.ensure_user_profile() to authenticated;

-- 3) Flare Day table + policies (fixes "flare_days does not exist")
--    Full script also in: supabase/RUN_FLARE_DAYS_IN_SQL_EDITOR.sql

create table if not exists public.flare_days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  flare_date date not null default (current_date),
  created_at timestamptz not null default now(),
  unique (user_id, flare_date)
);

create index if not exists flare_days_user_date_idx
  on public.flare_days (user_id, flare_date desc);

alter table public.flare_days enable row level security;

drop policy if exists "Users read own flare days" on public.flare_days;
create policy "Users read own flare days"
  on public.flare_days for select
  using (auth.uid() = user_id);

drop policy if exists "Users insert own flare days" on public.flare_days;
create policy "Users insert own flare days"
  on public.flare_days for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users delete own flare days" on public.flare_days;
create policy "Users delete own flare days"
  on public.flare_days for delete
  using (auth.uid() = user_id);

-- 4) Mood check-in + analytics (fixes "daily_entries does not exist")
--    Full script also in: supabase/RUN_MOOD_AND_ANALYTICS_IN_SQL_EDITOR.sql

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
