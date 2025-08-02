// frontend/app/api/agents/route.ts
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    if (!userId) {
      // no userId → return empty array
      return NextResponse.json({ data: [] })
    }

    const backendRes = await fetch(
  `${process.env.BACKEND_URL}/api/agents?userId=${userId}`
)




    if (!backendRes.ok) {
      console.error(
        '[agents route] backend error',
        backendRes.status,
        backendRes.statusText
      )
      return NextResponse.json({ data: [] })
    }

    // Attempt to parse the backend JSON
    const json = await backendRes.json().catch((err) => {
      console.error('[agents route] invalid JSON from backend', err)
      return null
    })

    // Normalize into an array
    const agentsArray: unknown[] =
      Array.isArray(json)
        ? json
        : Array.isArray((json as any)?.data)
        ? (json as any).data
        : []

    return NextResponse.json({ data: agentsArray })
  } catch (err) {
    console.error('[agents route] unexpected error', err)
    return NextResponse.json({ data: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/agents`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body)
      }
    )

    if (!backendRes.ok) {
      console.error(
        '[agents POST] backend error',
        backendRes.status,
        backendRes.statusText
      )
      return NextResponse.json({ data: [] }, { status: 500 })
    }

    const json = await backendRes.json().catch((err) => {
      console.error('[agents POST] invalid JSON from backend', err)
      return null
    })

    const agentsArray: unknown[] =
      Array.isArray(json)
        ? json
        : Array.isArray((json as any)?.data)
        ? (json as any).data
        : []

    return NextResponse.json({ data: agentsArray })
  } catch (err) {
    console.error('[agents POST] unexpected error', err)
    return NextResponse.json({ data: [] }, { status: 500 })
  }
}
