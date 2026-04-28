export const educationOrder = [
  'formacao-eng-software-alura',
  'pos-arquitetura',
  'ads-unijorge',
  'scrum',
  'ingles',
] as const

export type EducationId = (typeof educationOrder)[number]
