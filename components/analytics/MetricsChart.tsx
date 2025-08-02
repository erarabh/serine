'use client'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'

type Plan = 'trial' | 'starter' | 'professional'

interface DailyMetric {
  day: string
  total_chats: number
  avg_response_ms: number
}

interface Props {
  data: DailyMetric[]
  plan: Plan
}

export function MetricsChart({ data, plan }: Props) {
  return (
    <div className="space-y-8">
      {/* ————————————————————————
          1) Total Chats (bar) – auto‐scale Y-axis
         ———————————————————————— */}
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Total Chats
          <span className="ml-2 text-sm text-gray-500">({plan} plan)</span>
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis
              domain={[0, 'dataMax']}
              tickCount={6}
              label={{ value: 'Chats', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="total_chats" fill="#8884d8" name="Total Chats" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ————————————————————————
          2) Avg Response Time (line)
         ———————————————————————— */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Avg Response Time (ms)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis
              domain={[0, 2000]}
              label={{ value: 'ms', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              isAnimationActive={false}
              dataKey="avg_response_ms"
              stroke="#ff7300"
              name="Avg Resp (ms)"
              connectNulls={false}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
