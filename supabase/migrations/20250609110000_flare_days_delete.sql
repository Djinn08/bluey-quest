-- Allow users to end Flare Day early ("All Better!")

drop policy if exists "Users delete own flare days" on public.flare_days;

create policy "Users delete own flare days"
  on public.flare_days for delete
  using (auth.uid() = user_id);
