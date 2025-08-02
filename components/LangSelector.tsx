// components/LangSelector.tsx
'use client';
import { useLanguage } from '@/lib/LanguageContext';
import { languages } from '@/lib/i18n';

interface Props { small?: boolean; }
export default function LangSelector({ small = false }: Props) {
  const { lang, setLang } = useLanguage();
  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value as any)}
      className={`text-black px-1 py-1 rounded border ${small ? 'text-xs' : ''}`}
    >
      {languages.map(l => (
        <option key={l} value={l}>{l.toUpperCase()}</option>
      ))}
    </select>
  );
}



