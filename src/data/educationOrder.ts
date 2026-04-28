export const educationOrder = [
  'pos-arquitetura',
  'ads-unijorge',
  'scrum',
  'ingles',
] as const

export type EducationId = (typeof educationOrder)[number]
