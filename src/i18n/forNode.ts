import i18n from 'i18next'
import en from './locales/en.json'
import es from './locales/es.json'
import pt from './locales/pt.json'
import type { ResumeOverlayLocale } from '../data/resumeAtsOverlay'

const resources = {
  en: { translation: en },
  es: { translation: es },
  pt: { translation: pt },
} as const

let initialized = false

/** i18n sem detector do browser — para scripts CLI (ex.: gerar .docx). */
export async function initI18nForNode(lang: ResumeOverlayLocale = 'pt') {
  if (!initialized) {
    await i18n.init({
      resources,
      lng: lang,
      fallbackLng: 'en',
      supportedLngs: ['en', 'es', 'pt'],
      interpolation: { escapeValue: false },
    })
    initialized = true
    return i18n
  }
  await i18n.changeLanguage(lang)
  return i18n
}

export default i18n
