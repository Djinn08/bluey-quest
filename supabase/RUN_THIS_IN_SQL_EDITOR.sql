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
