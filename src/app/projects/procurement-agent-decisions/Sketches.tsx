/** Low-fidelity sketches, one per design direction. Drawn for this page to compare the layouts. */
import type { ReactNode } from 'react';

const INK = 'var(--case-ink)';
const LINE = 'var(--case-line)';
const MUTED = 'var(--case-muted)';
const LINK = 'var(--case-flow-link)';
const WHITE = 'var(--case-white)';
const FILL = 'var(--case-surface)';
const FONT = { fontFamily: 'var(--case-font-body)', fontSize: 'var(--case-text-12)' };

const Box = ({ x, y, w, h, accent, fill = WHITE }: { x: number; y: number; w: number; h: number; accent?: boolean; fill?: string }) =>
  <rect x={x} y={y} width={w} height={h} rx="5" fill={fill} stroke={accent ? LINK : LINE} strokeWidth={accent ? 2 : 1} />;
const Bar = ({ x, y, w, color = LINE }: { x: number; y: number; w: number; color?: string }) =>
  <rect x={x} y={y} width={w} height="5" rx="2.5" fill={color} />;
const Text = ({ x, y, children, color = INK, anchor = 'middle' }: { x: number; y: number; children: ReactNode; color?: string; anchor?: 'start' | 'middle' }) =>
  <text x={x} y={y} textAnchor={anchor} fill={color} {...FONT}>{children}</text>;
const Rows = ({ x, y, w, n, gap = 16 }: { x: number; y: number; w: number; n: number; gap?: number }) =>
  <>{Array.from({ length: n }, (_, i) => <g key={i}><Bar x={x} y={y + i * gap} w={w * 0.5} /><Bar x={x + w * 0.65} y={y + i * gap} w={w * 0.2} /></g>)}</>;

function Frame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 240 150" role="img" aria-label={`Sketch: ${label}`}>
      <rect x="1" y="1" width="238" height="148" rx="8" fill={FILL} stroke={LINE} />
      {children}
    </svg>
  );
}

export const SKETCHES = {
  chatExplains: (
    <Frame label="a purchase table with a chat panel that explains it">
      <Box x={10} y={12} w={138} h={126} /><Rows x={20} y={26} w={118} n={7} />
      <Box x={156} y={12} w={74} h={126} />
      <Box x={162} y={22} w={62} h={38} fill={FILL} /><Bar x={168} y={30} w={48} color={MUTED} /><Bar x={168} y={40} w={40} /><Bar x={168} y={50} w={46} />
      <Text x={193} y={82} color={MUTED}>explains</Text><Bar x={168} y={92} w={48} /><Bar x={168} y={102} w={36} />
    </Frame>
  ),
  freeText: (
    <Frame label="a full chat with only a free text box">
      <Box x={110} y={16} w={116} h={24} /><Bar x={122} y={26} w={90} color={MUTED} />
      <Box x={14} y={50} w={130} h={36} /><Bar x={26} y={60} w={100} /><Bar x={26} y={72} w={74} />
      <Text x={192} y={76} color={MUTED}>which item?</Text>
      <Box x={14} y={108} w={212} h={28} /><Text x={26} y={126} color={MUTED} anchor="start">type anything…</Text>
    </Frame>
  ),
  chatFields: (
    <Frame label="a chat that turns words into supplier and coverage fields">
      <Box x={110} y={12} w={116} h={24} /><Bar x={122} y={22} w={90} color={MUTED} />
      <Box x={14} y={46} w={212} h={92} accent />
      <Text x={26} y={66} anchor="start">Supplier</Text><Box x={96} y={54} w={116} h={18} fill={FILL} />
      <Text x={26} y={92} anchor="start">Coverage</Text><Box x={96} y={80} w={34} h={18} fill={LINK} /><Box x={137} y={80} w={34} h={18} /><Box x={178} y={80} w={34} h={18} />
      <Box x={96} y={108} w={116} h={20} fill={INK} /><Text x={154} y={122} color={WHITE}>Create draft</Text>
    </Frame>
  ),
  threePlans: (
    <Frame label="three scenario cards side by side">
      {['Safe', 'Balanced', 'Growth'].map((name, i) => (
        <g key={name}><Box x={10 + i * 76} y={14} w={68} h={122} /><Text x={44 + i * 76} y={32}>{name}</Text><Rows x={18 + i * 76} y={46} w={60} n={4} /><Box x={18 + i * 76} y={110} w={52} h={16} fill={FILL} /></g>
      ))}
    </Frame>
  ),
  modelNumber: (
    <Frame label="a chat answer that states a quantity">
      <Box x={14} y={20} w={212} h={110} />
      <Text x={120} y={46} color={MUTED}>“I suggest ordering”</Text>
      <text x="120" y="90" textAnchor="middle" fill={INK} fontFamily="var(--case-font-heading)" fontSize="var(--case-text-24)">96 pcs ?</text>
      <Bar x={60} y={106} w={120} /><Text x={120} y={126} color={MUTED}>no calculation</Text>
    </Frame>
  ),
  onePlan: (
    <Frame label="one editable table with the reason for a line">
      <Box x={10} y={12} w={220} h={126} />
      <Rows x={22} y={28} w={196} n={2} gap={18} />
      <Box x={16} y={58} w={208} h={22} accent /><Bar x={26} y={67} w={70} color={INK} /><Box x={130} y={61} w={36} h={16} fill={FILL} /><Text x={196} y={73} color={LINK}>why?</Text>
      <Box x={94} y={86} w={130} h={44} fill={FILL} /><Text x={159} y={103}>sales − stock</Text><Text x={159} y={120} color={MUTED}>+ lead time</Text>
    </Frame>
  ),
};
