import { useEffect, useMemo, useState } from 'react'

type Phase = 'typing' | 'holding' | 'deleting'

export type HeroTypewriterOptions = {
  reducedMotion: boolean
  typeIntervalMs?: number
  holdMs?: number
  deleteIntervalMs?: number
}

/** Ciclo: digita → pausa com cursor piscando → apaga dígito a dígito → próximo título. */
export function useHeroRotatingTypewriter(
  linesRaw: unknown,
  options: HeroTypewriterOptions,
) {
  const lines = useMemo(() => {
    const arr = Array.isArray(linesRaw) ? linesRaw : []
    return arr.filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
  }, [linesRaw])

  const linesKey = useMemo(() => lines.join('\u0001'), [lines])

  const [lineIndex, setLineIndex] = useState(0)
  const [len, setLen] = useState(0)
  const [phase, setPhase] = useState<Phase>('typing')

  const safeIndex = lines.length ? lineIndex % lines.length : 0
  const full = lines[safeIndex] ?? ''

  useEffect(() => {
    setLineIndex(0)
    setLen(0)
    setPhase('typing')
  }, [linesKey])

  useEffect(() => {
    if (options.reducedMotion || lines.length === 0) return

    let id: ReturnType<typeof setTimeout>
    const typeMs = options.typeIntervalMs ?? 52
    const holdMs = options.holdMs ?? 2800
    const deleteMs = options.deleteIntervalMs ?? 42

    if (phase === 'typing') {
      if (len < full.length) {
        id = window.setTimeout(() => setLen((n) => n + 1), typeMs)
      } else if (full.length > 0) {
        id = window.setTimeout(() => setPhase('holding'), 0)
      }
    } else if (phase === 'holding') {
      id = window.setTimeout(() => setPhase('deleting'), holdMs)
    } else if (phase === 'deleting') {
      if (len > 0) {
        id = window.setTimeout(() => setLen((n) => n - 1), deleteMs)
      } else {
        id = window.setTimeout(() => {
          setLineIndex((i) => (lines.length ? (i + 1) % lines.length : 0))
          setPhase('typing')
        }, 0)
      }
    }

    return () => window.clearTimeout(id)
  }, [
    phase,
    len,
    full,
    full.length,
    lines.length,
    options.reducedMotion,
    options.typeIntervalMs,
    options.holdMs,
    options.deleteIntervalMs,
  ])

  const displayText =
    options.reducedMotion || lines.length === 0 ? (lines[0] ?? '') : full.slice(0, len)

  const blinkCursor = !options.reducedMotion && phase === 'holding'
  const showCursor = !options.reducedMotion && lines.length > 0

  return {
    displayText,
    blinkCursor,
    showCursor,
    /** Texto completo da linha atual (para aria-label, sem ruído no leitor de tela). */
    currentLineFull: full,
  }
}
