// Onboarding tooltip system — light Mare palette, renders OUTSIDE the phone frame
import { type ReactNode, createContext, useContext, useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

export interface TooltipStep {
  id: string
  title: string
  body: string
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'side'
  feature: 1 | 2 | 3 | 4
}

interface OnboardingCtx {
  activeStep: string | null
  stepIndex: number
  totalSteps: number
  advance: () => void
  dismiss: () => void
  isActive: (id: string) => boolean
  currentStep: TooltipStep | null
}

const Ctx = createContext<OnboardingCtx>({
  activeStep: null, stepIndex: 0, totalSteps: 0,
  advance: () => {}, dismiss: () => {}, isActive: () => false, currentStep: null,
})

export function useOnboarding() { return useContext(Ctx) }

const FEATURE_META: Record<number, { label: string; icon: string; color: string; bg: string }> = {
  1: { label: 'Social AI',          icon: '✦', color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200' },
  2: { label: 'Room Readiness',     icon: '◈', color: 'text-teal-700',   bg: 'bg-teal-50 border-teal-200'     },
  3: { label: 'Plan Your Stay',     icon: '◉', color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200'   },
  4: { label: 'Invisible Concierge',icon: '◎', color: 'text-navy-700',   bg: 'bg-sea-100 border-sea-200'       },
}

interface OnboardingProviderProps {
  children: ReactNode
  steps: TooltipStep[]
  onComplete?: () => void
  onStepChange?: (step: TooltipStep) => void
}

export function OnboardingProvider({ children, steps, onComplete, onStepChange }: OnboardingProviderProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [done, setDone] = useState(false)

  const activeStep = done ? null : (steps[stepIndex]?.id ?? null)
  const currentStep = done ? null : (steps[stepIndex] ?? null)

  function advance() {
    if (stepIndex < steps.length - 1) {
      const next = stepIndex + 1
      setStepIndex(next)
      onStepChange?.(steps[next])
    } else {
      setDone(true)
      onComplete?.()
    }
  }

  return (
    <Ctx.Provider value={{
      activeStep, stepIndex, totalSteps: steps.length,
      advance,
      dismiss: () => setDone(true),
      isActive: (id) => activeStep === id,
      currentStep,
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
  meta: typeof FEATURE_META[number]
  stepIndex: number
  totalSteps: number
  onNext: () => void
  onDismiss: () => void
}

function TooltipBubble({ step, rect, meta, stepIndex, totalSteps, onNext, onDismiss }: BubbleProps) {
  const GAP = 16

  // Measure the actual phone frame from the DOM
  const phoneEl    = document.querySelector('[data-phone-frame]') as HTMLElement | null
  const phoneR     = phoneEl ? phoneEl.getBoundingClientRect() : null
  const phoneLeft  = phoneR ? phoneR.left  : rect.left
  const phoneRight = phoneR ? phoneR.right : rect.right

  const spaceRight = window.innerWidth - phoneRight - GAP - 8
  const spaceLeft  = phoneLeft - GAP - 8
  const TIP_W      = Math.min(248, Math.max(spaceRight, spaceLeft, 160))
  const TIP_H      = 210

  const hasSideRoom = Math.max(spaceRight, spaceLeft) >= 140

  // When no side room: bottom-sheet mode (slide up from bottom)
  if (!hasSideRoom) {
    // Render as bottom panel — handled by caller via isBottomSheet flag
  }

  let left = phoneRight + GAP
  let arrowSide: 'left' | 'right' = 'left'

  if (spaceRight >= spaceLeft && spaceRight >= 140) {
    left      = phoneRight + GAP
    arrowSide = 'left'
  } else {
    left      = phoneLeft - GAP - TIP_W
    arrowSide = 'right'
  }
  left = Math.max(8, Math.min(left, window.innerWidth - TIP_W - 8))

  // Vertically centre on the highlighted element
  const anchorMidY = rect.top + rect.height / 2
  let top = anchorMidY - TIP_H / 2
  top = Math.max(12, Math.min(top, window.innerHeight - TIP_H - 12))

  const arrowY = Math.max(24, Math.min(anchorMidY - top - 6, TIP_H - 36))

  // Bottom-sheet for narrow viewports — slides up from bottom, never overlaps phone
  if (!hasSideRoom) {
    return (
      <AnimatePresence>
        <motion.div
          key={step.id}
          style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999 }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <TooltipCard step={step} meta={meta} stepIndex={stepIndex} totalSteps={totalSteps} onNext={onNext} onDismiss={onDismiss} isSheet />
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        key={step.id}
        style={{ position: 'fixed', top, left, width: TIP_W, zIndex: 9999 }}
        initial={{ opacity: 0, x: arrowSide === 'left' ? -8 : 8, scale: 0.97 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: arrowSide === 'left' ? -8 : 8, scale: 0.97 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Connecting arrow — points horizontally toward the phone */}
        <div
          className="absolute w-3 h-3 bg-white border border-sea-200"
          style={{
            top: arrowY,
            ...(arrowSide === 'left'
              ? { left: -7, borderRight: 'none', borderTop: 'none', transform: 'rotate(45deg)' }
              : { right: -7, borderLeft: 'none', borderBottom: 'none', transform: 'rotate(45deg)' }
            ),
          }}
        />

        <TooltipCard step={step} meta={meta} stepIndex={stepIndex} totalSteps={totalSteps} onNext={onNext} onDismiss={onDismiss} />
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Shared card content ──────────────────────────────────────────────────────
interface CardProps {
  step: TooltipStep
  meta: typeof FEATURE_META[number]
  stepIndex: number
  totalSteps: number
  onNext: () => void
  onDismiss: () => void
  isSheet?: boolean
}
function TooltipCard({ step, meta, stepIndex, totalSteps, onNext, onDismiss, isSheet }: CardProps) {
  return (
    <div
      className={clsx('bg-white border border-sea-200 overflow-hidden', isSheet ? 'rounded-t-2xl' : 'rounded-2xl')}
      style={{ boxShadow: '0 8px 28px rgba(12,35,57,0.14), 0 2px 8px rgba(12,35,57,0.07)' }}
    >
      {isSheet && <div className="flex justify-center pt-2.5 pb-1"><div className="w-8 h-1 bg-sea-200 rounded-full" /></div>}
      <div className={clsx('flex items-center gap-2 px-4 pt-3 pb-2.5 border-b border-sea-100', meta.bg)}>
        <span className={clsx('text-sm', meta.color)}>{meta.icon}</span>
        <span className={clsx('text-[10px] uppercase tracking-widest font-semibold', meta.color)}>{meta.label}</span>
        <button onClick={onDismiss} className="ml-auto text-ink-300 hover:text-ink-700 transition-colors p-0.5 rounded">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <div className="px-4 py-3">
        <p className="text-sm font-semibold text-navy-900 leading-snug mb-1.5">{step.title}</p>
        <p className="text-xs text-ink-500 leading-relaxed">{step.body}</p>
      </div>
      <div className="flex items-center justify-between px-4 pb-4">
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span key={i} className={clsx('rounded-full transition-all duration-200',
              i === stepIndex ? 'w-4 h-1.5 bg-navy-700' : i < stepIndex ? 'w-1.5 h-1.5 bg-navy-300' : 'w-1.5 h-1.5 bg-sea-200'
            )} />
          ))}
        </div>
        <button onClick={onNext} className="flex items-center gap-1.5 text-xs font-semibold text-navy-700 hover:text-navy-900 transition-colors">
          {stepIndex < totalSteps - 1 ? 'Next' : 'Done'}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7H11M8 4L11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
