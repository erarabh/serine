'use client'

import { useState, useEffect } from 'react'
import { useAgent } from '@/lib/AgentContext'
import { fetchMetrics, fetchUnanswered } from '@/lib/analyticsClient'
import { DateRangePicker } from '@/components/analytics/DateRangePicker'
import { MetricsChart } from '@/components/analytics/MetricsChart'
import { UnansweredList } from '@/components/analytics/UnansweredList'
import { useUsage } from '@/lib/useUsage'
import UpgradeBanner from '@/components/UpgradeBanner'
import Papa from 'papaparse'
import { saveAs } from 'file-saver'

interface Props {
  userId: string
  plan: 'trial' | 'starter' | 'professional'
}

export default function AnalyticsPanel({ userId, plan }: Props) {
  const { selectedAgent: agent } = useAgent()
  const [start, setStart] = useState<Date>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  const [end, setEnd] = useState<Date>(new Date())
  const [metrics, setMetrics] = useState<any[]>([])
  const [unanswered, setUnanswered] = useState<any[]>([])
  const { usage } = useUsage(userId)

  useEffect(() => {
    if (!userId || !agent?.id) return
    const s = start.toISOString().slice(0, 10)
    const e = end.toISOString().slice(0, 10)
    fetchMetrics(userId, agent.id, s, e).then(setMetrics).catch(console.error)
    fetchUnanswered(userId, agent.id, s, e).then(setUnanswered).catch(console.error)
  }, [userId, agent, start, end])

  const exportCSV = () => {
    const s = start.toISOString().slice(0, 10)
    const e = end.toISOString().slice(0, 10)
    const csv = Papa.unparse(metrics)
    saveAs(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), `metrics_${s}_${e}.csv`)
  }

  if (!agent) {
    return (
      <div className="p-6 text-gray-500 italic">
        Please select an agent to view analytics.
      </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Business Analytics — {agent.name}</h1>

      {usage && (
        <div className="space-y-4 mb-6">
          {usage.agent_count >= usage.max_agents && (
            <UpgradeBanner
              type="agents"
              usage={usage.agent_count}
              limit={usage.max_agents}
              plan={plan}
            />
          )}
          {usage.qa_pairs >= usage.max_pairs && (
            <UpgradeBanner
              type="qa"
              usage={usage.qa_pairs}
              limit={usage.max_pairs}
              plan={plan}
            />
          )}
          {usage.api_calls >= usage.max_calls * 0.9 && (
            <UpgradeBanner
              type="api"
              usage={usage.api_calls}
              limit={usage.max_calls}
              plan={plan}
            />
          )}
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <DateRangePicker
          start={start}
          end={end}
          onChange={(s, e) => {
            setStart(s)
            setEnd(e)
          }}
        />
        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Export CSV
        </button>
      </div>

      <MetricsChart data={metrics} plan={plan} />
      <UnansweredList items={unanswered} />
    </div>
  )
}
