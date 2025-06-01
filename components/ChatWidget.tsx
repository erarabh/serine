'use client'
import { useEffect, useRef, useState } from 'react'
import { ui, defaultLang, Language } from '@/lib/i18n'
import ToggleVoice from '@/components/ToggleVoice'
import { isVoiceAllowed } from '@/utils/planCheck'

const ChatWidget = ({
  lang = defaultLang,
  userPlan = 'pro', // Force pro to show mic during dev
}: {
  lang?: Language
  userPlan?: string
}) => {
  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [voiceEnabled, setVoiceEnabled] = useState(true) // Enable voice by default
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const t = ui[lang]

  useEffect(() => {
    // Setup voice recognition (only on supported browsers)
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.lang = lang
      recognitionRef.current.interimResults = false
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const spoken = event.results[0][0].transcript
  setInput(spoken)

  // Auto-send after short delay
  setTimeout(() => {
    setMessages((prev) => [...prev, `🧑‍💼: ${spoken}`])
    fetch('https://serine-backend-production.up.railway.app/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: spoken }),
    })
      .then(res => res.json())
      .then(({ reply }) => {
        setMessages((prev) => [...prev, `🤖: ${reply}`])
        if (voiceEnabled) {
          const utterance = new SpeechSynthesisUtterance(reply)
          utterance.lang = lang
          speechSynthesis.speak(utterance)
        }
      })
  }, 1000)
      }
	  recognitionRef.current.onend = () => {
  (recognitionRef.current as any).started = false
}
    }
  }, [lang])

  const handleSend = async () => {
    if (!input.trim()) return
    const userMessage = input.trim()
    setMessages((prev) => [...prev, `🧑‍💼: ${userMessage}`])
    setInput('')

    try {
      const res = await fetch('https://serine-backend-production.up.railway.app/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userMessage,
    userId: '6f3b81a4-57f2-4f20-b356-f473bb36de91' // <-- Use your real UUID
  })
})



      const { reply } = await res.json()
      setMessages((prev) => [...prev, `🤖: ${reply}`])

      if (voiceEnabled) {
        const utterance = new SpeechSynthesisUtterance(reply)
        utterance.lang = lang
        speechSynthesis.speak(utterance)
      }
    } catch (err) {
      setMessages((prev) => [...prev, `⚠️: Server error or not connected.`])
    }
  }

  const startVoice = () => {
  if (recognitionRef.current && (recognitionRef.current as any).started) {
    return // Already recording
  }
  try {
    recognitionRef.current?.start()
    ;(recognitionRef.current as any).started = true
  } catch (err) {
    console.warn('Speech already started or not supported.')
  }
}


  return (
    <div className="bg-white shadow-md rounded-lg p-4 space-y-4 border border-gray-300">
      <div className="h-64 overflow-y-auto space-y-2 text-black border p-2 rounded bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className="text-sm whitespace-pre-wrap">
            {msg}
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
