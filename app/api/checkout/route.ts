import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    // 1) Grab the JSON you sent from the browser
    const payload = await request.json()

    // 2) Forward to your Express backend
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/checkout`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    )

    // 3) Attempt to read a text response
    const text = await backendRes.text()

    // 4) Try to parse JSON if content exists
    let data: any = {}
    if (text) {
      try {
        data = JSON.parse(text)
      } catch (err) {
        console.error('[checkout proxy] Invalid JSON from backend:', text)
        return NextResponse.json(
          { error: 'Invalid response from backend' },
          { status: 502 }
        )
      }
    }

    // 5) If backend returned an error status, propagate it
    if (!backendRes.ok) {
      console.error('[checkout proxy] backend error:', data)
      return NextResponse.json(
        { error: data?.error || 'Checkout failed' },
        { status: backendRes.status }
      )
    }

    // 6) Success: return whatever JSON the backend gave you
    return NextResponse.json(data, { status: 200 })

  } catch (err: any) {
    console.error('[checkout proxy] unhandled error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
