// Screen 3 — Plan Your Stay (was Itinerary Builder)
// User: Hybrid — Staff creates, Guest consumes in-app
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppHeader, ScreenWrapper } from '../components/AppShell'
import { Button, Card, Tag, SectionTitle, UserTypeBadge } from '../components/ui'
import { TooltipAnchor } from '../components/OnboardingTooltip'
import type { TooltipStep } from '../components/OnboardingTooltip'

export const itinerarySteps: TooltipStep[] = [
  {
    id: 'preferences',
    title: 'Tell us your pace',
    body: 'Pace and interests feed our generative model to produce a truly bespoke guide — every activity already included in the stay.',
    placement: 'side',
    feature: 3,
  },
  {
    id: 'generated-itinerary',
    title: 'Bespoke day-by-day guide',
    body: 'Every activity is selected and sequenced based on the specific guest profile. Staff can refine or regenerate any day with one tap.',
    placement: 'side',
    feature: 3,
  },
]

const paces     = ['Relaxed', 'Balanced', 'Active']
const interests = ['Beach & Ocean', 'Fine Dining', 'Adventure', 'Culture', 'Wellness', 'Nightlife', 'Family', 'Romance']

const generatedDays = [
  {
    day: 1, theme: 'Arrival & First Impressions',
    items: [
      { time: '15:00', title: 'Private check-in & welcome cocktail', location: 'Grand Lobby',   type: 'Hotel'    },
      { time: '17:30', title: 'Sunset catamaran sail',               location: 'Marina Dock',   type: 'Activity' },
      { time: '20:00', title: 'Alma restaurant — a la carte dinner', location: 'Tower 2, L1',  type: 'Dining'   },
    ],
  },
  {
    day: 2, theme: 'Ocean & Adventure',
    items: [
      { time: '08:00', title: 'Guided snorkel at Catalina Island',  location: 'Boat charter',   type: 'Activity' },
      { time: '13:00', title: 'Beach club lunch & ceviche bar',     location: 'Playa Grande',   type: 'Dining'   },
      { time: '16:00', title: 'Serenity Spa — couples ritual',      location: 'Spa Level 3',    type: 'Wellness' },
    ],
  },
  {
    day: 3, theme: 'Local Culture & Farewell',
    items: [
      { time: '09:00', title: 'Santo Domingo colonial city tour',   location: 'City transfer',  type: 'Culture'  },
      { time: '14:00', title: 'Chocolate & rum tasting workshop',   location: 'Casa de Campo',  type: 'Culture'  },
      { time: '19:30', title: "Chef's table farewell dinner",       location: 'Private dining', type: 'Dining'   },
    ],
  },
]

// Range of blues for type pills
const typePill: Record<string, string> = {
  Hotel:    'bg-navy-800 text-white border-navy-800',
  Activity: 'bg-navy-600/15 text-navy-800 border-navy-600/20',
  Dining:   'bg-sea-300/50 text-navy-700 border-sea-300/60',
  Wellness: 'bg-sea-200 text-navy-600 border-sea-200',
  Culture:  'bg-sea-100 text-navy-500 border-sea-200',
}

export function ItineraryBuilderScreen() {
  const [pace, setPace] = useState('Balanced')
  const [selectedInterests, setSelectedInterests] = useState(['Beach & Ocean', 'Fine Dining', 'Romance'])
  const [generated, setGenerated] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [openDay, setOpenDay] = useState<number | null>(1)

  function toggleInterest(i: string) {
    setSelectedInterests(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    )
  }

  function handleGenerate() {
    setGenerating(true)
    setTimeout(() => { setGenerating(false); setGenerated(true) }, 1600)
  }

  return (
    <ScreenWrapper className="px-4 py-3 gap-3 pb-6 bg-sea-50">
      <AppHeader
        title="Plan Your Stay"
        subtitle="Personalised · Punta Cana"
        actions={<UserTypeBadge type="hybrid" />}
      />

      {!generated ? (
        <>
          <TooltipAnchor step={itinerarySteps[0]}>
            <Card className="space-y-4">
              <SectionTitle label="Tell us a bit about you" title="How do you like to travel?" />

              <div>
                <p className="text-[10px] uppercase tracking-widest text-ink-400 mb-2 font-semibold">Pace</p>
                <div className="flex gap-1.5">
                  {paces.map(p => (
                    <Tag key={p} active={pace === p} onClick={() => setPace(p)}>{p}</Tag>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-ink-400 mb-2 font-semibold">Interests</p>
                <div className="flex flex-wrap gap-1.5">
                  {interests.map(i => (
                    <Tag key={i} active={selectedInterests.includes(i)} onClick={() => toggleInterest(i)}>{i}</Tag>
                  ))}
                </div>
              </div>
            </Card>
          </TooltipAnchor>

          <Button variant="primary" fullWidth size="lg" onClick={handleGenerate} disabled={generating}>
            {generating ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block"
                />
                Building your plan…
              </span>
            ) : (
              <>Build my stay ✦</>
            )}
          </Button>
        </>
      ) : (
        <>
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-navy-700 text-white uppercase tracking-wide inline-block mb-1">
                AI Generated
              </span>
              <h3 className="font-display text-lg text-navy-900">Your Punta Cana stay</h3>
              <p className="text-xs text-ink-500 mt-0.5">{pace} pace · {selectedInterests.slice(0, 2).join(', ')}</p>
            </div>
            <button onClick={() => setGenerated(false)}
              className="text-xs text-navy-600 font-semibold hover:text-navy-800 bg-sea-100 px-3 py-1.5 rounded-full border border-sea-200 transition-colors flex-shrink-0">
              Redo
            </button>
          </motion.div>

          <TooltipAnchor step={itinerarySteps[1]}>
            <div className="space-y-2">
              {generatedDays.map((day, di) => (
                <motion.div key={day.day}
                  className="bg-white rounded-2xl border border-sea-100 overflow-hidden"
                  style={{ boxShadow: '0 1px 6px rgba(12,35,57,0.06)' }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: di * 0.08 }}
                >
                  <button
                    className="w-full flex items-center justify-between px-4 py-3"
                    onClick={() => setOpenDay(openDay === day.day ? null : day.day)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-navy-700 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {day.day}
                      </span>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-navy-900">Day {day.day}</p>
                        <p className="text-[10px] text-ink-400">{day.theme}</p>
                      </div>
                    </div>
                    <motion.span animate={{ rotate: openDay === day.day ? 180 : 0 }} className="text-ink-300">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {openDay === day.day && (
                      <motion.div
                        initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-sea-100 divide-y divide-sea-50">
                          {day.items.map(item => (
                            <div key={item.title} className="flex gap-3 px-4 py-2.5">
                              <span className="text-[10px] text-ink-400 w-10 flex-shrink-0 pt-0.5 font-medium">{item.time}</span>
                              <div className="flex-1">
                                <p className="text-xs font-medium text-navy-900 leading-snug">{item.title}</p>
                                <p className="text-[10px] text-ink-400 mt-0.5">{item.location}</p>
                              </div>
                              <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border h-fit flex-shrink-0 ${typePill[item.type]}`}>
                                {item.type}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </TooltipAnchor>

          <Button variant="outline" fullWidth>
            Share with guest
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7V11a1 1 0 001 1h8a1 1 0 001-1V7M7 1v7M4.5 3.5L7 1L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
        </>
      )}
    </ScreenWrapper>
  )
}
