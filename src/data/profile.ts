/** Dados que não dependem de idioma (nomes próprios, URLs, telefone) */
export const profile = {
  name: 'Jan Andrade',
  photoSrc: '/images/profile.jpg',
  /** Exibição ITU (+CC DDD número). */
  phone: '+55 71 98712-0712',
  phoneHref: 'tel:+5571987120712',
  whatsappHref: 'https://wa.me/5571987120712',
  email: 'cloud.andrade16@gmail.com',
  emailHref: 'mailto:cloud.andrade16@gmail.com',
  linkedinSlug: 'jan-cloude-andrade-582343136',
  linkedinUrl: 'https://www.linkedin.com/in/jan-cloude-andrade-582343136/',
  githubUrl: 'https://github.com/cloudandrade',
  /**
   * URL público estável quando publicado. Se vazio ao gerar o PDF na web,
   * `getPortfolioHref()` usa `window.location.origin`.
   */
  portfolioUrl: '',
} as const

/** Href público para portfólio (prioriza `portfolioUrl`; senão origin em http/https). */
export function getPortfolioHref(): string {
  const trimmed = String(profile.portfolioUrl).trim()
  if (trimmed) return trimmed
  if (typeof window !== 'undefined' && window.location.protocol.startsWith('http')) {
    const o = window.location.origin
    return o.endsWith('/') ? o : `${o}/`
  }
  return ''
}
