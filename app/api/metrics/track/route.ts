import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 👇 Define row shape for clarity and type safety
type ChatMetric = {
  user_id: string
  date: string
  total_messages: number
}

export async function POST(req: NextRequest) {
  const { userId, count = 1 } = await req.json()
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  const today = new Date().toISOString().slice(0, 10)

  const payload: ChatMetric = {
    user_id: userId,
    date: today,
    total_messages: count
  }

  const { error } = await supabaseAdmin
    .from('chat_metrics')
    .upsert(payload, {
      onConflict: 'user_id,date',
      ignoreDuplicates: false
    })
    .eq('user_id', userId)
    .eq('date', today)
    .select()

  if (error) {
    console.error('📈 track error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
