'use client'
import { useState, useEffect, useContext } from 'react'
import { AgentContext } from '@/lib/AgentContext'
import { fetchMetrics, fetchUnanswered } from '@/lib/analyticsClient'
import { DateRangePicker } from '@/components/analytics/DateRangePicker'
import { MetricsChart }   from '@/components/analytics/MetricsChart'
import { UnansweredList } from '@/components/analytics/UnansweredList'
import Papa from 'papaparse'
import { saveAs } from 'file-saver'

export default function AnalyticsPage() {
  const { user, agent } = useContext(AgentContext)
  const [start, setStart] = useState<Date>(new Date(Date.now() - 7 * 24e5))
  const [end, setEnd]     = useState<Date>(new Date())
  const [metrics, setMetrics]       = useState<any[]>([])
  const [unanswered, setUnanswered] = useState<any[]>([])

  useEffect(() => {
    if (!user?.id || !agent?.id) return
    const s = start.toISOString().slice(0,10)
    const e = end.toISOString().slice(0,10)
    fetchMetrics(user.id, agent.id, s, e).then(setMetrics).catch(console.error)
    fetchUnanswered(user.id, agent.id, s, e).then(setUnanswered).catch(console.error)
  }, [user, agent, start, end])

  const exportCSV = () => {
    const s = start.toISOString().slice(0,10)
    const e = end.toISOString().slice(0,10)
    const csv = Papa.unparse(metrics)
    saveAs(new Blob([csv], { type: 'text/csv' }), `metrics_${s}_${e}.csv`)
  }

  if (!agent) return <p>Select an agent to view analytics.</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Business Analytics — {agent.name}</h1>
      <div className="flex items-center gap-4 my-4">
        <DateRangePicker start={start} end={end} onChange={(s,e)=>{setStart(s);setEnd(e)}}/>
        <button onClick={exportCSV} className="px-4 py-2 bg-blue-600 text-white rounded">
          Export CSV
        </button>
      </div>
      <MetricsChart data={metrics} />
      <UnansweredList items={unanswered} />
    </div>
  )
}