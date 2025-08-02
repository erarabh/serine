// frontend/lib/LanguageContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { defaultLang, Language } from "./i18n";

interface LangContext {
											

							
  lang: Language;
  setLang: (l: Language) => void;
}

const Context = createContext<LangContext>({
  lang: defaultLang,
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(defaultLang);
		  
  return <Context.Provider value={{ lang, setLang }}>{children}</Context.Provider>;
				
							   
   
}

export function useLanguage() {
  return useContext(Context);
}
