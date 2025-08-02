import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  // Validate signature, then:
  if (body.event === 'checkout_completed') {
    const checkout = body.data
    // Save checkout.attributes.customer_email,
    // checkout.attributes. variant_id,
    // checkout.attributes.subscription_id, etc.
  }
  return NextResponse.json({})
}
