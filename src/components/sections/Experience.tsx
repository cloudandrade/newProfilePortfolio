import { Box, Button, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { educationOrder } from '../../data/educationOrder'
import { experienceOrder, getExperienceMeta } from '../../data/experienceMeta'
import { Section } from '../layout/Section'
import { ClientsCarousel } from './ClientsCarousel'

export function Experience() {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)
  const workScrollRef = useRef<HTMLDivElement | null>(null)
  const workItemRefs = useRef<(HTMLDivElement | null)[]>([])

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
      <Typography variant="h6" className="mb-6 font-semibold">
        {t('experience.work')}
      </Typography>
      <Box
        sx={{
          width: '100%',
          maxWidth: 'min(1240px, calc(100vw - 56px))',
        }}
      >
        <Box className="mb-4 flex flex-wrap gap-2">
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

        <Box className="relative flex gap-4 md:gap-6">
          <Box className="relative hidden w-7 md:block" aria-hidden>
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
            <Box className="relative z-[1] flex h-full flex-col items-center justify-between py-2">
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
                      bgcolor: isActive ? '#00f2c3' : 'background.default',
                      boxShadow: isActive ? '0 0 0 2px rgba(0,242,195,0.65)' : '0 0 0 2px rgba(0,242,195,0.25)',
                      transition: 'all 220ms ease',
                    }}
                  />
                )
              })}
            </Box>
          </Box>

          <Box
            ref={workScrollRef}
            className="flex-1 overflow-y-auto px-3"
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
                    className="rounded-2xl border px-5 py-5"
                    sx={{
                      width: cardWidth,
                      ml: 1,
                      bgcolor: 'rgba(12, 16, 27, 0.92)',
                      borderColor: isActive ? 'rgba(0, 242, 195, 0.58)' : 'rgba(0, 242, 195, 0.28)',
                      boxShadow: isActive
                        ? '0 0 0 1px rgba(0, 242, 195, 0.2), 0 16px 34px rgba(0, 242, 195, 0.08)'
                        : '0 0 0 1px rgba(0, 242, 195, 0.08)',
                      transition: 'width 320ms ease, border-color 280ms ease, box-shadow 280ms ease',
                      '& .exp-period': {
                        fontSize: isActive ? 'calc(0.75rem + 6px)' : '0.75rem',
                      },
                      '& .exp-role': {
                        fontSize: isActive ? 'calc(1.25rem + 6px)' : '1.25rem',
                      },
                      '& .exp-company': {
                        fontSize: isActive ? 'calc(0.875rem + 6px)' : '0.875rem',
                      },
                      '& .exp-highlight': {
                        fontSize: isActive ? 'calc(0.875rem + 6px)' : '0.875rem',
                      },
                    }}
                  >
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
                          className="exp-period font-mono tracking-wider"
                        >
                          {t(`experience.items.${id}.period`)}
                        </Typography>
                        <Typography variant="h6" component="h3" className="exp-role mt-0.5">
                          {t(`experience.items.${id}.role`)}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary" className="exp-company">
                          {t(`experience.items.${id}.company`)}
                        </Typography>
                      </Box>
                    </Box>

                    {list.length > 0 && (
                      <Box component="ul" className="m-0 list-none space-y-2 p-0">
                        {list.map((h) => (
                          <Box
                            component="li"
                            key={h}
                            className="exp-highlight relative pl-4 text-sm leading-relaxed before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-[#00f2c3]/60 before:content-['']"
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

      <Typography variant="h6" className="mb-6 mt-16 font-semibold">
        {t('experience.education')}
      </Typography>
      <Box className="grid max-w-4xl gap-5 md:grid-cols-2">
        {educationOrder.map((edId) => {
          const details = t(`education.items.${edId}.details`, { returnObjects: true })
          const detailList = Array.isArray(details) ? (details as string[]) : []

          return (
            <Box
              key={edId}
              className="rounded-xl border p-5 transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgba(0,242,195,0.15)]"
              sx={{
                bgcolor: 'background.paper',
                borderColor: 'divider',
              }}
            >
              <Typography variant="overline" color="primary" className="font-mono">
                {t(`education.items.${edId}.period`)}
              </Typography>
              <Typography variant="h6" component="h3" className="mt-1 text-lg">
                {t(`education.items.${edId}.title`)}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" className="mb-2">
                {t(`education.items.${edId}.institution`)}
              </Typography>
              {detailList.length > 0 && (
                <Box
                  component="ul"
                  className="m-0 list-disc space-y-1 pl-5 text-sm"
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
    </Section>
  )
}
