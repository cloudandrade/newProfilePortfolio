import { alpha, Box, useTheme } from '@mui/material'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { Experience } from './components/sections/Experience'
import { Hero } from './components/sections/Hero'
import { Projects } from './components/sections/Projects'
import { Skills } from './components/sections/Skills'

export default function App() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const accent = theme.palette.primary.main
  const pageSx = isDark
    ? {
        bgcolor: '#050a0a',
        backgroundImage: [
          `radial-gradient(ellipse 92% 58% at 80% 22%, ${alpha(accent, 0.26)}, transparent 58%)`,
          `radial-gradient(ellipse 52% 50% at 14% 40%, ${alpha(accent, 0.13)}, transparent 52%)`,
          `linear-gradient(${alpha(accent, 0.065)} 1px, transparent 1px)`,
          `linear-gradient(90deg, ${alpha(accent, 0.065)} 1px, transparent 1px)`,
        ].join(', '),
        backgroundSize: '100% 100%, 100% 100%, 48px 48px, 48px 48px',
        backgroundRepeat: 'no-repeat, no-repeat, repeat, repeat',
      }
    : { bgcolor: 'background.default' }

  return (
    <Box className="min-h-screen" sx={pageSx}>
      <Header />
      <Box component="main" id="main-content" tabIndex={-1}>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
      </Box>
      <Footer />
    </Box>
  )
}
