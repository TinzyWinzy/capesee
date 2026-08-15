import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.112.3'

type OutboxMessage = {
  id: string
  channel: string
  recipient: string
  template: string
  payload: Record<string, unknown>
}

const encoder = new TextEncoder()

async function digest(value: string) {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value)))
}

async function secretMatches(candidate: string, expected: string) {
  const [left, right] = await Promise.all([digest(candidate), digest(expected)])
  let difference = 0
  for (let index = 0; index < left.length; index += 1) difference |= left[index] ^ right[index]
  return difference === 0
}

function escapeHtml(value: unknown) {
  return String(value ?? '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character]!)
}

function emailContent(message: OutboxMessage) {
  const code = escapeHtml(message.payload.bookingCode)
  if (message.template === 'booking_confirmed') {
    return {
      subject: `Capesee booking ${code} confirmed`,
      html: `<h1>Your Cape experience is confirmed</h1><p>Booking <strong>${code}</strong> has been paid and confirmed.</p>`,
    }
  }

  if (message.template === 'booking_reserved') {
    const expiresAt = escapeHtml(message.payload.expiresAt)
    return {
      subject: `Complete your Capesee booking ${code}`,
      html: `<h1>Your places are reserved</h1><p>Booking <strong>${code}</strong> is held until ${expiresAt}. Complete payment before the hold expires.</p>`,
    }
  }

  throw new Error(`Unsupported notification template: ${message.template}`)
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 })

  const expectedSecret = Deno.env.get('WORKER_SECRET') ?? ''
  const candidateSecret = request.headers.get('x-worker-secret') ?? ''
  if (!expectedSecret || !candidateSecret || !await secretMatches(candidateSecret, expectedSecret)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resendKey = Deno.env.get('RESEND_API_KEY')
  const emailFrom = Deno.env.get('EMAIL_FROM')
  if (!resendKey || !emailFrom) {
    return Response.json({ error: 'Email delivery is not configured.' }, { status: 503 })
  }

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  )
  const { data, error } = await admin.rpc('claim_notification_batch', { p_limit: 20 })
  if (error) return Response.json({ error: 'Unable to claim notifications.' }, { status: 500 })

  const messages = (data ?? []) as OutboxMessage[]
  let sent = 0
  for (const message of messages) {
    try {
      if (message.channel !== 'email') throw new Error(`Unsupported notification channel: ${message.channel}`)
      const content = emailContent(message)
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: emailFrom, to: [message.recipient], ...content }),
      })
      if (!response.ok) throw new Error(`Email provider returned ${response.status}: ${await response.text()}`)
      await admin.rpc('complete_notification', { p_id: message.id, p_sent: true, p_error: null })
      sent += 1
    } catch (cause) {
      const detail = cause instanceof Error ? cause.message : 'Unknown delivery failure'
      console.error(JSON.stringify({ event: 'notification_failed', notificationId: message.id, detail }))
      await admin.rpc('complete_notification', { p_id: message.id, p_sent: false, p_error: detail })
    }
  }

  console.log(JSON.stringify({ event: 'notification_batch_complete', claimed: messages.length, sent }))
  return Response.json({ claimed: messages.length, sent, failed: messages.length - sent })
})
