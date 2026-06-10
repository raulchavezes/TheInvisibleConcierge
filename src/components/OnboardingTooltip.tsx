// Onboarding tooltip system — guided product tour for the team
import { type ReactNode, createContext, useContext, useState } from 'react'
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

const FEATURE_COLORS: Record<number, string> = {
  1: 'from-violet-600/20 to-navy-800',
  2: 'from-teal-600/20 to-navy-800',
  3: 'from-amber-600/20 to-navy-800',
  4: 'from-gold-600/20 to-navy-800',
}

const FEATURE_LABELS: Record<number, string> = {
  1: 'Social AI',
  2: 'Room Readiness',
  3: 'Itinerary Builder',
  4: 'Invisible Concierge',
}

const FEATURE_ICONS: Record<number, string> = {
  1: '✦',
  2: '◈',
  3: '◉',
  4: '◎',
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
    if (stepIndex < steps.length - 1) {
      setStepIndex(i => i + 1)
    } else {
      setDone(true)
      onComplete?.()
    }
  }

  function dismiss() {
    setDone(true)
  }

  return (
    <Ctx.Provider value={{
      activeStep,
      stepIndex,
      totalSteps: steps.length,
      advance,
      dismiss,
      isActive: (id) => activeStep === id,
    }}>
      {children}
    </Ctx.Provider>
  )
}

// ─── Tooltip anchor wrapper ────────────────────────────────────────────────────
interface TooltipAnchorProps {
  step: TooltipStep
  children: ReactNode
  className?: string
}

export function TooltipAnchor({ step, children, className }: TooltipAnchorProps) {
  const { isActive, advance, dismiss, stepIndex, totalSteps } = useOnboarding()
  const active = isActive(step.id)

  return (
    <div className={clsx('relative', className)}>
      {/* Highlight ring when active */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="absolute -inset-1.5 rounded-2xl border border-gold-500/50 pointer-events-none z-10"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gold-500/[0.04]" />
          </motion.div>
        )}
      </AnimatePresence>

      {children}

      {/* Tooltip bubble */}
      <AnimatePresence>
        {active && (
          <motion.div
            className={clsx(
              'absolute z-50 w-64',
              step.placement === 'top'    ? 'bottom-full mb-3 left-1/2 -translate-x-1/2' : '',
              step.placement === 'bottom' ? 'top-full mt-3 left-1/2 -translate-x-1/2'    : '',
              step.placement === 'left'   ? 'right-full mr-3 top-1/2 -translate-y-1/2'   : '',
              step.placement === 'right'  ? 'left-full ml-3 top-1/2 -translate-y-1/2'    : '',
              !step.placement             ? 'top-full mt-3 left-0'                        : '',
            )}
            initial={{ opacity: 0, y: step.placement === 'top' ? 6 : -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: step.placement === 'top' ? 6 : -6, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={clsx(
              'rounded-2xl border border-white/10 overflow-hidden shadow-card',
              'bg-gradient-to-br', FEATURE_COLORS[step.feature]
            )}
              style={{ backdropFilter: 'blur(20px)', background: 'rgba(13,21,48,0.95)' }}
            >
              {/* Header stripe */}
              <div className="flex items-center gap-2 px-4 pt-3.5 pb-2.5 border-b border-white/[0.06]">
                <span className="text-gold-400 text-base">{FEATURE_ICONS[step.feature]}</span>
                <span className="text-2xs uppercase tracking-widest text-gold-500/80 font-medium">
                  {FEATURE_LABELS[step.feature]}
                </span>
                <button
                  onClick={dismiss}
                  className="ml-auto text-white/30 hover:text-white/60 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="px-4 py-3">
                <p className="text-sm font-semibold text-white leading-snug mb-1.5">{step.title}</p>
                <p className="text-xs text-white/55 leading-relaxed">{step.body}</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 pb-3.5">
                {/* Progress dots */}
                <div className="flex gap-1">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <span
                      key={i}
                      className={clsx(
                        'rounded-full transition-all duration-200',
                        i === stepIndex
                          ? 'w-4 h-1.5 bg-gold-500'
                          : i < stepIndex
                          ? 'w-1.5 h-1.5 bg-gold-500/40'
                          : 'w-1.5 h-1.5 bg-white/15'
                      )}
                    />
                  ))}
                </div>
                <button
                  onClick={advance}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors"
                >
                  {stepIndex < totalSteps - 1 ? 'Next' : 'Done'}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7H11M8 4L11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Arrow */}
            {(!step.placement || step.placement === 'bottom') && (
              <div className="absolute -top-1.5 left-8 w-3 h-3 bg-navy-800 border-l border-t border-white/10 rotate-45" />
            )}
            {step.placement === 'top' && (
              <div className="absolute -bottom-1.5 left-8 w-3 h-3 bg-navy-800 border-r border-b border-white/10 rotate-45" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
