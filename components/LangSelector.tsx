'use client'
import { useState } from 'react'
import { languages, Language } from '@/lib/i18n'

const LangSelector = ({ onChange }: { onChange: (lang: Language) => void }) => {
  const [selected, setSelected] = useState<Language>('en')

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as Language
    setSelected(lang)
    onChange(lang)
  }

  return (
    <select value={selected} onChange={handleChange} className="text-black p-1 rounded border">
      {languages.map((lang) => (
        <option key={lang} value={lang}>
          {lang.toUpperCase()}
        </option>
      ))}
    </select>
  )
}

export default LangSelector
