// frontend/lib/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js'

// This file is imported only by your Next.js API routes!
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,       // or process.env.SUPABASE_URL!
  process.env.SUPABASE_SERVICE_ROLE_KEY!,     // service-role key—keep this server-only
  { auth: { persistSession: false } }
)
