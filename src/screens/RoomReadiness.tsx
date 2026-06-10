// Screen 2 — Predictive Ops · Room Readiness AI
// User: B2B — Housekeeping & Operations team
import { useState } from 'react'
import { motion } from 'framer-motion'
import { AppHeader, ScreenWrapper } from '../components/AppShell'
import { Card, ProgressBar, StatusDot, Divider, UserTypeBadge } from '../components/ui'
import { TooltipAnchor } from '../components/OnboardingTooltip'
import type { TooltipStep } from '../components/OnboardingTooltip'

export const roomReadinessSteps: TooltipStep[] = [
  {
    id: 'arrival-timeline',
    title: 'Flight + GPS prediction',
    body: 'Live flight data & GPS proximity trigger automatic housekeeping prioritisation — so the room is always ready before the guest arrives.',
    placement: 'bottom',
    feature: 2,
  },
  {
    id: 'room-queue',
    title: 'Smart housekeeping queue',
    body: 'Staff are assigned rooms ranked by predicted arrival time, ensuring VIP guests and early arrivals always get priority.',
    placement: 'top',
    feature: 2,
  },
]

type ArrivalStatus = 'ready' | 'cleaning' | 'pending'
const arrivals: { room: string; guest: string; flight: string; eta: string; status: ArrivalStatus; priority: string | null; hk: string; progress: number }[] = [
  { room: '1402', guest: 'The Rodriguez Family', flight: 'AA 1234', eta: '14:20', status: 'ready',    priority: 'VIP', hk: 'Sofia M.',  progress: 100 },
  { room: '0812', guest: 'Mr. Chen & Guest',     flight: 'DL 892',  eta: '15:05', status: 'cleaning', priority: 'VIP', hk: 'Carlos R.', progress: 68  },
  { room: '1105', guest: 'Ms. Laurent',          flight: 'AA 1236', eta: '15:40', status: 'cleaning', priority: null,  hk: 'Ana P.',    progress: 34  },
  { room: '0605', guest: 'Dr. & Mrs. Okonkwo',   flight: 'B6 487',  eta: '16:10', status: 'pending',  priority: null,  hk: '-',         progress: 0   },
  { room: '0320', guest: 'Smith, J.',             flight: 'AA 2020', eta: '17:30', status: 'pending',  priority: null,  hk: '-',         progress: 0   },
]

const statusConfig: Record<ArrivalStatus, { label: string; dot: 'active' | 'pending' | 'done'; pill: string }> = {
  ready:    { label: 'Ready',    dot: 'active',  pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cleaning: { label: 'In prog.', dot: 'pending', pill: 'bg-amber-50 text-amber-700 border-amber-200' },
  pending:  { label: 'Queued',   dot: 'done',    pill: 'bg-sea-100 text-ink-500 border-sea-200' },
}

const stats = [
  { label: 'On-time readiness', value: '94%',  trend: '+6%',  good: true },
  { label: 'Avg prep time',     value: '38m',   trend: '-4m',  good: true },
  { label: 'Rooms today',       value: '24',    trend: null,   good: true },
]

export function RoomReadinessScreen() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const selected = arrivals.find(a => a.room === selectedRoom)

  return (
    <ScreenWrapper className="px-4 py-3 gap-3 pb-6 bg-sea-50">
      <AppHeader
        title="Room Readiness"
        subtitle="Predictive · Live · Jun 10"
        actions={<UserTypeBadge type="b2b" />}
      />

      {/* KPI trio */}
      <div className="grid grid-cols-3 gap-2">
        {stats.map(s => (
          <div key={s.label}
            className="bg-white rounded-xl border border-sea-100 p-3 text-center"
            style={{ boxShadow: '0 1px 6px rgba(12,35,57,0.06)' }}
          >
            <p className="font-display text-xl font-medium text-navy-900">{s.value}</p>
            {s.trend && <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">{s.trend}</p>}
            <p className="text-[10px] text-ink-400 mt-1 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Arrival list */}
      <TooltipAnchor step={roomReadinessSteps[0]}>
        <Card noPad className="overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between border-b border-sea-100 bg-white">
            <div>
              <p className="text-xs font-semibold text-navy-900">Today's arrivals</p>
              <p className="text-[10px] text-ink-400 mt-0.5">Ranked by predicted arrival time</p>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
              <StatusDot status="active" pulse />
              Live
            </span>
          </div>
          <div className="divide-y divide-sea-50">
            {arrivals.map((a, i) => {
              const st = statusConfig[a.status]
              return (
                <motion.button
                  key={a.room}
                  className="w-full text-left px-4 py-2.5 hover:bg-sea-50 transition-colors"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => setSelectedRoom(a.room === selectedRoom ? null : a.room)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 flex-shrink-0 text-center">
                      <span className="text-sm font-bold text-navy-900">{a.eta.split(':')[0]}</span>
                      <span className="text-[10px] text-ink-400">:{a.eta.split(':')[1]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold text-navy-900 truncate">{a.guest}</span>
                        {a.priority === 'VIP' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-navy-700 text-white rounded-full">VIP</span>
                        )}
                      </div>
                      <p className="text-[10px] text-ink-400 mt-0.5">#{a.room} · {a.flight}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${st.pill}`}>
                        {st.label}
                      </span>
                      {a.hk !== '-' && <span className="text-[10px] text-ink-300">{a.hk}</span>}
                    </div>
                  </div>
                  {a.status === 'cleaning' && (
                    <div className="mt-2 pl-13">
                      <ProgressBar value={a.progress} color="navy" />
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </Card>
      </TooltipAnchor>

      {/* Room detail */}
      <TooltipAnchor step={roomReadinessSteps[1]}>
        {selected ? (
          <motion.div
            key={selected.room}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-sea-100 p-4 space-y-3"
            style={{ boxShadow: '0 2px 12px rgba(12,35,57,0.07)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-navy-900">Room {selected.room}</p>
                <p className="text-[10px] text-ink-400 mt-0.5">{selected.guest}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusConfig[selected.status].pill}`}>
                {statusConfig[selected.status].label}
              </span>
            </div>
            <Divider />
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Flight', value: selected.flight },
                { label: 'ETA',    value: selected.eta },
                { label: 'Staff',  value: selected.hk !== '-' ? selected.hk : 'Pending' },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-[10px] text-ink-400 uppercase tracking-wide">{item.label}</p>
                  <p className="text-xs font-semibold text-navy-900 mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
            {selected.status === 'cleaning' && (
              <ProgressBar value={selected.progress} color="navy" label="Completion" />
            )}
          </motion.div>
        ) : (
          <div className="bg-sea-50 border border-sea-200 border-dashed rounded-2xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sea-100 border border-sea-200 flex items-center justify-center text-sm text-navy-500">◈</div>
            <p className="text-xs text-ink-400">Tap a room to see details & assign staff</p>
          </div>
        )}
      </TooltipAnchor>
    </ScreenWrapper>
  )
}
