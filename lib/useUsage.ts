// frontend/lib/useUsage.ts
import { useState, useEffect } from 'react'

export interface UsageCounts {
  agent_count: number
  qa_pairs:    number
  api_calls:   number
}

export function useUsage(userId: string) {
  const [usage, setUsage]     = useState<UsageCounts | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res  = await fetch(`/api/usage?userId=${userId}`)
        const json = await res.json()

        console.log('[useUsage] raw response:', json)

        // unwrap common wrappers
        const data = json.usage ?? json.data ?? json

        // support snake_case or camelCase
        const agentCount = data.agent_count ?? data.agentCount ?? 0
        const qaPairs    = data.qa_pairs    ?? data.qa_pairs ?? data.qaPairs ?? 0
        const apiCalls   = data.api_calls   ?? data.apiCalls   ?? 0

        setUsage({ agent_count: agentCount, qa_pairs: qaPairs, api_calls: apiCalls })
      } catch (err) {
        console.error('[useUsage] error', err)
      } finally {
        setLoading(false)
      }
    }

    if (userId) load()
  }, [userId])

  return { usage, loading }
}
