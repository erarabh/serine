'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import { ui } from '@/lib/i18n'
import { useAgent } from '@/lib/AgentContext'

type QAItem = { id: string; question: string; answer: string }

export default function QADashboard({ userId }: { userId: string }) {
  const { lang } = useLanguage()
  const t = ui[lang] || ui['en']
  const { selectedAgent } = useAgent()
  const [items, setItems] = useState<QAItem[]>([])
  const [newQ, setNewQ] = useState('')
  const [newA, setNewA] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchQA = async () => {
    if (!selectedAgent) return
    setLoading(true)
    try {
      const res = await fetch(`/api/qa?userId=${userId}&agentId=${selectedAgent.id}`)
      const json = await res.json()
      setItems(json.data || [])
    } catch (e) {
      console.error('Error fetching Q&A:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQA()
  }, [selectedAgent, userId])

  const addQA = async () => {
    if (!newQ || !newA || !selectedAgent) return
    setLoading(true)
    try {
      await fetch(`/api/qa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, agentId: selectedAgent.id, question: newQ, answer: newA })
      })
      setNewQ('')
      setNewA('')
      await fetchQA()
    } catch (e) {
      console.error('Error adding Q&A:', e)
    } finally {
      setLoading(false)
    }
  }

  const deleteQA = async (id: string) => {
    if (!confirm(t.delete + '?')) return
    setLoading(true)
    try {
      await fetch(`/api/qa/${id}`, { method: 'DELETE' })
      await fetchQA()
    } catch (e) {
      console.error('Error deleting Q&A:', e)
    } finally {
      setLoading(false)
    }
  }

  if (!selectedAgent) return <p>❌ No AI agent selected.</p>

  return (
    <div className="bg-white shadow p-6 rounded border space-y-6">
      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          value={newQ}
          onChange={e => setNewQ(e.target.value)}
          placeholder={t.newQuestion}
          className="border px-3 py-2 rounded w-full"
        />
        <input
          value={newA}
          onChange={e => setNewA(e.target.value)}
          placeholder={t.newAnswer}
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      <button
        disabled={loading || !newQ || !newA}
        onClick={addQA}
        className="mt-2 bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {t.addQA}
      </button>

      <div className="space-y-4 mt-6">
        {loading && <p>{t.loading}</p>}
        {!loading && items.length === 0 && <p className="text-gray-500">{t.noItems}</p>}
        {!loading &&
          items.map(q => (
            <div key={q.id} className="border p-4 rounded flex justify-between items-center">
              <div>
                <p className="font-medium">Q: {q.question}</p>
                <p className="font-medium">A: {q.answer}</p>
              </div>
              <button
                onClick={() => deleteQA(q.id)}
                className="text-red-600 hover:text-red-800"
              >
                {t.delete}
              </button>
            </div>
          ))}
      </div>
    </div>
  )
}
