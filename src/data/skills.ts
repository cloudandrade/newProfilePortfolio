/** Níveis em escala 1–8 (mais conservadora). `highlight`: foco recente — barra dourada. */
export type SkillRow = { id: string; level: number; highlight?: boolean }

const SCALE_MAX = 8

export const skillsScaleMax = SCALE_MAX

export const skills: SkillRow[] = [
  { id: 'js', level: 8, highlight: true },
  { id: 'ts', level: 8, highlight: true },
  { id: 'node', level: 8, highlight: true },
  { id: 'react', level: 8, highlight: true },
  { id: 'unit-testing', level: 8, highlight: true },
  { id: 'e2e-testing', level: 7, highlight: true },
  { id: 'refine-tasks-requirements', level: 7, highlight: true },
  { id: 'leveraging-ai-tools', level: 8, highlight: true },
  { id: 'nextjs', level: 6, highlight: true },
  { id: 'nestjs', level: 6, highlight: true },
  { id: 'git', level: 8, highlight: true },
  { id: 'cloud', level: 7, highlight: true },
  { id: 'automations', level: 7, highlight: true },
  { id: 'docker', level: 7, highlight: true },
  { id: 'spring-boot', level: 6 },
  { id: 'react-native-expo', level: 6 },
  { id: 'prototype-figma', level: 7 },
  { id: 'uml-modeling', level: 7 },
  { id: 'database-modeling', level: 7 },
  { id: 'iac', level: 6 },
  { id: 'pipelines', level: 7 },
  { id: 'serverless', level: 7 },
  { id: 'html-css', level: 7 },
  { id: 'angular', level: 6 },
  { id: 'java', level: 6 },
  { id: 'python', level: 7 },
  { id: 'sql', level: 7 },
  { id: 'nosql', level: 6 },
]
