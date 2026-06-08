-- ============================================================
-- Bluey Quest — Flare Day table + policies
-- Run in Supabase SQL Editor if you see:
--   relation "public.flare_days" does not exist
-- Safe to re-run (idempotent).
-- ============================================================

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
