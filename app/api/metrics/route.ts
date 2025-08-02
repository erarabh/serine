// frontend/app/api/metrics/route.ts

export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // Lazy-load Supabase admin client
  const { createClient } = await import('@supabase/supabase-js')
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const url     = new URL(req.url)
  const userId  = url.searchParams.get('userId')
  const agentId = url.searchParams.get('agentId')
  const start   = url.searchParams.get('start')  // YYYY-MM-DD
  const end     = url.searchParams.get('end')    // YYYY-MM-DD

  if (!userId || !agentId || !start || !end) {
    return NextResponse.json(
      { error: 'Missing query params: userId, agentId, start or end' },
      { status: 400 }
    )
  }

  const { data: rows, error } = await supabaseAdmin
    .from('chat_metrics')
    .select(`
      date,
      total_messages,
      user_messages,
      bot_messages,
      positive,
      neutral,
      negative,
      avg_response_time_ms,
      satisfaction_score
    `)
    .eq('user_id',  userId)
    .eq('agent_id', agentId)
    .gte('date',    start)
    .lte('date',    end)
    .order('date',  { ascending: true })

  if (error) {
    console.error('[/api/metrics] error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Fill zeros for missing dates
  const startDt = new Date(start)
  const endDt   = new Date(end)
  const allDates: string[] = []
  for (let d = new Date(startDt); d <= endDt; d.setDate(d.getDate() + 1)) {
    allDates.push(d.toISOString().slice(0, 10))
  }

  const map = new Map(rows.map(r => [r.date, r]))
  const full = allDates.map(date => {
    const r = map.get(date)
    return {
      date,
      total_messages:       r?.total_messages       ?? 0,
      user_messages:        r?.user_messages        ?? 0,
      bot_messages:         r?.bot_messages         ?? 0,
      positive:             r?.positive             ?? 0,
      neutral:              r?.neutral              ?? 0,
      negative:             r?.negative             ?? 0,
      avg_response_time_ms: r?.avg_response_time_ms ?? 0,
      satisfaction_score:   r?.satisfaction_score   ?? 0,
    }
  })

  return NextResponse.json({ data: full })
}
