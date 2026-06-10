// Mare UI Kit — light palette primitives
import { type ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import clsx from 'clsx'

// ─── Badge ────────────────────────────────────────────────────────────────────
interface BadgeProps {
  children: ReactNode
  variant?: 'navy' | 'sea' | 'teal' | 'rose' | 'amber' | 'b2b' | 'b2c' | 'included'
  size?: 'sm' | 'md'
}
export function Badge({ children, variant = 'sea', size = 'sm' }: BadgeProps) {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1 font-sans font-medium tracking-wide',
      size === 'sm' ? 'text-[10px] px-2 py-0.5 rounded-full uppercase' : 'text-xs px-3 py-1 rounded-full',
      {
        'bg-navy-700 text-white':                         variant === 'navy',
        'bg-sea-100 text-navy-700 border border-sea-200': variant === 'sea',
        'bg-teal-50 text-teal-700 border border-teal-100':variant === 'teal',
        'bg-rose-50 text-rose-600 border border-rose-100':variant === 'rose',
        'bg-amber-50 text-amber-700 border border-amber-100': variant === 'amber',
        // B2B = staff tool (navy/operational)
        'bg-navy-700/10 text-navy-800 border border-navy-700/20 font-semibold': variant === 'b2b',
        // B2C = guest-facing (sea/warm)
        'bg-sea-200 text-navy-700 border border-sea-300 font-semibold': variant === 'b2c',
        // Included tag (from Mare screenshots)
        'bg-white text-ink-900 border border-sea-100 shadow-sm': variant === 'included',
      }
    )}>
      {children}
    </span>
  )
}

// ─── Button ───────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  fullWidth?: boolean
}
export function Button({ variant = 'primary', size = 'md', children, fullWidth, className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-sans font-medium rounded-xl transition-all duration-200 select-none disabled:opacity-50',
        fullWidth && 'w-full',
        {
          'sm': 'text-xs px-3 py-1.5',
          'md': 'text-sm px-4 py-2.5',
          'lg': 'text-sm px-5 py-3',
        }[size],
        {
          'primary':   'bg-navy-700 text-white hover:bg-navy-800 shadow-navy',
          'secondary': 'bg-sea-100 text-navy-700 hover:bg-sea-200 border border-sea-200',
          'ghost':     'text-navy-600 hover:text-navy-800 hover:bg-sea-100',
          'outline':   'bg-white text-navy-700 border border-sea-200 hover:border-navy-600 hover:bg-sea-50',
        }[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  className?: string
  noPad?: boolean
}
export function Card({ children, className, noPad, ...props }: CardProps) {
  return (
    <motion.div
      className={clsx(
        'bg-white rounded-2xl border border-sea-100',
        !noPad && 'p-4',
        className
      )}
      style={{ boxShadow: '0 2px 12px 0 rgba(12,35,57,0.07), 0 1px 3px 0 rgba(12,35,57,0.04)' }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// ─── Section title ────────────────────────────────────────────────────────────
interface SectionTitleProps {
  label?: string
  title: string
  subtitle?: string
}
export function SectionTitle({ label, title, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-4">
      {label && (
        <p className="text-[10px] uppercase tracking-widest font-semibold mb-1.5 text-navy-500/80">
          {label}
        </p>
      )}
      <h2 className="font-display text-xl font-medium leading-snug text-navy-900">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1 text-sm leading-relaxed text-ink-500">{subtitle}</p>
      )}
    </div>
  )
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
interface AvatarProps {
  initials: string
  size?: 'sm' | 'md' | 'lg'
  src?: string
}
export function Avatar({ initials, size = 'md', src }: AvatarProps) {
  const sizes = { sm: 'w-7 h-7 text-[10px]', md: 'w-9 h-9 text-xs', lg: 'w-11 h-11 text-sm' }
  return (
    <div className={clsx(
      'rounded-full flex items-center justify-center font-semibold overflow-hidden flex-shrink-0',
      sizes[size],
      !src && 'bg-sea-200 text-navy-700 border border-sea-300'
    )}>
      {src ? <img src={src} alt="" className="w-full h-full object-cover" /> : initials}
    </div>
  )
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function Divider({ className }: { className?: string }) {
  return <div className={clsx('w-full h-px bg-sea-100', className)} />
}

// ─── StatusDot ────────────────────────────────────────────────────────────────
interface StatusDotProps {
  status: 'active' | 'pending' | 'done' | 'alert'
  pulse?: boolean
}
export function StatusDot({ status, pulse }: StatusDotProps) {
  const colors = {
    active:  'bg-emerald-500',
    pending: 'bg-amber-400',
    done:    'bg-navy-500',
    alert:   'bg-rose-500',
  }
  return (
    <span className="relative flex h-2 w-2 flex-shrink-0">
      {pulse && <span className={clsx('animate-ping absolute inline-flex h-full w-full rounded-full opacity-60', colors[status])} />}
      <span className={clsx('relative inline-flex rounded-full h-2 w-2', colors[status])} />
    </span>
  )
}

// ─── ProgressBar ─────────────────────────────────────────────────────────────
interface ProgressBarProps {
  value: number
  max?: number
  color?: 'navy' | 'teal' | 'rose' | 'amber'
  label?: string
}
export function ProgressBar({ value, max = 100, color = 'navy', label }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  const colors = {
    navy:  'bg-navy-700',
    teal:  'bg-teal-500',
    rose:  'bg-rose-400',
    amber: 'bg-amber-400',
  }
  return (
    <div>
      {label && (
        <div className="flex justify-between text-[10px] text-ink-500 mb-1">
          <span>{label}</span><span>{pct}%</span>
        </div>
      )}
      <div className="h-1 bg-sea-100 rounded-full overflow-hidden">
        <motion.div
          className={clsx('h-full rounded-full', colors[color])}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// ─── Tag / chip ───────────────────────────────────────────────────────────────
export function Tag({ children, onClick, active }: { children: ReactNode; onClick?: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'text-xs px-3 py-1.5 rounded-full border font-sans font-medium transition-all duration-200',
        active
          ? 'bg-navy-700 border-navy-700 text-white'
          : 'bg-white border-sea-200 text-ink-700 hover:border-navy-500 hover:text-navy-700'
      )}
    >
      {children}
    </button>
  )
}

// ─── UserType label ───────────────────────────────────────────────────────────
export function UserTypeBadge({ type }: { type: 'b2b' | 'b2c' | 'hybrid' }) {
  const config = {
    b2b:    { label: 'Staff · B2B',        icon: '⚙', cls: 'bg-navy-700/10 text-navy-800 border-navy-700/20' },
    b2c:    { label: 'Guest-facing · B2C', icon: '◎', cls: 'bg-sea-200 text-navy-700 border-sea-300' },
    hybrid: { label: 'Staff + Guest',      icon: '◈', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  }
  const c = config[type]
  return (
    <span className={clsx('inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full border', c.cls)}>
      <span>{c.icon}</span>
      {c.label}
    </span>
  )
}
