begin;

drop policy place_media_admin_all on public.place_media;
create policy place_media_admin_insert on public.place_media for insert to authenticated
with check ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
create policy place_media_admin_update on public.place_media for update to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin')
with check ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
create policy place_media_admin_delete on public.place_media for delete to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

drop policy timeline_events_admin_all on public.timeline_events;
create policy timeline_events_admin_insert on public.timeline_events for insert to authenticated
with check ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
create policy timeline_events_admin_update on public.timeline_events for update to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin')
with check ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
create policy timeline_events_admin_delete on public.timeline_events for delete to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

commit;

