'use client';

import Image from 'next/image';
import { useState, type LucideIcon } from 'react';
import {
  AlarmClock,
  CalendarDays,
  Check,
  ChessQueen,
  CircleCheck,
  CircleDollarSign,
  CircleX,
  Heart,
  HouseWifi,
  LoaderCircle,
  MapPin,
  MousePointer2,
  ShieldCheck,
  TimerReset,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { fontFamily } from '@/lib/design-tokens';

type StateId =
  | 'submitted'
  | 'queued'
  | 'progress'
  | 'failed'
  | 'manual'
  | 'pending-auto'
  | 'pending-approval';

type StateConfig = {
  id: StateId;
  tabLabel: string;
  tabIcon: LucideIcon;
  tag: string;
  tagColor: string;
  tagBackground: string;
  time: string;
  applicants: string;
  score: 84 | 93;
  scoreLabel: 'Good Match' | 'Strong Match';
  scoreAsset: string;
  criteria: string[];
  title: string;
  company: string;
  companyAsset: string;
  industries: string;
  metadata: string[];
  banner?: {
    icon: 'timer' | 'shield' | 'alert';
    text: string;
    action: string;
    color: string;
    background: string;
  };
  footer: string;
  action?: string;
  utilityActions?: boolean;
  favorite?: boolean;
  descriptionTitle: string;
  description: string;
};

const assetRoot = '/img/jobnova/auto-apply-state-assets';

const sharedJob = {
  time: '4 hours ago',
  applicants: '112 applicants',
  score: 84 as const,
  scoreLabel: 'Good Match' as const,
  criteria: ['H1B Sponsor Likely'],
  title: 'User Experience Designer',
  company: 'Cursor AI',
  companyAsset: `${assetRoot}/company-cursor.png`,
  industries: 'Automotive • Big Data • Growth Stage',
  metadata: ['Nashville, TN', 'Full time', 'Remote', 'Mid Level', '$112K/yr - $152K/yr'],
  favorite: true,
};

const states: StateConfig[] = [
  {
    ...sharedJob,
    id: 'submitted',
    tabLabel: 'State 1: Auto-Submitted',
    tabIcon: CircleCheck,
    tag: 'Applied',
    tagColor: '#4caf50',
    tagBackground: 'rgba(76,175,80,0.12)',
    scoreAsset: `${assetRoot}/score-submitted.svg`,
    footer: 'Your application was automatically submitted.',
    action: 'View Application',
    utilityActions: true,
    descriptionTitle: 'Submitted automatically',
    description:
      'The application met every Auto Apply rule and was submitted without requiring another action. Users can open the completed application and review exactly what was sent.',
  },
  {
    ...sharedJob,
    id: 'queued',
    tabLabel: 'State 2: Queued',
    tabIcon: AlarmClock,
    tag: 'Queued',
    tagColor: '#7c5cff',
    tagBackground: 'rgba(124,92,255,0.12)',
    scoreAsset: `${assetRoot}/score-queued.svg`,
    footer: 'Your application is in line and will be submitted automatically. #3 in queue',
    action: 'Move to Front',
    utilityActions: true,
    descriptionTitle: 'Waiting in the submission queue',
    description:
      'The application is ready, but another submission is being processed first. Its queue position stays visible, and users can move it forward or remove it before submission begins.',
  },
  {
    ...sharedJob,
    id: 'progress',
    tabLabel: 'State 3: In Progress',
    tabIcon: LoaderCircle,
    tag: 'Applying…',
    tagColor: '#68910d',
    tagBackground: 'rgba(173,245,0,0.12)',
    scoreAsset: `${assetRoot}/score-progress.svg`,
    footer: "We're filling out and submitting your application right now.",
    utilityActions: true,
    descriptionTitle: 'Submission in progress',
    description:
      'JobNova is actively completing and submitting the application. The state makes the background activity visible so users know the application is being handled, not stalled.',
  },
  {
    ...sharedJob,
    id: 'failed',
    tabLabel: 'State 4: Failed',
    tabIcon: CircleX,
    tag: 'Failed',
    tagColor: '#f44336',
    tagBackground: 'rgba(244,67,54,0.12)',
    scoreAsset: `${assetRoot}/score-failed.svg`,
    banner: {
      icon: 'alert',
      text: 'Something went wrong while submitting.',
      action: 'Click to see error details',
      color: '#f44336',
      background: 'rgba(244,67,54,0.12)',
    },
    footer: 'Something went wrong while submitting. Please apply manually on the company site.',
    action: 'Apply Now',
    utilityActions: true,
    descriptionTitle: 'Automation could not complete',
    description:
      'A submission error interrupted the automated flow. The failure is surfaced clearly, with access to error details and a manual application path so the opportunity is not lost.',
  },
  {
    id: 'manual',
    tabLabel: 'State 5: Manual Apply',
    tabIcon: MousePointer2,
    tag: 'Manual',
    tagColor: '#0e0e0e',
    tagBackground: 'rgba(1,2,20,0.12)',
    time: '1 hours ago',
    applicants: '25 applicants',
    score: 93,
    scoreLabel: 'Strong Match',
    scoreAsset: `${assetRoot}/score-manual.svg`,
    criteria: ['No H1B', 'Work & Life Balance'],
    title: 'Founding Product Designer',
    company: 'Accenture',
    companyAsset: `${assetRoot}/company-accenture.png`,
    industries: 'Artificial Intelligence (AI) • Enterprise Software • Public Company',
    metadata: ['Farmington Hills, MI', 'Full time', 'Hybrid', 'Mid, Senior Level', '5+ years exp', '$65/yr - $70/yr'],
    footer: "Auto-apply isn't supported for this job.",
    action: 'Apply Now',
    descriptionTitle: 'Manual application required',
    description:
      'The employer or application platform does not support Auto Apply. JobNova preserves the match information and sends the user directly to the manual application flow.',
  },
  {
    ...sharedJob,
    id: 'pending-auto',
    tabLabel: 'State 6: Pending (Auto 24h)',
    tabIcon: TimerReset,
    tag: 'Waiting for approval',
    tagColor: '#d99400',
    tagBackground: 'rgba(255,183,0,0.12)',
    scoreAsset: `${assetRoot}/score-pending-auto.svg`,
    banner: {
      icon: 'timer',
      text: 'Auto-submits in: 23:47:12',
      action: 'Approve now to skip wait',
      color: '#d99400',
      background: 'rgba(255,183,0,0.12)',
    },
    footer: 'Your application was automatically submitted.',
    action: 'Approve Now',
    utilityActions: true,
    descriptionTitle: 'Review window before auto-submit',
    description:
      'The application is complete and enters a 24-hour review window. Users may approve it immediately, edit their decision, or let JobNova submit automatically when the timer ends.',
  },
  {
    ...sharedJob,
    id: 'pending-approval',
    tabLabel: 'State 7: Pending (Must Approve)',
    tabIcon: ShieldCheck,
    tag: 'Approval Required',
    tagColor: '#2196f3',
    tagBackground: 'rgba(33,150,243,0.12)',
    scoreAsset: `${assetRoot}/score-pending-approval.svg`,
    banner: {
      icon: 'shield',
      text: 'Your explicit approval is required — will not auto-submit',
      action: 'Approve now to apply',
      color: '#2196f3',
      background: 'rgba(33,150,243,0.12)',
    },
    footer: "This application won't be submitted until you explicitly approve it.",
    action: 'Approve Now',
    utilityActions: true,
    descriptionTitle: 'Explicit approval is required',
    description:
      'This application will never be submitted automatically. JobNova waits for a deliberate approval, keeping the user in control when the role or application rules require confirmation.',
  },
];

const metadataIcons = [MapPin, AlarmClock, HouseWifi, ChessQueen, CalendarDays, CircleDollarSign];

function MatchScore({ state }: { state: StateConfig }) {
  return (
    <div className="flex w-[114px] shrink-0 flex-col items-center gap-[18px] rounded-[12px]">
      <div className="flex flex-col items-center gap-[6px]">
        <div className="relative size-[92px] shrink-0">
          <Image
            src={`${assetRoot}/score-base.svg`}
            alt=""
            aria-hidden
            fill
            sizes="92px"
            className="object-contain"
          />
          <Image
            src={state.scoreAsset}
            alt=""
            aria-hidden
            fill
            sizes="92px"
            className="object-contain"
          />
          <p className="absolute inset-0 m-0 flex items-center justify-center pt-[1px] font-semibold tracking-[-0.48px] text-[#0e1401]">
            <span className="text-[32px] leading-none">{state.score}</span>
            <span className="mt-[8px] text-[16px] leading-none">%</span>
          </p>
        </div>
        <p className="m-0 text-center text-[14px] font-medium leading-normal tracking-[-0.28px] text-[#0e1401]">
          {state.scoreLabel}
        </p>
      </div>

      <div className="flex flex-col items-start gap-[6px] px-1">
        {state.criteria.map((criterion) => (
          <div key={criterion} className="flex items-center gap-0.5">
            <Check className="size-[10px] shrink-0" strokeWidth={1.8} aria-hidden />
            <span className="whitespace-nowrap text-[10px] font-normal leading-none text-black">{criterion}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function JobMetadata({ values }: { values: string[] }) {
  return (
    <div className="grid w-full grid-cols-3 gap-x-[6px] gap-y-1">
      {values.map((value, index) => {
        const Icon = metadataIcons[index] ?? CircleDollarSign;
        return (
          <div key={value} className="flex min-h-[22px] items-center gap-[6px]">
            <Icon className="size-4 shrink-0 text-[#0e1401]" strokeWidth={1.45} aria-hidden />
            <span className="whitespace-nowrap text-[12px] font-normal leading-[1.3] tracking-[-0.24px] text-[#0e1401]">
              {value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function StatusBanner({ banner }: { banner: NonNullable<StateConfig['banner']> }) {
  const BannerIcon = banner.icon === 'timer' ? TimerReset : banner.icon === 'shield' ? ShieldCheck : CircleX;
  return (
    <div
      className="flex min-h-[26px] w-full items-center justify-between rounded-[2px] px-2 text-[10px] font-normal"
      style={{ color: banner.color, background: banner.background }}
    >
      <span className="flex items-center gap-1">
        <BannerIcon className="size-3" strokeWidth={1.6} aria-hidden />
        {banner.text}
      </span>
      <span>{banner.action}</span>
    </div>
  );
}

function JobCard({ state }: { state: StateConfig }) {
  return (
    <article className="flex w-[826px] flex-col gap-3 overflow-hidden rounded-[12px] border border-[#f2f2f3] bg-white px-5 pb-3 pt-4 text-[#0e1401] shadow-[0_8px_18px_rgba(14,20,1,0.06)]">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="flex h-[22px] items-center rounded-full px-2 text-[10px] font-medium tracking-[0.2px]"
            style={{ color: state.tagColor, background: state.tagBackground }}
          >
            {state.tag}
          </span>
          <span className="flex h-[22px] items-center rounded-full bg-[#edf2ff] px-2 text-[12px] font-normal tracking-[0.2px]">
            {state.time}
          </span>
          <span className="text-[12px] font-normal leading-[1.3]">{state.applicants}</span>
        </div>

        <div className="flex items-center gap-[15px]">
          <Image src={`${assetRoot}/link.svg`} alt="Copy job link" width={20} height={20} className="size-[19.4px]" />
          {state.favorite ? (
            <Heart className="size-[19.4px] fill-[#adf500] text-[#adf500]" strokeWidth={1.1} aria-label="Saved job" />
          ) : (
            <Image src={`${assetRoot}/heart.svg`} alt="Save job" width={20} height={20} className="h-[16px] w-[19.4px]" />
          )}
        </div>
      </div>

      <div className="flex w-full items-start gap-6">
        <MatchScore state={state} />

        <div className="w-px self-stretch bg-[#f2f2f3]" aria-hidden />

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <div className="flex w-full flex-col gap-[6px]">
            <h5 className="m-0 whitespace-nowrap text-[24px] font-semibold leading-normal tracking-[-0.48px] text-[#0e1401]">
              {state.title}
            </h5>
            <div className="flex items-center gap-1">
              <div className="relative size-[21.5px] shrink-0 overflow-hidden">
                <Image
                  src={state.companyAsset}
                  alt=""
                  fill
                  sizes="22px"
                  className={state.id === 'manual' ? 'object-cover' : 'object-cover'}
                />
              </div>
              <span className="whitespace-nowrap text-[14px] font-normal leading-[1.5] text-[#696b6e]">{state.company}</span>
              <span className="mx-0.5 h-3 w-px bg-[#010214]" aria-hidden />
              <span className="whitespace-nowrap text-[14px] font-normal leading-[1.5] text-[#787675]">
                {state.industries}
              </span>
            </div>
          </div>

          <JobMetadata values={state.metadata} />
        </div>
      </div>

      {state.banner ? <StatusBanner banner={state.banner} /> : null}

      <div className="flex min-h-[39px] w-full items-center justify-between border-t-[1.078px] border-[#f2f2f3] pt-3">
        <p className="m-0 w-[482px] text-[12px] font-normal leading-[1.3] text-[rgba(102,102,102,0.72)]">
          {state.id === 'queued' ? (
            <>
              Your application is in line and will be submitted automatically.{' '}
              <span className="text-[#0e0e0e]">#3 in queue</span>
            </>
          ) : (
            state.footer
          )}
        </p>

        <div className="flex shrink-0 items-center gap-1">
          {state.utilityActions ? (
            <>
              <button type="button" className="flex size-[34px] items-center justify-center rounded-full" aria-label="Assign application">
                <UserCheck className="size-[18px]" strokeWidth={1.45} aria-hidden />
              </button>
              {state.id !== 'submitted' ? (
                <button type="button" className="flex size-[34px] items-center justify-center rounded-full" aria-label="Remove application">
                  <Trash2 className="size-[18px]" strokeWidth={1.45} aria-hidden />
                </button>
              ) : null}
            </>
          ) : null}
          {state.action ? (
            <button
              type="button"
              className="flex h-9 items-center justify-center rounded-full bg-[#010214] px-4 text-[14px] font-semibold leading-4 text-white"
            >
              {state.action}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function AutoApplyStateSwitcher() {
  const [activeId, setActiveId] = useState<StateId>('submitted');
  const activeState = states.find((state) => state.id === activeId) ?? states[0];

  return (
    <div className="mt-8 flex w-full flex-col gap-3" style={{ fontFamily: fontFamily.sans }}>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Auto Apply application states">
        {states.map((state) => {
          const Icon = state.tabIcon;
          const selected = state.id === activeId;
          return (
            <button
              key={state.id}
              type="button"
              id={`auto-apply-tab-${state.id}`}
              role="tab"
              aria-selected={selected}
              aria-controls="auto-apply-state-panel"
              onClick={() => setActiveId(state.id)}
              className={`flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[12px] font-semibold leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0e1401] ${
                selected
                  ? 'border-[#0e1401] bg-[#0e1401] text-white'
                  : 'border-[#d5d6d5] bg-white text-[#13180a] hover:border-[#999c98]'
              }`}
            >
              <Icon
                className={`size-4 shrink-0 ${state.id === 'progress' && selected ? 'animate-spin' : ''}`}
                strokeWidth={2}
                style={{ color: selected ? '#adf500' : '#7d807b' }}
                aria-hidden
              />
              <span className="whitespace-nowrap">{state.tabLabel}</span>
            </button>
          );
        })}
      </div>

      <div
        id="auto-apply-state-panel"
        role="tabpanel"
        aria-labelledby={`auto-apply-tab-${activeState.id}`}
        className="grid h-[576px] min-w-0 grid-cols-[minmax(0,1fr)] items-start gap-6 lg:h-[246px] lg:grid-cols-[595px_1fr] lg:gap-8"
      >
        <div className="relative left-1/2 min-w-0 w-screen -translate-x-1/2 overflow-x-auto lg:static lg:w-[595px] lg:translate-x-0 lg:overflow-visible">
          <div className="h-[340px] w-[826px] pb-8 lg:hidden">
            <JobCard state={activeState} />
          </div>
          <div className="hidden h-[246px] w-[595px] lg:block">
            <div className="origin-top-left scale-[0.72]">
              <JobCard state={activeState} />
            </div>
          </div>
        </div>

        <aside className="flex h-[212px] min-w-0 flex-col border-t border-[#e9e9e9] pt-4 lg:h-[246px] lg:border-l lg:border-t-0 lg:pl-6 lg:pt-1">
          <p className="m-0 text-[11px] font-normal uppercase tracking-[0.08em]" style={{ color: activeState.tagColor }}>
            {activeState.tag}
          </p>
          <h5 className="m-0 mt-3 text-[18px] font-medium leading-[1.35] text-[#0e1401]">
            {activeState.descriptionTitle}
          </h5>
          <p className="m-0 mt-3 text-[13px] font-light leading-[1.65] text-[#0e1401]/68">
            {activeState.description}
          </p>
        </aside>
      </div>
    </div>
  );
}
