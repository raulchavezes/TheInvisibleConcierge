// Screen 1 — Social AI · Intent-driven outreach
// User: B2B — Marketing & Sales team
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppHeader, ScreenWrapper } from '../components/AppShell'
import { Badge, Button, Card, Tag, StatusDot, UserTypeBadge } from '../components/ui'
import { TooltipAnchor } from '../components/OnboardingTooltip'
import type { TooltipStep } from '../components/OnboardingTooltip'

export const socialAISteps: TooltipStep[] = [
  {
    id: 'signal-card',
    title: 'AI detects travel intent',
    body: 'Our model scans social signals — posts, saves, searches — to identify the perfect moment to reach out before they book anywhere else.',
    placement: 'bottom',
    feature: 1,
  },
  {
    id: 'recommendations',
    title: 'Hyper-personalised suggestions',
    body: "Based on the detected intent, AI curates activities, suite types, and dining options specifically matched to this guest's profile.",
    placement: 'top',
    feature: 1,
  },
]

const signals = [
  { platform: 'Instagram', content: 'Saved 14 posts about Punta Cana this week', time: '2h ago', intent: 98 },
  { platform: 'Google',    content: '"best all-inclusive punta cana 2025" search', time: '5h ago', intent: 94 },
  { platform: 'Pinterest', content: 'Created board "DR vacation ideas"',          time: '1d ago', intent: 87 },
]

const recommendations = [
  { type: 'Suite',    name: 'Sky Pool Master Suite',    detail: 'Infinity pool · Ocean view', price: 'From $480/night' },
  { type: 'Activity', name: 'Private snorkel charter',  detail: '4hr · Up to 6 guests',       price: '$320' },
  { type: 'Dining',   name: 'Alma by Chef Rivera',      detail: 'Tasting menu · 8 courses',   price: '$195/pp' },
  { type: 'Spa',      name: 'Serenity ritual & float',  detail: '3hr · Couples available',    price: '$240' },
]

const tagOptions = ['Couples', 'Beach lover', 'Foodie', 'Adventure', 'Luxury']

const typeColor: Record<string, string> = {
  Suite: 'text-violet-600 bg-violet-50 border-violet-100',
  Activity: 'text-teal-600 bg-teal-50 border-teal-100',
  Dining: 'text-amber-700 bg-amber-50 border-amber-100',
  Spa: 'text-rose-600 bg-rose-50 border-rose-100',
}

export function SocialAIScreen() {
  const [activeTag, setActiveTag] = useState('Couples')
  const [sent, setSent] = useState(false)

  return (
    <ScreenWrapper className="px-4 py-3 gap-3 pb-6 bg-sea-50">
      <AppHeader
        title="Social Intelligence"
        subtitle="Marina K. · Prospect"
        actions={<UserTypeBadge type="b2b" />}
      />

      {/* Intent card */}
      <TooltipAnchor step={socialAISteps[0]}>
        <Card noPad className="overflow-hidden">
          <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Badge variant="navy">High Intent</Badge>
                <Badge variant="sea">Punta Cana</Badge>
              </div>
              <h3 className="font-display text-lg text-navy-900 leading-snug">Marina is planning a trip</h3>
              <p className="text-xs text-ink-500 mt-0.5">June–July 2025 · 7–10 nights</p>
            </div>
            {/* Score ring */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="relative w-14 h-14">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="22" fill="none" stroke="#E8F1F8" strokeWidth="4"/>
                  <motion.circle
                    cx="28" cy="28" r="22" fill="none"
                    stroke="#1E4168" strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="138"
                    initial={{ strokeDashoffset: 138 }}
                    animate={{ strokeDashoffset: 138 * 0.04 }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-navy-800">96</span>
                </div>
              </div>
              <span className="text-[10px] text-ink-400 mt-0.5 font-medium">Intent</span>
            </div>
          </div>

          {/* Signal rows */}
          <div className="border-t border-sea-100 divide-y divide-sea-50">
            {signals.map((s, i) => (
              <motion.div
                key={s.platform}
                className="flex items-center gap-3 px-4 py-2.5"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i + 0.3 }}
              >
                <div className="flex items-center gap-1.5 w-20 flex-shrink-0">
                  <StatusDot status="active" />
                  <span className="text-[10px] text-ink-500 font-medium truncate">{s.platform}</span>
                </div>
                <p className="text-xs text-ink-700 flex-1 leading-snug">{s.content}</p>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="text-xs font-bold text-navy-700">{s.intent}%</span>
                  <span className="text-[10px] text-ink-300">{s.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </TooltipAnchor>

      {/* Profile tags */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-ink-400 mb-2 font-semibold">Profile signals</p>
        <div className="flex flex-wrap gap-1.5">
          {tagOptions.map(t => (
            <Tag key={t} active={activeTag === t} onClick={() => setActiveTag(t)}>{t}</Tag>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <TooltipAnchor step={socialAISteps[1]}>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-ink-400 mb-2.5 font-semibold">AI-curated for this profile</p>
          <div className="grid grid-cols-2 gap-2">
            {recommendations.map((r, i) => (
              <motion.div
                key={r.name}
                className="bg-white rounded-xl border border-sea-100 p-3"
                style={{ boxShadow: '0 1px 6px rgba(12,35,57,0.06)' }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.07 * i + 0.5 }}
              >
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border inline-block mb-2 ${typeColor[r.type]}`}>
                  {r.type}
                </span>
                <p className="text-xs font-semibold text-navy-900 leading-snug">{r.name}</p>
                <p className="text-[10px] text-ink-400 mt-0.5">{r.detail}</p>
                <p className="text-xs font-bold text-navy-700 mt-1.5">{r.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </TooltipAnchor>

      {/* CTA */}
      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Button variant="primary" fullWidth size="lg" onClick={() => setSent(true)}>
              Send personalised offer
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7H11M8 4L11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-50 border border-emerald-200"
          >
            <StatusDot status="active" />
            <span className="text-sm text-emerald-700 font-semibold">Offer sent to Marina</span>
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenWrapper>
  )
}
