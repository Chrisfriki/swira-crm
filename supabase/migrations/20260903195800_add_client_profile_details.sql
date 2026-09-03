alter table public.clients
  add column if not exists start_month date,
  add column if not exists avatar_path text,
  add column if not exists important_links jsonb not null default '[]'::jsonb;

alter table public.clients
  drop constraint if exists clients_important_links_is_array,
  add constraint clients_important_links_is_array
  check (jsonb_typeof(important_links) = 'array');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'client-assets',
  'client-assets',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "authenticated users can read client assets" on storage.objects;
drop policy if exists "admins can upload client assets" on storage.objects;
drop policy if exists "admins can update client assets" on storage.objects;
drop policy if exists "admins can delete client assets" on storage.objects;

create policy "authenticated users can read client assets"
on storage.objects for select to authenticated
using (bucket_id = 'client-assets');

create policy "admins can upload client assets"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'client-assets'
  and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

create policy "admins can update client assets"
on storage.objects for update to authenticated
using (
  bucket_id = 'client-assets'
  and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
with check (
  bucket_id = 'client-assets'
  and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

create policy "admins can delete client assets"
on storage.objects for delete to authenticated
using (
  bucket_id = 'client-assets'
  and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);
