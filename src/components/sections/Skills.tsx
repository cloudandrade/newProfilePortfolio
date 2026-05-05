import { Box, Button, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { skills, skillsScaleMax } from '../../data/skills'
import { Section } from '../layout/Section'
import { SkillBar } from '../ui/SkillBar'
import './Skills.css'

export function Skills() {
  const { t } = useTranslation()
  const [showMore, setShowMore] = useState(false)
  const featuredSkills = useMemo(() => skills.filter((s) => s.highlight), [])
  const extraSkills = useMemo(() => skills.filter((s) => !s.highlight), [])

  return (
    <Section
      id="skills"
      title={t('skills.title')}
      subtitle={t('skills.subtitle')}
    >
      <Box className="skills-list">
        {featuredSkills.map((s) => (
          <SkillBar
            key={s.id}
            label={t(`skills.labels.${s.id}`)}
            level={s.level}
            highlight={s.highlight}
            scaleMax={skillsScaleMax}
          />
        ))}
        {extraSkills.length > 0 && (
          <Box className="skills-more">
            <Button
              variant="outlined"
              size="medium"
              color="primary"
              className="skills-toggle-btn"
              onClick={() => setShowMore((prev) => !prev)}
            >
              {showMore ? t('skills.showLess') : t('skills.showMore')}
            </Button>
            {showMore && (
              <Box className="skills-extra-list">
                {extraSkills.map((s) => (
                  <SkillBar
                    key={s.id}
                    label={t(`skills.labels.${s.id}`)}
                    level={s.level}
                    highlight={s.highlight}
                    scaleMax={skillsScaleMax}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}
        <Typography
          variant="body2"
          color="text.secondary"
          className="skills-note"
          sx={{ borderColor: 'rgba(212, 162, 74, 0.55)' }}
        >
          {t('skills.recentHighlightNote')}
        </Typography>
      </Box>
    </Section>
  )
}
