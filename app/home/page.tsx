'use client'

import { useRouter } from 'next/navigation'

export default function SaaSHome() {
  const router = useRouter()

  return (
    <main className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white min-h-screen flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-5xl font-extrabold mb-4">AgentAI: AI Agent Platform</h1>
      <p className="text-lg max-w-xl mb-6">
        Transform your website with intelligent agents that speak multiple languages and answer questions instantly.
      </p>

      <div className="space-x-4">
        <button
          onClick={() => router.push('/register')}
          className="bg-white text-purple-700 font-semibold px-5 py-3 rounded shadow hover:bg-gray-100"
        >
          Get Started
        </button>
        <button
          onClick={() => router.push('/pricing')}
          className="bg-purple-800 text-white font-semibold px-5 py-3 rounded shadow hover:bg-purple-900"
        >
          View Plans
        </button>
      </div>
    </main>
  )
}
