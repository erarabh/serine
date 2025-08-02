// frontend/app/dashboard/page.tsx

import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import AuthBox from '@/components/AuthBox'
import DashboardClient from '@/components/DashboardClient'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  // 1) Await the cookies store so Next knows we’ve handled the dynamic API
  const cookieStore = await cookies()

  // 2) Pass a zero-arg function to Supabase pointing at our awaited store
  const supabase = createServerComponentClient({
    cookies: () => cookieStore
  })

  // 3) Fetch current user
  const {
    data: { user }
  } = await supabase.auth.getUser()

  // 4) If not logged in, render the AuthBox
  if (!user) {
    return <AuthBox />
  }

  // 5) Otherwise render the Dashboard
  return <DashboardClient userId={user.id} />
}
