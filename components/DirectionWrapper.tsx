'use client'

import { useEffect } from 'react'
import { defaultLang } from '@/lib/i18n'

export default function DirectionWrapper() {
  useEffect(() => {
    const lang = localStorage.getItem('lang') || defaultLang
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [])

  return null
}
