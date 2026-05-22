
create table if not exists public.daily_briefings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  briefing_date date not null,
  content text not null,
  stats jsonb not null default '{}'::jsonb,
  emailed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, briefing_date)
);

alter table public.daily_briefings enable row level security;

create policy "Admins manage their daily briefings"
on public.daily_briefings
for all
to authenticated
using (has_role(auth.uid(), 'admin'::app_role) and user_id = auth.uid())
with check (has_role(auth.uid(), 'admin'::app_role) and user_id = auth.uid());

create index if not exists daily_briefings_user_date_idx on public.daily_briefings (user_id, briefing_date desc);
