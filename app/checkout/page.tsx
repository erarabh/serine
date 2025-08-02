'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function CheckoutPage() {
  const searchParams = useSearchParams()

  const [plan, setPlan] = useState('')
  const [billing, setBilling] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 👇 Dynamically extract params from the URL on mount
    const planParam = searchParams.get('plan')?.toLowerCase() || ''
    const billingParam = searchParams.get('billing')?.toLowerCase() || ''

    setPlan(planParam)
    setBilling(billingParam)

    if (!planParam || !billingParam) {
      console.warn('[checkout] Missing plan/billing params:', {
        plan: planParam,
        billing: billingParam
      })
      setError('Missing plan or billing in URL')
    }
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!name || !email || !password) {
      setError('All fields are required')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, plan, billing })
      })

      const json = await res.json()
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Checkout failed')
      }

      window.location.href = json.url
    } catch (err: any) {
      console.error('[CheckoutPage] error', err)
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-16">
      <h1 className="text-2xl font-bold mb-4">
        Subscribe: {plan || '—'} / {billing || '—'}
      </h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          required
          onChange={e => setName(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={e => setPassword(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded w-full"
        >
          {loading ? 'Creating Checkout…' : 'Proceed to Payment'}
        </button>
      </form>

      {(!plan || !billing) && (
        <div className="mt-8 p-4 border border-yellow-400 bg-yellow-50 rounded">
          <p className="text-yellow-700">
            <strong>Hint:</strong> Try visiting{' '}
            <code>/checkout?plan=starter&billing=monthly</code>
          </p>
        </div>
      )}
    </div>
  )
}
