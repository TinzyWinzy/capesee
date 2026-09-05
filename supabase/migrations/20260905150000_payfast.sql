begin;

-- PayFast reconciliation — mirrors paynow but for provider='payfast' and PayFast status set (COMPLETE)
create function private.process_payfast_update(
  p_reference text,
  p_provider_reference text,
  p_amount numeric,
  p_status text,
  p_payload jsonb
) returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_booking public.bookings;
  v_attempt public.payment_attempts;
  v_normalized text := lower(trim(p_status));
  v_paid boolean := v_normalized in ('complete','paid','completed');
  v_failed boolean := v_normalized in ('cancelled','failed','disputed');
begin
  select * into strict v_booking from public.bookings where code = p_reference for update;
  if p_amount <> v_booking.total then raise exception 'payment_amount_mismatch'; end if;

  select * into strict v_attempt from public.payment_attempts
  where booking_id = v_booking.id and provider in ('payfast','paynow')
  order by created_at desc limit 1 for update;

  if v_booking.payment_status = 'paid' and not v_paid and v_normalized <> 'refunded' then
    return jsonb_build_object('bookingId', v_booking.id, 'status', v_booking.status, 'duplicate', true);
  end if;

  update public.payment_attempts set
    provider_reference = coalesce(p_provider_reference, provider_reference),
    status = case
      when v_paid then 'paid'
      when v_normalized = 'refunded' then 'refunded'
      when v_failed then 'failed'
      else 'redirected'
    end,
    provider_payload = coalesce(p_payload, '{}'::jsonb)
  where id = v_attempt.id;

  if v_paid then
    update public.bookings set status = 'confirmed', payment_status = 'paid',
      payment_reference = p_provider_reference, expires_at = null
    where id = v_booking.id;
    insert into public.notification_outbox(user_id, booking_id, channel, template, recipient, payload)
    select v_booking.traveler_id, v_booking.id, 'email', 'booking_confirmed',
      v_booking.traveler_details ->> 'email', jsonb_build_object('bookingCode', v_booking.code)
    where nullif(v_booking.traveler_details ->> 'email', '') is not null
      and not exists (
        select 1 from public.notification_outbox n
        where n.booking_id = v_booking.id and n.template = 'booking_confirmed'
      );
  elsif v_normalized = 'refunded' then
    update public.bookings set status = 'refunded', payment_status = 'refunded' where id = v_booking.id;
  elsif v_failed and v_booking.payment_status in ('unpaid', 'pending', 'failed') then
    update public.product_slots s set
      reserved = greatest(0, s.reserved - bi.quantity),
      status = case when s.status = 'sold_out' then 'open' else s.status end
    from public.booking_items bi
    where bi.booking_id = v_booking.id and bi.product_id = s.product_id
      and s.starts_at = bi.service_date;
    update public.bookings set status = 'cancelled', payment_status = 'failed', expires_at = null
    where id = v_booking.id;
  else
    update public.bookings set payment_status = 'pending' where id = v_booking.id;
  end if;

  insert into public.audit_events(actor_id, entity_type, entity_id, action, metadata)
  values (null, 'booking', v_booking.id::text, 'payfast_status_received',
    jsonb_build_object('status', p_status, 'providerReference', p_provider_reference));

  return jsonb_build_object('bookingId', v_booking.id, 'status', p_status);
end;
$$;

revoke all on function private.process_payfast_update(text, text, numeric, text, jsonb) from public, anon, authenticated;
grant execute on function private.process_payfast_update(text, text, numeric, text, jsonb) to service_role;
grant usage on schema private to service_role;

create function public.process_payfast_update(
  p_reference text, p_provider_reference text, p_amount numeric, p_status text, p_payload jsonb
) returns jsonb
language sql security invoker set search_path = '' as $$ select private.process_payfast_update(p_reference, p_provider_reference, p_amount, p_status, p_payload) $$;

revoke all on function public.process_payfast_update(text, text, numeric, text, jsonb) from public, anon, authenticated;
grant execute on function public.process_payfast_update(text, text, numeric, text, jsonb) to service_role;

commit;
