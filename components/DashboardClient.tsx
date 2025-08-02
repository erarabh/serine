'use client'

import { useEffect, useState } from 'react'
import AgentSelector from '@/components/AgentSelector'
import LangSelector   from '@/components/LangSelector'
import ChatbotSetup   from '@/components/ChatbotSetup'
import QADashboard    from '@/components/QADashboard'
import ChatSentiments from '@/components/ChatSentiments'
import AnalyticsPanel from '@/components/AnalyticsPanel'
import SubscriptionPanel from '@/components/SubscriptionPanel'
import SupportPanel   from '@/components/SupportPanel'
import AgentSettings  from '@/components/AgentSettings'
import { AgentProvider } from '@/lib/AgentContext'
import { useLanguage }  from '@/lib/LanguageContext'
import { ui }           from '@/lib/i18n'

type Section = 'chatbot' | 'faq' | 'sentiment' | 'analytics' | 'subscription' | 'support'

// **ONLY** these three values allowed downstream
type PlanKey = 'trial' | 'starter' | 'professional'
type Period  = 'monthly' | 'yearly'

export default function DashboardClient({ userId }: { userId: string }) {
  const [active, setActive]    = useState<Section>('chatbot')
  const [plan, setPlan]        = useState<PlanKey>('trial')
  const [planPeriod, setPlanPeriod] = useState<Period>('monthly')
  const { lang } = useLanguage()
  const t        = ui[lang] || ui.en

  useEffect(() => {
    if (!userId) return

    fetch(`/api/users/${userId}`)
      .then(r => r.json())
      .then(data => {
        // Normalize whatever your DB returns into one of our three keys
        let raw = (data.plan || '').toLowerCase()
        let normalized: PlanKey = 'trial'
        if (raw === 'starter' || raw === 'growth') {
          normalized = 'starter'
        } else if (raw === 'pro' || raw === 'professional') {
          normalized = 'professional'
        }
        setPlan(normalized)

        // plan_period comes straight through if valid, else default
        const rp = data.plan_period === 'yearly' ? 'yearly' : 'monthly'
        setPlanPeriod(rp)
      })
      .catch(() => {
        setPlan('trial')
        setPlanPeriod('monthly')
      })
  }, [userId])

  return (
    <AgentProvider userId={userId}>
      <div className="flex h-full min-h-screen">
        {/* Sidebar */}
        <nav className="w-64 bg-[rgb(44,62,80)] text-white p-6">
          <h2 className="text-2xl font-bold mb-6">{t.dashboard} Menu</h2>
          <AgentSelector userId={userId} onSelect={() => {}} />

          <div className="mt-6 space-y-2">
            <p className="text-sm text-gray-300 uppercase tracking-wide">Agent Tools</p>
            {(['chatbot','faq','sentiment','analytics'] as Section[]).map(key => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`w-full text-left py-2 mb-1 rounded ${
                  active === key ? 'bg-purple-700' : 'hover:bg-purple-600'
                }`}
              >
                {t.nav[key as keyof typeof t.nav]}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-2">
            <p className="text-sm text-gray-300 uppercase tracking-wide">System</p>
            {(['subscription','support'] as Section[]).map(key => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`w-full text-left py-2 mb-1 rounded ${
                  active === key ? 'bg-purple-700' : 'hover:bg-purple-600'
                }`}
              >
                {t.nav[key as keyof typeof t.nav]}
              </button>
            ))}
          </div>

          <div className="mt-8"><LangSelector /></div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto bg-gray-50">
          {active === 'chatbot' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold mb-4">🧠 {t.nav.chatbot}</h1>
              <ChatbotSetup lang={lang} />
              <AgentSettings />
            </div>
          )}
          {active === 'faq' && (
            <section>
              <h1 className="text-2xl font-bold mb-4">📚 {t.nav.faq}</h1>
              <QADashboard userId={userId} />
            </section>
          )}
          {active === 'sentiment' && (
            <section>
              <h1 className="text-2xl font-bold mb-4">😊 {t.nav.sentiment}</h1>
              <ChatSentiments userId={userId} />
            </section>
          )}
          {active === 'analytics' && (
            <section>
              <h1 className="text-2xl font-bold mb-4">📊 {t.nav.analytics}</h1>
              <AnalyticsPanel userId={userId} plan={plan} />
            </section>
          )}
          {active === 'subscription' && (
            <SubscriptionPanel userId={userId} plan={plan} period={planPeriod} />
          )}
          {active === 'support' && <SupportPanel />}
        </main>
      </div>
    </AgentProvider>
  )
}
