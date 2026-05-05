import { alpha, Box, Button, Typography, useTheme } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { educationOrder } from '../../data/educationOrder'
import { experienceOrder, getExperienceMeta } from '../../data/experienceMeta'
import { Section } from '../layout/Section'
import { ClientsCarousel } from './ClientsCarousel'
import './Experience.css'

export function Experience() {
  const theme = useTheme()
  const accent = theme.palette.primary.main
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)
  const workScrollRef = useRef<HTMLDivElement | null>(null)
  const workItemRefs = useRef<(HTMLDivElement | null)[]>([])
  const featuredEducationId = 'formacao-eng-software-alura'
  const highlightedEducationId = 'pos-arquitetura'
  const compactEducationIds = educationOrder.filter(
    (id) => id !== featuredEducationId && id !== highlightedEducationId,
  )

  const scrollToIndex = (index: number) => {
    const container = workScrollRef.current
    const item = workItemRefs.current[index]
    if (!container || !item) return

    const targetTop = item.offsetTop - container.clientHeight / 2 + item.clientHeight / 2
    container.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' })
  }

  useEffect(() => {
    const container = workScrollRef.current
    if (!container) return

    const updateActiveFromScroll = () => {
      const maxScrollable = container.scrollHeight - container.clientHeight
      if (maxScrollable <= 0) {
        setActiveIndex(0)
        return
      }

      const progress = container.scrollTop / maxScrollable
      const mappedIndex = Math.round(progress * (experienceOrder.length - 1))
      const safeIndex = Math.max(0, Math.min(experienceOrder.length - 1, mappedIndex))
      setActiveIndex(safeIndex)
    }

    updateActiveFromScroll()
    container.addEventListener('scroll', updateActiveFromScroll, { passive: true })
    window.addEventListener('resize', updateActiveFromScroll)
    return () => {
      container.removeEventListener('scroll', updateActiveFromScroll)
      window.removeEventListener('resize', updateActiveFromScroll)
    }
  }, [])

  return (
    <Section
      id="experience"
      anchorTarget="title"
      title={t('experience.title')}
      subtitle={t('experience.subtitle')}
    >
      <Typography variant="h6" className="experience-work-title">
        {t('experience.work')}
      </Typography>
      <Box
        sx={{
          width: '100%',
          maxWidth: 'min(1480px, calc(100vw - 36px))',
        }}
      >
        <Box className="experience-actions">
          <Button variant="outlined" color="primary" onClick={() => scrollToIndex(0)}>
            {t('experience.scrollToStart')}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => scrollToIndex(experienceOrder.length - 1)}
          >
            {t('experience.scrollToEnd')}
          </Button>
        </Box>

        <Box className="experience-content">
          <Box className="experience-track-shell" aria-hidden>
            <Box
              sx={{
                position: 'absolute',
                left: 11,
                top: 8,
                bottom: 8,
                width: 1,
                bgcolor: 'divider',
              }}
            />
            <Box className="experience-track">
              {experienceOrder.map((id, index) => {
                const isActive = index === activeIndex
                return (
                  <Box
                    key={`track-${id}`}
                    component="button"
                    onClick={() => scrollToIndex(index)}
                    sx={{
                      width: isActive ? 14 : 10,
                      height: isActive ? 14 : 10,
                      borderRadius: '999px',
                      border: 0,
                      cursor: 'pointer',
                      bgcolor: isActive ? 'primary.main' : 'background.default',
                      boxShadow: isActive
                        ? `0 0 0 2px ${alpha(accent, 0.65)}`
                        : `0 0 0 2px ${alpha(accent, 0.25)}`,
                      transition: 'all 220ms ease',
                    }}
                  />
                )
              })}
            </Box>
          </Box>

          <Box
            ref={workScrollRef}
            className="experience-scroll"
            sx={{
              maxHeight: 560,
              scrollBehavior: 'smooth',
              overflowX: 'hidden',
              width: '100%',
            }}
          >
            {experienceOrder.map((id, index) => {
              const meta = getExperienceMeta(id)
              const highlights = t(`experience.items.${id}.highlights`, { returnObjects: true })
              const list = Array.isArray(highlights) ? (highlights as string[]) : []
              const distance = Math.abs(index - activeIndex)
              const opacity = Math.max(0.3, 1 - distance * 0.24)
              const isActive = distance === 0
              const cardWidth = isActive ? '85%' : '70%'

              return (
                <Box
                  key={id}
                  ref={(el: HTMLDivElement | null) => {
                    workItemRefs.current[index] = el
                  }}
                  sx={{
                    pb: 4,
                    opacity,
                    transition: 'opacity 280ms ease, filter 280ms ease',
                    filter: isActive ? 'none' : 'saturate(0.88)',
                    px: 0.5,
                  }}
                >
                  <Box
                    className="experience-card"
                    sx={{
                      width: cardWidth,
                      ml: 1,
                      bgcolor: 'rgba(12, 16, 27, 0.92)',
                      borderColor: isActive ? alpha(accent, 0.58) : alpha(accent, 0.28),
                      boxShadow: isActive
                        ? `0 0 0 1px ${alpha(accent, 0.2)}, 0 16px 34px ${alpha(accent, 0.08)}`
                        : `0 0 0 1px ${alpha(accent, 0.08)}`,
                      transition: 'width 320ms ease, border-color 280ms ease, box-shadow 280ms ease',
                      '& .exp-period': {
                        fontSize: isActive ? 'calc(0.75rem + 8px)' : '0.8rem',
                      },
                      '& .exp-role': {
                        fontSize: isActive ? 'calc(1.25rem + 8px)' : '1.3rem',
                      },
                      '& .exp-company': {
                        fontSize: isActive ? 'calc(0.875rem + 8px)' : '0.9375rem',
                      },
                      '& .exp-highlight': {
                        fontSize: isActive ? 'calc(0.875rem + 8px)' : '0.9375rem',
                      },
                    }}
                  >
                    <Box className="experience-card-header">
                      {meta?.employerLogoSrc && (
                        <Box
                          component="img"
                          src={meta.employerLogoSrc}
                          alt=""
                          className="experience-logo"
                        />
                      )}
                      <Box>
                        <Typography
                          variant="overline"
                          color="primary"
                          className="exp-period experience-period"
                        >
                          {t(`experience.items.${id}.period`)}
                        </Typography>
                        <Typography variant="h6" component="h3" className="exp-role experience-role">
                          {t(`experience.items.${id}.role`)}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          className="exp-company experience-company"
                        >
                          {t(`experience.items.${id}.company`)}
                        </Typography>
                      </Box>
                    </Box>

                    {list.length > 0 && (
                      <Box component="ul" className="experience-highlights">
                        {list.map((h) => (
                          <Box
                            component="li"
                            key={h}
                            className="exp-highlight experience-highlight"
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
            })}
          </Box>
        </Box>
      </Box>

      <ClientsCarousel />

      <Typography variant="h6" className="experience-education-title">
        {t('experience.education')}
      </Typography>
      <Box className="experience-education-layout">
        <Box
          className="experience-education-card experience-education-card-featured"
          sx={{ bgcolor: 'background.paper', borderColor: 'divider' }}
        >
          <Typography variant="overline" color="primary" className="experience-education-period">
            {t(`education.items.${featuredEducationId}.period`)}
          </Typography>
          <Typography variant="h6" component="h3" className="experience-education-title-item">
            {t(`education.items.${featuredEducationId}.title`)}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" className="experience-education-institution">
            {t(`education.items.${featuredEducationId}.institution`)}
          </Typography>
          <Box component="ul" className="experience-education-details" sx={{ color: 'text.secondary' }}>
            {(
              t(`education.items.${featuredEducationId}.details`, {
                returnObjects: true,
              }) as string[]
            ).map((d) => (
              <li key={d}>{d}</li>
            ))}
          </Box>
        </Box>

        <Box className="experience-education-side">
          <Box
            className="experience-education-card experience-education-card-highlighted"
            sx={{ bgcolor: 'background.paper', borderColor: 'divider' }}
          >
            <Typography variant="overline" color="primary" className="experience-education-period">
              {t(`education.items.${highlightedEducationId}.period`)}
            </Typography>
            <Typography variant="h6" component="h3" className="experience-education-title-item">
              {t(`education.items.${highlightedEducationId}.title`)}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" className="experience-education-institution">
              {t(`education.items.${highlightedEducationId}.institution`)}
            </Typography>
            <Box component="ul" className="experience-education-details" sx={{ color: 'text.secondary' }}>
              {(
                t(`education.items.${highlightedEducationId}.details`, {
                  returnObjects: true,
                }) as string[]
              ).map((d) => (
                <li key={d}>{d}</li>
              ))}
            </Box>
          </Box>

          <Box className="experience-education-compact-group">
            {compactEducationIds.map((edId) => {
              const details = t(`education.items.${edId}.details`, { returnObjects: true })
              const detailList = Array.isArray(details) ? (details as string[]) : []

              return (
                <Box
                  key={edId}
                  className="experience-education-card experience-education-card-compact"
                  sx={{ bgcolor: 'background.paper', borderColor: 'divider' }}
                >
                  <Typography variant="overline" color="primary" className="experience-education-period">
                    {t(`education.items.${edId}.period`)}
                  </Typography>
                  <Typography variant="h6" component="h3" className="experience-education-title-item">
                    {t(`education.items.${edId}.title`)}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    className="experience-education-institution"
                  >
                    {t(`education.items.${edId}.institution`)}
                  </Typography>
                  {detailList.length > 0 && (
                    <Box
                      component="ul"
                      className="experience-education-details"
                      sx={{ color: 'text.secondary' }}
                    >
                      {detailList.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </Box>
                  )}
                </Box>
              )
            })}
          </Box>
        </Box>
      </Box>
    </Section>
  )
}
