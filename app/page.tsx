// ✅ File: /app/page.tsx
import ChatWidget from '@/components/ChatWidget'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-indigo-400 to-purple-500 p-10 text-white">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold">Serine: AI-Powered Agent</h1>
        <p className="mt-4 text-lg">Multilingual chatbot with voice & smart Q&A</p>
      </div>

      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold text-purple-600 mb-2">Live Demo</h2>
        <ChatWidget />
      </div>
    </main>
  )
}


