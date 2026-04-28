import { createContext } from 'react'
import type { PaletteMode } from '@mui/material/styles'

export type ThemeModeContextValue = {
  mode: PaletteMode
  toggleMode: () => void
  setMode: (mode: PaletteMode) => void
}

export const ThemeModeContext = createContext<ThemeModeContextValue | null>(null)
