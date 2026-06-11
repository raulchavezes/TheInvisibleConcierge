import { useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AppShell, BottomNav } from './components/AppShell'
import { OnboardingProvider } from './components/OnboardingTooltip'
import { UserTypeBadge } from './components/ui'
import { SocialAIScreen, socialAISteps } from './screens/SocialAI'
import { RoomReadinessScreen, roomReadinessSteps } from './screens/RoomReadiness'
import { ItineraryBuilderScreen, itinerarySteps } from './screens/ItineraryBuilder'
import { InvisibleConciergeScreen, invisibleConciergeSteps } from './screens/InvisibleConcierge'

type TabId = 'social' | 'rooms' | 'itinerary' | 'concierge'

const FEATURE_TAB: Record<number, TabId> = {
  1: 'social',
  2: 'rooms',
  3: 'itinerary',
  4: 'concierge',
}

const TAB_FEATURE: Record<TabId, number> = {
  social: 1, rooms: 2, itinerary: 3, concierge: 4,
}

const TABS: { id: TabId; label: string; icon: string; userType: 'b2b' | 'b2c' | 'hybrid' }[] = [
  { id: 'social',     label: 'Discover',  icon: '✦', userType: 'b2b'    },
  { id: 'rooms',      label: 'Rooms',     icon: '◈', userType: 'b2b'    },
  { id: 'itinerary',  label: 'Plan',      icon: '◉', userType: 'b2c'    },
  { id: 'concierge',  label: 'Concierge', icon: '◎', userType: 'b2b'    },
]

const ALL_STEPS = [
  ...socialAISteps,
  ...roomReadinessSteps,
  ...itinerarySteps,
  ...invisibleConciergeSteps,
]

const DESCRIPTIONS: Record<TabId, {
  tag: string
  headline: string
  body: string
  userType: 'b2b' | 'b2c' | 'hybrid'
  intendedUser: string
}> = {
  social: {
    tag: 'Discovery · Social AI',
    headline: 'Intent-driven outreach',
    body: 'AI monitors social signals to trigger personalised outreach at the exact moment of travel intent — before they book elsewhere.',
    userType: 'b2b',
    intendedUser: 'Marketing & Sales team',
  },
  rooms: {
    tag: 'Predictive Ops · Room Readiness',
    headline: 'Housekeeping by arrival prediction',
    body: 'Live flight data + GPS proximity feeds a real-time priority queue, ensuring every room is ready before the guest arrives.',
    userType: 'b2b',
    intendedUser: 'Housekeeping & Operations',
  },
  itinerary: {
    tag: 'Generative Content · Plan Your Stay',
    headline: 'A stay designed around you',
    body: 'Guests set their pace and interests; a generative model builds a fully personalised day-by-day guide — every activity already included in their stay.',
    userType: 'b2c',
    intendedUser: 'Guest-facing · Self-service',
  },
  concierge: {
    tag: 'Proactive Service · Behavioural AI',
    headline: 'The invisible concierge',
    body: 'AI detects patterns — coffee at 7am, evening spa — and proactively stages service before the guest even thinks to ask.',
    userType: 'b2b',
    intendedUser: 'Concierge & Guest Relations',
  },
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('social')
  const [tourKey, setTourKey] = useState(0)
  const [tourStarted, setTourStarted] = useState(false)
  const [tourDone, setTourDone] = useState(false)
  const tourJumpRef = useRef<((index: number) => void) | null>(null)

  const tourRunning = tourStarted && !tourDone

  function startTour() {
    setTourKey(k => k + 1)
    setTourStarted(true)
    setTourDone(false)
    setActiveTab('social')
  }

  function handleTabChange(tab: TabId) {
    setActiveTab(tab)
    if (tourRunning) {
      const firstIdx = ALL_STEPS.findIndex(s => s.feature === TAB_FEATURE[tab])
      if (firstIdx >= 0) tourJumpRef.current?.(firstIdx)
    }
  }

  const desc = DESCRIPTIONS[activeTab]

  return (
    <div className="min-h-screen bg-gradient-sea">
      {/* Page header */}
      <div className="max-w-2xl mx-auto px-6 pt-8 pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-navy-500 font-semibold mb-1">
              Palace Company
            </p>
            <h1 className="font-display text-2xl text-navy-900 font-medium leading-tight">
              The Invisible Concierge
            </h1>
            <p className="text-xs text-ink-500 mt-1">AI Feature Exploration · Punta Cana</p>
          </div>

          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            {tourDone && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                <span className="text-emerald-600 text-[10px]">✓</span>
                <span className="text-[10px] text-emerald-700 font-semibold">Tour complete</span>
              </div>
            )}
            <motion.button
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              onClick={startTour}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-navy-700 text-navy-700 bg-white hover:bg-sea-100 transition-colors text-xs font-semibold whitespace-nowrap"
            >
              <span className="text-sm">✦</span>
              {tourDone || tourRunning ? 'Restart tour' : 'Start tour'}
            </motion.button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 mt-5 overflow-x-auto scrollbar-none pb-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={[
                'flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border flex-shrink-0',
                activeTab === tab.id
                  ? 'bg-navy-700 text-white border-navy-700 shadow-navy'
                  : 'bg-white text-ink-500 border-sea-200 hover:text-navy-700 hover:border-navy-400',
              ].join(' ')}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Feature description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 pb-2"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest text-navy-500/70 font-semibold mb-1">{desc.tag}</p>
                <h2 className="font-display text-base text-navy-900 font-medium">{desc.headline}</h2>
                <p className="text-xs text-ink-500 leading-relaxed mt-1 max-w-xs">{desc.body}</p>
              </div>
              <div className="flex-shrink-0 flex flex-col items-end gap-1.5 pt-1">
                <UserTypeBadge type={desc.userType} />
                <p className="text-[10px] text-ink-400 text-right leading-tight max-w-[120px]">{desc.intendedUser}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Phone mockup — full width context, overflow visible for tooltips */}
      <div className="max-w-2xl mx-auto">
        <OnboardingProvider
          key={tourKey}
          steps={tourStarted ? ALL_STEPS : []}
          jumpRef={tourJumpRef}
          onComplete={() => setTourDone(true)}
          onStepChange={(step) => setActiveTab(FEATURE_TAB[step.feature])}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <AppShell
                footer={
                  <BottomNav items={TABS.map(t => ({
                    icon: t.icon,
                    label: t.label,
                    active: t.id === activeTab,
                    onClick: () => handleTabChange(t.id),
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
    </div>
  )
}
