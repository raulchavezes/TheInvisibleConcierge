import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AppShell, BottomNav } from './components/AppShell'
import { OnboardingProvider } from './components/OnboardingTooltip'
import { SocialAIScreen, socialAISteps } from './screens/SocialAI'
import { RoomReadinessScreen, roomReadinessSteps } from './screens/RoomReadiness'
import { ItineraryBuilderScreen, itinerarySteps } from './screens/ItineraryBuilder'
import { InvisibleConciergeScreen, invisibleConciergeSteps } from './screens/InvisibleConcierge'

type TabId = 'social' | 'rooms' | 'itinerary' | 'concierge'

const TABS: { id: TabId; label: string; icon: string; emoji: string }[] = [
  { id: 'social',     label: 'Discover',  icon: '✦', emoji: '✦' },
  { id: 'rooms',      label: 'Rooms',     icon: '◈', emoji: '◈' },
  { id: 'itinerary',  label: 'Journey',   icon: '◉', emoji: '◉' },
  { id: 'concierge',  label: 'Concierge', icon: '◎', emoji: '◎' },
]

const ALL_STEPS = [
  ...socialAISteps,
  ...roomReadinessSteps,
  ...itinerarySteps,
  ...invisibleConciergeSteps,
]

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('social')
  const [tourStarted, setTourStarted] = useState(false)
  const [tourDone, setTourDone] = useState(false)

  return (
    <div className="min-h-screen bg-navy-950">
      {/* Top strip — meta branding */}
      <div className="flex items-center justify-between px-6 pt-6 pb-3 max-w-2xl mx-auto">
        <div>
          <p className="text-2xs uppercase tracking-[0.2em] text-gold-500/60 font-medium">Palace Company</p>
          <h1 className="font-display text-xl text-white mt-0.5">The Invisible Concierge</h1>
          <p className="text-xs text-white/30 mt-0.5">AI Feature Exploration — Mare Design System</p>
        </div>
        {!tourStarted && !tourDone && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            onClick={() => setTourStarted(true)}
            className="flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl bg-gold-500/10 border border-gold-500/25 hover:bg-gold-500/15 transition-colors"
          >
            <span className="text-lg">✦</span>
            <span className="text-2xs font-semibold text-gold-400 whitespace-nowrap">Start tour</span>
          </motion.button>
        )}
        {tourDone && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-emerald-400 text-xs">✓</span>
            <span className="text-2xs text-emerald-300 font-medium">Tour complete</span>
          </div>
        )}
      </div>

      {/* Feature tab selector */}
      <div className="flex gap-2 px-6 pb-4 max-w-2xl mx-auto overflow-x-auto scrollbar-none">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 border',
              activeTab === tab.id
                ? 'bg-navy-700 text-white border-white/15 shadow-card'
                : 'bg-white/[0.03] text-white/40 border-white/[0.06] hover:text-white/60 hover:bg-white/[0.06]'
            ].join(' ')}
          >
            <span className={activeTab === tab.id ? 'text-gold-400' : ''}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feature description */}
      <FeatureDescription tab={activeTab} />

      {/* Phone mockup */}
      <OnboardingProvider
        steps={tourStarted ? ALL_STEPS : []}
        onComplete={() => setTourDone(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <AppShell
              footer={
                <BottomNav items={TABS.map(t => ({
                  icon: t.emoji,
                  label: t.label,
                  active: t.id === activeTab,
                  onClick: () => setActiveTab(t.id),
                }))} />
              }
            >
              {activeTab === 'social'    && <SocialAIScreen />}
              {activeTab === 'rooms'     && <RoomReadinessScreen />}
              {activeTab === 'itinerary' && <ItineraryBuilderScreen />}
              {activeTab === 'concierge' && <InvisibleConciergeScreen />}
            </AppShell>
          </motion.div>
        </AnimatePresence>
      </OnboardingProvider>
    </div>
  )
}

// ─── Feature description strip ────────────────────────────────────────────────
const DESCRIPTIONS: Record<TabId, { tag: string; headline: string; body: string }> = {
  social: {
    tag: 'Discovery · Social AI',
    headline: 'Intent-driven outreach',
    body: 'AI monitors social signals to trigger personalised outreach at the exact moment of travel intent — before they book elsewhere.',
  },
  rooms: {
    tag: 'Predictive Ops · Room Readiness',
    headline: 'Housekeeping by arrival prediction',
    body: 'Live flight data + GPS proximity feeds a real-time priority queue, ensuring every room is ready before the guest arrives.',
  },
  itinerary: {
    tag: 'Generative Content · Itinerary Builder',
    headline: 'Bespoke local guides, not templates',
    body: 'Duration, pace, and interests feed a generative model to produce fully personalised day-by-day itineraries for Punta Cana.',
  },
  concierge: {
    tag: 'Proactive Service · Behavioural AI',
    headline: 'The invisible concierge',
    body: 'AI detects patterns — coffee at 7am, evening spa — and proactively stages service before the guest even thinks to ask.',
  },
}

function FeatureDescription({ tab }: { tab: TabId }) {
  const d = DESCRIPTIONS[tab]
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="px-6 pb-5 max-w-2xl mx-auto"
      >
        <p className="text-2xs uppercase tracking-widest text-gold-500/60 font-medium mb-1">{d.tag}</p>
        <h2 className="font-display text-base text-white/90 mb-1">{d.headline}</h2>
        <p className="text-xs text-white/40 leading-relaxed max-w-sm">{d.body}</p>
      </motion.div>
    </AnimatePresence>
  )
}
