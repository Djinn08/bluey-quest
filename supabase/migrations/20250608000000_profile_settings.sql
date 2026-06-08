-- Profile settings for v0.1
alter table public.profiles
  add column if not exists display_name text,
  add column if not exists theme_preference text not null default 'cozy'
    check (theme_preference in ('cozy', 'bright', 'calm'));
