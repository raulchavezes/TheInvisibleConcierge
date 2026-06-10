// Palace Company app shell — mobile-first, 390px frame
import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface AppShellProps {
  children: ReactNode
  header?: ReactNode
  footer?: ReactNode
  className?: string
  scrollable?: boolean
}

export function AppShell({ children, header, footer, className, scrollable = true }: AppShellProps) {
  return (
    <div className="min-h-screen bg-navy-950 flex items-start justify-center py-8 px-4">
      <div className="relative w-[390px] min-h-[844px] bg-gradient-night rounded-[44px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)] border border-white/[0.06] flex flex-col">
        {/* Status bar */}
        <div className="flex items-center justify-between px-7 pt-4 pb-2 flex-shrink-0">
          <span className="text-white text-xs font-medium">9:41</span>
          <div className="flex items-center gap-1.5">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" className="opacity-80">
              <rect x="0" y="3" width="3" height="9" rx="1" fill="white"/>
              <rect x="4.5" y="2" width="3" height="10" rx="1" fill="white"/>
              <rect x="9" y="0" width="3" height="12" rx="1" fill="white"/>
              <rect x="13.5" y="0" width="2.5" height="12" rx="1" fill="white" opacity="0.3"/>
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" className="opacity-80">
              <path d="M8 2.5C10.5 2.5 12.7 3.6 14.2 5.3L15.5 4C13.7 2 11 0.8 8 0.8C5 0.8 2.3 2 0.5 4L1.8 5.3C3.3 3.6 5.5 2.5 8 2.5Z" fill="white"/>
              <path d="M8 5C9.7 5 11.2 5.8 12.2 7L13.5 5.7C12.2 4.2 10.2 3.3 8 3.3C5.8 3.3 3.8 4.2 2.5 5.7L3.8 7C4.8 5.8 6.3 5 8 5Z" fill="white"/>
              <circle cx="8" cy="10" r="1.5" fill="white"/>
            </svg>
            <div className="flex items-center gap-0.5">
              <div className="w-5 h-2.5 rounded-sm border border-white/60 p-px">
                <div className="h-full w-3/4 bg-white rounded-sm" />
              </div>
              <div className="w-0.5 h-1.5 bg-white/60 rounded-r-sm" />
            </div>
          </div>
        </div>

        {/* App header */}
        {header && (
          <div className="flex-shrink-0">
            {header}
          </div>
        )}

        {/* Content */}
        <div className={clsx(
          'flex-1 flex flex-col',
          scrollable && 'overflow-y-auto scrollbar-none',
          className
        )}>
          {children}
        </div>

        {/* Footer / nav */}
        {footer && (
          <div className="flex-shrink-0">
            {footer}
          </div>
        )}

        {/* Home indicator */}
        <div className="flex justify-center pb-3 pt-2 flex-shrink-0">
          <div className="w-32 h-1 bg-white/20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// ─── NavBar (bottom tab bar) ──────────────────────────────────────────────────
interface NavItem { icon: ReactNode; label: string; active?: boolean; onClick?: () => void }
export function BottomNav({ items }: { items: NavItem[] }) {
  return (
    <div className="flex items-center justify-around px-2 py-3 bg-navy-900/80 backdrop-blur-xl border-t border-white/[0.06]">
      {items.map((item) => (
        <button
          key={item.label}
          onClick={item.onClick}
          className={clsx(
            'flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-200',
            item.active ? 'text-gold-400' : 'text-white/30 hover:text-white/50'
          )}
        >
          <span className="text-lg">{item.icon}</span>
          <span className="text-2xs font-medium tracking-wide">{item.label}</span>
          {item.active && <span className="w-1 h-1 rounded-full bg-gold-500" />}
        </button>
      ))}
    </div>
  )
}

// ─── App Header ───────────────────────────────────────────────────────────────
interface AppHeaderProps {
  title?: string
  subtitle?: string
  back?: () => void
  actions?: ReactNode
  transparent?: boolean
}
export function AppHeader({ title, subtitle, back, actions, transparent }: AppHeaderProps) {
  return (
    <div className={clsx(
      'flex items-center justify-between px-5 py-3',
      !transparent && 'border-b border-white/[0.06]'
    )}>
      <div className="flex items-center gap-3">
        {back && (
          <button onClick={back} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.06] text-white/70 hover:bg-white/10">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        <div>
          {title && <h1 className="text-sm font-semibold text-white leading-none">{title}</h1>}
          {subtitle && <p className="text-2xs text-white/40 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

// ─── Animated screen wrapper ──────────────────────────────────────────────────
export function ScreenWrapper({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={clsx('flex-1 flex flex-col', className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
