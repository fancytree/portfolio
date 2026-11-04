'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Check, FileText, Package, Pause, Play, ShoppingBag } from 'lucide-react';
import { Stage } from '../../components/stageshow/kit/stage';
import { Window, Bar } from '../../components/stageshow/kit/window';
import { Row } from '../../components/stageshow/kit/parts/Row';
import { Card } from '../../components/stageshow/kit/parts/Card';
import { Badge } from '../../components/stageshow/kit/controls/Badge';
import { Roll } from '../../components/stageshow/kit/motion/Roll';
import { Connector } from '../../components/stageshow/kit/motion/Connector';
import type { Act } from '../../components/stageshow/kit/act';
import './def-erp-hero.css';

// Adapted from Stageshow's bento gold: measured, native-size picture slots,
// one window, a typography tile, a physical object and a connector diagram.
// One 12-second story; the outgoing record leaves before the next arrives.
type Beat = { phase: number; leaving: boolean };
const erpTokens = {
  '--ss-ink-1': '#edf4ff',
  '--ss-text-strong': '#1e3a5f',
  '--ss-text': '#647a98',
  '--ss-icon': '#1366d6',
  '--ss-canvas': '#f4f7fc',
};
const opening: Beat = { phase: 0, leaving: false };
const poster: Beat = { phase: 3, leaving: false };
async function story(a: Act<Beat>) {
  await a.wait(1400);
  a.mark('received'); a.put({ phase: 1 });
  await a.wait(1800);
  a.mark('connected'); a.put({ phase: 2 });
  await a.wait(2200);
  a.mark('dispatch'); a.put({ phase: 3 });
  await a.wait(3000);
  a.mark('next-record'); a.put({ leaving: true });
  await a.wait(850);
  await a.snap({ phase: 0, leaving: true });
  await a.wait(550);
  a.put({ leaving: false });
  await a.wait(1400);
}

function Picture({ children, height, kind }: { children: (width: number) => ReactNode; height: number | ((width: number) => number); kind: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(358);
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () => setWidth(node.getBoundingClientRect().width);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`de-picture de-picture--${kind}`} style={{ height: typeof height === 'function' ? height(width) : height }}>{children(width)}</div>;
}

function Platform({ paused }: { paused: boolean }) {
  return <section className="de-tile de-tile--platform" aria-label="Live sales order workspace">
    <p className="de-copy">Every order. In view.</p>
    <Picture height={width => width < 300 ? 236 : 274} kind="platform">{width => <Stage<Beat> width={width} height={width < 300 ? 236 : 274} initial={opening} poster={poster} script={paused ? undefined : story} palette="accent" accent="#1366d6" greys="cool" tokens={erpTokens} className="de-stage">
      {s => <Window title="Sales orders" lights="grey" toolbar={<Bar w={24} h={14} tone={2} />} sidebar={width > 470 ? <div className="de-sidebar"><span>DEF Beauty</span>{[56, 42, 64, 48].map((w, i) => <div key={i} className="de-nav" data-active={i === 0 || undefined}><Bar w={10} h={10} r={2} tone={i ? 2 : 4} /><Bar w={w} h={5} tone={i ? 2 : 4} /></div>)}</div> : undefined} sidebarWidth={112} className="de-window" style={{width: Math.max(width + 100, 490)}}>
        <div className="de-ledger">
          <div className="de-ledger-label" style={{width: Math.min(300, width - 32)}}><span>Customer</span><span>Status</span></div>
          <Row pad={12} className="de-row" style={{width: Math.min(326, width - 32)}} title={<Bar w={94} h={6} tone={2} />} meta={<Bar w={44} h={6} tone={1} />} />
          <div className="de-order-track" style={{width: Math.min(326, width - 32)}} data-leaving={s.leaving || undefined}>
            <Row pad={12} selected className="de-row" style={{width: Math.min(326, width - 32)}} lead={<ShoppingBag size={16} strokeWidth={1.5} />} title={width < 330 ? 'Bellezza' : 'Bellezza Milano'} subtitle="24 pcs" meta={<Badge className="de-order-status" tone="accent"><Roll variant="fade">{s.phase >= 3 ? 'Dispatched' : s.phase >= 1 ? 'Ready' : 'New'}</Roll></Badge>} />
          </div>
          {[74, 108, 88, 96].map((w, i) => <Row pad={12} className="de-row" style={{width: Math.min(326, width - 32)}} key={w} title={<Bar w={w} h={6} tone={i ? 1 : 2} />} meta={<Bar w={42 + i * 4} h={6} tone={1} />} />)}
        </div>
      </Window>}
    </Stage>}</Picture>
  </section>;
}

function SharedRecord() {
  return <section className="de-tile de-tile--stat" aria-label="One shared business record">
    <p className="de-copy">One source of truth.</p>
    <div className="de-stat"><span className="de-number">1</span><span className="de-stat-label">Shared record</span><div className="de-stat-rule" /><span className="de-stat-foot">Across the business</span></div>
  </section>;
}

function Document({ paused }: { paused: boolean }) {
  return <section className="de-tile de-tile--object" aria-label="Delivery document prepared from the order">
    <p className="de-copy">Ready to go.</p>
    <Picture height={266} kind="object">{width => <Stage<Beat> width={width} height={266} initial={opening} poster={poster} script={paused ? undefined : story} palette="accent" accent="#1366d6" greys="cool" tokens={erpTokens} className="de-stage">
      {s => <div className="de-paper-scene" data-ready={s.phase >= 3 || undefined} data-leaving={s.leaving || undefined}>
        <div className="de-paper-back" />
        <Card className="de-paper" pad="large" gap={16}>
          <div className="de-paper-head"><span>DDT</span><span>001248</span></div>
          <div className="de-paper-lines"><Bar w={82} h={5} tone={3} /><Bar w={116} h={5} tone={1} /></div>
          <div className="de-paper-quantity"><span>24</span><small>pcs</small></div>
          <div className="de-barcode" aria-hidden>{Array.from({length:25},(_,i)=><i key={i} style={{width: [1,2,1,3,1,2,3][i%7]}} />)}</div>
        </Card>
        <span className="de-document-seal"><Check size={18} strokeWidth={1.5} /></span>
      </div>}
    </Stage>}</Picture>
  </section>;
}

function Connected({ paused }: { paused: boolean }) {
  return <section className="de-tile de-tile--diagram" aria-label="The order connects inventory and invoicing">
    <p className="de-copy">Connected by design.</p>
    <Picture height={242} kind="diagram">{width => <Stage<Beat> width={width} height={242} initial={opening} poster={poster} script={paused ? undefined : story} palette="accent" accent="#1366d6" greys="cool" tokens={erpTokens} className="de-stage">
      {(s, rect) => {
        const source = rect('order');
        const stock = rect('stock');
        const invoice = rect('invoice');
        return <div className="de-diagram" data-leaving={s.leaving || undefined}>
          <Card className="de-node de-node--order" data-target="order" pad="small" gap={12}><ShoppingBag size={20} strokeWidth={1.4} /><span>Order</span></Card>
          <Card className="de-node de-node--stock" data-target="stock" pad="small" gap={12}><Package size={20} strokeWidth={1.4} /><span>Stock</span></Card>
          <Card className="de-node de-node--invoice" data-target="invoice" pad="small" gap={12}><FileText size={20} strokeWidth={1.4} /><span>Invoice</span></Card>
          <Connector from={{x:source.x+source.width,y:source.y+source.height/2}} to={{x:stock.x,y:stock.y+stock.height/2}} route="step" show={s.phase>=1} dots="none" />
          <Connector from={{x:source.x+source.width,y:source.y+source.height/2}} to={{x:invoice.x,y:invoice.y+invoice.height/2}} route="step" show={s.phase>=2} dots="none" />
        </div>;
      }}
    </Stage>}</Picture>
  </section>;
}

export default function DefErpHero() {
  const [paused, setPaused] = useState(false);
  return <div id="def-erp-hero" className="def-erp-hero"><div className="de-board"><div className="de-grid"><Platform paused={paused} /><SharedRecord /><Document paused={paused} /><Connected paused={paused} /></div></div><div className="de-motion-control"><button type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play size={12} /> : <Pause size={12} />}{paused ? 'Resume motion' : 'Pause motion'}</button></div></div>;
}
