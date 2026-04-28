import { createTheme, type PaletteMode } from '@mui/material/styles'

const accent = '#00f2c3'

export function createAppTheme(mode: PaletteMode) {
  const isDark = mode === 'dark'

  return createTheme({
    cssVariables: true,
    palette: {
      mode,
      primary: {
        main: accent,
        contrastText: '#0a0a0b',
      },
      secondary: {
        main: '#e8a598',
        contrastText: '#1a1010',
      },
      background: {
        default: isDark ? '#121214' : '#f4f4f6',
        paper: isDark ? 'rgba(26, 26, 31, 0.92)' : 'rgba(255, 255, 255, 0.92)',
      },
      text: {
        primary: isDark ? '#ececec' : '#16161a',
        secondary: isDark ? 'rgba(236, 236, 236, 0.68)' : 'rgba(22, 22, 26, 0.62)',
      },
      divider: isDark ? 'rgba(0, 242, 195, 0.12)' : 'rgba(0, 0, 0, 0.08)',
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 600,
        letterSpacing: '-0.03em',
        lineHeight: 1.15,
      },
      h2: { fontWeight: 600, letterSpacing: '-0.02em' },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: {
        fontWeight: 600,
        letterSpacing: '0.02em',
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backdropFilter: 'blur(12px)',
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 10,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: isDark
              ? '1px solid rgba(255, 255, 255, 0.06)'
              : '1px solid rgba(0, 0, 0, 0.08)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 500 },
        },
      },
    },
  })
}
