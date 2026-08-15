begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'discovery-media', 'discovery-media', false, 10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy discovery_media_owner_insert on storage.objects for insert to authenticated
with check (
  bucket_id = 'discovery-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp')
);

create policy discovery_media_owner_select on storage.objects for select to authenticated
using (
  bucket_id = 'discovery-media'
  and (
    owner_id = (select auth.uid())::text
    or (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin'
    or exists (
      select 1 from public.discoveries d
      where d.photo_url = storage.objects.name and d.status = 'approved'
    )
  )
);

create policy discovery_media_approved_select on storage.objects for select to anon
using (
  bucket_id = 'discovery-media'
  and exists (
    select 1 from public.discoveries d
    where d.photo_url = storage.objects.name and d.status = 'approved'
  )
);

create policy discovery_media_owner_update on storage.objects for update to authenticated
using (
  bucket_id = 'discovery-media'
  and (owner_id = (select auth.uid())::text or (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin')
)
with check (
  bucket_id = 'discovery-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy discovery_media_owner_delete on storage.objects for delete to authenticated
using (
  bucket_id = 'discovery-media'
  and (owner_id = (select auth.uid())::text or (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin')
);

create function private.expire_stale_bookings()
returns integer
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_count integer;
begin
  with expired as materialized (
    select id from public.bookings
    where status = 'pending' and payment_status in ('unpaid', 'pending')
      and expires_at is not null and expires_at <= now()
    order by expires_at
    for update skip locked
    limit 100
  ), released as (
    select bi.product_id, bi.service_date, sum(bi.quantity)::integer quantity
    from public.booking_items bi join expired e on e.id = bi.booking_id
    where bi.product_id is not null and bi.service_date is not null
    group by bi.product_id, bi.service_date
  ), slots as (
    update public.product_slots s set
      reserved = greatest(0, s.reserved - r.quantity),
      status = case when s.status = 'sold_out' then 'open' else s.status end
    from released r
    where s.product_id = r.product_id and s.starts_at = r.service_date
    returning s.id
  ), cancelled as (
    update public.bookings b set status = 'cancelled', payment_status = 'failed', expires_at = null
    from expired e where b.id = e.id returning b.id
  )
  select count(*) into v_count from cancelled;
  return v_count;
end;
$$;

revoke all on function private.expire_stale_bookings() from public, anon, authenticated;
grant execute on function private.expire_stale_bookings() to service_role;

create function private.ensure_rolling_product_slots()
returns integer
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_count integer;
begin
  insert into public.product_slots(product_id, starts_at, ends_at, capacity)
  select p.id, day + time '08:00',
    day + time '08:00' + coalesce(p.duration_hours, 24) * interval '1 hour',
    case when p.product_type = 'stay' then 6 else 16 end
  from public.products p
  cross join generate_series(current_date, current_date + 120, interval '1 day') day
  where p.status = 'published'
  on conflict (product_id, starts_at) do nothing;
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke all on function private.ensure_rolling_product_slots() from public, anon, authenticated;
grant execute on function private.ensure_rolling_product_slots() to service_role;

create function private.moderate_discovery(p_discovery_id uuid, p_decision text, p_note text default null)
returns public.discoveries
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := auth.uid();
  v_discovery public.discoveries;
begin
  if v_actor is null or (select auth.jwt()) -> 'app_metadata' ->> 'role' <> 'admin' then
    raise exception 'admin_required' using errcode = '42501';
  end if;
  if p_decision not in ('approved', 'rejected') then raise exception 'invalid_moderation_decision'; end if;

  update public.discoveries set status = p_decision
  where id = p_discovery_id and status in ('pending', 'approved', 'rejected')
  returning * into v_discovery;
  if not found then raise exception 'discovery_not_found'; end if;

  insert into public.audit_events(actor_id, entity_type, entity_id, action, metadata)
  values (v_actor, 'discovery', p_discovery_id::text, 'moderated',
    jsonb_build_object('decision', p_decision, 'note', p_note));
  return v_discovery;
end;
$$;

revoke all on function private.moderate_discovery(uuid, text, text) from public, anon, authenticated, service_role;
grant execute on function private.moderate_discovery(uuid, text, text) to authenticated;

create function public.moderate_discovery(p_discovery_id uuid, p_decision text, p_note text default null)
returns public.discoveries
language sql
security invoker
set search_path = ''
as $$ select private.moderate_discovery(p_discovery_id, p_decision, p_note) $$;

revoke all on function public.moderate_discovery(uuid, text, text) from public, anon, service_role;
grant execute on function public.moderate_discovery(uuid, text, text) to authenticated;

create function public.claim_notification_batch(p_limit integer default 20)
returns setof public.notification_outbox
language plpgsql
security invoker
set search_path = ''
as $$
begin
  return query
  with claimed as (
    select id from public.notification_outbox
    where status in ('pending', 'failed') and available_at <= now() and attempts < 5
    order by available_at, created_at
    for update skip locked
    limit least(greatest(p_limit, 1), 100)
  )
  update public.notification_outbox n set status = 'processing', attempts = attempts + 1
  from claimed c where n.id = c.id returning n.*;
end;
$$;

revoke all on function public.claim_notification_batch(integer) from public, anon, authenticated;
grant execute on function public.claim_notification_batch(integer) to service_role;

create function public.complete_notification(p_id uuid, p_sent boolean, p_error text default null)
returns void
language sql
security invoker
set search_path = ''
as $$
  update public.notification_outbox set
    status = case when p_sent then 'sent' else 'failed' end,
    sent_at = case when p_sent then now() else null end,
    last_error = case when p_sent then null else left(p_error, 1000) end,
    available_at = case when p_sent then available_at else now() + interval '15 minutes' end
  where id = p_id
$$;

revoke all on function public.complete_notification(uuid, boolean, text) from public, anon, authenticated;
grant execute on function public.complete_notification(uuid, boolean, text) to service_role;

create extension if not exists pg_cron;

select cron.schedule(
  'capesee-expire-reservations',
  '*/5 * * * *',
  'select private.expire_stale_bookings()'
)
where not exists (select 1 from cron.job where jobname = 'capesee-expire-reservations');

select cron.schedule(
  'capesee-roll-product-slots',
  '15 1 * * *',
  'select private.ensure_rolling_product_slots()'
)
where not exists (select 1 from cron.job where jobname = 'capesee-roll-product-slots');

commit;
