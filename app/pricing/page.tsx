import PricingCard from '@/components/PricingCard'

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-purple-700">Choose your plan</h1>
          <p className="text-gray-600 mt-2">Plans that scale with your business</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Free */}
          <PricingCard
            title="Free"
            price="$0/month"
            features={[
              '1 AI Agent',
              'Up to 30 Q&A pairs',
              'Text chat only',
              'No scraping',
            ]}
            buttonLabel="Get Started"
          />

          {/* Pro */}
          <PricingCard
            title="Pro"
            price="$29/month"
            popular
            features={[
              'Up to 3 AI Agents',
              'Up to 150 Q&A pairs',
              'Voice-enabled',
              'Website scraping',
              'Analytics dashboard',
            ]}
            buttonLabel="Start Free Trial"
          />

          {/* Business */}
          <PricingCard
            title="Business"
            price="$99/month"
            features={[
              'Up to 10 AI Agents',
              '1,000 Q&A pairs',
              'White-label options',
              'Priority support',
              'API access',
            ]}
            buttonLabel="Contact Sales"
            onClick={() => window.location.href = 'mailto:support@serine.app'}
          />
        </div>
      </div>
    </main>
  )
}
