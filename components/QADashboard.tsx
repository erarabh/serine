'use client'

import { useEffect, useState } from 'react'

interface QAPair {
  id: string
  question: string
  answer: string
}

export default function QADashboard({ userId }: { userId: string }) {
  const [qaPairs, setQaPairs] = useState<QAPair[]>([])
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [status, setStatus] = useState('')

  // ✅ Load Q&A on mount or userId change
  useEffect(() => {
    if (!userId) return
    fetch(`https://serine-backend-production.up.railway.app/qa/${userId}`)
      .then(res => res.json())
      .then(data => setQaPairs(data.data || []))
      .catch(err => {
        console.error('❌ Error fetching Q&A:', err)
      })
  }, [userId])

  const handleAdd = async () => {
    if (!question || !answer || !userId) return
    setStatus('Adding...')

    const res = await fetch('https://serine-backend-production.up.railway.app/qa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, question, answer }),
    })

    const result = await res.json()

    if (result.success && result.insertedId) {
      setQaPairs(prev => [...prev, { id: result.insertedId, question, answer }])
      setQuestion('')
      setAnswer('')
      setStatus('✅ Added!')
    } else {
      setStatus('❌ Failed to add')
    }
  }

  const handleDelete = async (id: string) => {
    await fetch(`https://serine-backend-production.up.railway.app/qa/${id}`, {
      method: 'DELETE',
    })
    setQaPairs(prev => prev.filter(q => q.id !== id))
  }

  return (
    <div className="bg-white p-6 rounded shadow-md space-y-4">
      <h2 className="text-xl font-semibold">✍️ Manual Q&A Manager</h2>

      <div className="space-y-2">
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <textarea
          className="w-full border px-3 py-2 rounded"
          placeholder="Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Add Q&A
        </button>
        {status && <p className="text-sm text-gray-700">{status}</p>}
      </div>

      <hr />

      <div className="space-y-2">
        <h3 className="font-medium">🧠 Stored Pairs</h3>
        {qaPairs.length === 0 ? (
          <p className="text-gray-500">No Q&A pairs found.</p>
        ) : (
          qaPairs.map((qa) => (
            <div key={qa.id} className="border p-3 bg-gray-50 rounded">
              <p><strong>Q:</strong> {qa.question}</p>
              <p><strong>A:</strong> {qa.answer}</p>
              <button
                className="text-xs text-red-500 hover:underline"
                onClick={() => handleDelete(qa.id)}
              >
                ❌ Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
