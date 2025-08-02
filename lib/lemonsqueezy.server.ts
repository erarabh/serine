/**
 * frontend/lib/lemonsqueezy.server.ts
 *
 * This module runs only on the server. It pulls in your
 * LemonSqueezy store ID, API key, and variant IDs from env vars.
 */

export const STORE_ID    = process.env.NEXT_PUBLIC_LS_STORE_ID!
export const API_KEY     = process.env.LEMON_SQUEEZY_API_KEY!

if (!STORE_ID) {
  throw new Error('Missing NEXT_PUBLIC_LS_STORE_ID in .env.local')
}
if (!API_KEY) {
  throw new Error('Missing LEMON_SQUEEZY_API_KEY in .env.local')
}

export const VARIANT_IDS = {
  starter: {
    monthly:  process.env.NEXT_PUBLIC_LS_VARIANT_MONTHLY_STARTER!,
    yearly:   process.env.NEXT_PUBLIC_LS_VARIANT_YEARLY_STARTER!
  },
  professional: {
    monthly:  process.env.NEXT_PUBLIC_LS_VARIANT_MONTHLY_PROFESSIONAL!,
    yearly:   process.env.NEXT_PUBLIC_LS_VARIANT_YEARLY_PROFESSIONAL!
  }
} as const

// Sanity check
for (const plan of ['starter','professional'] as const) {
  for (const interval of ['monthly','yearly'] as const) {
    const id = VARIANT_IDS[plan][interval]
    if (!id) {
      throw new Error(
        `Missing NEXT_PUBLIC_LS_VARIANT_${interval.toUpperCase()}_${plan.toUpperCase()}`
      )
    }
  }
}

/**
 * createCheckoutLink: calls LemonSqueezy REST API to generate a hosted buy link.
 * @param params.email  the customer’s email
 * @param params.plan   'starter' | 'professional'
 * @param params.billing 'monthly' | 'yearly'
 */
export async function createCheckoutLink(params: {
  email: string
  plan: keyof typeof VARIANT_IDS
  billing: keyof typeof VARIANT_IDS['starter']
}) {
  const variantId = VARIANT_IDS[params.plan][params.billing]
  const res = await fetch(
    `https://api.lemonsqueezy.com/v1/checkouts`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        checkout: {
          variant_id: variantId,
          custom: { user_id: params.email },
          email: params.email
        }
      })
    }
  )
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`LemonSqueezy failed: ${res.status} ${body}`)
  }
  const { data } = await res.json()
  return data.attributes.hosted_checkout_url as string
}
