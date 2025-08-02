import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId  = searchParams.get('userId')
  const agentId = searchParams.get('agentId')
  const start   = searchParams.get('start')   // 'YYYY-MM-DD'
  const end     = searchParams.get('end')     // 'YYYY-MM-DD'
  const limit   = Number(searchParams.get('limit') ?? '10')

  if (!userId || !agentId || !start || !end) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  // 1) Fetch all negative‐sentiment messages in date range
  const { data: rows, error } = await supabaseAdmin
    .from('chat_sentiments')
    .select('message')
    .eq('user_id', userId)
    .eq('agent_id', agentId)
    .eq('sentiment_label', 'negative')
    .gte('created_at', `${start}T00:00:00.000Z`)
    .lte('created_at', `${end}T23:59:59.999Z`)

  if (error) {
    console.error('/api/metrics/unanswered error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 2) Group by question text and count
  const counts: Record<string, number> = {}
  rows.forEach(r => {
    counts[r.message] = (counts[r.message] || 0) + 1
  })

  // 3) Build top‐N list
  const data = Object.entries(counts)
    .map(([question, count]) => ({ question, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)

  return NextResponse.json({ data })
}
