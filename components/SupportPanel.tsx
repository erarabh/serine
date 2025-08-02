// frontend/components/SupportPanel.tsx
'use client'
import React from 'react'

export default function SupportPanel() {
  return (
    <div className="p-6 bg-white rounded shadow space-y-6">
      <h1 className="text-2xl font-bold mb-4">🛠️ Support Center</h1>

      {/* 1. Contact Info */}
      <div className="border rounded p-4 bg-gray-50">
        <h2 className="font-semibold mb-2">📬 Contact Support</h2>
        <p>If you're stuck, email us at:</p>
        <p className="font-mono text-purple-700">support@serine.ai</p>
        <p className="text-sm text-gray-600 mt-3">
  <strong>Response time by plan:</strong>
</p>
<ul className="list-disc list-inside text-sm text-gray-600 ml-4">
  <li><strong>Trial</strong>: within 48h</li>
  <li><strong>Growth</strong>: within 24h</li>
  <li><strong>Pro</strong>: within 6h</li>
</ul>

      </div>

      {/* 2. Quick Help Topics */}
      <div className="border rounded p-4 bg-gray-50 space-y-4">
        <h2 className="font-semibold mb-2">📘 Quick Help</h2>

        <details className="rounded border p-3">
          <summary className="font-medium cursor-pointer">How do I add an AI Agent?</summary>
          <p className="mt-2 text-sm text-gray-700">
            Go to “Chatbot” in the left menu, click “New Agent,” and provide a name. After saving, you can add Q&A pairs manually or generate them from sample messages.
          </p>
        </details>

        <details className="rounded border p-3">
          <summary className="font-medium cursor-pointer">How do I add and edit Q&A pairs?</summary>
          <p className="mt-2 text-sm text-gray-700">
            In the FAQ section, click “Add Q&A.” You can enter questions manually or let the AI suggest answers based on previous chats and context.
          </p>
        </details>

        <details className="rounded border p-3">
          <summary className="font-medium cursor-pointer">Why are my analytics charts empty?</summary>
          <p className="mt-2 text-sm text-gray-700">
            Make sure your AI agent has handled at least one message this week. Also confirm the selected date range and that you’ve chosen the right agent from the selector.
          </p>
        </details>

        <details className="rounded border p-3">
          <summary className="font-medium cursor-pointer">What does the Sentiment Score mean?</summary>
          <p className="mt-2 text-sm text-gray-700">
            Each message is analyzed as positive, neutral, or negative based on tone. The sentiment chart shows how this trend evolves over time for each agent.
          </p>
        </details>

        <details className="rounded border p-3">
          <summary className="font-medium cursor-pointer">How do I upgrade my plan?</summary>
          <p className="mt-2 text-sm text-gray-700">
            You’ll find your plan under “Subscription Management.” You can upgrade there or reach out to <span className="text-purple-700 font-mono">support@serine.ai</span> to switch plans.
          </p>
        </details>
      </div>
    </div>
  )
}
