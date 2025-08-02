'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import EmbedChatbot from '@/components/EmbedChatbot'
import { AgentProvider } from '@/lib/AgentContext'
import { Language } from '@/lib/i18n'

export default function EmbedPage() {
  const params = useSearchParams()
  const userId = params.get('uid')
  const agentId = params.get('aid')
  const lang = (params.get('lang') || 'en') as Language

  if (!userId) return <div>❌ Missing user ID.</div>

  return (
    <AgentProvider userId={userId} initialAgentId={agentId}>
      <Suspense fallback={<div>🔄 Loading chatbot...</div>}>
        <EmbedChatbot userId={userId} agentId={agentId} lang={lang} />
      </Suspense>
    </AgentProvider>
  )
}
