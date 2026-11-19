// Copied from the JobNova prototype (Liba/JobNova src/components/demos/jobnova-resume-v2) for the portfolio's live demo.
'use client'

// Resume v2: co-editing on the page itself. The Editor tab is gone. The rewrite reads as
// finished text with Nova's words marked. The whole resume is one editing surface, so a
// selection can run across lines and blocks; selecting brings up Nova's actions, which
// apply at once and can be undone. Marks step aside while the person types and come back
// with the "AI changes" switch. The Overview stays: before/after score, ATS, what changed.

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AlignLeft, ArrowUp, Check, ChevronRight, Mic, Minus, RotateCcw, Sparkles, Tag, Target, WandSparkles } from 'lucide-react'
import { BLOCKS, EDUCATION, EXPERIENCE, GROUPS, JOB, KEYWORDS, PERSON, PROJECTS, type Block } from './data'
import './coeditor.css'

type Doc = Record<string, string>
type Words = Record<string, string[]>

const PLACEHOLDER = '[add the result]'
const ORIGINAL: Doc = Object.fromEntries(BLOCKS.map(b => [b.id, b.original]))
const start = (): Doc => Object.fromEntries(BLOCKS.map(b => [b.id, b.suggestion ?? b.original]))

/* ─────────── Scoring: keywords for the ATS check, results for the match score ─────────── */
function measure(texts: Doc) {
  const all = Object.values(texts).join(' ')
  const matched = KEYWORDS.filter(k => k.test.test(all)).map(k => k.label)
  const exp = BLOCKS.filter(b => b.group === 'experience')
  const quantified = exp.filter(b => /\d/.test(texts[b.id] ?? '')).length / exp.length
  const coverage = matched.length / KEYWORDS.length
  const score = Math.round((4 + 3 * coverage + 2.5 * quantified) * 10) / 10
  return { matched, ats: Math.round(coverage * 100), score }
}
const grade = (s: number) => (s >= 9 ? 'Strong' : s >= 7 ? 'Good' : 'Fair')

/* ─────────── Marking: only words Nova wrote, never the person's own ─────────── */
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9%+]/g, '')
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const wordsOf = (t: string) => t.split(/\s+/).map(norm).filter(Boolean)
const novaStart = (): Words => Object.fromEntries(BLOCKS.map(b => [b.id, wordsOf(b.suggestion ?? '')]))
function paint(text: string, original: string, nova: string[]) {
  const known = new Set(wordsOf(original))
  const by = new Set(nova)
  return text.split(/(\s+)/).map(part => {
    if (/^\s*$/.test(part)) return part
    if (part.includes('[') || part.includes(']')) return `<span class="cv-slot">${esc(part)}</span>`
    const w = norm(part)
    return !known.has(w) && by.has(w) ? `<mark>${esc(part)}</mark>` : esc(part)
  }).join('')
}

/* ─────────── Nova's actions on selected text ─────────── */
function shorten(t: string) {
  const sentences = t.split(/(?<=[.;])\s+/)
  if (sentences.length > 1) return sentences[0]
  const cut = t.lastIndexOf(',', Math.floor(t.length * 0.75))
  return cut > 12 ? t.slice(0, cut) + (/\.$/.test(t) ? '.' : '') : t
}
const addResult = (t: string) => `${t.replace(/\s*\.$/, '')}, which ${PLACEHOLDER}${/\.$/.test(t) ? '.' : ''}`

// Demo stand-ins for the model: deterministic rewrites of the selected words
const swap = (pairs: [RegExp, string][]) => (t: string) => pairs.reduce((s, [a, b]) => s.replace(a, b), t)
const confident = swap([
  [/\bWorked on\b/g, 'Led'], [/\bworked on\b/g, 'led'], [/\bHelped the team with\b/g, 'Drove'], [/\bhelped\b/gi, 'drove'],
  [/\bResponsible for\b/g, 'Owned'], [/\bMade\b/g, 'Created'], [/\bFixed\b/g, 'Resolved'], [/\bwho likes solving problems\b/g, 'who solves hard problems'],
  [/\bis looking for a new role\b/g, 'is ready for the next role'], [/\bPartners with\b/g, 'Leads work with'],
])
const improve = (t: string) => {
  const out = confident(t).replace(/\bdifferent teams\b/g, 'cross-functional teams').replace(/\bproducts for customers\b/g, 'customer-facing products')
  return out !== t ? out : t.replace(/\bshipping\b/, 'designing and shipping').replace(/\bcutting\b/, 'reducing')
}
const fixGrammar = swap([[/\s{2,}/g, ' '], [/\bteh\b/g, 'the'], [/\btlaking\b/g, 'talking'], [/\bi\b/g, 'I'], [/\s+([,.;])/g, '$1']])
const longer = (t: string) => (/\d/.test(t) ? `${t.replace(/\.$/, '')}, working closely with product and engineering${/\.$/.test(t) ? '.' : ''}` : addResult(t))
const neutral = swap([[/\bLed\b/g, 'Worked on'], [/\bOwned\b/g, 'Responsible for'], [/\bDrove\b/g, 'Contributed to']])

/** One block of text inside the editing surface. Not controlled while typing (the caret
 *  stays put); repainted when something other than the keyboard changes it. */
function Text({ id, value, original, nova, paintKey }: { id: string; value: string; original: string; nova: string[]; paintKey: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const painted = useRef(-1)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (el.textContent !== value || painted.current !== paintKey) {
      el.innerHTML = paint(value, original, nova)
      painted.current = paintKey
    }
  }, [value, original, nova, paintKey])
  return <span ref={ref} className="cv-text" data-block={id} />
}

// The original drawer's ring: amber (#fbbf24, as in ResumeDrawer) is the score the resume started
// with, lime is what tailoring added, the grey hatch is the headroom left. Round caps with
// a small gap between arcs; the coloured share always equals the number (8.6 is 86%).
function Ring({ before, now }: { before: number; now: number }) {
  const id = useId()
  const R = 63
  const C = 2 * Math.PI * R
  const CAP = 8
  const GAP = 2.5
  const arc = (from: number, to: number) => {
    const len = Math.max(0.01, ((to - from) / 10) * C - 2 * CAP - 2 * GAP)
    return { strokeDasharray: `${len} ${C}`, strokeDashoffset: -((from / 10) * C + CAP + GAP) }
  }
  const low = Math.min(before, now)
  const high = Math.max(before, now)
  return (
    <svg className="cv-ring" viewBox="0 0 146 146" aria-hidden="true">
      <defs>
        <pattern id={id} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(135)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="#9d9d9d" strokeWidth="2" />
        </pattern>
      </defs>
      <g transform="rotate(-90 73 73)" fill="none" strokeWidth="16" strokeLinecap="round">
        {high < 10 && <circle className="cv-arc" cx="73" cy="73" r={R} stroke={`url(#${id})`} {...arc(high, 10)} />}
        {high > low && <circle className="cv-arc" cx="73" cy="73" r={R} stroke="#b0f809" {...arc(low, high)} />}
        <circle className="cv-arc" cx="73" cy="73" r={R} stroke="#fbbf24" {...arc(0, low)} />
      </g>
    </svg>
  )
}

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms))
const SUGGESTED = BLOCKS.filter(b => b.suggestion).map(b => b.id)

/** A number that eases to its target, so the score is seen climbing rather than jumping */
function useTween(target: number, ms = 900) {
  const [v, setV] = useState(target)
  const cur = useRef(target)
  useEffect(() => {
    const from = cur.current
    if (from === target) return
    if (reduced()) { cur.current = target; setV(target); return }
    let raf = 0
    const t0 = performance.now()
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms)
      const x = from + (target - from) * (1 - Math.pow(1 - k, 3))
      cur.current = x
      setV(x)
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return v
}

/** Where a selection falls: the part of each block it covers */
type Part = { id: string; from: number; to: number }
type Sel = { parts: Part[]; x: number; top: number; bottom: number }
type Toast = { text: string; undo: { doc: Doc; nova: Words } }

function offsetIn(el: HTMLElement, node: Node, offset: number) {
  const r = document.createRange()
  r.selectNodeContents(el)
  r.setEnd(node, offset)
  return r.toString().length
}

export default function ResumeCoEditor({ active = true, onClose }: { active?: boolean; onClose?: () => void }) {
  const [doc, setDoc] = useState<Doc>(ORIGINAL)
  const [nova, setNova] = useState<Words>(novaStart)
  const [showMarks, setShowMarks] = useState(false)
  // The opening: Nova rewrites the resume in place, then the score climbs and the changes arrive
  const [phase, setPhase] = useState<'busy' | 'done'>('busy')
  const [waiting, setWaiting] = useState<string[]>(SUGGESTED)
  const [items, setItems] = useState(0)
  const [working, setWorking] = useState<string[]>([])
  const run$ = useRef(0)
  const busy = useRef(true)
  const [paintKey, setPaintKey] = useState(0)
  const [open, setOpen] = useState<string | null>('skills')
  const [flash, setFlash] = useState<string[]>([])
  const [sel, setSel] = useState<Sel | null>(null)
  const [toast, setToast] = useState<Toast | null>(null)
  const paper = useRef<HTMLDivElement>(null)
  const surface = useRef<HTMLDivElement>(null)
  const pop = useRef<HTMLDivElement>(null)
  const [place, setPlace] = useState<{ left: number; top: number; up?: boolean }>({ left: 0, top: 0 })
  const [ask, setAsk] = useState('')
  const [tone, setTone] = useState(false)
  const [focused, setFocused] = useState(false)
  const typing = useRef(false)

  const before = useMemo(() => measure(ORIGINAL), [])
  const live = useMemo(() => measure(doc), [doc])
  const now = phase === 'done' ? live : before
  const shown = useTween(now.score)
  const missing = KEYWORDS.map(k => k.label).filter(k => !now.matched.includes(k))
  const slots = Object.values(doc).filter(t => t.includes(PLACEHOLDER)).length
  const keyGap = missing.filter(k => k === 'React' || k === 'JavaScript')
  const addKeywords = (p: string) => `${p.replace(/\.$/, '')}, using ${keyGap.join(' and ')}${/\.$/.test(p) ? '.' : ''}`

  const blink = (ids: string[]) => {
    setFlash(ids)
    window.setTimeout(() => setFlash(f => (f === ids ? [] : f)), 1400)
  }
  const jump = (id: string) => {
    const el = surface.current?.querySelector<HTMLElement>(`[data-block="${id}"]`)
    const box = paper.current
    if (el && box) box.scrollTo({ top: el.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - 80, behavior: 'smooth' })
    blink([id])
  }

  /** Nova changes the document at once; the toast offers the way back */
  const apply = (next: Doc, text: string, ids: string[]) => {
    setSel(null)
    window.getSelection()?.removeAllRanges()
    setToast(null)
    setWorking(ids)
    const snapshot = { doc, nova }
    window.setTimeout(() => commit(next, text, ids, snapshot), reduced() ? 0 : 520)
  }
  const commit = (next: Doc, text: string, ids: string[], snapshot: Toast['undo']) => {
    setWorking([])
    setToast({ text, undo: snapshot })
    setNova(n => {
      const out = { ...n }
      ids.forEach(id => { out[id] = [...n[id], ...wordsOf(next[id])] })
      return out
    })
    setDoc(next)
    setPaintKey(k => k + 1)
    setSel(null)
    window.getSelection()?.removeAllRanges()
    blink(ids)
  }
  const generate = useCallback(async () => {
    const my = ++run$.current
    const alive = () => run$.current === my
    busy.current = true
    setPhase('busy'); setShowMarks(false); setDoc(ORIGINAL); setNova(novaStart()); setWaiting(SUGGESTED); setItems(0); setToast(null); setSel(null)
    setPaintKey(k => k + 1)
    paper.current?.scrollTo({ top: 0 })
    const finish = async () => {
      if (!alive()) return
      setDoc(start()); setWaiting([]); setPhase('done'); busy.current = false
      paper.current?.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' })
      await wait(reduced() ? 0 : 700)
      if (!alive()) return
      setShowMarks(true); setPaintKey(k => k + 1)
      for (let i = 1; i <= GROUPS.length; i++) { if (!alive()) return; setItems(i); await wait(reduced() ? 0 : 160) }
    }
    if (reduced()) return finish()
    await wait(800)
    // Lines are rewritten in a quick cascade, all advanced by one frame loop; the page follows the newest line
    const STAGGER = 170, WORD = 22
    const words = SUGGESTED.map(id => (BLOCKS.find(b => b.id === id)!.suggestion ?? '').split(' '))
    const end = Math.max(...words.map((w, i) => i * STAGGER + w.length * WORD))
    let followed = -1
    await new Promise<void>(resolve => {
      const t0 = performance.now()
      const frame = (t: number) => {
        if (!alive()) return resolve()
        const el = t - t0
        const started = SUGGESTED.filter((_, i) => el >= i * STAGGER)
        const patch: Doc = {}
        SUGGESTED.forEach((id, i) => {
          if (el < i * STAGGER) return
          const n = Math.min(words[i].length, Math.floor((el - i * STAGGER) / WORD) + 1)
          patch[id] = words[i].slice(0, n).join(' ')
        })
        setDoc(d => ({ ...d, ...patch }))
        setWaiting(SUGGESTED.slice(started.length))
        const newest = started.length - 1
        if (newest > followed) {
          followed = newest
          const node = surface.current?.querySelector<HTMLElement>(`[data-block="${SUGGESTED[newest]}"]`)
          const box = paper.current
          if (node && box) {
            const y = node.getBoundingClientRect().top - box.getBoundingClientRect().top
            if (y > box.clientHeight - 160) box.scrollTo({ top: box.scrollTop + y - box.clientHeight / 2, behavior: 'smooth' })
          }
        }
        if (el < end) requestAnimationFrame(frame)
        else resolve()
      }
      requestAnimationFrame(frame)
    })
    await wait(250)
    await finish()
  }, [])
  // Generation starts each time the drawer opens; closing stops it
  useEffect(() => {
    if (active) { generate(); return }
    run$.current++
  }, [active, generate])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 6000)
    return () => window.clearTimeout(t)
  }, [toast])

  /** Rewrite the selected part of each block it covers. `last` limits it to the final block. */
  const onSelection = (fn: (part: string) => string, text: string, last = false) => {
    if (!sel) return
    const next = { ...doc }
    const parts = last ? sel.parts.slice(-1) : sel.parts
    const ids: string[] = []
    for (const p of parts) {
      const t = doc[p.id]
      const piece = t.slice(p.from, p.to)
      const out = fn(piece)
      if (out !== piece) { next[p.id] = t.slice(0, p.from) + out + t.slice(p.to); ids.push(p.id) }
    }
    if (ids.length) apply(next, text, ids)
    else setSel(null)
  }
  const restore = () => {
    if (!sel) return
    const next = { ...doc }
    const ids = sel.parts.map(p => p.id)
    ids.forEach(id => { next[id] = ORIGINAL[id] })
    apply(next, ids.length > 1 ? `Restored your original wording in ${ids.length} places.` : 'Restored your original wording.', ids)
  }
  const addKeyword = (k: string) => {
    apply({ ...doc, skills: `${doc.skills.replace(/\.\s*$/, '')}, ${k}.` }, `Added “${k}” to Skills.`, ['skills'])
    jump('skills')
  }

  // Typing: read every block back from the page. Marks step aside while the person writes.
  const onInput = () => {
    const el = surface.current
    if (!el) return
    const next = { ...doc }
    el.querySelectorAll<HTMLElement>('[data-block]').forEach(b => { next[b.dataset.block!] = b.textContent ?? '' })
    setDoc(next)
    if (showMarks) setShowMarks(false)
  }

  // Keep the structure intact: typing may not merge blocks or delete across them
  useEffect(() => {
    const el = surface.current
    if (!el) return
    const blockOf = (n: Node | null) => (n instanceof Element ? n : n?.parentElement)?.closest<HTMLElement>('[data-block]') ?? null
    const guard = (e: InputEvent) => {
      const s = window.getSelection()
      if (!s || !s.rangeCount) return e.preventDefault()
      const r = s.getRangeAt(0)
      const a = blockOf(r.startContainer)
      const b = blockOf(r.endContainer)
      if (!a || a !== b || e.inputType === 'insertParagraph' || e.inputType === 'insertLineBreak') return e.preventDefault()
      const len = a.textContent?.length ?? 0
      const at = offsetIn(a, r.startContainer, r.startOffset)
      if (r.collapsed && e.inputType === 'deleteContentBackward' && at === 0) e.preventDefault()
      if (r.collapsed && e.inputType === 'deleteContentForward' && at === len) e.preventDefault()
    }
    el.addEventListener('beforeinput', guard)
    return () => el.removeEventListener('beforeinput', guard)
  }, [])

  // A selection inside the resume, across lines and blocks, brings up Nova's actions
  useEffect(() => {
    const onSel = () => {
      if (typing.current) return // the person is writing an instruction; keep the selection it applies to
      if (busy.current) return setSel(null)
      const s = window.getSelection()
      const el = surface.current
      const box = paper.current
      if (!s || s.isCollapsed || !s.rangeCount || !el || !box) return setSel(null)
      const r = s.getRangeAt(0)
      if (!el.contains(r.commonAncestorContainer)) return setSel(null)
      const parts: Part[] = []
      el.querySelectorAll<HTMLElement>('[data-block]').forEach(b => {
        if (!r.intersectsNode(b)) return
        const len = b.textContent?.length ?? 0
        const from = b.contains(r.startContainer) ? offsetIn(b, r.startContainer, r.startOffset) : 0
        const to = b.contains(r.endContainer) ? offsetIn(b, r.endContainer, r.endOffset) : len
        if (to > from) parts.push({ id: b.dataset.block!, from, to })
      })
      if (!parts.length) return setSel(null)
      const rects = [...r.getClientRects()].filter(x => x.width > 0)
      const first = rects[0] ?? r.getBoundingClientRect()
      const last = rects[rects.length - 1] ?? first
      const bb = box.getBoundingClientRect()
      // Keep the selection visible while focus moves into the instruction field
      const hl = (globalThis as { CSS?: { highlights?: Map<string, unknown> } }).CSS?.highlights
      const H = (globalThis as { Highlight?: new (r: Range) => unknown }).Highlight
      if (hl && H) hl.set('nova-sel', new H(r.cloneRange()))
      setSel({ parts, x: first.left - bb.left, top: first.top - bb.top + box.scrollTop, bottom: last.bottom - bb.top + box.scrollTop })
      setAsk('')
      setTone(false)
      setFocused(false)
    }
    document.addEventListener('selectionchange', onSel)
    return () => document.removeEventListener('selectionchange', onSel)
  }, [])
  useEffect(() => {
    if (sel) return
    ;(globalThis as { CSS?: { highlights?: Map<string, unknown> } }).CSS?.highlights?.delete('nova-sel')
  }, [sel])

  // Under the selection like Notion; above it when the page runs out; never past the page's sides
  useLayoutEffect(() => {
    if (!sel || !pop.current || !paper.current) return
    const box = paper.current
    const w = pop.current.offsetWidth
    const h = pop.current.offsetHeight
    const left = Math.max(12, Math.min(sel.x, box.clientWidth - 12 - w))
    const below = sel.bottom + 8
    const above = sel.top - 8 - h
    const room = box.scrollTop + box.clientHeight - 64 // the download bar covers the last 64px
    if (below + h <= room) return setPlace({ left, top: below })
    // Above: pin the panel's bottom edge just over the selection, so it grows and shrinks upward as the list filters
    if (above >= box.scrollTop + 4) return setPlace({ left, top: sel.top - 8, up: true })
    // Neither side has room: scroll the page so the panel fits under the selection, never over it
    box.scrollTo({ top: box.scrollTop + (below + h - room) + 8, behavior: 'smooth' })
    setPlace({ left, top: below })
  }, [sel, tone, focused])

  // Close on Escape or a click elsewhere
  useEffect(() => {
    if (!sel) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { typing.current = false; setSel(null) } }
    const onDown = (e: MouseEvent) => {
      if (pop.current?.contains(e.target as Node)) return
      typing.current = false
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onDown, true)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('mousedown', onDown, true) }
  }, [sel])

  /** A typed instruction, routed to the closest action (the demo has no model behind it) */
  const runAsk = () => {
    const q = ask.toLowerCase()
    typing.current = false
    if (/short|concise|trim|cut/.test(q)) return onSelection(shorten, 'Nova made it shorter.')
    if (/result|metric|number|impact|quantif/.test(q)) return onSelection(addResult, 'Nova left a slot for a result. Only you know the number.', true)
    if (/keyword|ats|react|javascript/.test(q)) return keyGap.length ? onSelection(addKeywords, `Nova worked in ${keyGap.join(' and ')}.`, true) : setSel(null)
    if (/long|expand|detail/.test(q)) return onSelection(longer, 'Nova expanded it.')
    if (/grammar|spell|typo/.test(q)) return onSelection(fixGrammar, 'Nova fixed spelling and grammar.')
    if (/original|undo|revert/.test(q)) return restore()
    return onSelection(improve, 'Nova improved the writing.')
  }

  const toggleMarks = () => { setShowMarks(v => !v); setPaintKey(k => k + 1) }

  const byId = Object.fromEntries(BLOCKS.map(b => [b.id, b])) as Record<string, Block>
  const text = (b: Block) => (
    <span className={`cv-block${flash.includes(b.id) ? ' is-flash' : ''}${phase === 'busy' && waiting.includes(b.id) ? ' is-waiting' : ''}${working.includes(b.id) ? ' is-working' : ''}`}>
      <Text id={b.id} value={doc[b.id]} original={b.original} nova={nova[b.id]} paintKey={paintKey} />
    </span>
  )
  const fixed = (node: React.ReactNode) => <span contentEditable={false} suppressContentEditableWarning>{node}</span>
  const pin = (n: number) => <span className="cv-pin" contentEditable={false} data-on={items >= n || undefined}>{n}</span>

  const selected = sel ? sel.parts.map(p => doc[p.id].slice(p.from, p.to)) : []
  const can = (fn: (t: string) => string) => selected.some(t => fn(t) !== t)
  const canRestore = sel ? sel.parts.some(p => doc[p.id] !== ORIGINAL[p.id]) : false
  const item = (icon: React.ReactNode, labelText: string, run: () => void, enabled = true, extra?: React.ReactNode) => (
    <button role="menuitem" disabled={!enabled} onClick={run} key={labelText}>{icon}<span>{labelText}</span>{extra}</button>
  )

  return (
    <div className={`cv${showMarks ? '' : ' hide-marks'}${sel ? ' is-selecting' : ''} is-${phase}`}>
      <header className="cv-head">
        <button className="cv-close" onClick={onClose} aria-label="Close" disabled={!onClose}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M3 3l12 12M15 3L3 15" /></svg>
        </button>
        <h2>Generate Your Custom Resume</h2>
        <span className="cv-for">For {JOB.title} · {JOB.company}</span>
      </header>

      <div className="cv-body">
        <aside className="cv-left" aria-label="Overview">
          <section className="cv-card cv-score">
            <div className="cv-ringbox">
              <Ring before={before.score} now={shown} />
              <span className="cv-num">{shown.toFixed(1)}</span>
              <span className="cv-tag" key={grade(now.score)}>{grade(now.score)}</span>
            </div>
            <div className="cv-score-copy">
              <img className="cv-spark" src="/img/jobnova/v2/demo/sparkles.svg" alt="" width={24} height={24} />
              <p key={phase} className="cv-copy">{phase === 'busy'
                ? <>Nova is tailoring your resume to this role… <span className="cv-progress">{SUGGESTED.length - waiting.length}/{SUGGESTED.length} lines</span></>
                : now.score > before.score
                // The two numbers wear the ring's colours, so the sentence is the ring's legend
                ? <>Great! Your score jumped from <b className="cv-from" title="Your resume as uploaded: the amber arc">{before.score.toFixed(1)}</b> to <b className="cv-to" title="After tailoring: amber plus the lime arc">{shown.toFixed(1)}</b>, closer to landing that interview!</>
                : <>Your resume scores <b className="cv-from">{now.score.toFixed(1)}</b> for this role.</>}</p>
              <span className={`cv-ats ${now.ats >= 70 ? 'is-ok' : ''}`} aria-live="polite">ATS {now.ats} · {missing.length ? `${missing.length} missing` : 'all keywords'}</span>
            </div>
          </section>

          <section className="cv-card cv-keys" aria-label="ATS keyword check">
            <h3>ATS keywords <small>{now.matched.length}/{KEYWORDS.length} from the job description</small></h3>
            <ul className="cv-chips">
              {KEYWORDS.map(k => {
                const on = now.matched.includes(k.label)
                return (
                  <li key={k.label} className={on ? 'is-on' : 'is-off'} style={{ animationDelay: `${KEYWORDS.indexOf(k) * 50}ms` }}>
                    <span aria-hidden="true">{on ? '✓' : '+'}</span>
                    {k.label}
                    {!on && phase === 'done' && <button onClick={() => addKeyword(k.label)} aria-label={`Add ${k.label} to skills`}>Add</button>}
                  </li>
                )
              })}
            </ul>
            <p className="cv-note">Only add skills you have.</p>
          </section>

          <section className="cv-card cv-changes" aria-label="What changed">
            <h3>See what changed</h3>
            {items === 0 && <div className="cv-sk-list" aria-hidden="true">{GROUPS.map(g => <i key={g.id} />)}</div>}
            {GROUPS.map((g, i) => {
              const isOpen = open === g.id
              const first = BLOCKS.find(b => b.group === g.id)!.id
              if (items <= i) return null
              return (
                <div className="cv-change" key={g.id}>
                  <button className="cv-change-head" aria-expanded={isOpen} onClick={() => { setOpen(isOpen ? null : g.id); jump(first) }}>
                    <span className="cv-n">{i + 1}</span>
                    <span className="cv-change-t">{g.title}</span>
                    <svg className={`cv-chev${isOpen ? ' is-open' : ''}`} width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M3.5 5.25L7 8.75l3.5-3.5" /></svg>
                  </button>
                  {isOpen && <p className="cv-change-b">{g.summary}</p>}
                </div>
              )
            })}
          </section>
        </aside>

        <section className="cv-paper-wrap" aria-label="Resume">
          <div className="cv-paper" ref={paper}>
            <div className="cv-top">
              <h1>{PERSON.name}</h1>
              <p>{PERSON.contact}</p>
            </div>
            <div
              className="cv-doc"
              ref={surface}
              contentEditable={phase === 'done'}
              suppressContentEditableWarning
              spellCheck={false}
              role="textbox"
              aria-multiline="true"
              aria-label="Tailored resume, editable"
              onInput={onInput}
            >
              <section className="cv-sec">{pin(1)}{fixed(<h4>PROFILE</h4>)}<p className="cv-serif">{text(byId.profile)}</p></section>
              <section className="cv-sec">
                {pin(2)}
                {fixed(<h4>SKILLS</h4>)}
                <p className="cv-serif">{text(byId.skills)}</p>
                <p className="cv-serif">{text(byId.tools)}</p>
              </section>
              <section className="cv-sec">
                {pin(3)}
                {fixed(<h4>EXPERIENCE</h4>)}
                {EXPERIENCE.map(e => (
                  <div className="cv-exp" key={e.company}>
                    {fixed(<><div className="cv-row"><span>{e.company}</span><span>{e.dates}</span></div><div className="cv-row is-italic"><span>{e.title}</span><span>{e.place}</span></div></>)}
                    <p className="cv-serif">{text(byId[e.intro])}</p>
                    <ul className="cv-serif cv-ul">{e.bullets.map(id => <li key={id}>{text(byId[id])}</li>)}</ul>
                  </div>
                ))}
              </section>
              <section className="cv-sec">
                {fixed(<h4>PROJECTS</h4>)}
                {PROJECTS.map(p => (
                  <div className="cv-exp" key={p.name}>
                    {fixed(<div className="cv-row"><span>{p.name}</span><span>{p.dates}</span></div>)}
                    <p className="cv-serif">{text(byId[p.text])}</p>
                  </div>
                ))}
              </section>
              <section className="cv-sec">
                {fixed(<h4>EDUCATION</h4>)}
                {EDUCATION.map(e => (
                  <div className="cv-exp" key={e.school}>
                    {fixed(<><div className="cv-row"><span>{e.school}</span><span>{e.dates}</span></div><div className="cv-row is-italic"><span>{e.degree}</span><span>{e.place}</span></div></>)}
                    <p className="cv-serif">{text(byId[e.text])}</p>
                  </div>
                ))}
              </section>
              <section className="cv-sec">
                {fixed(<h4>CERTIFICATIONS &amp; LANGUAGES</h4>)}
                <p className="cv-serif">{text(byId.cert)}</p>
                <p className="cv-serif">{text(byId.lang)}</p>
              </section>
            </div>

            {sel && (
              <div
                ref={pop}
                className={`cv-ask${place.up ? ' is-up' : ''}`}
                style={{ left: place.left, top: place.top }}
                onMouseDown={e => { if (!(e.target instanceof HTMLInputElement)) e.preventDefault() }}
              >
                <form className="cv-ask-field" onSubmit={e => { e.preventDefault(); if (ask.trim()) runAsk() }}>
                  <Sparkles size={16} aria-hidden="true" />
                  <input
                    value={ask}
                    onChange={e => setAsk(e.target.value)}
                    onFocus={() => { typing.current = true; setFocused(true) }}
                    onBlur={() => { typing.current = false }}
                    placeholder="Ask Nova to edit the selection…"
                    aria-label="Ask Nova to edit the selection"
                  />
                  <button type="submit" className="cv-ask-go" disabled={!ask.trim()} aria-label="Send"><ArrowUp size={14} /></button>
                </form>
                {/* The three things this job needs, one click each */}
                <div className="cv-chips-row">
                  <button onClick={() => onSelection(addResult, 'Nova left a slot for a result. Only you know the number.', true)}><Target size={13} />Add result</button>
                  <button disabled={!keyGap.length} title={keyGap.length ? `Adds ${keyGap.join(' and ')}` : 'Job keywords are covered'} onClick={() => onSelection(addKeywords, `Nova worked in ${keyGap.join(' and ')}.`, true)}><Tag size={13} />Add keywords</button>
                  <button disabled={!canRestore} onClick={restore}><RotateCcw size={13} />Original</button>
                </div>

                {/* General edits appear once the person turns to the field, and narrow as they type */}
                {focused && (() => {
                  const q = ask.trim().toLowerCase()
                  const edits = [
                    { icon: <WandSparkles />, label: 'Improve writing', run: () => onSelection(improve, 'Nova improved the writing.'), on: can(improve) },
                    { icon: <Check />, label: 'Fix spelling & grammar', run: () => onSelection(fixGrammar, 'Nova fixed spelling and grammar.'), on: can(fixGrammar) },
                    { icon: <AlignLeft />, label: 'Make longer', run: () => onSelection(longer, 'Nova expanded it.'), on: true },
                    { icon: <Minus />, label: 'Make shorter', run: () => onSelection(shorten, 'Nova made it shorter.'), on: can(shorten) },
                  ].filter(e => !q || e.label.toLowerCase().includes(q))
                  const showTone = !q || 'change tone confident neutral concise'.includes(q)
                  if (!edits.length && !showTone) return null
                  return (
                    <div className="cv-menu" role="menu" aria-label="Edit selection">
                      {edits.map(e => item(e.icon, e.label, e.run, e.on))}
                      {showTone && (
                        <div className="cv-sub-wrap" onMouseEnter={() => setTone(true)} onMouseLeave={() => setTone(false)}>
                          {item(<Mic />, 'Change tone', () => setTone(t => !t), true, <ChevronRight className="cv-more" />)}
                          {tone && (
                            <div className="cv-menu cv-sub" role="menu" aria-label="Tone">
                              {item(<span className="cv-sw" />, 'Confident', () => onSelection(confident, 'Nova made the tone more confident.'), can(confident))}
                              {item(<span className="cv-sw" />, 'Concise', () => onSelection(shorten, 'Nova made it more concise.'), can(shorten))}
                              {item(<span className="cv-sw" />, 'Neutral', () => onSelection(neutral, 'Nova made the tone more neutral.'), can(neutral))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
            )}
          </div>

          <div className="cv-dl" data-on={phase === 'done' || undefined}>
            {toast ? (
              <span className="cv-toast" role="status">{toast.text}<button onClick={() => { setDoc(toast.undo.doc); setNova(toast.undo.nova); setPaintKey(k => k + 1); setToast(null) }}>Undo</button></span>
            ) : slots > 0 ? (
              <span className="cv-warn">Fill in {slots} result {slots > 1 ? 'slots' : 'slot'} before downloading</span>
            ) : (
              <span className="cv-hint">Type anywhere to edit. Select text to ask Nova.</span>
            )}
            <label className="cv-switch">
              <input type="checkbox" role="switch" checked={showMarks} onChange={toggleMarks} />
              <span aria-hidden="true" />
              AI changes
            </label>
            <button className="cv-icon" aria-label="Regenerate" title="Regenerate" onClick={() => generate()}>
              <img src="/img/jobnova/v2/demo/sparkles.svg" alt="" width={18} height={18} />
            </button>
            <button className="cv-btn" disabled={slots > 0}>Download PDF</button>
          </div>
        </section>
      </div>
    </div>
  )
}
