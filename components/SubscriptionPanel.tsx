// frontend/components/SubscriptionPanel.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useUsage } from '@/lib/useUsage'
import UpgradeBanner from '@/components/UpgradeBanner'

const PLAN_LIMITS = {
  trial:        { max_agents: 1,  max_pairs: 100,   max_calls: 1000 },
  starter:      { max_agents: 3,  max_pairs: 500,   max_calls: 25000 },
  professional: { max_agents: 10, max_pairs: 2000,  max_calls: 100000 },
} as const

function formatDate(iso: string | null): string {
  if (!iso) return 'unknown'
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

interface Props {
  userId: string
  plan:   'trial' | 'starter' | 'professional'
  period: 'monthly' | 'yearly'
}

export default function SubscriptionPanel({ userId, plan, period }: Props) {
  const supabase = useSupabaseClient()
  const user     = useUser()
  const { usage, loading } = useUsage(userId)

  const [status, setStatus]           = useState('unknown')
  const [renewalDate, setRenewalDate] = useState<string | null>(null)

  // Portal button state
  const [portalLoading, setPortalLoading] = useState(false)
  const [portalError, setPortalError]     = useState('')

  // Load Lemon Squeezy script (optional)
  useEffect(() => {
    const src = 'https://app.lemonsqueezy.com/js/lemon.js'
    if (!document.querySelector(`script[src="${src}"]`)) {
      const s = document.createElement('script')
      s.src = src; s.async = true
      document.head.appendChild(s)
    }
  }, [])

  // Fetch subscription status & renewal date from Supabase
  useEffect(() => {
    async function fetchSubs() {
      if (!user?.id) return
      const { data, error } = await supabase
        .from('subscriptions')
        .select('status, current_period_end')
        .eq('user_id', user.id)
        .single()
      if (!error && data) {
        setStatus(data.status)
        setRenewalDate(data.current_period_end)
      }
    }
    fetchSubs()
  }, [user?.id, supabase])

  // Handle “Manage Subscription” button click
  async function openPortal() {
    setPortalLoading(true)
    setPortalError('')
    try {
      const res  = await fetch('/api/portal')
      const json = await res.json()
      if (!res.ok) {
        console.error('Portal error:', json.error || json.details)
        setPortalError(json.error || 'Could not open portal')
      } else if (typeof json.url === 'string') {
        window.location.assign(json.url)
      } else {
        throw new Error('No portal URL returned')
      }
    } catch (err) {
      console.error('Unexpected portal error', err)
      setPortalError('Unexpected error opening portal')
    } finally {
      setPortalLoading(false)
    }
  }

  // Usage bars data
  const { max_agents, max_pairs, max_calls } = PLAN_LIMITS[plan]
  const agentCount = usage?.agent_count ?? 0
  const qaPairs    = usage?.qa_pairs    ?? 0
  const apiCalls   = usage?.api_calls   ?? 0

  // Simple progress bar component
  const ProgressBar = ({
    label,
    value,
    max
  }: {
    label: string
    value: number
    max:   number
  }) => {
    const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
    return (
      <div>
        <p className="text-sm text-gray-700 mb-1">
          {label}: {value} / {max}
        </p>
        <div className="w-full bg-purple-100 h-2 rounded overflow-hidden">
          <div className="bg-gray-600 h-2" style={{ width: `${pct}%` }} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">📦 Subscription Overview</h2>

      {status === 'active' && (
        <div className="space-y-2 text-green-700">
          <p>
            ✅ You’re on the <strong>{plan}</strong> plan ({period})
          </p>
          <p>Renews on: {formatDate(renewalDate)}</p>

          <button
            onClick={openPortal}
            disabled={portalLoading}
            className="bg-gray-100 px-3 py-2 rounded border hover:bg-gray-200"
          >
            {portalLoading ? 'Opening portal…' : 'Manage Subscription'}
          </button>
          {portalError && (
            <p className="mt-2 text-red-600">{portalError}</p>
          )}
        </div>
      )}

      {!loading && usage && (
        <div className="space-y-4">
          <ProgressBar label="AI Agents" value={agentCount} max={max_agents} />
          <ProgressBar label="Q&A Pairs per Agent" value={qaPairs}  max={max_pairs} />
          <ProgressBar label="API Calls this Month" value={apiCalls} max={max_calls} />

          {(agentCount >= max_agents ||
            qaPairs    >= max_pairs  ||
            apiCalls   >= max_calls * 0.9) && (
            <UpgradeBanner
              type={
                agentCount >= max_agents ? 'agents'
                  : qaPairs >= max_pairs   ? 'qa'
                  : 'api'
              }
              usage={
                agentCount >= max_agents ? agentCount
                  : qaPairs >= max_pairs   ? qaPairs
                  : apiCalls
              }
              limit={
                agentCount >= max_agents ? max_agents
                  : qaPairs >= max_pairs   ? max_pairs
                  : max_calls
              }
              plan={plan}
            />
          )}
        </div>
      )}
    </div>
  )
}
