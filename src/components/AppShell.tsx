// Palace Company app shell — mobile-first, 390px frame, light Mare palette
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
    <div className="flex items-start justify-center py-8 px-4">
      {/* Phone frame — overflow-visible so tooltips can escape the frame */}
      <div className="relative w-[390px]" style={{ minHeight: 844 }}>
        {/* The visual frame (clipped) */}
        <div className="absolute inset-0 rounded-[44px] overflow-hidden bg-sea-50 border border-sea-200 shadow-[0_24px_64px_rgba(12,35,57,0.16),0_4px_16px_rgba(12,35,57,0.08)] pointer-events-none z-0" />

        {/* Actual scrollable content — clipped to the frame visually, but tooltip z-index escapes */}
        <div className="relative z-10 flex flex-col rounded-[44px] overflow-hidden" style={{ minHeight: 844, background: '#F4F8FC' }}>
          {/* Status bar */}
          <div className="flex items-center justify-between px-7 pt-4 pb-2 flex-shrink-0 bg-white/60">
            <span className="text-navy-900 text-xs font-semibold">9:41</span>
            <div className="flex items-center gap-1.5">
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" className="opacity-60">
                <rect x="0" y="3" width="3" height="9" rx="1" fill="#0C2339"/>
                <rect x="4.5" y="2" width="3" height="10" rx="1" fill="#0C2339"/>
                <rect x="9" y="0" width="3" height="12" rx="1" fill="#0C2339"/>
                <rect x="13.5" y="0" width="2.5" height="12" rx="1" fill="#0C2339" opacity="0.3"/>
              </svg>
              <svg width="15" height="11" viewBox="0 0 15 11" fill="none" className="opacity-60">
                <path d="M7.5 2C9.7 2 11.7 3 13.1 4.5L14.2 3.3C12.5 1.6 10.1 0.5 7.5 0.5C4.9 0.5 2.5 1.6 0.8 3.3L1.9 4.5C3.3 3 5.3 2 7.5 2Z" fill="#0C2339"/>
                <path d="M7.5 4.5C9 4.5 10.3 5.2 11.2 6.2L12.3 5C11.1 3.8 9.4 3 7.5 3C5.6 3 3.9 3.8 2.7 5L3.8 6.2C4.7 5.2 6 4.5 7.5 4.5Z" fill="#0C2339"/>
                <circle cx="7.5" cy="9" r="1.5" fill="#0C2339"/>
              </svg>
              <div className="flex items-center gap-0.5">
                <div className="w-5 h-2.5 rounded-sm border border-navy-400/50 p-px">
                  <div className="h-full w-3/4 bg-navy-700 rounded-sm" />
                </div>
                <div className="w-0.5 h-1.5 bg-navy-400/50 rounded-r-sm" />
              </div>
            </div>
          </div>

          {/* App header */}
          {header && <div className="flex-shrink-0">{header}</div>}

          {/* Content */}
          <div className={clsx(
            'flex-1 flex flex-col',
            scrollable && 'overflow-y-auto scrollbar-none',
            className
          )}>
            {children}
          </div>

          {/* Footer nav */}
          {footer && <div className="flex-shrink-0">{footer}</div>}

          {/* Home indicator */}
          <div className="flex justify-center pb-3 pt-1 flex-shrink-0 bg-white/60">
            <div className="w-32 h-1 bg-navy-300/40 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── NavBar ───────────────────────────────────────────────────────────────────
interface NavItem { icon: ReactNode; label: string; active?: boolean; onClick?: () => void }
export function BottomNav({ items }: { items: NavItem[] }) {
  return (
    <div className="flex items-center justify-around px-2 py-2 bg-white border-t border-sea-100"
      style={{ boxShadow: '0 -2px 8px rgba(12,35,57,0.04)' }}>
      {items.map((item) => (
        <button
          key={item.label}
          onClick={item.onClick}
          className={clsx(
            'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200',
            item.active ? 'text-navy-700' : 'text-ink-300 hover:text-ink-500'
          )}
        >
          <span className={clsx('text-base', item.active && 'text-navy-700')}>{item.icon}</span>
          <span className="text-[9px] font-semibold tracking-wide uppercase">{item.label}</span>
          {item.active && <span className="w-1 h-1 rounded-full bg-navy-700 mt-0.5" />}
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
}
export function AppHeader({ title, subtitle, back, actions }: AppHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-sea-100">
      <div className="flex items-center gap-3">
        {back && (
          <button onClick={back} className="w-8 h-8 flex items-center justify-center rounded-full bg-sea-100 text-navy-700 hover:bg-sea-200 transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        <div>
          {title && <h1 className="text-sm font-semibold text-navy-900 leading-none">{title}</h1>}
          {subtitle && <p className="text-[10px] text-ink-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

// ─── Screen wrapper ───────────────────────────────────────────────────────────
export function ScreenWrapper({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={clsx('flex-1 flex flex-col', className)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
