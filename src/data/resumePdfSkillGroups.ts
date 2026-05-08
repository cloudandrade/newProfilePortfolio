/** Agrupamento para o PDF estilo ATS (categoria + lista). IDs alinham a `skills.ts` / i18n `skills.labels.*`. */
export const resumePdfSkillGroupDefs: ReadonlyArray<{
  categoryKey: string
  skillIds: readonly string[]
}> = [
  {
    categoryKey: 'resume.pdfSkillCategories.languages',
    skillIds: ['ts', 'js', 'python', 'java', 'sql', 'nosql', 'html-css'],
  },
  {
    categoryKey: 'resume.pdfSkillCategories.frameworks',
    skillIds: ['react', 'angular', 'node', 'nextjs', 'nestjs', 'spring-boot', 'react-native-expo'],
  },
  {
    categoryKey: 'resume.pdfSkillCategories.cloud',
    skillIds: ['cloud', 'docker', 'iac', 'pipelines', 'serverless', 'git'],
  },
  {
    categoryKey: 'resume.pdfSkillCategories.engineering',
    skillIds: [
      'unit-testing',
      'e2e-testing',
      'refine-tasks-requirements',
      'leveraging-ai-tools',
      'uml-modeling',
      'database-modeling',
      'prototype-figma',
      'automations',
      'puppeteer',
    ],
  },
]
