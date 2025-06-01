'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AuthBox() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLogin, setIsLogin] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (!email || !password) {
      setError('Please enter both email and password.')
      setLoading(false)
      return
    }

    if (!isLogin) {
      const { error } = await supabase.auth.signUp({ email, password })

      if (error) {
        setError(error.message)
      } else {
        setMessage('Check your email to confirm your account.')
      }

      setLoading(false)
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setError(error.message)
      } else {
        setMessage('Login successful! Redirecting...')
        window.location.reload()

      }

      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded shadow-md space-y-4 max-w-sm mx-auto">
      <h2 className="text-lg font-semibold text-center">
        {isLogin ? '🔐 Log In' : '📝 Sign Up'}
      </h2>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <input
          className="border p-2 w-full rounded"
          placeholder="Email"
          value={email}
          type="email"
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 w-full rounded"
          type="password"
          placeholder="Password"
          value={password}
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-500">{message}</p>}

        <button
          type="submit"
          className="bg-purple-600 w-full text-white py-2 rounded hover:bg-purple-700"
          disabled={loading}
        >
          {loading ? 'Loading...' : isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>

      <p
        className="text-sm text-center text-blue-600 underline cursor-pointer"
        onClick={() => {
          setIsLogin(!isLogin)
          setError('')
          setMessage('')
        }}
      >
        {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
      </p>
    </div>
  )
}
