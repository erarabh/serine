'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import QADashboard from '@/components/QADashboard'
import AuthBox from '@/components/AuthBox'
import LangSelector from '@/components/LangSelector'
import { Language, defaultLang } from '@/lib/i18n'

export default function Dashboard() {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState('')
  const [userId, setUserId] = useState('')
  const [plan, setPlan] = useState('free')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [lang, setLang] = useState<Language>(defaultLang)

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        const user = session.user
        setUserId(user.id)
        setIsAuthenticated(true)

        try {
          const res = await fetch(`https://serine-backend.onrender.com/users/${user.id}`)
          if (!res.ok) return setPlan('free')

          const data = await res.json()
          setPlan(data?.plan || 'free')
        } catch {
          setPlan('free')
        }
      } else {
        setIsAuthenticated(false)
      }
    }

    getSession()
  }, [])

  const handleScrapeAndTrain = async () => {
    if (plan !== 'pro') {
      setStatus('🚫 Scraping requires Pro plan.')
      return
    }

    setStatus('🔍 Scraping...')
    const scrapeRes = await fetch('https://serine-backend.onrender.com/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, userId }),
    })

    const result = await scrapeRes.json()
    setStatus(result.success ? `✅ Finished! Added ${result.count} Q&A.` : '❌ Scrape or upload failed.')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <div className="p-6 space-y-6">
      {!isAuthenticated ? (
        <AuthBox />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">📊 Dashboard</h1>
            <div className="flex gap-4 items-center">
              <LangSelector onChange={setLang} />
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                🚪 Log Out
              </button>
            </div>
          </div>

          {/* Scrape + Upload */}
          <div className="space-y-4 bg-white shadow p-6 rounded border border-gray-200">
            <h2 className="text-xl font-semibold">🧠 Train Serine with Your Website</h2>
            <input
              className="border px-4 py-2 rounded w-full"
              placeholder="Enter website URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              className={`px-4 py-2 rounded text-white ${
                plan === 'pro' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400 cursor-not-allowed'
              }`}
              onClick={handleScrapeAndTrain}
              disabled={plan !== 'pro'}
            >
              Scrape & Upload Q&A
            </button>
            {status && <p className="text-sm text-gray-700">{status}</p>}
          </div>

          {/* Manual Q&A Entry */}
          <QADashboard userId={userId} lang={lang} />
        </>
      )}
    </div>
  )
}
