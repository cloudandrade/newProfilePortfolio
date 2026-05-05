import { Box, Container, Typography, useTheme } from '@mui/material'
import type { ReactNode } from 'react'
import { AnimatedSection } from '../ui/AnimatedSection'
import './Section.css'

type Props = {
  id: string
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
  anchorTarget?: 'sectionStart' | 'title'
}

export function Section({
  id,
  title,
  subtitle,
  children,
  className,
  anchorTarget = 'sectionStart',
}: Props) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const titleGradient = isDark
    ? 'linear-gradient(90deg, #ffffff 0%, #d4d4d8 45%, #71717a 100%)'
    : 'linear-gradient(90deg, #18181b 0%, #3f3f46 55%, #71717a 100%)'
  const isTitleAnchor = anchorTarget === 'title'

  return (
    <Box
      component="section"
      id={isTitleAnchor ? undefined : id}
      className={`section-root ${isTitleAnchor ? '' : 'section-scroll-offset'} ${className ?? ''}`}
    >
      <Container>
        <AnimatedSection>
          <Typography
            variant="h4"
            component="h2"
            id={isTitleAnchor ? id : undefined}
            className={`section-title ${isTitleAnchor ? 'section-scroll-offset' : ''}`}
            sx={{ backgroundImage: titleGradient }}
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography
              variant="body1"
              color="text.secondary"
              className="section-subtitle"
            >
              {subtitle}
            </Typography>
          ) : (
            <Box className="section-subtitle-spacer" />
          )}
          {children}
        </AnimatedSection>
      </Container>
    </Box>
  )
}
