import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.112.3'

const allowedOrigin = Deno.env.get('APP_URL') ?? ''
const cors = (origin: string | null) => ({
  'Access-Control-Allow-Origin': origin && origin === allowedOrigin ? origin : allowedOrigin,
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
})

async function sha512(value: string) {
  const digest = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('').toUpperCase()
}

async function makeHash(values: string[], key: string) {
  return sha512(values.join('') + key)
}

Deno.serve(async (request) => {
  const headers = cors(request.headers.get('origin'))
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers })
  if (request.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405, headers })

  const integrationId = Deno.env.get('PAYNOW_INTEGRATION_ID')
  const integrationKey = Deno.env.get('PAYNOW_INTEGRATION_KEY')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  if (!integrationId || !integrationKey || !allowedOrigin) {
    return Response.json({ error: 'Payments are not configured.' }, { status: 503, headers })
  }

  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
  const { data: authData, error: authError } = await admin.auth.getUser(token)
  if (authError || !authData.user) return Response.json({ error: 'Authentication required.' }, { status: 401, headers })

  const { bookingId, idempotencyKey } = await request.json() as { bookingId?: string; idempotencyKey?: string }
  if (!bookingId || !idempotencyKey) return Response.json({ error: 'Invalid payment request.' }, { status: 400, headers })

  const { data: booking } = await admin.from('bookings').select('*').eq('id', bookingId).eq('traveler_id', authData.user.id).maybeSingle()
  if (!booking || booking.status !== 'pending' || booking.payment_status === 'paid') {
    return Response.json({ error: 'Booking is not payable.' }, { status: 409, headers })
  }
  if (booking.expires_at && new Date(booking.expires_at) <= new Date()) {
    return Response.json({ error: 'Reservation has expired.' }, { status: 409, headers })
  }

  const { data: existing } = await admin.from('payment_attempts').select('checkout_url, provider_reference, status')
    .eq('idempotency_key', idempotencyKey).maybeSingle()
  if (existing?.checkout_url && existing.status !== 'failed') {
    return Response.json({ checkoutUrl: existing.checkout_url, reference: existing.provider_reference }, { headers })
  }

  const details = booking.traveler_details as Record<string, string>
  const resultUrl = `${supabaseUrl}/functions/v1/paynow-webhook`
  const returnUrl = `${allowedOrigin}/checkout/processing?booking=${booking.id}`
  const fields: Array<[string, string]> = [
    ['id', integrationId],
    ['reference', booking.code],
    ['amount', Number(booking.total).toFixed(2)],
    ['additionalinfo', `Capesee booking ${booking.code}`],
    ['returnurl', returnUrl],
    ['resulturl', resultUrl],
    ['authemail', details.email ?? authData.user.email ?? ''],
    ['status', 'Message'],
  ]
  const hash = await makeHash(fields.map(([, value]) => value), integrationKey)
  const body = new URLSearchParams([...fields, ['hash', hash]])
  const response = await fetch('https://www.paynow.co.zw/interface/initiatetransaction', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body,
  })
  const responseText = await response.text()
  const result = new URLSearchParams(responseText)
  const receivedHash = result.get('hash') ?? result.get('Hash')
  const responseValues = Array.from(result.entries()).filter(([key]) => key.toLowerCase() !== 'hash').map(([, value]) => value)
  if (!receivedHash || receivedHash.toUpperCase() !== await makeHash(responseValues, integrationKey)) {
    return Response.json({ error: 'Invalid response from payment provider.' }, { status: 502, headers })
  }

  const status = result.get('status') ?? result.get('Status')
  const checkoutUrl = result.get('browserurl') ?? result.get('BrowserUrl')
  const pollUrl = result.get('pollurl') ?? result.get('PollUrl')
  if (status?.toLowerCase() !== 'ok' || !checkoutUrl) {
    return Response.json({ error: result.get('error') ?? result.get('Error') ?? 'Payment initiation failed.' }, { status: 502, headers })
  }

  const { error: insertError } = await admin.from('payment_attempts').insert({
    booking_id: booking.id, provider: 'paynow', idempotency_key: idempotencyKey,
    amount: booking.total, currency: booking.currency, status: 'redirected', checkout_url: checkoutUrl,
    provider_payload: { pollurl: pollUrl },
  })
  if (insertError) return Response.json({ error: 'Unable to save payment attempt.' }, { status: 500, headers })
  await admin.from('bookings').update({ payment_status: 'pending' }).eq('id', booking.id)
  return Response.json({ checkoutUrl, reference: booking.code }, { headers })
})
