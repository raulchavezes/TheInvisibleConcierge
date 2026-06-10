// Screen 1 — Social AI · Intent-driven outreach
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppHeader, ScreenWrapper } from '../components/AppShell'
import { Badge, Button, Card, Tag, StatusDot } from '../components/ui'
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
  { platform: 'Instagram', handle: '@marina.k', content: 'Saved 14 posts about Punta Cana this week', time: '2h ago', intent: 98 },
  { platform: 'Google',    handle: 'marina.k@...',  content: '"best all-inclusive punta cana 2025" search', time: '5h ago', intent: 94 },
  { platform: 'Pinterest', handle: '@marina.k', content: 'Created board "DR vacation ideas"', time: '1d ago', intent: 87 },
]

const recommendations = [
  { type: 'Suite',     name: 'Sky Pool Master Suite', detail: 'Infinity pool · Ocean view', price: 'From $480/night', icon: '◈' },
  { type: 'Activity',  name: 'Private snorkel charter', detail: '4hr · Up to 6 guests', price: '$320', icon: '◉' },
  { type: 'Dining',    name: 'Alma by Chef Rivera', detail: 'Tasting menu · 8 courses', price: '$195/pp', icon: '◎' },
  { type: 'Spa',       name: 'Serenity ritual & float', detail: '3hr · Couples available', price: '$240', icon: '✦' },
]

const tagOptions = ['Couples', 'Beach lover', 'Foodie', 'Adventure', 'Luxury']

export function SocialAIScreen() {
  const [activeTag, setActiveTag] = useState('Couples')
  const [sent, setSent] = useState(false)

  return (
    <ScreenWrapper className="px-4 py-3 gap-4 pb-6">
      <AppHeader title="Social Intelligence" subtitle="Marina K. · Prospect" />

      {/* Intent score */}
      <TooltipAnchor step={socialAISteps[0]}>
        <Card className="p-0 overflow-hidden">
          <div className="px-4 pt-4 pb-3 flex items-start justify-between">
            <div>
              <Badge variant="gold">High Intent Detected</Badge>
              <h3 className="font-display text-lg text-white mt-2">Marina is planning a trip</h3>
              <p className="text-xs text-white/40 mt-0.5">Punta Cana · June–July 2025</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-14 h-14">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4"/>
                  <motion.circle
                    cx="28" cy="28" r="22" fill="none"
                    stroke="url(#goldGrad)" strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="138"
                    initial={{ strokeDashoffset: 138 }}
                    animate={{ strokeDashoffset: 138 * (1 - 0.96) }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                  />
                  <defs>
                    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8A6B34"/>
                      <stop offset="100%" stopColor="#E8D5A8"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gold-400">96</span>
                </div>
              </div>
              <span className="text-2xs text-white/30 mt-1">Intent</span>
            </div>
          </div>

          {/* Signals */}
          <div className="border-t border-white/[0.06] divide-y divide-white/[0.04]">
            {signals.map((s, i) => (
              <motion.div
                key={s.platform}
                className="flex items-center gap-3 px-4 py-2.5"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i + 0.4 }}
              >
                <div className="flex items-center gap-1.5 w-20 flex-shrink-0">
                  <StatusDot status="active" />
                  <span className="text-2xs text-white/40 truncate">{s.platform}</span>
                </div>
                <p className="text-xs text-white/60 flex-1 leading-snug">{s.content}</p>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-2xs font-semibold text-gold-500">{s.intent}%</span>
                  <span className="text-2xs text-white/25">{s.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </TooltipAnchor>

      {/* Profile tags */}
      <div>
        <p className="text-2xs uppercase tracking-widest text-white/30 mb-2.5 font-medium">Guest profile signals</p>
        <div className="flex flex-wrap gap-2">
          {tagOptions.map(t => (
            <Tag key={t} active={activeTag === t} onClick={() => setActiveTag(t)}>{t}</Tag>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <TooltipAnchor step={socialAISteps[1]}>
        <div>
          <p className="text-2xs uppercase tracking-widest text-white/30 mb-3 font-medium">AI-curated for this profile</p>
          <div className="grid grid-cols-2 gap-2.5">
            {recommendations.map((r, i) => (
              <motion.div
                key={r.name}
                className="glass p-3 flex flex-col gap-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i + 0.6 }}
              >
                <div className="flex items-start justify-between">
                  <span className="text-lg text-gold-500/60">{r.icon}</span>
                  <Badge variant="slate" size="sm">{r.type}</Badge>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white leading-snug">{r.name}</p>
                  <p className="text-2xs text-white/40 mt-0.5">{r.detail}</p>
                </div>
                <p className="text-xs font-medium text-gold-400">{r.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </TooltipAnchor>

      {/* CTA */}
      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Button variant="gold" fullWidth size="lg" onClick={() => setSent(true)}>
              Send personalised offer
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M10 5L13 8L10 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
          >
            <StatusDot status="active" />
            <span className="text-sm text-emerald-300 font-medium">Offer sent to marina.k@gmail.com</span>
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenWrapper>
  )
}
