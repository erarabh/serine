'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { defaultLang, type Language } from './i18n'; // ✅ explicit type import

interface LangContext {
  lang: Language;
  setLang: (l: Language) => void;
}

const Context = createContext<LangContext>({
  lang: defaultLang,
  setLang: () => {}, // ❗ placeholder until initialized by Provider
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(defaultLang);

  return (
    <Context.Provider value={{ lang, setLang }}>
      {children}
    </Context.Provider>
  );
}

export function useLanguage(): LangContext {
  return useContext(Context);
}

export type { Language }; // ✅ explicit re-export for external usage
