'use client'

import { useEffect, useState } from 'react'
import { useAgent } from '@/lib/AgentContext'

interface Agent {
  id: string
  name: string
  created_at: string
}

export default function AgentSelector({
  userId,
  onSelect
}: {
  userId: string
  onSelect?: (agent: Agent) => void
}) {
  const { setSelectedAgent } = useAgent()
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [newAgentName, setNewAgentName] = useState('')

  const fetchAgents = async () => {
    const res = await fetch(`/api/agents?userId=${userId}`)
    const json = await res.json()
    if (Array.isArray(json.data)) {
      setAgents(json.data)
      if (!selectedId && json.data.length > 0) {
        const first = json.data[0]
        setSelectedId(first.id)
        setSelectedAgent(first)
        onSelect?.(first)
      }
    }
  }

  const createAgent = async () => {
    if (!newAgentName.trim()) return
    await fetch(`/api/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, name: newAgentName.trim() })
    })
    setNewAgentName('')
    fetchAgents()
  }

  useEffect(() => {
    if (userId) fetchAgents()
  }, [userId])

  return (
    <div className="space-y-4 border p-4 rounded shadow">
      <h2 className="font-bold text-lg"> AI Agents</h2>

      <select
        className="border rounded px-3 py-2 w-full"
        value={selectedId || ''}
        onChange={(e) => {
          const agent = agents.find((a) => a.id === e.target.value)
          setSelectedId(e.target.value)
          if (agent) {
            setSelectedAgent(agent)    // ? update context
            onSelect?.(agent)
          }
        }}
      >
        {agents.map((agent) => (
          <option key={agent.id} value={agent.id}>
            {agent.name}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <input
          className="border px-3 py-1 rounded w-full"
          placeholder="New agent name"
          value={newAgentName}
          onChange={(e) => setNewAgentName(e.target.value)}
        />
        <button
          onClick={createAgent}
          className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
        >
          Add
        </button>
      </div>
    </div>
  )
}
