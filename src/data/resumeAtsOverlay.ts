import raw from './resumeAtsOverlay.json'

export type ResumeOverlayLocale = 'en' | 'pt' | 'es'

export type LocalizedStrings = Partial<Record<ResumeOverlayLocale, string>>

export type ExperienceAtsOverlay = {
  workMode?: LocalizedStrings
  extraHighlights?: Partial<Record<ResumeOverlayLocale, string[]>>
}

export type StandaloneProjectOverlay = {
  title: LocalizedStrings
  highlights: Partial<Record<ResumeOverlayLocale, string[]>>
  technologies?: string[]
  /** Faixa de datas ou rótulo exibido à direita no PDF (ex.: "2024 — 2025"). */
  period?: LocalizedStrings
}

export type ResumeAtsOverlay = {
  experience: Record<string, ExperienceAtsOverlay>
  standaloneProjects: StandaloneProjectOverlay[]
  certificationsExtra: Partial<Record<ResumeOverlayLocale, string[]>>
}

export const resumeAtsOverlay = raw as ResumeAtsOverlay

export function resumeOverlayLocale(i18nLanguage: string): ResumeOverlayLocale {
  const base = i18nLanguage.split('-')[0]?.toLowerCase()
  if (base === 'pt' || base === 'es') return base
  return 'en'
}

export function pickLocalized(
  map: LocalizedStrings | undefined,
  locale: ResumeOverlayLocale,
): string | undefined {
  if (!map) return undefined
  return map[locale] ?? map.en
}

export function pickLocalizedList(
  map: Partial<Record<ResumeOverlayLocale, string[]>> | undefined,
  locale: ResumeOverlayLocale,
): string[] {
  if (!map) return []
  const list = map[locale] ?? map.en ?? []
  return Array.isArray(list) ? list : []
}
