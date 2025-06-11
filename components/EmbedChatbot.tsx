// ✅ File: frontend/components/EmbedChatbot.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import ChatWidget from './ChatWidget'

export default function EmbedChatbot() {
  const params = useSearchParams()
  const userId = params.get('uid') || ''
  const [open, setOpen] = useState(true)

  return (
    <div className="fixed bottom-6 right-4 z-[9999]">
      {open ? (
        <div className={`transition-transform duration-300 scale-100 hover:scale-100 w-[290px] h-[410px] bg-white rounded-xl shadow-lg border overflow-hidden flex flex-col`}>
          <div className="flex justify-between items-center px-4 py-2 bg-purple-600 text-white">
            <span className="font-semibold">💬 Serine AI Assistant</span>
            <button
              onClick={() => {
                setOpen(false)
                window.parent.postMessage('serine:close', '*')
              }}
              className="text-white text-xl hover:text-gray-200 focus:outline-none"
              title="Close chatbot"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatWidget userId={userId} />
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            setOpen(true)
            window.parent.postMessage('serine:open', '*')
          }}
          className="w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg text-2xl hover:bg-purple-700"
          title="Open chatbot"
        >
          🤖
        </button>
      )}
    </div>
  )
}
