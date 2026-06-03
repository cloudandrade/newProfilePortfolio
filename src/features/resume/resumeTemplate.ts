import type { TFunction } from 'i18next'
import i18n from '../../i18n'
import { educationOrder } from '../../data/educationOrder'
import { experienceOrder, getExperienceMeta } from '../../data/experienceMeta'
import { resumePdfSkillGroupDefs } from '../../data/resumePdfSkillGroups'
import { getPortfolioHref, portfolioEnabled, profile } from '../../data/profile'
import {
  pickLocalized,
  pickLocalizedList,
  resumeAtsOverlay,
  resumeOverlayLocale,
  type ResumeOverlayLocale,
} from '../../data/resumeAtsOverlay'
import {
  formatSkillLabelWithYears,
  getExtraSkillsForCategory,
  type ResumeSkillSummaryCategory,
} from '../../data/resumeSkillSummary'
import { skills } from '../../data/skills'

export type ResumePdfExperienceEntry = {
  leftTitle: string
  rightMeta: string
  bullets: string[]
}

export type ResumePdfEducationEntry = {
  institution: string
  period: string
  degreeLine: string
  detailBullet?: string
}

export type ResumePdfSectionBody =
  | { kind: 'skillGroups'; groups: { category: string; skillsJoined: string }[] }
  | { kind: 'experience'; entries: ResumePdfExperienceEntry[] }
  | { kind: 'education'; entries: ResumePdfEducationEntry[] }
  | { kind: 'certRows'; rows: { left: string; right: string }[] }
  | { kind: 'bullets'; items: string[] }

export type ResumePdfSection = {
  title: string
  body: ResumePdfSectionBody
}

export type ResumePdfDocument = {
  fileName: string
  header: {
    name: string
    headlineRole: string
    email: string
    phone: string
    linkedinLabel: string
    linkedinUrl: string
    githubLabel: string
    githubUrl: string
    portfolioLabel: string
    /** href resolvido (profile ou origin); vazio só fora do browser / sem protocolo válido */
    portfolioHref: string
  }
  sections: ResumePdfSection[]
}

const EDUCATION_IDS_PDF = ['formacao-eng-software-alura', 'pos-arquitetura', 'ads-unijorge'] as const

function isEducationIdForPdf(id: string): id is (typeof EDUCATION_IDS_PDF)[number] {
  return (EDUCATION_IDS_PDF as readonly string[]).includes(id)
}

function dedupeStrings(list: string[], key: (s: string) => string = (s) => s.toLowerCase()): string[] {
  const seen = new Set<string>()
  return list.filter((item) => {
    const k = key(item.trim())
    if (!k || seen.has(k)) return false
    seen.add(k)
    return true
  })
}

function toResumeExperienceTitle(role: string, company: string): string {
  return `${role.toUpperCase()} — ${company.toUpperCase()}`
}

const PDF_CATEGORY_BY_I18N_KEY: Record<string, ResumeSkillSummaryCategory> = {
  'resume.pdfSkillCategories.languages': 'languages',
  'resume.pdfSkillCategories.frameworks': 'frameworks',
  'resume.pdfSkillCategories.cloud': 'cloud',
  'resume.pdfSkillCategories.engineering': 'engineering',
}

function normalizeSkillLabelKey(label: string): string {
  return label.trim().toLowerCase()
}

function buildSkillGroups(
  t: TFunction,
  locale: ResumeOverlayLocale,
): { category: string; skillsJoined: string }[] {
  const assigned = new Set<string>()
  const groups: { category: string; items: string[]; categoryId?: ResumeSkillSummaryCategory }[] = []

  for (const def of resumePdfSkillGroupDefs) {
    const items: string[] = []
    const categoryId = PDF_CATEGORY_BY_I18N_KEY[def.categoryKey]

    for (const id of def.skillIds) {
      if (assigned.has(id)) continue
      assigned.add(id)
      const label = t(`skills.labels.${id}`)
      if (label) {
        items.push(formatSkillLabelWithYears(label, locale, { skillId: id }))
      }
    }

    if (categoryId) {
      const existing = new Set(items.map(normalizeSkillLabelKey))
      items.push(...getExtraSkillsForCategory(categoryId, locale, existing))
    }

    groups.push({ category: t(def.categoryKey), items, categoryId })
  }

  const extra = t('resume.coreSkillsExtra', { returnObjects: true })
  const extraList = Array.isArray(extra) ? dedupeStrings(extra as string[]) : []
  const remainingSkillIds = skills.map((s) => s.id).filter((id) => !assigned.has(id))
  const fallbackLabels = remainingSkillIds
    .map((id) => {
      const label = t(`skills.labels.${id}`)
      return label ? formatSkillLabelWithYears(label, locale, { skillId: id }) : ''
    })
    .filter(Boolean)

  if (groups.length) {
    const last = groups[groups.length - 1]
    const formattedExtra = extraList.map((label) => formatSkillLabelWithYears(label, locale))
    last.items = dedupeStrings([...last.items, ...formattedExtra, ...fallbackLabels])
  }

  return groups
    .map((g) => ({
      category: g.category,
      skillsJoined: dedupeStrings(g.items).join(', '),
    }))
    .filter((g) => g.skillsJoined.length > 0)
}

function buildExperienceEntries(t: TFunction, locale: ReturnType<typeof resumeOverlayLocale>): ResumePdfExperienceEntry[] {
  const entries: ResumePdfExperienceEntry[] = []

  for (const id of experienceOrder) {
    const role = t(`experience.items.${id}.role`)
    const company = t(`experience.items.${id}.company`)
    const period = t(`experience.items.${id}.period`)
    const highlights = t(`experience.items.${id}.highlights`, { returnObjects: true }) as string[]
    const overlay = resumeAtsOverlay.experience[id]
    const workMode = pickLocalized(overlay?.workMode, locale)
    const rightMeta = workMode ? `${period}\n${workMode}` : period

    const includeNarrative = getExperienceMeta(id)?.pdfIncludeNarrative === true

    const bullets = includeNarrative
      ? dedupeStrings([
          ...(Array.isArray(highlights) ? highlights : []),
          ...pickLocalizedList(overlay?.extraHighlights, locale),
        ]).slice(0, 2)
      : []

    entries.push({
      leftTitle: toResumeExperienceTitle(role, company),
      rightMeta,
      bullets,
    })
  }

  return entries
}

function buildEducationEntries(t: TFunction): ResumePdfEducationEntry[] {
  const out: ResumePdfEducationEntry[] = []
  for (const id of educationOrder) {
    if (!isEducationIdForPdf(id)) continue

    const title = t(`education.items.${id}.title`)
    const institution = t(`education.items.${id}.institution`)
    const period = t(`education.items.${id}.period`)

    if (id === 'formacao-eng-software-alura') {
      out.push({
        institution,
        period,
        degreeLine: title,
        detailBullet: t('resume.educationAluraPdfSummary'),
      })
      continue
    }

    const details = t(`education.items.${id}.details`, { returnObjects: true }) as string[]
    out.push({
      institution,
      period,
      degreeLine: title,
      detailBullet: Array.isArray(details) && details[0] ? details[0] : undefined,
    })
  }
  return out
}

function buildCertificationRows(t: TFunction, locale: ReturnType<typeof resumeOverlayLocale>): { left: string; right: string }[] {
  const rows: { left: string; right: string }[] = []
  const scrumTitle = t('education.items.scrum.title')
  const scrumInst = t('education.items.scrum.institution')
  const scrumPeriod = t('education.items.scrum.period')
  rows.push({ left: `${scrumTitle} — ${scrumInst}`, right: scrumPeriod })

  const extra = resumeAtsOverlay.certificationsExtra[locale] ?? resumeAtsOverlay.certificationsExtra.en ?? []
  for (const c of extra) {
    rows.push({ left: c, right: '' })
  }
  return rows
}

export function buildResumeTemplate(
  t: TFunction,
  localeOverride?: ResumeOverlayLocale,
): ResumePdfDocument {
  const locale = localeOverride ?? resumeOverlayLocale(i18n.language)

  const coreSkillsSection: ResumePdfSection = {
    title: t('resume.sectionCoreSkills'),
    body: { kind: 'skillGroups', groups: buildSkillGroups(t, locale) },
  }

  const sections: ResumePdfSection[] = [
    {
      title: t('resume.sectionExperience'),
      body: { kind: 'experience', entries: buildExperienceEntries(t, locale) },
    },
  ]

  sections.push(
    {
      title: t('resume.sectionEducation'),
      body: { kind: 'education', entries: buildEducationEntries(t) },
    },
    {
      title: t('resume.sectionCertifications'),
      body: { kind: 'certRows', rows: buildCertificationRows(t, locale) },
    },
    {
      title: t('resume.sectionLanguages'),
      body: {
        kind: 'bullets',
        items: (() => {
          const raw = t('resume.languageLines', { returnObjects: true })
          return Array.isArray(raw) ? (raw as string[]) : []
        })(),
      },
    },
    {
      title: t('resume.sectionAdditional'),
      body: {
        kind: 'bullets',
        items: (() => {
          const raw = t('resume.additionalInfoBullets', { returnObjects: true })
          return Array.isArray(raw) ? (raw as string[]) : []
        })(),
      },
    },
    coreSkillsSection,
  )

  return {
    fileName: 'jan-andrade-resume.pdf',
    header: {
      name: profile.name,
      headlineRole: t('resume.headlineRole'),
      email: profile.email,
      phone: profile.phone,
      linkedinLabel: t('resume.contactLinkedIn'),
      linkedinUrl: profile.linkedinUrl,
      githubLabel: t('resume.contactGithub'),
      githubUrl: profile.githubUrl,
      portfolioLabel: t('contact.portfolio'),
      portfolioHref: portfolioEnabled ? getPortfolioHref() : '',
    },
    sections,
  }
}
