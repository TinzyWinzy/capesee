begin;

create index audit_events_actor_id_idx on public.audit_events(actor_id);
create index notification_outbox_booking_id_idx on public.notification_outbox(booking_id);
create index notification_outbox_user_id_idx on public.notification_outbox(user_id);

drop policy product_slots_admin_write on public.product_slots;
create policy product_slots_admin_insert on public.product_slots for insert to authenticated
with check ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
create policy product_slots_admin_update on public.product_slots for update to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin')
with check ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
create policy product_slots_admin_delete on public.product_slots for delete to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

commit;
