// app/api/webhooks/lemonsqueezy/route.ts

import { NextResponse } from 'next/server'
import crypto from 'crypto'

export const runtime = 'nodejs'

function verifySignature(rawBody: string, signature: string, secret: string) {
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  return (
    signature.length === expected.length &&
    crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expected, 'hex')
    )
  )
}

export async function POST(request: Request) {
  const signature = request.headers.get('x-hook-signature')
  const rawBody   = await request.text()

  if (!signature) {
    console.error('[webhook] Missing signature header')
    return NextResponse.json({ error: 'Missing signature' }, { status: 401 })
  }
  if (!verifySignature(rawBody, signature, process.env.LEMONSQUEEZY_WEBHOOK_SECRET!)) {
    console.error('[webhook] Invalid signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: any
  try {
    payload = JSON.parse(rawBody)
  } catch (err) {
    console.error('[webhook] JSON parse error:', err)
    return NextResponse.json({ error: 'Malformed JSON' }, { status: 400 })
  }

  const eventName =
    payload.event ||
    payload.meta?.event_name ||
    payload.meta?.eventName

  const customData =
    payload.meta?.custom_data ||
    payload.data?.attributes?.custom_data ||
    {}

  const userId    = customData.user_id
  const userEmail =
    customData.email ||
    payload.data?.attributes?.user_email

  if (!userId || !userEmail) {
    console.error('[webhook] Missing user_id or email in payload')
    return NextResponse.json(
      { error: 'Missing custom_data.user_id or user_email' },
      { status: 400 }
    )
  }

  // Only handle these events
  if (
    eventName !== 'subscription_created' &&
    eventName !== 'subscription_payment_success'
  ) {
    console.log('[webhook] Ignoring event:', eventName)
    return NextResponse.json({ ignored: true }, { status: 200 })
  }

  // Lazy-load Supabase admin client
  const { createClient } = await import('@supabase/supabase-js')
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Map variant → plan/period
  const variantId = payload.data.attributes.variant_id as number
  const planMap: Record<number, { plan: string; period: string }> = {
    899349: { plan: 'starter',      period: 'monthly' },
    899351: { plan: 'starter',      period: 'yearly'  },
    899352: { plan: 'professional', period: 'monthly' },
    899353: { plan: 'professional', period: 'yearly'  }
  }
  const mapping = planMap[variantId]
  if (!mapping) {
    console.error('[webhook] Unknown variant_id:', variantId)
    return NextResponse.json({ error: 'Unknown variant_id' }, { status: 400 })
  }

  // Ensure Auth user exists (create if missing)
  const { data: lookupUser, error: lookupErr } =
    await supabaseAdmin.auth.admin.getUserById(userId)

  if (lookupErr && lookupErr.message.includes('User not found')) {
    const password = crypto.randomBytes(12).toString('base64')
    const { error: createErr } = await supabaseAdmin.auth.admin.createUser({
      id:            userId,
      email:         userEmail,
      password,
      email_confirm: true
    })
    if (createErr) {
      console.error('[webhook] Auth create failed:', createErr)
      return NextResponse.json({ error: 'Auth creation failed' }, { status: 500 })
    }
  } else if (lookupErr) {
    console.error('[webhook] Auth lookup error:', lookupErr)
    return NextResponse.json({ error: 'Auth lookup failed' }, { status: 500 })
  }

  // Update users table
  const { error: updateErr } = await supabaseAdmin
    .from('users')
    .update({
      plan:        mapping.plan,
      plan_period: mapping.period
    })
    .eq('id', userId)

  if (updateErr) {
    console.error('[webhook] DB update failed:', updateErr)
    return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
  }

  console.log(`[webhook] Updated ${userId} → ${mapping.plan}/${mapping.period}`)
  return NextResponse.json({ success: true }, { status: 200 })
}
