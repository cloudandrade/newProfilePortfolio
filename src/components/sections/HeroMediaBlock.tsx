import { useFloatingTranslate } from '../../hooks/useFloatingTranslate'

const TECH_BADGES: { label: string; cornerClass: string }[] = [
  { label: 'React', cornerClass: 'top-4 -left-6' },
  {
    label: 'TS',
    cornerClass: 'top-1/3 -translate-y-1/2 -right-8',
  },
  { label: 'Node', cornerClass: 'bottom-8 -left-8' },
  { label: 'PG', cornerClass: '-bottom-4 right-10' },
]

export type HeroMediaBlockProps = {
  photoSrc: string
  photoAlt: string
  showCodeSide: boolean
  codeSnippet: string
  typedChars: number
  reducedMotion: boolean
}

/**
 * Cartão foto ⟷ terminal.
 * Halo + moldura + badges dentro de um único wrapper: `translate3d` via RAF (robusto quando CSS anims falham).
 */
export function HeroMediaBlock({
  photoSrc,
  photoAlt,
  showCodeSide,
  codeSnippet,
  typedChars,
  reducedMotion,
}: HeroMediaBlockProps) {
  const scaleOn = reducedMotion ? '' : 'animate-scale-in'
  const floatShellRef = useFloatingTranslate(!reducedMotion, {
    amplitudePx: 22,
    periodMs: 5000,
  })

  const caretClass = reducedMotion
    ? 'text-emerald-300'
    : 'animate-hero-terminal-caret text-emerald-300'

  const terminalBody = (
    <div className="box-border flex h-full min-h-0 flex-col overflow-hidden rounded-[1.6rem] border border-white/[0.06] bg-[#1b1f27] p-2.5 sm:p-3 font-mono text-[0.8125rem] leading-relaxed text-[#b7ffd8] sm:text-[0.9375rem] sm:leading-[1.65]">
      <pre className="m-0 min-h-0 max-h-full flex-1 overflow-y-auto overscroll-y-contain whitespace-pre-wrap break-words pr-0.5">
        <code>{codeSnippet.slice(0, typedChars)}</code>
        {showCodeSide ? (
          <span aria-hidden className={`ml-px inline align-baseline ${caretClass}`}>
            |
          </span>
        ) : null}
      </pre>
    </div>
  )

  const photoFace = (
    <img
      src={photoSrc}
      alt={photoAlt}
      width={520}
      height={520}
      decoding="async"
      fetchPriority="high"
      loading="eager"
      className="h-full w-full rounded-[1.6rem] object-cover"
    />
  )

  const flipSizing =
    'relative aspect-square w-[min(280px,calc(100vw-2.5rem))] sm:w-[360px] md:w-[420px] max-w-[min(100vw-2rem,420px)]'

  const flipInterior = reducedMotion ? (
    <div
      className={`${flipSizing} overflow-hidden rounded-[1.6rem] bg-neutral-950 shadow-inner`}
    >
      {!showCodeSide ? (
        photoFace
      ) : (
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[1.6rem] border border-white/[0.08] bg-[#23262d]">
          {terminalBody}
        </div>
      )}
    </div>
  ) : (
    <div className={`${flipSizing} [perspective:1200px]`}>
      <div
        className="relative size-full [transform-style:preserve-3d] motion-reduce:transition-none"
        style={{
          transform: showCodeSide ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 750ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div
          className="absolute inset-0 overflow-hidden rounded-[1.6rem] bg-neutral-950 [backface-visibility:hidden]"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {photoFace}
        </div>

        <div
          className="absolute inset-0 flex flex-col overflow-hidden rounded-[1.6rem] border border-white/[0.08] bg-[#23262d] [backface-visibility:hidden]"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {terminalBody}
        </div>
      </div>
    </div>
  )

  return (
    <div className={`relative mx-auto w-fit max-w-full ${scaleOn}`}>
      <div
        ref={floatShellRef}
        className="relative isolate mx-auto w-fit"
        style={reducedMotion ? undefined : { willChange: 'transform' }}
      >
        <div
          aria-hidden
          className={`pointer-events-none absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-primary/40 via-primary/10 to-transparent blur-2xl transition-opacity duration-500 ${showCodeSide ? 'opacity-40' : 'opacity-100'}`}
        />

        <div className="relative rounded-[2rem] p-2 glow-card">{flipInterior}</div>

        {!showCodeSide &&
          TECH_BADGES.map((b) => (
            <span
              key={b.label}
              aria-hidden
              className={`pointer-events-none absolute z-[6] whitespace-nowrap rounded-full border border-primary/30 bg-card/90 px-3 py-1.5 font-mono text-xs text-primary backdrop-blur-md shadow-[var(--shadow-soft)] ${b.cornerClass}`}
            >
              {b.label}
            </span>
          ))}
      </div>
    </div>
  )
}
