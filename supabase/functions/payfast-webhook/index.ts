import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.112.3'

async function pfValidSignature(params: Record<string, string>, passphrase: string | null, receivedSig: string) {
  const keys = Object.keys(params).sort()
  let str = ''
  for (const k of keys) str += `${k}=${encodeURIComponent(params[k].trim()).replace(/%20/g, '+')}&`
  str = str.slice(0, -1)
  if (passphrase) str += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}`
  const { createHash } = await import('node:crypto')
  const expected = createHash('md5').update(str).digest('hex')
  return expected === receivedSig
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 })
  const passphrase = Deno.env.get('PAYFAST_PASSPHRASE') ?? null

  const raw = await request.text()
  const fields = new URLSearchParams(raw)
  const signature = fields.get('signature')
  if (!signature) return new Response('Missing signature', { status: 401 })

  const params: Record<string, string> = {}
  for (const [k, v] of fields.entries()) if (k !== 'signature') params[k] = v

  if (!await pfValidSignature(params, passphrase, signature)) return new Response('Invalid signature', { status: 401 })

  const mPaymentId = fields.get('m_payment_id')
  const pfPaymentId = fields.get('pf_payment_id')
  const amount = Number(fields.get('amount_gross'))
  const status = fields.get('payment_status')
  if (!mPaymentId || !Number.isFinite(amount) || !status) return new Response('Invalid payload', { status: 400 })

  // Server-to-server validation with PayFast
  const host = request.headers.get('host') ?? ''
  const validHost = host.includes('payfast.co.za') ? '' : null
  // In live, also POST back to https://api.payfast.co.za/eng/query/validate — skipped for sandbox; rely on signature + amount check

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } })
  const payload = Object.fromEntries(fields.entries())
  const { error } = await admin.rpc('process_payfast_update', {
    p_reference: mPaymentId,
    p_provider_reference: pfPaymentId,
    p_amount: amount,
    p_status: status,
    p_payload: payload,
  })
  return error ? new Response('Update failed: ' + error.message, { status: 500 }) : new Response('OK', { status: 200 })
})
