import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use anon if RLS is disabled
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  // 1) Count Agents
  const { count: agentCount = 0, error: e1 } = await supabase
    .from('agents')
    .select('id', { head: true, count: 'exact' })
    .eq('user_id', userId)

  // 2) Count Q&A Pairs
  const { count: qaPairs = 0, error: e2 } = await supabase
    .from('qa_pairs')
    .select('id', { head: true, count: 'exact' })
    .eq('user_id', userId)

  // 3) Sum messages from chat_metrics *this month only*
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthStartStr = monthStart.toISOString().slice(0, 10)
  const todayStr = now.toISOString().slice(0, 10)

  const { data: metricsData, error: e3 } = await supabase
    .from('chat_metrics')
    .select('total_messages')
    .eq('user_id', userId)
    .gte('date', monthStartStr)
    .lte('date', todayStr)

  if (e1 || e2 || e3) {
    console.error('Usage errors:', e1, e2, e3)
    return NextResponse.json({ error: 'Usage fetch failed' }, { status: 500 })
  }

  const apiCalls = Array.isArray(metricsData)
    ? metricsData.reduce((sum, row) => sum + (row.total_messages ?? 0), 0)
    : 0

  return NextResponse.json({
    agent_count: agentCount,
    qa_pairs: qaPairs,
    api_calls: apiCalls,
  })
}
