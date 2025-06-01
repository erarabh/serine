'use client'

import { Suspense } from 'react'
import EmbedChatbot from '@/components/EmbedChatbot'

export default function EmbedPage() {
  return (
    <Suspense fallback={<div>Loading chatbot...</div>}>
      <EmbedChatbot />
    </Suspense>
  )
}
