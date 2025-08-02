import { NextResponse }                   from 'next/server'
import { cookies }                       from 'next/headers'
import { createRouteHandlerClient }      from '@supabase/auth-helpers-nextjs'
import { trainWebsite }                  from '@/lib/trainWebsite'

export async function POST(req: Request) {
  const cookieStore = cookies()
  const supabase    = createRouteHandlerClient({ cookies: () => cookieStore })

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const {
    data: agents,
    error: agentError
  } = await supabase
    .from('agents')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)
  if (agentError || !agents?.length) {
    return NextResponse.json({ error: 'No agent found' }, { status: 400 })
  }

  const { url } = (await req.json()) as { url?: string }
  if (!url) {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 })
  }

  try {
    const inserted = await trainWebsite(url, user.id, agents[0].id)
    return NextResponse.json({ success: true, inserted })
  } catch (err: any) {
    console.error('❌ trainWebsite failed:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
