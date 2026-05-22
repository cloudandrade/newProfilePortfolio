import raw from './resumeSkillSummary.json'
import type { ResumeOverlayLocale } from './resumeAtsOverlay'

export type SkillProficiency = 'mid' | 'senior' | 'expert'

export type SkillYearsEntry = {
  years: number
  proficiency?: SkillProficiency
}

export type ResumeSkillSummaryCategory = 'languages' | 'frameworks' | 'cloud' | 'engineering'

export type ResumeSkillSummaryItem = {
  id: string
  years: number
  proficiency?: SkillProficiency
  category?: ResumeSkillSummaryCategory
  labels?: Partial<Record<ResumeOverlayLocale, string>>
  /** Rótulos já usados em i18n (`coreSkillsExtra`, etc.) para casar anos no PDF */
  matchLabels?: string[]
}

export type ResumeSkillSummary = {
  bySkillId: Record<string, SkillYearsEntry>
  skills: ResumeSkillSummaryItem[]
}

export const resumeSkillSummary = raw as ResumeSkillSummary

/** Ex.: `(9 anos)` / `(9 years)` / `(9 años)` */
export function formatSkillYearsParenthetical(years: number, locale: ResumeOverlayLocale): string {
  if (years < 1) return ''
  if (locale === 'pt') return years === 1 ? `(${years} ano)` : `(${years} anos)`
  if (locale === 'es') return years === 1 ? `(${years} año)` : `(${years} años)`
  return years === 1 ? `(${years} year)` : `(${years} years)`
}

export function getSkillYearsForId(skillId: string): number | undefined {
  return resumeSkillSummary.bySkillId[skillId]?.years
}

function normalizeLabel(s: string): string {
  return s.trim().toLowerCase()
}

/** Anos para um rótulo exibido (i18n ou entrada do JSON). */
export function getSkillYearsForLabel(label: string, locale: ResumeOverlayLocale): number | undefined {
  const norm = normalizeLabel(label)
  if (!norm) return undefined

  for (const skill of resumeSkillSummary.skills) {
    const candidates = [
      skill.labels?.[locale],
      skill.labels?.en,
      skill.labels?.pt,
      skill.labels?.es,
      ...(skill.matchLabels ?? []),
    ].filter((s): s is string => typeof s === 'string' && s.length > 0)

    for (const candidate of candidates) {
      if (normalizeLabel(candidate) === norm) return skill.years
    }
  }

  return undefined
}

export function formatSkillLabelWithYears(
  label: string,
  locale: ResumeOverlayLocale,
  options?: { skillId?: string },
): string {
  const years =
    (options?.skillId ? getSkillYearsForId(options.skillId) : undefined) ??
    getSkillYearsForLabel(label, locale)

  if (years == null) return label
  const suffix = formatSkillYearsParenthetical(years, locale)
  return suffix ? `${label} ${suffix}` : label
}

function skillLabelNorms(skill: ResumeSkillSummaryItem, locale: ResumeOverlayLocale): string[] {
  const raw = [
    skill.labels?.[locale],
    skill.labels?.en,
    skill.labels?.pt,
    skill.labels?.es,
    ...(skill.matchLabels ?? []),
  ].filter((s): s is string => typeof s === 'string' && s.length > 0)
  return [...new Set(raw.map(normalizeLabel))]
}

/** Skills do JSON com `category` que ainda não estão na lista do grupo (por rótulo ou `matchLabels`). */
export function getExtraSkillsForCategory(
  category: ResumeSkillSummaryCategory,
  locale: ResumeOverlayLocale,
  existingLabels: Set<string>,
): string[] {
  const out: string[] = []
  const seen = new Set<string>()

  for (const skill of resumeSkillSummary.skills) {
    if (skill.category !== category) continue
    const label = skill.labels?.[locale] ?? skill.labels?.en
    if (!label) continue
    const norms = skillLabelNorms(skill, locale)
    if (norms.some((n) => existingLabels.has(n) || seen.has(n))) continue
    const displayNorm = normalizeLabel(label)
    if (!displayNorm || seen.has(displayNorm)) continue
    seen.add(displayNorm)
    for (const n of norms) seen.add(n)
    out.push(formatSkillLabelWithYears(label, locale))
  }

  return out
}
