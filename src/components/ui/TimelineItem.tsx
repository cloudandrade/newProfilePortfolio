import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { getExperienceMeta } from '../../data/experienceMeta'

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
    <Box className="relative flex gap-4 md:gap-6">
      <Box className="flex flex-col items-center">
        <Box
          component="span"
          className="mt-1 size-3 shrink-0 rounded-full ring-2 ring-[#00f2c3]/80"
          sx={{ bgcolor: 'background.default' }}
        />
        {!isLast && (
          <Box
            className="my-2 min-h-[24px] w-px flex-1"
            sx={{ bgcolor: 'divider' }}
          />
        )}
      </Box>
      <Box className="flex-1 pb-10">
        <Box className="mb-3 flex flex-wrap items-center gap-3">
          {meta?.employerLogoSrc && (
            <Box
              component="img"
              src={meta.employerLogoSrc}
              alt=""
              className="h-8 max-w-[140px] object-contain object-left"
            />
          )}
          <Box>
            <Typography
              variant="overline"
              color="primary"
              className="font-mono tracking-wider"
            >
              {period}
            </Typography>
            <Typography variant="h6" component="h3" className="mt-0.5">
              {role}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {company}
            </Typography>
          </Box>
        </Box>

        {list.length > 0 && (
          <Box component="ul" className="m-0 list-none space-y-2 p-0">
            {list.map((h) => (
              <Box
                component="li"
                key={h}
                className="relative pl-4 text-sm leading-relaxed before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-[#00f2c3]/60 before:content-['']"
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
