// frontend/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

export async function POST(req: NextRequest) {
  try {
    const { userId, agentId, message } = await req.json()
    if (!userId || !agentId || !message) {
      return NextResponse.json(
        { error: 'Missing userId, agentId or message' }, 
        { status: 400 }
      )
    }

    // Forward to your Express /chat endpoint with snake_case keys
    const backendRes = await fetch(`${BACKEND_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id:  userId,
        agent_id: agentId,
        message
      })
    })

    const data = await backendRes.json()
    if (!backendRes.ok) {
      return NextResponse.json(
        { error: data.error || 'Backend error' },
        { status: backendRes.status }
      )
    }
    return NextResponse.json(data)
  } catch (err: any) {
    console.error('[Proxy /api/chat] Error:', err)
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
