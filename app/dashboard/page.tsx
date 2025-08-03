import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import AuthBox from '@/components/AuthBox'
import DashboardClient from '@/components/DashboardClient'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  // 1) Get cookie store so Supabase SSR can read the session
  const cookieStore = cookies()

  // 2) Instantiate Supabase server client
  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  })

  // 3) Fetch the currently logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 4) If not authenticated, show the sign-in box
  if (!user) {
    return <AuthBox />
  }

  // 5) Otherwise render the client bundle, passing userId
  return <DashboardClient userId={user.id} />
}
