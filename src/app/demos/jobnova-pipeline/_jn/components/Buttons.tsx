import type { CSSProperties, MouseEvent, ReactNode } from 'react'

type HeaderTabButtonProps = {
  active: boolean
  onClick: () => void
  label: string
  badgeCount?: number
}

export function HeaderTabButton({ active, onClick, label, badgeCount }: HeaderTabButtonProps) {
  return (
    <button className={`jb-seg-item${active ? ' is-active' : ''}`} onClick={onClick}>
      {label}
      {typeof badgeCount === 'number' ? <span className="jb-seg-n">{badgeCount}</span> : null}
    </button>
  )
}

export function SavedJobsButton() {
  return (
    <button className="jb-fpill jb-fpill--saved">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      Saved
    </button>
  )
}

type AutoApplyToggleButtonProps = {
  enabled: boolean
  onToggle: () => void
}

export function AutoApplyToggleButton({ enabled, onToggle }: AutoApplyToggleButtonProps) {
  return (
    <button className={`aa-toggle${enabled ? ' is-on' : ''}`} onClick={onToggle} aria-label="Toggle Auto Apply">
      <span className="aa-toggle-knob" />
    </button>
  )
}

type AlertCtaButtonProps = {
  children: ReactNode
  onClick?: () => void
}

export function AlertCtaButton({ children, onClick }: AlertCtaButtonProps) {
  return (
    <button className="aa-alert-cta" onClick={onClick}>
      {children}
    </button>
  )
}

type UpgradeButtonProps = {
  onClick?: () => void
}

export function UpgradeButton({ onClick }: UpgradeButtonProps) {
  return (
    <button className="aa-cp-upgrade" onClick={onClick}>
      Upgrade
    </button>
  )
}

type UsageDetailButtonProps = {
  onClick?: () => void
}

export function UsageDetailButton({ onClick }: UsageDetailButtonProps) {
  return (
    <button className="aa-cp-usage" onClick={onClick}>
      Usage detail <span>→</span>
    </button>
  )
}

type SearchClearButtonProps = {
  onClick: () => void
  ariaLabel?: string
  className?: string
}

export function SearchClearButton({ onClick, ariaLabel = 'Clear search', className = 'jb-search-clear' }: SearchClearButtonProps) {
  return (
    <button className={className} onClick={onClick} aria-label={ariaLabel}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  )
}

type FilterDropdownButtonProps = {
  open: boolean
  active?: boolean
  onClick: () => void
  children: ReactNode
  className?: string
}

export function FilterDropdownButton({
  open,
  active = false,
  onClick,
  children,
  className = ''
}: FilterDropdownButtonProps) {
  return (
    <button className={`jb-fdrop${open ? ' is-open' : ''}${active ? ' is-active' : ''}${className ? ` ${className}` : ''}`} onClick={onClick}>
      {children}
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  )
}

type FilterPanelOptionButtonProps = {
  selected: boolean
  onClick: () => void
  children: ReactNode
}

export function FilterPanelOptionButton({ selected, onClick, children }: FilterPanelOptionButtonProps) {
  return (
    <button className="jb-panel-check-row" onClick={onClick}>
      <span className={`jb-panel-checkbox${selected ? ' is-checked' : ''}`}>
        {selected && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      {children}
    </button>
  )
}

type PanelConfirmButtonProps = {
  onClick: () => void
}

export function PanelConfirmButton({ onClick }: PanelConfirmButtonProps) {
  return (
    <button className="jb-panel-confirm" onClick={onClick}>
      Confirm
    </button>
  )
}

type SortPanelItemButtonProps = {
  selected: boolean
  onClick: () => void
  children: ReactNode
}

export function SortPanelItemButton({ selected, onClick, children }: SortPanelItemButtonProps) {
  return (
    <button className={`jb-panel-item${selected ? ' is-selected' : ''}`} onClick={onClick}>
      {children}
    </button>
  )
}

type LocationQuickPickButtonProps = {
  active: boolean
  onClick: () => void
  children: ReactNode
}

export function LocationQuickPickButton({ active, onClick, children }: LocationQuickPickButtonProps) {
  return (
    <button className={`jb-loc-qpill${active ? ' is-on' : ''}`} onClick={onClick}>
      {children}
    </button>
  )
}

type LocationChipRemoveButtonProps = {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
}

export function LocationChipRemoveButton({ onClick }: LocationChipRemoveButtonProps) {
  return (
    <button className="jb-loc-inline-chip-x" onClick={onClick}>
      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  )
}

type LocationResultRowButtonProps = {
  selected: boolean
  onClick: () => void
  children: ReactNode
}

export function LocationResultRowButton({ selected, onClick, children }: LocationResultRowButtonProps) {
  return (
    <button className={`jb-loc-result-row${selected ? ' is-selected' : ''}`} onClick={onClick}>
      {children}
    </button>
  )
}

type LocationResetIconSize = 'sm' | 'md' | 'lg'

type LocationResetIconButtonProps = {
  onClick: () => void
  ariaLabel?: string
  /** 三种尺寸，对应 tokens.css 中 --icon-btn-loc-reset-* */
  size?: LocationResetIconSize
}

export function LocationResetIconButton({ onClick, ariaLabel = 'Reset location filters', size = 'md' }: LocationResetIconButtonProps) {
  const sizeClass = size === 'md' ? '' : ` jb-panel-reset-icon--${size}`
  return (
    <button className={`jb-panel-reset-icon${sizeClass}`} type="button" onClick={onClick} aria-label={ariaLabel}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 12a9 9 0 1 0 3-6.708" />
        <polyline points="3 3 3 9 9 9" />
      </svg>
    </button>
  )
}

type PanelResetButtonProps = {
  onClick: () => void
}

export function PanelResetButton({ onClick }: PanelResetButtonProps) {
  return (
    <button className="jb-panel-reset" onClick={onClick}>
      Reset
    </button>
  )
}

type TogglePillButtonProps = {
  active: boolean
  onClick: () => void
  className: string
  children: ReactNode
  style?: CSSProperties
}

export function TogglePillButton({ active, onClick, className, children, style }: TogglePillButtonProps) {
  return (
    <button className={`${className}${active ? ' is-on' : ''}`} onClick={onClick} style={style}>
      {children}
    </button>
  )
}

type SourcePillButtonProps = {
  active: boolean
  onClick: () => void
  label: string
}

export function SourcePillButton({ active, onClick, label }: SourcePillButtonProps) {
  const sourceClass = label.toLowerCase() === 'linkedin' ? 'jb-fpill--linkedin' : 'jb-fpill--platform'
  return (
    <button className={`jb-fpill ${sourceClass}${active ? ' is-on' : ''}`} onClick={onClick}>
      {active && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
      {label}
    </button>
  )
}

type ContactModalCloseButtonProps = {
  onClick: () => void
}

export function ContactModalCloseButton({ onClick }: ContactModalCloseButtonProps) {
  return (
    <button className="cm-close" onClick={onClick} aria-label="Close">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  )
}

type ContactModalRegenButtonProps = {
  onClick: () => void
  disabled: boolean
}

export function ContactModalRegenButton({ onClick, disabled }: ContactModalRegenButtonProps) {
  return (
    <button className="cm-regen" onClick={onClick} disabled={disabled}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
        <path d="M20 3v4" />
        <path d="M22 5h-4" />
        <path d="M4 17v2" />
        <path d="M5 18H3" />
      </svg>
      Regenerate
    </button>
  )
}

type ContactModalCopyButtonProps = {
  copied: boolean
  onClick: () => void
  disabled: boolean
}

export function ContactModalCopyButton({ copied, onClick, disabled }: ContactModalCopyButtonProps) {
  return (
    <button className="cm-copy" onClick={onClick} disabled={disabled}>
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copy
        </>
      )}
    </button>
  )
}

export function JobSquarePostButton() {
  return <button className="jsq-post-card-btn">Post a Job →</button>
}

type TopAvatarButtonProps = {
  label?: string
}

export function TopAvatarButton({ label = 'N' }: TopAvatarButtonProps) {
  return (
    <button className="jb-top-avatar jb-user-av" aria-label="User menu">
      {label}
    </button>
  )
}
