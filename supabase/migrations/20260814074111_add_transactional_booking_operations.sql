begin;

alter table public.bookings
  add column idempotency_key text,
  add column payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'pending', 'paid', 'failed', 'refunded')),
  add column expires_at timestamptz;

create unique index bookings_traveler_idempotency_idx
  on public.bookings(traveler_id, idempotency_key)
  where idempotency_key is not null;

create table public.product_slots (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity integer not null check (capacity > 0),
  reserved integer not null default 0 check (reserved >= 0 and reserved <= capacity),
  price_override numeric(12,2) check (price_override >= 0),
  status text not null default 'open' check (status in ('open', 'closed', 'sold_out')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, starts_at),
  check (ends_at > starts_at)
);

create table public.payment_attempts (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete restrict,
  provider text not null,
  idempotency_key text not null unique,
  provider_reference text unique,
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  status text not null default 'created'
    check (status in ('created', 'redirected', 'paid', 'failed', 'cancelled', 'refunded')),
  checkout_url text,
  failure_reason text,
  provider_payload jsonb not null default '{}'::jsonb check (jsonb_typeof(provider_payload) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_events (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  entity_type text not null,
  entity_id text not null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now()
);

create table public.notification_outbox (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete cascade,
  channel text not null check (channel in ('email', 'sms', 'whatsapp', 'push')),
  template text not null,
  recipient text not null,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object'),
  status text not null default 'pending' check (status in ('pending', 'processing', 'sent', 'failed', 'cancelled')),
  attempts integer not null default 0 check (attempts >= 0),
  available_at timestamptz not null default now(),
  sent_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger product_slots_set_updated_at before update on public.product_slots
for each row execute function private.set_updated_at();
create trigger payment_attempts_set_updated_at before update on public.payment_attempts
for each row execute function private.set_updated_at();
create trigger notification_outbox_set_updated_at before update on public.notification_outbox
for each row execute function private.set_updated_at();

create index product_slots_product_start_status_idx
  on public.product_slots(product_id, starts_at, status);
create index payment_attempts_booking_created_idx
  on public.payment_attempts(booking_id, created_at desc);
create index notification_outbox_delivery_idx
  on public.notification_outbox(status, available_at)
  where status in ('pending', 'failed');
create index audit_events_entity_created_idx
  on public.audit_events(entity_type, entity_id, created_at desc);

alter table public.product_slots enable row level security;
alter table public.payment_attempts enable row level security;
alter table public.audit_events enable row level security;
alter table public.notification_outbox enable row level security;

create policy product_slots_public_read on public.product_slots for select to anon, authenticated
using (status = 'open' or (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
create policy product_slots_admin_write on public.product_slots for all to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin')
with check ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

create policy payment_attempts_participant_read on public.payment_attempts for select to authenticated
using (exists (
  select 1 from public.bookings b
  where b.id = payment_attempts.booking_id
    and (b.traveler_id = (select auth.uid()) or (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin')
));

create policy audit_events_admin_read on public.audit_events for select to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

create policy notification_outbox_owner_read on public.notification_outbox for select to authenticated
using (user_id = (select auth.uid()) or (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

grant select on public.product_slots to anon, authenticated;
grant insert, update, delete on public.product_slots to authenticated;
grant select on public.payment_attempts, public.notification_outbox to authenticated;
grant select on public.audit_events to authenticated;
grant select, insert, update, delete on public.product_slots, public.payment_attempts,
  public.audit_events, public.notification_outbox to service_role;

create function private.create_booking(
  p_items jsonb,
  p_traveler_details jsonb,
  p_idempotency_key text
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_booking public.bookings;
  v_item jsonb;
  v_product public.products;
  v_slot public.product_slots;
  v_quantity integer;
  v_service_date timestamptz;
  v_total numeric(12,2) := 0;
  v_starts_at timestamptz;
  v_ends_at timestamptz;
  v_code text;
  v_email text;
begin
  if v_user_id is null then raise exception 'authentication_required' using errcode = '42501'; end if;
  if p_idempotency_key is null or char_length(p_idempotency_key) < 8 then raise exception 'invalid_idempotency_key'; end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) < 1 or jsonb_array_length(p_items) > 20 then
    raise exception 'invalid_booking_items';
  end if;
  if jsonb_typeof(p_traveler_details) <> 'object' then raise exception 'invalid_traveler_details'; end if;

  select * into v_booking from public.bookings
  where traveler_id = v_user_id and idempotency_key = p_idempotency_key;
  if found then return jsonb_build_object('id', v_booking.id, 'code', v_booking.code, 'total', v_booking.total, 'status', v_booking.status); end if;

  -- Lock product rows in a stable order before validating slots.
  perform p.id from public.products p
  where p.id in (select (item ->> 'productId')::uuid from jsonb_array_elements(p_items) item)
  order by p.id for update;

  for v_item in select value from jsonb_array_elements(p_items) order by value ->> 'productId'
  loop
    v_quantity := (v_item ->> 'qty')::integer;
    v_service_date := (v_item ->> 'date')::date::timestamptz;
    if v_quantity < 1 or v_quantity > 50 or v_service_date < current_date then raise exception 'invalid_booking_item'; end if;

    select * into strict v_product from public.products
    where id = (v_item ->> 'productId')::uuid and status = 'published';

    select * into strict v_slot from public.product_slots
    where product_id = v_product.id and starts_at::date = v_service_date::date
    order by starts_at limit 1 for update;

    if v_slot.status <> 'open' or v_slot.reserved + v_quantity > v_slot.capacity then
      raise exception 'insufficient_availability';
    end if;

    v_total := v_total + coalesce(v_slot.price_override, v_product.price) * v_quantity;
    v_starts_at := least(coalesce(v_starts_at, v_slot.starts_at), v_slot.starts_at);
    v_ends_at := greatest(coalesce(v_ends_at, v_slot.ends_at), v_slot.ends_at);
  end loop;

  v_code := 'CAP-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));
  insert into public.bookings (
    code, traveler_id, status, currency, total, starts_at, ends_at,
    traveler_details, idempotency_key, payment_status, expires_at
  ) values (
    v_code, v_user_id, 'pending', 'ZAR', v_total, v_starts_at, v_ends_at,
    p_traveler_details, p_idempotency_key, 'unpaid', now() + interval '20 minutes'
  ) returning * into v_booking;

  for v_item in select value from jsonb_array_elements(p_items) order by value ->> 'productId'
  loop
    v_quantity := (v_item ->> 'qty')::integer;
    v_service_date := (v_item ->> 'date')::date::timestamptz;
    select p.* into strict v_product from public.products p where p.id = (v_item ->> 'productId')::uuid;
    select s.* into strict v_slot from public.product_slots s
      where s.product_id = v_product.id and s.starts_at::date = v_service_date::date
      order by s.starts_at limit 1 for update;

    insert into public.booking_items (
      booking_id, product_id, title_snapshot, product_type, quantity, unit_price, service_date
    ) values (
      v_booking.id, v_product.id, v_product.title, v_product.product_type,
      v_quantity, coalesce(v_slot.price_override, v_product.price), v_slot.starts_at
    );
    update public.product_slots set reserved = reserved + v_quantity,
      status = case when reserved + v_quantity = capacity then 'sold_out' else status end
    where id = v_slot.id;
  end loop;

  insert into public.audit_events(actor_id, entity_type, entity_id, action, metadata)
  values (v_user_id, 'booking', v_booking.id::text, 'created', jsonb_build_object('code', v_booking.code, 'total', v_booking.total));

  v_email := nullif(p_traveler_details ->> 'email', '');
  if v_email is not null then
    insert into public.notification_outbox(user_id, booking_id, channel, template, recipient, payload)
    values (v_user_id, v_booking.id, 'email', 'booking_reserved', v_email,
      jsonb_build_object('bookingCode', v_booking.code, 'expiresAt', v_booking.expires_at));
  end if;

  return jsonb_build_object('id', v_booking.id, 'code', v_booking.code, 'total', v_booking.total, 'status', v_booking.status);
exception
  when no_data_found then raise exception 'product_or_slot_not_available';
end;
$$;

revoke all on function private.create_booking(jsonb, jsonb, text) from public, anon, authenticated, service_role;
grant usage on schema private to authenticated;
grant execute on function private.create_booking(jsonb, jsonb, text) to authenticated;

create function public.create_booking(p_items jsonb, p_traveler_details jsonb, p_idempotency_key text)
returns jsonb
language sql
security invoker
set search_path = ''
as $$ select private.create_booking(p_items, p_traveler_details, p_idempotency_key) $$;

revoke all on function public.create_booking(jsonb, jsonb, text) from public, anon, service_role;
grant execute on function public.create_booking(jsonb, jsonb, text) to authenticated;

-- Seed a rolling operational window for the current catalog. Admin inventory
-- tools replace this bootstrap data as providers publish real schedules.
insert into public.product_slots(product_id, starts_at, ends_at, capacity)
select p.id,
  day + time '08:00',
  day + time '08:00' + coalesce(p.duration_hours, 24) * interval '1 hour',
  case when p.product_type = 'stay' then 6 else 16 end
from public.products p
cross join generate_series(current_date, current_date + 120, interval '1 day') day
where p.status = 'published'
on conflict (product_id, starts_at) do nothing;

commit;
