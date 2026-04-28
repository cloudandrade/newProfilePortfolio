import CloseIcon from '@mui/icons-material/Close'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import {
  alpha,
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  FormControl,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Tooltip,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { profile } from '../../data/profile'
import { generateResumePdf } from '../../features/resume/generateResumePdf'
import { NAV_SECTION_IDS, useActiveNavSection } from '../../hooks/useActiveNavSection'
import { useThemeMode } from '../../theme/useThemeMode'
import './Header.css'

function scrollToHash(href: string) {
  const el = document.querySelector(href)
  el?.scrollIntoView({ behavior: 'smooth' })
}

function normalizeLang(code: string): 'en' | 'es' | 'pt' {
  if (code.startsWith('es')) return 'es'
  if (code.startsWith('pt')) return 'pt'
  return 'en'
}

export function Header() {
  const theme = useTheme()
  const isMd = useMediaQuery(theme.breakpoints.up('md'))
  const { t, i18n } = useTranslation()
  const { mode, toggleMode } = useThemeMode()
  const { active, update, setActiveFromHash } = useActiveNavSection()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [elevated, setElevated] = useState(false)

  const currentLang = normalizeLang(i18n.language || 'en')

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (href: string) => {
    setDrawerOpen(false)
    const id = href.replace(/^#/, '')
    setActiveFromHash(id)
    scrollToHash(href)
    window.setTimeout(update, 450)
  }

  const handleDownloadResume = () => {
    generateResumePdf(t)
  }

  const appBarBg = elevated
    ? alpha(theme.palette.background.default, theme.palette.mode === 'dark' ? 0.9 : 0.94)
    : 'transparent'

  const navButtonSx = (key: (typeof NAV_SECTION_IDS)[number]) => {
    const isActive = active === key
    return {
      color: isActive ? 'primary.main' : 'text.secondary',
      fontWeight: isActive ? 700 : 500,
      position: 'relative' as const,
      textTransform: 'none' as const,
      '&:hover': { color: 'text.primary' },
      '&::after': isActive
        ? {
            content: '""',
            position: 'absolute',
            left: theme.spacing(1),
            right: theme.spacing(1),
            bottom: 4,
            height: 2,
            borderRadius: 1,
            bgcolor: 'primary.main',
          }
        : undefined,
    }
  }

  const downloadControl = (
    <Tooltip title={t('resume.downloadHint')} arrow>
      <Button
        color="primary"
        variant="outlined"
        onClick={handleDownloadResume}
        startIcon={<DownloadOutlinedIcon />}
        sx={{ ml: 0.5, textTransform: 'none' }}
        aria-label={t('resume.downloadHint')}
      >
        {t('resume.downloadCta')}
      </Button>
    </Tooltip>
  )

  const controls = (
    <Box className="header-controls">
      {downloadControl}
      <IconButton
        color="inherit"
        onClick={toggleMode}
        aria-label={mode === 'dark' ? t('theme.useLight') : t('theme.useDark')}
        size="medium"
      >
        {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
      </IconButton>
    </Box>
  )

  const desktopNav = (
    <Box
      component="nav"
      className="header-desktop-nav"
      aria-label={t('a11y.mainNav')}
    >
      {NAV_SECTION_IDS.map((key) => (
        <Button
          key={key}
          color="inherit"
          onClick={() => handleNav(`#${key}`)}
          sx={navButtonSx(key)}
        >
          {t(`nav.${key}`)}
        </Button>
      ))}
      <FormControl size="small" sx={{ minWidth: 108, ml: 0.5 }}>
        <Select
          value={currentLang}
          onChange={(e) => void i18n.changeLanguage(e.target.value)}
          aria-label={t('language.label')}
          sx={{
            color: 'text.primary',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
          }}
        >
          <MenuItem value="en">{t('language.en')}</MenuItem>
          <MenuItem value="es">{t('language.es')}</MenuItem>
          <MenuItem value="pt">{t('language.pt')}</MenuItem>
        </Select>
      </FormControl>
      {controls}
    </Box>
  )

  return (
    <>
      <a className="header-skip-link" href="#main-content">
        {t('skipLink')}
      </a>
      <AppBar
        position="fixed"
        color="transparent"
        elevation={0}
        sx={{
          bgcolor: appBarBg,
          borderBottom: elevated ? `1px solid ${theme.palette.divider}` : 'none',
          transition: 'background-color 0.25s ease, border-color 0.25s ease',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters className="header-toolbar">
            <Button
              color="inherit"
              onClick={() => handleNav('#home')}
              sx={{
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: 'text.primary',
                textTransform: 'none',
              }}
            >
              {profile.name.split(' ')[0]}
              <Box
                component="span"
                sx={{ color: 'primary.main', ml: 0.5 }}
                className="header-last-name"
              >
                Andrade
              </Box>
            </Button>
            {isMd ? (
              desktopNav
            ) : (
              <Box className="header-mobile-controls">
                {controls}
                <IconButton
                  color="inherit"
                  edge="end"
                  aria-label={t('a11y.openMenu')}
                  onClick={() => setDrawerOpen(true)}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              bgcolor: 'background.paper',
              borderLeft: '1px solid',
              borderColor: 'divider',
            },
          },
        }}
      >
        <Box className="header-drawer-content" role="presentation">
          <Box className="header-drawer-close">
            <IconButton aria-label={t('a11y.closeMenu')} onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List component="nav" aria-label={t('a11y.mobileNav')}>
            <ListItemButton onClick={handleDownloadResume}>
              <ListItemText primary={t('resume.downloadCta')} secondary={t('resume.downloadHint')} />
            </ListItemButton>
            {NAV_SECTION_IDS.map((key) => (
              <ListItemButton
                key={key}
                selected={active === key}
                onClick={() => handleNav(`#${key}`)}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'action.selected',
                    borderLeft: 3,
                    borderColor: 'primary.main',
                  },
                }}
              >
                <ListItemText
                  primary={t(`nav.${key}`)}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: active === key ? 700 : 400,
                      color: active === key ? 'primary.main' : 'text.primary',
                    },
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  )
}
