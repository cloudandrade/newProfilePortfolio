import { Box, Typography } from '@mui/material'
import { keyframes } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { clientsCarousel } from '../../data/clientsCarousel'

/** Metade da largura = uma cópia da lista → loop perfeito */
const clientsMarquee = keyframes`
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(-50%, 0, 0);
  }
`

/** Cartão enxuto: logo + nome — sempre em linha única no ticker */
function ClientCard({ name, logoSrc }: { name: string; logoSrc: string }) {
  return (
    <Box
      className="shrink-0"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 1.5,
        border: 1,
        borderColor: 'divider',
        bgcolor: (t) =>
          t.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
        py: 1,
        px: 1.5,
        minWidth: 176,
        maxWidth: 220,
        minHeight: 62,
      }}
    >
      <Box
        component="img"
        src={logoSrc}
        alt=""
        sx={{
          display: 'block',
          height: 26,
          width: 'auto',
          maxWidth: 'min(200px, 92%)',
          objectFit: 'contain',
          objectPosition: 'center',
        }}
      />
      <Typography
        component="div"
        sx={{
          mt: 0.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textAlign: 'center',
          fontSize: '0.68rem',
          fontWeight: 600,
          lineHeight: 1.15,
          color: 'text.primary',
          maxWidth: '100%',
        }}
      >
        {name}
      </Typography>
    </Box>
  )
}

export function ClientsCarousel() {
  const { t } = useTranslation()
  const loop = [...clientsCarousel, ...clientsCarousel]

  return (
    <Box className="mt-10 w-full">
      <Typography variant="subtitle1" className="mb-1 font-semibold">
        {t('experience.clientsCarouselTitle')}
      </Typography>
      

      <Box
        className="relative w-full overflow-x-hidden overflow-y-visible"
        sx={{
          minHeight: 78,
          display: 'flex',
          alignItems: 'center',
          maskImage: 'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)',
          WebkitMaskImage:
            'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
            gap: 1.5,
            pr: 1.5,
            width: 'max-content',
            animation: `${clientsMarquee} 36s linear infinite`,
            willChange: 'transform',
            '@media (prefers-reduced-motion: reduce)': {
              animationDuration: '90s',
            },
            '&:hover': {
              animationPlayState: 'paused',
            },
          }}
        >
          {loop.map((c, i) => (
            <ClientCard key={`${c.id}-${i}`} name={c.name} logoSrc={c.logoSrc} />
          ))}
        </Box>
      </Box>
    </Box>
  )
}
