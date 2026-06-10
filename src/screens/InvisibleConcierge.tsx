// Screen 4 — Proactive Service · The Invisible Concierge
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppHeader, ScreenWrapper } from '../components/AppShell'
import { Badge, Card, Button, StatusDot, Avatar } from '../components/ui'
import { TooltipAnchor } from '../components/OnboardingTooltip'
import type { TooltipStep } from '../components/OnboardingTooltip'

export const invisibleConciergeSteps: TooltipStep[] = [
  {
    id: 'patterns',
    title: 'Behaviour patterns detected',
    body: "The AI learns each guest's daily rhythms - coffee at 7am, evening spa, early checkout - and surfaces proactive prep actions for staff.",
    placement: 'bottom',
    feature: 4,
  },
  {
    id: 'proactive-actions',
    title: 'Pre-staged before they ask',
    body: 'Staff receive smart prompts timed to the pattern — so the coffee is ready at 6:55am, the terry robe is laid out, the car is booked. Invisible, effortless.',
    placement: 'top',
    feature: 4,
  },
]

const guestPatterns = [
  { icon: '☕', action: 'Orders coffee',       detail: 'Americano, oat milk, no sugar',    time: '7:02am', days: 5, confidence: 98 },
  { icon: '🏊', action: 'Morning swim',          detail: 'Infinity pool, approx 30 min',   time: '8:15am', days: 4, confidence: 85 },
  { icon: '💆', action: 'Afternoon spa',          detail: 'Serenity room, aromatherapy',    time: '4:30pm', days: 3, confidence: 72 },
  { icon: '🍷', action: 'Evening wine',           detail: 'Malbec, terrace table',          time: '7:45pm', days: 4, confidence: 91 },
  { icon: '🚗', action: 'Late checkout request',  detail: 'Historically requests 1–2pm',    time: 'Day of', days: 5, confidence: 95 },
]

const proactiveActions = [
  {
    id: 'a1',
    trigger: 'Tomorrow 6:55am',
    action: 'Stage room service order',
    detail: 'Americano + oat milk to room 1402 — timed for 7:00am delivery',
    status: 'scheduled' as const,
    icon: '☕',
  },
  {
    id: 'a2',
    trigger: 'Tomorrow 8:00am',
    action: 'Reserve pool lane',
    detail: 'Guest typically arrives 8:15am for ~30 min swim',
    status: 'scheduled' as const,
    icon: '🏊',
  },
  {
    id: 'a3',
    trigger: 'Today 4:15pm',
    action: 'Pre-stage spa room',
    detail: 'Light aromatherapy, warm towels, robe size M — ready 15 min early',
    status: 'active' as const,
    icon: '💆',
  },
  {
    id: 'a4',
    trigger: 'Check-out day',
    action: 'Pre-approve late checkout',
    detail: 'Auto-extend to 1pm if availability allows — guest has 5/5 late checkout history',
    status: 'pending' as const,
    icon: '🔑',
  },
]

const statusStyles = {
  scheduled: { dot: 'done'    as const, label: 'Scheduled', bg: 'bg-blue-500/10  border-blue-500/20  text-blue-300'  },
  active:    { dot: 'active'  as const, label: 'Active',    bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' },
  pending:   { dot: 'pending' as const, label: 'Pending',   bg: 'bg-gold-500/10  border-gold-500/20  text-gold-300'  },
}

export function InvisibleConciergeScreen() {
  const [dismissed, setDismissed] = useState<string[]>([])
  const [confirmed, setConfirmed] = useState<string[]>([])

  function confirm(id: string) {
    setConfirmed(p => [...p, id])
  }

  function dismiss(id: string) {
    setDismissed(p => [...p, id])
  }

  const visibleActions = proactiveActions.filter(a => !dismissed.includes(a.id))

  return (
    <ScreenWrapper className="px-4 py-3 gap-4 pb-6">
      <AppHeader title="Invisible Concierge" subtitle="Mr. Reyes · Room 1402 · Night 5/7" />

      {/* Guest context card */}
      <Card className="flex items-center gap-3 py-3">
        <Avatar initials="AR" size="lg" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white">Alejandro Reyes</p>
            <Badge variant="gold">Titanium</Badge>
          </div>
          <p className="text-2xs text-white/40 mt-0.5">12 stays · 847 nights lifetime</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-gold-400">★ 9.8</p>
          <p className="text-2xs text-white/30 mt-0.5">Satisfaction</p>
        </div>
      </Card>

      {/* Patterns */}
      <TooltipAnchor step={invisibleConciergeSteps[0]}>
        <Card className="p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">Detected patterns</p>
              <p className="text-2xs text-white/35 mt-0.5">This stay · {guestPatterns.length} behaviours learned</p>
            </div>
            <Badge variant="teal">AI Active</Badge>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {guestPatterns.map((p, i) => (
              <motion.div
                key={p.action}
                className="flex items-center gap-3 px-4 py-2.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.08 }}
              >
                <span className="text-lg w-7 flex-shrink-0">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{p.action}</p>
                  <p className="text-2xs text-white/35 truncate">{p.detail}</p>
                </div>
                <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <span className="text-2xs font-semibold text-gold-400">{p.confidence}%</span>
                    <div className="w-10 h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-gold-700 to-gold-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${p.confidence}%` }}
                        transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.08 + 0.3 }}
                      />
                    </div>
                  </div>
                  <span className="text-2xs text-white/25">{p.days}/5 days</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </TooltipAnchor>

      {/* Proactive actions */}
      <TooltipAnchor step={invisibleConciergeSteps[1]}>
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-2xs uppercase tracking-widest text-white/30 font-medium">
              Proactive actions queued
            </p>
            <span className="text-2xs text-white/30">{visibleActions.length} pending</span>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {visibleActions.map((action) => {
                const st = statusStyles[action.status]
                const isConfirmed = confirmed.includes(action.id)

                return (
                  <motion.div
                    key={action.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                    className="glass p-4 space-y-2.5"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl mt-0.5">{action.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-semibold text-white">{action.action}</p>
                          <span className={`text-2xs px-2 py-0.5 rounded-full border font-medium ${st.bg}`}>
                            {st.label}
                          </span>
                        </div>
                        <p className="text-2xs text-white/45 mt-1 leading-relaxed">{action.detail}</p>
                        <p className="text-2xs text-gold-500/70 mt-1 font-medium">⏰ {action.trigger}</p>
                      </div>
                    </div>

                    {!isConfirmed ? (
                      <div className="flex gap-2 pt-0.5">
                        <Button
                          variant="gold"
                          size="sm"
                          className="flex-1"
                          onClick={() => confirm(action.id)}
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismiss(action.id)}
                        >
                          Dismiss
                        </Button>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium"
                      >
                        <StatusDot status="active" />
                        Confirmed — staff notified
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {visibleActions.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center py-8 gap-2 text-white/25 text-sm"
              >
                <span>✓</span>
                <span>All actions handled</span>
              </motion.div>
            )}
          </div>
        </div>
      </TooltipAnchor>
    </ScreenWrapper>
  )
}
