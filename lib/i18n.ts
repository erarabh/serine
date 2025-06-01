// frontend/lib/i18n.ts
export const languages = ['en', 'fr', 'ar'] as const
export type Language = (typeof languages)[number]

export const defaultLang: Language = 'en'

export const ui = {
  en: {
    title: "Serine: Your AI Agent",
    inputPlaceholder: "Type or speak...",
    send: "Send",
    voice: "Voice",
  },
  fr: {
    title: "Serine : Votre agent IA",
    inputPlaceholder: "Écrivez ou parlez...",
    send: "Envoyer",
    voice: "Voix",
  },
  ar: {
    title: "سيرين: مساعدك الذكي",
    inputPlaceholder: "اكتب أو تحدث...",
    send: "أرسل",
    voice: "صوت",
  },
}
