import { useEffect, useRef } from 'react'

/**
 * Flutuação contínua com `translate3d`, via RAF (escapa a CSS/`animation`/Framer sobrescritos).
 */
export function useFloatingTranslate(
  enabled: boolean,
  options?: { amplitudePx?: number; periodMs?: number },
) {
  const ref = useRef<HTMLDivElement>(null)
  const amplitudePx = options?.amplitudePx ?? 20
  const periodMs = options?.periodMs ?? 5200

  useEffect(() => {
    if (!enabled) return

    const el = () => ref.current
    let rafId: number | undefined
    const started = performance.now()

    function frame(now: number) {
      const node = el()
      if (node) {
        const t = ((now - started) / periodMs) * Math.PI * 2
        const y = amplitudePx * Math.sin(t)
        node.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`
      }
      rafId = requestAnimationFrame(frame)
    }

    rafId = requestAnimationFrame(frame)

    return () => {
      if (rafId !== undefined) cancelAnimationFrame(rafId)
      const node = ref.current
      if (node) node.style.transform = ''
    }
  }, [enabled, amplitudePx, periodMs])

  return ref
}
