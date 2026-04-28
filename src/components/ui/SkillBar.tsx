import { Box, Typography, useTheme } from '@mui/material'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { skillsScaleMax } from '../../data/skills'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const GOLD_GRADIENT = 'linear-gradient(90deg, #e8c170, #d4a24a, #b8892e)'
const TEAL_GRADIENT = 'linear-gradient(90deg, #00f2c3, #00b896)'

type Props = {
  label: string
  level: number
  highlight?: boolean
  scaleMax?: number
}

export function SkillBar({ label, level, highlight, scaleMax = skillsScaleMax }: Props) {
  const theme = useTheme()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5% 0px' })
  const reduced = useReducedMotion()
  const pct = Math.min(100, Math.max(0, (level / scaleMax) * 100))
  const active = reduced || inView

  const trackBg =
    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'

  return (
    <Box ref={ref} className="mb-3">
      <Box className="mb-1 flex items-baseline justify-between gap-2">
        <Typography
          variant="body2"
          sx={{
            color: highlight ? '#d4a24a' : 'text.primary',
            fontWeight: highlight ? 600 : 400,
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          className="font-mono"
          sx={highlight ? { color: '#c9954d' } : undefined}
        >
          {level}/{scaleMax}
        </Typography>
      </Box>
      <Box
        className="h-1.5 w-full overflow-hidden rounded-full"
        sx={{ bgcolor: trackBg }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: highlight ? GOLD_GRADIENT : TEAL_GRADIENT,
            boxShadow: highlight ? '0 0 12px rgba(212, 162, 74, 0.35)' : undefined,
          }}
          initial={{ width: reduced ? `${pct}%` : '0%' }}
          animate={{ width: active ? `${pct}%` : '0%' }}
          transition={{ duration: reduced ? 0 : 1.05, ease: 'easeOut' }}
        />
      </Box>
    </Box>
  )
}
