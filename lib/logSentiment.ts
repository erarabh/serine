// lib/logSentiment.ts

export interface SentimentEntry {
  user_id:        string
  agent_id:       string
  message:        string
  sentiment_score: number
  sentiment_label: string
  positive_words?: string[]
  negative_words?: string[]
}

export async function logSentiment(entry: SentimentEntry) {
  // Lazy-load Supabase client
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase
    .from('chat_sentiments')
    .insert({
      ...entry,
      created_at: new Date().toISOString()
    })

  if (error) {
    console.error('[logSentiment] Failed to insert:', error.message)
  }
}
