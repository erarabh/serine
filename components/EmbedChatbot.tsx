'use client'

import { useSearchParams } from 'next/navigation'
import ChatWidget from './ChatWidget'

const EmbedChatbot = () => {
  const params = useSearchParams()
  const userId = params.get('uid') || undefined

  return (
    <div className="p-2">
      <ChatWidget userId={userId} />
    </div>
  )
}

export default EmbedChatbot
