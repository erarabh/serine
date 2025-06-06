'use client'

import { useEffect, useState } from 'react'
import { languages, Language } from '@/lib/i18n'

const LangSelector = ({ onChange }: { onChange: (lang: Language) => void }) => {
  const [selected, setSelected] = useState<Language>('en')

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Language
    if (saved && languages.includes(saved)) {
      setSelected(saved)
      onChange(saved)
    }
  }, [onChange])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as Language
    setSelected(lang)
    localStorage.setItem('lang', lang)
    onChange(lang)
  }

  return (
    <select
      value={selected}
      onChange={handleChange}
      className="text-black p-2 border rounded"
    >
      {languages.map((lang) => (
        <option key={lang} value={lang}>
          {lang === 'en' ? '🇬🇧 English' : lang === 'fr' ? '🇫🇷 Français' : '🇸🇦 العربية'}
        </option>
      ))}
    </select>
  )
}

export default LangSelector
