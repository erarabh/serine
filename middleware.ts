import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // ✅ Wrap cookies inside closure as required by Next.js
  const supabase = createMiddlewareClient({ req, res })

  // ✅ Await inside async function — suppresses cookies warning
  await supabase.auth.getSession()

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*'
  ]
}													 