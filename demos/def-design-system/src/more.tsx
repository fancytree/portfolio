import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Kbd } from '@/components/ui/kbd';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { DatePresetToggle } from '@/components/shared/DatePresetToggle';
import { TagInput } from '@/components/shared/TagInput';
import {
  Archive, ClipboardList, ContactRound, Copy, Download, Image, Info, LayoutGrid, MoreHorizontal, PackageSearch,
  ChevronDown, PanelsTopLeft, Pencil, Printer, RefreshCw, ShoppingBag, SlidersHorizontal, Tags, Trash2, TriangleAlert, Wallet,
  type LucideIcon,
} from 'lucide-react';

function Sub({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 mt-8 text-xs font-semibold uppercase tracking-wide text-muted-foreground first:mt-0">{children}</p>;
}

/* ---------------- Spacing ---------------- */
export const spaceScale: [number, string, string][] = [
  [4, 'gap-1', 'Icon to text, inside tags'],
  [8, 'gap-2', 'Label to field, buttons in a group'],
  [12, 'gap-3', 'Between page blocks and form fields'],
  [16, 'p-4', 'Card padding, page side margin'],
  [24, 'p-6', 'Dialog padding, sections inside a card'],
  [32, 'gap-8', 'Between major groups on a page'],
];

const PAD = 'color-mix(in srgb, var(--primary) 14%, transparent)';
const GAP = 'color-mix(in srgb, var(--data-orange) 32%, transparent)';
function Num({ v, className }: { v: number; className: string }) {
  return <span className={`absolute flex items-center justify-center text-[9px] font-semibold leading-none text-primary ${className}`}>{v}</span>;
}
function Gap({ v, h = false }: { v: number; h?: boolean }) {
  return (
    <span data-gap={v} className="relative flex shrink-0 items-center justify-center" style={{ background: GAP, ...(h ? { width: v } : { height: v }) }}>
      <span className="text-[9px] font-semibold leading-none text-foreground">{v}</span>
    </span>
  );
}

export function SpacingScale() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="grid grid-cols-[1fr_1fr] gap-6">
      <div className="rounded-lg bg-card p-4">
        <Sub>A 4px scale. Six steps, nothing in between</Sub>
        {spaceScale.map(([px, cls, use]) => (
          <div key={px} data-space={px} onMouseEnter={() => setHover(px)} onMouseLeave={() => setHover(null)}
            className={`grid grid-cols-[40px_56px_64px_1fr] items-center gap-3 rounded-md px-2 py-2 text-xs ${hover === px ? 'bg-muted' : ''}`}>
            <span className="tabular-nums font-semibold">{px}px</span>
            <span className="font-mono text-[10px] text-muted-foreground">{cls}</span>
            <span className="flex h-8 items-center"><span className="block bg-primary/80" style={{ width: px, height: px }} /></span>
            <span className="text-muted-foreground">{use}</span>
          </div>
        ))}
        <p className="mt-3 text-xs text-muted-foreground">Values like 10, 14 or 20px are not allowed. Similar pages repeat the same steps.</p>
      </div>
      <div className="rounded-lg bg-card p-4">
        <Sub>The scale on a real card</Sub>
        <div className="rounded-lg bg-muted p-4" data-space-demo>
        <div className="relative rounded-lg border-2 border-border bg-card p-4 shadow-sm" style={{ backgroundImage: `linear-gradient(${PAD}, ${PAD})` }}>
          <Num v={16} className="left-1/2 top-0 h-4 -translate-x-1/2" />
          <Num v={16} className="bottom-0 left-1/2 h-4 -translate-x-1/2" />
          <Num v={16} className="left-0 top-1/2 w-4 -translate-y-1/2" />
          <Num v={16} className="right-0 top-1/2 w-4 -translate-y-1/2" />
          <div className="bg-card outline outline-1 outline-dashed outline-primary/50">
            <p className="text-sm font-semibold">Customer details</p>
            <Gap v={12} />
            <div className="flex">
              <div className="min-w-0 flex-1"><p className="text-xs font-semibold">Customer</p><Gap v={8} /><Input defaultValue="Luce Beauty" aria-label="Customer" /></div>
              <Gap v={12} h />
              <div className="min-w-0 flex-1"><p className="text-xs font-semibold">Code</p><Gap v={8} /><Input defaultValue="C-10042" aria-label="Code" /></div>
            </div>
            <Gap v={16} />
            <div className="flex justify-end"><Button variant="outline">Cancel</Button><Gap v={8} h /><Button>Save</Button></div>
          </div>
        </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="size-3 rounded-sm" style={{ background: PAD }} />Card padding: card edge to content</span>
          <span className="flex items-center gap-1"><span className="size-3 rounded-sm" style={{ background: GAP }} />Gap between elements</span>
          <span className="flex items-center gap-1"><span className="size-3 rounded-sm border border-dashed border-primary/60" />Content edge</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Icons ---------------- */
function Rule({ ok, children, note }: { ok: boolean; children: React.ReactNode; note: string }) {
  return (
    <div data-icon-rule className="flex flex-col rounded-md border">
      <div className="flex h-20 items-center justify-center gap-3 border-b bg-background/40">{children}</div>
      <p className="flex items-start gap-2 p-3 text-xs leading-4">
        <span className={`mt-px shrink-0 font-semibold ${ok ? 'text-success' : 'text-destructive'}`}>{ok ? 'Do' : 'Don’t'}</span>
        <span className="text-muted-foreground">{note}</span>
      </p>
    </div>
  );
}

export function Icons() {
  const SIZE = 160; // the 20px slot drawn 8× larger
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[auto_1fr] gap-8 rounded-lg bg-card p-5" data-icon-anatomy>
        <div className="relative" style={{ width: SIZE, height: SIZE, backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '8px 8px' }}>
          <span className="absolute inset-0 border-2 border-dashed border-primary/60" />
          <span className="absolute inset-[8px] bg-primary/10" />
          <Archive className="absolute inset-[8px]" size={SIZE - 16} strokeWidth={12} absoluteStrokeWidth />
        </div>
        <div className="flex flex-col justify-center gap-3 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Anatomy, drawn 8× larger</p>
          {[['20px', 'Slot. Icons line up on it even when the glyph is narrower.'], ['18px', 'Glyph inside the slot, 1px clear on every side.'], ['1.5px', 'Stroke, fixed in pixels at every size.'], ['currentColor', 'Colour comes from the text beside it.']].map(([a, b]) => (
            <p key={a} className="grid grid-cols-[96px_1fr] gap-3"><span className="font-semibold tabular-nums">{a}</span><span className="text-muted-foreground">{b}</span></p>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-lg bg-card p-5" data-icon-stroke>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stroke stays 1.5px as size changes</p>
          {[['Fixed stroke · used', true], ['Scaled stroke · not used', false]].map(([label, fixed]) => (
            <div key={label as string} className="mb-3 flex items-center gap-6 last:mb-0">
              <span className="w-40 text-xs text-muted-foreground">{label as string}</span>
              {[14, 18, 24, 32].map((n) => (
                <span key={n} className="flex flex-col items-center gap-1">
                  <ShoppingBag size={n} strokeWidth={fixed ? 1.5 : 2} absoluteStrokeWidth={fixed as boolean} />
                  <span className="text-[10px] tabular-nums text-muted-foreground">{n}</span>
                </span>
              ))}
            </div>
          ))}
          <p className="mt-3 text-xs text-muted-foreground">Scaled strokes look thin at 14px and heavy at 32px. A fixed stroke keeps every size the same weight.</p>
        </div>
        <div className="rounded-lg bg-card p-5" data-icon-sizes>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Size follows the role</p>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="w-12 text-xs font-semibold tabular-nums">18px</span>
              <span className="flex items-center gap-2 rounded-md bg-muted px-2 py-1.5 text-sm"><span className="flex size-5 items-center justify-center"><ShoppingBag size={18} strokeWidth={1.5} absoluteStrokeWidth /></span>Sales</span>
              <span className="text-xs text-muted-foreground">Sidebar module</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-12 text-xs font-semibold tabular-nums">16px</span>
              <Button variant="outline" size="sm"><Printer size={16} className="size-4" strokeWidth={1.5} absoluteStrokeWidth />Print DDT</Button>
              <span className="text-xs text-muted-foreground">Buttons and inputs</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-12 text-xs font-semibold tabular-nums">14px</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">Purchasing<ChevronDown size={14} className="size-3.5" strokeWidth={1.5} absoluteStrokeWidth /></span>
              <span className="text-xs text-muted-foreground">Group arrows, inline hints</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 rounded-lg bg-card p-5">
        <Rule ok note="Flat outline, one stroke weight."><Archive size={24} strokeWidth={1.5} absoluteStrokeWidth /><Tags size={24} strokeWidth={1.5} absoluteStrokeWidth /></Rule>
        <Rule ok={false} note="Emoji or filled, coloured artwork as function icons."><span className="text-2xl" aria-hidden>📦</span><span className="text-2xl" aria-hidden>🛒</span></Rule>
        <Rule ok note="Icon-only buttons have a name and a tooltip."><Button size="icon" variant="outline" aria-label="Print delivery note"><Printer /></Button><span className="rounded bg-foreground px-2 py-1 text-[10px] text-background">Print delivery note</span></Rule>
        <Rule ok={false} note="An unlabelled icon a screen reader announces as “button”."><span className="relative"><Button size="icon" variant="outline" aria-label="button"><Wallet /></Button><span className="absolute -right-2 -top-2 size-3 rounded-full bg-destructive" /></span></Rule>
      </div>
      <p className="text-xs text-muted-foreground">Lucide only. Each module keeps one icon by meaning, the same in the sidebar and the page title.</p>
    </div>
  );
}

/* ---------------- Buttons: sizes and icon buttons ---------------- */
export function ButtonSizes() {
  return (
    <TooltipProvider delayDuration={150}>
      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-lg bg-card p-5">
          <Sub>Sizes</Sub>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="xs">Extra small · 24</Button>
            <Button size="sm">Small · 28</Button>
            <Button>Default · 32</Button>
            <Button size="lg">Large · 36</Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Default everywhere. Small in table rows and toolbars; an input beside a button shares its height.</p>
        </div>
        <div className="rounded-lg bg-card p-5">
          <Sub>Icon buttons need a name</Sub>
          <div className="flex flex-wrap items-center gap-2">
            {([[Pencil, 'Edit order'], [Copy, 'Copy order number'], [Printer, 'Print delivery note'], [Download, 'Export']] as const).map(([I, name]) => (
              <Tooltip key={name}>
                <TooltipTrigger asChild><Button variant="ghost" size="icon" aria-label={name} data-icon-button><I /></Button></TooltipTrigger>
                <TooltipContent>{name}</TooltipContent>
              </Tooltip>
            ))}
            <span className="mx-1 h-6 w-px bg-border" />
            <Tooltip>
              <TooltipTrigger asChild><Button variant="ghost" size="icon" aria-label="Delete line" className="text-destructive"><Trash2 /></Button></TooltipTrigger>
              <TooltipContent>Delete line</TooltipContent>
            </Tooltip>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Hover for the label. Screen readers get the same name.</p>
        </div>
      </div>
    </TooltipProvider>
  );
}

/* ---------------- Forms: more inputs ---------------- */
export function MoreInputs() {
  const [tags, setTags] = useState(['Gel', 'Bestseller']);
  const [range, setRange] = useState<'today' | '7d' | '30d' | 'month'>('7d');
  const [method, setMethod] = useState('courier');
  return (
    <div className="mt-6 grid grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle>Choices 选择</CardTitle><CardDescription>Radio for two to four options you should see at once; a select for more.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={method} onValueChange={setMethod} aria-label="Delivery method" className="flex gap-6">
            {[['pickup', 'Pickup'], ['courier', 'Courier'], ['own', 'Own van']].map(([v, l]) => (
              <label key={v} className="flex items-center gap-2 text-sm"><RadioGroupItem value={v} />{l}</label>
            ))}
          </RadioGroup>
          <div>
            <p className="mb-2 text-xs font-semibold">Period</p>
            <DatePresetToggle ariaLabel="Period" value={range} onChange={setRange} options={[{ id: 'today', label: 'Today' }, { id: '7d', label: '7 days' }, { id: '30d', label: '30 days' }, { id: 'month', label: 'This month' }]} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Free text 文本</CardTitle><CardDescription>Tags you create, and notes that may run long.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div><p className="mb-2 text-xs font-semibold">Product tags</p><TagInput value={tags} onValueChange={setTags} ariaLabel="Product tags" placeholder="Type a tag, then Enter" /></div>
          <div><label htmlFor="d-note" className="mb-2 block text-xs font-semibold">Delivery note</label><Textarea id="d-note" rows={2} placeholder="Ring twice. Salon closed on Mondays." /></div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- Feedback & states ---------------- */
export function States() {
  const [state, setState] = useState<'loading' | 'empty' | 'error' | 'data'>('loading');
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Every list has four states</CardTitle>
          <CardDescription>The card keeps its full height in all of them, so the page never jumps.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2" role="group" aria-label="List state">
            {(['loading', 'empty', 'error', 'data'] as const).map((s) => (
              <Button key={s} size="sm" variant={state === s ? 'default' : 'outline'} aria-pressed={state === s} onClick={() => setState(s)} data-state-btn={s}>
                {s === 'loading' ? 'Loading' : s === 'empty' ? 'Empty' : s === 'error' ? 'Error' : 'Data'}
              </Button>
            ))}
          </div>
          <div className="h-56 overflow-hidden rounded-xl border" data-state-view>
            {state === 'loading' ? (
              <div className="space-y-3 p-4" aria-busy="true">
                {[0, 1, 2, 3].map((i) => <div key={i} className="flex gap-4"><Skeleton className="h-5 w-24" /><Skeleton className="h-5 flex-1" /><Skeleton className="h-5 w-20" /></div>)}
              </div>
            ) : state === 'empty' ? (
              <Empty className="h-full">
                <EmptyHeader>
                  <EmptyMedia variant="icon"><PackageSearch /></EmptyMedia>
                  <EmptyTitle>No orders match “dye 9”</EmptyTitle>
                  <EmptyDescription>Search by order number, customer or SKU.</EmptyDescription>
                </EmptyHeader>
                <EmptyContent><Button variant="outline" size="sm">Clear search</Button></EmptyContent>
              </Empty>
            ) : state === 'error' ? (
              <Empty className="h-full">
                <EmptyHeader>
                  <EmptyMedia variant="icon"><TriangleAlert /></EmptyMedia>
                  <EmptyTitle>Orders could not load</EmptyTitle>
                  <EmptyDescription>The connection dropped. Nothing was changed.</EmptyDescription>
                </EmptyHeader>
                <EmptyContent><Button size="sm" onClick={() => setState('data')}><RefreshCw />Retry</Button></EmptyContent>
              </Empty>
            ) : (
              <Table>
                <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
                <TableBody>
                  {[['SO-0842', 'Luce Beauty Lab', '€ 438.00'], ['SO-0841', 'Studio Aurora', '€ 216.50'], ['SO-0840', 'Belle Mani', '€ 684.00']].map(([a, b, c]) => (
                    <TableRow key={a}><TableCell className="font-mono">{a}</TableCell><TableCell>{b}</TableCell><TableCell className="text-right tabular-nums">{c}</TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-3 gap-3">
        <Alert><Info /><AlertTitle>Prices updated</AlertTitle><AlertDescription>3 lines use the new list price.</AlertDescription></Alert>
        <Alert variant="destructive"><TriangleAlert /><AlertTitle>Stock too low</AlertTitle><AlertDescription>Only 4 left of 6 ordered.</AlertDescription></Alert>
        <div className="flex items-center gap-3 rounded-xl border bg-card px-3 text-xs"><Spinner />Recognising DDT… fields fill as they are read.</div>
      </div>
    </div>
  );
}

/* ---------------- Overlays ---------------- */
export function Overlays() {
  const [dialog, setDialog] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [confirm, setConfirm] = useState(false);
  return (
    <TooltipProvider delayDuration={150}>
      <div className="space-y-6">
        <div className="grid grid-cols-5 gap-3">
          {[
            ['Dialog', 'A focused task that must finish or cancel.', <Button key="d" size="sm" data-overlay="dialog" onClick={() => setDialog(true)}>New delivery</Button>],
            ['Sheet', 'Details beside the list you are working on.', <Button key="s" size="sm" variant="outline" data-overlay="sheet" onClick={() => setSheet(true)}>Open SO-0842</Button>],
            ['Popover', 'Small inputs tied to one control.', (
              <Popover key="p">
                <PopoverTrigger asChild><Button size="sm" variant="outline" data-overlay="popover">Discount</Button></PopoverTrigger>
                <PopoverContent className="w-64">
                  <PopoverHeader><PopoverTitle>Line discount</PopoverTitle><PopoverDescription>Applies to this line only.</PopoverDescription></PopoverHeader>
                  <div className="flex gap-2"><Input defaultValue="10" aria-label="Discount percent" /><Button size="default">Apply</Button></div>
                </PopoverContent>
              </Popover>
            )],
            ['Menu', 'Secondary row actions, kept out of sight.', (
              <DropdownMenu key="m">
                <DropdownMenuTrigger asChild><Button size="icon-sm" variant="outline" aria-label="More actions" data-overlay="menu"><MoreHorizontal /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem><Copy />Duplicate order</DropdownMenuItem>
                  <DropdownMenuItem><Printer />Print DDT</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onSelect={() => setConfirm(true)}><Trash2 />Void order</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )],
            ['Tooltip', 'A name or a short hint. Never required reading.', (
              <Tooltip key="t">
                <TooltipTrigger asChild><Button size="sm" variant="ghost" data-overlay="tooltip">Hover me</Button></TooltipTrigger>
                <TooltipContent>Shortcut <Kbd>⌘K</Kbd></TooltipContent>
              </Tooltip>
            )],
          ].map(([title, body, trigger]) => (
            <div key={title as string} className="flex flex-col rounded-lg bg-card p-4">
              <p className="text-sm font-semibold">{title}</p>
              <p className="mt-1 flex-1 text-xs leading-5 text-muted-foreground">{body}</p>
              <div className="mt-4">{trigger}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Dialogs come from one component family, sheets slide in from the right in 280ms, and nothing is built with a bare fixed overlay.</p>

        <Dialog open={dialog} onOpenChange={setDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>New delivery</DialogTitle><DialogDescription>SO-0842 · Luce Beauty Lab</DialogDescription></DialogHeader>
            <div className="grid gap-3">
              <div><p className="mb-2 text-xs font-semibold">Method</p><Input defaultValue="Courier" aria-label="Method" /></div>
              <div><p className="mb-2 text-xs font-semibold">Address</p><Input defaultValue="Via Paolo Sarpi 12, Milano" aria-label="Address" /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setDialog(false)}>Cancel</Button><Button onClick={() => setDialog(false)}>Create delivery</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        <Sheet open={sheet} onOpenChange={setSheet}>
          <SheetContent>
            <SheetHeader><SheetTitle>SO-0842</SheetTitle><SheetDescription>Luce Beauty Lab · 07/10/2026 15:21</SheetDescription></SheetHeader>
            <div className="space-y-3 px-4 text-sm">
              <Badge variant="info">Ready</Badge>
              {[['Lines', '6'], ['Total', '€ 438.00'], ['Delivery', 'Courier']].map(([a, b]) => (
                <div key={a} className="flex justify-between border-b pb-2"><span className="text-muted-foreground">{a}</span><span className="tabular-nums">{b}</span></div>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <ConfirmDialog open={confirm} onOpenChange={setConfirm} title="Void SO-0842?" description="Reserved stock for 6 lines is released. The order number is kept." cancelLabel="Cancel" confirmLabel="Void order" confirmVariant="destructive" onConfirm={() => setConfirm(false)} />
      </div>
    </TooltipProvider>
  );
}

/* ---------------- Dates & numbers ---------------- */

/* ---------------- Tabular numerals, animated ---------------- */
const eur = (v: number) => '€ ' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function useCounter() {
  const [value, setValue] = useState(1111.11);
  const [run, setRun] = useState(true);
  useEffect(() => {
    if (!run || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setValue((v) => (v > 9800 ? 1111.11 : v + 77.77 + Math.round(Math.random() * 300) / 100)), 90);
    return () => window.clearInterval(id);
  }, [run]);
  return { value, run, setRun };
}

function NumberColumn({ value, tabular }: { value: number; tabular: boolean }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [w, setW] = useState(0);
  useEffect(() => { setW(ref.current?.getBoundingClientRect().width ?? 0); }, [value]);
  const nums: React.CSSProperties = { fontVariantNumeric: tabular ? 'tabular-nums' : 'proportional-nums' };
  return (
    <div className={`rounded-lg border p-4 ${tabular ? 'border-primary/50' : ''}`} data-numerals={tabular ? 'tabular' : 'proportional'}>
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-semibold">{tabular ? 'Tabular · used' : 'Proportional · not used'}</p>
        <code className="text-[10px] text-muted-foreground">{tabular ? 'tabular-nums' : 'proportional-nums'}</code>
      </div>
      <p className="mt-4 text-[11px] text-muted-foreground">A changing total</p>
      <span ref={ref} className="inline-block text-4xl font-semibold" style={nums}>{eur(value)}</span>
      <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
        <span className={`h-1.5 rounded-full ${tabular ? 'bg-primary' : 'bg-destructive/70'}`} style={{ width: w }} />
        <span className="tabular-nums">{w.toFixed(1)}px</span>
      </div>
      <p className="mt-5 text-[11px] text-muted-foreground">Two amounts in a column</p>
      <div className="relative mt-1 inline-block text-xl" style={nums}>
        <div>{eur(1111.11)}</div>
        <div>{eur(8888.88)}</div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{tabular ? 'Every digit is the same width: the total holds still, columns line up.' : 'A 1 is narrower than an 8: the total jitters as it counts, columns drift.'}</p>
    </div>
  );
}

export function TabularDemo() {
  const { value, run, setRun } = useCounter();
  return (
    <div className="mb-6 rounded-lg bg-card p-5" data-tabular-demo>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Same numbers, two kinds of digits</p>
        <Button size="sm" variant="outline" onClick={() => setRun((r) => !r)} data-demo="tick">{run ? 'Pause' : 'Play'}</Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberColumn value={value} tabular={false} />
        <NumberColumn value={value} tabular />
      </div>
    </div>
  );
}

export function Formats() {
  const rows: [string, string, string][] = [
    ['Business date', '07/10/2026', '2026-10-07 · Oct 7 · 7 ott'],
    ['Date and time', '07/10/2026 15:21', '3:21 PM · browser time zone'],
    ['Audit log', '07/10/2026 15:21:08', '“12 minutes ago”'],
    ['Month on a chart', '10/2026', 'Oct 26'],
    ['Range', '01/10/2026–07/10/2026', '1–7 Oct'],
    ['Amount', '€ 1,216.50', '1216.5 €, proportional digits'],
    ['Document number', 'SO-0842 · DDT-2026-0113', 'Body font, mixed widths'],
  ];
  return (
    <>
    <TabularDemo />
    <div className="grid grid-cols-[1fr_240px] gap-6">
      <div className="overflow-hidden rounded-lg bg-card">
        <div className="grid grid-cols-[160px_1fr_1fr] gap-4 border-b px-4 py-2 text-xs font-semibold text-muted-foreground"><span>Value</span><span>Shown as</span><span>Never</span></div>
        {rows.map(([a, b, c]) => (
          <div key={a} data-format className="grid grid-cols-[160px_1fr_1fr] items-baseline gap-4 border-b px-4 py-3 text-sm last:border-b-0">
            <span className="text-xs text-muted-foreground">{a}</span>
            <span className={a === 'Document number' ? 'font-mono' : 'tabular-nums'} style={{ fontVariantNumeric: 'tabular-nums' }}>{b}</span>
            <span className="text-xs text-muted-foreground line-through decoration-destructive/60">{c}</span>
          </div>
        ))}
      </div>
      <div className="space-y-3 rounded-lg bg-card p-4 text-xs leading-5 text-muted-foreground">
        <p className="text-sm font-semibold text-foreground">One formatter</p>
        <p>Every time is converted to Europe/Rome, 24-hour. Pages call one shared date helper; none formats dates on its own.</p>
        <p>Business records never use relative time. A stock movement needs the exact moment.</p>
        <p>Every date, time and amount uses tabular digits; document numbers and SKUs use the mono font.</p>
      </div>
    </div>
    </>
  );
}
