// ✅ File: /app/embed/page.tsx
'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

type Sender = 'user' | 'bot'

export default function EmbedChatbot() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('uid')

  const [message, setMessage] = useState('')
  const [chat, setChat] = useState<{ sender: Sender; text: string }[]>([])
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!message.trim()) return
    if (!userId) return alert('Missing user ID')

    const newChat = [...chat, { sender: 'user', text: message }]
    setChat(newChat)
    setMessage('')
    setLoading(true)

    try {
      const res = await fetch('https://serine-backend-production.up.railway.app/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message })
      })

      const data = await res.json()
      const reply = data?.reply || 'Sorry, I could not understand.'
      setChat([...newChat, { sender: 'bot', text: reply }])
    } catch (err) {
      console.error('❌ Chat error:', err)
      setChat([...newChat, { sender: 'bot', text: '❌ Failed to get a response.' }])
    }

    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div className="flex flex-col h-[500px] w-[350px] p-4 bg-white rounded-lg shadow space-y-4 text-sm">
      <div className="font-bold text-lg">💬 Ask Serine</div>
      <div className="flex-1 overflow-y-auto space-y-2 bg-gray-50 p-2 rounded">
        {chat.map((entry, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              entry.sender === 'user' ? 'bg-purple-100 text-right' : 'bg-gray-200 text-left'
            }`}
          >
            {entry.text}
          </div>
        ))}
        {loading && <div className="text-gray-500 text-sm">Serine is typing...</div>}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border px-2 py-1 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question..."
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 text-white px-3 rounded hover:bg-purple-700"
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  )
}
