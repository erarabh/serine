'use client'
import { useState, useEffect } from 'react'
import { useAgent } from '@/lib/AgentContext'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

export default function AgentSettings() {
  const { selectedAgent, setSelectedAgent } = useAgent()
  const [hotline, setHotline] = useState('')

  useEffect(() => {
    if (selectedAgent) {
      setHotline(selectedAgent.support_hotline || '')
    }
  }, [selectedAgent])

  if (!selectedAgent) return null

  async function saveHotline() {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/agents/${selectedAgent.id}`, 
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ support_hotline: hotline.trim() })
        }
      )
      if (!res.ok) throw new Error(await res.text())
      const { agent } = await res.json()
      setSelectedAgent(agent)
    } catch (err) {
      console.error('Failed to save hotline', err)
      alert('Could not save hotline. See console for details.')
    }
  }

  return (
    <div className="p-4 bg-white rounded shadow space-y-2">
      <h3 className="font-semibold">Agent Settings</h3>
      <label className="block text-sm font-medium">Support Hotline</label>
      <input
        type="text"
        value={hotline}
        onChange={e => setHotline(e.target.value)}
        placeholder="+212-6xx-xxxxxx"
        className="mt-1 block w-full border rounded px-2 py-1"
      />
      <button
        onClick={saveHotline}
        className="mt-2 bg-purple-600 text-white px-4 py-1 rounded"
      >
        Save
      </button>
    </div>
  )
}
