'use client'

import { useEffect, useState } from 'react'
import ChatWidget from './ChatWidget'
import { Language } from '@/lib/i18n'
import { AgentProvider } from '@/lib/AgentContext'

interface Props {
  userId: string
  agentId: string | null
  lang: Language
}

export default function EmbedChatbot({ userId, agentId, lang }: Props) {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data === 'serine:open') setOpen(true)
      if (e.data === 'serine:close') setOpen(false)
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  if (!open) return null

  return (
    <div className="fixed bottom-6 right-4 z-[9999]">
      <div className="transition-all duration-300 w-[290px] h-[425px] bg-white rounded-xl shadow-lg border overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-4 py-2 bg-purple-600 text-white">
          💬 Serine AI Assistant
          <button
            onClick={() => window.parent.postMessage('serine:close', '*')}
            className="text-white text-xl hover:text-gray-200 focus:outline-none"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          {/* ✅ Use AgentProvider here to provide context */}
          <AgentProvider userId={userId} initialAgentId={agentId}>
            <ChatWidget userId={userId} lang={lang} />
          </AgentProvider>
        </div>
      </div>
    </div>
  )
}
