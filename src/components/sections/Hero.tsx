import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { alpha, Box, Button, Container, Typography, useTheme } from '@mui/material'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { profile } from '../../data/profile'
import { useHeroRotatingTypewriter } from '../../hooks/useHeroRotatingTypewriter'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import './Hero.css'

export function Hero() {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()
  const yBg = useTransform(scrollY, [0, 500], [0, reduced ? 0 : 140])
  const yPhoto = useTransform(scrollY, [0, 500], [0, reduced ? 0 : 70])
  const fadeHero = useTransform(scrollY, [0, 360], [1, reduced ? 1 : 0.35])

  const isDark = theme.palette.mode === 'dark'
  const accent = theme.palette.primary.main
  const glowStrong = isDark ? alpha(accent, 0.28) : alpha(accent, 0.18)
  const glowSoft = isDark ? alpha(accent, 0.14) : alpha(accent, 0.1)
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
  const [heroFirstName, ...heroRestName] = profile.name.split(' ')
  const heroFamilyName = heroRestName.join(' ')

  const rotatingSubtitles = useMemo(() => {
    const raw = t('hero.rotatingSubtitles', { returnObjects: true })
    return Array.isArray(raw) ? raw : []
  }, [t, i18n.language])

  const typewriter = useHeroRotatingTypewriter(rotatingSubtitles, {
    reducedMotion: reduced,
    typeIntervalMs: 52,
    holdMs: 2800,
    deleteIntervalMs: 42,
  })

  const mintHighlight = '#6ee7b7'
  const lightGreen = theme.palette.primary.light

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
      className="hero-root"
    >
      <motion.div
        className="hero-bg-layer"
        style={{ y: yBg, opacity: fadeHero }}
        aria-hidden
      >
        <Box
          className="hero-glow hero-glow-top"
          sx={{
            background: `radial-gradient(circle, ${glowStrong} 0%, transparent 68%)`,
          }}
        />
        <Box
          className="hero-glow hero-glow-bottom"
          sx={{
            background: `radial-gradient(circle, ${glowSoft} 0%, transparent 68%)`,
          }}
        />
      </motion.div>

      <Container maxWidth="lg" className="hero-container">
        <Box className="hero-grid">
          <Box className="hero-content-col">
            <Typography
              variant="overline"
              className="hero-eyebrow"
              sx={{ color: 'primary.main' }}
            >
              {t('hero.eyebrow')}
            </Typography>
            <Typography variant="h1" component="h1" className="hero-name">
              <Box component="span" sx={{ color: 'text.primary' }}>
                {heroFirstName}
              </Box>
              {heroFamilyName ? (
                <Box component="span" sx={{ color: 'primary.main', ml: { xs: 1, sm: 1.5 } }}>
                  {heroFamilyName}
                </Box>
              ) : null}
            </Typography>
            <Typography
              variant="h5"
              component="h2"
              className="hero-title"
              sx={{
                color: isDark ? lightGreen : theme.palette.primary.main,
                fontWeight: 600,
              }}
              aria-label={typewriter.currentLineFull || undefined}
            >
              {typewriter.displayText}
              {typewriter.showCursor ? (
                <Box
                  component="span"
                  aria-hidden
                  className={
                    typewriter.blinkCursor
                      ? 'hero-typewriter-cursor hero-typewriter-cursor--blink'
                      : 'hero-typewriter-cursor'
                  }
                  sx={{
                    color: isDark ? mintHighlight : theme.palette.primary.dark,
                  }}
                >
                  |
                </Box>
              ) : null}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              className="hero-objective"
            >
              {t('profile.objective')}
            </Typography>
            <Box className="hero-actions">
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
                      ? `0 8px 22px ${alpha(accent, 0.24)}`
                      : `0 8px 20px ${alpha(accent, 0.2)}`,
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

          <Box className="hero-media-col">
            <motion.div style={{ y: yPhoto, width: 'min(100%, 520px)' }}>
              <Box className={reduced ? undefined : 'hero-card-float'} sx={{ width: '100%' }}>
                <Box
                  className="hero-card-shell"
                  sx={{
                    width: '100%',
                    height: 430,
                    perspective: '1200px',
                    pt: 1,
                    pb: 1,
                    pl: 1,
                    pr: 2,
                    borderRadius: 2,
                    border: `2px solid ${alpha(lightGreen, isDark ? 0.9 : 0.55)}`,
                    background: isDark
                      ? `linear-gradient(155deg, ${alpha(lightGreen, 0.12)} 0%, rgba(7, 18, 14, 0.97) 40%, rgba(4, 11, 9, 1) 100%)`
                      : `linear-gradient(155deg, ${alpha(lightGreen, 0.28)} 0%, rgba(250, 252, 251, 1) 50%)`,
                    boxShadow: isDark
                      ? `0 0 0 1px ${alpha(mintHighlight, 0.22)}, 0 0 48px ${alpha(lightGreen, 0.35)}, 0 0 112px ${alpha(mintHighlight, 0.16)}`
                      : `0 12px 38px rgba(0, 0, 0, 0.09), 0 0 40px ${alpha(lightGreen, 0.22)}`,
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
                          className="hero-photo"
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
                            sx={{ color: 'primary.light' }}
                          >
                            |
                          </Box>
                        )}
                      </Box>
                    </Box>
                  )}
                </AnimatePresence>
                </Box>
              </Box>
            </motion.div>
          </Box>
        </Box>

        {!reduced && (
          <motion.div
            className="hero-scroll-hint"
            style={{ color: theme.palette.text.secondary }}
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Typography variant="caption" className="hero-scroll-hint-text">
              {t('hero.scrollHint')}
            </Typography>
            <ArrowDownwardIcon fontSize="small" aria-hidden />
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
