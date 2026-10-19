'use client';

import { useState } from 'react';
import { FormInput, FormSearchInput, FormSelect, FormTextarea } from './components/FormControls';
import RegistryButton from './components/RegistryButton';
import ChoiceOption from './components/ChoiceOption';
import BudgetStatusCard from './runtime/cards/BudgetStatusCard';
import SpendingRecordsCard from './runtime/cards/SpendingRecordsCard';
import ConfirmTransactionCard from './runtime/cards/ConfirmTransactionCard';
import InsightCardComponent from './runtime/cards/InsightCardComponent';
import type { AIParsedTransaction, InsightCard } from './runtime/types';

function ComponentPrimitives() {
  const [amount, setAmount] = useState('$89.40');
  const [query, setQuery] = useState('Dining');
  const [selectedSearchCategory, setSelectedSearchCategory] = useState('Dining');
  const [selectedCategory, setSelectedCategory] = useState('dining');
  const [note, setNote] = useState('');
  const searchCategories = ['Dining', 'Groceries', 'Transport', 'Shopping', 'Health'];
  const filteredCategories = searchCategories.filter((category) => category.toLowerCase().includes(query.trim().toLowerCase()));
  const [choice, setChoice] = useState('dining');
  const [includeNote, setIncludeNote] = useState(true);
  const [buttonFeedback, setButtonFeedback] = useState('');
  const sectionStyle = { minWidth: 0, display: 'flex', flexDirection: 'column' as const, gap: 14 };
  const sectionHeading = { color: '#ececec', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, margin: '0 0 2px' };
  const componentName = { color: '#62c4b7', fontFamily: 'var(--font-geist-mono), monospace', fontSize: 10, fontWeight: 600, margin: '0 0 7px' };
  const controlRow = { display: 'flex', alignItems: 'center', flexWrap: 'wrap' as const, gap: 8 };
  const feedback = (name: string) => setButtonFeedback(name);

  return (
    <div className="grid min-w-0 grid-cols-1 gap-8 sm:grid-cols-2 xl:col-span-12 xl:grid-cols-3">
      <section style={sectionStyle} aria-label="Input components">
        <h3 style={sectionHeading}>Inputs</h3>
        <div>
          <p style={componentName}>FormInput</p>
          <FormInput aria-label="Amount example" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="$0.00" />
          <div aria-live="polite" style={{ minHeight: 14, marginTop: 5, color: '#9b9b9b', fontSize: 10 }}>{amount.trim() ? `Amount · ${amount}` : 'Enter a transaction amount'}</div>
        </div>
        <div>
          <p style={componentName}>FormSearchInput</p>
          <FormSearchInput aria-label="Search categories" placeholder="Search categories" value={query} onChange={(event) => setQuery(event.target.value)} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 7, minHeight: 25 }}>
            {filteredCategories.length ? filteredCategories.map((category) => (
              <button key={category} type="button" onClick={() => { setSelectedSearchCategory(category); setQuery(category); }} aria-pressed={selectedSearchCategory === category}
                style={{ padding: '3px 8px', borderRadius: 999, border: `1px solid ${selectedSearchCategory === category ? 'rgba(16,163,127,0.5)' : 'rgba(255,255,255,0.10)'}`, background: selectedSearchCategory === category ? 'rgba(16,163,127,0.14)' : 'rgba(255,255,255,0.04)', color: selectedSearchCategory === category ? '#62c4b7' : '#9b9b9b', fontSize: 10, cursor: 'pointer' }}>
                {category}
              </button>
            )) : <span style={{ color: '#9b9b9b', fontSize: 10, paddingTop: 4 }}>No matching categories</span>}
          </div>
        </div>
        <div>
          <p style={componentName}>FormTextarea</p>
          <FormTextarea aria-label="Transaction note" placeholder="Add a note" rows={2} maxLength={120} value={note} onChange={(event) => setNote(event.target.value)} />
          <div aria-live="polite" style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 5, color: '#9b9b9b', fontSize: 10 }}>
            <span>{note ? 'Note added to this transaction' : 'Optional transaction details'}</span><span>{note.length}/120</span>
          </div>
        </div>
      </section>

      <section style={sectionStyle} aria-label="Button components">
        <h3 style={sectionHeading}>Buttons</h3>
        <div>
          <p style={componentName}>RegistryButton · variants</p>
          <div style={controlRow}>
            <RegistryButton props={{ label: 'Primary', variant: 'primary', onClick: () => feedback('Primary action') }} />
            <RegistryButton props={{ label: 'Secondary', variant: 'secondary', onClick: () => feedback('Secondary action') }} />
            <RegistryButton props={{ label: 'Ghost', variant: 'ghost', onClick: () => feedback('Ghost action') }} />
            <RegistryButton props={{ variant: 'icon', tone: 'neutral', icon: 'pencil', ariaLabel: 'Edit sample', title: 'Edit', onClick: () => feedback('Edit action') }} />
            <RegistryButton props={{ variant: 'icon', tone: 'danger', icon: 'trash', ariaLabel: 'Delete sample', title: 'Delete', onClick: () => feedback('Delete action') }} />
          </div>
        </div>
        <div>
          <p style={componentName}>RegistryButton · sizes</p>
          <div style={controlRow}>
            <RegistryButton props={{ label: 'Small', variant: 'primary', size: 'sm', onClick: () => feedback('Small button') }} />
            <RegistryButton props={{ label: 'Medium', variant: 'primary', size: 'md', onClick: () => feedback('Medium button') }} />
            <RegistryButton props={{ label: 'Large', variant: 'primary', size: 'lg', onClick: () => feedback('Large button') }} />
          </div>
        </div>
        <div aria-live="polite" style={{ minHeight: 16, color: '#62c4b7', fontSize: 11 }}>{buttonFeedback ? buttonFeedback + ' clicked' : 'Click a button to preview its action.'}</div>
      </section>

      <section style={sectionStyle} aria-label="Selection components">
        <h3 style={sectionHeading}>Selection</h3>
        <div>
          <p style={componentName}>FormSelect</p>
          <FormSelect aria-label="Category example" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
            <option value="dining">Food &amp; Dining</option>
            <option value="transport">Transport</option>
            <option value="shopping">Shopping</option>
          </FormSelect>
        </div>
        <div>
          <p style={componentName}>ChoiceOption · radio</p>
          <div style={{ display: 'grid', gap: 6 }}>
            <ChoiceOption mode="radio" name="registry-category" value="dining" label="Dining" checked={choice === 'dining'} onCheckedChange={(checked) => setChoice(checked ? 'dining' : choice)} />
            <ChoiceOption mode="radio" name="registry-category" value="groceries" label="Groceries" checked={choice === 'groceries'} onCheckedChange={(checked) => setChoice(checked ? 'groceries' : choice)} />
          </div>
        </div>
        <div>
          <p style={componentName}>ChoiceOption · checkbox</p>
          <ChoiceOption mode="checkbox" name="registry-note" value="include-note" label="Include note" checked={includeNote} onCheckedChange={setIncludeNote} />
        </div>
      </section>
    </div>
  );
}


const records = [
  { id: 'record-1', category: 'Food', description: 'Whole Foods Market', amount: '-$42.80', date: 'Today', type: 'expense' as const },
  { id: 'record-2', category: 'Transport', description: 'Uber ride', amount: '-$18.50', date: 'Yesterday', type: 'expense' as const },
  { id: 'record-3', category: 'Income', description: 'Salary deposit', amount: '+$4,200.00', date: 'Mar 1', type: 'income' as const },
];
const categories = [
  { label: 'Food', value: 420 },
  { label: 'Transport', value: 180 },
  { label: 'Shopping', value: 260 },
  { label: 'Bills', value: 340 },
];
const insights: InsightCard[] = [
  { id: 'insight-trend', title: 'Weekly spend trend', subtitle: 'Daily totals', chartType: 'sparkline', data: [{ label: 'Jun 2', value: 82 }, { label: 'Jun 3', value: 36 }, { label: 'Jun 4', value: 146 }, { label: 'Jun 5', value: 58 }, { label: 'Jun 6', value: 158 }, { label: 'Jun 7', value: 121 }, { label: 'Jun 8', value: 42 }], summary: '', tags: [], animateIn: true },
  { id: 'insight-ranking', title: 'Top merchants', subtitle: 'By visit count', chartType: 'bar', data: [{ label: 'Starbucks', value: 12 }, { label: 'Whole Foods', value: 8 }, { label: 'Uber', value: 6 }], summary: 'Coffee visits increased 20% week over week.', tags: ['Habits'], animateIn: true, payload: { type: 'ranking' } },
];
const transaction: AIParsedTransaction = {
  amount: 42.8,
  type: 'expense',
  currency: 'USD',
  category: 'Food & Drink',
  sub_category: 'Grocery',
  merchant: 'Whole Foods',
  title: 'Groceries',
  date: '2026-06-08',
  location: { country: 'United States', city: 'New York', district: 'NY', address: null, coordinates: null },
};

function Label({ name }: { name: string }) {
  return (
    <p style={{ color: '#10a37f', fontFamily: 'var(--font-geist-mono), monospace', fontSize: 11, letterSpacing: '0.08em', margin: '0 0 10px' }}>{name}</p>
  );
}

export default function MonoComponentShowcase() {
  const [saved, setSaved] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [recordAction, setRecordAction] = useState('');

  return (
    <div className="mono-showcase grid w-full min-w-0 max-w-full grid-cols-1 items-start gap-4 p-4 sm:p-5 lg:grid-cols-2 xl:grid-cols-12" style={{ background: '#1A1A1A', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
      <ComponentPrimitives />

      <div className="flex min-w-0 flex-col gap-7 xl:col-span-4">
        <div>
          <Label name="ConfirmTransactionCard" />
          {confirmOpen ? (
            <ConfirmTransactionCard data={transaction} inline isSavedSuccess={saved} onConfirm={() => setSaved(true)} onClose={() => { setConfirmOpen(false); setSaved(false); }} />
          ) : (
            <button type="button" onClick={() => setConfirmOpen(true)} className="rounded-lg border border-border-default px-3 py-2 text-sm text-text-primary transition-colors hover:bg-surface-hover">Reopen transaction</button>
          )}
          {saved && <p aria-live="polite" className="mt-2 text-xs text-text-secondary">Saved in this preview.</p>}
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-7 xl:col-span-4">
        <div>
          <Label name="BudgetStatusCard · normal" />
          <BudgetStatusCard props={{ category: 'Food', limit: 500, spent: 320, remaining: 180, period: 'This month', progress_percentage: 64, status: 'normal' }} />
        </div>
        <div>
          <Label name="BudgetStatusCard · afford preview" />
          <BudgetStatusCard props={{ category: 'Dining', limit: 200, spent: 165, remaining: 35, period: 'This month', progress_percentage: 82.5, status: 'warning', purchase_amount: 45, before_spent: 120, before_progress: 60 }} />
        </div>
        {insights[1] && (
          <div>
            <Label name="InsightCardComponent · ranking" />
            <InsightCardComponent insight={insights[1]} index={1} compactChart onCategoryClick={setSelectedCategory} currency="USD" />
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-7 xl:col-span-4">
        <div>
          <Label name="SpendingRecordsCard" />
          <SpendingRecordsCard
            title="Spending Records"
            subtitle="This month"
            transactionItems={records}
            chartData={categories}
            incomeItems={records.filter(item => item.type === 'income')}
            expenseItems={records.filter(item => item.type === 'expense')}
            incomeChartData={[{ label: 'Salary', value: 4200 }]}
            expenseChartData={categories}
            incomeTotalStr="+$4,200.00"
            expenseTotalStr="-$61.30"
            recordType="all"
            summaryTodayTotal={42.8}
            summaryTodayTrendAbs={-12.5}
            summaryWeekTotal={312}
            summaryWeekTrendPct={8.2}
            summaryCurrency="USD"
            incomeTotalNum={4200}
            expenseTotalNum={61.3}
            onEditRecord={(id) => setRecordAction(`Edit preview · ${records.find(record => record.id === id)?.description ?? 'transaction'}`)}
            onDeleteRecord={(id) => setRecordAction(`Delete preview · ${records.find(record => record.id === id)?.description ?? 'transaction'}`)}
          />
          {recordAction && <p className="mt-2 text-xs text-text-secondary" aria-live="polite">{recordAction}</p>}
        </div>
        {insights.slice(0, 1).map((insight, index) => (
          <div key={insight.id}>
            <Label name={'InsightCardComponent · ' + (insight.payload?.type ?? insight.chartType)} />
            <InsightCardComponent insight={insight} index={index} compactChart onCategoryClick={setSelectedCategory} currency="USD" />
          </div>
        ))}
      </div>
      {selectedCategory && <p className="xl:col-span-12 text-xs text-text-secondary" aria-live="polite">Selected category: {selectedCategory}</p>}
    </div>
  );
}
