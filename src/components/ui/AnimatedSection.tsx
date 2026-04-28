import { motion, useInView } from 'framer-motion'
import type { ReactNode } from 'react'
import { useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type Props = {
  children: ReactNode
  className?: string
}

/**
 * useInView + animate é mais previsível que whileInView com rootMargin em %,
 * que em alguns browsers deixava o conteúdo preso em opacity: 0.
 */
export function AnimatedSection({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const isInView = useInView(ref, { once: true, amount: 0.12, margin: '0px 0px -40px 0px' })

  const visible = reduced || isInView

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: reduced ? 0 : 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
