// components/UpgradeBanner.tsx
'use client'

import Link from 'next/link'

export type Plan = 'trial' | 'starter' | 'professional'
export type UpgradeType = 'agents' | 'qa' | 'api'

interface Props {
  type: UpgradeType
  usage: number
  limit: number
  plan: Plan
}

const VARIANT_MAP: Record<Plan, Record<UpgradeType, string>> = {
  trial: {
    agents: 'LS_TRIAL_AGENTS_VARIANT_ID',
    qa:     'LS_TRIAL_QA_VARIANT_ID',
    api:    'LS_TRIAL_API_VARIANT_ID',
  },
  starter: {
    agents: 'LS_STARTER_AGENTS_VARIANT_ID',
    qa:     'LS_STARTER_QA_VARIANT_ID',
    api:    'LS_STARTER_API_VARIANT_ID',
  },
  professional: {
    agents: 'LS_PRO_AGENTS_VARIANT_ID',
    qa:     'LS_PRO_QA_VARIANT_ID',
    api:    'LS_PRO_API_VARIANT_ID',
  },
}

export default function UpgradeBanner({
  type,
  usage,
  limit,
  plan
}: Props) {
  const percentage = Math.round((usage / limit) * 100)
  const overLimit = usage >= limit
  const variantId = VARIANT_MAP[plan][type]

  if (!overLimit) return null

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-300 rounded space-y-2">
      <p>
        You’ve hit your {type} limit ({usage}/{limit}).
      </p>
      <Link
        href={`https://app.lemonsqueezy.com/checkout?variant=${variantId}`}
        className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Upgrade Plan
      </Link>
    </div>
  )
}
