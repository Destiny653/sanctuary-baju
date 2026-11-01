create type public.app_role as enum ('admin', 'editor');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select, insert, delete on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_staff(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin','editor'))
$$;

create policy "Own profile or admin can read" on public.profiles for select to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "Own profile update" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

create policy "Own roles or admin can read" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "Admins grant roles" on public.user_roles for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins revoke roles" on public.user_roles for delete to authenticated
  using (public.has_role(auth.uid(), 'admin') and user_id <> auth.uid());

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('news','event','life')),
  slug text not null unique,
  title_en text not null default '',
  title_fr text not null default '',
  excerpt_en text not null default '',
  excerpt_fr text not null default '',
  body_en text not null default '',
  body_fr text not null default '',
  cover_url text,
  event_start timestamptz,
  event_location text,
  published boolean not null default true,
  published_at timestamptz not null default now(),
  author_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.posts to anon;
grant select, insert, update, delete on public.posts to authenticated;
grant all on public.posts to service_role;
alter table public.posts enable row level security;
create policy "Published posts are public" on public.posts for select to anon, authenticated using (published = true);
create policy "Staff read all posts" on public.posts for select to authenticated using (public.is_staff(auth.uid()));
create policy "Staff insert posts" on public.posts for insert to authenticated with check (public.is_staff(auth.uid()));
create policy "Staff update posts" on public.posts for update to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "Staff delete posts" on public.posts for delete to authenticated using (public.is_staff(auth.uid()));
create trigger posts_touch before update on public.posts for each row execute function public.touch_updated_at();
create index posts_kind_idx on public.posts (kind, published_at desc);

create table public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  title_en text not null default '',
  title_fr text not null default '',
  description_en text not null default '',
  description_fr text not null default '',
  sort int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.gallery_albums to anon;
grant select, insert, update, delete on public.gallery_albums to authenticated;
grant all on public.gallery_albums to service_role;
alter table public.gallery_albums enable row level security;
create policy "Albums are public" on public.gallery_albums for select to anon, authenticated using (true);
create policy "Staff insert albums" on public.gallery_albums for insert to authenticated with check (public.is_staff(auth.uid()));
create policy "Staff update albums" on public.gallery_albums for update to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "Staff delete albums" on public.gallery_albums for delete to authenticated using (public.is_staff(auth.uid()));

create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.gallery_albums(id) on delete cascade,
  url text not null,
  caption_en text not null default '',
  caption_fr text not null default '',
  sort int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.gallery_images to anon;
grant select, insert, update, delete on public.gallery_images to authenticated;
grant all on public.gallery_images to service_role;
alter table public.gallery_images enable row level security;
create policy "Images are public" on public.gallery_images for select to anon, authenticated using (true);
create policy "Staff insert images" on public.gallery_images for insert to authenticated with check (public.is_staff(auth.uid()));
create policy "Staff update images" on public.gallery_images for update to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "Staff delete images" on public.gallery_images for delete to authenticated using (public.is_staff(auth.uid()));
create index gallery_images_album_idx on public.gallery_images (album_id, sort);

create table public.leaders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role_en text not null default '',
  role_fr text not null default '',
  bio_en text not null default '',
  bio_fr text not null default '',
  photo_url text,
  sort int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.leaders to anon;
grant select, insert, update, delete on public.leaders to authenticated;
grant all on public.leaders to service_role;
alter table public.leaders enable row level security;
create policy "Leaders are public" on public.leaders for select to anon, authenticated using (true);
create policy "Staff insert leaders" on public.leaders for insert to authenticated with check (public.is_staff(auth.uid()));
create policy "Staff update leaders" on public.leaders for update to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "Staff delete leaders" on public.leaders for delete to authenticated using (public.is_staff(auth.uid()));

create policy "Staff upload media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_staff(auth.uid()));
create policy "Staff update media" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_staff(auth.uid()));
create policy "Staff delete media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_staff(auth.uid()));
create policy "Staff read media" on storage.objects for select to authenticated
  using (bucket_id = 'media' and public.is_staff(auth.uid()));