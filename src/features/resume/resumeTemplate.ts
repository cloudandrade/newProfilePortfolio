import type { TFunction } from 'i18next'
import { educationOrder } from '../../data/educationOrder'
import { experienceOrder } from '../../data/experienceMeta'
import { profile } from '../../data/profile'
import { skills, skillsScaleMax } from '../../data/skills'

export type ResumeTemplate = {
  fileName: string
  name: string
  headline: string
  contacts: string[]
  sections: Array<{
    title: string
    lines: string[]
  }>
}

export function buildResumeTemplate(t: TFunction): ResumeTemplate {
  const specializations = t('profile.specializations', { returnObjects: true }) as string[]
  const workLines = experienceOrder.flatMap((id) => {
    const role = t(`experience.items.${id}.role`)
    const company = t(`experience.items.${id}.company`)
    const period = t(`experience.items.${id}.period`)
    const highlights = t(`experience.items.${id}.highlights`, { returnObjects: true }) as string[]
    const header = `${role} — ${company} (${period})`
    return [header, ...(Array.isArray(highlights) ? highlights.map((h) => `- ${h}`) : []), '']
  })

  const educationLines = educationOrder.flatMap((id) => {
    const title = t(`education.items.${id}.title`)
    const institution = t(`education.items.${id}.institution`)
    const period = t(`education.items.${id}.period`)
    const details = t(`education.items.${id}.details`, { returnObjects: true }) as string[]
    const header = `${title} — ${institution} (${period})`
    return [header, ...(Array.isArray(details) ? details.map((d) => `- ${d}`) : []), '']
  })

  const skillLines = skills.map((skill) => {
    const label = t(`skills.labels.${skill.id}`)
    return `${label} — ${skill.level}/${skillsScaleMax}`
  })

  return {
    fileName: 'jan-andrade-resume.pdf',
    name: profile.name,
    headline: t('profile.title'),
    contacts: [profile.email, profile.phone, profile.linkedinUrl, t('profile.address')],
    sections: [
      {
        title: t('resume.sectionSummary'),
        lines: [t('profile.objective')],
      },
      {
        title: t('about.specializationsTitle'),
        lines: Array.isArray(specializations) ? specializations.map((s) => `- ${s}`) : [],
      },
      {
        title: t('experience.work'),
        lines: workLines.filter(Boolean),
      },
      {
        title: t('experience.education'),
        lines: educationLines.filter(Boolean),
      },
      {
        title: t('skills.title'),
        lines: skillLines,
      },
    ],
  }
}
