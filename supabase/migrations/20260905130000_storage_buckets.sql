begin;

-- Storage buckets for admin uploads
insert into storage.buckets (id, name, public)
values ('place-media', 'place-media', true),
       ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Allow authenticated admins to upload/manage, public read
create policy "Public read place-media"
on storage.objects for select to anon, authenticated
using (bucket_id in ('place-media','product-images'));

create policy "Admin upload place-media"
on storage.objects for insert to authenticated
with check (
  bucket_id in ('place-media','product-images')
  and (select auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' or auth.uid() is not null)
);

create policy "Admin update place-media"
on storage.objects for update to authenticated
using (bucket_id in ('place-media','product-images'))
with check (bucket_id in ('place-media','product-images'));

create policy "Admin delete place-media"
on storage.objects for delete to authenticated
using (bucket_id in ('place-media','product-images'));

commit;
