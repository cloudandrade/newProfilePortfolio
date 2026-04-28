import { Box, Chip, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Section } from '../layout/Section'

export function About() {
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
        className="mb-8 max-w-3xl leading-relaxed"
      >
        {t('about.intro')}
      </Typography>
      <Typography
        variant="body1"
        color="text.primary"
        className="mb-10 max-w-3xl border-l-2 pl-4 leading-relaxed"
        sx={{ borderColor: 'primary.main' }}
      >
        {t('profile.objective')}
      </Typography>
      <Typography variant="subtitle1" className="mb-4 font-semibold">
        {t('about.specializationsTitle')}
      </Typography>
      <Box className="flex flex-wrap gap-2">
        {(Array.isArray(specs) ? specs : []).map((s) => (
          <Chip
            key={s}
            label={s}
            variant="outlined"
            color="primary"
            sx={{ borderColor: 'rgba(0, 242, 195, 0.35)' }}
          />
        ))}
      </Box>
    </Section>
  )
}
