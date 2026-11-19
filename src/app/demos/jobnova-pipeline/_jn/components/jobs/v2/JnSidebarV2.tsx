'use client'

// v2 of JnSidebar (../JnSidebar.tsx, left untouched): the same navigation, collapsible to an
// icon rail so wide views such as the application pipeline get the room. The choice is
// remembered, and ⌘\ / Ctrl+\ toggles it.

import { useEffect } from 'react'
import { PanelLeftClose, PanelLeftOpen, Zap } from 'lucide-react'
import './sidebar-v2.css'

const NAV = [
  { label: 'Jobs', icon: 'icon', href: '/jobs' },
  { label: 'Auto Apply', icon: 'icon-1', href: '/jobs/auto-apply-v2', badge: 33 },
  { label: 'Profile', icon: 'icon-2', href: '#' },
  { label: 'Resume', icon: 'icon-3', href: '#' },
  { label: 'Job Preference', icon: 'icon-4', href: '#' },
]
const KEY = 'jn-sidebar-collapsed'

/** The collapsed state, kept across visits */
export function readCollapsed() {
  try { return window.localStorage.getItem(KEY) === '1' } catch { return false }
}
export function saveCollapsed(v: boolean) {
  try { window.localStorage.setItem(KEY, v ? '1' : '0') } catch { /* private mode: not remembered */ }
}

export default function JnSidebarV2({ active, collapsed, onToggle }: { active: string; collapsed: boolean; onToggle: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') { e.preventDefault(); onToggle() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onToggle])

  const tip = (label: string) => (collapsed ? { 'data-tip': label, 'aria-label': label } : {})

  return (
    <aside className={`jb-sidebar jn-side jn2${collapsed ? ' is-collapsed' : ''}`}>
      <div className="jn2-head">
        {collapsed ? (
          // Collapsed: the logo is the way back. On hover it turns into the expand icon.
          <button type="button" className="jn2-logo-btn" onClick={onToggle} aria-label="Expand sidebar" aria-expanded={false} data-tip={'Expand  ⌘\\'}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/demos/jobnova/img/matched/image-1.png" alt="" />
            <PanelLeftOpen className="jn2-logo-open" size={18} strokeWidth={1.6} aria-hidden="true" />
          </button>
        ) : (
          <>
            <a className="jn-logo jn2-logo" href="/" aria-label="JobNova home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/jobnova/img/matched/image-1.png" alt="JobNova" />
            </a>
            {/* Expanded: the collapse button stays out of the way until the pointer is in the sidebar */}
            <button type="button" className="jn2-toggle" onClick={onToggle} aria-label="Collapse sidebar" aria-expanded={true} title={'Collapse  ⌘\\'}>
              <PanelLeftClose size={18} strokeWidth={1.6} />
            </button>
          </>
        )}
      </div>

      <div className="jn-side-body">
        <nav className="jn-nav">
          {NAV.map(n => (
            <a key={n.label} href={n.href} className={`jn-nav-item${n.label === active ? ' is-active' : ''}`} {...tip(n.label)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/demos/jobnova/img/matched/${n.icon}.svg`} alt="" width={18} height={18} />
              <span className="jn2-label">{n.label}</span>
              {n.badge && <span className="jn-nav-badge">{n.badge}</span>}
            </a>
          ))}
        </nav>
        <div className="jn-side-bottom">
          <div className="jn-upgrade jn2-upgrade">
            <div className="jn2-label">
              <p className="jn-upgrade-title">Upgrade Your Plan</p>
              <p className="jn-upgrade-sub">Boost your success rate now!</p>
            </div>
            <a className="jn-upgrade-btn" href="/jobs/subscribtion" {...tip('Upgrade your plan')}>
              <Zap className="jn2-zap" size={16} strokeWidth={1.8} />
              <span className="jn2-label">Subscription</span>
            </a>
          </div>
          <div>
            <a href="#" className="jn-nav-item jn-nav-item--sm" {...tip('Refer & Affiliate')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/jobnova/img/matched/icon-5.svg" alt="" width={16} height={16} /><span className="jn2-label">Refer &amp; Affiliate</span>
            </a>
            <a href="#" className="jn-nav-item jn-nav-item--sm" {...tip('Setting')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/jobnova/img/matched/icon-6.svg" alt="" width={16} height={16} /><span className="jn2-label">Setting</span>
            </a>
          </div>
        </div>
      </div>
    </aside>
  )
}
