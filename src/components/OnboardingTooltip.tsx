// Onboarding tooltip system — light Mare palette, renders OUTSIDE the phone frame
import { type ReactNode, createContext, useContext, useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

export interface TooltipStep {
  id: string
  title: string
  body: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  feature: 1 | 2 | 3 | 4
}

interface OnboardingCtx {
  activeStep: string | null
  stepIndex: number
  totalSteps: number
  advance: () => void
  dismiss: () => void
  isActive: (id: string) => boolean
}

const Ctx = createContext<OnboardingCtx>({
  activeStep: null, stepIndex: 0, totalSteps: 0,
  advance: () => {}, dismiss: () => {}, isActive: () => false,
})

export function useOnboarding() { return useContext(Ctx) }

const FEATURE_META: Record<number, { label: string; icon: string; color: string; bg: string }> = {
  1: { label: 'Social AI',          icon: '✦', color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200' },
  2: { label: 'Room Readiness',     icon: '◈', color: 'text-teal-700',   bg: 'bg-teal-50 border-teal-200'     },
  3: { label: 'Itinerary Builder',  icon: '◉', color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200'   },
  4: { label: 'Invisible Concierge',icon: '◎', color: 'text-navy-700',   bg: 'bg-sea-100 border-sea-200'       },
}

interface OnboardingProviderProps {
  children: ReactNode
  steps: TooltipStep[]
  onComplete?: () => void
}

export function OnboardingProvider({ children, steps, onComplete }: OnboardingProviderProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [done, setDone] = useState(false)

  const activeStep = done ? null : (steps[stepIndex]?.id ?? null)

  function advance() {
    if (stepIndex < steps.length - 1) setStepIndex(i => i + 1)
    else { setDone(true); onComplete?.() }
  }

  return (
    <Ctx.Provider value={{
      activeStep, stepIndex, totalSteps: steps.length,
      advance,
      dismiss: () => setDone(true),
      isActive: (id) => activeStep === id,
    }}>
      {children}
    </Ctx.Provider>
  )
}

// ─── Tooltip Anchor ───────────────────────────────────────────────────────────
// Renders a highlight ring in-place; the tooltip bubble is portalled to <body>
// so it's never clipped by the phone frame's overflow.
interface TooltipAnchorProps {
  step: TooltipStep
  children: ReactNode
  className?: string
}

export function TooltipAnchor({ step, children, className }: TooltipAnchorProps) {
  const { isActive, advance, dismiss, stepIndex, totalSteps } = useOnboarding()
  const active = isActive(step.id)
  const anchorRef = useRef<HTMLDivElement>(null)
  const [rect, setRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (!active || !anchorRef.current) { setRect(null); return }
    const update = () => {
      if (anchorRef.current) setRect(anchorRef.current.getBoundingClientRect())
    }
    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [active])

  const placement = step.placement ?? 'bottom'
  const meta = FEATURE_META[step.feature]

  return (
    <div ref={anchorRef} className={clsx('relative', className)}>
      {/* Highlight ring */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="absolute -inset-1 rounded-2xl border-2 border-navy-600/40 pointer-events-none z-10"
            style={{ boxShadow: '0 0 0 4px rgba(30,65,104,0.08)' }}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {children}

      {/* Tooltip portalled to body */}
      {active && rect && createPortal(
        <TooltipBubble
          step={step}
          rect={rect}
          placement={placement}
          meta={meta}
          stepIndex={stepIndex}
          totalSteps={totalSteps}
          onNext={advance}
          onDismiss={dismiss}
        />,
        document.body
      )}
    </div>
  )
}

// ─── Tooltip Bubble (portalled) ───────────────────────────────────────────────
interface BubbleProps {
  step: TooltipStep
  rect: DOMRect
  placement: string
  meta: typeof FEATURE_META[number]
  stepIndex: number
  totalSteps: number
  onNext: () => void
  onDismiss: () => void
}

function TooltipBubble({ step, rect, placement, meta, stepIndex, totalSteps, onNext, onDismiss }: BubbleProps) {
  const TIP_W = 272
  const GAP   = 10

  // position: fixed uses viewport coordinates — do NOT add scrollY/scrollX
  let top = 0, left = 0
  const TIP_H_EST = 200

  if (placement === 'bottom') {
    top  = rect.bottom + GAP
    left = rect.left + rect.width / 2 - TIP_W / 2
  } else if (placement === 'top') {
    top  = rect.top - GAP - TIP_H_EST
    left = rect.left + rect.width / 2 - TIP_W / 2
  } else if (placement === 'right') {
    top  = rect.top + rect.height / 2 - TIP_H_EST / 2
    left = rect.right + GAP
  } else {
    top  = rect.bottom + GAP
    left = rect.left
  }

  // Clamp so tooltip doesn't overflow viewport
  left = Math.max(8, Math.min(left, window.innerWidth - TIP_W - 8))
  // If tooltip would go below viewport, flip it above the anchor
  if (top + TIP_H_EST > window.innerHeight - 8) {
    top = rect.top - GAP - TIP_H_EST
  }
  top = Math.max(8, top)

  const yOffset = placement === 'top' ? 6 : -6

  return (
    <AnimatePresence>
      <motion.div
        key={step.id}
        style={{ position: 'fixed', top, left, width: TIP_W, zIndex: 9999 }}
        initial={{ opacity: 0, y: yOffset, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: yOffset, scale: 0.96 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="bg-white rounded-2xl border border-sea-200 overflow-hidden"
          style={{ boxShadow: '0 8px 28px rgba(12,35,57,0.18), 0 2px 8px rgba(12,35,57,0.08)' }}
        >
          {/* Header */}
          <div className={clsx('flex items-center gap-2 px-4 pt-3 pb-2.5 border-b border-sea-100', meta.bg)}>
            <span className={clsx('text-sm', meta.color)}>{meta.icon}</span>
            <span className={clsx('text-[10px] uppercase tracking-widest font-semibold', meta.color)}>
              {meta.label}
            </span>
            <button
              onClick={onDismiss}
              className="ml-auto text-ink-300 hover:text-ink-700 transition-colors p-0.5 rounded"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-4 py-3">
            <p className="text-sm font-semibold text-navy-900 leading-snug mb-1.5">{step.title}</p>
            <p className="text-xs text-ink-500 leading-relaxed">{step.body}</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 pb-3.5">
            <div className="flex gap-1">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <span
                  key={i}
                  className={clsx(
                    'rounded-full transition-all duration-200',
                    i === stepIndex ? 'w-4 h-1.5 bg-navy-700' :
                    i < stepIndex   ? 'w-1.5 h-1.5 bg-navy-300' :
                                      'w-1.5 h-1.5 bg-sea-200'
                  )}
                />
              ))}
            </div>
            <button
              onClick={onNext}
              className="flex items-center gap-1.5 text-xs font-semibold text-navy-700 hover:text-navy-900 transition-colors"
            >
              {stepIndex < totalSteps - 1 ? 'Next' : 'Done'}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7H11M8 4L11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Arrow */}
        {placement === 'bottom' && (
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-sea-200 rotate-45" />
        )}
        {placement === 'top' && (
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-sea-200 rotate-45" />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
