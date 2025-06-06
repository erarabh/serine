'use client'

import { useEffect, useState } from 'react'
import ChatWidget from '@/components/ChatWidget'
import LangSelector from '@/components/LangSelector'
import { Language, defaultLang } from '@/lib/i18n'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [lang, setLang] = useState<Language>(defaultLang)
  const [userId, setUserId] = useState<string | undefined>(undefined)

  useEffect(() => {
    const getUserId = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.id) {
        setUserId(session.user.id)
      }
    }

    getUserId()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-r from-indigo-400 to-purple-500 p-6 text-white">
      <div className="flex justify-between items-center mb-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold">🌍 Serine Multilingual Chatbot</h1>
        <LangSelector onChange={setLang} />
      </div>

      <div className="max-w-3xl mx-auto text-center mb-10">
        <p className="text-lg">Voice-enabled Q&A agent in multiple languages</p>
      </div>

      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold text-purple-600 mb-2">Test Serine in Action</h2>
        <ChatWidget lang={lang} userId={userId} />
      </div>
    </main>
  )
}
