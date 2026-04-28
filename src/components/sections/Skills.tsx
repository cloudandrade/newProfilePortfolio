import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { skills, skillsScaleMax } from '../../data/skills'
import { Section } from '../layout/Section'
import { SkillBar } from '../ui/SkillBar'

export function Skills() {
  const { t } = useTranslation()

  return (
    <Section
      id="skills"
      title={t('skills.title')}
      subtitle={t('skills.subtitle')}
    >
      <Box className="max-w-xl">
        {skills.map((s) => (
          <SkillBar
            key={s.id}
            label={t(`skills.labels.${s.id}`)}
            level={s.level}
            highlight={s.highlight}
            scaleMax={skillsScaleMax}
          />
        ))}
        <Typography
          variant="body2"
          color="text.secondary"
          className="mt-6 max-w-lg border-l-2 pl-3 leading-relaxed"
          sx={{ borderColor: 'rgba(212, 162, 74, 0.55)' }}
        >
          {t('skills.recentHighlightNote')}
        </Typography>
      </Box>
    </Section>
  )
}
