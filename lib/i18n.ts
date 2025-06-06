// frontend/lib/i18n.ts
export const languages = ['en', 'fr', 'ar'] as const
export type Language = (typeof languages)[number]

export const defaultLang: Language = 'en'

export const languageNames: Record<Language, string> = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
}

export const ui = {
  en: {
    title: "Serine: Your AI Agent",
    inputPlaceholder: "Type or speak...",
    send: "Send",
    voice: "Voice",
    manualQATitle: "✍️ Manual Q&A Manager",
    question: "Question",
    answer: "Answer",
    add: "➕ Add Q&A",
    added: "Added!",
    failedToAdd: "Failed to add",
    storedPairs: "🧠 Stored Pairs",
    noPairs: "No Q&A pairs found.",
    delete: "❌ Delete",
  },
  fr: {
    title: "Serine : Votre agent IA",
    inputPlaceholder: "Écrivez ou parlez...",
    send: "Envoyer",
    voice: "Voix",
    manualQATitle: "✍️ Gérer vos questions/réponses",
    question: "Question",
    answer: "Réponse",
    add: "➕ Ajouter Q&R",
	added: "Ajouté !", // ✅ Add this line
    failedToAdd: "Échec de l'ajout",
    storedPairs: "Paires enregistrées",
    noPairs: "Aucune paire Q&R trouvée.",										
    delete: "❌ Supprimer",
  },
  ar: {
    title: "سيرين: مساعدك الذكي",
    inputPlaceholder: "اكتب أو تحدث...",
    send: "أرسل",
    voice: "صوت",
    manualQATitle: "✍️ إدارة الأسئلة والأجوبة",
    question: "سؤال",
    answer: "إجابة",
    add: "➕ أضف سؤال/جواب",
	added: "تمت الإضافة!", // ✅ Add this line
	failedToAdd: "فشل في الإضافة",
    storedPairs: "الأسئلة والأجوبة المخزنة",
    noPairs: "لم يتم العثور على أسئلة وأجوبة.",
    delete: "❌ حذف",
  }
}
