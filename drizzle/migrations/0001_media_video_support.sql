alter table public.posts add column if not exists video_url text;
alter table public.gallery_images add column if not exists media_type text not null default 'image';
alter table public.gallery_images add constraint gallery_images_media_type_chk check (media_type in ('image','video'));

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null default '',
  message text not null,
  created_at timestamptz not null default now()
);
grant insert on public.contact_messages to anon, authenticated;
grant select, delete on public.contact_messages to authenticated;
grant all on public.contact_messages to service_role;
alter table public.contact_messages enable row level security;
create policy "Anyone can send a message" on public.contact_messages for insert to anon, authenticated
  with check (char_length(name) between 1 and 120 and char_length(email) between 3 and 255 and char_length(message) between 1 and 4000 and char_length(subject) <= 200);
create policy "Staff read messages" on public.contact_messages for select to authenticated using (public.is_staff(auth.uid()));
create policy "Staff delete messages" on public.contact_messages for delete to authenticated using (public.is_staff(auth.uid()));