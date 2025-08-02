// frontend/app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  // 1) Extract the ID from the URL path: /api/users/{id}
  const urlParts = new URL(req.url).pathname.split('/')
  const userId   = urlParts[urlParts.length - 1]

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  // 2) Query Supabase for that user
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, email, plan, plan_period')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('/api/users/[id] error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}



/*
// frontend/app/api/users/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use your Supabase URL + Key from env.
// - For public reads you can use the anon key (NEXT_PUBLIC_…),
// - For secure server‐side reads consider SUPABASE_SERVICE_ROLE_KEY.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id

  const { data, error } = await supabase
    .from('users')
    .select('plan, plan_period, plan_started_at, plan_ends_at')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('[users API] ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
*/