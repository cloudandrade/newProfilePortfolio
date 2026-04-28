/** Níveis em escala 1–8 (mais conservadora). `highlight`: foco recente — barra dourada. */
export type SkillRow = { id: string; level: number; highlight?: boolean }

const SCALE_MAX = 8

export const skillsScaleMax = SCALE_MAX

export const skills: SkillRow[] = [
  { id: 'js', level: 8, highlight: true },
  { id: 'ts', level: 8, highlight: true },
  { id: 'node', level: 8, highlight: true },
  { id: 'react', level: 8, highlight: true },
  { id: 'cloud', level: 7, highlight: true },
  { id: 'automations', level: 7, highlight: true },
  { id: 'docker', level: 7 },
  { id: 'iac', level: 6 },
  { id: 'pipelines', level: 7 },
  { id: 'puppeteer', level: 6 },
  { id: 'serverless', level: 7 },
  { id: 'html-css', level: 7 },
  { id: 'angular', level: 6 },
  { id: 'java', level: 6 },
  { id: 'python', level: 7 },
  { id: 'sql', level: 7 },
  { id: 'nosql', level: 6 },
  { id: 'git', level: 7 },
  { id: 'tests', level: 7 },
]
