-- Jaydan Edition: character themes + character sounds preference

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
