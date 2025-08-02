'use client'

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { ReactNode, useState } from 'react'

export default function SupabaseClientWrapper({
  children,
}: {
  children: ReactNode
}) {
  // Instantiate a browser‐only Supabase client here
  const [supabaseClient] = useState(() =>
    createPagesBrowserClient({
      // preserve your cookie options
      cookieOptions: {
        name: `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL
          ?.split('https://')[1]
          ?.split('.')[0]}-auth-token`,
        lifetime: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'lax',
      },
    })
  )

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  )
}
