'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */ // ✅ temporary bypass for browser speech types

import { useEffect, useRef, useState } from 'react'
import { ui, defaultLang, Language } from '@/lib/i18n'
import ToggleVoice from '@/components/ToggleVoice'
import { isVoiceAllowed } from '@/utils/planCheck'

interface Props {
  lang?: Language
  userPlan?: string
}

type ChatMessage = { sender: 'user' | 'bot'; text: string }

declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }
}


const ChatWidget = ({ lang = defaultLang, userPlan = 'pro' }: Props) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [voiceEnabled, setVoiceEnabled] = useState(true)

  const recognitionRef = useRef<SpeechRecognition & { started?: boolean } | null>(null)
  const t = ui[lang]

  useEffect(() => {
    const SpeechRecognitionConstructor =
      window.webkitSpeechRecognition || window.SpeechRecognition

    if (SpeechRecognitionConstructor) {
      const recognition = new SpeechRecognitionConstructor()
      recognition.lang = lang
      recognition.interimResults = false

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const spoken = event.results[0][0].transcript
        setInput(spoken)

        setTimeout(() => {
          setMessages((prev) => [...prev, { sender: 'user', text: spoken }])

          fetch('https://serine-backend-production.up.railway.app/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: spoken }),
          })
            .then((res) => res.json())
            .then(({ reply }: { reply: string }) => {
              setMessages((prev) => [...prev, { sender: 'bot', text: reply }])
              if (voiceEnabled) {
                const utterance = new SpeechSynthesisUtterance(reply)
                utterance.lang = lang
                speechSynthesis.speak(utterance)
              }
            })
        }, 1000)
      }

      recognition.onend = () => {
        if (recognitionRef.current) recognitionRef.current.started = false
      }

      recognitionRef.current = recognition
    }
  }, [lang, voiceEnabled])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }])
    setInput('')

    try {
      const res = await fetch('https://serine-backend-production.up.railway.app/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          userId: '6f3b81a4-57f2-4f20-b356-f473bb36de91',
        }),
      })

      const { reply }: { reply: string } = await res.json()
      setMessages((prev) => [...prev, { sender: 'bot', text: reply }])

      if (voiceEnabled) {
        const utterance = new SpeechSynthesisUtterance(reply)
        utterance.lang = lang
        speechSynthesis.speak(utterance)
      }
    } catch {
      setMessages((prev) => [...prev, { sender: 'bot', text: '⚠️: Server error or not connected.' }])
    }
  }

  const startVoice = () => {
    const recognition = recognitionRef.current
    if (!recognition || recognition.started) return

    try {
      recognition.start()
      recognition.started = true
    } catch {
      console.warn('Speech already started or not supported.')
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 space-y-4 border border-gray-300">
      <div className="h-64 overflow-y-auto space-y-2 text-black border p-2 rounded bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className="text-sm whitespace-pre-wrap">
            {msg.sender === 'user' ? `🧑‍💼: ${msg.text}` : `🤖: ${msg.text}`}
          </div>
        ))}
      </div>

      <div className="flex space-x-2 items-center">
        {isVoiceAllowed(userPlan) && (
          <button
            className="px-3 py-2 bg-gray-100 text-purple-600 rounded hover:bg-gray-200"
            onClick={startVoice}
            title="Click to speak"
          >
            🎤
          </button>
        )}

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border px-4 py-2 rounded text-black"
          placeholder={t.inputPlaceholder}
        />

        <button
          onClick={handleSend}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          {t.send}
        </button>

        {isVoiceAllowed(userPlan) && (
          <ToggleVoice enabled={voiceEnabled} onToggle={setVoiceEnabled} />
        )}
      </div>
    </div>
  )
}

export default ChatWidget
