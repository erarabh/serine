// app/api/sessions/route.ts

import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // Lazy-load Supabase client
  const { createClient } = await import('@supabase/supabase-js')
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { searchParams } = new URL(req.url)
  const userId  = searchParams.get('userId')
  const agentId = searchParams.get('agentId')

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  let query = sb
    .from('sessions')
    .select('role, message, created_at')
    .eq('user_id', userId)

  if (agentId) query = query.eq('agent_id', agentId)
  else         query = query.is('agent_id', null)

  const { data, error } = await query.order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ data })
}
