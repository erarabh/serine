// ✅ File: frontend/components/ChatWidget.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { ui, defaultLang, Language } from '@/lib/i18n'
import ToggleVoice from '@/components/ToggleVoice'
import { isVoiceAllowed } from '@/utils/planCheck'

interface Props {
  lang?: Language
  userPlan?: string
  userId?: string
}

type ChatMessage = { sender: 'user' | 'bot'; text: string }

declare global {
  interface Window {
    SpeechRecognition?: typeof window.SpeechRecognition
    webkitSpeechRecognition?: typeof window.webkitSpeechRecognition
  }
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

const ChatWidget = ({ lang = defaultLang, userPlan = 'pro', userId }: Props) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const recognitionRef = useRef<any>(null)

  const t = ui[lang]

  useEffect(() => {
    const SpeechRecognitionConstructor =
      window.webkitSpeechRecognition || window.SpeechRecognition

    if (SpeechRecognitionConstructor) {
      const recognition = new SpeechRecognitionConstructor()
      recognition.lang = lang
      recognition.interimResults = false

      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript
        setInput(spoken)

        setTimeout(() => {
          setMessages((prev) => [...prev, { sender: 'user', text: spoken }])

          fetch(`${BACKEND_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: spoken, userId }),
          })
            .then((res) => res.json())
            .then(({ reply }) => {
              setMessages((prev) => [...prev, { sender: 'bot', text: reply }])
              if (voiceEnabled) {
                const utterance = new SpeechSynthesisUtterance(reply)
                utterance.lang = lang
                speechSynthesis.speak(utterance)
              }
            })
            .catch((err) => {
              console.error('❌ Chat fetch error:', err)
              setMessages((prev) => [...prev, { sender: 'bot', text: '⚠️ Server error or not connected.' }])
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
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, userId }),
      })

      const { reply } = await res.json()
      setMessages((prev) => [...prev, { sender: 'bot', text: reply }])

      if (voiceEnabled) {
        const utterance = new SpeechSynthesisUtterance(reply)
        utterance.lang = lang
        speechSynthesis.speak(utterance)
      }
    } catch (err) {
      console.error('❌ Chat fetch error:', err)
      setMessages((prev) => [...prev, { sender: 'bot', text: '⚠️ Server error or not connected.' }])
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
    <div className="flex flex-col h-full max-h-full">
      <div className="flex-1 overflow-y-auto space-y-2 text-black border-b p-2 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className="text-sm whitespace-pre-wrap">
            {msg.sender === 'user' ? `🧑‍💼: ${msg.text}` : `🤖: ${msg.text}`}
          </div>
        ))}
      </div>

      <div className="p-2 border-t bg-white">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border px-4 py-2 rounded text-black resize-none"
          placeholder={t.inputPlaceholder}
          rows={2}
        />
        <div className="flex flex-wrap justify-between items-center gap-2 mt-2">
          {isVoiceAllowed(userPlan) && (
            <button
              className="px-3 py-2 bg-gray-100 text-purple-600 rounded hover:bg-gray-200"
              onClick={startVoice}
              title="Click to speak"
            >
              🎤
            </button>
          )}
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
    </div>
  )
}

export default ChatWidget
