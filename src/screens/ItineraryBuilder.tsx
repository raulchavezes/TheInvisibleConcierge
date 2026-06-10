// Screen 3 — Generative Content · Bespoke Itinerary Builder
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppHeader, ScreenWrapper } from '../components/AppShell'
import { Badge, Button, Card, Tag, SectionTitle } from '../components/ui'
import { TooltipAnchor } from '../components/OnboardingTooltip'
import type { TooltipStep } from '../components/OnboardingTooltip'

export const itinerarySteps: TooltipStep[] = [
  {
    id: 'preferences',
    title: 'Tell us your pace',
    body: 'Duration, tempo, and interests feed our generative model to produce a truly bespoke local guide — not a generic template.',
    placement: 'bottom',
    feature: 3,
  },
  {
    id: 'generated-itinerary',
    title: 'Bespoke day guide',
    body: 'Every activity is selected and sequenced based on your specific profile. The team can refine or regenerate any day with one tap.',
    placement: 'top',
    feature: 3,
  },
]

const durations = ['3 nights', '5 nights', '7 nights', '10 nights']
const paces = ['Relaxed', 'Balanced', 'Active']
const interests = ['Beach & Ocean', 'Fine Dining', 'Adventure', 'Culture', 'Wellness', 'Nightlife', 'Family', 'Romance']

const generatedDays = [
  {
    day: 1,
    theme: 'Arrival & First Impressions',
    items: [
      { time: '15:00', title: 'Private check-in & welcome cocktail', location: 'Grand Lobby',   type: 'Hotel' },
      { time: '17:30', title: 'Sunset catamaran sail',               location: 'Marina Dock',   type: 'Activity' },
      { time: '20:00', title: 'Alma restaurant — á la carte dinner', location: 'Tower 2, L1',   type: 'Dining' },
    ],
  },
  {
    day: 2,
    theme: 'Ocean & Adventure',
    items: [
      { time: '08:00', title: 'Guided snorkel at Catalina Island',  location: 'Boat charter',   type: 'Activity' },
      { time: '13:00', title: 'Beach club lunch & ceviche bar',      location: 'Playa Grande',   type: 'Dining' },
      { time: '16:00', title: 'Serenity Spa — couples ritual',       location: 'Spa Level 3',    type: 'Wellness' },
    ],
  },
  {
    day: 3,
    theme: 'Local Culture & Farewell',
    items: [
      { time: '09:00', title: 'Santo Domingo colonial city tour',    location: 'City transfer',  type: 'Culture' },
      { time: '14:00', title: 'Chocolate & rum tasting workshop',    location: 'Casa de Campo',  type: 'Culture' },
      { time: '19:30', title: "Chef's table farewell dinner",        location: 'Private dining',  type: 'Dining' },
    ],
  },
]

const typeColors: Record<string, string> = {
  Hotel:    'text-violet-300',
  Activity: 'text-teal-300',
  Dining:   'text-amber-300',
  Wellness: 'text-rose-300',
  Culture:  'text-blue-300',
}

export function ItineraryBuilderScreen() {
  const [duration, setDuration] = useState('5 nights')
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
    setTimeout(() => { setGenerating(false); setGenerated(true) }, 1800)
  }

  return (
    <ScreenWrapper className="px-4 py-3 gap-4 pb-6">
      <AppHeader title="Itinerary Builder" subtitle="Generative · Personalised" />

      {!generated ? (
        <>
          {/* Preferences */}
          <TooltipAnchor step={itinerarySteps[0]}>
            <Card className="space-y-4">
              <SectionTitle label="Step 1" title="Set your preferences" />

              <div>
                <p className="text-2xs uppercase tracking-widest text-white/30 mb-2 font-medium">Duration</p>
                <div className="flex gap-2 flex-wrap">
                  {durations.map(d => (
                    <Tag key={d} active={duration === d} onClick={() => setDuration(d)}>{d}</Tag>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-2xs uppercase tracking-widest text-white/30 mb-2 font-medium">Pace</p>
                <div className="flex gap-2">
                  {paces.map(p => (
                    <Tag key={p} active={pace === p} onClick={() => setPace(p)}>{p}</Tag>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-2xs uppercase tracking-widest text-white/30 mb-2 font-medium">Interests (select all that apply)</p>
                <div className="flex flex-wrap gap-2">
                  {interests.map(i => (
                    <Tag key={i} active={selectedInterests.includes(i)} onClick={() => toggleInterest(i)}>{i}</Tag>
                  ))}
                </div>
              </div>
            </Card>
          </TooltipAnchor>

          {/* Generate button */}
          <Button
            variant="gold"
            fullWidth
            size="lg"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full inline-block"
                />
                Generating your itinerary…
              </span>
            ) : (
              <>
                Generate bespoke itinerary
                <span className="text-navy-700">✦</span>
              </>
            )}
          </Button>
        </>
      ) : (
        <>
          {/* Result header */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <Badge variant="gold">AI Generated</Badge>
              <h3 className="font-display text-lg text-white mt-1.5">
                {duration} in Punta Cana
              </h3>
              <p className="text-xs text-white/40 mt-0.5">{pace} pace · {selectedInterests.slice(0, 2).join(', ')}</p>
            </div>
            <button
              onClick={() => setGenerated(false)}
              className="text-2xs text-gold-500/70 hover:text-gold-400 font-medium"
            >
              Regenerate
            </button>
          </motion.div>

          {/* Day accordion */}
          <TooltipAnchor step={itinerarySteps[1]}>
            <div className="space-y-2">
              {generatedDays.map((day, di) => (
                <motion.div
                  key={day.day}
                  className="glass overflow-hidden"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: di * 0.1 }}
                >
                  <button
                    className="w-full flex items-center justify-between px-4 py-3"
                    onClick={() => setOpenDay(openDay === day.day ? null : day.day)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-gold-500/15 border border-gold-500/25 text-gold-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {day.day}
                      </span>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-white">Day {day.day}</p>
                        <p className="text-2xs text-white/40">{day.theme}</p>
                      </div>
                    </div>
                    <motion.span
                      animate={{ rotate: openDay === day.day ? 180 : 0 }}
                      className="text-white/30"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {openDay === day.day && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/[0.06] divide-y divide-white/[0.04]">
                          {day.items.map(item => (
                            <div key={item.title} className="flex gap-3 px-4 py-2.5">
                              <span className="text-2xs text-white/30 w-10 flex-shrink-0 pt-0.5">{item.time}</span>
                              <div className="flex-1">
                                <p className="text-xs font-medium text-white leading-snug">{item.title}</p>
                                <p className="text-2xs text-white/35 mt-0.5">{item.location}</p>
                              </div>
                              <span className={`text-2xs font-medium flex-shrink-0 ${typeColors[item.type]}`}>
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

          <Button variant="secondary" fullWidth>
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
