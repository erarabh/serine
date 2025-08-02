import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const searchParams = url.searchParams

  const userId = searchParams.get('userId')
  const agentId = searchParams.get('agentId')
  const range = searchParams.get('range') ?? '7d'

  console.log('[Sentiments API] Params:', { userId, agentId, range })

  if (!userId) {
    console.warn('[Sentiments API] Missing userId')
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  // proxy backend
  const base = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080'
  let proxyUrl = `${base}/api/chat_sentiments?userId=${encodeURIComponent(userId)}`
  if (agentId) proxyUrl += `&agentId=${encodeURIComponent(agentId)}`

  if (range !== 'all') {
    const days = range === '30d' ? 30 : 7
    const startDate = new Date(Date.now() - days * 864e5).toISOString().slice(0, 10)
    const endDate = new Date().toISOString().slice(0, 10)
    proxyUrl += `&start_date=${startDate}&end_date=${endDate}`
  }

  try {
    const backendRes = await fetch(proxyUrl)
    const text = await backendRes.text()

    if (!backendRes.ok) {
      console.error('[Sentiments API] Backend error:', backendRes.status, text)
      return NextResponse.json({ error: 'Backend error' }, { status: backendRes.status })
    }

    const parsed = JSON.parse(text)
    const data = parsed.data || []

    if (data.length === 0) {
      console.warn('[Sentiments API] No sentiment entries found')
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.error('[Sentiments API] Proxy failed:', err)
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 })
  }
}
