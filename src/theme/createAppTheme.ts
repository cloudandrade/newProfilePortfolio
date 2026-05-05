import { createTheme, type PaletteMode } from '@mui/material/styles'

const accent = '#10b981'

export function createAppTheme(mode: PaletteMode) {
  const isDark = mode === 'dark'

  return createTheme({
    cssVariables: true,
    palette: {
      mode,
      primary: {
        main: accent,
        light: '#34d399',
        dark: '#059669',
        contrastText: '#050a0a',
      },
      secondary: {
        main: '#e8a598',
        contrastText: '#1a1010',
      },
      background: {
        default: isDark ? '#050a0a' : '#f4f4f6',
        paper: isDark ? 'rgba(12, 22, 19, 0.92)' : 'rgba(255, 255, 255, 0.92)',
      },
      text: {
        primary: isDark ? '#ececec' : '#16161a',
        secondary: isDark ? 'rgba(236, 236, 236, 0.68)' : 'rgba(22, 22, 26, 0.62)',
      },
      divider: isDark ? 'rgba(16, 185, 129, 0.14)' : 'rgba(0, 0, 0, 0.08)',
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 600,
        letterSpacing: '-0.03em',
        lineHeight: 1.15,
        fontSize: 'clamp(2.5rem, 3.5vw + 1.15rem, 4.25rem)',
      },
      h2: {
        fontWeight: 600,
        letterSpacing: '-0.02em',
        fontSize: 'clamp(1.875rem, 2vw + 1rem, 2.5rem)',
      },
      h3: { fontWeight: 600 },
      h4: {
        fontWeight: 600,
        letterSpacing: '-0.02em',
        fontSize: 'clamp(1.5rem, 1.8vw + 0.85rem, 2.125rem)',
      },
      h5: {
        fontWeight: 600,
        fontSize: 'clamp(1.2rem, 1vw + 0.78rem, 1.625rem)',
      },
      h6: { fontWeight: 600 },
      subtitle1: {
        fontWeight: 500,
        fontSize: 'clamp(1.06rem, 0.45vw + 0.92rem, 1.1875rem)',
      },
      body1: {
        fontSize: 'clamp(1.0625rem, 0.4vw + 0.9rem, 1.1875rem)',
        lineHeight: 1.78,
      },
      body2: {
        fontSize: 'clamp(1rem, 0.28vw + 0.88rem, 1.065rem)',
        lineHeight: 1.68,
      },
      caption: {
        fontSize: 'clamp(0.84375rem, 0.18vw + 0.74rem, 0.94375rem)',
      },
      overline: {
        fontWeight: 600,
        letterSpacing: '0.14em',
        fontSize: '0.8125rem',
      },
      button: {
        fontWeight: 600,
        letterSpacing: '0.02em',
        fontSize: '1.04rem',
      },
    },
    components: {
      MuiContainer: {
        defaultProps: {
          maxWidth: 'xl',
        },
        styleOverrides: {
          root: ({ theme }) => ({
            /** Menos “vazio” nas laterais: gutters um pouco menores que o default MUI */
            paddingLeft: theme.spacing(1.75),
            paddingRight: theme.spacing(1.75),
            [theme.breakpoints.up('sm')]: {
              paddingLeft: theme.spacing(2.25),
              paddingRight: theme.spacing(2.25),
            },
            [theme.breakpoints.up('md')]: {
              paddingLeft: theme.spacing(2.75),
              paddingRight: theme.spacing(2.75),
            },
          }),
        },
      },
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
          root: ({ theme }) => ({
            textTransform: 'none',
            borderRadius: 10,
            fontSize: theme.typography.button.fontSize,
          }),
          sizeLarge: {
            fontSize: '1.125rem',
            minHeight: 52,
            paddingLeft: '1.35rem',
            paddingRight: '1.35rem',
            paddingTop: '0.65rem',
            paddingBottom: '0.65rem',
          },
          sizeMedium: {
            fontSize: '1.0625rem',
            minHeight: 46,
            paddingInline: '1.2rem',
          },
          sizeSmall: {
            fontSize: '1rem',
            minHeight: 39,
            paddingInline: '1rem',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          sizeSmall: {
            padding: '10px',
            '& .MuiSvgIcon-root': { fontSize: '1.4rem' },
          },
          sizeMedium: {
            padding: '11px',
            '& .MuiSvgIcon-root': { fontSize: '1.55rem' },
          },
          sizeLarge: {
            padding: '13px',
            '& .MuiSvgIcon-root': { fontSize: '1.72rem' },
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: ({ theme }) => ({
            fontSize: theme.typography.body2.fontSize,
            lineHeight: theme.typography.body2.lineHeight,
          }),
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
          root: {
            fontWeight: 500,
            fontSize: '0.875rem',
          },
          sizeMedium: {
            height: 34,
          },
          sizeSmall: {
            height: 30,
            fontSize: '0.8375rem',
          },
        },
      },
    },
  })
}
