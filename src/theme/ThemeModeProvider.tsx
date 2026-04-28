import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { createAppTheme } from './createAppTheme'
import { ThemeModeContext } from './themeModeContext'

const STORAGE_KEY = 'portfolio-theme'

function readStoredMode(): 'light' | 'dark' {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'light' || v === 'dark') return v
  } catch {
    /* ignore */
  }
  return 'dark'
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<'light' | 'dark'>(() =>
    typeof window !== 'undefined' ? readStoredMode() : 'dark',
  )

  const setMode = useCallback((next: 'light' | 'dark') => {
    setModeState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  const toggleMode = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark')
  }, [mode, setMode])

  const theme = useMemo(() => createAppTheme(mode), [mode])

  const value = useMemo(
    () => ({ mode, setMode, toggleMode }),
    [mode, setMode, toggleMode],
  )

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  )
}
