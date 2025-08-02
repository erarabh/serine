'use client'

import { useAgent } from '@/lib/AgentContext'
import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function ChatbotSetup({ lang }: { lang: string }) {
  const { selectedAgent } = useAgent()
  const supabase = useSupabaseClient()
  const [website, setWebsite] = useState('')
  const [loading, setLoading] = useState(false)
  const [inserted, setInserted] = useState<number | null>(null)
  const [trainError, setTrainError] = useState<string | null>(null)

  if (!selectedAgent) {
    return <p>❌ No AI agent selected.</p>
  }

  async function handleTrain() {
    if (!website) return

    setLoading(true)
    setInserted(null)
    setTrainError(null)

    try {
      // ✅ Check session before calling API
      const { data: { session } } = await supabase.auth.getSession()
      console.log('🧪 Supabase session:', session)
      if (!session) {
        setTrainError('You must be logged in to train the chatbot.')
        return
      }

      const userId = session.user.id

      const res = await fetch('/api/train-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ url: website })
      })

      const text = await res.text()
      console.log('API response text:', text)

      let json: any
      try {
        json = JSON.parse(text)
      } catch (parseErr: any) {
        throw new Error('Invalid JSON response: ' + parseErr.message)
      }

      if (!res.ok) {
        throw new Error(json.error || 'Training failed')
      }

      setInserted(json.inserted)

      // ✅ Track API call into chat_metrics
      await fetch('/api/metrics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          count: 1
        })
      })
    } catch (err: any) {
      console.error('Train error:', err)
      setTrainError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getEmbedScript = () => {
    return `<script
  src="https://serine.vercel.app/embed.js"
  data-user-id="${selectedAgent.user_id}"
  data-agent-id="${selectedAgent.id}"
  data-lang="${lang}">
</script>`
  }

  return (
    <div className="bg-white shadow p-6 rounded border space-y-6">
      <p>
        🔧 Configuring chatbot for <strong>{selectedAgent.name}</strong> (ID:{' '}
        {selectedAgent.id})
      </p>

      <div>
        <label className="block mb-1 font-medium">🌐 Website URL</label>
        <div className="flex space-x-2">
          <input
            type="url"
            placeholder="https://yourwebsite.com"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            disabled={loading}
            className="flex-1 border px-3 py-2 rounded"
          />
          <button
            onClick={handleTrain}
            disabled={loading || !website}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Training…' : 'Train from website'}
          </button>
        </div>
        {inserted !== null && (
          <p className="mt-2 text-green-600">
            ✅ Inserted {inserted} QA pairs for {website}
          </p>
        )}
        {trainError && (
          <p className="mt-2 text-red-600">❌ {trainError}</p>
        )}
      </div>

      <div className="pt-4 border-t">
        <h3 className="font-semibold mb-2">📎 Embed Script</h3>
        <p className="text-sm text-gray-600 mb-2">
          Paste this snippet into your website to activate Serine AI:
        </p>
        <pre className="bg-gray-100 text-xs p-3 rounded border overflow-auto whitespace-pre-wrap">
          {getEmbedScript()}
        </pre>

        <p className="mt-3 text-sm font-medium">🔧 Usage Instructions:</p>
        <ul className="text-sm list-disc list-inside text-gray-600 space-y-1">
          <li><strong>HTML:</strong> Paste in your <code>&lt;body&gt;</code></li>
          <li><strong>Next.js:</strong> Use <code>&lt;Script&gt;</code> from <code>next/script</code></li>
          <li><strong>Shopify:</strong> Paste in <code>theme.liquid</code></li>
        </ul>
      </div>
    </div>
  )
}
