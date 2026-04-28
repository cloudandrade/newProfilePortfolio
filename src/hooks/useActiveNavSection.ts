import { useCallback, useEffect, useState } from 'react'

export const NAV_SECTION_IDS = [
  'home',
  'about',
  'experience',
  'skills',
  'projects',
  'contact',
] as const

export type NavSectionId = (typeof NAV_SECTION_IDS)[number]

function getScrollAnchorY(): number {
  return 88
}

function resolveActiveSection(): NavSectionId {
  const y = window.scrollY + getScrollAnchorY()
  let current: NavSectionId = 'home'

  for (const id of NAV_SECTION_IDS) {
    const el = document.getElementById(id)
    if (!el) continue
    const top = el.getBoundingClientRect().top + window.scrollY
    if (top <= y) current = id
  }

  return current
}

export function useActiveNavSection() {
  const [active, setActive] = useState<NavSectionId>('home')

  useEffect(() => {
    let raf = 0
    const tick = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        setActive(resolveActiveSection())
      })
    }
    tick()
    window.addEventListener('scroll', tick, { passive: true })
    window.addEventListener('resize', tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', tick)
      window.removeEventListener('resize', tick)
    }
  }, [])

  const setActiveFromHash = useCallback((id: string) => {
    if (NAV_SECTION_IDS.includes(id as NavSectionId)) {
      setActive(id as NavSectionId)
    }
  }, [])

  const update = useCallback(() => {
    requestAnimationFrame(() => {
      setActive(resolveActiveSection())
    })
  }, [])

  return { active, update, setActiveFromHash }
}
