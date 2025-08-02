'use client'

import { useState, useEffect } from 'react'
import { useSupabaseClient }    from '@supabase/auth-helpers-react'
import { useSearchParams }      from 'next/navigation'

export default function AuthBox() {
  const supabase = useSupabaseClient()
  const params   = useSearchParams()
  const preEmail = params.get('email') || ''

  const [email, setEmail]       = useState(preEmail)
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)

    if (!email || !password) {
      setError('Please enter both email and password.')
      setLoading(false)
      return
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (signInError || !data?.session) {
      setError(signInError?.message || 'Invalid credentials')
      setLoading(false)
      return
    }

    window.location.href = '/dashboard'
  }

  return (
    <div className="bg-white p-6 rounded shadow-md space-y-4 max-w-sm mx-auto">
      <h2 className="text-lg font-semibold text-center">🔐 Log In</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          autoComplete="email"
          required
          onChange={e => setEmail(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          autoComplete="current-password"
          required
          onChange={e => setPassword(e.target.value)}
          className="border p-2 w-full rounded"
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 w-full text-white py-2 rounded hover:bg-purple-700"
        >
          {loading ? 'Loading...' : 'Log In'}
        </button>
      </form>
    </div>
  )
}
