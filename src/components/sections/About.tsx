import { alpha, Box, Chip, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Section } from '../layout/Section'
import './About.css'

export function About() {
  const theme = useTheme()
  const { t } = useTranslation()
  const specs = t('profile.specializations', { returnObjects: true }) as string[]

  return (
    <Section
      id="about"
      title={t('about.title')}
      subtitle={t('about.subtitle')}
    >
      <Typography
        variant="body1"
        color="text.secondary"
        className="about-intro"
      >
        {t('about.intro')}
      </Typography>
      <Typography
        variant="body1"
        color="text.primary"
        className="about-objective"
        sx={{ borderColor: 'primary.main' }}
      >
        {t('profile.objective')}
      </Typography>
      <Typography variant="subtitle1" className="about-specializations-title">
        {t('about.specializationsTitle')}
      </Typography>
      <Box className="about-specializations-list">
        {(Array.isArray(specs) ? specs : []).map((s) => (
          <Chip
            key={s}
            label={s}
            variant="outlined"
            color="primary"
            sx={{ borderColor: alpha(theme.palette.primary.main, 0.35) }}
          />
        ))}
      </Box>
    </Section>
  )
}
