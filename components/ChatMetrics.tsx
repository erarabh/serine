'use client'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import { ui } from '@/lib/i18n'
import { useAgent } from '@/lib/AgentContext'
import { LineChart, PieChart, Pie, Cell, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Metrics { date: string; total_messages: number; positive: number; neutral: number; negative: number; avg_response_time_ms: number | null }

export default function ChatMetrics({ userId }: { userId: string }) {
  const { lang } = useLanguage()
  const t = ui[lang] || ui['en']
  const { selectedAgent } = useAgent()
  const [metrics, setMetrics] = useState<Metrics[]>([])
  const [range, setRange] = useState<'7d'|'30d'|'all'>('7d')

  useEffect(() => {
    if (!selectedAgent) return
    fetch(`/api/metrics?userId=${userId}&agentId=${selectedAgent.id}&range=${range}`)
      .then(r => r.json())
      .then(j => setMetrics(j.data || []))
  }, [selectedAgent, userId, range])

  if (!selectedAgent) return <p>❌ No AI agent selected.</p>
  if (!metrics.length) return <p className="text-gray-500">{t.noMetrics}</p>

  // Compute aggregate data
  const aggregate = metrics.reduce((acc, m) => {
    acc.total += m.total_messages; acc.positive += m.positive; acc.neutral += m.neutral; acc.negative += m.negative; acc.responseSum += m.avg_response_time_ms ?? 0
    return acc
  }, { total: 0, positive: 0, neutral: 0, negative: 0, responseSum: 0 })

  const avgResponse = metrics.length ? Math.round(aggregate.responseSum / metrics.length) : 0
  const positivePct = aggregate.total ? Math.round((aggregate.positive / aggregate.total) * 100) : 0

  const chart1 = metrics.map(m => ({ date: m.date, total: m.total_messages, positivePercent: Math.round((m.positive / (m.total_messages||1))*100) }))
  const chart2 = metrics.map(m => ({ date: m.date, avgTime: m.avg_response_time_ms ?? 0 }))
  const pieData = [
    { name: 'Positive', value: aggregate.positive },
    { name: 'Neutral', value: aggregate.neutral },
    { name: 'Negative', value: aggregate.negative }
  ]
  const COLORS = ['#82ca9d', '#8884d8', '#ff6b6b']

  return (
    <div className="bg-white shadow p-6 rounded border space-y-6">
      <h3 className="font-semibold">📊 {t.businessAnalytics}</h3>
      <div className="flex gap-2 items-center">
        <label className="font-medium">{t.timeRange}</label>
        {(['7d','30d','all'] as const).map(r => (
          <button key={r} onClick={() => setRange(r)} className={`rounded px-3 py-1 ${range===r?'bg-purple-700 text-white':'bg-gray-200'}`}>
            {r==='7d'? '7 Days': r==='30d' ? '30 Days' : 'All Time'}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-100 rounded shadow"><p className="text-gray-600">{t.totalMessages}</p><p className="text-2xl font-bold">{aggregate.total}</p></div>
        <div className="p-4 bg-gray-100 rounded shadow"><p className="text-gray-600">{t.positiveSentimentPct}</p><p className="text-2xl font-bold">{positivePct}%</p></div>
        <div className="p-4 bg-gray-100 rounded shadow"><p className="text-gray-600">{t.avgResponseTime}</p><p className="text-2xl font-bold">{avgResponse} ms</p></div>
      </div>
      <div><h4 className="font-semibold">{t.sentimentDistribution}</h4><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} outerRadius={90} dataKey="value">{pieData.map((e,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie></PieChart></ResponsiveContainer></div>
      <div><h4 className="font-semibold">{t.messagesPositiveTrend}</h4><ResponsiveContainer width="100%" height={200}><LineChart data={chart1}><XAxis dataKey="date"/><YAxis/><Tooltip/><Legend/><Line type="monotone" dataKey="total" stroke="#8884d8" name="Total"/><Line type="monotone" dataKey="positivePercent" stroke="#82ca9d" name="Positive %"/></LineChart></ResponsiveContainer></div>
      <div><h4 className="font-semibold">{t.avgResponseTrend}</h4><ResponsiveContainer width="100%" height={200}><LineChart data={chart2}><XAxis dataKey="date"/><YAxis/><Tooltip/><Legend/><Line type="monotone" dataKey="avgTime" stroke="#ffc658" name="Avg Time"/></LineChart></ResponsiveContainer></div>
      <h4 className="font-semibold">{t.dailyMetrics}</h4>
      <table className="w-full text-left border-collapse"><thead><tr className="bg-gray-100"><th>Date</th><th>Total</th><th>+ / 0 / -</th><th>{t.avgResponseTime}</th></tr></thead><tbody>{metrics.map(m=><tr key={m.date} className="border-t"><td>{m.date}</td><td>{m.total_messages}</td><td>{m.positive}/{m.neutral}/{m.negative}</td><td>{m.avg_response_time_ms ?? '-'}</td></tr>)}</tbody></table>
    </div>
  )
}
