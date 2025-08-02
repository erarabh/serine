// frontend/app/api/metrics/track/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient }          from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!    // Service‐role key to bypass RLS
)

export async function POST(req: NextRequest) {
  const { userId, count = 1 } = await req.json()
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  // Build today’s date string (YYYY-MM-DD)
  const today = new Date().toISOString().slice(0, 10)

  // Upsert: if there's already a row for this user+date, increment it
  const { error } = await supabaseAdmin
    .from('chat_metrics')
    .upsert(
      { user_id: userId, date: today, total_messages: count },
      { onConflict: ['user_id', 'date'], ignoreDuplicates: false }
    )
    .eq('user_id', userId)
    .eq('date', today)
    .select()

  if (error) {
    console.error('📈 track error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
