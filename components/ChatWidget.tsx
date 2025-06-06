'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from 'react'
import { ui, defaultLang, Language } from '@/lib/i18n'
import ToggleVoice from '@/components/ToggleVoice'
import { isVoiceAllowed } from '@/utils/planCheck'

interface Props {
  lang?: Language
  userPlan?: string
  userId?: string
  customQA?: { question: string; answer: string }[]
}

type ChatMessage = { sender: 'user' | 'bot'; text: string }

declare global {
  interface Window {
    SpeechRecognition?: typeof window.SpeechRecognition
    webkitSpeechRecognition?: typeof window.webkitSpeechRecognition
  }
}

export {}

const ChatWidget = ({
  lang = defaultLang,
  userPlan = 'pro',
  userId,
  customQA = []
}: Props) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  const recognitionRef = useRef<
    (typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition) & {
      started?: boolean
    } | null
  >(null)

  const t = ui[lang]

  // Auto-scroll on message update
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  // Preload custom Q&A
  useEffect(() => {
    if (customQA.length > 0) {
      const preloadedMessages: ChatMessage[] = customQA.map((pair) => ({
        sender: 'bot' as 'bot',
        text: `Q: ${pair.question}\nA: ${pair.answer}`,
      }))
      setMessages(preloadedMessages)
    }
  }, [customQA])

  // Voice recognition init
  useEffect(() => {
    const SpeechRecognitionConstructor =
      window.webkitSpeechRecognition || window.SpeechRecognition

    if (SpeechRecognitionConstructor) {
      const recognition = new SpeechRecognitionConstructor()
      recognition.lang = lang === 'fr' ? 'fr-FR' : lang === 'ar' ? 'ar-EG' : 'en-US'
      recognition.interimResults = false

      recognition.onresult = (event: Event & { results: SpeechRecognitionResultList }) => {
        const spoken = event.results[0][0].transcript
        setInput(spoken)

        setTimeout(() => {
          setMessages((prev) => [...prev, { sender: 'user', text: spoken }])
          setLoading(true)

          fetch('https://serine-backend.onrender.com/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: spoken, userId, lang }),
          })
            .then((res) => res.json())
            .then(({ reply }: { reply: string }) => {
              const safeReply = reply && reply !== 'undefined' ? reply : '🤖 Sorry, I didn\'t understand that.'
              setMessages((prev) => [...prev, { sender: 'bot', text: safeReply }])
              setLoading(false)

              if (voiceEnabled) {
                const utterance = new SpeechSynthesisUtterance(safeReply)
                utterance.lang = lang === 'fr' ? 'fr-FR' : lang === 'ar' ? 'ar-EG' : 'en-US'
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
    setLoading(true)

    try {
      const res = await fetch('https://serine-backend.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          userId,
          lang,
        }),
      })

      const { reply }: { reply: string } = await res.json()
      const safeReply = reply && reply !== 'undefined' ? reply : '🤖 Sorry, I didn\'t understand that.'

      setMessages((prev) => [...prev, { sender: 'bot', text: safeReply }])
      setLoading(false)

      if (voiceEnabled) {
        const utterance = new SpeechSynthesisUtterance(safeReply)
        utterance.lang = lang === 'fr' ? 'fr-FR' : lang === 'ar' ? 'ar-EG' : 'en-US'
        speechSynthesis.speak(utterance)
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: '⚠️ Server error or not connected.' },
      ])
      setLoading(false)
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
      <div
        ref={chatRef}
        className="h-64 overflow-y-auto space-y-2 text-black border p-2 rounded bg-gray-50"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className="text-sm whitespace-pre-wrap">
            {msg.sender === 'user' ? `🧑‍💼: ${msg.text}` : `🤖: ${msg.text}`}
          </div>
        ))}
        {loading && <div className="text-sm text-gray-500">🤖: Typing...</div>}
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
