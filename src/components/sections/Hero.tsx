import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { Box, Button, Container, Typography, useTheme } from '@mui/material'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { profile } from '../../data/profile'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const gridPattern =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"

export function Hero() {
  const { t } = useTranslation()
  const theme = useTheme()
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()
  const yBg = useTransform(scrollY, [0, 500], [0, reduced ? 0 : 140])
  const yPhoto = useTransform(scrollY, [0, 500], [0, reduced ? 0 : 70])
  const fadeHero = useTransform(scrollY, [0, 360], [1, reduced ? 1 : 0.35])

  const isDark = theme.palette.mode === 'dark'
  const tealGlow = isDark ? 'rgba(0,242,195,0.28)' : 'rgba(0, 242, 195, 0.18)'
  const warmGlow = isDark ? 'rgba(232,165,152,0.2)' : 'rgba(232, 165, 152, 0.14)'
  const gridOpacity = isDark ? 0.045 : 0.06
  const whatsappHref = 'https://wa.me/5571987120712'
  const [showCodeSide, setShowCodeSide] = useState(false)
  const [typedChars, setTypedChars] = useState(0)
  const hobbies = t('profile.terminal.hobbies', { returnObjects: true }) as string[]
  const codeSnippet = [
    'interface Profile {',
    '  name: string',
    '  country: string',
    '  state: string',
    '  age: number',
    '  maritalStatus: string',
    '  hobbies: string[]',
    '}',
    '',
    'const profile: Profile = {',
    "  name: 'Jan Andrade',",
    `  country: '${t('profile.terminal.country')}',`,
    `  state: '${t('profile.terminal.state')}',`,
    `  age: ${t('profile.terminal.age')},`,
    `  maritalStatus: '${t('profile.terminal.maritalStatus')}',`,
    `  hobbies: [${hobbies.map((hobby) => `'${hobby}'`).join(', ')}],`,
    '}',
    '',
    "console.log('profile ready')",
  ].join('\n')
  const ctaShapeSx = {
    borderRadius: 1.5,
    minHeight: 46,
    px: 3,
    textTransform: 'none' as const,
  }

  useEffect(() => {
    const interval = window.setInterval(() => {
      setShowCodeSide((prev) => {
        const next = !prev
        if (next) setTypedChars(0)
        return next
      })
    }, 15000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!showCodeSide) return

    const typingInterval = window.setInterval(() => {
      setTypedChars((prev) => {
        if (prev >= codeSnippet.length) {
          window.clearInterval(typingInterval)
          return prev
        }
        return prev + 2
      })
    }, 30)

    return () => window.clearInterval(typingInterval)
  }, [showCodeSide, codeSnippet, reduced])

  return (
    <Box
      id="home"
      component="section"
      className="relative flex min-h-[100svh] items-center overflow-hidden scroll-mt-[72px]"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ y: yBg, opacity: fadeHero }}
        aria-hidden
      >
        <Box
          className="absolute -top-1/4 right-[-20%] h-[70vmin] w-[70vmin] rounded-full blur-[100px]"
          sx={{
            background: `radial-gradient(circle, ${tealGlow} 0%, transparent 68%)`,
          }}
        />
        <Box
          className="absolute bottom-[-25%] left-[-25%] h-[65vmin] w-[65vmin] rounded-full blur-[100px]"
          sx={{
            background: `radial-gradient(circle, ${warmGlow} 0%, transparent 68%)`,
          }}
        />
        <Box
          className="absolute inset-0"
          sx={{
            opacity: gridOpacity,
            backgroundImage: gridPattern,
          }}
        />
      </motion.div>

      <Container maxWidth="lg" className="relative z-[1] py-24 md:py-32">
        <Box className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-8">
          <Box className="order-2 md:order-1 md:col-span-7">
            <Typography
              variant="overline"
              className="font-mono tracking-[0.28em]"
              sx={{ color: 'primary.main' }}
            >
              {t('hero.eyebrow')}
            </Typography>
            <Typography
              variant="h1"
              className="mt-2 text-4xl sm:text-5xl md:text-6xl"
              sx={{ color: 'text.primary' }}
            >
              {profile.name}
            </Typography>
            <Typography
              variant="h5"
              className="mt-3 font-medium"
              sx={{ color: 'primary.main' }}
            >
              {t('profile.title')}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              className="mt-6 max-w-xl leading-relaxed"
            >
              {t('profile.objective')}
            </Typography>
            <Box className="mt-8 flex flex-wrap gap-3">
              <Box
                component={motion.div}
                animate={
                  reduced
                    ? undefined
                    : {
                        scale: [0.98, 1.12, 0.98],
                      }
                }
                transition={
                  reduced
                    ? undefined
                    : {
                        duration: 2.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }
                }
                sx={{
                  position: 'relative',
                  display: 'inline-flex',
                  transformOrigin: 'center',
                  willChange: 'transform',
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  href={whatsappHref}
                  component="a"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    ...ctaShapeSx,
                    position: 'relative',
                    overflow: 'hidden',
                    transformOrigin: 'center',
                    boxShadow: isDark
                      ? '0 8px 22px rgba(0, 242, 195, 0.24)'
                      : '0 8px 20px rgba(0, 242, 195, 0.2)',
                    '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: -32,
                          left: '-32%',
                          width: '26%',
                          height: '210%',
                          transform: 'rotate(18deg)',
                          background:
                            'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.4), rgba(255,255,255,0))',
                          animation: 'heroCtaShine 3.1s ease-in-out infinite',
                        },
                    '@keyframes heroCtaShine': {
                      '0%, 60%': { left: '-32%', opacity: 0 },
                      '66%': { opacity: 1 },
                      '84%, 100%': { left: '125%', opacity: 0 },
                    },
                  }}
                >
                  {t('hero.ctaContact')}
                </Button>
              </Box>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                href="#experience"
                component="a"
                sx={ctaShapeSx}
              >
                {t('hero.ctaExperience')}
              </Button>
            </Box>
          </Box>

          <Box className="order-1 flex justify-center md:order-2 md:col-span-5 md:justify-end">
            <motion.div style={{ y: yPhoto, width: 'min(100%, 520px)' }}>
              <Box
                className="relative rounded-2xl"
                sx={{
                  width: '100%',
                  height: 430,
                  perspective: '1200px',
                  pt: 1,
                  pb: 1,
                  pl: 1,
                  pr: 2,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, rgba(0,242,195,0.95), rgba(0,242,195,0.15))',
                  boxShadow: isDark ? '0 0 90px rgba(0, 242, 195, 0.12)' : '0 12px 40px rgba(0, 0, 0, 0.08)',
                }}
              >
                <AnimatePresence mode="wait">
                  {!showCodeSide ? (
                    <Box
                      key="photo-card"
                      component={motion.div}
                      initial={reduced ? { opacity: 1 } : { rotateY: -180, opacity: 0.45 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={reduced ? { opacity: 0 } : { rotateY: 180, opacity: 0.45 }}
                      transition={{ duration: reduced ? 0.25 : 0.75, ease: [0.22, 1, 0.36, 1] }}
                      sx={{
                        position: 'absolute',
                        inset: '8px 16px 8px 8px',
                        width: 'calc(100% - 84px)',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 2,
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          component="img"
                          src={profile.photoSrc}
                          alt={profile.name}
                          className="block h-full w-full rounded-xl object-cover"
                          width={280}
                          height={373}
                          fetchPriority="high"
                        />
                      </Box>
                    </Box>
                  ) : (
                    <Box
                      key="code-card"
                      component={motion.div}
                      initial={reduced ? { opacity: 1 } : { rotateY: -180, opacity: 0.45 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={reduced ? { opacity: 0 } : { rotateY: 180, opacity: 0.45 }}
                      transition={{ duration: reduced ? 0.25 : 0.75, ease: [0.22, 1, 0.36, 1] }}
                      sx={{
                        position: 'absolute',
                        inset: '8px 16px 8px 8px',
                        width: 'calc(100% - 84px)',
                        right: 16,
                        left: 'auto',
                        borderRadius: 2,
                        bgcolor: '#23262d',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 2,
                          bgcolor: '#1b1f27',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          p: 2.5,
                          overflow: 'hidden',
                          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                          color: '#b7ffd8',
                          fontSize: '0.78rem',
                          lineHeight: 1.6,
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {codeSnippet.slice(0, typedChars)}
                        {showCodeSide && (
                          <Box
                            component={motion.span}
                            animate={reduced ? undefined : { opacity: [1, 0, 1] }}
                            transition={
                              reduced ? undefined : { duration: 0.9, repeat: Infinity, ease: 'linear' }
                            }
                            sx={{ color: '#43f5bc' }}
                          >
                            |
                          </Box>
                        )}
                      </Box>
                    </Box>
                  )}
                </AnimatePresence>
              </Box>
            </motion.div>
          </Box>
        </Box>

        {!reduced && (
          <motion.div
            className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
            style={{ color: theme.palette.text.secondary }}
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Typography variant="caption" className="uppercase tracking-widest">
              {t('hero.scrollHint')}
            </Typography>
            <ArrowDownwardIcon fontSize="small" aria-hidden />
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
