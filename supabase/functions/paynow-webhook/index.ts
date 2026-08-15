import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.112.3'

async function sha512(value: string) {
  const digest = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('').toUpperCase()
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 })
  const integrationKey = Deno.env.get('PAYNOW_INTEGRATION_KEY')
  if (!integrationKey) return new Response('Unavailable', { status: 503 })

  const raw = await request.text()
  const fields = new URLSearchParams(raw)
  const receivedHash = fields.get('hash')
  const values = Array.from(fields.entries()).filter(([key]) => key.toLowerCase() !== 'hash').map(([, value]) => value)
  const expected = await sha512(values.join('') + integrationKey)
  if (!receivedHash || receivedHash.toUpperCase() !== expected) return new Response('Invalid signature', { status: 401 })

  const reference = fields.get('reference')
  const amount = Number(fields.get('amount'))
  const status = fields.get('status')
  if (!reference || !Number.isFinite(amount) || !status) return new Response('Invalid payload', { status: 400 })

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false },
  })
  const payload = Object.fromEntries(fields.entries())
  delete payload.hash
  const { error } = await admin.rpc('process_paynow_update', {
    p_reference: reference,
    p_provider_reference: fields.get('paynowreference'),
    p_amount: amount,
    p_status: status,
    p_payload: payload,
  })
  return error ? new Response('Update failed', { status: 500 }) : new Response('OK', { status: 200 })
})
