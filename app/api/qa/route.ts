// frontend/app/api/qa/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  console.log('[QA API] Received GET request:', req.url)
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const agentId = searchParams.get('agentId')
  console.log('[QA API] Params:', { userId, agentId })

  if (!userId) {
    console.warn('[QA API] Missing userId')
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'
  const url =
    `${backendUrl}/qa/${encodeURIComponent(userId)}` +
    (agentId ? `?agentId=${encodeURIComponent(agentId)}` : '')

  try {
    const backendRes = await fetch(url)
    const text = await backendRes.text()
    console.log('[QA API] Backend response:', backendRes.status, text)

    if (!backendRes.ok) {
      console.error('❌ GET /qa returned', backendRes.status, text)
      return NextResponse.json({ error: 'Backend error' }, { status: backendRes.status })
    }

    const data = JSON.parse(text)
    return NextResponse.json(data)
  } catch (err) {
    console.error('❌ GET /api/qa proxy failed', err)
    return NextResponse.json({ error: 'Proxy fetch failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  console.log('[QA API] Received POST request')
  const body = await req.json()
  console.log('[QA API] Body:', body)

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'
  try {
    const backendRes = await fetch(`${backendUrl}/qa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const text = await backendRes.text()
    console.log('[QA API] POST /qa response:', backendRes.status, text)

    if (!backendRes.ok) {
      return NextResponse.json({ error: 'Backend POST error' }, { status: backendRes.status })
    }

    const data = JSON.parse(text)
    return NextResponse.json(data)
  } catch (err) {
    console.error('❌ POST /api/qa proxy failed', err)
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  console.log('[QA API] Received DELETE request:', req.url)
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) {
    console.warn('[QA API] Missing id for DELETE')
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'
  try {
    const backendRes = await fetch(`${backendUrl}/qa/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
    const text = await backendRes.text()
    console.log('[QA API] DELETE /qa response:', backendRes.status, text)

    if (!backendRes.ok) {
      return NextResponse.json({ error: 'Backend DELETE error' }, { status: backendRes.status })
    }

    const data = JSON.parse(text)
    return NextResponse.json(data)
  } catch (err) {
    console.error('❌ DELETE /api/qa proxy failed', err)
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 })
  }
}
