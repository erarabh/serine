import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { userId, agentId, sessionId, feedback } = await req.json()
  if (!userId || !sessionId || !['positive','negative'].includes(feedback)) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'
  const res = await fetch(`${backendUrl}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, agentId, sessionId, feedback })
  })

  if (!res.ok) {
    const text = await res.text()
    console.error('feedback proxy error:', text)
    return NextResponse.json({ error: 'Backend error' }, { status: res.status })
  }
  return NextResponse.json({ success: true })
}
