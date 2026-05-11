export type ExperienceMeta = {
  id: string
  employerLogoSrc?: string
  /** Só cargos senior no PDF: bullets narrativos. Demais: só título, datas e modalidade. */
  pdfIncludeNarrative?: boolean
}

/**
 * Logotipos do empregador em /public/logos — substitua por arquivos oficiais se desejar.
 */
export const experienceMeta: ExperienceMeta[] = [
  { id: 'bankme', employerLogoSrc: '/logos/clients/bankme.png', pdfIncludeNarrative: true },
  { id: 'illa-livelo', employerLogoSrc: '/logos/illa.svg', pdfIncludeNarrative: true },
  { id: 'squadra-shell', employerLogoSrc: '/logos/squadra.svg', pdfIncludeNarrative: true },
  { id: 'add', employerLogoSrc: '/logos/add.svg' },
  { id: 'stefanini', employerLogoSrc: '/logos/stefanini.svg' },
  { id: 'capgemini', employerLogoSrc: '/logos/capgemini.svg' },
  { id: 'cronsolucoes', employerLogoSrc: '/logos/cronsolucoes.svg' },
  { id: 'abefs', employerLogoSrc: '/logos/abefs.svg' },
]

export const experienceOrder = experienceMeta.map((e) => e.id)

export function getExperienceMeta(id: string): ExperienceMeta | undefined {
  return experienceMeta.find((e) => e.id === id)
}
