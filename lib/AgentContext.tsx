// frontend/lib/AgentContext.tsx								
'use client'
import { createContext, useContext, ReactNode, useState, useEffect } from 'react'

interface Agent {
  id: string
  name: string
}

interface AgentContextValue {
  agents: Agent[]
  selectedAgent: Agent | null
  setSelectedAgent: (a: Agent) => void
  refresh: () => void
}

export const AgentContext = createContext<AgentContextValue | null>(null)

interface AgentProviderProps {
  userId: string
  initialAgentId?: string | null
  children: ReactNode
}

export function AgentProvider({ userId, initialAgentId, children }: AgentProviderProps) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  const refresh = async () => {
    console.log('🔄 Fetching agents for user:', userId)
    const res = await fetch(`/api/agents?userId=${userId}`)
    const json = await res.json()
    console.log('📦 Agents loaded:', json.data)

    if (Array.isArray(json.data)) {
      setAgents(json.data)

      const found = json.data.find(a => a.id === initialAgentId)
      if (found) {
        console.log('✅ Found initial agent:', found)
        setSelectedAgent(found)
} else if (json.data.length) {
        console.log('➡️ Defaulting to first agent:', json.data[0])
        setSelectedAgent(json.data[0])
      }
    }
  }

  useEffect(() => {
    if (userId) refresh()
  }, [userId, initialAgentId])

  return (
    <AgentContext.Provider value={{ agents, selectedAgent, setSelectedAgent, refresh }}>
      {children}
    </AgentContext.Provider>
  )
}

export function useAgent(): AgentContextValue {
  const ctx = useContext(AgentContext)
  if (!ctx) throw new Error('useAgent must be inside AgentProvider')
  return ctx
}
