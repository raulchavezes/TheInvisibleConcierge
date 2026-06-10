// Mare UI Kit — shared primitives
import { type ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import clsx from 'clsx'

// ─── Badge ────────────────────────────────────────────────────────────────────
interface BadgeProps {
  children: ReactNode
  variant?: 'gold' | 'teal' | 'rose' | 'slate' | 'glass'
  size?: 'sm' | 'md'
}
export function Badge({ children, variant = 'glass', size = 'sm' }: BadgeProps) {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1 font-sans font-medium tracking-wide uppercase',
      size === 'sm' ? 'text-2xs px-2 py-0.5 rounded-full' : 'text-xs px-3 py-1 rounded-full',
      {
        'bg-gold-500/15 text-gold-400 border border-gold-500/30': variant === 'gold',
        'bg-teal-500/15 text-teal-300 border border-teal-500/30': variant === 'teal',
        'bg-rose-500/15 text-rose-300 border border-rose-500/30': variant === 'rose',
        'bg-white/10 text-white/60 border border-white/10': variant === 'slate',
        'bg-white/[0.06] text-white/50 border border-white/10': variant === 'glass',
      }
    )}>
      {children}
    </span>
  )
}

// ─── Button ───────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  fullWidth?: boolean
}
export function Button({ variant = 'primary', size = 'md', children, fullWidth, className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-sans font-medium rounded-xl transition-all duration-200 select-none',
        fullWidth && 'w-full',
        {
          'sm': 'text-xs px-3 py-1.5',
          'md': 'text-sm px-4 py-2.5',
          'lg': 'text-base px-6 py-3',
        }[size],
        {
          'primary':   'bg-navy-700 text-white hover:bg-navy-600 border border-white/10',
          'secondary': 'bg-white/[0.06] text-white/80 hover:bg-white/10 border border-white/10',
          'ghost':     'text-white/60 hover:text-white hover:bg-white/[0.06]',
          'gold':      'bg-gradient-gold text-navy-900 font-semibold hover:opacity-90 shadow-gold',
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
  glow?: boolean
  className?: string
}
export function Card({ children, glow, className, ...props }: CardProps) {
  return (
    <motion.div
      className={clsx(
        'glass p-4',
        glow && 'shadow-glow',
        className
      )}
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
  light?: boolean
}
export function SectionTitle({ label, title, subtitle, light }: SectionTitleProps) {
  return (
    <div className="mb-6">
      {label && (
        <p className={clsx('text-2xs uppercase tracking-widest font-medium mb-2', light ? 'text-gold-500' : 'text-gold-500/80')}>
          {label}
        </p>
      )}
      <h2 className={clsx('font-display text-2xl font-medium leading-snug', light ? 'text-cream-100' : 'text-white')}>
        {title}
      </h2>
      {subtitle && (
        <p className={clsx('mt-1.5 text-sm leading-relaxed', light ? 'text-white/50' : 'text-white/40')}>
          {subtitle}
        </p>
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
  const sizes = { sm: 'w-7 h-7 text-2xs', md: 'w-9 h-9 text-xs', lg: 'w-12 h-12 text-sm' }
  return (
    <div className={clsx('rounded-full flex items-center justify-center font-medium overflow-hidden flex-shrink-0', sizes[size], !src && 'bg-gradient-to-br from-gold-600/40 to-navy-700 text-gold-300 border border-gold-500/20')}>
      {src ? <img src={src} alt="" className="w-full h-full object-cover" /> : initials}
    </div>
  )
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function Divider({ className }: { className?: string }) {
  return <div className={clsx('w-full h-px bg-white/[0.06]', className)} />
}

// ─── StatusDot ────────────────────────────────────────────────────────────────
interface StatusDotProps {
  status: 'active' | 'pending' | 'done' | 'alert'
  pulse?: boolean
}
export function StatusDot({ status, pulse }: StatusDotProps) {
  const colors = {
    active:  'bg-emerald-400',
    pending: 'bg-gold-500',
    done:    'bg-blue-400',
    alert:   'bg-rose-400',
  }
  return (
    <span className="relative flex h-2 w-2">
      {pulse && <span className={clsx('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', colors[status])} />}
      <span className={clsx('relative inline-flex rounded-full h-2 w-2', colors[status])} />
    </span>
  )
}

// ─── ProgressBar ─────────────────────────────────────────────────────────────
interface ProgressBarProps {
  value: number
  max?: number
  color?: 'gold' | 'teal' | 'rose'
  label?: string
}
export function ProgressBar({ value, max = 100, color = 'gold', label }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  const colors = {
    gold: 'bg-gradient-to-r from-gold-600 to-gold-400',
    teal: 'bg-gradient-to-r from-teal-600 to-teal-400',
    rose: 'bg-gradient-to-r from-rose-600 to-rose-400',
  }
  return (
    <div>
      {label && <div className="flex justify-between text-2xs text-white/40 mb-1"><span>{label}</span><span>{pct}%</span></div>}
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={clsx('h-full rounded-full', colors[color])}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// ─── Tag ──────────────────────────────────────────────────────────────────────
export function Tag({ children, onClick, active }: { children: ReactNode; onClick?: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'text-xs px-3 py-1.5 rounded-full border font-sans font-medium transition-all duration-200',
        active
          ? 'bg-gold-500/20 border-gold-500/40 text-gold-400'
          : 'bg-white/[0.04] border-white/10 text-white/50 hover:text-white/70 hover:bg-white/[0.07]'
      )}
    >
      {children}
    </button>
  )
}
