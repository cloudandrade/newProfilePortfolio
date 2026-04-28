/** Marcas / clientes — logos em /public/logos/clients/ (PNG oficiais). */
export type CarouselClient = {
  id: string
  name: string
  logoSrc: string
}

export const clientsCarousel: CarouselClient[] = [
  { id: 'serasa', name: 'Serasa Experian', logoSrc: '/logos/clients/serasa.png' },
  { id: 'caixa', name: 'Caixa Econômica Federal', logoSrc: '/logos/clients/caixa.png' },
  { id: 'nordeste', name: 'Banco do Nordeste', logoSrc: '/logos/clients/bnd.png' },
  { id: 'sefaz', name: 'SEFAZ', logoSrc: '/logos/clients/sefaz.png' },
  { id: 'bradesco', name: 'Bradesco', logoSrc: '/logos/clients/bradesco.png' },
  { id: 'petrobras', name: 'Petrobras', logoSrc: '/logos/clients/petrobras.png' },
  { id: 'brasilcap', name: 'Brasilcap', logoSrc: '/logos/clients/brasilcap.png' },
  { id: 'shell', name: 'Shell', logoSrc: '/logos/clients/shell.png' },
  { id: 'livelo', name: 'Livelo', logoSrc: '/logos/clients/livelo.png' },
  { id: 'bankme', name: 'Bankme', logoSrc: '/logos/clients/bankme.png' },
]
