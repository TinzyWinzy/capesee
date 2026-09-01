begin;

-- Past experiences (storytelling engine) — linkable to product + place
-- Create tables FIRST so storage policies that reference them validate (idempotent)
create table if not exists public.past_experiences (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid references auth.users(id) on delete set null,
  place_id uuid references public.places(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  title text not null check (char_length(title) between 3 and 120),
  narrative text not null check (char_length(narrative) between 20 and 8000),
  occurred_at date not null,
  cover_url text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists past_experiences_set_updated_at on public.past_experiences;
create trigger past_experiences_set_updated_at before update on public.past_experiences
for each row execute function private.set_updated_at();

create table if not exists public.past_experience_media (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.past_experiences(id) on delete cascade,
  kind text not null check (kind in ('image','video')),
  url text not null,
  alt_text text,
  sort_order integer not null default 0 check (sort_order >=0),
  created_at timestamptz not null default now()
);

create index if not exists past_experiences_status_occurred_idx on public.past_experiences(status, occurred_at desc);
create index if not exists past_experiences_place_idx on public.past_experiences(place_id);
create index if not exists past_experiences_product_idx on public.past_experiences(product_id);
create index if not exists past_experience_media_exp_sort_idx on public.past_experience_media(experience_id, sort_order);

alter table public.past_experiences enable row level security;
alter table public.past_experience_media enable row level security;

-- RLS: public can read published; admin can do all; provider can read own drafts
drop policy if exists past_exp_public_read on public.past_experiences;
create policy past_exp_public_read on public.past_experiences for select to anon, authenticated
using (status='published' or provider_id=(select auth.uid()) or (select auth.jwt())->'app_metadata'->>'role'='admin');
drop policy if exists past_exp_admin_insert on public.past_experiences;
create policy past_exp_admin_insert on public.past_experiences for insert to authenticated
with check ((select auth.jwt())->'app_metadata'->>'role'='admin' or provider_id=(select auth.uid()));
drop policy if exists past_exp_admin_update on public.past_experiences;
create policy past_exp_admin_update on public.past_experiences for update to authenticated
using ((select auth.jwt())->'app_metadata'->>'role'='admin' or provider_id=(select auth.uid()))
with check ((select auth.jwt())->'app_metadata'->>'role'='admin' or provider_id=(select auth.uid()));
drop policy if exists past_exp_admin_delete on public.past_experiences;
create policy past_exp_admin_delete on public.past_experiences for delete to authenticated
using ((select auth.jwt())->'app_metadata'->>'role'='admin' or provider_id=(select auth.uid()));

drop policy if exists past_exp_media_public_read on public.past_experience_media;
create policy past_exp_media_public_read on public.past_experience_media for select to anon, authenticated
using (exists (select 1 from public.past_experiences pe where pe.id=experience_id and (pe.status='published' or pe.provider_id=(select auth.uid()) or (select auth.jwt())->'app_metadata'->>'role'='admin')));
drop policy if exists past_exp_media_admin_all on public.past_experience_media;
create policy past_exp_media_admin_all on public.past_experience_media for all to authenticated
using ((select auth.jwt())->'app_metadata'->>'role'='admin' or exists (select 1 from public.past_experiences pe where pe.id=experience_id and pe.provider_id=(select auth.uid())))
with check ((select auth.jwt())->'app_metadata'->>'role'='admin' or exists (select 1 from public.past_experiences pe where pe.id=experience_id and pe.provider_id=(select auth.uid())));

grant select on public.past_experiences, public.past_experience_media to anon;
grant select, insert, update, delete on public.past_experiences, public.past_experience_media to authenticated;
grant select, insert, update, delete on public.past_experiences, public.past_experience_media to service_role;

-- Buckets for past storytelling + place media (after tables so policies referencing them validate)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('past-experience-media', 'past-experience-media', false, 20971520,
   array['image/jpeg','image/png','image/webp','video/mp4','video/quicktime']),
  ('place-media', 'place-media', true, 10485760,
   array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage policies: past-experience-media (private, signed URLs, owner/admin)
drop policy if exists past_exp_media_owner_insert on storage.objects;
create policy past_exp_media_owner_insert on storage.objects for insert to authenticated
with check (
  bucket_id = 'past-experience-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and lower(storage.extension(name)) in ('jpg','jpeg','png','webp','mp4','mov')
);
drop policy if exists past_exp_media_owner_select on storage.objects;
create policy past_exp_media_owner_select on storage.objects for select to authenticated
using (
  bucket_id = 'past-experience-media'
  and (
    owner_id = (select auth.uid())::text
    or (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin'
    or exists (select 1 from public.past_experiences pe where pe.cover_url = storage.objects.name and pe.status = 'published')
    or exists (select 1 from public.past_experience_media pem where pem.url = storage.objects.name and exists (select 1 from public.past_experiences pe where pe.id = pem.experience_id and pe.status='published'))
  )
);
drop policy if exists past_exp_media_published_select on storage.objects;
create policy past_exp_media_published_select on storage.objects for select to anon
using (
  bucket_id = 'past-experience-media'
  and (
    exists (select 1 from public.past_experiences pe where pe.cover_url = storage.objects.name and pe.status='published')
    or exists (select 1 from public.past_experience_media pem where pem.url = storage.objects.name and exists (select 1 from public.past_experiences pe where pe.id=pem.experience_id and pe.status='published'))
  )
);
drop policy if exists past_exp_media_owner_update on storage.objects;
create policy past_exp_media_owner_update on storage.objects for update to authenticated
using (bucket_id='past-experience-media' and (owner_id=(select auth.uid())::text or (select auth.jwt())->'app_metadata'->>'role'='admin'))
with check (bucket_id='past-experience-media' and (storage.foldername(name))[1]=(select auth.uid())::text);
drop policy if exists past_exp_media_owner_delete on storage.objects;
create policy past_exp_media_owner_delete on storage.objects for delete to authenticated
using (bucket_id='past-experience-media' and (owner_id=(select auth.uid())::text or (select auth.jwt())->'app_metadata'->>'role'='admin'));

-- place-media bucket public read, admin write
drop policy if exists place_media_public_select on storage.objects;
create policy place_media_public_select on storage.objects for select to anon, authenticated
using (bucket_id='place-media');
drop policy if exists place_media_admin_insert on storage.objects;
create policy place_media_admin_insert on storage.objects for insert to authenticated
with check (bucket_id='place-media' and (select auth.jwt())->'app_metadata'->>'role'='admin');
drop policy if exists place_media_admin_update on storage.objects;
create policy place_media_admin_update on storage.objects for update to authenticated
using (bucket_id='place-media' and (select auth.jwt())->'app_metadata'->>'role'='admin')
with check (bucket_id='place-media');
drop policy if exists place_media_admin_delete on storage.objects;
create policy place_media_admin_delete on storage.objects for delete to authenticated
using (bucket_id='place-media' and (select auth.jwt())->'app_metadata'->>'role'='admin');

commit;
