'use client'
import dynamic from 'next/dynamic'

// Disable SSR for heavy chart component
const ChatMetrics = dynamic(() => import('./ChatMetrics'), { ssr: false })

export default ChatMetrics
