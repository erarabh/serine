'use client'

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { ReactNode, useState } from 'react'

export default function SupabaseClientWrapper({
  children,
}: {
  children: ReactNode
}) {
  const [supabaseClient] = useState(() =>
    createPagesBrowserClient({
      cookieOptions: {
        // 1. Name your cookie using your project ref
        name: `sb-${
          process.env.NEXT_PUBLIC_SUPABASE_URL!
            .replace('https://', '')
            .split('.')[0]
        }-auth-token`,

        // 2. Domain comes from .env.local
        domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN!,

        path: '/',
        sameSite: 'lax',

        // 3. Only secure in production
        secure: process.env.NODE_ENV === 'production',
      },
    })
  )

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  )
}
