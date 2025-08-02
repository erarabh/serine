							   
'use client'

interface Props {
  type: 'agents' | 'qa' | 'api'
  usage: number
  limit: number
  plan: 'trial' | 'starter' | 'professional'
}

export default function UpgradeBanner({ type, usage, limit, variantId }: Props) {
  const percentage = Math.round((usage / limit) * 100)
  const overLimit = usage >= limit

  const typeLabel = {
    agents: 'AI Agents',
    qa: 'Q&A Pairs',
    api: 'API Calls',
  }[type]

  const upgradeLink =
    variantId === 'starter'
      ? 'http://localhost:3000/dashboard?upgrade=professional'
      : 'http://localhost:3000/dashboard?add=agent'

  const actionLabel = variantId === 'starter'
    ? 'Upgrade to Professional'
    : 'Add Agent'

  const message = overLimit
    ? `${typeLabel} limit exceeded. ${variantId === 'starter' ? 'Upgrade to Professional' : 'Add another agent to continue.'}`
    : `${typeLabel} usage is at ${percentage}%. Consider ${variantId === 'starter' ? 'upgrading' : 'expanding'} to avoid hitting the limit.`

  return (
    <div className="p-4 mb-4 rounded border bg-yellow-50 border-yellow-300 text-yellow-900">
				
      <p><strong>{message}</strong></p>
																																									 
	   
      <a
        href={upgradeLink}
					   
        className="inline-block mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        {actionLabel}
      </a>
    </div>
  )
}
