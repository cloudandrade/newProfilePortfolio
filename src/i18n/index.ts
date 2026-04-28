import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import es from './locales/es.json'
import pt from './locales/pt.json'

const LANG_STORAGE = 'portfolio-lang'

function setDocumentLang(lng: string) {
  const map: Record<string, string> = { en: 'en', es: 'es', pt: 'pt-BR' }
  document.documentElement.lang = map[lng] ?? 'en'
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      pt: { translation: pt },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'pt'],
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: LANG_STORAGE,
    },
  })
  .then(() => {
    setDocumentLang(i18n.language?.split('-')[0] ?? 'en')
  })

i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem(LANG_STORAGE, lng)
  } catch {
    /* ignore */
  }
  setDocumentLang(lng.split('-')[0])
})

export default i18n
