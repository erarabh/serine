// lib/AgentContext.tsx
'use client'

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react'

/**
 * Minimal shape for an Agent row.
 */
export interface Agent {
  id: string
  name: string
  created_at: string
  user_id: string
  support_hotline?: string
}

/**
 * The shape of your API response.
 */
interface AgentsResponse {
  data: Agent[]
}

/**
 * Context value exposed to all children.
 */
export interface AgentContextValue {
  user: { id: string }
  agents: Agent[]
  selectedAgent: Agent | null
  setSelectedAgent: (a: Agent) => void
  refresh: () => void
}

const AgentContext = createContext<AgentContextValue | null>(null)

interface AgentProviderProps {
  userId: string
  initialAgentId?: string | null
  children: ReactNode
}

/**
 * Wrap your dashboard to load all agents for the current user,
 * pick an initial one, and expose setter + refresh.
 */
export function AgentProvider({
  userId,
  initialAgentId = null,
  children,
}: AgentProviderProps) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  const refresh = async () => {
    console.log('🔄 Fetching agents for user:', userId)
    const res = await fetch(`/api/agents?userId=${userId}`)

    if (!res.ok) {
      console.error('Failed to fetch agents:', await res.text())
      return
    }

    // Tell TS exactly what shape comes back
    const json = (await res.json()) as AgentsResponse
    console.log('📦 Agents loaded:', json.data)

    setAgents(json.data)

    // Now `a` in find is strongly typed as Agent
    const found = json.data.find((a) => a.id === initialAgentId)
    if (found) {
      console.log('✅ Found initial agent:', found)
      setSelectedAgent(found)
    } else if (json.data.length) {
      console.log('➡️ Defaulting to first agent:', json.data[0])
      setSelectedAgent(json.data[0])
    }
  }

  useEffect(() => {
    if (userId) refresh()
  }, [userId, initialAgentId])

  return (
    <AgentContext.Provider
      value={{
        user: { id: userId },
        agents,
        selectedAgent,
        setSelectedAgent,
        refresh,
      }}
    >
      {children}
    </AgentContext.Provider>
  )
}

/**
 * Hook to consume AgentContext safely.
 * Throws if used outside of AgentProvider.
 */
export function useAgent(): AgentContextValue {
  const ctx = useContext(AgentContext)
  if (!ctx) {
    throw new Error('useAgent must be used inside an <AgentProvider>')
  }
  return ctx
}
