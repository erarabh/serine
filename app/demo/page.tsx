// app/demo/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import ChatWidget from '@/components/ChatWidget'
import { AgentProvider } from '@/lib/AgentContext'
import { Database } from '@/types/supabase'

export default function DemoPage() {
  const supabase = createClientComponentClient<Database>()
  const [userId, setUserId] = useState<string | null>(null)
  const [agentId, setAgentId] = useState<string | null>(null)

  useEffect(() => {
    const fetchSessionAndAgent = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const currentUser = session?.user
      if (currentUser?.id) {
        setUserId(currentUser.id)

        const { data: agents } = await supabase
          .from('agents')
          .select('id')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: true })
          .limit(1)

        if (agents && agents.length > 0) {
          setAgentId(agents[0].id)
        }
      }
    }

    fetchSessionAndAgent()
  }, [])

  if (!userId) {
    return <div className="text-center text-white">🔐 Please sign in to access the demo chatbot.</div>
  }

  return (
    <main className="min-h-screen bg-gradient-to-r from-indigo-400 to-purple-500 p-10 text-white">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold">Serine: AI‑Powered Agent (Demo)</h1>
        <p className="mt-4 text-lg">Multilingual chatbot with voice & smart Q&A</p>
      </div>

      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold text-purple-600 mb-2">Live Demo</h2>

        <AgentProvider userId={userId} initialAgentId={agentId}>
          <ChatWidget userId={userId} />
        </AgentProvider>
      </div>
    </main>
  )
}
