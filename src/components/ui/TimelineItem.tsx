import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { getExperienceMeta } from '../../data/experienceMeta'
import './TimelineItem.css'

type Props = {
  id: string
  isLast: boolean
}

export function TimelineItem({ id, isLast }: Props) {
  const { t } = useTranslation()
  const meta = getExperienceMeta(id)
  const highlights = t(`experience.items.${id}.highlights`, { returnObjects: true })
  const list = Array.isArray(highlights) ? (highlights as string[]) : []

  const role = t(`experience.items.${id}.role`)
  const company = t(`experience.items.${id}.company`)
  const period = t(`experience.items.${id}.period`)

  return (
    <Box className="timeline-item-root">
      <Box className="timeline-item-track">
        <Box
          component="span"
          className="timeline-item-dot"
          sx={{ bgcolor: 'background.default' }}
        />
        {!isLast && (
          <Box
            className="timeline-item-line"
            sx={{ bgcolor: 'divider' }}
          />
        )}
      </Box>
      <Box className="timeline-item-content">
        <Box className="timeline-item-header">
          {meta?.employerLogoSrc && (
            <Box
              component="img"
              src={meta.employerLogoSrc}
              alt=""
              className="timeline-item-logo"
            />
          )}
          <Box>
            <Typography
              variant="overline"
              color="primary"
              className="timeline-item-period"
            >
              {period}
            </Typography>
            <Typography variant="h6" component="h3" className="timeline-item-role">
              {role}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {company}
            </Typography>
          </Box>
        </Box>

        {list.length > 0 && (
          <Box component="ul" className="timeline-item-highlights">
            {list.map((h) => (
              <Box
                component="li"
                key={h}
                className="timeline-item-highlight"
                sx={{ color: 'text.secondary' }}
              >
                {h}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}
