import { useEffect, useMemo, useRef, useState } from 'react'

/** Mesmos tempos do exemplo: `del ? 40 : 80` e pausa `1400` após completar a palavra. */
const TYPE_MS = 80
const DELETE_MS = 40
const PAUSE_MS = 1400

export type HeroTypingOptions = {
  reducedMotion: boolean
}

/**
 * Lógica equivalente ao hook Lovable:
 *
 * ```
 * const word = ROLES[i % ROLES.length];
 * const speed = del ? 40 : 80;
 * setText(del ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
 * if (!del && next === word) espera 1400 → setDel(true);
 * else if (del && next === "") setDel(false); setI(v => v + 1);
 * ```
 *
 * `ROLES` vem das traduções (`hero.rotatingSubtitles`).
 * Mantemos um ref no array para não depender de referência nova a cada render do i18n.
 * A pausa com `text === word` está num ramo próprio para não reaplicar timeouts a cada 80 ms (bug do exemplo original).
 */
export function useHeroRotatingTypewriter(
  rotatingSubtitles: unknown,
  options: HeroTypingOptions,
) {
  const ROLES = useMemo(() => {
    const arr = Array.isArray(rotatingSubtitles) ? rotatingSubtitles : []
    return arr.filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
  }, [rotatingSubtitles])

  const linesKey = useMemo(() => ROLES.join('\u0001'), [ROLES])

  const rolesRef = useRef(ROLES)
  rolesRef.current = ROLES

  const [text, setText] = useState('')
  const [i, setI] = useState(0)
  const [del, setDel] = useState(false)

  useEffect(() => {
    setText('')
    setI(0)
    setDel(false)
  }, [linesKey])

  useEffect(() => {
    if (options.reducedMotion || rolesRef.current.length === 0) return

    const word = rolesRef.current[i % rolesRef.current.length]

    if (!del && text === word && word.length > 0) {
      const tPause = window.setTimeout(() => setDel(true), PAUSE_MS)
      return () => window.clearTimeout(tPause)
    }

    const speed = del ? DELETE_MS : TYPE_MS
    const tick = window.setTimeout(() => {
      const w = rolesRef.current[i % rolesRef.current.length]
      const next = del
        ? w.slice(0, Math.max(0, text.length - 1))
        : w.slice(0, text.length + 1)

      setText(next)

      if (del && next === '') {
        setDel(false)
        setI((v) => v + 1)
      }
    }, speed)

    return () => window.clearTimeout(tick)
  }, [text, del, i, linesKey, options.reducedMotion])

  const len = rolesRef.current.length
  const idx = len ? i % len : 0
  const activeWord = len ? ROLES[idx] : ''

  const displayText =
    options.reducedMotion || len === 0 ? (ROLES[0] ?? '') : text

  const showCursor = !options.reducedMotion && len > 0

  return {
    displayText,
    showCursor,
    blinkCursor: showCursor,
    currentLineFull: activeWord,
  }
}
