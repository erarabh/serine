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

type Plan = 'trial' | 'starter' | 'professional'

export default function AnalyticsPage() {
  const { selectedAgent: agent } = useAgent()
  const [start, setStart] = useState(new Date(Date.now() - 7 * 864e5))
  const [end, setEnd] = useState(new Date())
  const [metrics, setMetrics] = useState<any[]>([])
  const [unanswered, setUnanswered] = useState<any[]>([])
  const [plan, setPlan] = useState<Plan>('trial')

  const userId = agent?.user_id
  const { usage } = useUsage(userId || '')

  useEffect(() => {
    if (!userId) return
    fetch(`/api/users/${userId}`)
      .then(r => r.json())
      .then(({ plan }) => {
        const raw = (plan || '').toLowerCase()
        setPlan(
          raw === 'professional' || raw === 'pro'
            ? 'professional'
            : raw === 'starter' || raw === 'growth'
            ? 'starter'
            : 'trial'
        )
      })
      .catch(() => setPlan('trial'))
  }, [userId])

  useEffect(() => {
    if (!agent?.id || !userId) return
    const s = start.toISOString().slice(0, 10)
    const e = end.toISOString().slice(0, 10)
    fetchMetrics(userId, agent.id, s, e).then(setMetrics).catch(console.error)
    fetchUnanswered(userId, agent.id, s, e).then(setUnanswered).catch(console.error)
  }, [agent, userId, start, end])

  const exportCSV = () => {
    const csv = Papa.unparse(metrics)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const s = start.toISOString().slice(0, 10)
    const e = end.toISOString().slice(0, 10)
    saveAs(blob, `metrics_${s}_${e}.csv`)
  }

  if (!agent) return <p className="p-6 text-gray-500">Select an agent to view analytics.</p>

  return (
    <div className="p-6 bg-white rounded shadow space-y-6">
      <h1 className="text-2xl font-bold">📊 Business Analytics — {agent.name}</h1>

      {usage && (
        <div className="space-y-4">
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

      <div className="flex items-center gap-4">
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
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Export CSV
        </button>
      </div>

      <MetricsChart data={metrics} plan={plan} />
      <UnansweredList items={unanswered} />
    </div>
  )
}
