import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import {
  alpha,
  Box,
  Button,
  Container,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import type { SxProps } from '@mui/material/styles'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { profile } from '../../data/profile'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import './Hero.css'

function mapNameLetters(str: string, keyPrefix: string) {
  return str.split('').map((ch, idx) => (
    <Box
      component="span"
      key={`${keyPrefix}-${idx}`}
      className="hero-name-letter"
      sx={{
        display: 'inline-block',
        position: 'relative',
        verticalAlign: 'baseline',
        cursor: 'default',
        transformOrigin: '50% 82%',
        /** Emotion sobrescreve estilos do Typography no span (hover em arquivo CSS ficava perdendo na cascade) */
        transition: 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
          '&:hover': { transform: 'none' },
        },
        '@media (prefers-reduced-motion: no-preference)': {
          '&:hover': {
            transform: 'scale(2) !important',
            zIndex: 2,
          },
        },
      }}
    >
      {ch}
    </Box>
  ))
}

const HERO_MEDIA_BADGES: { label: string; sx: SxProps }[] = [
  { label: 'React', sx: { top: 14, left: { xs: 4, md: -20 } } },
  {
    label: 'TS',
    sx: {
      top: '33%',
      right: { xs: -14, md: -20 },
      transform: 'translateY(-50%)',
    },
  },
  { label: 'Node', sx: { bottom: 36, left: { xs: 0, md: -26 } } },
  { label: 'Python', sx: { bottom: -18, right: { xs: '8%', md: 36 } } },
]

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

  const ROLES = useMemo(() => {
    const raw = t('hero.rotatingSubtitles', { returnObjects: true })
    return Array.isArray(raw) ? [...(raw as string[])] : []
  }, [t, i18n.language])

  const useTyping = () => {
    const [text, setText] = useState("");
    const [i, setI] = useState(0);
    const [del, setDel] = useState(false);
  
    useEffect(() => {
      const word = ROLES[i % ROLES.length];
      const speed = del ? 40 : 80;
      const t = setTimeout(() => {
        const next = del ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1);
        setText(next);
        if (!del && next === word) setTimeout(() => setDel(true), 1400);
        else if (del && next === "") {
          setDel(false);
          setI((v) => v + 1);
        }
      }, speed);
      return () => clearTimeout(t);
    }, [text, del, i]);
  
    return text;
  };

  const rotatingRoles = useTyping()

  const mintHighlight = '#6ee7b7'
  const lightGreen = theme.palette.primary.light

  const ctaShapeSx = {
    borderRadius: 1.5,
    minHeight: 52,
    px: 4,
    py: 1.25,
    fontSize: '1.08rem',
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

      <Container className="hero-container">
        <Box className="hero-grid">
          <Box className="hero-content-col">
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: { xs: 1.25, md: 1.5 },
                width: '100%',
                mb: { xs: 0.75, md: 1 },
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 999,
                  border: `1px solid ${alpha(accent, 0.32)}`,
                  bgcolor: alpha(accent, isDark ? 0.06 : 0.08),
                  flexShrink: 0,
                  maxWidth: '100%',
                }}
                role="status"
              >
                <Box
                  className={reduced ? undefined : 'hero-badge-pulse'}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    flexShrink: 0,
                    bgcolor: 'primary.main',
                  }}
                  aria-hidden
                />
                <Typography
                  variant="caption"
                  component="span"
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.04em',
                    fontWeight: 600,
                    color: 'text.primary',
                  }}
                >
                  {t('hero.availabilityBadge')}
                </Typography>
              </Box>
              <Typography
                variant="overline"
                component="p"
                className="hero-eyebrow"
                sx={{
                  margin: 0,
                  padding: 0,
                  width: '100%',
                  display: 'block',
                  color: 'primary.main',
                }}
              >
                {t('hero.eyebrow')}
              </Typography>
            </Box>
            <Typography
              variant="h1"
              component="h1"
              className="hero-name"
              aria-label={profile.name}
              sx={{ overflow: 'visible', isolation: 'isolate' }}
            >
              <Box component="span" sx={{ color: 'text.primary' }}>
                {mapNameLetters(heroFirstName, 'first')}
              </Box>
              {heroFamilyName ? (
                <Box
                  component="span"
                  sx={{ color: 'primary.main', ml: { xs: 1, sm: 1.5 } }}
                >
                  {mapNameLetters(heroFamilyName, 'last')}
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
                '& span, &::after': { color: 'inherit' },
              }}
            >
              <Box component="span" sx={{ color: 'inherit' }}>
                {rotatingRoles}
              </Box>
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
                  endIcon={<ArrowForwardIcon sx={{ fontSize: 22 }} />}
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

            <Box
              sx={{
                mt: { xs: 2, md: 2.25 },
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, md: 1.25 },
                color: 'text.secondary',
              }}
              aria-label="Social links"
              component="nav"
            >
              {profile.githubUrl ? (
                <Tooltip title={t('hero.social.github')}>
                  <IconButton
                    href={profile.githubUrl}
                    component="a"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="inherit"
                    size="medium"
                    aria-label={t('hero.social.github')}
                  >
                    <GitHubIcon />
                  </IconButton>
                </Tooltip>
              ) : null}
              <Tooltip title={t('hero.social.linkedin')}>
                <IconButton
                  href={profile.linkedinUrl}
                  component="a"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  size="medium"
                  aria-label={t('hero.social.linkedin')}
                >
                  <LinkedInIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('hero.social.email')}>
                <IconButton
                  href={profile.emailHref}
                  component="a"
                  color="inherit"
                  size="medium"
                  aria-label={t('hero.social.email')}
                >
                  <EmailOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box className="hero-media-col" sx={{ position: 'relative' }}>
            <Box sx={{ position: 'relative', zIndex: 1, mx: 'auto', width: 'min(100%, 520px)' }}>
              <Box
                aria-hidden
                sx={{
                  position: 'absolute',
                  inset: { xs: -16, md: -24 },
                  zIndex: 0,
                  borderRadius: '2rem',
                  pointerEvents: 'none',
                  opacity: showCodeSide ? 0.45 : 1,
                  transition: 'opacity 0.4s ease',
                  background: `linear-gradient(145deg, ${alpha(accent, 0.42)} 0%, ${alpha(accent, 0.1)} 48%, transparent 100%)`,
                  filter: 'blur(38px)',
                }}
              />
              <motion.div style={{ position: 'relative', zIndex: 1, y: yPhoto, width: '100%' }}>
              <Box
                className={reduced ? undefined : 'hero-media-float'}
                sx={{ position: 'relative', width: '100%' }}
              >
                <Box
                  className="hero-card-shell"
                  sx={{
                    width: '100%',
                    height: 458,
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
                          p: 3,
                          overflow: 'hidden',
                          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                          color: '#b7ffd8',
                          fontSize: '0.9375rem',
                          lineHeight: 1.65,
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

              {!showCodeSide &&
                HERO_MEDIA_BADGES.map((b) => (
                  <Box
                    key={b.label}
                    component="span"
                    aria-hidden
                    sx={{
                      ...b.sx,
                      position: 'absolute',
                      zIndex: 3,
                      px: 1.4,
                      py: 0.72,
                      borderRadius: 999,
                      border: `1px solid ${alpha(accent, 0.42)}`,
                      bgcolor: alpha(isDark ? '#070f0d' : '#ffffff', isDark ? 0.94 : 0.88),
                      backdropFilter: 'blur(12px)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: mintHighlight,
                      boxShadow: isDark ? '0 6px 24px rgba(0, 0, 0, 0.42)' : '0 6px 20px rgba(0, 0, 0, 0.1)',
                      pointerEvents: 'none',
                    }}
                  >
                    {b.label}
                  </Box>
                ))}
              </Box>
              </motion.div>
            </Box>
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
            <ArrowDownwardIcon fontSize="medium" aria-hidden />
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
