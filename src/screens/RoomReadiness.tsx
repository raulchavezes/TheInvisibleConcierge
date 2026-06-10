// Screen 2 — Predictive Ops · Room Readiness AI
import { useState } from 'react'
import { motion } from 'framer-motion'
import { AppHeader, ScreenWrapper } from '../components/AppShell'
import { Badge, Card, ProgressBar, StatusDot, Divider } from '../components/ui'
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

const statusConfig: Record<ArrivalStatus, { label: string; dot: 'active' | 'pending' | 'done'; color: string }> = {
  ready:    { label: 'Ready',    dot: 'active',  color: 'text-emerald-300' },
  cleaning: { label: 'In prog.', dot: 'pending', color: 'text-gold-400' },
  pending:  { label: 'Queued',   dot: 'done',    color: 'text-white/40' },
}

const stats = [
  { label: 'On-time readiness', value: '94%',  trend: '+6%' },
  { label: 'Avg prep time',     value: '38m',   trend: '-4m' },
  { label: 'Rooms today',       value: '24',    trend: null },
]

export function RoomReadinessScreen() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const selected = arrivals.find(a => a.room === selectedRoom)

  return (
    <ScreenWrapper className="px-4 py-3 gap-4 pb-6">
      <AppHeader title="Room Readiness" subtitle="Predictive · Live · Jun 10" />

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-2">
        {stats.map(s => (
          <div key={s.label} className="glass p-3 text-center">
            <p className="text-lg font-display font-medium text-white">{s.value}</p>
            {s.trend && <p className="text-2xs text-emerald-400 mt-0.5">{s.trend}</p>}
            <p className="text-2xs text-white/35 mt-1 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Arrival timeline */}
      <TooltipAnchor step={roomReadinessSteps[0]}>
        <Card className="p-0 overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between border-b border-white/[0.06]">
            <div>
              <p className="text-xs font-semibold text-white">Today's arrivals</p>
              <p className="text-2xs text-white/35 mt-0.5">Ranked by predicted arrival</p>
            </div>
            <Badge variant="teal">Live</Badge>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {arrivals.map((a, i) => (
              <motion.button
                key={a.room}
                className="w-full text-left px-4 py-3 hover:bg-white/[0.03] transition-colors"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => setSelectedRoom(a.room === selectedRoom ? null : a.room)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center w-10 flex-shrink-0">
                    <span className="text-sm font-bold text-white">{a.eta.split(':')[0]}</span>
                    <span className="text-2xs text-white/35">:{a.eta.split(':')[1]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-white truncate">{a.guest}</span>
                      {a.priority === 'VIP' && <Badge variant="gold">VIP</Badge>}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-2xs text-white/35">#{a.room}</span>
                      <span className="text-2xs text-white/25">·</span>
                      <span className="text-2xs text-white/35">{a.flight}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5">
                      <StatusDot status={statusConfig[a.status].dot} pulse={a.status === 'cleaning'} />
                      <span className={`text-2xs font-medium ${statusConfig[a.status].color}`}>
                        {statusConfig[a.status].label}
                      </span>
                    </div>
                    {a.hk !== '—' && <span className="text-2xs text-white/25">{a.hk}</span>}
                  </div>
                </div>
                {/* Progress bar for in-progress rooms */}
                {a.status === 'cleaning' && (
                  <div className="mt-2 pl-13">
                    <ProgressBar value={a.progress} color="gold" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </Card>
      </TooltipAnchor>

      {/* Room detail panel */}
      <TooltipAnchor step={roomReadinessSteps[1]}>
        {selected ? (
          <motion.div
            key={selected.room}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Room {selected.room} detail</p>
                <p className="text-2xs text-white/35 mt-0.5">{selected.guest}</p>
              </div>
              <Badge variant={selected.status === 'ready' ? 'teal' : 'gold'}>
                {statusConfig[selected.status].label}
              </Badge>
            </div>
            <Divider />
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Flight', value: selected.flight },
                { label: 'ETA', value: selected.eta },
                { label: 'Assigned', value: selected.hk !== '—' ? selected.hk : 'Pending' },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-2xs text-white/30 uppercase tracking-wide">{item.label}</p>
                  <p className="text-xs font-medium text-white mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
            {selected.status === 'cleaning' && (
              <ProgressBar value={selected.progress} color="gold" label="Completion" />
            )}
          </motion.div>
        ) : (
          <div className="glass p-4 flex items-center gap-3 opacity-40">
            <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center text-sm">◈</div>
            <p className="text-xs text-white/50">Tap a room to see details & assign staff</p>
          </div>
        )}
      </TooltipAnchor>
    </ScreenWrapper>
  )
}
