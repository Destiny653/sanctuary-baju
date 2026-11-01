-- Site settings (map destination and other house config)
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

grant select on public.site_settings to anon, authenticated;
grant select, insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;

alter table public.site_settings enable row level security;

create policy "Anyone can read site settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "Staff upsert site settings"
  on public.site_settings for insert
  to authenticated
  with check (public.is_staff(auth.uid()));

create policy "Staff update site settings"
  on public.site_settings for update
  to authenticated
  using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));

create policy "Staff delete site settings"
  on public.site_settings for delete
  to authenticated
  using (public.is_staff(auth.uid()));

-- Default destination: sanctuary gate house (Babadjou / West Cameroon region)
insert into public.site_settings (key, value)
values (
  'map_destination',
  jsonb_build_object(
    'lat', 5.6284,
    'lng', 10.0819,
    'label_en', 'Sanctuary of Our Lady of Mercy — Gate House',
    'label_fr', 'Sanctuaire Notre-Dame de la Miséricorde — Maison de la porte'
  )
)
on conflict (key) do nothing;
