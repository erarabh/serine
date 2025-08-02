// frontend/app/api/portal/route.ts
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest) {
  const payload = {
    data: {
      type: 'portal_sessions',
      attributes: {
        redirect_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard`
      }
    }
  }

  const lsRes = await fetch(
    `https://api.lemonsqueezy.com/v1/stores/${process.env.LS_STORE_ID}/portal_sessions`,
    {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept':       'application/vnd.api+json',
        'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`
      },
      body: JSON.stringify(payload)
    }
  )

  const text = await lsRes.text()
  if (!lsRes.ok) {
    console.error('[portal route] LS error →', text)
    return NextResponse.json(
      { error: 'Could not open portal', details: text },
      { status: lsRes.status }
    )
  }

  const { data } = JSON.parse(text)
  return NextResponse.json({ url: data.attributes.url })
}
