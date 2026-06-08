-- Allow authenticated users to create their own profile row (required for upsert / legacy accounts)

create policy "Users insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Backfill profile + streak for auth users missing rows (e.g. pre-trigger accounts)
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
