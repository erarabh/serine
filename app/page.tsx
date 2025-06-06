'use client'

import Link from 'next/link'
import NavBar from '@/components/NavBar'

export default function Landing() {
  return (
    <>
      <NavBar />
																							
																								 
																	
																														 
			
															 
																															 
																																				  
																											 
			  
				

      <main className="min-h-screen bg-white text-gray-800">
        {/* HERO SECTION */}
        <section className="px-6 py-20 text-center bg-gradient-to-b from-purple-100 to-white">
          <h1 className="text-5xl font-bold text-purple-700 mb-4">AI-Powered Commercial Agents</h1>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Transform your website with intelligent AI agents that understand customer queries and provide instant support.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/chatbot" className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700">Try Chatbot</Link>
            <Link href="/dashboard" className="border border-purple-600 text-purple-600 px-6 py-3 rounded hover:bg-purple-50">Go to Dashboard</Link>
            <Link href="/pricing" className="underline text-purple-600 hover:text-purple-800">View Plans</Link>
																									 
						   
																	 
																	   
													   
				  
			 
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="px-6 py-20 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-purple-700">Everything you need to automate support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {[
              { title: 'Website Scraping', desc: 'Automatically build a knowledge base from your website content.' },
              { title: 'Q&A Database', desc: 'Manually add or auto-generate Q&A from your content.' },
              { title: 'Natural Language Understanding', desc: 'Understands rephrased questions, not just exact matches.' },
              { title: 'Easy Integration', desc: 'Use our JS snippet with Next.js, React, or any website.' },
              { title: 'Analytics Dashboard', desc: 'Track performance, questions, and satisfaction rates.' },
              { title: 'Customizable UI', desc: 'Match your brand with logo, colors, and greetings.' },
            ].map((f, i) => (
              <div key={i} className="bg-purple-50 p-6 rounded shadow">
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-700">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PREVIEW CHATBOT SECTION */}
        <section className="px-6 py-20 bg-gray-100 text-center">
          <h2 className="text-3xl font-bold text-purple-700 mb-4">Try Our AI Agent</h2>
          <p className="text-gray-700 mb-6">Ask our demo chatbot anything — it understands and responds intelligently.</p>
          <Link href="/chatbot" className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700">Launch Demo Chatbot</Link>
        </section>

        {/* EMBED SNIPPET SECTION */}
        <section className="px-6 py-20 max-w-4xl mx-auto text-left">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">Embed Example</h2>
          <p className="text-gray-700 mb-4">Add this JavaScript to your site:</p>
          <pre className="bg-gray-800 text-green-200 p-4 rounded text-sm overflow-auto">
{`<script src="https://cdn.agentai.com/agent.min.js"></script>
<script>
  AgentAI.init({
    apiKey: 'YOUR_API_KEY',
    position: 'bottom-right',
    primaryColor: '#6e8efb',
    greeting: 'Hi! How can I help you today?',
    icon: 'robot',
    autoInit: true,
    language: 'auto'
  });
</script>`}
          </pre>
        </section>

        {/* CTA SECTION */}
        <section className="px-6 py-20 bg-purple-600 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your customer support?</h2>
          <p className="mb-6">Start your free trial today. No credit card required.</p>
          <Link href="/pricing" className="bg-white text-purple-700 px-6 py-3 rounded font-semibold hover:bg-purple-100">
            Get Started
          </Link>
        </section>

        {/* FOOTER */}
        <footer className="bg-gray-900 text-gray-300 px-6 py-10 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Serine AI. All rights reserved.</p>
        </footer>
      </main>
    </>
  )
}
