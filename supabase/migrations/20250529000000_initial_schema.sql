-- Bluey Quest initial schema

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  dollarbucks_balance integer not null default 0 check (dollarbucks_balance >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keepy Uppy streak per user
create table public.streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  current_streak_days integer not null default 0 check (current_streak_days >= 0),
  last_activity_date date,
  updated_at timestamptz not null default now()
);

-- Daily habit completions (one per action per day)
create type public.daily_action_type as enum (
  'breakfast',
  'lunch',
  'dinner',
  'snack',
  'water_goal',
  'walk',
  'pt_exercise'
);

create table public.daily_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  action_type public.daily_action_type not null,
  action_date date not null default (current_date),
  completed_at timestamptz not null default now(),
  unique (user_id, action_type, action_date)
);

-- Food logging (name + timestamp only)
create table public.food_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  food_name text not null check (char_length(trim(food_name)) > 0),
  logged_at timestamptz not null default now(),
  entry_date date not null default (current_date)
);

create index food_entries_user_date_idx on public.food_entries (user_id, entry_date desc, logged_at desc);

-- Dollarbucks transaction log
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  action text not null,
  base_reward integer not null default 0,
  multiplier numeric(4, 2) not null default 1.0,
  reward_earned integer not null default 0,
  created_at timestamptz not null default now()
);

create index transactions_user_created_idx on public.transactions (user_id, created_at desc);

-- Auto-create profile + streak on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  insert into public.streaks (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger streaks_updated_at
  before update on public.streaks
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.streaks enable row level security;
alter table public.daily_actions enable row level security;
alter table public.food_entries enable row level security;
alter table public.transactions enable row level security;

create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users read own streak"
  on public.streaks for select
  using (auth.uid() = user_id);

create policy "Users update own streak"
  on public.streaks for update
  using (auth.uid() = user_id);

create policy "Users read own daily actions"
  on public.daily_actions for select
  using (auth.uid() = user_id);

create policy "Users insert own daily actions"
  on public.daily_actions for insert
  with check (auth.uid() = user_id);

create policy "Users read own food entries"
  on public.food_entries for select
  using (auth.uid() = user_id);

create policy "Users insert own food entries"
  on public.food_entries for insert
  with check (auth.uid() = user_id);

create policy "Users read own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users insert own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);
