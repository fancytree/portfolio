'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Check, Database, FileCheck2, FileText, Pencil, ShieldCheck } from 'lucide-react';
import { Stage } from '../stageshow/kit/stage';
import { Bar } from '../stageshow/kit/window';
import { Card } from '../stageshow/kit/parts/Card';
import { Row } from '../stageshow/kit/parts/Row';
import { Badge } from '../stageshow/kit/controls/Badge';
import { Button } from '../stageshow/kit/controls/Button';
import { Field } from '../stageshow/kit/controls/Field';
import { Roll } from '../stageshow/kit/motion/Roll';
import { Stream } from '../stageshow/kit/motion/Stream';
import { Connector } from '../stageshow/kit/motion/Connector';
import { Count } from '../stageshow/kit/motion/Count';
import type { Act } from '../stageshow/kit/act';
import './procurement-cover.css';

type Scene = { resetting: boolean; composer: string; sources: number; words: number; rows: number; edit: boolean; selected: boolean; value: string; quantity: number; reviewed: boolean };
const initial: Scene = { resetting: false, composer: '', sources: 0, words: 0, rows: 0, edit: false, selected: false, value: '', quantity: 144, reviewed: false };
const answer = 'I’ve prepared a 30-day purchase plan for MNP. Review and adjust the suggested quantities before ordering.';
const products = [
  { name: 'Reinforced bonder', stock: 53, sales: 108, quantity: 144, price: 5.2333333333 },
  { name: 'Classic bonder', stock: 27, sales: 76, quantity: 108, price: 4.6666666667 },
  { name: 'Color gel', stock: 37, sales: 81, quantity: 108, price: 6.2 },
  { name: 'Care treatment', stock: 34, sales: 58, quantity: 72, price: 6.5 },
  { name: 'Functional treatment', stock: 13, sales: 30, quantity: 42, price: 8.1714285714 },
  { name: 'Top coat', stock: 56, sales: 76, quantity: 84, price: 4.5 },
];
const sources = [
  { name: 'Sales · last 30 days', value: '108 sold', icon: Database },
  { name: 'Stock on hand', value: '53 units', icon: FileText },
  { name: 'Supplier lead time', value: '14 days', icon: FileCheck2 },
];
const money = (value: number) => `€${value.toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const poster: Scene = { ...initial, sources: 3, words: 30, rows: 6, quantity: 120, reviewed: true };

// The story gold supplies the overlapping document + linked satellite
// composition. Table-edit supplies the measured same-cell edit gesture.
async function script(a: Act<Scene>) {
  a.mark('opening');
  await a.wait(750);
  a.mark('retrieve');
  for (let sources = 1; sources <= 3; sources++) {
    a.put({ sources });
    await a.wait(650);
  }
  a.mark('generate');
  for (let words = 1; words <= answer.split(' ').length; words++) {
    a.put({ words });
    if (words >= 5 && words % 2 === 1) a.put({ rows: Math.min(6, (words - 3) / 2) });
    await a.wait(90);
  }
  a.put({ rows: 6 });
  await a.wait(1100);
  a.mark('edit');
  await a.move({ at: 'quantity-0' });
  await a.click({ at: 'quantity-0' }, { double: true });
  a.put({ edit: true, selected: true, value: '144' });
  await a.wait(550);
  await a.move({ at: 'rest' });
  a.put({ selected: false, value: '' });
  await a.type('value', '120', { interval: 160 });
  await a.wait(350);
  a.put({ edit: false, quantity: 120, reviewed: true });
  a.mark('payoff');
  await a.wait(2000);
  a.mark('restart');
  await a.type('composer', 'Plan MNP for 30 days', { interval: 22 });
  await a.move({ at: 'restart-request' });
  await a.click({ at: 'restart-request' });
  a.put({ resetting: true });
  await a.wait(450);
  // Reset generated values only while their content is masked. The repeated
  // request and card frames remain the visual anchor across the loop seam.
  await a.snap({ ...initial, resetting: true });
  await a.wait(80);
  await a.set({ resetting: false });
  await a.wait(450);
}

export default function ProcurementCover() {
  const figure = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // The illustration is inert so the project card stays one navigation
    // target. Listen on that link instead of the illustration's controls.
    const link = figure.current?.closest('a');
    if (!link) return;
    const enter = (event: PointerEvent) => {
      if (event.pointerType !== 'touch') setPlaying(true);
    };
    const leave = () => setPlaying(false);
    link.addEventListener('pointerenter', enter);
    link.addEventListener('pointerleave', leave);
    link.addEventListener('pointercancel', leave);
    return () => {
      link.removeEventListener('pointerenter', enter);
      link.removeEventListener('pointerleave', leave);
      link.removeEventListener('pointercancel', leave);
    };
  }, []);

  return (
    <figure ref={figure} className="procurement-hero procurement-cover" aria-label="Procurement Agent retrieves evidence, generates a purchase recommendation, and leaves the purchase quantities editable for the buyer.">
      <Stage<Scene> width={1088} height={680} initial={initial} poster={poster} script={playing ? script : undefined} play="loop" fidelity="standard" accent="#1262d6" greys="warm" cursor={{ at: { wide: { x: 900, y: 650 }, compact: { x: 310, y: 540 } }, idle: 1200 }} className="pa-scene">
        {(s, rect, layout) => {
          const compact = layout === 'compact';
          const total = products.reduce((sum, p, i) => sum + (i === 0 ? s.quantity : p.quantity) * p.price, 0);
          const chatAnchor = rect('chat-card');
          const evidenceAnchor = rect('evidence-card');
          const orderTitle = rect('order-title');
          const orderCard = rect('order-card');
          const complete = s.rows === 6;
          return <>
            <div className="pa-ambient" />
            <div className="pa-composition" data-resetting={s.resetting || undefined}>
            <div className="pa-order-slot"><Card className="pa-order" data-target="order-card" pad="large" gap={0}>
              <div className="pa-order-content">
                <header className="pa-order-header">
                  <div className="pa-document-label"><FileText size={18} /><span data-target="order-title">Purchase order</span></div>
                  <div className="pa-order-title"><h3>MNP</h3><Badge tone={complete ? 'accent' : 'neutral'}><Roll variant="fade">{complete ? 'Editable draft' : 'Preparing draft'}</Roll></Badge></div>
                  <p>MESAUDA NAIL PRO <span>·</span> 30-day coverage</p>
                </header>
                <div className="pa-plan-summary" data-target="order-in"><span className="pa-source-dot" /><Roll variant="fade">{complete ? '6 products · 13 SKUs recommended' : 'Building your purchase recommendation'}</Roll></div>
                <section className="pa-plan" aria-label="Editable purchase recommendation">
                  <div className="pa-table-head"><span>Product</span><span>Order qty <Pencil size={10} /></span>{!compact && <><span>Stock</span><span>Sales</span></>}</div>
                  {products.slice(0, compact ? 3 : 6).map((p, i) => {
                    const ready = s.rows > i;
                    const quantity = i === 0 ? s.quantity : p.quantity;
                    return <Row key={p.name} className="pa-product" title={<span className="pa-name-slot" data-ready={ready || undefined}><span className="pa-name-placeholder"><Bar w={100 + i % 3 * 20} h={6} /></span><span className="pa-name-text">{p.name}</span></span>} pad={10}>
                      <div className="pa-quantity-slot" data-ready={ready || undefined}>
                        <span className="pa-quantity-placeholder"><Bar w={30} h={6} /></span>
                        <input aria-label={`Order quantity for ${p.name}`} type="text" inputMode="numeric" pattern="[0-9]*" data-target={`quantity-${i}`} data-cursor="ibeam" data-edit={i === 0 && s.edit || undefined} data-selected={i === 0 && s.selected || undefined} data-typing={i === 0 && s.edit || undefined} value={i === 0 && s.edit ? s.value : String(quantity)} disabled={!ready || s.edit} readOnly tabIndex={-1} />
                      </div>
                      {!compact && <><span className="pa-stock">{p.stock}</span><span className="pa-sales">{p.sales}</span></>}
                    </Row>;
                  })}
                  {compact && <div className="pa-more">+ 3 more products</div>}
                  <footer className="pa-order-total" data-target="rest"><div><span>Estimated total</span><small>Shipping included</small></div><div className="pa-total-slot" data-ready={complete || undefined}><span className="pa-total-placeholder"><Bar w={100} h={12} /></span><strong><Count value={total} format={money} duration={650} /></strong></div></footer>
                  <div className="pa-buyer-note"><ShieldCheck size={14} /><Roll variant="fade">{s.reviewed ? (compact ? 'Your changes are saved. You decide.' : 'Your changes are saved. You make the final call.') : (compact ? 'AI suggests. You make the final call.' : 'AI suggests. You decide what gets ordered.')}</Roll></div>
                </section>
              </div>
            </Card></div>

            <div className="pa-chat-slot"><Card className="pa-chat" data-target="chat-card" pad="large" gap={0}>
              <div className="pa-chat-head"><span className="pa-live" /><strong>Procurement agent</strong><Badge tone="neutral">Chat</Badge></div>
              <div className="pa-user-message">Plan MNP for the next 30 days.</div>
              <div className="pa-retrieval" data-target="chat-evidence"><Database size={13} /><Roll variant="fade">{s.sources === 3 ? '3 evidence sources checked' : 'Checking your purchase data…'}</Roll></div>
              <div className="pa-response" data-target="chat-output"><Stream text={answer} count={s.words} /><span className="pa-thinking" data-show={!s.words || undefined}><i /><i /><i /></span></div>
              <div className="pa-chat-composer"><Field value={s.composer} placeholder="Ask about this plan…" trailing={<Button data-target="restart-request" variant="primary" size="small" aria-label="Send message illustration" icon={<ArrowUp size={12} />} />} /></div>
            </Card></div>

            <div className="pa-evidence-slot"><Card className="pa-evidence" data-target="evidence-card" pad="large" gap={0}>
              <div className="pa-evidence-heading" data-target="evidence-in"><div><span className="pa-eyebrow">GROUNDED IN YOUR DATA</span><h4>Evidence</h4></div><Badge tone={s.sources === 3 ? 'success' : 'neutral'}><Roll variant="fade">{s.sources === 3 ? '3 verified' : 'Retrieving'}</Roll></Badge></div>
              <p className="pa-evidence-subtitle">Reinforced bonder · MNP</p>
              <div className="pa-evidence-list" data-target="evidence-out">{sources.map((source, i) => <Row key={source.name} title={source.name} lead={<source.icon size={14} />} pad={8} className="pa-source-row"><span className="pa-source-value" data-checked={s.sources > i || undefined}><span className="pa-source-loading"><Bar w={40} h={5} /></span><span className="pa-source-result">{source.value}<Check size={12} /></span></span></Row>)}</div>
            </Card></div>
            <>
              <Connector from={compact ? { x: evidenceAnchor.x + evidenceAnchor.width / 2, y: evidenceAnchor.y + evidenceAnchor.height } : { x: chatAnchor.x + chatAnchor.width / 2, y: evidenceAnchor.y }} to={compact ? { x: chatAnchor.x + chatAnchor.width / 2, y: chatAnchor.y } : { x: chatAnchor.x + chatAnchor.width / 2, y: chatAnchor.y + chatAnchor.height }} route="straight" arrow show={s.sources === 3 && !s.resetting} className="pa-evidence-link" />
              <Connector from={compact ? { x: chatAnchor.x + chatAnchor.width / 2, y: chatAnchor.y + chatAnchor.height } : { x: chatAnchor.x + chatAnchor.width / 2, y: chatAnchor.y }} to={compact ? { x: orderCard.x + orderCard.width / 2, y: orderCard.y } : { x: orderTitle.x + orderTitle.width + 18, y: orderTitle.y + orderTitle.height / 2 }} route={compact ? "straight" : "v"} arrow show={s.words > 3 && !s.resetting} className="pa-plan-link" />
            </>
            </div>
          </>;
        }}
      </Stage>
    </figure>
  );
}
