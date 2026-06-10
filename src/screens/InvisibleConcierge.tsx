// Screen 4 — Proactive Service · The Invisible Concierge
// User: B2B — Concierge & Operations team (guest never sees this dashboard)
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppHeader, ScreenWrapper } from '../components/AppShell'
import { Card, Button, StatusDot, Avatar, UserTypeBadge } from '../components/ui'
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
    body: 'Staff receive smart prompts timed to each pattern — coffee ready at 6:55am, robe laid out, car booked. Invisible to the guest, effortless for the team.',
    placement: 'top',
    feature: 4,
  },
]

const guestPatterns = [
  { icon: '☕', action: 'Orders coffee',        detail: 'Americano, oat milk, no sugar',  time: '7:02am', days: 5, confidence: 98 },
  { icon: '🏊', action: 'Morning swim',          detail: 'Infinity pool, approx 30 min',  time: '8:15am', days: 4, confidence: 85 },
  { icon: '💆', action: 'Afternoon spa',          detail: 'Serenity room, aromatherapy',   time: '4:30pm', days: 3, confidence: 72 },
  { icon: '🍷', action: 'Evening wine',           detail: 'Malbec, terrace table',         time: '7:45pm', days: 4, confidence: 91 },
  { icon: '🔑', action: 'Late checkout',          detail: 'Historically requests 1–2pm',   time: 'Day of', days: 5, confidence: 95 },
]

const proactiveActions = [
  {
    id: 'a1', icon: '☕',
    trigger: 'Tomorrow 6:55am',
    action: 'Stage room service order',
    detail: 'Americano + oat milk to Room 1402 — timed for 7:00am delivery',
    status: 'scheduled' as const,
  },
  {
    id: 'a2', icon: '🏊',
    trigger: 'Tomorrow 8:00am',
    action: 'Reserve infinity pool lane',
    detail: 'Guest typically arrives 8:15am for ~30 min swim',
    status: 'scheduled' as const,
  },
  {
    id: 'a3', icon: '💆',
    trigger: 'Today 4:15pm',
    action: 'Pre-stage Serenity spa room',
    detail: 'Light aromatherapy, warm towels, robe size M — ready 15 min early',
    status: 'active' as const,
  },
  {
    id: 'a4', icon: '🔑',
    trigger: 'Check-out day',
    action: 'Pre-approve late checkout',
    detail: 'Auto-extend to 1pm if availability allows — 5/5 late checkout history',
    status: 'pending' as const,
  },
]

const statusStyles = {
  scheduled: { pill: 'bg-sea-100 text-navy-600 border-sea-200',         dot: 'done'    as const },
  active:    { pill: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'active' as const },
  pending:   { pill: 'bg-amber-50 text-amber-700 border-amber-100',       dot: 'pending' as const },
}

export function InvisibleConciergeScreen() {
  const [dismissed, setDismissed] = useState<string[]>([])
  const [confirmed, setConfirmed] = useState<string[]>([])

  const visibleActions = proactiveActions.filter(a => !dismissed.includes(a.id))

  return (
    <ScreenWrapper className="px-4 py-3 gap-3 pb-6 bg-sea-50">
      <AppHeader
        title="Invisible Concierge"
        subtitle="Mr. Reyes · Room 1402 · Night 5/7"
        actions={<UserTypeBadge type="b2b" />}
      />

      {/* Guest card */}
      <Card className="flex items-center gap-3 py-3">
        <Avatar initials="AR" size="lg" />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-navy-900">Alejandro Reyes</p>
            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-navy-700 text-white rounded-full uppercase tracking-wide">Titanium</span>
          </div>
          <p className="text-[10px] text-ink-400 mt-0.5">12 stays · 847 nights lifetime</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-navy-700">★ 9.8</p>
          <p className="text-[10px] text-ink-400 mt-0.5">Satisfaction</p>
        </div>
      </Card>

      {/* Patterns */}
      <TooltipAnchor step={invisibleConciergeSteps[0]}>
        <Card noPad className="overflow-hidden">
          <div className="px-4 py-3 border-b border-sea-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-navy-900">Detected patterns</p>
              <p className="text-[10px] text-ink-400 mt-0.5">{guestPatterns.length} behaviours · this stay</p>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
              <StatusDot status="active" pulse />
              AI Active
            </span>
          </div>
          <div className="divide-y divide-sea-50">
            {guestPatterns.map((p, i) => (
              <motion.div
                key={p.action}
                className="flex items-center gap-3 px-4 py-2.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.07 }}
              >
                <span className="text-base w-7 flex-shrink-0">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-navy-900 truncate">{p.action}</p>
                  <p className="text-[10px] text-ink-400 truncate">{p.detail}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <div className="w-12 h-1.5 bg-sea-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-navy-700 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${p.confidence}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.07 + 0.2 }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-navy-700">{p.confidence}%</span>
                  </div>
                  <span className="text-[10px] text-ink-300">{p.days}/5 days</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </TooltipAnchor>

      {/* Proactive actions */}
      <TooltipAnchor step={invisibleConciergeSteps[1]}>
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] uppercase tracking-widest text-ink-400 font-semibold">Proactive actions</p>
            <span className="text-[10px] text-ink-300">{visibleActions.length} pending</span>
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
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20, transition: { duration: 0.18 } }}
                    className="bg-white rounded-xl border border-sea-100 p-3.5 space-y-2"
                    style={{ boxShadow: '0 1px 6px rgba(12,35,57,0.06)' }}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-lg mt-0.5 flex-shrink-0">{action.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-semibold text-navy-900">{action.action}</p>
                          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${st.pill}`}>
                            {action.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-ink-400 mt-1 leading-relaxed">{action.detail}</p>
                        <p className="text-[10px] font-semibold text-navy-600 mt-1">⏰ {action.trigger}</p>
                      </div>
                    </div>
                    {!isConfirmed ? (
                      <div className="flex gap-2 pt-0.5">
                        <Button variant="primary" size="sm" className="flex-1" onClick={() => setConfirmed(p => [...p, action.id])}>
                          Confirm
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDismissed(p => [...p, action.id])}>
                          Dismiss
                        </Button>
                      </div>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                        <StatusDot status="active" />
                        Confirmed — staff notified
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
            {visibleActions.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center justify-center py-8 gap-2 text-ink-300 text-sm">
                <span>✓</span><span>All actions handled</span>
              </motion.div>
            )}
          </div>
        </div>
      </TooltipAnchor>
    </ScreenWrapper>
  )
}
