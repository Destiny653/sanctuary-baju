-- Gallery album segments: configurable header year / date
alter table public.gallery_albums
  add column if not exists year int,
  add column if not exists segment_date date;

comment on column public.gallery_albums.year is 'Display year for the gallery segment header';
comment on column public.gallery_albums.segment_date is 'Optional precise date shown under the segment header';
