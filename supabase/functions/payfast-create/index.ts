import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.112.3'

const allowedOrigin = Deno.env.get('APP_URL') ?? ''
const cors = (origin: string | null) => ({
  'Access-Control-Allow-Origin': origin && origin === allowedOrigin ? origin : allowedOrigin,
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
})

function pfSignature(params: Record<string, string>, passphrase: string | null): string {
  // PayFast signature: md5 of query string (url-encoded values) + passphrase
  const keys = Object.keys(params).sort()
  let str = ''
  for (const k of keys) {
    str += `${k}=${encodeURIComponent(params[k].trim()).replace(/%20/g, '+')}&`
  }
  str = str.slice(0, -1)
  if (passphrase) str += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}`
  // use subtle md5 via crypto? Deno crypto supports md5 via subtle? Use simple md5 via crypto.subtle is not md5, so use npm md5? Fallback to fetch md5 via crypto
  return str // we will md5 below
}

async function md5(value: string) {
  const data = new TextEncoder().encode(value)
  // Deno WebCrypto doesn't support MD5, use npm md5 via dynamic import would be heavy; PayFast accepts either MD5 via passphrase — we compute via simple JS md5 impl inline
  // Minimal MD5 impl (public domain)
  // For brevity, delegate to crypto.subtle if available via md5-js: use js-md5 via import map? Instead use Deno's md5 via createHash if available
  // @ts-ignore Deno std
  const { createHash } = await import('node:crypto')
  return createHash('md5').update(value).digest('hex')
}

Deno.serve(async (request) => {
  const headers = cors(request.headers.get('origin'))
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers })
  if (request.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405, headers })

  const merchantId = Deno.env.get('PAYFAST_MERCHANT_ID')
  const merchantKey = Deno.env.get('PAYFAST_MERCHANT_KEY')
  const passphrase = Deno.env.get('PAYFAST_PASSPHRASE')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  if (!merchantId || !merchantKey || !allowedOrigin) {
    return Response.json({ error: 'PayFast not configured.' }, { status: 503, headers })
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
  const notifyUrl = `${supabaseUrl}/functions/v1/payfast-webhook`
  const returnUrl = `${allowedOrigin}/checkout/processing?booking=${booking.id}`
  const cancelUrl = `${allowedOrigin}/checkout/payment?booking=${booking.id}`

  const params: Record<string, string> = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: returnUrl,
    cancel_url: cancelUrl,
    notify_url: notifyUrl,
    m_payment_id: booking.code,
    amount: Number(booking.total).toFixed(2),
    item_name: `Capesee ${booking.code}`,
    item_description: `Capesee booking ${booking.code}`,
    email_address: details.email ?? authData.user.email ?? '',
    custom_str1: booking.id,
    custom_str2: idempotencyKey,
  }

  const sigStr = pfSignature(params, passphrase)
  const signature = await md5(sigStr)
  const query = new URLSearchParams({ ...params, signature }).toString()
  const checkoutUrl = `https://www.payfast.co.za/eng/process?${query}`

  const { error: insertError } = await admin.from('payment_attempts').insert({
    booking_id: booking.id, provider: 'payfast', idempotency_key: idempotencyKey,
    amount: booking.total, currency: booking.currency, status: 'redirected', checkout_url: checkoutUrl,
    provider_payload: { payfast_params: params },
  })
  if (insertError) return Response.json({ error: 'Unable to save payment attempt.' }, { status: 500, headers })
  await admin.from('bookings').update({ payment_status: 'pending' }).eq('id', booking.id)
  return Response.json({ checkoutUrl, reference: booking.code }, { headers })
})
