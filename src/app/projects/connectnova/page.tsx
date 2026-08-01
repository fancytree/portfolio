'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import CaseStudyControls from '../../components/CaseStudyControls';
import CaseStudyBackButton from '../../components/CaseStudyBackButton';
import CaseStudyHero from '../../components/CaseStudyHero';
import ConnectnovaNarrative from './ConnectnovaNarrative';
// 统一从 design-tokens 引用字体与文字样式预设，避免每页重复声明 Manrope 实例
import { fontFamily, textStyle, textColor } from '@/lib/design-tokens';

/** Fig 7：Solution 卡片内嵌 mock 外框高度 */
const connectNovaSolutionMockFrameClassName =
  'h-[min(380px,45svh)] w-full min-h-0 overflow-hidden rounded-[10px] border border-dashed border-black/15 sm:h-[min(400px,48svh)]';

/** Fig 9：Profile Panel mock 专用外框（比 Fig 7 更高，便于侧栏内滚动与内容展开） */
const connectNovaProfilePanelMockFrameClassName =
  'h-[min(500px,58svh)] w-full min-h-0 overflow-hidden rounded-[10px] border border-dashed border-black/15 sm:h-[min(540px,62svh)]';

const CASE_STUDY_CONTENT_WIDTH = '980px';

// 自定义 hook：检测元素是否进入视口并触发动画
function useScrollAnimation(initialDelay: number = 0) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const timer = window.setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer?.unobserve(entry.target);
            }
          });
        },
        {
          // 大块章节（如整段 Solution）高度极大；threshold 0.1 要求「可见面积 / 元素总面积 ≥ 10%」，
          // 用户刚滚到标题时往往达不到，导致整段一直 opacity:0。0 表示任意像素进入视口即触发。
          threshold: 0,
          rootMargin: '0px 0px -80px 0px',
        }
      );

      const el = ref.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

        if (isInViewport) {
          setIsVisible(true);
        } else {
          observer.observe(el);
        }
      }
    }, initialDelay);

    return () => {
      window.clearTimeout(timer);
      if (observer && ref.current) {
        observer.unobserve(ref.current);
      }
      observer?.disconnect();
    };
  }, [initialDelay]);

  return { ref, isVisible };
}

// ScrollAnimatedSection 组件：包装内容并应用滚动动画
function ScrollAnimatedSection({ children, initialDelay = 0 }: { children: React.ReactNode; initialDelay?: number }) {
  const { ref, isVisible } = useScrollAnimation(initialDelay);

  return (
    <div
      ref={ref}
      className="w-full"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(48px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
      }}
    >
      {children}
    </div>
  );
}

function ProjectListViewMock({ fontStyle }: { fontStyle: { fontFamily: string } }) {
  const [activeTab, setActiveTab] = useState<'all' | 'unranked' | 'ranked'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>('task-1');
  const [selectedVersionByProject, setSelectedVersionByProject] = useState<Record<string, number>>({
    'task-1': 2,
    'task-2': 1,
    'task-4': 1,
  });

  const projectRows = [
    {
      id: 'task-1',
      name: 'Game Developer - US female profile',
      candidateCount: 31,
      rankingCount: 2,
      updatedAt: '20/04/2026',
      unrankedCount: 7,
      isRanking: false,
      hiringNeed: 'Looking for gameplay engineers with production experience in US-based studios.',
      versions: [
        {
          version: 2,
          label: 'Ranking #2',
          date: '20/04/2026',
          rankingSummary: 'USA, female and include CEO · 24 cand...',
          requirements: 'Live in USA, female',
          visibleRange: '1-10 of 24',
          pageIndicator: '1/3',
          preview: [
            { rank: 1, name: 'Samik Mathur', location: 'Pittsburgh, Pennsylvania', role: 'Game Engineer', company: 'Schell Games', score: 55 },
            { rank: 2, name: 'Joe Tung', location: 'Los Angeles, California', role: 'Co-founder and CEO', company: 'Theorycraft Games', score: 55 },
            { rank: 3, name: 'Michael Zhang', location: 'Los Angeles, California', role: 'Founder and CEO', company: 'MetaWorld Entertainment Inc.', score: 52 },
            { rank: 4, name: 'John Linden', location: 'Miami, Florida', role: 'CEO', company: 'Mythical Games', score: 52 },
          ],
        },
        {
          version: 1,
          label: 'Ranking #1',
          date: '17/04/2026',
          rankingSummary: 'USA, female and include CEO · 24 cand...',
          requirements: 'Live in USA, female',
          visibleRange: '1-10 of 24',
          pageIndicator: '1/3',
          preview: [
            { rank: 1, name: 'Priya Shah', location: 'Cary, North Carolina', role: 'Graphics Engineer', company: 'Epic Games', score: 58 },
            { rank: 2, name: 'Samik Mathur', location: 'Pittsburgh, Pennsylvania', role: 'Game Engineer', company: 'Schell Games', score: 53 },
            { rank: 3, name: 'Jordan Lee', location: 'Los Angeles, California', role: 'Gameplay Programmer', company: 'Riot Games', score: 46 },
          ],
        },
      ],
    },
    {
      id: 'task-2',
      name: 'Senior Data Analyst - APAC',
      candidateCount: 24,
      rankingCount: 1,
      updatedAt: '17/04/2026',
      unrankedCount: 0,
      isRanking: false,
      hiringNeed: 'Strong SQL + experimentation background, stakeholder-facing communication.',
      versions: [
        {
          version: 1,
          label: 'Ranking #1',
          date: '17/04/2026',
          rankingSummary: 'Senior data analyst + SQL + exp · 24 cand...',
          requirements: 'SQL, A/B testing, and stakeholder communication',
          visibleRange: '1-10 of 24',
          pageIndicator: '1/3',
          preview: [
            { rank: 1, name: 'Anand Tiwari', location: 'Gurugram, Haryana', role: 'Senior Data Analyst', company: 'airtel', score: 73 },
            { rank: 2, name: 'Ashwani Yadav', location: 'Noida, Uttar Pradesh', role: 'Data Analyst', company: 'Paytm', score: 68 },
          ],
        },
      ],
    },
    {
      id: 'task-3',
      name: 'Product Designer - Consumer SaaS',
      candidateCount: 19,
      rankingCount: 0,
      updatedAt: '23/04/2026',
      unrankedCount: 19,
      isRanking: true,
      hiringNeed: 'Own end-to-end product design from discovery to shipped UX.',
      versions: [],
    },
    {
      id: 'task-4',
      name: 'Frontend Engineer - Growth',
      candidateCount: 14,
      rankingCount: 1,
      updatedAt: '14/04/2026',
      unrankedCount: 2,
      isRanking: false,
      hiringNeed: 'React + experimentation platform experience preferred.',
      versions: [
        {
          version: 1,
          label: 'Ranking #1',
          date: '14/04/2026',
          rankingSummary: 'Frontend + growth experimentation · 14 cand...',
          requirements: 'React + growth experiment ownership',
          visibleRange: '1-10 of 14',
          pageIndicator: '1/2',
          preview: [
            { rank: 1, name: 'Mila Ford', location: 'Austin, Texas', role: 'Senior Frontend Engineer', company: 'Shopify', score: 71 },
            { rank: 2, name: 'Nora Zhang', location: 'San Jose, California', role: 'Frontend Engineer', company: 'Notion', score: 66 },
          ],
        },
      ],
    },
  ];

  const unrankedCount = projectRows.filter((item) => item.unrankedCount > 0).length;
  const rankedCount = projectRows.filter((item) => item.unrankedCount === 0 && !item.isRanking).length;

  const filteredRows = projectRows.filter((item) => {
    const matchesTab =
      activeTab === 'all' ? true : activeTab === 'unranked' ? item.unrankedCount > 0 : item.unrankedCount === 0 && !item.isRanking;
    const keyword = searchQuery.trim().toLowerCase();
    const matchesSearch = keyword
      ? item.name.toLowerCase().includes(keyword) || item.hiringNeed.toLowerCase().includes(keyword)
      : true;
    return matchesTab && matchesSearch;
  });

  return (
    <div className={`flex flex-col bg-slate-50 ${connectNovaSolutionMockFrameClassName}`} style={fontStyle} aria-label="Project list mock view">
      <div className="shrink-0 border-b border-slate-200/90 bg-white px-2.5 pb-2 pt-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { key: 'all' as const, label: 'All', count: projectRows.length },
            { key: 'unranked' as const, label: 'Unranked', count: unrankedCount },
            { key: 'ranked' as const, label: 'Ranked', count: rankedCount },
          ].map((tabItem) => (
            <button
              key={tabItem.key}
              type="button"
              onClick={() => setActiveTab(tabItem.key)}
              className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[9px] font-semibold transition-colors ${
                activeTab === tabItem.key
                  ? tabItem.key === 'unranked'
                    ? 'border-amber-200/80 bg-amber-50 text-amber-950 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-900 shadow-sm'
                  : 'border-transparent bg-slate-100/80 text-slate-500 hover:text-slate-700'
              }`}
            >
              {tabItem.label}
              <span className="rounded-full bg-slate-200/80 px-1.5 py-0.5 text-[8px] font-bold text-slate-700">{tabItem.count}</span>
            </button>
          ))}
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="ml-auto h-7 w-[170px] rounded-lg border border-slate-200 bg-white px-2 text-[8px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#2563eb]"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-1.5">
        {filteredRows.length === 0 ? (
          <div className="flex h-full min-h-[120px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-[9px] text-slate-500">
            No projects found
          </div>
        ) : (
          <div className="space-y-1.5">
            {filteredRows.map((row) => {
              const isExpanded = expandedProjectId === row.id;
              const activeVersion =
                row.versions.find((item) => item.version === selectedVersionByProject[row.id]) ?? row.versions[0];
              return (
                <section key={row.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => setExpandedProjectId((prev) => (prev === row.id ? null : row.id))}
                    className="flex w-full items-start gap-2 px-2.5 py-2 text-left hover:bg-slate-50/80"
                  >
                    <span
                      className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                        isExpanded ? 'border-transparent bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-500'
                      }`}
                    >
                      {isExpanded ? (
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[10px] font-semibold text-slate-900">{row.name}</span>
                      <span className="mt-0.5 flex flex-wrap items-center gap-1 text-[8px] text-slate-500">
                        <span>{row.candidateCount} candidates</span>
                        <span>·</span>
                        <span>{row.rankingCount} rankings</span>
                        <span>·</span>
                        <span>{row.updatedAt}</span>
                        {row.unrankedCount > 0 && !row.isRanking && (
                          <span className="ml-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-wide text-amber-900">
                            {row.unrankedCount} Unranked
                          </span>
                        )}
                        {row.isRanking && (
                          <span className="ml-1 rounded-full bg-blue-100 px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-wide text-blue-800">
                            Ranking
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block truncate text-[8px] italic text-slate-500">{row.hiringNeed}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1 self-end">
                      {row.unrankedCount > 0 ? (
                        <span className="inline-flex h-6 items-center rounded-md bg-[#0052CC] px-2 text-[8px] font-semibold text-white">Rank</span>
                      ) : (
                        <span className="inline-flex h-6 items-center rounded-md border border-slate-200 bg-white px-2 text-[8px] font-semibold text-slate-600">
                          Details
                        </span>
                      )}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-slate-200 bg-slate-100/70 px-2.5 py-2">
                      <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex min-w-0 items-center gap-1">
                            <span className="text-[8px] font-medium text-slate-500">Ranking:</span>
                            {row.versions.length > 0 ? (
                              <select
                                value={activeVersion?.version ?? ''}
                                onChange={(e) =>
                                  setSelectedVersionByProject((prev) => ({
                                    ...prev,
                                    [row.id]: Number(e.target.value),
                                  }))
                                }
                                className="h-7 min-w-[170px] max-w-[220px] rounded-md border border-slate-200 bg-white px-2 text-[8px] font-semibold text-slate-700 outline-none"
                              >
                                {row.versions.map((versionItem) => (
                                  <option key={`${row.id}-${versionItem.version}`} value={versionItem.version}>
                                    {versionItem.rankingSummary ?? `${versionItem.label} · ${versionItem.date}`}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-[8px] text-slate-500">No ranking version</span>
                            )}
                          </div>
                          <button
                            type="button"
                            className="inline-flex h-7 items-center gap-1 rounded-md border border-slate-200 bg-white px-2 text-[8px] font-semibold text-slate-600"
                          >
                            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" aria-hidden>
                              <path d="M12 3v12M8 11l4 4 4-4M5 21h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Export CSV
                          </button>
                        </div>

                        <div className="rounded-md bg-white px-2 py-1.5 text-[8px] text-slate-700">
                          <span className="mr-1 font-semibold uppercase tracking-[0.1em] text-slate-500">Requirements</span>
                          {activeVersion?.requirements ?? row.hiringNeed}
                        </div>

                        {activeVersion && activeVersion.preview.length > 0 ? (
                          <>
                            <div className="flex items-center justify-between text-[8px] text-slate-500">
                              <span>{activeVersion.visibleRange ?? `1-${activeVersion.preview.length} of ${activeVersion.preview.length}`}</span>
                              <span className="inline-flex items-center gap-2">
                                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" aria-hidden>
                                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span>{activeVersion.pageIndicator ?? '1/1'}</span>
                                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" aria-hidden>
                                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </span>
                            </div>
                            <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
                              <div className="grid grid-cols-[34px_1.45fr_1.55fr_46px_26px] items-center border-b border-slate-200 bg-slate-50 px-2 py-1 text-[7px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                                <span>#</span>
                                <span>Candidate</span>
                                <span>Current Role</span>
                                <span className="text-right">Score</span>
                                <span />
                              </div>
                              {activeVersion.preview.map((item) => (
                                <div
                                  key={`${row.id}-${activeVersion.version}-${item.rank}`}
                                  className="grid grid-cols-[34px_1.45fr_1.55fr_46px_26px] items-center gap-2 border-b border-slate-100 px-2 py-1.5 text-[8px] last:border-b-0"
                                >
                                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-white font-semibold text-slate-700">
                                    {item.rank}
                                  </span>
                                  <span className="min-w-0">
                                    <span className="block truncate font-semibold text-slate-800">{item.name}</span>
                                    <span className="block truncate text-[7px] text-slate-500">{item.location}</span>
                                  </span>
                                  <span className="min-w-0">
                                    <span className="block truncate text-slate-700">{item.role}</span>
                                    <span className="block truncate text-[7px] text-slate-500">{item.company}</span>
                                  </span>
                                  <span className="text-right text-[11px] font-semibold tabular-nums text-[#0052CC]">{item.score}</span>
                                  <span className="inline-flex justify-end text-slate-400">
                                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
                                      <path d="M14 4h6v6M10 14L20 4M20 14v6H4V4h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </span>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="rounded-lg border border-dashed border-slate-300 bg-white px-3 py-4 text-center text-[8px] text-slate-500">
                            Ranking in progress...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function AIRankingViewMock({
  fontStyle,
  defaultTab = 'rankings',
  enableProfilePanel = false,
}: {
  fontStyle: { fontFamily: string };
  defaultTab?: 'rankings' | 'pool';
  enableProfilePanel?: boolean;
}) {
  // 对齐截图主色（ConnectNova 系蓝）
  const primary = '#0052CC';

  const [hasEntered, setHasEntered] = useState(false);
  const [activeTab, setActiveTab] = useState<'rankings' | 'pool'>(defaultTab);
  const [expandedCandidateName, setExpandedCandidateName] = useState<string | null>(null);
  const [profileCandidateName, setProfileCandidateName] = useState<string | null>(null);
  const [profilePanelVisible, setProfilePanelVisible] = useState(false);
  const profilePanelTimerRef = useRef<number | null>(null);

  type RationaleSegment = { text: string; bold?: boolean };

  const rankingRows = [
    {
      rank: 1,
      name: 'Samik Mathur',
      headline: 'Programmer, Game Developer, & Engineer | Founder of Lyko Studio',
      title: 'Game Engineer',
      company: 'Schell Games',
      location: 'Pittsburgh, Pennsylvania',
      score: 55,
      scoreColor: primary,
      note: 'test note',
      avatarSrc: '/img/jobnova/persona-alex.jpg',
      analysis: [
        { text: 'Samik is a ', bold: false },
        { text: 'Game Engineer', bold: true },
        { text: ' currently based in ', bold: false },
        { text: 'Pittsburgh, Pennsylvania', bold: true },
        { text: ' at ', bold: false },
        { text: 'Schell Games', bold: true },
        {
          text: ', with portfolio signals aligned to hands-on game programming and studio leadership.',
          bold: false,
        },
      ] as RationaleSegment[],
      breakdown: [
        { label: 'United States residency', value: 72 },
        { label: 'Female profile indicators', value: 38 },
      ],
    },
    {
      rank: 2,
      name: 'Jordan Lee',
      headline: 'Senior Gameplay Programmer · Multiplayer systems & combat feel',
      title: 'Gameplay Programmer',
      company: 'Riot Games',
      location: 'Los Angeles, California',
      score: 48,
      scoreColor: primary,
      note: '—',
      avatarSrc: '/img/jobnova/persona-sarah.jpg',
      analysis: [
        { text: 'Jordan ships ', bold: false },
        { text: 'gameplay systems', bold: true },
        { text: ' at scale in ', bold: false },
        { text: 'Los Angeles, California', bold: true },
        { text: ' with ', bold: false },
        { text: 'Riot Games', bold: true },
        { text: '; residency signal is strong while role-title match is mixed for this ranking.', bold: false },
      ] as RationaleSegment[],
      breakdown: [
        { label: 'United States residency', value: 88 },
        { label: 'Female profile indicators', value: 22 },
      ],
    },
    {
      rank: 3,
      name: 'Priya Shah',
      headline: 'Graphics Engineer · Rendering optimizations for live titles',
      title: 'Graphics Engineer',
      company: 'Epic Games',
      location: 'Cary, North Carolina',
      score: 62,
      scoreColor: primary,
      note: 'shortlist',
      avatarSrc: '/img/jobnova/persona-alex.jpg',
      analysis: [
        { text: 'Priya is a ', bold: false },
        { text: 'Graphics Engineer', bold: true },
        { text: ' at ', bold: false },
        { text: 'Epic Games', bold: true },
        { text: ' in ', bold: false },
        { text: 'Cary, North Carolina', bold: true },
        { text: ', with strong engine-side signals and credible senior ownership patterns.', bold: false },
      ] as RationaleSegment[],
      breakdown: [
        { label: 'United States residency', value: 95 },
        { label: 'Female profile indicators', value: 41 },
      ],
    },
  ];

  const evaluationCriteria = [
    {
      dot: 'blue' as const,
      criterion: 'Currently resides in the United States',
      type: 'Required' as const,
      weight: 50,
    },
    {
      dot: 'purple' as const,
      criterion:
        'Identifies as female (based on profile indicators such as pronouns, name, or gender-specific organizations)',
      type: 'Required' as const,
      weight: 50,
    },
  ];

  const rankedListTotal = 24;

  useEffect(() => {
    const timer = window.setTimeout(() => setHasEntered(true), 40);
    return () => {
      window.clearTimeout(timer);
      if (profilePanelTimerRef.current != null) window.clearTimeout(profilePanelTimerRef.current);
    };
  }, []);

  const openProfilePanel = (candidateName: string) => {
    if (!enableProfilePanel) return;
    if (profilePanelTimerRef.current != null) {
      window.clearTimeout(profilePanelTimerRef.current);
      profilePanelTimerRef.current = null;
    }
    if (profileCandidateName) {
      setProfileCandidateName(candidateName);
      setProfilePanelVisible(true);
      return;
    }
    setProfileCandidateName(candidateName);
    setProfilePanelVisible(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setProfilePanelVisible(true)));
  };

  const closeProfilePanel = () => {
    setProfilePanelVisible(false);
    profilePanelTimerRef.current = window.setTimeout(() => {
      setProfileCandidateName(null);
      profilePanelTimerRef.current = null;
    }, 300);
  };

  const iconClass = 'h-3.5 w-3.5 shrink-0';
  const [allFilter, setAllFilter] = useState<'all' | 'unranked' | 'excluded'>('all');
  const [poolSearch, setPoolSearch] = useState('');

  // Candidate Pool：复制真实项目的「ranked + unranked 合并」展示语义
  const poolRows = [
    ...rankingRows.map((item) => ({
      id: item.name,
      isRanked: true as const,
      hasRanked: true,
      isExcluded: false,
      isViewed: item.rank === 1,
      rank: item.rank,
      score: item.score,
      name: item.name,
      title: item.title,
      company: item.company,
      location: item.location,
      note: item.note,
      avatarSrc: item.avatarSrc,
      linkedinUrl: '#',
    })),
    {
      id: 'mila-ford',
      isRanked: false as const,
      hasRanked: false,
      isExcluded: false,
      isViewed: false,
      name: 'Mila Ford',
      title: 'Tools Engineer',
      company: 'Ubisoft',
      location: 'Montreal, Canada',
      note: '',
      avatarSrc: '/img/jobnova/persona-sarah.jpg',
      linkedinUrl: '#',
    },
    {
      id: 'nora-zhang',
      isRanked: false as const,
      hasRanked: false,
      isExcluded: true,
      isViewed: true,
      name: 'Nora Zhang',
      title: 'Engine Programmer',
      company: '2K',
      location: 'Austin, Texas',
      note: 'pending relocation',
      avatarSrc: '/img/jobnova/persona-alex.jpg',
      linkedinUrl: '#',
    },
  ];

  const poolAllCount = poolRows.length;
  const poolUnrankedCount = poolRows.filter((item) => !item.hasRanked).length;
  const poolExcludedCount = poolRows.filter((item) => item.isExcluded).length;
  const profileCandidate =
    rankingRows.find((candidate) => candidate.name === profileCandidateName) ??
    poolRows.find((candidate) => candidate.name === profileCandidateName) ??
    null;
  const filteredPoolRows = poolRows.filter((item) => {
    if (allFilter === 'unranked') return !item.hasRanked;
    if (allFilter === 'excluded') return item.isExcluded;
    return true;
  });
  const searchKeyword = poolSearch.trim().toLowerCase();
  const searchedPoolRows = searchKeyword
    ? filteredPoolRows.filter((item) =>
        [item.name, item.title, item.company].some((value) => value.toLowerCase().includes(searchKeyword))
      )
    : filteredPoolRows;

  return (
    <div
      className={`relative flex flex-col overflow-hidden bg-slate-50 ${connectNovaSolutionMockFrameClassName}`}
      style={fontStyle}
      aria-label="AI Ranking mock view"
    >
      {/* 页头：与截图一致（返回、标题+编辑、统计、右上操作） */}
      <header className="shrink-0 border-b border-slate-200/90 bg-white px-2.5 py-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[8px] font-medium leading-3 text-slate-500">← Back to Project list</div>
            <div className="mt-0.5 flex items-center gap-1">
              <h2 className="truncate text-[11px] font-bold lowercase leading-4 tracking-tight text-slate-900">game developer</h2>
              <button
                type="button"
                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Edit project title"
              >
                <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M12 20h9M4 13l8-8a2 2 0 113 3l-8 8-4 1 1-4z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <p className="mt-0.5 text-[8px] leading-3 text-slate-500">31 candidates · 2 rankings · 20/04/2026</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[8px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              Collect More Candidates
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[8px] font-semibold text-white shadow-sm"
              style={{ backgroundColor: primary }}
            >
              <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M4 12a8 8 0 0113.657-5.657L19 6M20 12a8 8 0 01-13.657 5.657L5 18"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Re-rank
            </button>
          </div>
        </div>
      </header>

      {/* Tab：药丸样式（Rankings 白底阴影 / Pool 浅琥珀底） */}
      <div className="shrink-0 border-b border-slate-200/90 bg-white px-2.5 pb-2 pt-1">
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('rankings')}
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[9px] font-semibold transition-colors ${
              activeTab === 'rankings'
                ? 'border-slate-200 bg-white text-slate-900 shadow-sm'
                : 'border-transparent bg-slate-100/80 text-slate-500 hover:text-slate-700'
            }`}
          >
            Rankings
            <span
              className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold ${
                activeTab === 'rankings' ? 'bg-slate-100 text-slate-700' : 'bg-slate-200/70 text-slate-600'
              }`}
            >
              2
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pool')}
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[9px] font-semibold transition-colors ${
              activeTab === 'pool'
                ? 'border-amber-200/80 bg-amber-50 text-amber-950 shadow-sm'
                : 'border-transparent bg-amber-50/70 text-amber-900/80 hover:bg-amber-50'
            }`}
          >
            Candidate Pool
            <span className="rounded-full bg-amber-200/80 px-1.5 py-0.5 text-[8px] font-bold text-amber-950">31</span>
          </button>
        </div>
      </div>

      {/* 主内容：固定外框高度，本区纵向滚动（配置卡 + Ranked 列表一起滚） */}
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-1.5">
        {activeTab === 'pool' ? (
          <section className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
            <div className="space-y-1">
              <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-500">Candidate pool</p>
              <p className="text-[8px] leading-3 text-slate-500">
                All people collected for this project - ranked and not yet ranked.
              </p>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-1">
              {[
                { key: 'all' as const, label: 'All', count: poolAllCount },
                { key: 'unranked' as const, label: 'Unranked', count: poolUnrankedCount },
                { key: 'excluded' as const, label: 'Excluded', count: poolExcludedCount },
              ].map((tabItem) => (
                <button
                  key={tabItem.key}
                  type="button"
                  onClick={() => setAllFilter(tabItem.key)}
                  className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[8px] font-semibold transition-colors ${
                    allFilter === tabItem.key
                      ? tabItem.key === 'unranked'
                        ? 'border-amber-200/80 bg-amber-50 text-amber-950'
                        : 'border-slate-200 bg-white text-slate-900'
                      : 'border-transparent bg-slate-100/80 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tabItem.label}
                  <span className="rounded-full bg-slate-200/80 px-1.5 py-0.5 text-[7px] font-bold text-slate-700">{tabItem.count}</span>
                </button>
              ))}
              <input
                value={poolSearch}
                onChange={(e) => setPoolSearch(e.target.value)}
                placeholder="Search by name, title, company..."
                className="ml-auto h-7 w-[170px] rounded-lg border border-slate-200 bg-white px-2 text-[8px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#2563eb]"
              />
            </div>

            {searchedPoolRows.length === 0 ? (
              <div className="mt-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-6 text-center text-[8px] text-slate-500">
                No candidates match this view.
              </div>
            ) : (
              <div className="mt-2 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
                {searchedPoolRows.map((item) => (
                  <div key={item.id} className="flex items-center gap-2.5 px-2.5 py-2.5">
                    <button
                      type="button"
                      onClick={() => openProfilePanel(item.name)}
                      className={`shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#0052CC]/35 ${
                        enableProfilePanel ? 'transition-transform hover:scale-105' : 'cursor-default'
                      }`}
                      aria-label={enableProfilePanel ? `Open ${item.name} profile` : undefined}
                    >
                      <Image
                        src={item.avatarSrc}
                        alt=""
                        width={28}
                        height={28}
                        className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200"
                      />
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openProfilePanel(item.name)}
                          className={`truncate rounded-sm text-left text-[9px] font-semibold text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-[#0052CC]/25 ${enableProfilePanel ? 'hover:text-[#0052CC] hover:underline' : 'cursor-default'}`}
                        >
                          {item.name}
                        </button>
                        {!item.hasRanked && (
                          <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-wide text-amber-900">
                            Unranked
                          </span>
                        )}
                        {item.isExcluded && (
                          <span className="rounded-full border border-slate-300 bg-white px-1.5 py-0.5 text-[7px] font-medium text-slate-500">
                            Excluded
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 grid grid-cols-1 gap-0.5 text-[8px] text-slate-500 sm:grid-cols-3">
                        <span className="flex min-w-0 items-center gap-1 truncate">
                          <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path
                              d="M3 7.5A1.5 1.5 0 014.5 6h15A1.5 1.5 0 0121 7.5v9A1.5 1.5 0 0119.5 18h-15A1.5 1.5 0 013 16.5v-9zM9 6V4.75A1.75 1.75 0 0110.75 3h2.5A1.75 1.75 0 0115 4.75V6"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="truncate">{item.title}</span>
                        </span>
                        <span className="flex min-w-0 items-center gap-1 truncate">
                          <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path
                              d="M4 20V6.5A1.5 1.5 0 015.5 5h6A1.5 1.5 0 0113 6.5V20m0 0h7m-7 0H4m9-11h3m-3 4h3m-9-4h2m-2 4h2"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="truncate">{item.company}</span>
                        </span>
                        <span className="flex min-w-0 items-center gap-1 truncate">
                          <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path
                              d="M12 21s6-5.1 6-10a6 6 0 10-12 0c0 4.9 6 10 6 10z"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <circle cx="12" cy="11" r="2.2" stroke="currentColor" strokeWidth="1.4" />
                          </svg>
                          <span className="truncate">{item.location}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                        aria-label="Mark viewed"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z" stroke="currentColor" strokeWidth="1.5" />
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                        aria-label="Exclude candidate"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path
                            d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8zM22 11h-6"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <a
                        href={item.linkedinUrl}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                        aria-label="Open LinkedIn"
                      >
                        <Image src="/LinkedIN.svg" alt="" width={12} height={12} className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <div className="space-y-1.5">
            {/* 配置卡：Ranking 下拉 + Hiring + Criteria */}
            <section className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
              <div className="mb-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[8px] font-semibold text-slate-500">Ranking:</span>
                <button
                  type="button"
                  className="flex min-h-7 min-w-0 flex-1 items-center justify-between gap-1 rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-1 text-left text-[8px] font-medium text-slate-800 shadow-sm"
                >
                  <span className="min-w-0 truncate">
                    USA, female and include CEO <span className="text-slate-500">· 24 cand…</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-slate-400">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M12 20h9M4 13l8-8a2 2 0 113 3l-8 8-4 1 1-4z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-slate-500">▾</span>
                  </span>
                </button>
              </div>

              <div className="space-y-1">
                <div className="text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-500">Hiring Requirements</div>
                <div className="rounded-lg border border-slate-200 bg-slate-50/50 pl-2 pr-2 py-1.5">
                  <div className="border-l-[3px] pl-2" style={{ borderLeftColor: primary }}>
                    <p className="text-[9px] font-semibold leading-4 text-slate-900">Live in USA, female</p>
                  </div>
                </div>
              </div>

              <div className="mt-2 space-y-1">
                <div className="text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-500">Evaluation Criteria</div>
                <div className="grid grid-cols-2 gap-1">
                  {evaluationCriteria.map((criterion) => (
                    <div key={criterion.criterion} className="rounded-lg border border-slate-200 bg-white p-1.5 shadow-sm">
                      <div className="flex gap-1">
                        <span
                          className={`mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                            criterion.dot === 'blue' ? 'bg-blue-600' : 'bg-violet-600'
                          }`}
                          aria-hidden
                        />
                        <p className="line-clamp-3 text-[7.5px] font-medium leading-3 text-slate-800">{criterion.criterion}</p>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-1">
                        <span className="rounded bg-red-50 px-1 py-0.5 text-[7px] font-bold text-red-600">Required</span>
                        <span className="text-[7px] text-slate-500">Weight: {criterion.weight}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Ranked 列表 */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-2 py-1.5">
                <h3 className="text-[9px] font-bold text-slate-800">
                  Ranked Candidates <span className="font-semibold text-slate-500">({rankedListTotal})</span>
                </h3>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[8px] font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M12 3v12M8 11l4 4 4-4M5 21h14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Export CSV
                </button>
              </div>

              <div className="space-y-1.5 p-1.5">
                {rankingRows.map((candidate, index) => {
                  const isExpanded = expandedCandidateName === candidate.name;
                  const isRankOne = candidate.rank === 1;
                  const handleToggleCriteria = () => {
                    setExpandedCandidateName((prev) => (prev === candidate.name ? null : candidate.name));
                  };

                  return (
                    <article
                      key={candidate.name}
                      className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm"
                      style={{
                        opacity: hasEntered ? 1 : 0,
                        transform: hasEntered ? 'translateY(0)' : 'translateY(8px)',
                        transition: `opacity 360ms ease-out ${index * 120}ms, transform 360ms ease-out ${index * 120}ms`,
                      }}
                    >
                      <div className="mb-2 flex items-start gap-1.5">
                        <div className="flex min-w-0 flex-1 items-start gap-1.5">
                          <span
                            className={`inline-flex h-7 min-w-[26px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold tabular-nums ${
                              isRankOne
                                ? 'bg-neutral-900 text-white'
                                : 'border border-slate-300 bg-white text-slate-700'
                            }`}
                          >
                            {candidate.rank}
                          </span>
                          <button
                            type="button"
                            onClick={() => openProfilePanel(candidate.name)}
                            className={`shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#0052CC]/35 ${
                              enableProfilePanel ? 'cursor-pointer transition-transform hover:scale-105' : 'cursor-default'
                            }`}
                            aria-label={enableProfilePanel ? `Open ${candidate.name} profile` : undefined}
                          >
                            <Image
                              src={candidate.avatarSrc}
                              alt=""
                              width={28}
                              height={28}
                              className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200"
                            />
                          </button>
                          <div className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-1">
                              <button
                                type="button"
                                onClick={() => openProfilePanel(candidate.name)}
                                className={`truncate rounded-sm text-left text-[10px] font-bold text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-[#0052CC]/25 ${enableProfilePanel ? 'hover:text-[#0052CC] hover:underline' : 'cursor-default'}`}
                              >
                                {candidate.name}
                              </button>
                              <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] bg-[#0A66C2]">
                                <Image src="/LinkedIN.svg" alt="" width={10} height={10} className="h-2.5 w-2.5 invert" />
                              </span>
                            </span>
                            <button
                              type="button"
                              onClick={handleToggleCriteria}
                              className="mt-0.5 block w-full rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-[#0052CC]/25"
                            >
                              <span className="line-clamp-2 text-[8px] leading-3 text-slate-500">{candidate.headline}</span>
                              <span className="mt-1 inline-flex items-center gap-0.5 text-[7.5px] text-slate-400">
                              <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <path
                                  d="M12 20h9M4 13l8-8a2 2 0 113 3l-8 8-4 1 1-4z"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              {candidate.note}
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* 右侧：操作 + 分数（不触发折叠） */}
                        <div className="flex shrink-0 items-start gap-1">
                          <button
                            type="button"
                            className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-sky-100 bg-sky-50 text-sky-700 hover:bg-sky-100"
                            aria-label="View candidate"
                          >
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
                              <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z" stroke="currentColor" strokeWidth="1.5" />
                              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-sky-100 bg-sky-50 text-sky-700 hover:bg-sky-100"
                            aria-label="Remove from pool"
                          >
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
                              <path
                                d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8zM22 11h-6"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <div className="ml-0.5 flex min-w-[40px] flex-col items-end leading-none">
                            <span className="text-[17px] font-bold tabular-nums" style={{ color: primary }}>
                              {candidate.score}
                            </span>
                            <span className="mt-0.5 text-[7px] font-medium text-slate-500">score</span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-2 grid grid-cols-3 gap-1">
                        {[
                          { label: 'Title', value: candidate.title },
                          { label: 'Company', value: candidate.company },
                          { label: 'Location', value: candidate.location },
                        ].map((item) => (
                          <div key={`${candidate.name}-${item.label}`} className="rounded-md border border-slate-200 bg-slate-50/80 p-1.5">
                            <div className="text-[7px] font-semibold uppercase tracking-wide text-slate-500">{item.label}</div>
                            <div className="mt-0.5 truncate text-[8px] font-semibold text-slate-800">{item.value}</div>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-md border border-slate-200 bg-slate-50/50 p-2">
                        <div className="mb-1 text-[7.5px] font-bold uppercase tracking-[0.16em] text-slate-500">AI Analysis</div>
                        <p className="text-[8.5px] leading-[1.45] text-slate-700">
                          {candidate.analysis.map((seg, i) =>
                            seg.bold ? (
                              <strong key={i} className="font-semibold text-slate-900">
                                {seg.text}
                              </strong>
                            ) : (
                              <span key={i}>{seg.text}</span>
                            )
                          )}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleToggleCriteria}
                        className={`mt-2 flex w-full select-none items-center justify-between rounded-lg border px-2 py-1.5 text-left transition-colors ${
                          isExpanded ? 'border-sky-200 bg-sky-50/80' : 'border-slate-200 bg-slate-50/70'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="h-3 w-0.5 rounded-full" style={{ backgroundColor: primary }} />
                          <span className="text-[7.5px] font-bold uppercase tracking-[0.12em]" style={{ color: primary }}>
                            Criteria Scores
                          </span>
                          <span className="text-[7px] font-semibold text-slate-500">({candidate.breakdown.length})</span>
                        </div>
                        <span className={`text-[10px] text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▾</span>
                      </button>

                      <div
                        className="mt-1 space-y-1 overflow-hidden"
                        style={{
                          maxHeight: isExpanded ? '120px' : '0px',
                          transition: 'max-height 320ms ease',
                        }}
                      >
                        {candidate.breakdown.map((dimension) => (
                          <div key={`${candidate.name}-${dimension.label}`} className="rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm">
                            <div className="grid grid-cols-[1fr_52px_20px] items-center gap-1">
                              <div className="truncate text-[8px] font-medium text-slate-700">{dimension.label}</div>
                              <div className="relative h-[3px] overflow-hidden rounded-full bg-slate-200">
                                <span
                                  className="absolute inset-y-0 left-0 rounded-full"
                                  style={{
                                    width: `${dimension.value}%`,
                                    background: candidate.scoreColor,
                                    transition: `width 600ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 120}ms`,
                                  }}
                                />
                              </div>
                              <div className="text-right text-[8px] font-bold tabular-nums text-slate-800">{dimension.value}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                    </article>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </div>

      {enableProfilePanel && profileCandidate && (
        <div
          className="absolute inset-y-0 right-0 z-40 w-[min(340px,86%)] [&>*]:!h-full"
          style={{
            boxShadow: profilePanelVisible ? '-18px 0 45px rgba(15,23,42,0.18)' : 'none',
            transform: profilePanelVisible ? 'translateX(0)' : 'translateX(100%)',
            transition: profilePanelVisible
              ? 'transform 300ms cubic-bezier(0.2, 0, 0, 1), box-shadow 300ms ease'
              : 'transform 260ms cubic-bezier(0.4, 0, 1, 1), box-shadow 180ms ease',
            willChange: 'transform',
          }}
        >
          <ProfilePanelSlideMock
            defaultOpen
            panelOnly
            fontStyle={fontStyle}
            profile={{
              name: profileCandidate.name,
              avatarSrc: profileCandidate.avatarSrc,
              headline: 'headline' in profileCandidate
                ? profileCandidate.headline
                : `${profileCandidate.title} · ${profileCandidate.company}`,
              company: profileCandidate.company,
              location: profileCandidate.location,
            }}
            onRequestClose={closeProfilePanel}
          />
        </div>
      )}
    </div>
  );
}

/** Fig 9：列表 + Profile 抽屉（结构对齐 ConnectNova `Sheet` Profile，外框高度与 Fig 7 共用常量） */
function ProfilePanelSlideMock({
  defaultOpen = false,
  fontStyle,
  panelOnly = false,
  profile,
  onRequestClose,
}: {
  defaultOpen?: boolean;
  fontStyle: { fontFamily: string };
  panelOnly?: boolean;
  profile?: {
    name: string;
    avatarSrc: string;
    headline: string;
    company: string;
    location: string;
  };
  onRequestClose?: () => void;
}) {
  const primary = '#0052CC';
  const [gridOpen, setGridOpen] = useState(defaultOpen);
  const [panelVisible, setPanelVisible] = useState(defaultOpen);
  const [activeRowId, setActiveRowId] = useState<string | null>(defaultOpen ? '1' : null);
  const [notesEditing, setNotesEditing] = useState(false);
  const [notesValue, setNotesValue] = useState('');
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  // 与 Fig 7 叙事一致的 4 条紧凑列表（仅展示字段）
  const listRows = [
    { id: '1', name: 'Sarah Chen', subtitle: 'Senior PM · Google · SF', score: '92' },
    { id: '2', name: 'Marcus Lee', subtitle: 'Product Lead · Meta · NYC', score: '87' },
    { id: '3', name: 'Priya Nair', subtitle: 'PM · Stripe · Seattle', score: '74' },
    { id: '4', name: 'Jordan Lee', subtitle: 'Gameplay Programmer · Riot · LA', score: '48' },
  ];

  useEffect(() => {
    return () => {
      if (closeTimerRef.current != null) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  const openPanel = (rowId: string) => {
    if (closeTimerRef.current != null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveRowId(rowId);
    setGridOpen(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPanelVisible(true));
    });
  };

  const closePanel = () => {
    if (panelOnly && onRequestClose) {
      onRequestClose();
      return;
    }
    setPanelVisible(false);
    closeTimerRef.current = window.setTimeout(() => {
      setGridOpen(false);
      setActiveRowId(null);
      setAboutExpanded(false);
      setNotesEditing(false);
      closeTimerRef.current = null;
      onRequestClose?.();
    }, 220);
  };

  const panelTransform = panelVisible ? 'translateX(0)' : 'translateX(100%)';
  const panelTransition = panelVisible
    ? 'transform 280ms cubic-bezier(0.2, 0, 0, 1)'
    : 'transform 220ms ease-in';

  // 公司 logo：本地 /public/img/connectnova/logos（Simple Icons SVG，仅视觉示意）
  const experienceMock = [
    {
      title: 'Senior Product Manager',
      company: 'Google',
      duration: '2021 – Present',
      location: 'San Francisco, CA',
      logoSrc: '/img/connectnova/logos/google.svg',
    },
    {
      title: 'Product Manager',
      company: 'Lyft',
      duration: '2018 – 2021',
      location: 'San Francisco, CA',
      logoSrc: '/img/connectnova/logos/lyft.svg',
    },
    {
      title: 'Associate PM',
      company: 'Airbnb',
      duration: '2016 – 2018',
      location: 'San Francisco, CA',
      logoSrc: '/img/connectnova/logos/airbnb.svg',
    },
  ];

  const aboutText =
    'Product leader focused on roadmap execution, cross-functional alignment, and turning ambiguous problem spaces into measurable outcomes. Experienced in growth-stage and large-scale orgs.';

  return (
    <div
      className={`${panelOnly ? 'block' : 'grid'} min-h-0 bg-slate-50 ${connectNovaProfilePanelMockFrameClassName}`}
      style={{
        ...fontStyle,
        gridTemplateColumns: panelOnly
          ? undefined
          : gridOpen
            ? 'minmax(0,1fr) 300px'
            : 'minmax(0,1fr) 0fr',
        transition: 'grid-template-columns 280ms ease',
      }}
      aria-label="Profile panel slide-in mock"
    >
      {/* 左：Ranked 列表（示意 Fig 7 入口） */}
      <div className={`${panelOnly ? 'hidden' : 'flex'} min-h-0 min-w-0 flex-col border-r border-black/[0.06] bg-white`}>
        <div className="shrink-0 border-b border-black/[0.06] px-3 py-2">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-black/45">Ranked candidates</div>
          <div className="text-[9px] text-black/45">Click a row to open profile (Sheet)</div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {listRows.map((row) => {
            const isActive = activeRowId === row.id;
            return (
              <button
                key={row.id}
                type="button"
                onClick={() => openPanel(row.id)}
                className="flex w-full items-center gap-2 border-b border-black/[0.04] px-3 py-2 text-left transition-colors duration-150"
                style={{
                  backgroundColor: isActive ? '#eff6ff' : undefined,
                  borderLeft: isActive ? '2px solid #2563eb' : '2px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = '';
                }}
              >
                <span className="w-6 shrink-0 text-center text-[10px] font-semibold tabular-nums text-black/35">{row.id}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[11px] font-semibold text-black/85">{row.name}</span>
                  <span className="mt-0.5 block truncate text-[10px] text-black/45">{row.subtitle}</span>
                </span>
                <span className="shrink-0 text-[11px] font-bold tabular-nums text-blue-600">{row.score}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 右：对齐真实 SheetContent — 固定 300px 宽 + translate 滑入 */}
      <div className="relative h-full min-h-0 w-full overflow-hidden bg-white">
        <div
          className={`absolute inset-y-0 right-0 h-full min-h-0 border-l border-black/[0.08] bg-white ${panelOnly ? 'w-full' : 'w-[300px]'}`}
          style={{
            transform: panelTransform,
            transition: panelTransition,
          }}
        >
          {/* 关闭：相对 Panel 固定定位，不随下方内容滚动 */}
          <div className="relative h-full min-h-0 w-full">
            <div className="pointer-events-none absolute right-2 top-2 z-40">
              <button
                type="button"
                onClick={closePanel}
                className="pointer-events-auto inline-flex h-7 w-7 items-center justify-center rounded-md text-black/45 hover:bg-black/[0.08] hover:text-black/75"
                aria-label="Close profile panel"
              >
                <span className="text-base leading-none">×</span>
              </button>
            </div>
            <div className="h-full min-h-0 overflow-y-auto overscroll-contain">
              {/* Hero：顶 padding 为 0，渐变 absolute 铺满整块，避免 pt 区域露出白底白条 */}
              <div className="relative isolate overflow-x-hidden px-3 pb-4 pt-0">
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: `linear-gradient(to bottom right, ${primary}21, ${primary}0f, transparent)`,
                  }}
                />
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-40 blur-2xl"
                  style={{ backgroundColor: `${primary}40` }}
                />
                <div
                  className="pointer-events-none absolute left-0 right-0 top-0 h-px"
                  style={{
                    background: `linear-gradient(to right, transparent, ${primary}40, transparent)`,
                  }}
                />

                <div className="relative z-10 flex items-start gap-2.5 pt-10">
                <Image
                  src={profile?.avatarSrc ?? '/img/jobnova/persona-sarah.jpg'}
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-white/80"
                />
                <div className="min-w-0 pt-0.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h2 className="text-[13px] font-bold leading-tight text-black/90">{profile?.name ?? 'Sarah Chen'}</h2>
                    <a
                      href="https://www.linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 opacity-70 hover:opacity-100"
                      title="Open LinkedIn profile"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Image src="/LinkedIN.svg" alt="" width={14} height={14} className="h-3.5 w-3.5" />
                    </a>
                  </div>
                  <p className="mt-1 text-[10px] font-normal leading-snug text-black/75">
                    {profile?.headline ?? 'Senior Product Manager · Roadmaps, discovery, and shipping cross-team outcomes.'}
                  </p>
                  <div className="mt-1.5 flex flex-col gap-0.5 text-[9px] text-black/50">
                    <span className="flex items-center gap-1">
                      <svg className="h-2.5 w-2.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path
                          d="M4 10.5V20h16v-9.5M9 20v-4h6v4M8 4h8v3H8V4zM6 7h12l1 3H5l1-3z"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {profile?.company ?? 'Google'}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="h-2.5 w-2.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path
                          d="M12 21s7-4.35 7-10a7 7 0 10-14 0c0 5.65 7 10 7 10z"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinejoin="round"
                        />
                        <circle cx="12" cy="11" r="2" fill="currentColor" />
                      </svg>
                      {profile?.location ?? 'San Francisco Bay Area'}
                    </span>
                  </div>

                  {/* My Note：对齐真实抽屉（铅笔 + Add note / 编辑 textarea） */}
                  <div className="mt-2 flex min-h-[26px] items-center border-t border-black/10 pt-2">
                    {notesEditing ? (
                      <textarea
                        value={notesValue}
                        onChange={(e) => setNotesValue(e.target.value)}
                        onBlur={() => {
                          if (!notesValue.trim()) setNotesEditing(false);
                        }}
                        rows={2}
                        autoFocus
                        placeholder="Add note..."
                        className="w-full resize-none rounded-md border border-black/15 bg-white px-2 py-1.5 text-[10px] leading-snug text-black/85 outline-none focus:border-[#2563eb]"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setNotesEditing(true)}
                        className="flex items-center gap-1 text-[9px] text-black/45 transition-colors hover:text-blue-700"
                      >
                        <svg className="h-2.5 w-2.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path
                            d="M12 20h9M4 13l8-8a2 2 0 113 3l-8 8-4 1 1-4z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Add note...
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

              {/* Hero 与 About 间距（约为原先一半） */}
              <div className="mt-2 px-3 pb-5 pt-2">
                <div className="divide-y divide-black/10">
              <div className="py-2.5 first:pt-0">
                <h4 className="mb-1.5 flex items-center gap-1 text-[8px] font-semibold uppercase tracking-wider text-black/45">
                  <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M6 4h12v16H6V4zm3 4h6M9 14h6"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  About
                </h4>
                <p className={`text-[9px] leading-relaxed text-black/75 ${aboutExpanded ? '' : 'line-clamp-3'}`}>{aboutText}</p>
                {!aboutExpanded && (
                  <button
                    type="button"
                    onClick={() => setAboutExpanded(true)}
                    className="mt-0.5 text-[8px] font-medium text-blue-700 hover:underline"
                  >
                    More
                  </button>
                )}
              </div>

              <div className="py-2.5">
                <h4 className="mb-2 flex items-center gap-1 text-[8px] font-semibold uppercase tracking-wider text-black/55">
                  <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M4 7h16v10H4V7zm2 4h12M8 11h4"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  Experience
                </h4>
                <div className="ml-0.5 border-l-2 border-black/10 pl-3">
                  {experienceMock.map((exp) => (
                    <div key={exp.company} className="relative flex gap-2 pb-3 last:pb-0">
                      <div
                        className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full"
                        style={{ backgroundColor: `${primary}80` }}
                        aria-hidden
                      />
                      <div
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-black/[0.06]"
                        aria-hidden
                      >
                        <Image
                          src={exp.logoSrc}
                          alt=""
                          width={14}
                          height={14}
                          className="h-3.5 w-3.5 object-contain"
                          aria-hidden
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-semibold text-black/90">{exp.title}</p>
                        <p className="text-[9px] text-black/55">{exp.company}</p>
                        <div className="mt-0.5 flex flex-wrap gap-1 text-[8px] text-black/45">
                          <span>{exp.duration}</span>
                          <span>·</span>
                          <span>{exp.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="py-2.5">
                <h4 className="mb-2 flex items-center gap-1 text-[8px] font-semibold uppercase tracking-wider text-black/45">
                  <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 3L3 8v7l9 5 9-5V8l-9-5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                  </svg>
                  Education
                </h4>
                <div className="flex gap-2 rounded-lg bg-black/[0.04] p-2">
                  {/* 学校 logo：Wikimedia Commons Stanford block S SVG，仅视觉示意 */}
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white ring-1 ring-black/8"
                    aria-hidden
                  >
                    <Image
                      src="/img/connectnova/logos/stanford.svg"
                      alt=""
                      width={18}
                      height={18}
                      className="h-[18px] w-[18px] object-contain"
                      aria-hidden
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-medium text-black/90">Stanford University</p>
                    <p className="text-[9px] text-black/55">MS, Computer Science</p>
                    <p className="mt-0.5 text-[8px] text-black/45">2014 – 2016</p>
                  </div>
                </div>
              </div>

              <div className="py-2.5">
                <h4 className="mb-1.5 flex items-center gap-1 text-[8px] font-semibold uppercase tracking-wider text-black/45">
                  <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M4 5h16v14H4V5zm4 3h8M8 13h4M8 17h3"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                    />
                  </svg>
                  Languages
                </h4>
                <div className="flex flex-wrap gap-1">
                  {['English · Full professional', 'Mandarin · Native'].map((lang) => (
                    <span key={lang} className="rounded-md border-0 bg-black/[0.06] px-2 py-0.5 text-[8px] text-black/55">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesignSystemComponentsMock({ fontStyle }: { fontStyle: { fontFamily: string } }) {
  const [activeTab, setActiveTab] = useState<'rankings' | 'pool'>('rankings');
  const [searchValue, setSearchValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState('v2 · After client feedback');
  const [popupOpen, setPopupOpen] = useState(false);

  const s = { ...fontStyle } as React.CSSProperties;

  const sectionLabel = (text: string) => (
    <div style={{ ...s, fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase' as const, fontWeight: 600, color: 'rgba(0,0,0,0.3)', marginBottom: '12px' }}>{text}</div>
  );

  const dropdownVersions = ['v2 · After client feedback', 'v1 · Initial ranking'];

  return (
    <div
      className="cn-scope min-w-0 max-w-full"
      style={{
        width: '100%',
        boxSizing: 'border-box',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: '14px',
        background: '#FFFFFF',
        overflow: 'hidden',
        marginTop: '12px',
        position: 'relative' as const,
      }}
    >
      {/* Header */}
      <div
        className="flex flex-col items-start gap-1.5 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(0,0,0,0.015)' }}
      >
        <div style={{ ...s, fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase' as const, fontWeight: 500, color: 'rgba(0,0,0,0.4)' }}>
          Components
        </div>
        <span style={{ ...s, maxWidth: '100%', fontSize: '10px', lineHeight: '15px', fontWeight: 500, color: 'rgba(0,0,0,0.38)', fontStyle: 'italic' as const }}>
          Interactive · hover &amp; click to explore
        </span>
      </div>

      <div className="flex min-w-0 flex-col gap-6 p-4 sm:p-6">

        {/* Row 1: Buttons */}
        <div>
          {sectionLabel('Buttons')}
          <div className="flex flex-wrap" style={{ gap: '8px', alignItems: 'center' }}>
            <button className="cn-btn cn-btn-primary" style={s}>Rank candidates</button>
            <button className="cn-btn cn-btn-secondary" style={s}>Export list</button>
            <button className="cn-btn cn-btn-ghost" style={s}>View history</button>
            <button className="cn-btn cn-btn-danger" style={s}>Delete project</button>
          </div>
        </div>

        {/* Row 2: Status badges + Tab switcher */}
        <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="min-w-0">
            {sectionLabel('Status badges')}
            <div className="flex flex-wrap" style={{ gap: '6px' }}>
              <span className="cn-chip cn-chip-blue" style={s}>Active</span>
              <span className="cn-chip cn-chip-green" style={s}>Ranked</span>
              <span className="cn-chip cn-chip-gray" style={s}>Archived</span>
              <span className="cn-chip cn-chip-blue" style={s}>Shortlisted</span>
              <span className="cn-chip cn-chip-gray-dim" style={s}>Excluded</span>
              <span className="cn-chip cn-chip-purple" style={s}>New</span>
            </div>
          </div>
          <div className="min-w-0">
            {sectionLabel('Tab switcher')}
            <div className="cn-tab-group">
              {(['rankings', 'pool'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`cn-tab${activeTab === tab ? ' is-active' : ''}`}
                  style={s}
                >
                  {tab === 'rankings' ? 'Rankings' : 'Candidate pool'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Inputs */}
        <div>
          {sectionLabel('Inputs')}
          <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-3">
            {/* Search */}
            <div className="min-w-0">
              <div style={{ ...s, fontSize: '11px', fontWeight: 500, color: 'rgba(0,0,0,0.5)', marginBottom: '6px' }}>Search</div>
              <div style={{ position: 'relative' as const }}>
                <svg style={{ position: 'absolute' as const, left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' as const, opacity: 0.35 }} width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input
                  type="text"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  placeholder="Search candidates..."
                  className="cn-input cn-input-search"
                  style={{ ...s, paddingRight: searchValue ? '32px' : '12px' }}
                />
                {searchValue && (
                  <button onClick={() => setSearchValue('')} style={{ position: 'absolute' as const, right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'rgba(0,0,0,0.35)', fontSize: '14px', lineHeight: 1 }}>✕</button>
                )}
              </div>
            </div>
            {/* Text input */}
            <div className="min-w-0">
              <div style={{ ...s, fontSize: '11px', fontWeight: 500, color: 'rgba(0,0,0,0.5)', marginBottom: '6px' }}>Project name</div>
              <input
                type="text"
                placeholder="e.g. Senior PM – Fintech"
                className="cn-input"
                style={s}
              />
            </div>
            {/* Disabled input */}
            <div className="min-w-0">
              <div style={{ ...s, fontSize: '11px', fontWeight: 500, color: 'rgba(0,0,0,0.5)', marginBottom: '6px' }}>Hiring need <span style={{ color: 'rgba(0,0,0,0.3)', fontWeight: 400 }}>(disabled)</span></div>
              <input
                type="text"
                disabled
                placeholder="Locked after ranking"
                className="cn-input"
                style={s}
              />
            </div>
          </div>
        </div>

        {/* Row 4: Dropdown + Popup trigger */}
        <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Dropdown */}
          <div className="min-w-0">
            {sectionLabel('Dropdown')}
            <div style={{ position: 'relative' as const }}>
              <button
                onClick={() => setDropdownOpen(v => !v)}
                style={{ ...s, minWidth: 0, fontSize: '13px', fontWeight: 400, color: 'rgb(0,0,0)', background: '#fff', border: `1px solid ${dropdownOpen ? 'var(--cn-primary)' : 'rgba(0,0,0,0.16)'}`, borderRadius: '7px', padding: '8px 12px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', cursor: 'pointer', outline: 'none', boxShadow: dropdownOpen ? '0 0 0 3px var(--cn-primary-ring)' : 'none', transition: 'border-color 0.15s' }}
              >
                <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedVersion}</span>
                <span style={{ ...s, flexShrink: 0, fontSize: '10px', color: 'rgba(0,0,0,0.35)', transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>▾</span>
              </button>
              {dropdownOpen && (
                <div style={{ position: 'absolute' as const, top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', zIndex: 10, overflow: 'hidden' }}>
                  {dropdownVersions.map((v) => (
                    <button
                      key={v}
                      onClick={() => { setSelectedVersion(v); setDropdownOpen(false); }}
                      style={{ ...s, fontSize: '13px', fontWeight: v === selectedVersion ? 500 : 400, color: v === selectedVersion ? 'var(--cn-primary)' : 'rgb(0,0,0)', background: v === selectedVersion ? 'var(--cn-primary-light)' : '#fff', border: 'none', width: '100%', textAlign: 'left' as const, padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                      {v}
                      {v === selectedVersion && <span style={{ color: 'var(--cn-primary)', fontSize: '11px' }}>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Popup trigger */}
          <div className="min-w-0">
            {sectionLabel('Popup / Confirm dialog')}
            <button
              onClick={() => setPopupOpen(true)}
              className="cn-btn cn-btn-danger"
              style={s}
            >
              Delete project →
            </button>
          </div>
        </div>


      </div>

      {/* Footer */}
      <div className="px-4 py-3 sm:px-6" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', background: 'rgba(0,0,0,0.015)', ...s, overflowWrap: 'anywhere', fontSize: '13px', lineHeight: '20px', color: 'oklch(0.556 0 0)', fontStyle: 'italic' as const }}>
        All components share the same token layer — swap a color variable and both extension and dashboard update together
      </div>

      {/* Popup overlay */}
      {popupOpen && (
        <div
          style={{ position: 'absolute' as const, inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, borderRadius: '14px' }}
          onClick={() => setPopupOpen(false)}
        >
          <div
            style={{ background: '#fff', borderRadius: '12px', padding: 'clamp(18px, 4vw, 24px)', width: 'min(300px, calc(100% - 32px))', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ ...s, fontSize: '15px', fontWeight: 600, color: 'rgb(0,0,0)', marginBottom: '8px' }}>Delete this project?</div>
            <div style={{ ...s, fontSize: '13px', lineHeight: '20px', color: 'rgba(0,0,0,0.56)', marginBottom: '20px' }}>
              This will permanently remove <strong style={{ fontWeight: 500, color: 'rgb(0,0,0)' }}>Senior PM – Fintech</strong> and all 24 candidates. This action cannot be undone.
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setPopupOpen(false)} className="cn-btn cn-btn-ghost" style={s}>Cancel</button>
              <button
                onClick={() => setPopupOpen(false)}
                style={{ ...s, fontSize: '13px', fontWeight: 500, color: '#fff', background: 'rgba(200,40,20,0.9)', border: 'none', borderRadius: '7px', padding: '8px 16px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Connectnova 项目详情页（由 MemQ 模板复制，可替换为实际项目内容）
export default function ConnectnovaProjectPage() {
  // fontStyle 仅作为 Manrope 字体家族的简写，仍保留以避免破坏下方大量 `...fontStyle` 的展开
  const fontStyle = {
    fontFamily: fontFamily.sans,
  };
  // H1 / H2 改为从语义预设继承；先叠 Manrope，再叠排版 scale，再叠布局相关属性
  const headingLevel1Style = {
    ...fontStyle,
    ...textStyle.h1,
    color: textColor.strong,
    marginBottom: '16px',
  };

  // Overview 模块：Dashboard 视图切换（MVP / Outreach）
  const [overviewDashboardMode, setOverviewDashboardMode] = useState<'ranking' | 'outreach'>('ranking');

  return (
    <div className="mei-project-page w-full min-w-0" style={{ backgroundColor: '#FFFFFF' }}>
      <CaseStudyControls />
      <CaseStudyHero
        title="ConnectNova AI Sourcing Platform"
        subtitle="An AI-powered LinkedIn sourcing tool that re-ranks search results by fit and surfaces the best candidates and contacts first."
        tags={['AI Search', 'Chrome Extension', 'B2B SaaS', 'Recruiting & Sales', 'Workflow Design']}
        aboutLabel="Overview"
        about={`ConnectNova uses AI to re-rank LinkedIn search results, helping recruiters and sales teams surface the best-fit people faster.

I led the 0–1 design of the Chrome extension and web platform.`}
        liveSiteHref="https://connectnova.ai/"
        meta={[
          {
            label: 'Role',
            value: ['Founding Product Designer', 'Product Strategy', 'UX Design', 'Information Architecture', 'Interaction Design'],
          },
          { label: 'Team', value: ['Founding Team', '1 Product Designer', '1 Founder', 'Engineering Team'] },
          { label: 'Tool', value: ['Figma', 'PostHog', 'Claude Code'] },
          { label: 'Company', value: ['Nova AI'] },
          { label: 'Year', value: ['2026 — Present'] },
        ]}
        visualLabel="ConnectNova AI sourcing workflow"
        visualSrc="/img/connectnova/Connectnova-5af98874.avif"
        visualAlt="ConnectNova dashboard and LinkedIn extension shown as one connected sourcing, ranking, evaluation, and outreach workflow."
        visualObjectPosition="center bottom"
        visualObjectFit="contain"
        visualImageScale={0.9}
        visualTransformOrigin="center bottom"
        visualHeight="clamp(300px, 38vw, 540px)"
        visualBackground="radial-gradient(circle at 82% 16%, rgb(111 163 255 / 0.38), transparent 32%), radial-gradient(circle at 14% 84%, rgb(116 214 224 / 0.3), transparent 36%), radial-gradient(circle at 52% 42%, rgb(190 203 255 / 0.42), transparent 44%), linear-gradient(135deg, #f8fbff 0%, #e7efff 50%, #f1f8ff 100%)"
      />

      <ConnectnovaNarrative
        informationArchitectureVisual={<AIRankingViewMock fontStyle={fontStyle} enableProfilePanel />}
        designComponentsVisual={<DesignSystemComponentsMock fontStyle={fontStyle} />}
        manageWorkspaceVisual={
          <div className="[&>*]:!h-full" style={{ height: 'min(540px, 62svh)' }}>
            <AIRankingViewMock fontStyle={fontStyle} defaultTab="rankings" enableProfilePanel />
          </div>
        }
      />

      <section
        hidden
        className="w-screen"
        data-case-nav-label="Platform at a glance"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          padding: 'clamp(72px, 9vw, 120px) clamp(24px, 6vw, 96px)',
        }}
      >
        <ScrollAnimatedSection>
          <div style={{ margin: '0 auto', maxWidth: '1400px' }}>
            <h1 style={{ ...headingLevel1Style, marginBottom: '16px' }}>Solution</h1>
            <p
              style={{
                ...fontStyle,
                color: 'rgba(0, 0, 0, 0.88)',
                fontSize: '18px',
                fontWeight: 400,
                lineHeight: '30px',
                margin: '0 0 72px',
                maxWidth: '780px',
              }}
            >
              Two tightly coupled products — an extension that lives inside LinkedIn, and a dashboard that turns collected profiles into a ranked, manageable pipeline.
            </p>
            <p style={{ ...fontStyle, color: '#2459d3', fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 16px', textTransform: 'uppercase' }}>
              01 · Overview
            </p>
            <h2 style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(34px, 4.4vw, 56px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 20px' }}>
              The platform at a glance
            </h2>
            <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.62)', fontSize: '17px', fontWeight: 300, lineHeight: 1.65, margin: '0 0 32px', maxWidth: '820px' }}>
              ConnectNova is made up of two tightly coupled products — a <strong style={{ color: textColor.strong, fontWeight: 500 }}>Chrome extension</strong> that lives inside LinkedIn, and a <strong style={{ color: textColor.strong, fontWeight: 500 }}>web dashboard</strong> for managing, ranking, and reviewing candidates.
            </p>

            <div
              style={{
                alignItems: 'center',
                background: '#F8F9FB',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                justifyContent: 'center',
                padding: '14px',
              }}
              aria-label="Platform overview — Dashboard and Chrome Extension"
            >
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '4px', width: '100%' }}>
                <div style={{ background: '#FFFFFF', border: '1px solid rgba(0, 0, 0, 0.08)', borderRadius: '999px', display: 'inline-flex', gap: '6px', padding: '4px' }}>
                  {[
                    { key: 'ranking' as const, label: 'Ranking MVP' },
                    { key: 'outreach' as const, label: 'With outreach' },
                  ].map(({ key, label }) => {
                    const active = overviewDashboardMode === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setOverviewDashboardMode(key)}
                        style={{
                          ...fontStyle,
                          background: active ? '#0052CC' : 'transparent',
                          border: '1px solid transparent',
                          borderRadius: '999px',
                          color: active ? '#FFFFFF' : 'rgba(0, 0, 0, 0.7)',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 500,
                          lineHeight: '18px',
                          padding: '6px 12px',
                          transition: 'all 160ms ease',
                        }}
                        aria-pressed={active}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.42fr)]" style={{ alignItems: 'start' }}>
                <div style={{ alignItems: 'center', border: '8px solid #E5E7EB', borderRadius: '20px', display: 'flex', height: 'clamp(260px, 33vw, 410px)', justifyContent: 'center', overflow: 'hidden' }}>
                  <Image
                    src={overviewDashboardMode === 'outreach' ? '/img/connectnova/DashboardLayout.avif' : '/img/connectnova/Dashboard.avif'}
                    alt={overviewDashboardMode === 'outreach' ? 'ConnectNova dashboard overview with outreach workflow' : 'ConnectNova dashboard overview ranking MVP'}
                    width={1600}
                    height={1000}
                    sizes="(max-width: 768px) 100vw, 70vw"
                    style={{ display: 'block', height: '100%', maxWidth: '100%', objectFit: 'contain', width: 'auto' }}
                  />
                </div>
                <div style={{ alignItems: 'center', border: '8px solid #E5E7EB', borderRadius: '20px', display: 'flex', height: 'clamp(260px, 33vw, 410px)', justifyContent: 'center', overflow: 'hidden' }}>
                  <Image
                    src="/img/connectnova/Extension_home.avif"
                    alt="ConnectNova Chrome extension overview"
                    width={600}
                    height={1000}
                    sizes="(max-width: 768px) 100vw, 30vw"
                    style={{ display: 'block', height: '100%', maxWidth: '100%', objectFit: 'contain', width: 'auto' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>

      <section
        hidden
        className="w-screen"
        data-case-nav-label="Product at a glance"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          padding: 'clamp(72px, 9vw, 120px) clamp(24px, 6vw, 96px)',
        }}
      >
        <ScrollAnimatedSection>
          <div style={{ margin: '0 auto', maxWidth: '1400px' }}>
            <p
              style={{
                ...fontStyle,
                color: '#2459d3',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.08em',
                lineHeight: '18px',
                margin: '0 0 12px',
                textTransform: 'uppercase',
              }}
            >
              01 — Product at a glance
            </p>
            <h1
              style={{
                ...headingLevel1Style,
                fontSize: 'clamp(36px, 5vw, 68px)',
                lineHeight: 1.06,
                marginBottom: '24px',
                maxWidth: '980px',
              }}
            >
              From LinkedIn search to a managed people journey
            </h1>
            <p
              style={{
                ...fontStyle,
                color: 'rgba(10, 10, 10, 0.62)',
                fontSize: 'clamp(17px, 1.7vw, 22px)',
                fontWeight: 300,
                lineHeight: 1.55,
                margin: '0 0 24px',
                maxWidth: '860px',
              }}
            >
              ConnectNova helps recruiters and sales teams find, evaluate, contact, and manage the right people within one connected workflow.
            </p>

            <p
              style={{
                ...fontStyle,
                color: 'rgba(10, 10, 10, 0.62)',
                fontSize: '17px',
                fontWeight: 300,
                lineHeight: 1.65,
                margin: '0 0 32px',
                maxWidth: '820px',
              }}
            >
              ConnectNova is made up of two tightly coupled products — a <strong style={{ color: textColor.strong, fontWeight: 500 }}>Chrome extension</strong> that lives inside LinkedIn, and a <strong style={{ color: textColor.strong, fontWeight: 500 }}>web dashboard</strong> for managing, ranking, and reviewing candidates.
            </p>

            <div
              style={{
                alignItems: 'center',
                background: '#F8F9FB',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                justifyContent: 'center',
                marginBottom: 'clamp(48px, 7vw, 80px)',
                padding: '14px',
              }}
              aria-label="Platform overview — Dashboard and Chrome Extension"
            >
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '4px', width: '100%' }}>
                <div style={{ background: '#FFFFFF', border: '1px solid rgba(0, 0, 0, 0.08)', borderRadius: '999px', display: 'inline-flex', gap: '6px', padding: '4px' }}>
                  {[
                    { key: 'ranking' as const, label: 'Ranking MVP' },
                    { key: 'outreach' as const, label: 'With outreach' },
                  ].map(({ key, label }) => {
                    const active = overviewDashboardMode === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setOverviewDashboardMode(key)}
                        style={{
                          ...fontStyle,
                          background: active ? '#0052CC' : 'transparent',
                          border: '1px solid transparent',
                          borderRadius: '999px',
                          color: active ? '#FFFFFF' : 'rgba(0, 0, 0, 0.7)',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 500,
                          lineHeight: '18px',
                          padding: '6px 12px',
                          transition: 'all 160ms ease',
                        }}
                        aria-pressed={active}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.42fr)]" style={{ alignItems: 'start' }}>
                <div style={{ alignItems: 'center', border: '8px solid #E5E7EB', borderRadius: '20px', display: 'flex', height: 'clamp(260px, 33vw, 410px)', justifyContent: 'center', overflow: 'hidden' }}>
                  <Image
                    src={overviewDashboardMode === 'outreach' ? '/img/connectnova/DashboardLayout.avif' : '/img/connectnova/Dashboard.avif'}
                    alt={overviewDashboardMode === 'outreach' ? 'ConnectNova dashboard overview with outreach workflow' : 'ConnectNova dashboard overview ranking MVP'}
                    width={1600}
                    height={1000}
                    sizes="(max-width: 768px) 100vw, 70vw"
                    style={{ display: 'block', height: '100%', maxWidth: '100%', objectFit: 'contain', width: 'auto' }}
                  />
                </div>
                <div style={{ alignItems: 'center', border: '8px solid #E5E7EB', borderRadius: '20px', display: 'flex', height: 'clamp(260px, 33vw, 410px)', justifyContent: 'center', overflow: 'hidden' }}>
                  <Image
                    src="/img/connectnova/Extension_home.avif"
                    alt="ConnectNova Chrome extension overview"
                    width={600}
                    height={1000}
                    sizes="(max-width: 768px) 100vw, 30vw"
                    style={{ display: 'block', height: '100%', maxWidth: '100%', objectFit: 'contain', width: 'auto' }}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'clamp(18px, 4vw, 44px)',
                marginBottom: 'clamp(44px, 6vw, 64px)',
              }}
            >
              {[
                { status: 'shipped', label: 'Shipped', detail: 'Designed and delivered' },
                { status: 'progress', label: 'In progress', detail: 'Currently being designed or developed' },
                { status: 'planned', label: 'Planned', detail: 'Part of the long-term product vision' },
              ].map((legend) => (
                <div key={legend.status} style={{ alignItems: 'center', display: 'flex', gap: '10px' }}>
                  <span
                    aria-hidden="true"
                    style={{
                      background:
                        legend.status === 'shipped'
                          ? '#2459d3'
                          : legend.status === 'progress'
                            ? 'linear-gradient(90deg, #2459d3 50%, transparent 50%)'
                            : 'transparent',
                      border: '1px solid #2459d3',
                      borderRadius: '50%',
                      height: '10px',
                      width: '10px',
                    }}
                  />
                  <span>
                    <strong
                      style={{
                        ...fontStyle,
                        color: textColor.strong,
                        fontSize: '10px',
                        fontWeight: 500,
                        letterSpacing: '0.07em',
                        marginRight: '6px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {legend.label}
                    </strong>
                    <span style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '10px', fontWeight: 300 }}>
                      — {legend.detail}
                    </span>
                  </span>
                </div>
              ))}
            </div>

            <div
              aria-label="ConnectNova product journey and delivery status"
              style={{
                borderBottom: '1px solid rgba(10, 10, 10, 0.14)',
                borderTop: '1px solid rgba(10, 10, 10, 0.14)',
                overflowX: 'auto',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(260px, 1fr))', minWidth: '1040px' }}>
                {[
                  {
                    phase: 'Source',
                    title: 'Find the right people on LinkedIn',
                    body: 'ConnectNova enhances the LinkedIn workflow so users can identify and collect relevant candidates or contacts without rebuilding their search in another platform.',
                    capabilities: [
                      { status: 'shipped', label: 'Chrome Extension' },
                      { status: 'shipped', label: 'Collect profiles from LinkedIn' },
                      { status: 'shipped', label: 'Save profiles into a Project' },
                      { status: 'planned', label: 'AI re-ranking of LinkedIn search results' },
                      { status: 'planned', label: 'Surface the strongest matches first' },
                    ],
                  },
                  {
                    phase: 'Qualify',
                    title: 'Understand who is worth pursuing',
                    body: 'Users organize people around a specific Project, generate evaluation criteria, and compare profiles within a consistent decision framework.',
                    capabilities: [
                      { status: 'shipped', label: 'Project-based organization' },
                      { status: 'shipped', label: 'AI-generated evaluation criteria' },
                      { status: 'shipped', label: 'Editable criteria' },
                      { status: 'shipped', label: 'Profile evaluation' },
                      { status: 'shipped', label: 'Ranking and review' },
                      { status: 'shipped', label: 'Profile detail panel' },
                    ],
                  },
                  {
                    phase: 'Engage',
                    title: 'Turn selected people into outreach',
                    body: 'Qualified candidates or contacts can move into structured outreach workflows for personalized messaging and follow-ups.',
                    capabilities: [
                      { status: 'progress', label: 'Campaigns' },
                      { status: 'progress', label: 'Leads' },
                      { status: 'progress', label: 'Messaging Sequences' },
                      { status: 'progress', label: 'Multi-step outreach' },
                      { status: 'progress', label: 'Campaign performance views' },
                    ],
                  },
                  {
                    phase: 'Manage',
                    title: 'Track every person toward an outcome',
                    body: 'The long-term platform will help teams record where each person stands and manage their progress beyond the initial outreach.',
                    capabilities: [
                      { status: 'planned', label: 'Pipeline stages' },
                      { status: 'planned', label: 'Contact and response status' },
                      { status: 'planned', label: 'Progress tracking' },
                      { status: 'planned', label: 'Follow-up status' },
                      { status: 'planned', label: 'Final outcomes' },
                    ],
                  },
                ].map((stage, index) => (
                  <article
                    key={stage.phase}
                    style={{
                      borderLeft: index > 0 ? '1px solid rgba(10, 10, 10, 0.1)' : 0,
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: '570px',
                      padding: 'clamp(32px, 4vw, 48px)',
                    }}
                  >
                    <p
                      style={{
                        ...fontStyle,
                        color: 'rgba(36, 89, 211, 0.72)',
                        fontSize: '11px',
                        fontWeight: 500,
                        letterSpacing: '0.09em',
                        lineHeight: '17px',
                        margin: '0 0 44px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {String(index + 1).padStart(2, '0')} — {stage.phase}
                    </p>
                    <h2
                      style={{
                        ...fontStyle,
                        color: textColor.strong,
                        fontSize: 'clamp(24px, 2.5vw, 32px)',
                        fontWeight: 500,
                        lineHeight: 1.16,
                        margin: '0 0 20px',
                      }}
                    >
                      {stage.title}
                    </h2>
                    <p
                      style={{
                        ...fontStyle,
                        color: 'rgba(10, 10, 10, 0.58)',
                        fontSize: '14px',
                        fontWeight: 300,
                        lineHeight: 1.65,
                        margin: '0 0 34px',
                      }}
                    >
                      {stage.body}
                    </p>
                    <div
                      style={{
                        borderTop: '1px solid rgba(10, 10, 10, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        marginTop: 'auto',
                        paddingTop: '22px',
                      }}
                    >
                      {stage.capabilities.map((capability) => (
                        <div key={capability.label} style={{ alignItems: 'flex-start', display: 'flex', gap: '10px' }}>
                          <span
                            aria-hidden="true"
                            style={{
                              background:
                                capability.status === 'shipped'
                                  ? '#2459d3'
                                  : capability.status === 'progress'
                                    ? 'linear-gradient(90deg, #2459d3 50%, transparent 50%)'
                                    : 'transparent',
                              border: '1px solid #2459d3',
                              borderRadius: '50%',
                              flexShrink: 0,
                              height: '9px',
                              marginTop: '4px',
                              width: '9px',
                            }}
                          />
                          <span
                            style={{
                              ...fontStyle,
                              color: 'rgba(10, 10, 10, 0.56)',
                              fontSize: '12px',
                              fontWeight: 400,
                              lineHeight: '17px',
                            }}
                          >
                            {capability.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <p
              style={{
                ...fontStyle,
                color: 'rgba(10, 10, 10, 0.5)',
                fontSize: '14px',
                fontWeight: 300,
                lineHeight: 1.65,
                margin: '32px 0 clamp(52px, 7vw, 76px)',
                maxWidth: '920px',
              }}
            >
              Recruiting and sales teams may use different stage names, but both need to understand what has happened, where each person stands, and what should happen next.
            </p>

            <div style={{ overflowX: 'auto' }}>
              <div
                style={{
                  alignItems: 'center',
                  borderTop: '1px solid rgba(10, 10, 10, 0.14)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, minmax(150px, 1fr)) 110px',
                  minWidth: '760px',
                  paddingTop: '24px',
                }}
              >
                {['Source', 'Qualify', 'Engage', 'Manage', 'Outcome'].map((node, index, nodes) => (
                  <div key={node} style={{ alignItems: 'center', display: 'flex' }}>
                    <span
                      style={{
                        ...fontStyle,
                        color: node === 'Outcome' ? '#2459d3' : textColor.strong,
                        fontSize: node === 'Outcome' ? '11px' : '13px',
                        fontWeight: 500,
                        letterSpacing: '0.07em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {node}
                    </span>
                    {index < nodes.length - 1 && (
                      <span aria-hidden="true" style={{ color: 'rgba(36, 89, 211, 0.5)', marginLeft: 'auto', marginRight: '18px' }}>
                        →
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <p
              style={{
                ...fontStyle,
                color: textColor.strong,
                fontSize: 'clamp(24px, 3.2vw, 40px)',
                fontWeight: 400,
                lineHeight: 1.25,
                margin: 'clamp(48px, 6vw, 72px) 0 0',
                maxWidth: '1120px',
              }}
            >
              Source finds the right people. Qualify helps users decide. Engage starts the conversation.{' '}
              <span style={{ color: '#2459d3' }}>Manage preserves progress toward an outcome.</span>
            </p>

            <div
              hidden
              className="grid grid-cols-1 md:grid-cols-3"
              style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.14)', borderTop: '1px solid rgba(10, 10, 10, 0.14)' }}
            >
              {[
                {
                  eyebrow: '01 — The problem',
                  title: 'Too many profiles, too little signal',
                  body: 'LinkedIn surfaced hundreds of possible matches, but users still had to review, compare, and manage people manually.',
                },
                {
                  eyebrow: '02 — The core experience',
                  title: 'AI surfaces the strongest matches first',
                  body: 'ConnectNova evaluates each profile against the user’s goal and re-ranks the search by fit.',
                },
                {
                  eyebrow: '03 — The complete workflow',
                  title: 'From search result to managed relationship',
                  body: 'Users can evaluate people, save them into Projects, run personalized outreach, and track every candidate or lead through a stage-based pipeline.',
                },
              ].map((item, index) => (
                <article
                  key={item.title}
                  className={index > 0 ? 'border-t border-black/15 md:border-l md:border-t-0' : ''}
                  style={{ minHeight: '300px', padding: 'clamp(28px, 4vw, 48px)' }}
                >
                  <p
                    aria-hidden="true"
                    style={{
                      ...fontStyle,
                      color: 'rgba(36, 89, 211, 0.52)',
                      fontSize: '12px',
                      fontWeight: 500,
                      letterSpacing: '0.08em',
                      lineHeight: '18px',
                      margin: '0 0 48px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.eyebrow}
                  </p>
                  <h2
                    style={{
                      ...fontStyle,
                      color: index === 1 ? '#2459d3' : textColor.strong,
                      fontSize: 'clamp(20px, 2vw, 27px)',
                      fontWeight: 500,
                      lineHeight: 1.2,
                      margin: '0 0 18px',
                    }}
                  >
                    {item.title}
                  </h2>
                  <p
                    style={{
                      ...fontStyle,
                      color: 'rgba(10, 10, 10, 0.66)',
                      fontSize: '16px',
                      fontWeight: 300,
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {item.body}
                  </p>
                </article>
              ))}
            </div>

            <div hidden style={{ marginTop: 'clamp(64px, 8vw, 96px)' }}>
              <p
                style={{
                  ...fontStyle,
                  color: 'rgba(10, 10, 10, 0.46)',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  lineHeight: '18px',
                  margin: '0 0 20px',
                  textTransform: 'uppercase',
                }}
              >
                Product workflow
              </p>
              <h2
                style={{
                  ...fontStyle,
                  color: textColor.strong,
                  fontSize: 'clamp(30px, 4vw, 50px)',
                  fontWeight: 400,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.1,
                  margin: '0 0 clamp(40px, 5vw, 56px)',
                  maxWidth: '860px',
                }}
              >
                From LinkedIn search to a managed people pipeline
              </h2>
              <div
                aria-label="Source, qualify, engage, and manage workflow"
                style={{
                  borderBottom: '1px solid rgba(10, 10, 10, 0.14)',
                  borderTop: '1px solid rgba(10, 10, 10, 0.14)',
                  overflowX: 'auto',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))',
                    minWidth: '920px',
                  }}
                >
                  {[
                    {
                      phase: 'Source',
                      title: 'Find relevant people',
                      body: 'Search on LinkedIn while AI brings the strongest matches to the top.',
                      capabilities: ['LinkedIn search', 'AI re-ranking', 'Top matches'],
                    },
                    {
                      phase: 'Qualify',
                      title: 'Understand who fits',
                      body: 'Review profile evidence, compare relevance, and save the right people into Projects.',
                      capabilities: ['AI evaluation', 'Profile evidence', 'Save to Project'],
                    },
                    {
                      phase: 'Engage',
                      title: 'Start the conversation',
                      body: 'Add candidates or leads to Campaigns and manage personalized outreach and follow-ups.',
                      capabilities: ['Campaigns', 'Personalization', 'Follow-ups'],
                    },
                    {
                      phase: 'Manage',
                      title: 'Track every person to an outcome',
                      body: 'Move people through pipeline stages, record activity, assign next actions, and maintain team visibility.',
                      capabilities: ['Pipeline stages', 'Activities', 'Next actions'],
                    },
                  ].map((stage, index, stages) => (
                    <div
                      key={stage.phase}
                      style={{
                        borderLeft: index > 0 ? '1px solid rgba(10, 10, 10, 0.1)' : 0,
                        backgroundColor: index === stages.length - 1 ? 'rgba(36, 89, 211, 0.055)' : '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '390px',
                        padding: '36px clamp(24px, 3vw, 36px)',
                        position: 'relative',
                      }}
                    >
                      <p
                        style={{
                          ...fontStyle,
                          color: index === stages.length - 1 ? '#2459d3' : 'rgba(10, 10, 10, 0.48)',
                          fontSize: '12px',
                          fontWeight: 500,
                          letterSpacing: '0.09em',
                          lineHeight: '18px',
                          margin: '0 0 44px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {String(index + 1).padStart(2, '0')} — {stage.phase}
                      </p>
                      <h3
                        style={{
                          ...fontStyle,
                          color: index === stages.length - 1 ? '#2459d3' : textColor.strong,
                          fontSize: 'clamp(22px, 2.2vw, 30px)',
                          fontWeight: 500,
                          lineHeight: 1.15,
                          margin: '0 0 18px',
                        }}
                      >
                        {stage.title}
                      </h3>
                      <p
                        style={{
                          ...fontStyle,
                          color: 'rgba(10, 10, 10, 0.58)',
                          fontSize: '14px',
                          fontWeight: 300,
                          lineHeight: 1.6,
                          margin: '0 0 32px',
                        }}
                      >
                        {stage.body}
                      </p>
                      <div
                        style={{
                          borderTop: '1px solid rgba(10, 10, 10, 0.1)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          marginTop: 'auto',
                          paddingTop: '20px',
                        }}
                      >
                        {stage.capabilities.map((capability) => (
                          <span
                            key={capability}
                            style={{
                              ...fontStyle,
                              color: index === stages.length - 1 ? 'rgba(36, 89, 211, 0.78)' : 'rgba(10, 10, 10, 0.5)',
                              fontSize: '12px',
                              fontWeight: 400,
                              lineHeight: '18px',
                            }}
                          >
                            {capability}
                          </span>
                        ))}
                      </div>
                      {index < stages.length - 1 && (
                        <span
                          aria-hidden="true"
                          style={{
                            alignItems: 'center',
                            backgroundColor: '#FFFFFF',
                            color: 'rgba(10, 10, 10, 0.38)',
                            display: 'flex',
                            fontSize: '20px',
                            height: '32px',
                            justifyContent: 'center',
                            position: 'absolute',
                            right: '-16px',
                            top: '29px',
                            width: '32px',
                            zIndex: 1,
                          }}
                        >
                          →
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <p
                style={{
                  ...fontStyle,
                  color: 'rgba(10, 10, 10, 0.58)',
                  fontSize: 'clamp(17px, 1.8vw, 22px)',
                  fontWeight: 300,
                  lineHeight: 1.55,
                  margin: 'clamp(36px, 5vw, 52px) auto 0',
                  maxWidth: '780px',
                  textAlign: 'center',
                }}
              >
                Search results become prioritized people, active conversations, and finally managed outcomes.
              </p>
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>

      <section
        hidden
        className="w-screen"
        data-case-nav-label="The Challenge"
        style={{
          backgroundColor: '#FAFAFA',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          padding: 'clamp(80px, 10vw, 144px) clamp(24px, 6vw, 96px)',
        }}
      >
        <ScrollAnimatedSection>
          <div style={{ margin: '0 auto', maxWidth: '1400px' }}>
            <p
              style={{
                ...fontStyle,
                color: '#2459d3',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.1em',
                lineHeight: '18px',
                margin: '0 0 16px',
                textTransform: 'uppercase',
              }}
            >
              01 — The challenge
            </p>
            <h1
              style={{
                ...headingLevel1Style,
                fontSize: 'clamp(44px, 5.5vw, 72px)',
                lineHeight: 1.06,
                marginBottom: '28px',
                maxWidth: '1100px',
              }}
            >
              Finding people was not the real problem
            </h1>
            <p
              style={{
                ...fontStyle,
                color: 'rgba(10, 10, 10, 0.66)',
                fontSize: 'clamp(18px, 1.8vw, 23px)',
                fontWeight: 300,
                lineHeight: 1.55,
                margin: '0 0 24px',
                maxWidth: '920px',
              }}
            >
              Recruiters and sales teams used LinkedIn to discover potential candidates and contacts, but the work did not stay there. They moved between sourcing tools, enrichment platforms, and spreadsheets to collect information, compare profiles, and organize the people worth pursuing.
            </p>

            <div
              className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_auto]"
              style={{ alignItems: 'end', marginBottom: 'clamp(64px, 8vw, 96px)' }}
            >
              <p
                style={{
                  ...fontStyle,
                  color: 'rgba(10, 10, 10, 0.58)',
                  fontSize: '17px',
                  fontWeight: 300,
                  lineHeight: 1.65,
                  margin: 0,
                  maxWidth: '780px',
                }}
              >
                A single search could involve around 500 profiles, turning evaluation into a repetitive and fragmented process.
              </p>
              <div style={{ minWidth: '260px', textAlign: 'left' }}>
                <p
                  style={{
                    ...fontStyle,
                    color: '#2459d3',
                    fontSize: 'clamp(96px, 12vw, 148px)',
                    fontVariantNumeric: 'tabular-nums',
                    fontWeight: 300,
                    letterSpacing: '-0.07em',
                    lineHeight: 0.78,
                    margin: '0 0 24px',
                  }}
                >
                  ~500
                </p>
                <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.54)', fontSize: '13px', fontWeight: 500, lineHeight: '18px', margin: 0, textTransform: 'uppercase' }}>
                  profiles in one search
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.14)', borderTop: '1px solid rgba(10, 10, 10, 0.14)' }}>
              {[
                {
                  label: 'Recruiting workflow',
                  steps: [
                    {
                      title: 'Find candidates',
                      body: 'Search across LinkedIn and LinkedIn Recruiter to identify potentially relevant profiles.',
                      tools: 'LinkedIn · Recruiter',
                    },
                    {
                      title: 'Collect information',
                      body: 'Open profiles individually and gather the experience, skills, and background needed for evaluation.',
                      tools: 'Profile review · Separate tools',
                    },
                    {
                      title: 'Organize profiles',
                      body: 'Move selected candidates into spreadsheets or other tools to create a working shortlist.',
                      tools: 'Spreadsheets · Working lists',
                    },
                    {
                      title: 'Compare and decide',
                      body: 'Review candidates across disconnected sources before deciding who should move forward.',
                      tools: 'Manual comparison · Team judgment',
                    },
                  ],
                },
                {
                  label: 'Sales workflow',
                  steps: [
                    {
                      title: 'Find contacts',
                      body: 'Use LinkedIn and Sales Navigator to identify relevant prospects and decision-makers.',
                      tools: 'LinkedIn · Sales Navigator',
                    },
                    {
                      title: 'Enrich information',
                      body: 'Gather additional role, company, and contact information through separate tools.',
                      tools: 'Profile data · Enrichment tools',
                    },
                    {
                      title: 'Organize leads',
                      body: 'Transfer promising contacts into spreadsheets or working lists for further review.',
                      tools: 'Spreadsheets · Working lists',
                    },
                    {
                      title: 'Compare and prioritize',
                      body: 'Assess which contacts best matched the target profile before taking the next step.',
                      tools: 'Manual comparison · Target criteria',
                    },
                  ],
                },
              ].map((workflow, workflowIndex) => (
                <article
                  key={workflow.label}
                  className={workflowIndex > 0 ? 'border-t border-black/15 md:border-l md:border-t-0' : ''}
                  style={{ padding: 'clamp(36px, 5vw, 60px)' }}
                >
                  <p style={{ ...fontStyle, color: '#2459d3', fontSize: '11px', fontWeight: 500, letterSpacing: '0.09em', lineHeight: '17px', margin: '0 0 42px', textTransform: 'uppercase' }}>
                    {workflow.label}
                  </p>
                  <div>
                    {workflow.steps.map((step, index) => (
                      <div
                        key={step.title}
                        style={{
                          borderTop: index > 0 ? '1px dashed rgba(10, 10, 10, 0.18)' : 0,
                          padding: index > 0 ? '28px 0 0' : 0,
                          marginTop: index > 0 ? '28px' : 0,
                          position: 'relative',
                        }}
                      >
                        <div className="grid grid-cols-[36px_1fr] gap-4">
                          <span style={{ ...fontStyle, color: 'rgba(36, 89, 211, 0.62)', fontSize: '11px', fontVariantNumeric: 'tabular-nums', lineHeight: '18px' }}>
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div>
                            <h2 style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(20px, 2vw, 27px)', fontWeight: 500, lineHeight: 1.2, margin: '0 0 10px' }}>
                              {step.title}
                            </h2>
                            <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.56)', fontSize: '14px', fontWeight: 300, lineHeight: 1.6, margin: '0 0 12px' }}>
                              {step.body}
                            </p>
                            <span style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.36)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.04em', lineHeight: '16px', textTransform: 'uppercase' }}>
                              {step.tools}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div style={{ marginTop: 'clamp(72px, 9vw, 112px)' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 24px', textTransform: 'uppercase' }}>
                Shared friction
              </p>
              <div style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.14)', borderTop: '1px solid rgba(10, 10, 10, 0.14)', overflowX: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(210px, 1fr))', minWidth: '840px' }}>
                  {[
                    { title: 'Repetitive profile review', body: 'Users repeatedly opened and checked profiles one by one.' },
                    { title: 'Fragmented information', body: 'Profile data, evaluation context, and working lists lived in different tools.' },
                    { title: 'Manual organization', body: 'Relevant people had to be copied, grouped, and maintained outside LinkedIn.' },
                    { title: 'Difficult prioritization', body: 'Without one workspace, comparing and ranking people required additional manual effort.' },
                  ].map((friction, index) => (
                    <article key={friction.title} style={{ borderLeft: index > 0 ? '1px solid rgba(10, 10, 10, 0.1)' : 0, minHeight: '230px', padding: '34px 28px' }}>
                      <p style={{ ...fontStyle, color: 'rgba(36, 89, 211, 0.62)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.08em', margin: '0 0 30px', textTransform: 'uppercase' }}>
                        {String(index + 1).padStart(2, '0')}
                      </p>
                      <h3 style={{ ...fontStyle, color: textColor.strong, fontSize: '20px', fontWeight: 500, lineHeight: 1.2, margin: '0 0 14px' }}>{friction.title}</h3>
                      <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.52)', fontSize: '13px', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>{friction.body}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(10, 10, 10, 0.14)', marginTop: 'clamp(80px, 10vw, 120px)', paddingTop: 'clamp(52px, 7vw, 80px)' }}>
              <p style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(34px, 4.2vw, 52px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.12, margin: '0 0 24px', maxWidth: '1120px' }}>
                The challenge was not access to people. It was turning hundreds of scattered profiles into a{' '}
                <span style={{ color: '#2459d3' }}>clear, prioritized decision.</span>
              </p>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.5)', fontSize: '16px', fontWeight: 300, lineHeight: 1.6, margin: 0, maxWidth: '900px' }}>
                Recruiters searched for candidates and sales teams searched for contacts, but both faced the same fragmented workflow.
              </p>
            </div>

            <div
              hidden
              className="grid grid-cols-1 md:grid-cols-[minmax(220px,4fr)_minmax(0,8fr)]"
              style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.14)', borderTop: '1px solid rgba(10, 10, 10, 0.14)' }}
            >
              <div
                className="border-b border-black/15 md:border-b-0 md:border-r"
                style={{ padding: 'clamp(36px, 5vw, 64px) clamp(24px, 4vw, 48px) clamp(40px, 6vw, 72px) 0' }}
              >
                <p
                  style={{
                    ...fontStyle,
                    color: '#2459d3',
                    fontSize: 'clamp(104px, 13vw, 156px)',
                    fontVariantNumeric: 'tabular-nums',
                    fontWeight: 300,
                    letterSpacing: '-0.07em',
                    lineHeight: 0.85,
                    margin: '0 0 28px',
                  }}
                >
                  ~500
                </p>
                <p
                  style={{
                    ...fontStyle,
                    color: textColor.strong,
                    fontSize: 'clamp(20px, 2vw, 28px)',
                    fontWeight: 500,
                    lineHeight: 1.2,
                    margin: '0 0 24px',
                    maxWidth: '260px',
                  }}
                >
                  profiles in a single search
                </p>
                <p
                  style={{
                    ...fontStyle,
                    color: 'rgba(10, 10, 10, 0.54)',
                    fontSize: '14px',
                    fontWeight: 300,
                    lineHeight: 1.65,
                    margin: 0,
                    maxWidth: '320px',
                  }}
                >
                  Every result still required manual review before users could decide whether the person matched a role or target customer profile.
                </p>
              </div>

              <div style={{ padding: 'clamp(36px, 5vw, 64px) 0 clamp(40px, 6vw, 72px) clamp(24px, 5vw, 64px)' }}>
                <h2
                  style={{
                    ...fontStyle,
                    color: textColor.strong,
                    fontSize: 'clamp(24px, 2.5vw, 34px)',
                    fontWeight: 500,
                    lineHeight: 1.2,
                    margin: '0 0 clamp(40px, 5vw, 56px)',
                  }}
                >
                  Every search triggered the same manual loop
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  {[
                    {
                      eyebrow: '01 — Review',
                      title: 'Open profiles one by one',
                      body: 'Users inspected experience, skills, roles, and company context across multiple profiles.',
                    },
                    {
                      eyebrow: '02 — Qualify',
                      title: 'Compare fit from memory',
                      body: 'They compared each person against job requirements or target customer criteria without a consistent evaluation framework.',
                    },
                    {
                      eyebrow: '03 — Organize',
                      title: 'Move matches into another tool',
                      body: 'Relevant profiles were copied into spreadsheets, ATS platforms, CRM tools, notes, or separate lists.',
                    },
                    {
                      eyebrow: '04 — Track',
                      title: 'Track progress manually',
                      body: 'After outreach, users still had to record replies, follow-ups, ownership, and the current stage of every candidate or lead.',
                    },
                  ].map((step, index) => (
                    <div
                      key={step.title}
                      className={
                        index === 0
                          ? ''
                          : index === 1
                            ? 'border-t border-black/15 pt-8 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0'
                            : index === 2
                              ? 'border-t border-black/15 pt-8 sm:mt-10'
                              : 'border-t border-black/15 pt-8 sm:mt-10 sm:border-l sm:pl-8'
                      }
                      style={{ paddingRight: index % 2 === 0 ? 'clamp(20px, 3vw, 36px)' : 0 }}
                    >
                      <p
                        style={{
                          ...fontStyle,
                          color: 'rgba(36, 89, 211, 0.7)',
                          fontSize: '12px',
                          fontWeight: 500,
                          letterSpacing: '0.08em',
                          lineHeight: '18px',
                          margin: '0 0 20px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {step.eyebrow}
                      </p>
                      <h3
                        style={{
                          ...fontStyle,
                          color: textColor.strong,
                          fontSize: 'clamp(20px, 2vw, 27px)',
                          fontWeight: 500,
                          lineHeight: 1.2,
                          margin: '0 0 18px',
                        }}
                      >
                        {step.title}
                      </h3>
                      <p
                        style={{
                          ...fontStyle,
                          color: 'rgba(10, 10, 10, 0.58)',
                          fontSize: '15px',
                          fontWeight: 300,
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
                        {step.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div hidden style={{ marginTop: 'clamp(80px, 10vw, 128px)' }}>
              <div style={{ marginBottom: 'clamp(44px, 6vw, 64px)', textAlign: 'center' }}>
                <p
                  style={{
                    ...fontStyle,
                    color: 'rgba(10, 10, 10, 0.44)',
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    lineHeight: '18px',
                    margin: '0 0 14px',
                    textTransform: 'uppercase',
                  }}
                >
                  A fragmented journey
                </p>
                <h2
                  style={{
                    ...fontStyle,
                    color: textColor.strong,
                    fontSize: 'clamp(30px, 3.5vw, 46px)',
                    fontWeight: 400,
                    lineHeight: 1.15,
                    margin: 0,
                  }}
                >
                  One person, four disconnected stages
                </h2>
              </div>

              <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
                <div
                  style={{
                    display: 'grid',
                    gap: '84px',
                    gridTemplateColumns: 'repeat(4, minmax(180px, 1fr))',
                    minWidth: '980px',
                  }}
                >
                  {[
                    {
                      phase: 'Discover',
                      title: 'Find potential people',
                      details: ['LinkedIn Search', 'Recruiter', 'Sales Navigator'],
                      breakLabel: 'Context lost',
                    },
                    {
                      phase: 'Qualify',
                      title: 'Decide who is relevant',
                      details: ['Manual profile review', 'Job requirements', 'Target customer criteria'],
                      breakLabel: 'Manual handoff',
                    },
                    {
                      phase: 'Engage',
                      title: 'Start and continue outreach',
                      details: ['Messages', 'Sequences', 'Follow-ups'],
                      breakLabel: 'Status becomes outdated',
                    },
                    {
                      phase: 'Manage',
                      title: 'Track progress toward an outcome',
                      details: ['Current stage', 'Next action', 'Final outcome'],
                      breakLabel: null,
                    },
                  ].map((stage) => (
                    <div
                      key={stage.phase}
                      style={{
                        borderTop: '1px solid rgba(10, 10, 10, 0.16)',
                        minHeight: '250px',
                        paddingTop: '30px',
                        position: 'relative',
                      }}
                    >
                      <p
                        style={{
                          ...fontStyle,
                          color: '#2459d3',
                          fontSize: '12px',
                          fontWeight: 500,
                          letterSpacing: '0.09em',
                          lineHeight: '18px',
                          margin: '0 0 30px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {stage.phase}
                      </p>
                      <h3
                        style={{
                          ...fontStyle,
                          color: textColor.strong,
                          fontSize: 'clamp(20px, 2vw, 27px)',
                          fontWeight: 500,
                          lineHeight: 1.2,
                          margin: '0 0 24px',
                        }}
                      >
                        {stage.title}
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {stage.details.map((detail) => (
                          <span
                            key={detail}
                            style={{
                              ...fontStyle,
                              color: 'rgba(10, 10, 10, 0.5)',
                              fontSize: '13px',
                              fontWeight: 300,
                              lineHeight: '20px',
                            }}
                          >
                            {detail}
                          </span>
                        ))}
                      </div>
                      {stage.breakLabel && (
                        <div
                          aria-hidden="true"
                          style={{
                            alignItems: 'center',
                            display: 'flex',
                            height: '42px',
                            justifyContent: 'center',
                            left: '100%',
                            position: 'absolute',
                            top: '-21px',
                            width: '84px',
                          }}
                        >
                          <span
                            style={{
                              borderTop: '1px dashed rgba(10, 10, 10, 0.32)',
                              left: 0,
                              position: 'absolute',
                              right: 0,
                              top: '20px',
                            }}
                          />
                          <span
                            style={{
                              ...fontStyle,
                              backgroundColor: '#FAFAFA',
                              color: 'rgba(10, 10, 10, 0.42)',
                              fontSize: '9px',
                              fontWeight: 500,
                              letterSpacing: '0.04em',
                              lineHeight: '14px',
                              padding: '0 6px',
                              position: 'relative',
                              textAlign: 'center',
                              textTransform: 'uppercase',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {stage.breakLabel}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              style={{
                borderTop: '1px solid rgba(10, 10, 10, 0.14)',
                marginTop: 'clamp(80px, 10vw, 120px)',
                maxWidth: '1100px',
                paddingTop: 'clamp(52px, 7vw, 80px)',
              }}
            >
              <p
                style={{
                  ...fontStyle,
                  color: textColor.strong,
                  fontSize: 'clamp(34px, 4.2vw, 54px)',
                  fontWeight: 400,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.12,
                  margin: '0 0 24px',
                }}
              >
                How could one product support two different sourcing contexts{' '}
                <span style={{ color: '#2459d3' }}>without creating two separate workflows?</span>
              </p>
              <p
                style={{
                  ...fontStyle,
                  color: 'rgba(10, 10, 10, 0.5)',
                  fontSize: '16px',
                  fontWeight: 300,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                LinkedIn gave users access to people, but no connected way to collect, evaluate, prioritize, and manage them.
              </p>
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>

      <section
        hidden
        className="w-screen"
        data-case-nav-label="Understanding the Shared Workflow"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          padding: 'clamp(88px, 11vw, 152px) clamp(24px, 6vw, 96px)',
        }}
      >
        <ScrollAnimatedSection>
          <div style={{ margin: '0 auto', maxWidth: '1400px' }}>
            <p
              style={{
                ...fontStyle,
                color: '#2459d3',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.1em',
                lineHeight: '18px',
                margin: '0 0 16px',
                textTransform: 'uppercase',
              }}
            >
              03 — Understanding the shared workflow
            </p>
            <h1
              style={{
                ...headingLevel1Style,
                fontSize: 'clamp(44px, 5.5vw, 68px)',
                lineHeight: 1.06,
                marginBottom: '28px',
                maxWidth: '980px',
              }}
            >
              Different goals, the same underlying task
            </h1>
            <p
              style={{
                ...fontStyle,
                color: 'rgba(10, 10, 10, 0.64)',
                fontSize: 'clamp(18px, 1.8vw, 22px)',
                fontWeight: 300,
                lineHeight: 1.6,
                margin: '0 0 clamp(64px, 8vw, 96px)',
                maxWidth: '960px',
              }}
            >
              Recruiters searched for candidates, while sales professionals searched for contacts. Their terminology and evaluation criteria differed, but workflow mapping revealed that both groups followed a similar process for turning LinkedIn profiles into people worth pursuing.
            </p>

            <div
              style={{
                borderBottom: '1px solid rgba(10, 10, 10, 0.14)',
                borderTop: '1px solid rgba(10, 10, 10, 0.14)',
                overflowX: 'auto',
              }}
            >
              <div style={{ minWidth: '1080px' }}>
                {[
                  {
                    audience: 'Recruiting',
                    stages: [
                      {
                        phase: 'Discover',
                        title: 'Find potential candidates',
                        body: 'Search LinkedIn or LinkedIn Recruiter using role, experience, skills, and location filters.',
                        context: 'LinkedIn · Recruiter',
                      },
                      {
                        phase: 'Collect',
                        title: 'Save relevant profiles',
                        body: 'Gather promising candidates and organize them around a specific role or client requirement.',
                        context: 'Role · Client context',
                      },
                      {
                        phase: 'Evaluate',
                        title: 'Assess candidate fit',
                        body: 'Compare each profile against the experience, skills, and background required for the opportunity.',
                        context: 'Hiring criteria',
                      },
                      {
                        phase: 'Prioritize',
                        title: 'Decide who to review first',
                        body: 'Create a focused list of candidates who appear most relevant and worth progressing.',
                        context: 'Focused shortlist',
                      },
                    ],
                  },
                  {
                    audience: 'Sales',
                    stages: [
                      {
                        phase: 'Discover',
                        title: 'Find potential contacts',
                        body: 'Search LinkedIn or Sales Navigator using role, company, industry, and location filters.',
                        context: 'LinkedIn · Sales Navigator',
                      },
                      {
                        phase: 'Collect',
                        title: 'Save relevant profiles',
                        body: 'Gather promising contacts and organize them around a specific prospecting goal.',
                        context: 'Prospecting context',
                      },
                      {
                        phase: 'Evaluate',
                        title: 'Assess contact relevance',
                        body: 'Compare each profile against the target role, company, or ideal customer criteria.',
                        context: 'ICP criteria',
                      },
                      {
                        phase: 'Prioritize',
                        title: 'Decide who to pursue first',
                        body: 'Create a focused list of contacts who appear most relevant and worth approaching.',
                        context: 'Focused contact list',
                      },
                    ],
                  },
                ].map((workflow, workflowIndex) => (
                  <div
                    key={workflow.audience}
                    style={{
                      borderTop: workflowIndex > 0 ? '1px solid rgba(10, 10, 10, 0.14)' : 0,
                      display: 'grid',
                      gridTemplateColumns: '150px repeat(4, minmax(220px, 1fr))',
                    }}
                  >
                    <div
                      style={{
                        alignItems: 'flex-start',
                        backgroundColor: workflowIndex === 0 ? 'rgba(36, 89, 211, 0.055)' : '#FAFAFA',
                        display: 'flex',
                        padding: '42px 28px',
                      }}
                    >
                      <p style={{ ...fontStyle, color: workflowIndex === 0 ? '#2459d3' : 'rgba(10, 10, 10, 0.54)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.09em', lineHeight: '18px', margin: 0, textTransform: 'uppercase' }}>
                        {workflow.audience}
                      </p>
                    </div>
                    {workflow.stages.map((stage, index) => (
                      <article
                        key={stage.phase}
                        style={{
                          borderLeft: '1px solid rgba(10, 10, 10, 0.1)',
                          minHeight: '330px',
                          padding: '42px 28px',
                        }}
                      >
                        <p style={{ ...fontStyle, color: 'rgba(36, 89, 211, 0.7)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.08em', lineHeight: '16px', margin: '0 0 36px', textTransform: 'uppercase' }}>
                          {String(index + 1).padStart(2, '0')} — {stage.phase}
                        </p>
                        <h2 style={{ ...fontStyle, color: stage.phase === 'Prioritize' ? '#2459d3' : textColor.strong, fontSize: '22px', fontWeight: 500, lineHeight: 1.2, margin: '0 0 16px' }}>
                          {stage.title}
                        </h2>
                        <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.54)', fontSize: '13px', fontWeight: 300, lineHeight: 1.6, margin: '0 0 24px' }}>
                          {stage.body}
                        </p>
                        <p style={{ ...fontStyle, borderTop: '1px solid rgba(10, 10, 10, 0.08)', color: 'rgba(10, 10, 10, 0.36)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.05em', lineHeight: '15px', margin: 0, paddingTop: '14px', textTransform: 'uppercase' }}>
                          {stage.context}
                        </p>
                      </article>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'clamp(80px, 10vw, 120px)' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 24px', textTransform: 'uppercase' }}>
                The shared workflow
              </p>
              <div style={{ overflowX: 'auto' }}>
                <div
                  style={{
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(10, 10, 10, 0.14)',
                    borderTop: '1px solid rgba(10, 10, 10, 0.14)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, minmax(180px, 1fr))',
                    minWidth: '720px',
                    padding: '30px 0',
                  }}
                >
                  {['Discover', 'Collect', 'Evaluate', 'Prioritize'].map((stage, index, stages) => (
                    <div key={stage} style={{ alignItems: 'center', display: 'flex', padding: '0 24px' }}>
                      <span style={{ ...fontStyle, color: '#2459d3', fontSize: 'clamp(18px, 2vw, 25px)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        {stage}
                      </span>
                      {index < stages.length - 1 && <span aria-hidden="true" style={{ color: 'rgba(36, 89, 211, 0.42)', marginLeft: 'auto' }}>→</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2" style={{ marginTop: '32px' }}>
                <h2 style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(28px, 3.4vw, 44px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.15, margin: 0 }}>
                  Different criteria, one common structure
                </h2>
                <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.56)', fontSize: '15px', fontWeight: 300, lineHeight: 1.65, margin: 0 }}>
                  Recruiters evaluated candidates against hiring requirements. Sales teams evaluated contacts against prospecting criteria. In both cases, users needed to identify relevant people, preserve their context, compare them consistently, and decide who deserved attention first.
                </p>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(36, 89, 211, 0.055)',
                borderBottom: '1px solid rgba(36, 89, 211, 0.14)',
                borderTop: '1px solid rgba(36, 89, 211, 0.14)',
                marginTop: 'clamp(80px, 10vw, 120px)',
                padding: 'clamp(44px, 7vw, 72px)',
              }}
            >
              <p style={{ ...fontStyle, color: '#2459d3', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 22px', textTransform: 'uppercase' }}>
                Key insight
              </p>
              <p style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(32px, 4.1vw, 52px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.14, margin: '0 0 24px', maxWidth: '1120px' }}>
                The product did not need two separate workflows. It needed one flexible structure that could adapt to{' '}
                <span style={{ color: '#2459d3' }}>different goals and evaluation criteria.</span>
              </p>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.52)', fontSize: '16px', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>
                This insight led to Project becoming the shared container for profiles, context, and evaluation.
              </p>
            </div>

            <div
              hidden
              style={{
                backgroundColor: 'rgba(36, 89, 211, 0.055)',
                borderBottom: '1px solid rgba(36, 89, 211, 0.14)',
                borderTop: '1px solid rgba(36, 89, 211, 0.14)',
                padding: 'clamp(48px, 7vw, 76px) clamp(28px, 6vw, 80px)',
              }}
            >
              <p
                style={{
                  ...fontStyle,
                  color: '#2459d3',
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  lineHeight: '18px',
                  margin: '0 0 24px',
                  textTransform: 'uppercase',
                }}
              >
                How might we
              </p>
              <p
                style={{
                  ...fontStyle,
                  color: textColor.strong,
                  fontSize: 'clamp(32px, 4.1vw, 52px)',
                  fontWeight: 400,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.14,
                  margin: '0 0 26px',
                  maxWidth: '1160px',
                }}
              >
                How might we help users find the strongest matches first—and manage every person from discovery to outcome?
              </p>
              <p
                style={{
                  ...fontStyle,
                  color: 'rgba(10, 10, 10, 0.54)',
                  fontSize: '16px',
                  fontWeight: 300,
                  lineHeight: 1.6,
                  margin: 0,
                  maxWidth: '850px',
                }}
              >
                This required connecting search relevance, evaluation context, outreach activity, and pipeline status in one workflow.
              </p>
            </div>

            <div hidden style={{ marginTop: 'clamp(72px, 9vw, 112px)' }}>
              <p
                style={{
                  ...fontStyle,
                  color: 'rgba(10, 10, 10, 0.44)',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  lineHeight: '18px',
                  margin: '0 0 20px',
                  textTransform: 'uppercase',
                }}
              >
                Four design constraints
              </p>
              <div
                className="grid grid-cols-1 md:grid-cols-2"
                style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.14)', borderTop: '1px solid rgba(10, 10, 10, 0.14)' }}
              >
                {[
                  {
                    eyebrow: '01 — Enhance, not replace',
                    title: 'Fit into the existing LinkedIn workflow',
                    body: 'Users already relied on LinkedIn, Sales Navigator, or LinkedIn Recruiter to search for people. The experience needed to improve the workflow they understood rather than require them to rebuild searches in another tool.',
                    keywords: ['Familiar workflow', 'Lower adoption cost', 'In-context actions'],
                  },
                  {
                    eyebrow: '02 — Contextual relevance',
                    title: 'Define fit around the user’s goal',
                    body: 'A profile was not universally relevant. Fit depended on the role, client brief, target account, or outreach objective behind each search.',
                    keywords: ['Project context', 'Editable criteria', 'Goal-based ranking'],
                  },
                  {
                    eyebrow: '03 — Continuous context',
                    title: 'Keep decisions connected from search to pipeline',
                    body: 'Saving a profile was not enough. Users needed to retain why the person was relevant, how they were evaluated, whether they had been contacted, and what should happen next.',
                    keywords: ['Shared context', 'Activity history', 'Next action'],
                  },
                  {
                    eyebrow: '04 — Human control',
                    title: 'Make AI useful without turning it into a black box',
                    body: 'AI could reduce the time required to review profiles, but users still needed to understand the criteria, inspect the evidence, and adjust the final judgment.',
                    keywords: ['Explainable scoring', 'Editable criteria', 'Human judgment'],
                  },
                ].map((constraint, index) => (
                  <article
                    key={constraint.title}
                    className={
                      index === 0
                        ? ''
                        : index === 1
                          ? 'border-t border-black/15 md:border-l md:border-t-0'
                          : index === 2
                            ? 'border-t border-black/15'
                            : 'border-t border-black/15 md:border-l'
                    }
                    style={{ display: 'flex', flexDirection: 'column', minHeight: '360px', padding: 'clamp(32px, 5vw, 56px)' }}
                  >
                    <p
                      style={{
                        ...fontStyle,
                        color: 'rgba(36, 89, 211, 0.72)',
                        fontSize: '12px',
                        fontWeight: 500,
                        letterSpacing: '0.08em',
                        lineHeight: '18px',
                        margin: '0 0 42px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {constraint.eyebrow}
                    </p>
                    <h2
                      style={{
                        ...fontStyle,
                        color: textColor.strong,
                        fontSize: 'clamp(24px, 2.5vw, 32px)',
                        fontWeight: 500,
                        lineHeight: 1.18,
                        margin: '0 0 20px',
                        maxWidth: '520px',
                      }}
                    >
                      {constraint.title}
                    </h2>
                    <p
                      style={{
                        ...fontStyle,
                        color: 'rgba(10, 10, 10, 0.6)',
                        fontSize: '16px',
                        fontWeight: 300,
                        lineHeight: 1.65,
                        margin: '0 0 36px',
                        maxWidth: '580px',
                      }}
                    >
                      {constraint.body}
                    </p>
                    <p
                      style={{
                        ...fontStyle,
                        borderTop: '1px solid rgba(10, 10, 10, 0.1)',
                        color: 'rgba(10, 10, 10, 0.44)',
                        fontSize: '11px',
                        fontWeight: 500,
                        letterSpacing: '0.04em',
                        lineHeight: 1.7,
                        margin: 'auto 0 0',
                        paddingTop: '20px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {constraint.keywords.join(' · ')}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div hidden style={{ marginTop: 'clamp(88px, 11vw, 136px)' }}>
              <p
                style={{
                  ...fontStyle,
                  color: '#2459d3',
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  lineHeight: '18px',
                  margin: '0 0 16px',
                  textTransform: 'uppercase',
                }}
              >
                The product framework
              </p>
              <h2
                style={{
                  ...fontStyle,
                  color: textColor.strong,
                  fontSize: 'clamp(34px, 4.4vw, 56px)',
                  fontWeight: 400,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.1,
                  margin: '0 0 clamp(48px, 6vw, 72px)',
                }}
              >
                One workflow from search to outcome
              </h2>
              <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, minmax(220px, 1fr)) 120px',
                    minWidth: '1080px',
                  }}
                >
                  {[
                    {
                      phase: 'Source',
                      action: 'Find the right people',
                      body: 'AI re-ranks LinkedIn search results and brings the strongest matches to the top.',
                    },
                    {
                      phase: 'Qualify',
                      action: 'Understand who fits',
                      body: 'Users review criteria, supporting evidence, and save relevant people into Projects.',
                    },
                    {
                      phase: 'Engage',
                      action: 'Start and continue outreach',
                      body: 'Selected candidates or leads move into Campaigns for personalized messages and follow-ups.',
                    },
                    {
                      phase: 'Manage',
                      action: 'Track progress through the pipeline',
                      body: 'Teams record activities, ownership, current stage, next actions, and final outcomes.',
                    },
                  ].map((stage, index, stages) => (
                    <article
                      key={stage.phase}
                      style={{
                        borderTop: `2px solid ${index === stages.length - 1 ? '#2459d3' : 'rgba(36, 89, 211, 0.34)'}`,
                        minHeight: '300px',
                        padding: '32px clamp(24px, 3vw, 38px) 36px 0',
                        position: 'relative',
                      }}
                    >
                      <p
                        style={{
                          ...fontStyle,
                          color: index === stages.length - 1 ? '#2459d3' : 'rgba(36, 89, 211, 0.7)',
                          fontSize: '12px',
                          fontWeight: 500,
                          letterSpacing: '0.09em',
                          lineHeight: '18px',
                          margin: '0 0 34px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {stage.phase}
                      </p>
                      <h3
                        style={{
                          ...fontStyle,
                          color: index === stages.length - 1 ? '#2459d3' : textColor.strong,
                          fontSize: 'clamp(22px, 2.2vw, 29px)',
                          fontWeight: 500,
                          lineHeight: 1.18,
                          margin: '0 0 20px',
                          maxWidth: '240px',
                        }}
                      >
                        {stage.action}
                      </h3>
                      <p
                        style={{
                          ...fontStyle,
                          color: 'rgba(10, 10, 10, 0.55)',
                          fontSize: '14px',
                          fontWeight: 300,
                          lineHeight: 1.6,
                          margin: 0,
                          maxWidth: '250px',
                        }}
                      >
                        {stage.body}
                      </p>
                      <span
                        aria-hidden="true"
                        style={{
                          alignItems: 'center',
                          backgroundColor: '#FFFFFF',
                          color: index === stages.length - 1 ? '#2459d3' : 'rgba(36, 89, 211, 0.5)',
                          display: 'flex',
                          fontSize: '20px',
                          height: '32px',
                          justifyContent: 'center',
                          position: 'absolute',
                          right: '12px',
                          top: '-17px',
                          width: '32px',
                        }}
                      >
                        →
                      </span>
                    </article>
                  ))}
                  <div
                    style={{
                      alignItems: 'flex-start',
                      borderTop: '2px solid #2459d3',
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '32px 0 0 22px',
                    }}
                  >
                    <p
                      style={{
                        ...fontStyle,
                        color: '#2459d3',
                        fontSize: '12px',
                        fontWeight: 500,
                        letterSpacing: '0.09em',
                        lineHeight: '18px',
                        margin: '0 0 18px',
                        textTransform: 'uppercase',
                      }}
                    >
                      Outcome
                    </p>
                    <p
                      style={{
                        ...fontStyle,
                        color: 'rgba(10, 10, 10, 0.44)',
                        fontSize: '11px',
                        fontWeight: 300,
                        lineHeight: 1.7,
                        margin: 0,
                      }}
                    >
                      Hired<br />
                      Placed<br />
                      Converted<br />
                      Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>

      <section
        hidden
        className="w-screen"
        data-case-nav-label="The Pivotal Product Decision"
        style={{
          backgroundColor: '#FAFAFA',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          padding: 'clamp(88px, 11vw, 152px) clamp(24px, 6vw, 96px)',
        }}
      >
        <ScrollAnimatedSection>
          <div style={{ margin: '0 auto', maxWidth: '1400px' }}>
            <p
              style={{
                ...fontStyle,
                color: '#2459d3',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.1em',
                lineHeight: '18px',
                margin: '0 0 16px',
                textTransform: 'uppercase',
              }}
            >
              02 — The pivotal product decision
            </p>
            <h1
              style={{
                ...headingLevel1Style,
                fontSize: 'clamp(44px, 5.5vw, 68px)',
                lineHeight: 1.06,
                marginBottom: '28px',
                maxWidth: '1050px',
              }}
            >
              Introducing Project changed the product from a ranking tool into a reusable workspace
            </h1>
            <div style={{ marginBottom: 'clamp(72px, 9vw, 112px)', maxWidth: '960px' }}>
              <p
                style={{
                  ...fontStyle,
                  color: 'rgba(10, 10, 10, 0.64)',
                  fontSize: 'clamp(18px, 1.8vw, 22px)',
                  fontWeight: 300,
                  lineHeight: 1.6,
                  margin: '0 0 16px',
                }}
              >
                The original request was to collect LinkedIn profiles and produce an AI-ranked shortlist. I pushed back on this one-shot model because users managed multiple goals across multiple LinkedIn search sessions.
              </p>
              <p
                style={{
                  ...fontStyle,
                  color: 'rgba(10, 10, 10, 0.64)',
                  fontSize: 'clamp(18px, 1.8vw, 22px)',
                  fontWeight: 300,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                I introduced Project as a persistent container for each sourcing goal—creating the foundation for ranking, review, outreach, notes, and longer-term people management.
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(36, 89, 211, 0.055)',
                borderBottom: '1px solid rgba(36, 89, 211, 0.14)',
                borderTop: '1px solid rgba(36, 89, 211, 0.14)',
                padding: 'clamp(44px, 7vw, 72px)',
              }}
            >
              <p style={{ ...fontStyle, color: '#2459d3', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 22px', textTransform: 'uppercase' }}>
                Core insight
              </p>
              <h2 style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(32px, 4.1vw, 52px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.14, margin: '0 0 24px', maxWidth: '1080px' }}>
                A profile only became meaningful within a specific goal.
              </h2>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.56)', fontSize: '16px', fontWeight: 300, lineHeight: 1.65, margin: '0 0 32px', maxWidth: '960px' }}>
                The same person could be relevant to one hiring brief or prospecting task, but less relevant to another. Saving a profile alone could not explain why it mattered or how it should be evaluated.
              </p>
              <div className="grid grid-cols-1 gap-px bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  'Why was this person collected?',
                  'What requirements applied?',
                  'How did they compare with others?',
                  'Were they worth prioritizing?',
                ].map((question) => (
                  <p key={question} style={{ ...fontStyle, backgroundColor: 'rgba(255, 255, 255, 0.72)', color: 'rgba(10, 10, 10, 0.54)', fontSize: '12px', fontWeight: 400, lineHeight: 1.55, margin: 0, padding: '18px' }}>
                    {question}
                  </p>
                ))}
              </div>
              <p style={{ ...fontStyle, color: '#2459d3', fontSize: '14px', fontWeight: 500, lineHeight: 1.6, margin: '30px 0 0' }}>
                A Project preserved this context around every group of profiles.
              </p>
            </div>

            <div hidden style={{ marginTop: 'clamp(72px, 9vw, 112px)' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 24px', textTransform: 'uppercase' }}>
                Project connected three things
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3" style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.14)', borderTop: '1px solid rgba(10, 10, 10, 0.14)' }}>
                {[
                  {
                    name: 'Goal',
                    question: 'Why are we looking for people?',
                    body: 'A Project represented a specific hiring, client, or prospecting objective.',
                    examples: ['Senior Product Designer', 'Fintech engineering candidates', 'SaaS decision-makers in Germany'],
                  },
                  {
                    name: 'People',
                    question: 'Who has been collected for this goal?',
                    body: 'Profiles saved through the Chrome Extension were organized inside the relevant Project instead of becoming an isolated list of bookmarks.',
                    examples: ['Saved LinkedIn profiles', 'Shared Project context'],
                  },
                  {
                    name: 'Evaluation',
                    question: 'How should these people be compared?',
                    body: 'Each Project contained its own AI-generated and user-editable evaluation criteria, allowing people to be assessed against the same goal.',
                    examples: ['Project-specific criteria', 'Consistent ranking'],
                  },
                ].map((item, index) => (
                  <article key={item.name} className={index > 0 ? 'border-t border-black/15 md:border-l md:border-t-0' : ''} style={{ display: 'flex', flexDirection: 'column', minHeight: '390px', padding: 'clamp(32px, 5vw, 52px)' }}>
                    <p style={{ ...fontStyle, color: 'rgba(36, 89, 211, 0.72)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', lineHeight: '17px', margin: '0 0 42px', textTransform: 'uppercase' }}>
                      {String(index + 1).padStart(2, '0')} — {item.name}
                    </p>
                    <h2 style={{ ...fontStyle, color: index === 0 ? '#2459d3' : textColor.strong, fontSize: 'clamp(23px, 2.4vw, 31px)', fontWeight: 500, lineHeight: 1.18, margin: '0 0 20px' }}>
                      {item.question}
                    </h2>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.58)', fontSize: '15px', fontWeight: 300, lineHeight: 1.65, margin: '0 0 30px' }}>
                      {item.body}
                    </p>
                    <div style={{ borderTop: '1px solid rgba(10, 10, 10, 0.1)', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: 'auto', paddingTop: '18px' }}>
                      {item.examples.map((example) => (
                        <span key={example} style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.4)', fontSize: '11px', lineHeight: '17px' }}>{example}</span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div data-case-nav-label="Simplifying the Information Architecture" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid rgba(10, 10, 10, 0.12)', borderTop: '1px solid rgba(10, 10, 10, 0.12)', marginTop: 'clamp(80px, 10vw, 128px)', padding: 'clamp(40px, 6vw, 64px)' }}>
              <p style={{ ...fontStyle, color: '#2459d3', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 18px', textTransform: 'uppercase' }}>
                03 — Simplifying the information architecture
              </p>
              <h2 style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(30px, 3.8vw, 48px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.12, margin: '0 0 22px' }}>
                Reducing the experience from three layers to two
              </h2>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.54)', fontSize: '15px', fontWeight: 300, lineHeight: 1.65, margin: '0 0 clamp(40px, 6vw, 60px)', maxWidth: '900px' }}>
                The earlier structure separated the Project list, profile list, and profile detail into different levels. Users had to move back and forth while comparing people and reviewing evaluation results.
              </p>
              {[
                { label: 'Before', nodes: ['Project list', 'Profile list', 'Profile detail'], note: 'Three separate navigation layers' },
                { label: 'After', nodes: ['Project list', 'Project workspace'], note: 'People · Ranking · Evaluation · Profile detail' },
              ].map((model, rowIndex) => (
                <div key={model.label} className="grid grid-cols-1 gap-5 border-t border-black/15 py-7 md:grid-cols-[110px_1fr_310px]" style={{ alignItems: 'center' }}>
                  <p style={{ ...fontStyle, color: rowIndex === 1 ? '#2459d3' : 'rgba(10, 10, 10, 0.46)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', margin: 0, textTransform: 'uppercase' }}>{model.label}</p>
                  <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {model.nodes.map((node, index) => (
                      <span key={node} style={{ alignItems: 'center', display: 'inline-flex', gap: '10px' }}>
                        <span style={{ ...fontStyle, backgroundColor: rowIndex === 1 && index === 1 ? 'rgba(36, 89, 211, 0.08)' : '#FAFAFA', border: rowIndex === 1 && index === 1 ? '1px solid rgba(36, 89, 211, 0.25)' : '1px solid rgba(10, 10, 10, 0.12)', color: rowIndex === 1 && index === 1 ? '#2459d3' : 'rgba(10, 10, 10, 0.58)', fontSize: '12px', fontWeight: 500, lineHeight: '18px', padding: '10px 14px' }}>{node}</span>
                        {index < model.nodes.length - 1 && <span aria-hidden="true" style={{ color: 'rgba(10, 10, 10, 0.3)' }}>→</span>}
                      </span>
                    ))}
                  </div>
                  <p style={{ ...fontStyle, color: rowIndex === 1 ? '#2459d3' : 'rgba(10, 10, 10, 0.42)', fontSize: '11px', lineHeight: 1.5, margin: 0 }}>{model.note}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 'clamp(80px, 10vw, 128px)' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 24px', textTransform: 'uppercase' }}>
                Project workspace
              </p>
              <div style={{ border: '1px solid rgba(10, 10, 10, 0.12)', padding: 'clamp(16px, 3vw, 28px)' }}>
                <AIRankingViewMock fontStyle={fontStyle} />
              </div>
              <div className="grid grid-cols-1 gap-px bg-black/10 sm:grid-cols-3" style={{ marginTop: '18px' }}>
                {['Profiles organized by goal', 'Evaluation within the Project', 'Details without leaving the workspace'].map((annotation) => (
                  <p key={annotation} style={{ ...fontStyle, backgroundColor: '#FAFAFA', color: '#2459d3', fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', lineHeight: '18px', margin: 0, padding: '16px 18px', textAlign: 'center', textTransform: 'uppercase' }}>
                    {annotation}
                  </p>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'clamp(80px, 10vw, 120px)' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 24px', textTransform: 'uppercase' }}>
                One model for two use cases
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.14)', borderTop: '1px solid rgba(10, 10, 10, 0.14)' }}>
                {[
                  { title: 'Recruiting Project', body: 'Create Projects around roles or client briefs.', details: ['Role or client brief', 'Candidate criteria', 'Hiring context'] },
                  { title: 'Sales Project', body: 'Create Projects around target profiles or prospecting goals.', details: ['Target profile or sales goal', 'Contact criteria', 'Prospecting context'] },
                ].map((useCase, index) => (
                  <article key={useCase.title} className={index > 0 ? 'border-t border-black/15 md:border-l md:border-t-0' : ''} style={{ padding: 'clamp(36px, 5vw, 56px)' }}>
                    <h2 style={{ ...fontStyle, color: index === 0 ? '#2459d3' : textColor.strong, fontSize: 'clamp(24px, 2.6vw, 34px)', fontWeight: 500, lineHeight: 1.2, margin: '0 0 18px' }}>{useCase.title}</h2>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.56)', fontSize: '15px', fontWeight: 300, lineHeight: 1.6, margin: '0 0 26px' }}>{useCase.body}</p>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.4)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.04em', lineHeight: 1.8, margin: 0, textTransform: 'uppercase' }}>{useCase.details.join(' · ')}</p>
                  </article>
                ))}
              </div>
              <div style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.14)', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(190px, 1fr))', overflowX: 'auto' }}>
                {[
                  ['Context stayed attached', 'Profiles remained connected to the goal and criteria that explained why they were collected.'],
                  ['Comparison became easier', 'Users reviewed multiple people within one Project instead of switching between pages.'],
                  ['One model for both teams', 'Recruiting and sales reused the same core logic with different terminology and criteria.'],
                  ['The product could scale', 'New sourcing use cases could extend the shared structure consistently.'],
                ].map(([title, body], index) => (
                  <div key={title} style={{ borderLeft: index > 0 ? '1px solid rgba(10, 10, 10, 0.1)' : 0, minWidth: '190px', padding: '28px' }}>
                    <h3 style={{ ...fontStyle, color: textColor.strong, fontSize: '16px', fontWeight: 500, lineHeight: 1.25, margin: '0 0 12px' }}>{title}</h3>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.5)', fontSize: '12px', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>{body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(10, 10, 10, 0.14)', marginTop: 'clamp(80px, 10vw, 120px)', paddingTop: 'clamp(52px, 7vw, 80px)' }}>
              <p style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(34px, 4.2vw, 52px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.12, margin: '0 0 24px', maxWidth: '1120px' }}>
                Project became the bridge between collecting a profile and{' '}<span style={{ color: '#2459d3' }}>making a decision about it.</span>
              </p>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.5)', fontSize: '16px', fontWeight: 300, lineHeight: 1.6, margin: 0, maxWidth: '900px' }}>
                It gave every saved person a clear purpose, a shared evaluation framework, and a place within the wider sourcing workflow.
              </p>
            </div>

            <div hidden>
              <p
                style={{
                  ...fontStyle,
                  color: 'rgba(10, 10, 10, 0.42)',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  lineHeight: '18px',
                  margin: '0 0 20px',
                  textTransform: 'uppercase',
                }}
              >
                The shared object model
              </p>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_6fr_3fr]" style={{ alignItems: 'stretch' }}>
                <aside
                  style={{
                    border: '1px solid rgba(10, 10, 10, 0.12)',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '520px',
                    padding: 'clamp(28px, 3vw, 40px)',
                  }}
                >
                  <p
                    style={{
                      ...fontStyle,
                      color: 'rgba(10, 10, 10, 0.46)',
                      fontSize: '12px',
                      fontWeight: 500,
                      letterSpacing: '0.09em',
                      lineHeight: '18px',
                      margin: '0 0 40px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Search context
                  </p>
                  <h2
                    style={{
                      ...fontStyle,
                      color: textColor.strong,
                      fontSize: 'clamp(24px, 2.4vw, 32px)',
                      fontWeight: 500,
                      lineHeight: 1.18,
                      margin: '0 0 20px',
                    }}
                  >
                    The goal defined what “fit” meant.
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px' }}>
                    {['Job brief', 'Client requirement', 'Ideal customer profile', 'Search criteria'].map((item) => (
                      <span
                        key={item}
                        style={{
                          ...fontStyle,
                          borderTop: '1px solid rgba(10, 10, 10, 0.08)',
                          color: 'rgba(10, 10, 10, 0.54)',
                          fontSize: '13px',
                          fontWeight: 300,
                          lineHeight: '20px',
                          paddingTop: '10px',
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <p
                    style={{
                      ...fontStyle,
                      color: '#2459d3',
                      fontSize: '12px',
                      fontWeight: 500,
                      lineHeight: '18px',
                      margin: 'auto 0 0',
                      paddingTop: '36px',
                      textAlign: 'right',
                      textTransform: 'uppercase',
                    }}
                  >
                    Context flows into Project →
                  </p>
                </aside>

                <div
                  style={{
                    backgroundColor: 'rgba(36, 89, 211, 0.06)',
                    border: '1px solid rgba(36, 89, 211, 0.34)',
                    minHeight: '520px',
                    padding: 'clamp(28px, 4vw, 52px)',
                  }}
                >
                  <div style={{ marginBottom: 'clamp(40px, 5vw, 56px)' }}>
                    <p
                      style={{
                        ...fontStyle,
                        color: '#2459d3',
                        fontSize: '13px',
                        fontWeight: 500,
                        letterSpacing: '0.1em',
                        lineHeight: '18px',
                        margin: '0 0 14px',
                        textTransform: 'uppercase',
                      }}
                    >
                      Project
                    </p>
                    <p
                      style={{
                        ...fontStyle,
                        color: 'rgba(10, 10, 10, 0.6)',
                        fontSize: '15px',
                        fontWeight: 300,
                        lineHeight: 1.6,
                        margin: 0,
                        maxWidth: '620px',
                      }}
                    >
                      The shared workspace for evaluating and managing people around one goal.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                    {[
                      {
                        eyebrow: '01 — People',
                        title: 'A reusable person profile collected from LinkedIn.',
                        details: ['Profile', 'Experience', 'Company', 'Contact data', 'Notes'],
                      },
                      {
                        eyebrow: '02 — Evaluation',
                        title: 'A contextual judgment of how well this person matched the current Project.',
                        details: ['Fit score', 'Criteria', 'Evidence', 'AI reasoning', 'User edits'],
                      },
                      {
                        eyebrow: '03 — Pipeline',
                        title: 'The person’s current progress and next action within the Project.',
                        details: ['Current stage', 'Owner', 'Last activity', 'Next action', 'Outcome'],
                      },
                    ].map((object) => (
                      <div
                        key={object.eyebrow}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid rgba(36, 89, 211, 0.14)',
                          display: 'flex',
                          flexDirection: 'column',
                          minHeight: '300px',
                          padding: '24px',
                        }}
                      >
                        <p
                          style={{
                            ...fontStyle,
                            color: 'rgba(36, 89, 211, 0.72)',
                            fontSize: '11px',
                            fontWeight: 500,
                            letterSpacing: '0.07em',
                            lineHeight: '17px',
                            margin: '0 0 28px',
                            textTransform: 'uppercase',
                          }}
                        >
                          {object.eyebrow}
                        </p>
                        <h3
                          style={{
                            ...fontStyle,
                            color: textColor.strong,
                            fontSize: '18px',
                            fontWeight: 500,
                            lineHeight: 1.3,
                            margin: '0 0 26px',
                          }}
                        >
                          {object.title}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginTop: 'auto' }}>
                          {object.details.map((detail) => (
                            <span
                              key={detail}
                              style={{
                                ...fontStyle,
                                color: 'rgba(10, 10, 10, 0.48)',
                                fontSize: '12px',
                                fontWeight: 300,
                                lineHeight: '18px',
                              }}
                            >
                              {detail}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <aside style={{ display: 'grid', gap: '24px', gridTemplateRows: '1fr auto' }}>
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(10, 10, 10, 0.12)',
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: '360px',
                      padding: 'clamp(28px, 3vw, 40px)',
                    }}
                  >
                    <p
                      style={{
                        ...fontStyle,
                        color: '#2459d3',
                        fontSize: '12px',
                        fontWeight: 500,
                        letterSpacing: '0.09em',
                        lineHeight: '18px',
                        margin: '0 0 32px',
                        textTransform: 'uppercase',
                      }}
                    >
                      Campaign
                    </p>
                    <h2
                      style={{
                        ...fontStyle,
                        color: textColor.strong,
                        fontSize: 'clamp(22px, 2.2vw, 29px)',
                        fontWeight: 500,
                        lineHeight: 1.2,
                        margin: '0 0 26px',
                      }}
                    >
                      Organised how selected people were contacted.
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {['Message sequence', 'Personalisation', 'Schedule', 'Follow-up', 'Reply tracking'].map((item) => (
                        <span
                          key={item}
                          style={{
                            ...fontStyle,
                            color: 'rgba(10, 10, 10, 0.5)',
                            fontSize: '12px',
                            fontWeight: 300,
                            lineHeight: '18px',
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    <p
                      style={{
                        ...fontStyle,
                        borderTop: '1px dashed rgba(36, 89, 211, 0.3)',
                        color: '#2459d3',
                        fontSize: '11px',
                        fontWeight: 500,
                        lineHeight: 1.5,
                        margin: 'auto 0 0',
                        paddingTop: '18px',
                        textTransform: 'uppercase',
                      }}
                    >
                      ← Replies and follow-ups update Pipeline progress
                    </p>
                  </div>
                  <div
                    style={{
                      border: '1px solid rgba(36, 89, 211, 0.24)',
                      padding: '24px',
                    }}
                  >
                    <p
                      style={{
                        ...fontStyle,
                        color: '#2459d3',
                        fontSize: '11px',
                        fontWeight: 500,
                        letterSpacing: '0.08em',
                        lineHeight: '17px',
                        margin: '0 0 10px',
                        textTransform: 'uppercase',
                      }}
                    >
                      Outcome
                    </p>
                    <p
                      style={{
                        ...fontStyle,
                        color: 'rgba(10, 10, 10, 0.52)',
                        fontSize: '12px',
                        fontWeight: 300,
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      Hired · Placed · Converted · Closed · Not proceeding
                    </p>
                  </div>
                </aside>
              </div>
            </div>

            <div
              hidden
              style={{
                borderBottom: '1px solid rgba(36, 89, 211, 0.18)',
                borderTop: '1px solid rgba(36, 89, 211, 0.18)',
                marginTop: 'clamp(80px, 10vw, 128px)',
                padding: 'clamp(48px, 7vw, 80px) 0',
              }}
            >
              <p
                style={{
                  ...fontStyle,
                  color: textColor.strong,
                  fontSize: 'clamp(34px, 4.4vw, 54px)',
                  fontWeight: 400,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.12,
                  margin: 0,
                  maxWidth: '1120px',
                }}
              >
                Fit was not a fixed property of a person. It was a relationship between a person and a{' '}
                <span style={{ color: '#2459d3' }}>Project.</span>
              </p>
            </div>

            <div hidden style={{ marginTop: 'clamp(72px, 9vw, 112px)' }}>
              <p
                style={{
                  ...fontStyle,
                  color: 'rgba(10, 10, 10, 0.42)',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  lineHeight: '18px',
                  margin: '0 0 20px',
                  textTransform: 'uppercase',
                }}
              >
                Five connected objects
              </p>
              <div style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.14)', borderTop: '1px solid rgba(10, 10, 10, 0.14)', overflowX: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(230px, 1fr))', minWidth: '1150px' }}>
                  {[
                    {
                      name: 'Project',
                      title: 'Defines the goal',
                      body: 'Stores the role, client brief, target profile, evaluation criteria, team, and workflow context.',
                      principle: 'The same person could belong to multiple Projects for different reasons.',
                    },
                    {
                      name: 'Person',
                      title: 'Represents who is being managed',
                      body: 'Candidate and lead were different business labels for the same reusable person profile.',
                      principle: 'Profile data stayed consistent while business context changed by Project.',
                    },
                    {
                      name: 'Evaluation',
                      title: 'Explains why the person fits',
                      body: 'Connects a person with a specific Project through criteria, score, and supporting evidence.',
                      principle: 'Fit was a relationship between a person and a goal.',
                    },
                    {
                      name: 'Campaign',
                      title: 'Defines how outreach happens',
                      body: 'Turns selected people into personalised messaging, scheduled follow-ups, and trackable conversations.',
                      principle: 'Campaigns use Project and profile context instead of rebuilding the audience.',
                    },
                    {
                      name: 'Pipeline',
                      title: 'Records what happens next',
                      body: 'Captures current status, ownership, activities, next action, and final outcome.',
                      principle: 'Outreach was an activity within the journey—not the end of it.',
                    },
                  ].map((object, index) => (
                    <article
                      key={object.name}
                      style={{
                        borderLeft: index > 0 ? '1px solid rgba(10, 10, 10, 0.1)' : 0,
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '380px',
                        padding: '36px 28px',
                      }}
                    >
                      <p
                        style={{
                          ...fontStyle,
                          color: 'rgba(36, 89, 211, 0.72)',
                          fontSize: '11px',
                          fontWeight: 500,
                          letterSpacing: '0.08em',
                          lineHeight: '17px',
                          margin: '0 0 38px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {String(index + 1).padStart(2, '0')} — {object.name}
                      </p>
                      <h3
                        style={{
                          ...fontStyle,
                          color: textColor.strong,
                          fontSize: '22px',
                          fontWeight: 500,
                          lineHeight: 1.2,
                          margin: '0 0 18px',
                        }}
                      >
                        {object.title}
                      </h3>
                      <p
                        style={{
                          ...fontStyle,
                          color: 'rgba(10, 10, 10, 0.56)',
                          fontSize: '14px',
                          fontWeight: 300,
                          lineHeight: 1.6,
                          margin: '0 0 28px',
                        }}
                      >
                        {object.body}
                      </p>
                      <p
                        style={{
                          ...fontStyle,
                          borderTop: '1px solid rgba(10, 10, 10, 0.1)',
                          color: index === 2 ? '#2459d3' : 'rgba(10, 10, 10, 0.46)',
                          fontSize: '12px',
                          fontWeight: index === 2 ? 500 : 400,
                          lineHeight: 1.55,
                          margin: 'auto 0 0',
                          paddingTop: '18px',
                        }}
                      >
                        {object.principle}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div hidden style={{ marginTop: 'clamp(80px, 10vw, 120px)' }}>
              <p
                style={{
                  ...fontStyle,
                  color: 'rgba(10, 10, 10, 0.42)',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  lineHeight: '18px',
                  margin: '0 0 28px',
                  textTransform: 'uppercase',
                }}
              >
                One model, configurable stages
              </p>
              {[
                {
                  label: 'Recruiting pipeline',
                  stages: ['Sourced', 'Qualified', 'Contacted', 'Replied', 'Submitted', 'Interviewing', 'Placed'],
                },
                {
                  label: 'Sales pipeline',
                  stages: ['Identified', 'Qualified', 'Contacted', 'Replied', 'Meeting', 'Opportunity', 'Converted'],
                },
              ].map((pipeline) => (
                <div
                  key={pipeline.label}
                  className="grid grid-cols-1 gap-5 border-t border-black/15 py-7 lg:grid-cols-[190px_1fr]"
                >
                  <p
                    style={{
                      ...fontStyle,
                      color: textColor.strong,
                      fontSize: '14px',
                      fontWeight: 500,
                      lineHeight: '22px',
                      margin: 0,
                    }}
                  >
                    {pipeline.label}
                  </p>
                  <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {pipeline.stages.map((stage, index) => (
                      <span key={stage} style={{ alignItems: 'center', display: 'inline-flex', gap: '8px' }}>
                        <span
                          style={{
                            ...fontStyle,
                            border: '1px solid rgba(10, 10, 10, 0.12)',
                            borderRadius: '999px',
                            color: 'rgba(10, 10, 10, 0.58)',
                            fontSize: '11px',
                            fontWeight: 400,
                            lineHeight: '18px',
                            padding: '5px 10px',
                          }}
                        >
                          {stage}
                        </span>
                        {index < pipeline.stages.length - 1 && (
                          <span aria-hidden="true" style={{ color: 'rgba(10, 10, 10, 0.28)', fontSize: '14px' }}>
                            →
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <p
                style={{
                  ...fontStyle,
                  borderTop: '1px solid rgba(10, 10, 10, 0.14)',
                  color: 'rgba(10, 10, 10, 0.54)',
                  fontSize: '15px',
                  fontWeight: 300,
                  lineHeight: 1.6,
                  margin: 0,
                  paddingTop: '24px',
                }}
              >
                Different labels, the same underlying logic: stage, activity, ownership, next action, and outcome.
              </p>
            </div>

            <p
              hidden
              style={{
                ...fontStyle,
                color: textColor.strong,
                fontSize: 'clamp(26px, 3.4vw, 42px)',
                fontWeight: 400,
                lineHeight: 1.2,
                margin: 'clamp(80px, 10vw, 120px) 0 0',
                maxWidth: '1100px',
              }}
            >
              Project defined the context. Evaluation determined priority. Campaign initiated action.{' '}
              <span style={{ color: '#2459d3' }}>Pipeline preserved progress.</span>
            </p>
          </div>
        </ScrollAnimatedSection>
      </section>

      <section
        hidden
        className="w-screen"
        data-case-nav-label="04.1 / Collect Without Leaving LinkedIn"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          padding: 'clamp(88px, 11vw, 152px) clamp(24px, 6vw, 96px)',
        }}
      >
        <ScrollAnimatedSection>
          <div style={{ margin: '0 auto', maxWidth: '1400px' }}>
            <p
              style={{
                ...fontStyle,
                color: '#2459d3',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.1em',
                lineHeight: '18px',
                margin: '0 0 16px',
                textTransform: 'uppercase',
              }}
            >
              04.1 — Collect without leaving LinkedIn
            </p>
            <h1
              style={{
                ...headingLevel1Style,
                fontSize: 'clamp(44px, 5.5vw, 68px)',
                lineHeight: 1.06,
                marginBottom: '28px',
                maxWidth: '1050px',
              }}
            >
              Bringing profile collection into the user’s existing workflow
            </h1>
            <div style={{ marginBottom: 'clamp(72px, 9vw, 112px)', maxWidth: '920px' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.64)', fontSize: 'clamp(18px, 1.8vw, 22px)', fontWeight: 300, lineHeight: 1.6, margin: '0 0 16px' }}>
                Recruiters and sales professionals already discovered people on LinkedIn. The problem began when they needed to preserve a promising profile: information had to be copied, reorganized, and connected to the correct task in another tool.
              </p>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.64)', fontSize: 'clamp(18px, 1.8vw, 22px)', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>
                I designed a Chrome Extension that allowed users to collect a profile and place it into the right Project without leaving LinkedIn.
              </p>
            </div>

            <div style={{ backgroundColor: '#F7F9FD', border: '1px solid rgba(36, 89, 211, 0.12)', padding: 'clamp(32px, 6vw, 72px)' }}>
              <h2 style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(34px, 4.4vw, 56px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 22px', maxWidth: '940px' }}>
                Save the profile while the context is still clear
              </h2>
              <div style={{ marginBottom: 'clamp(48px, 7vw, 76px)', maxWidth: '900px' }}>
                <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.62)', fontSize: '17px', fontWeight: 300, lineHeight: 1.65, margin: '0 0 8px' }}>
                  Instead of treating collection as a separate administrative task, ConnectNova brought the action directly into the LinkedIn profile page.
                </p>
                <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.62)', fontSize: '17px', fontWeight: 300, lineHeight: 1.65, margin: 0 }}>
                  Users could choose where the person belonged, save the available profile information, and continue browsing without interrupting their search.
                </p>
              </div>

              <div style={{ backgroundColor: '#F8F9FB', border: '1px solid rgba(10, 10, 10, 0.1)', padding: '14px' }}>
                <Image
                  src="/img/connectnova/Extension.avif"
                  alt="ConnectNova Chrome extension embedded in LinkedIn"
                  width={1600}
                  height={1000}
                  sizes="(max-width: 1400px) 100vw, 1400px"
                  style={{ display: 'block', height: 'auto', width: '100%' }}
                />
              </div>

              <div hidden style={{ backgroundColor: '#E9EDF3', border: '1px solid rgba(10, 10, 10, 0.1)', overflow: 'hidden' }}>
                <div style={{ alignItems: 'center', backgroundColor: '#FFFFFF', borderBottom: '1px solid rgba(10, 10, 10, 0.1)', display: 'flex', gap: '8px', height: '42px', padding: '0 16px' }}>
                  {['#ff6b62', '#f6bf4f', '#64c466'].map((color) => (
                    <span key={color} style={{ backgroundColor: color, borderRadius: '50%', height: '8px', width: '8px' }} />
                  ))}
                  <span style={{ ...fontStyle, backgroundColor: '#F4F5F7', borderRadius: '6px', color: 'rgba(10, 10, 10, 0.38)', fontSize: '10px', lineHeight: '20px', marginLeft: '12px', maxWidth: '520px', padding: '0 12px', width: '55%' }}>
                    linkedin.com/in/alex-morgan
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_0.9fr]">
                  <div style={{ backgroundColor: '#F3F5F7', minHeight: '590px', padding: 'clamp(24px, 4vw, 44px)' }}>
                    <div style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(10, 10, 10, 0.08)', minHeight: '500px', padding: 'clamp(28px, 4vw, 48px)' }}>
                      <div style={{ alignItems: 'center', display: 'flex', gap: '20px', marginBottom: '34px' }}>
                        <div style={{ alignItems: 'center', backgroundColor: '#DCE5F2', borderRadius: '50%', color: '#2459d3', display: 'flex', flex: '0 0 auto', fontSize: '18px', fontWeight: 500, height: '76px', justifyContent: 'center', width: '76px' }}>AM</div>
                        <div>
                          <h3 style={{ ...fontStyle, color: textColor.strong, fontSize: '24px', fontWeight: 500, lineHeight: 1.2, margin: '0 0 8px' }}>Alex Morgan</h3>
                          <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.58)', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>Senior Product Recruiter · SaaS &amp; AI</p>
                        </div>
                      </div>
                      {[
                        ['About', 'Building product and engineering teams for high-growth technology companies.'],
                        ['Experience', 'Senior Product Recruiter · Enterprise SaaS'],
                        ['Background', 'Talent acquisition · Technical hiring · Team scaling'],
                      ].map(([label, body]) => (
                        <div key={label} style={{ borderTop: '1px solid rgba(10, 10, 10, 0.09)', padding: '22px 0' }}>
                          <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.38)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.08em', margin: '0 0 8px', textTransform: 'uppercase' }}>{label}</p>
                          <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.58)', fontSize: '12px', lineHeight: 1.6, margin: 0 }}>{body}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <aside style={{ backgroundColor: '#FFFFFF', borderLeft: '1px solid rgba(10, 10, 10, 0.1)', display: 'flex', flexDirection: 'column', minHeight: '590px', padding: 'clamp(24px, 4vw, 38px)' }}>
                    <p style={{ ...fontStyle, color: '#2459d3', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', margin: '0 0 32px', textTransform: 'uppercase' }}>ConnectNova Extension</p>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.38)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.07em', margin: '0 0 10px', textTransform: 'uppercase' }}>Selected profile</p>
                    <div style={{ alignItems: 'center', borderBottom: '1px solid rgba(10, 10, 10, 0.1)', display: 'flex', gap: '12px', marginBottom: '28px', paddingBottom: '22px' }}>
                      <div style={{ alignItems: 'center', backgroundColor: '#EEF2F8', borderRadius: '50%', color: '#2459d3', display: 'flex', fontSize: '10px', fontWeight: 500, height: '38px', justifyContent: 'center', width: '38px' }}>AM</div>
                      <div>
                        <p style={{ ...fontStyle, color: textColor.strong, fontSize: '13px', fontWeight: 500, margin: '0 0 4px' }}>Alex Morgan</p>
                        <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '10px', margin: 0 }}>Senior Product Recruiter</p>
                      </div>
                    </div>
                    <label style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.07em', margin: '0 0 10px', textTransform: 'uppercase' }}>Choose Project</label>
                    <div style={{ ...fontStyle, alignItems: 'center', border: '1px solid rgba(10, 10, 10, 0.14)', color: textColor.strong, display: 'flex', fontSize: '12px', justifyContent: 'space-between', lineHeight: '20px', marginBottom: '18px', padding: '12px 14px' }}>
                      Senior Product Recruiter · AI SaaS <span style={{ color: 'rgba(10, 10, 10, 0.34)' }}>⌄</span>
                    </div>
                    <div style={{ backgroundColor: '#F7F9FD', border: '1px solid rgba(36, 89, 211, 0.12)', marginBottom: '20px', padding: '14px' }}>
                      <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.38)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.06em', margin: '0 0 8px', textTransform: 'uppercase' }}>Ready to collect</p>
                      <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.52)', fontSize: '10px', lineHeight: 1.55, margin: 0 }}>Profile information and LinkedIn source will be saved to the selected Project.</p>
                    </div>
                    <button type="button" style={{ ...fontStyle, backgroundColor: '#2459d3', border: 0, borderRadius: '6px', color: '#FFFFFF', cursor: 'default', fontSize: '12px', fontWeight: 500, lineHeight: '20px', padding: '11px 16px', width: '100%' }}>Collect profile</button>
                    <div style={{ backgroundColor: 'rgba(36, 89, 211, 0.06)', border: '1px solid rgba(36, 89, 211, 0.18)', marginTop: '16px', padding: '14px' }}>
                      <p style={{ ...fontStyle, color: '#2459d3', fontSize: '11px', fontWeight: 500, margin: '0 0 5px' }}>Profile collected</p>
                      <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.46)', fontSize: '10px', lineHeight: 1.5, margin: 0 }}>Saved to Senior Product Recruiter · AI SaaS</p>
                    </div>
                  </aside>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-px bg-black/10 sm:grid-cols-3" style={{ marginTop: '24px' }}>
                {['Collect in context', 'Save to the right Project', 'Clear success feedback'].map((annotation) => (
                  <p key={annotation} style={{ ...fontStyle, backgroundColor: '#F7F9FD', color: '#2459d3', fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', lineHeight: '18px', margin: 0, padding: '16px 18px', textAlign: 'center', textTransform: 'uppercase' }}>{annotation}</p>
                ))}
              </div>
            </div>

            <div hidden style={{ marginTop: 'clamp(80px, 10vw, 128px)' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 24px', textTransform: 'uppercase' }}>How the collection flow worked</p>
              <div style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.14)', borderTop: '1px solid rgba(10, 10, 10, 0.14)', display: 'grid', gridTemplateColumns: 'repeat(5, minmax(210px, 1fr))', overflowX: 'auto' }}>
                {[
                  ['Open the Extension', 'Start from the LinkedIn profile', 'Open ConnectNova while reviewing a candidate or contact.'],
                  ['Choose a Project', 'Connect the profile to a goal', 'Select an existing Project or create a new one before saving.'],
                  ['Review the information', 'Confirm what will be collected', 'Verify the person and Project context before completing the action.'],
                  ['Collect the profile', 'Save without switching tools', 'Add the profile directly to the selected Project in ConnectNova.'],
                  ['Receive confirmation', 'Make the result visible', 'A clear success state confirms where the person was stored.'],
                ].map(([eyebrow, title, body], index) => (
                  <article key={eyebrow} style={{ borderLeft: index > 0 ? '1px solid rgba(10, 10, 10, 0.1)' : 0, minHeight: '330px', padding: 'clamp(28px, 4vw, 42px) 26px' }}>
                    <p style={{ ...fontStyle, color: 'rgba(36, 89, 211, 0.72)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.07em', lineHeight: '17px', margin: '0 0 38px', textTransform: 'uppercase' }}>{String(index + 1).padStart(2, '0')} — {eyebrow}</p>
                    <h3 style={{ ...fontStyle, color: index === 1 ? '#2459d3' : textColor.strong, fontSize: '20px', fontWeight: 500, lineHeight: 1.22, margin: '0 0 18px' }}>{title}</h3>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.52)', fontSize: '12px', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>{body}</p>
                  </article>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'clamp(72px, 9vw, 112px)' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 24px', textTransform: 'uppercase' }}>Why these decisions mattered</p>
              <div className="grid grid-cols-1 md:grid-cols-3" style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.14)', borderTop: '1px solid rgba(10, 10, 10, 0.14)' }}>
                {[
                  ['Keep collection in context', 'Users could act at the moment they identified a relevant person instead of postponing the task until they returned to another platform.'],
                  ['Ask for the Project before saving', 'Selecting a Project during collection ensured that every saved profile entered ConnectNova with a clear purpose.'],
                  ['Confirm the outcome immediately', 'Visible feedback showed whether the action succeeded and where the profile had been stored.'],
                ].map(([title, body], index) => (
                  <article key={title} className={index > 0 ? 'border-t border-black/15 md:border-l md:border-t-0' : ''} style={{ padding: 'clamp(32px, 5vw, 52px)' }}>
                    <h3 style={{ ...fontStyle, color: index === 1 ? '#2459d3' : textColor.strong, fontSize: 'clamp(21px, 2.2vw, 28px)', fontWeight: 500, lineHeight: 1.2, margin: '0 0 18px' }}>{title}</h3>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.54)', fontSize: '14px', fontWeight: 300, lineHeight: 1.65, margin: 0 }}>{body}</p>
                  </article>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#F7F9FD', borderBottom: '1px solid rgba(36, 89, 211, 0.14)', borderTop: '1px solid rgba(36, 89, 211, 0.14)', marginTop: 'clamp(80px, 10vw, 120px)', padding: 'clamp(44px, 7vw, 72px)' }}>
              <p style={{ ...fontStyle, color: '#2459d3', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 20px', textTransform: 'uppercase' }}>Validation</p>
              <h2 style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(30px, 3.8vw, 48px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.12, margin: '0 0 clamp(40px, 6vw, 60px)', maxWidth: '900px' }}>A clearer collection flow improved task completion</h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {[
                  ['76% → 93%', 'Collection completion rate', 'Task completion increased after clarifying the Project selection and save flow.'],
                  ['72% → 87%', 'Save rate after collection', 'Task completion increased after improving action feedback and the post-save state.'],
                ].map(([value, label, body]) => (
                  <article key={value} style={{ borderTop: '1px solid rgba(10, 10, 10, 0.14)', paddingTop: '28px' }}>
                    <p style={{ ...fontStyle, color: '#2459d3', fontSize: 'clamp(48px, 6vw, 68px)', fontWeight: 500, letterSpacing: '-0.05em', lineHeight: 1, margin: '0 0 18px' }}>{value}</p>
                    <h3 style={{ ...fontStyle, color: textColor.strong, fontSize: '16px', fontWeight: 500, lineHeight: 1.4, margin: '0 0 10px' }}>{label}</h3>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.5)', fontSize: '13px', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>{body}</p>
                  </article>
                ))}
              </div>
              <p style={{ ...fontStyle, borderTop: '1px solid rgba(10, 10, 10, 0.1)', color: 'rgba(10, 10, 10, 0.38)', fontSize: '10px', lineHeight: 1.6, margin: '36px 0 0', paddingTop: '18px' }}>
                Results from usability testing. Participant count and test round to be added from the original research record.
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(10, 10, 10, 0.14)', marginTop: 'clamp(80px, 10vw, 120px)', paddingTop: 'clamp(52px, 7vw, 80px)' }}>
              <p style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(34px, 4.2vw, 52px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.12, margin: '0 0 24px', maxWidth: '1080px' }}>
                Collection became part of sourcing—<span style={{ color: '#2459d3' }}>not a separate task after it.</span>
              </p>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.5)', fontSize: '16px', fontWeight: 300, lineHeight: 1.6, margin: 0, maxWidth: '900px' }}>
                Users could move a promising LinkedIn profile into a structured Project while preserving the context behind the decision.
              </p>
            </div>

            <div hidden>

            <div
              style={{
                backgroundColor: '#F7F9FD',
                border: '1px solid rgba(36, 89, 211, 0.12)',
                padding: 'clamp(32px, 6vw, 72px)',
              }}
            >
              <h2
                style={{
                  ...fontStyle,
                  color: textColor.strong,
                  fontSize: 'clamp(34px, 4.4vw, 56px)',
                  fontWeight: 400,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.1,
                  margin: '0 0 22px',
                  maxWidth: '940px',
                }}
              >
                Keep the search. Change what users see first.
              </h2>
              <div style={{ marginBottom: 'clamp(48px, 7vw, 76px)', maxWidth: '900px' }}>
                <p
                  style={{
                    ...fontStyle,
                    color: 'rgba(10, 10, 10, 0.62)',
                    fontSize: '17px',
                    fontWeight: 300,
                    lineHeight: 1.65,
                    margin: '0 0 8px',
                  }}
                >
                  ConnectNova evaluated profiles against the user’s Project criteria and re-ranked the existing LinkedIn results by fit.
                </p>
                <p
                  style={{
                    ...fontStyle,
                    color: 'rgba(10, 10, 10, 0.62)',
                    fontSize: '17px',
                    fontWeight: 300,
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  Instead of opening profiles in LinkedIn’s default order, users could begin with the strongest candidates or contacts.
                </p>
              </div>

              <div style={{ backgroundColor: '#E9EDF3', border: '1px solid rgba(10, 10, 10, 0.1)', overflow: 'hidden' }}>
                <div
                  style={{
                    alignItems: 'center',
                    backgroundColor: '#FFFFFF',
                    borderBottom: '1px solid rgba(10, 10, 10, 0.1)',
                    display: 'flex',
                    gap: '8px',
                    height: '42px',
                    padding: '0 16px',
                  }}
                >
                  {['#ff6b62', '#f6bf4f', '#64c466'].map((color) => (
                    <span key={color} style={{ backgroundColor: color, borderRadius: '50%', height: '8px', width: '8px' }} />
                  ))}
                  <span
                    style={{
                      ...fontStyle,
                      backgroundColor: '#F4F5F7',
                      borderRadius: '6px',
                      color: 'rgba(10, 10, 10, 0.38)',
                      fontSize: '10px',
                      lineHeight: '20px',
                      marginLeft: '12px',
                      maxWidth: '520px',
                      padding: '0 12px',
                      width: '55%',
                    }}
                  >
                    linkedin.com/search/results/people
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.65fr_0.8fr]">
                  <div style={{ backgroundColor: '#F3F5F7', minHeight: '610px', padding: 'clamp(24px, 4vw, 44px)' }}>
                    <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                      <span
                        style={{
                          ...fontStyle,
                          color: '#0A66C2',
                          fontSize: '18px',
                          fontWeight: 600,
                          marginRight: '8px',
                        }}
                      >
                        in
                      </span>
                      {['People', 'Locations', 'Current company', 'All filters'].map((filter) => (
                        <span
                          key={filter}
                          style={{
                            ...fontStyle,
                            backgroundColor: '#FFFFFF',
                            border: '1px solid rgba(10, 10, 10, 0.13)',
                            borderRadius: '999px',
                            color: 'rgba(10, 10, 10, 0.58)',
                            fontSize: '10px',
                            lineHeight: '18px',
                            padding: '4px 10px',
                          }}
                        >
                          {filter}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[
                        {
                          initials: 'AM',
                          name: 'Alex Morgan',
                          role: 'Senior Product Recruiter · SaaS & AI',
                          detail: '8+ years in talent acquisition · San Francisco Bay Area',
                          score: '94',
                          evidence: 'Strong domain, role, and industry alignment',
                        },
                        {
                          initials: 'OC',
                          name: 'Olivia Chen',
                          role: 'Talent Acquisition Lead · Enterprise Software',
                          detail: 'Technical hiring · Scaling teams · United States',
                          score: '91',
                          evidence: 'Relevant experience and company background',
                        },
                        {
                          initials: 'MS',
                          name: 'Marco Silva',
                          role: 'Growth Recruiter · B2B Technology',
                          detail: 'Recruiting operations · Global sourcing · Remote',
                          score: '87',
                          evidence: 'Matches most Project criteria',
                        },
                      ].map((profile, index) => (
                        <div
                          key={profile.name}
                          className="grid grid-cols-[44px_1fr_auto] gap-4"
                          style={{
                            alignItems: 'start',
                            backgroundColor: '#FFFFFF',
                            border: index === 0 ? '1px solid rgba(36, 89, 211, 0.34)' : '1px solid rgba(10, 10, 10, 0.08)',
                            padding: '20px',
                          }}
                        >
                          <span
                            style={{
                              ...fontStyle,
                              alignItems: 'center',
                              backgroundColor: index === 0 ? 'rgba(36, 89, 211, 0.12)' : '#EEF1F5',
                              borderRadius: '50%',
                              color: index === 0 ? '#2459d3' : 'rgba(10, 10, 10, 0.48)',
                              display: 'flex',
                              fontSize: '11px',
                              fontWeight: 500,
                              height: '44px',
                              justifyContent: 'center',
                              width: '44px',
                            }}
                          >
                            {profile.initials}
                          </span>
                          <div>
                            <p style={{ ...fontStyle, color: textColor.strong, fontSize: '14px', fontWeight: 500, lineHeight: '20px', margin: '0 0 4px' }}>
                              {profile.name}
                            </p>
                            <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.58)', fontSize: '11px', lineHeight: '17px', margin: '0 0 8px' }}>
                              {profile.role}
                            </p>
                            <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.4)', fontSize: '10px', lineHeight: '16px', margin: '0 0 12px' }}>
                              {profile.detail}
                            </p>
                            <p style={{ ...fontStyle, color: 'rgba(36, 89, 211, 0.72)', fontSize: '10px', lineHeight: '16px', margin: 0 }}>
                              {profile.evidence}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span
                              style={{
                                ...fontStyle,
                                color: '#2459d3',
                                display: 'block',
                                fontSize: '26px',
                                fontWeight: 500,
                                lineHeight: 1,
                              }}
                            >
                              {profile.score}
                            </span>
                            <span style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.34)', fontSize: '8px', textTransform: 'uppercase' }}>
                              Fit score
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <aside
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderLeft: '1px solid rgba(10, 10, 10, 0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: '610px',
                      padding: 'clamp(24px, 4vw, 40px)',
                    }}
                  >
                    <p style={{ ...fontStyle, color: '#2459d3', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', margin: '0 0 28px', textTransform: 'uppercase' }}>
                      ConnectNova
                    </p>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.4)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.07em', margin: '0 0 8px', textTransform: 'uppercase' }}>
                      Selected Project
                    </p>
                    <p style={{ ...fontStyle, color: textColor.strong, fontSize: '17px', fontWeight: 500, lineHeight: 1.3, margin: '0 0 28px' }}>
                      Senior Product Recruiter · AI SaaS
                    </p>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.4)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.07em', margin: '0 0 12px', textTransform: 'uppercase' }}>
                      Evaluation criteria
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
                      {['8+ years recruiting experience', 'B2B SaaS or AI background', 'Technical hiring expertise'].map((criterion) => (
                        <div
                          key={criterion}
                          style={{
                            ...fontStyle,
                            backgroundColor: '#F6F8FC',
                            border: '1px solid rgba(36, 89, 211, 0.1)',
                            color: 'rgba(10, 10, 10, 0.58)',
                            fontSize: '10px',
                            lineHeight: '16px',
                            padding: '10px 12px',
                          }}
                        >
                          {criterion}
                        </div>
                      ))}
                    </div>
                    <div style={{ backgroundColor: 'rgba(36, 89, 211, 0.055)', border: '1px solid rgba(36, 89, 211, 0.15)', padding: '16px' }}>
                      <p style={{ ...fontStyle, color: '#2459d3', fontSize: '11px', fontWeight: 500, margin: '0 0 8px' }}>94 · Strong fit</p>
                      <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.5)', fontSize: '10px', lineHeight: 1.55, margin: 0 }}>
                        Evidence connects the score to profile experience, role history, and company context.
                      </p>
                    </div>
                    <button
                      type="button"
                      style={{
                        ...fontStyle,
                        backgroundColor: '#2459d3',
                        border: 0,
                        borderRadius: '6px',
                        color: '#FFFFFF',
                        cursor: 'default',
                        fontSize: '12px',
                        fontWeight: 500,
                        lineHeight: '20px',
                        marginTop: 'auto',
                        padding: '11px 16px',
                        width: '100%',
                      }}
                    >
                      Save to Project
                    </button>
                  </aside>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-px bg-black/10 sm:grid-cols-3" style={{ marginTop: '24px' }}>
                {['Re-ranked by fit', 'Evidence behind the score', 'Save with Project context'].map((annotation) => (
                  <p
                    key={annotation}
                    style={{
                      ...fontStyle,
                      backgroundColor: '#F7F9FD',
                      color: '#2459d3',
                      fontSize: '11px',
                      fontWeight: 500,
                      letterSpacing: '0.06em',
                      lineHeight: '18px',
                      margin: 0,
                      padding: '16px 18px',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                    }}
                  >
                    {annotation}
                  </p>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'clamp(80px, 10vw, 128px)' }}>
              <p
                style={{
                  ...fontStyle,
                  color: 'rgba(10, 10, 10, 0.42)',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  lineHeight: '18px',
                  margin: '0 0 24px',
                  textTransform: 'uppercase',
                }}
              >
                How the experience worked
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3" style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.14)', borderTop: '1px solid rgba(10, 10, 10, 0.14)' }}>
                {[
                  {
                    eyebrow: '01 — Define the goal',
                    title: 'Tell ConnectNova who you are looking for',
                    body: 'Users selected an existing Project or created a new one using a job brief, client requirement, or ideal customer profile.',
                    note: 'The Project established the context used to evaluate every profile in the search.',
                  },
                  {
                    eyebrow: '02 — Generate the criteria',
                    title: 'Turn the goal into a clear definition of fit',
                    body: 'ConnectNova translated the Project brief into evaluation criteria such as experience, skills, role, industry, company background, and other relevant signals.',
                    note: 'Users could review and edit the criteria before applying them to the search.',
                  },
                  {
                    eyebrow: '03 — Evaluate the results',
                    title: 'Assess every profile against the same goal',
                    body: 'AI reviewed the information available in each LinkedIn profile and evaluated how well the person matched the Project criteria.',
                    note: 'Each result included an overall fit score, criteria-level results, and supporting profile evidence.',
                  },
                ].map((step, index) => (
                  <article
                    key={step.title}
                    className={index > 0 ? 'border-t border-black/15 md:border-l md:border-t-0' : ''}
                    style={{ display: 'flex', flexDirection: 'column', minHeight: '390px', padding: 'clamp(32px, 5vw, 52px)' }}
                  >
                    <p style={{ ...fontStyle, color: 'rgba(36, 89, 211, 0.72)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', lineHeight: '17px', margin: '0 0 42px', textTransform: 'uppercase' }}>
                      {step.eyebrow}
                    </p>
                    <h2 style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(23px, 2.4vw, 31px)', fontWeight: 500, lineHeight: 1.18, margin: '0 0 20px' }}>
                      {step.title}
                    </h2>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.58)', fontSize: '15px', fontWeight: 300, lineHeight: 1.65, margin: '0 0 28px' }}>
                      {step.body}
                    </p>
                    <p style={{ ...fontStyle, borderTop: '1px solid rgba(10, 10, 10, 0.1)', color: 'rgba(10, 10, 10, 0.42)', fontSize: '12px', fontWeight: 400, lineHeight: 1.55, margin: 'auto 0 0', paddingTop: '18px' }}>
                      {step.note}
                    </p>
                  </article>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.14)' }}>
                {[
                  {
                    eyebrow: '04 — Re-rank by fit',
                    title: 'Bring the strongest matches to the top',
                    body: 'ConnectNova reordered the search so that the most relevant candidates or contacts appeared first.',
                    note: 'Users could focus on high-potential profiles instead of reviewing the list in LinkedIn’s default order.',
                  },
                  {
                    eyebrow: '05 — Save without losing context',
                    title: 'Move promising people directly into the Project',
                    body: 'Users could save a profile from LinkedIn while retaining its evaluation, Project context, and source information.',
                    note: 'The person entered the managed workflow without requiring users to copy information into another tool.',
                  },
                ].map((step, index) => (
                  <article
                    key={step.title}
                    className={index > 0 ? 'border-t border-black/15 md:border-l md:border-t-0' : ''}
                    style={{ display: 'flex', flexDirection: 'column', minHeight: '340px', padding: 'clamp(32px, 5vw, 52px)' }}
                  >
                    <p style={{ ...fontStyle, color: 'rgba(36, 89, 211, 0.72)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', lineHeight: '17px', margin: '0 0 42px', textTransform: 'uppercase' }}>
                      {step.eyebrow}
                    </p>
                    <h2 style={{ ...fontStyle, color: index === 0 ? '#2459d3' : textColor.strong, fontSize: 'clamp(23px, 2.4vw, 31px)', fontWeight: 500, lineHeight: 1.18, margin: '0 0 20px' }}>
                      {step.title}
                    </h2>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.58)', fontSize: '15px', fontWeight: 300, lineHeight: 1.65, margin: '0 0 28px' }}>
                      {step.body}
                    </p>
                    <p style={{ ...fontStyle, borderTop: '1px solid rgba(10, 10, 10, 0.1)', color: 'rgba(10, 10, 10, 0.42)', fontSize: '12px', fontWeight: 400, lineHeight: 1.55, margin: 'auto 0 0', paddingTop: '18px' }}>
                      {step.note}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div
              style={{
                borderTop: '1px solid rgba(10, 10, 10, 0.14)',
                marginTop: 'clamp(80px, 10vw, 120px)',
                paddingTop: 'clamp(52px, 7vw, 80px)',
              }}
            >
              <p
                style={{
                  ...fontStyle,
                  color: textColor.strong,
                  fontSize: 'clamp(34px, 4.2vw, 52px)',
                  fontWeight: 400,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.12,
                  margin: '0 0 24px',
                  maxWidth: '1080px',
                }}
              >
                ConnectNova did not replace LinkedIn search. It made the results{' '}
                <span style={{ color: '#2459d3' }}>more relevant to the user’s actual goal.</span>
              </p>
              <p
                style={{
                  ...fontStyle,
                  color: 'rgba(10, 10, 10, 0.5)',
                  fontSize: '16px',
                  fontWeight: 300,
                  lineHeight: 1.6,
                  margin: 0,
                  maxWidth: '820px',
                }}
              >
                The workflow stayed familiar, while AI reduced the effort required to identify who deserved attention first.
              </p>
            </div>
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>

      <section
        hidden
        className="w-screen"
        data-case-nav-label="04.2 / Visible and Editable AI Criteria"
        style={{
          backgroundColor: '#FAFAFA',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          padding: 'clamp(88px, 11vw, 152px) clamp(24px, 6vw, 96px)',
        }}
      >
        <ScrollAnimatedSection>
          <div style={{ margin: '0 auto', maxWidth: '1400px' }}>
            <p
              style={{
                ...fontStyle,
                color: '#2459d3',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.1em',
                lineHeight: '18px',
                margin: '0 0 16px',
                textTransform: 'uppercase',
              }}
            >
              04.2 — Make AI criteria visible and editable
            </p>
            <h1
              style={{
                ...headingLevel1Style,
                fontSize: 'clamp(44px, 5.5vw, 68px)',
                lineHeight: 1.06,
                marginBottom: '28px',
                maxWidth: '1080px',
              }}
            >
              Helping users start faster without giving up control
            </h1>
            <div style={{ marginBottom: 'clamp(72px, 9vw, 112px)', maxWidth: '920px' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.64)', fontSize: 'clamp(18px, 1.8vw, 22px)', fontWeight: 300, lineHeight: 1.6, margin: '0 0 16px' }}>
                Recruiters and sales professionals evaluated people against different goals, but defining a consistent set of criteria for every Project required time and judgment.
              </p>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.64)', fontSize: 'clamp(18px, 1.8vw, 22px)', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>
                ConnectNova used AI to generate an initial evaluation framework from the Project context. Users could review and edit the criteria before applying them to collected profiles.
              </p>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(10, 10, 10, 0.1)', padding: 'clamp(32px, 6vw, 72px)' }}>
              <h2 style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(34px, 4.4vw, 56px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 22px', maxWidth: '980px' }}>
                AI created the starting point. <span style={{ color: '#2459d3' }}>Users shaped the final framework.</span>
              </h2>
              <div style={{ marginBottom: 'clamp(48px, 7vw, 76px)', maxWidth: '920px' }}>
                <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.62)', fontSize: '17px', fontWeight: 300, lineHeight: 1.65, margin: '0 0 8px' }}>
                  Instead of presenting users with an unexplained score, ConnectNova first generated a visible set of evaluation criteria.
                </p>
                <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.62)', fontSize: '17px', fontWeight: 300, lineHeight: 1.65, margin: 0 }}>
                  This gave users a structured way to compare people while allowing them to adapt the framework to a specific role, client, or prospecting goal.
                </p>
              </div>

              <div style={{ backgroundColor: '#F8F9FB', border: '1px solid rgba(10, 10, 10, 0.1)', padding: '14px' }}>
                <Image
                  src="/img/connectnova/Rerank.avif"
                  alt="ConnectNova ranking and editable evaluation criteria workflow"
                  width={1600}
                  height={1000}
                  sizes="(max-width: 1400px) 100vw, 1400px"
                  style={{ display: 'block', height: 'auto', width: '100%' }}
                />
              </div>

              <div hidden className="grid grid-cols-1 lg:grid-cols-[0.55fr_1fr]" style={{ border: '1px solid rgba(10, 10, 10, 0.1)' }}>
                <div style={{ backgroundColor: '#F5F7FA', borderRight: '1px solid rgba(10, 10, 10, 0.1)', minHeight: '560px', padding: 'clamp(28px, 4vw, 46px)' }}>
                  <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.38)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.08em', margin: '0 0 34px', textTransform: 'uppercase' }}>Project context</p>
                  <h3 style={{ ...fontStyle, color: textColor.strong, fontSize: '24px', fontWeight: 500, lineHeight: 1.25, margin: '0 0 12px' }}>Senior Product Recruiter</h3>
                  <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.5)', fontSize: '12px', lineHeight: 1.6, margin: '0 0 34px' }}>Find an experienced product recruiter for a fast-growing enterprise AI company.</p>
                  {[
                    ['Goal', 'Hire for a senior recruiting role'],
                    ['Industry', 'AI · B2B SaaS'],
                    ['Experience', '8+ years preferred'],
                    ['Profiles', '24 people collected'],
                  ].map(([label, value]) => (
                    <div key={label} style={{ borderTop: '1px solid rgba(10, 10, 10, 0.1)', padding: '18px 0' }}>
                      <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.36)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.06em', margin: '0 0 7px', textTransform: 'uppercase' }}>{label}</p>
                      <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.6)', fontSize: '12px', lineHeight: 1.5, margin: 0 }}>{value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ backgroundColor: '#FFFFFF', minHeight: '560px', padding: 'clamp(28px, 4vw, 46px)' }}>
                  <div style={{ alignItems: 'flex-start', display: 'flex', flexWrap: 'wrap', gap: '18px', justifyContent: 'space-between', marginBottom: '30px' }}>
                    <div>
                      <p style={{ ...fontStyle, color: '#2459d3', fontSize: '10px', fontWeight: 500, letterSpacing: '0.08em', margin: '0 0 10px', textTransform: 'uppercase' }}>AI-generated criteria</p>
                      <h3 style={{ ...fontStyle, color: textColor.strong, fontSize: '24px', fontWeight: 500, lineHeight: 1.2, margin: 0 }}>Review before applying</h3>
                    </div>
                    <span style={{ ...fontStyle, backgroundColor: 'rgba(36, 89, 211, 0.07)', color: '#2459d3', fontSize: '10px', fontWeight: 500, padding: '8px 10px', textTransform: 'uppercase' }}>4 criteria generated</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      ['Relevant recruiting experience', '40%', '8+ years across product and technical recruiting'],
                      ['AI or B2B SaaS background', '25%', 'Experience in the target industry or business model'],
                      ['Enterprise team scaling', '20%', 'Evidence of hiring within scaling organizations'],
                      ['Stakeholder partnership', '15%', 'Experience working with senior hiring managers'],
                    ].map(([title, weight, detail], index) => (
                      <div key={title} style={{ alignItems: 'center', backgroundColor: index === 0 ? 'rgba(36, 89, 211, 0.045)' : '#FAFAFA', border: index === 0 ? '1px solid rgba(36, 89, 211, 0.18)' : '1px solid rgba(10, 10, 10, 0.09)', display: 'grid', gap: '14px', gridTemplateColumns: '1fr auto', padding: '16px' }}>
                        <div>
                          <p style={{ ...fontStyle, color: textColor.strong, fontSize: '12px', fontWeight: 500, lineHeight: 1.45, margin: '0 0 4px' }}>{title}</p>
                          <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '10px', lineHeight: 1.5, margin: 0 }}>{detail}</p>
                        </div>
                        <div style={{ alignItems: 'center', display: 'flex', gap: '10px' }}>
                          <span style={{ ...fontStyle, color: '#2459d3', fontSize: '11px', fontWeight: 500 }}>{weight}</span>
                          <button type="button" style={{ ...fontStyle, backgroundColor: '#FFFFFF', border: '1px solid rgba(10, 10, 10, 0.12)', color: 'rgba(10, 10, 10, 0.52)', cursor: 'default', fontSize: '10px', padding: '6px 9px' }}>Edit</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button type="button" style={{ ...fontStyle, backgroundColor: '#2459d3', border: 0, borderRadius: '6px', color: '#FFFFFF', cursor: 'default', fontSize: '12px', fontWeight: 500, lineHeight: '20px', marginTop: '22px', padding: '11px 18px', width: '100%' }}>Apply framework</button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-px bg-black/10 sm:grid-cols-3" style={{ marginTop: '24px' }}>
                {['Generated from Project context', 'Visible before evaluation', 'Editable by the user'].map((annotation) => (
                  <p key={annotation} style={{ ...fontStyle, backgroundColor: '#FFFFFF', color: '#2459d3', fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', lineHeight: '18px', margin: 0, padding: '16px 18px', textAlign: 'center', textTransform: 'uppercase' }}>{annotation}</p>
                ))}
              </div>
            </div>

            <div hidden style={{ marginTop: 'clamp(80px, 10vw, 128px)' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 24px', textTransform: 'uppercase' }}>How the framework worked</p>
              <div className="grid grid-cols-1 md:grid-cols-3" style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.14)', borderTop: '1px solid rgba(10, 10, 10, 0.14)' }}>
                {[
                  ['Generate', 'Turn the Project context into evaluation criteria', 'ConnectNova generated an initial set of criteria so users did not need to build the framework from a blank state.'],
                  ['Review and edit', 'Adapt the criteria to the user’s judgment', 'Users could review and edit the AI output before applying it across profiles.'],
                  ['Apply consistently', 'Evaluate people against the same Project goal', 'The selected criteria helped users compare and prioritize people within the Project consistently.'],
                ].map(([eyebrow, title, body], index) => (
                  <article key={eyebrow} className={index > 0 ? 'border-t border-black/15 md:border-l md:border-t-0' : ''} style={{ display: 'flex', flexDirection: 'column', minHeight: '370px', padding: 'clamp(32px, 5vw, 52px)' }}>
                    <p style={{ ...fontStyle, color: 'rgba(36, 89, 211, 0.72)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', lineHeight: '17px', margin: '0 0 42px', textTransform: 'uppercase' }}>{String(index + 1).padStart(2, '0')} — {eyebrow}</p>
                    <h3 style={{ ...fontStyle, color: index === 1 ? '#2459d3' : textColor.strong, fontSize: 'clamp(22px, 2.3vw, 30px)', fontWeight: 500, lineHeight: 1.2, margin: '0 0 20px' }}>{title}</h3>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.54)', fontSize: '14px', fontWeight: 300, lineHeight: 1.65, margin: 0 }}>{body}</p>
                  </article>
                ))}
              </div>
            </div>

            <div hidden style={{ marginTop: 'clamp(72px, 9vw, 112px)' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 24px', textTransform: 'uppercase' }}>Design principles</p>
              <div className="grid grid-cols-1 md:grid-cols-3" style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.14)', borderTop: '1px solid rgba(10, 10, 10, 0.14)' }}>
                {[
                  ['Visible before applied', 'Generated criteria were shown before becoming part of the evaluation process.'],
                  ['Editable by the user', 'Users could refine the framework instead of accepting AI output as fixed.'],
                  ['Specific to each Project', 'Criteria changed with each hiring, client, or prospecting goal.'],
                ].map(([title, body], index) => (
                  <div key={title} className={index > 0 ? 'border-t border-black/15 md:border-l md:border-t-0' : ''} style={{ padding: '30px clamp(26px, 4vw, 42px)' }}>
                    <h3 style={{ ...fontStyle, color: index === 1 ? '#2459d3' : textColor.strong, fontSize: '18px', fontWeight: 500, lineHeight: 1.25, margin: '0 0 12px' }}>{title}</h3>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.5)', fontSize: '12px', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>{body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid rgba(36, 89, 211, 0.14)', borderTop: '1px solid rgba(36, 89, 211, 0.14)', marginTop: 'clamp(80px, 10vw, 120px)', padding: 'clamp(44px, 7vw, 72px)' }}>
              <p style={{ ...fontStyle, color: '#2459d3', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 20px', textTransform: 'uppercase' }}>Adoption</p>
              <h2 style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(30px, 3.8vw, 48px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.12, margin: '0 0 clamp(40px, 6vw, 60px)', maxWidth: '900px' }}>Users treated AI as a useful starting point</h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {[
                  ['84%', 'Adopted AI-generated evaluation criteria', 'Most users kept at least part of the framework generated by ConnectNova.'],
                  ['31%', 'Edited the generated criteria', 'A meaningful share of users adjusted the framework to reflect their own judgment and context.'],
                ].map(([value, label, body]) => (
                  <article key={value} style={{ borderTop: '1px solid rgba(10, 10, 10, 0.14)', paddingTop: '28px' }}>
                    <p style={{ ...fontStyle, color: '#2459d3', fontSize: 'clamp(56px, 7vw, 76px)', fontWeight: 500, letterSpacing: '-0.05em', lineHeight: 1, margin: '0 0 18px' }}>{value}</p>
                    <h3 style={{ ...fontStyle, color: textColor.strong, fontSize: '16px', fontWeight: 500, lineHeight: 1.4, margin: '0 0 10px' }}>{label}</h3>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.5)', fontSize: '13px', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>{body}</p>
                  </article>
                ))}
              </div>
              <p style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(20px, 2.4vw, 28px)', fontWeight: 400, lineHeight: 1.35, margin: 'clamp(40px, 6vw, 60px) 0 0', maxWidth: '980px' }}>
                The adoption rate showed that AI reduced setup effort, while the edit rate confirmed that users still needed control over the final evaluation framework.
              </p>
              <p style={{ ...fontStyle, borderTop: '1px solid rgba(10, 10, 10, 0.1)', color: 'rgba(10, 10, 10, 0.38)', fontSize: '10px', lineHeight: 1.6, margin: '32px 0 0', paddingTop: '18px' }}>
                Product usage results. Sample size, testing method, and measurement period to be added from the original research record.
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(10, 10, 10, 0.14)', marginTop: 'clamp(80px, 10vw, 120px)', paddingTop: 'clamp(52px, 7vw, 80px)' }}>
              <p style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(34px, 4.2vw, 52px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.12, margin: '0 0 24px', maxWidth: '1120px' }}>
                AI did not make the final decision. It helped users define a clearer and more consistent way to <span style={{ color: '#2459d3' }}>make it.</span>
              </p>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.5)', fontSize: '16px', fontWeight: 300, lineHeight: 1.6, margin: 0, maxWidth: '900px' }}>
                The generated framework reduced the effort required to start, while editing kept the evaluation aligned with each Project’s real requirements.
              </p>
            </div>

            <div hidden>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(10, 10, 10, 0.1)',
                padding: 'clamp(32px, 6vw, 72px)',
              }}
            >
              <h2
                style={{
                  ...fontStyle,
                  color: textColor.strong,
                  fontSize: 'clamp(34px, 4.4vw, 56px)',
                  fontWeight: 400,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.1,
                  margin: '0 0 22px',
                  maxWidth: '940px',
                }}
              >
                A score showed priority. Evidence explained why.
              </h2>
              <div style={{ marginBottom: 'clamp(48px, 7vw, 76px)', maxWidth: '920px' }}>
                <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.62)', fontSize: '17px', fontWeight: 300, lineHeight: 1.65, margin: '0 0 8px' }}>
                  ConnectNova broke each profile’s overall fit into visible evaluation criteria and connected every judgment to supporting information from the LinkedIn profile.
                </p>
                <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.62)', fontSize: '17px', fontWeight: 300, lineHeight: 1.65, margin: 0 }}>
                  Users could quickly scan the result, investigate the reasoning, and make the final decision themselves.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr]" style={{ border: '1px solid rgba(10, 10, 10, 0.1)' }}>
                <div style={{ backgroundColor: '#F7F8FA', minHeight: '640px', padding: 'clamp(28px, 4vw, 48px)' }}>
                  <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.38)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.08em', margin: '0 0 32px', textTransform: 'uppercase' }}>
                    Profile information
                  </p>
                  <div style={{ alignItems: 'center', display: 'flex', gap: '18px', marginBottom: '36px' }}>
                    <span
                      style={{
                        ...fontStyle,
                        alignItems: 'center',
                        backgroundColor: 'rgba(36, 89, 211, 0.12)',
                        borderRadius: '50%',
                        color: '#2459d3',
                        display: 'flex',
                        fontSize: '16px',
                        fontWeight: 500,
                        height: '64px',
                        justifyContent: 'center',
                        width: '64px',
                      }}
                    >
                      AM
                    </span>
                    <div>
                      <h3 style={{ ...fontStyle, color: textColor.strong, fontSize: '24px', fontWeight: 500, lineHeight: 1.2, margin: '0 0 6px' }}>
                        Alex Morgan
                      </h3>
                      <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.56)', fontSize: '14px', lineHeight: '21px', margin: 0 }}>
                        Senior Product Recruiter · AI and B2B SaaS
                      </p>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(10, 10, 10, 0.1)', paddingTop: '28px' }}>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.4)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.07em', margin: '0 0 18px', textTransform: 'uppercase' }}>
                      Experience
                    </p>
                    {[
                      {
                        role: 'Senior Product Recruiter',
                        company: 'Aperture AI',
                        duration: '2021 — Present',
                        detail: 'Led technical and product hiring for a scaling enterprise AI organization.',
                        highlighted: true,
                      },
                      {
                        role: 'Talent Acquisition Partner',
                        company: 'Northstar SaaS',
                        duration: '2017 — 2021',
                        detail: 'Built recruiting programs across product, engineering, and go-to-market teams.',
                        highlighted: false,
                      },
                    ].map((experience) => (
                      <div
                        key={experience.company}
                        style={{
                          backgroundColor: experience.highlighted ? 'rgba(36, 89, 211, 0.055)' : 'transparent',
                          borderLeft: experience.highlighted ? '2px solid #2459d3' : '2px solid rgba(10, 10, 10, 0.1)',
                          marginBottom: '16px',
                          padding: '16px 18px',
                        }}
                      >
                        <div style={{ alignItems: 'baseline', display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'space-between' }}>
                          <p style={{ ...fontStyle, color: textColor.strong, fontSize: '14px', fontWeight: 500, lineHeight: '21px', margin: 0 }}>
                            {experience.role} · {experience.company}
                          </p>
                          <span style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.38)', fontSize: '10px' }}>{experience.duration}</span>
                        </div>
                        <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.52)', fontSize: '12px', lineHeight: 1.6, margin: '8px 0 0' }}>
                          {experience.detail}
                        </p>
                        {experience.highlighted && (
                          <span style={{ ...fontStyle, color: '#2459d3', display: 'inline-block', fontSize: '9px', fontWeight: 500, letterSpacing: '0.05em', marginTop: '10px', textTransform: 'uppercase' }}>
                            Evidence used in evaluation
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px solid rgba(10, 10, 10, 0.1)', marginTop: '24px', paddingTop: '24px' }}>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.4)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.07em', margin: '0 0 14px', textTransform: 'uppercase' }}>
                      Skills and context
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {['Technical recruiting', 'Product hiring', 'AI industry', 'B2B SaaS', 'Team scaling'].map((skill) => (
                        <span
                          key={skill}
                          style={{
                            ...fontStyle,
                            backgroundColor: skill === 'AI industry' || skill === 'B2B SaaS' ? 'rgba(36, 89, 211, 0.08)' : '#FFFFFF',
                            border: '1px solid rgba(10, 10, 10, 0.1)',
                            borderRadius: '999px',
                            color: skill === 'AI industry' || skill === 'B2B SaaS' ? '#2459d3' : 'rgba(10, 10, 10, 0.52)',
                            fontSize: '10px',
                            lineHeight: '17px',
                            padding: '5px 10px',
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <aside style={{ backgroundColor: '#FFFFFF', borderLeft: '1px solid rgba(10, 10, 10, 0.1)', minHeight: '640px', padding: 'clamp(28px, 4vw, 48px)' }}>
                  <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.38)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.08em', margin: '0 0 28px', textTransform: 'uppercase' }}>
                    Overall fit
                  </p>
                  <div style={{ alignItems: 'flex-end', display: 'flex', gap: '12px', marginBottom: '34px' }}>
                    <span style={{ ...fontStyle, color: '#2459d3', fontSize: 'clamp(64px, 8vw, 96px)', fontWeight: 300, letterSpacing: '-0.06em', lineHeight: 0.8 }}>
                      88
                    </span>
                    <span style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.52)', fontSize: '13px', fontWeight: 500, lineHeight: '20px' }}>
                      Strong match
                    </span>
                  </div>
                  <p style={{ ...fontStyle, backgroundColor: 'rgba(36, 89, 211, 0.055)', color: '#2459d3', fontSize: '10px', fontWeight: 500, lineHeight: '16px', margin: '0 0 32px', padding: '10px 12px', textTransform: 'uppercase' }}>
                    Project-specific score
                  </p>

                  <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.38)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.08em', margin: '0 0 14px', textTransform: 'uppercase' }}>
                    Criteria breakdown
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      {
                        status: 'Match',
                        title: 'Relevant recruiting experience',
                        score: '36 / 40',
                        evidence: '8+ years across product and technical hiring roles.',
                        color: '#1a7f5a',
                      },
                      {
                        status: 'Match',
                        title: 'AI or B2B SaaS background',
                        score: '28 / 30',
                        evidence: 'Current and previous roles both support the target industry context.',
                        color: '#1a7f5a',
                      },
                      {
                        status: 'Partial',
                        title: 'Enterprise team scaling',
                        score: '24 / 30',
                        evidence: 'Strong scaling experience; enterprise scope is less explicit.',
                        color: '#b26a00',
                      },
                    ].map((criterion) => (
                      <div key={criterion.title} style={{ border: '1px solid rgba(10, 10, 10, 0.1)', padding: '14px' }}>
                        <div style={{ alignItems: 'center', display: 'flex', gap: '8px', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ ...fontStyle, color: criterion.color, fontSize: '9px', fontWeight: 500, textTransform: 'uppercase' }}>{criterion.status}</span>
                          <span style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.4)', fontSize: '9px', fontVariantNumeric: 'tabular-nums' }}>{criterion.score}</span>
                        </div>
                        <p style={{ ...fontStyle, color: textColor.strong, fontSize: '12px', fontWeight: 500, lineHeight: '18px', margin: '0 0 8px' }}>
                          {criterion.title}
                        </p>
                        <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.48)', fontSize: '10px', lineHeight: 1.5, margin: 0 }}>
                          {criterion.evidence}
                        </p>
                      </div>
                    ))}
                  </div>
                </aside>
              </div>

              <div className="grid grid-cols-1 gap-px bg-black/10 sm:grid-cols-3" style={{ marginTop: '24px' }}>
                {['Project-specific score', 'Criteria-level breakdown', 'Evidence from the profile'].map((annotation) => (
                  <p
                    key={annotation}
                    style={{
                      ...fontStyle,
                      backgroundColor: '#FFFFFF',
                      color: '#2459d3',
                      fontSize: '11px',
                      fontWeight: 500,
                      letterSpacing: '0.06em',
                      lineHeight: '18px',
                      margin: 0,
                      padding: '16px 18px',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                    }}
                  >
                    {annotation}
                  </p>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'clamp(80px, 10vw, 128px)' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 24px', textTransform: 'uppercase' }}>
                Three levels of explanation
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3" style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.14)', borderTop: '1px solid rgba(10, 10, 10, 0.14)' }}>
                {[
                  {
                    eyebrow: '01 — Overall fit',
                    title: 'Know who deserves attention first',
                    body: 'A clear fit indicator showed the profile’s overall relevance to the current Project—not a permanent rating attached to the person.',
                  },
                  {
                    eyebrow: '02 — Criteria breakdown',
                    title: 'See where the profile matched—or fell short',
                    body: 'Project-specific criteria made profiles comparable through the same framework instead of memory and intuition.',
                  },
                  {
                    eyebrow: '03 — Supporting evidence',
                    title: 'Trace every judgment back to the profile',
                    body: 'Experience, roles, skills, and company context made the AI assessment easier to verify.',
                  },
                ].map((level, index) => (
                  <article
                    key={level.title}
                    className={index > 0 ? 'border-t border-black/15 md:border-l md:border-t-0' : ''}
                    style={{ minHeight: '300px', padding: 'clamp(32px, 5vw, 52px)' }}
                  >
                    <p style={{ ...fontStyle, color: 'rgba(36, 89, 211, 0.72)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', lineHeight: '17px', margin: '0 0 42px', textTransform: 'uppercase' }}>
                      {level.eyebrow}
                    </p>
                    <h2 style={{ ...fontStyle, color: index === 2 ? '#2459d3' : textColor.strong, fontSize: 'clamp(23px, 2.4vw, 31px)', fontWeight: 500, lineHeight: 1.18, margin: '0 0 20px' }}>
                      {level.title}
                    </h2>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.58)', fontSize: '15px', fontWeight: 300, lineHeight: 1.65, margin: 0 }}>
                      {level.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(36, 89, 211, 0.05)',
                borderBottom: '1px solid rgba(36, 89, 211, 0.14)',
                borderTop: '1px solid rgba(36, 89, 211, 0.14)',
                marginTop: 'clamp(80px, 10vw, 128px)',
                padding: 'clamp(44px, 7vw, 72px)',
              }}
            >
              <h2
                style={{
                  ...fontStyle,
                  color: textColor.strong,
                  fontSize: 'clamp(32px, 4vw, 50px)',
                  fontWeight: 400,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.12,
                  margin: '0 0 22px',
                  maxWidth: '980px',
                }}
              >
                AI created a starting point—not the final judgment.
              </h2>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.58)', fontSize: '16px', fontWeight: 300, lineHeight: 1.65, margin: '0 0 clamp(48px, 7vw, 72px)', maxWidth: '940px' }}>
                Before evaluating profiles, ConnectNova generated criteria from the Project brief. Users could review the framework and adapt it to the way their team actually made decisions.
              </p>

              <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(36, 89, 211, 0.14)', padding: 'clamp(28px, 4vw, 44px)' }}>
                  <p style={{ ...fontStyle, color: '#2459d3', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', margin: '0 0 32px', textTransform: 'uppercase' }}>
                    Criteria editor
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { title: 'Relevant recruiting experience', weight: '40%' },
                      { title: 'AI or B2B SaaS background', weight: '30%' },
                      { title: 'Enterprise team scaling', weight: '20%' },
                      { title: 'Location and availability', weight: '10%' },
                    ].map((criterion) => (
                      <div
                        key={criterion.title}
                        className="grid grid-cols-[1fr_auto_auto] gap-3"
                        style={{ alignItems: 'center', border: '1px solid rgba(10, 10, 10, 0.1)', padding: '14px' }}
                      >
                        <span style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.66)', fontSize: '12px', fontWeight: 400, lineHeight: '18px' }}>
                          {criterion.title}
                        </span>
                        <span style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.4)', fontSize: '10px', fontVariantNumeric: 'tabular-nums' }}>
                          {criterion.weight}
                        </span>
                        <span style={{ ...fontStyle, color: '#2459d3', fontSize: '10px', fontWeight: 500, textTransform: 'uppercase' }}>Edit</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
                    {['+ Add criterion', 'Auto-balance'].map((action) => (
                      <span
                        key={action}
                        style={{
                          ...fontStyle,
                          border: '1px solid rgba(36, 89, 211, 0.2)',
                          color: '#2459d3',
                          fontSize: '10px',
                          fontWeight: 500,
                          lineHeight: '17px',
                          padding: '7px 10px',
                        }}
                      >
                        {action}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p style={{ ...fontStyle, color: '#2459d3', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', margin: '0 0 32px', textTransform: 'uppercase' }}>
                    User control
                  </p>
                  <div style={{ borderTop: '1px solid rgba(10, 10, 10, 0.14)' }}>
                    {[
                      'Edit the wording of a criterion',
                      'Add missing requirements',
                      'Remove irrelevant criteria',
                      'Adjust the relative importance',
                      'Review the evidence behind each result',
                      'Make a final decision independently of the AI score',
                    ].map((action, index) => (
                      <div
                        key={action}
                        className="grid grid-cols-[32px_1fr] gap-3"
                        style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.1)', padding: '15px 0' }}
                      >
                        <span style={{ ...fontStyle, color: 'rgba(36, 89, 211, 0.62)', fontSize: '10px', fontVariantNumeric: 'tabular-nums', lineHeight: '20px' }}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.64)', fontSize: '14px', fontWeight: 400, lineHeight: '20px' }}>
                          {action}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'clamp(80px, 10vw, 120px)' }}>
              <div style={{ overflowX: 'auto' }}>
                <div
                  style={{
                    borderBottom: '1px solid rgba(10, 10, 10, 0.14)',
                    borderTop: '1px solid rgba(10, 10, 10, 0.14)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))',
                    minWidth: '880px',
                  }}
                >
                  {[
                    { phase: 'Generate', title: 'Create criteria from the Project goal', body: 'AI translated the brief into an initial evaluation framework.' },
                    { phase: 'Refine', title: 'Adapt criteria to the team’s judgment', body: 'Users reviewed and edited the framework before applying it.' },
                    { phase: 'Evaluate', title: 'Assess every person consistently', body: 'Each profile was compared against the same Project-specific criteria.' },
                    { phase: 'Decide', title: 'Keep the user in control', body: 'AI informed prioritisation; the user chose the final action.' },
                  ].map((step, index, steps) => (
                    <article
                      key={step.phase}
                      style={{ borderLeft: index > 0 ? '1px solid rgba(10, 10, 10, 0.1)' : 0, minHeight: '240px', padding: '32px', position: 'relative' }}
                    >
                      <p style={{ ...fontStyle, color: index === steps.length - 1 ? '#2459d3' : 'rgba(36, 89, 211, 0.68)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', margin: '0 0 32px', textTransform: 'uppercase' }}>
                        {String(index + 1).padStart(2, '0')} — {step.phase}
                      </p>
                      <h3 style={{ ...fontStyle, color: index === steps.length - 1 ? '#2459d3' : textColor.strong, fontSize: '22px', fontWeight: 500, lineHeight: 1.2, margin: '0 0 16px' }}>
                        {step.title}
                      </h3>
                      <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.52)', fontSize: '13px', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>
                        {step.body}
                      </p>
                      {index < steps.length - 1 && (
                        <span aria-hidden="true" style={{ ...fontStyle, backgroundColor: '#FAFAFA', color: 'rgba(36, 89, 211, 0.48)', fontSize: '20px', padding: '4px', position: 'absolute', right: '-15px', top: '25px', zIndex: 1 }}>
                          →
                        </span>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(10, 10, 10, 0.14)', marginTop: 'clamp(80px, 10vw, 120px)', paddingTop: 'clamp(52px, 7vw, 80px)' }}>
              <p
                style={{
                  ...fontStyle,
                  color: textColor.strong,
                  fontSize: 'clamp(34px, 4.2vw, 52px)',
                  fontWeight: 400,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.12,
                  margin: '0 0 24px',
                  maxWidth: '1080px',
                }}
              >
                AI accelerated the first review without replacing{' '}
                <span style={{ color: '#2459d3' }}>professional judgment.</span>
              </p>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.5)', fontSize: '16px', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>
                The score helped users prioritise. The criteria and evidence helped them decide.
              </p>
            </div>
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>

      <section
        hidden
        className="w-screen"
        data-case-nav-label="04.3 / Manage, Rank, Decide"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          padding: 'clamp(88px, 11vw, 152px) clamp(24px, 6vw, 96px)',
        }}
      >
        <ScrollAnimatedSection>
          <div style={{ margin: '0 auto', maxWidth: '1400px' }}>
            <p style={{ ...fontStyle, color: '#2459d3', fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 16px', textTransform: 'uppercase' }}>
              04.3 — Manage, rank, decide
            </p>
            <h1
              style={{
                ...headingLevel1Style,
                fontSize: 'clamp(44px, 5.5vw, 68px)',
                lineHeight: 1.06,
                marginBottom: '28px',
                maxWidth: '1080px',
              }}
            >
              Bringing profiles, evaluation, and comparison into one workspace
            </h1>
            <div style={{ marginBottom: 'clamp(72px, 9vw, 112px)', maxWidth: '980px' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.64)', fontSize: 'clamp(18px, 1.8vw, 22px)', fontWeight: 300, lineHeight: 1.6, margin: '0 0 12px' }}>
                After collecting profiles and defining the evaluation criteria, users needed a clear way to review people within each Project.
              </p>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.64)', fontSize: 'clamp(18px, 1.8vw, 22px)', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>
                The web dashboard brought the people list, AI evaluation results, and profile details into one workspace, helping users compare profiles and decide who deserved attention first.
              </p>
            </div>

            <div style={{ backgroundColor: '#F7F9FD', border: '1px solid rgba(36, 89, 211, 0.12)', padding: 'clamp(32px, 6vw, 72px)' }}>
              <h2 style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(34px, 4.4vw, 56px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 22px', maxWidth: '980px' }}>
                Manage the list without losing the individual context.
              </h2>
              <div style={{ marginBottom: 'clamp(48px, 7vw, 76px)', maxWidth: '920px' }}>
                <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.62)', fontSize: '17px', fontWeight: 300, lineHeight: 1.65, margin: '0 0 8px' }}>
                  Users could scan the ranked list at a high level, then open a Profile Panel to review one person in more detail without leaving the Project.
                </p>
                <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.62)', fontSize: '17px', fontWeight: 300, lineHeight: 1.65, margin: 0 }}>
                  This reduced repeated movement between separate list and detail pages while comparing multiple people.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[7fr_3fr]" style={{ alignItems: 'start' }}>
                <AIRankingViewMock fontStyle={fontStyle} defaultTab="rankings" />
                <ProfilePanelSlideMock fontStyle={fontStyle} />
              </div>

              <div hidden className="grid grid-cols-1 lg:grid-cols-[7fr_3fr]" style={{ border: '1px solid rgba(10, 10, 10, 0.1)' }}>
                <div style={{ backgroundColor: '#FFFFFF', minHeight: '620px', overflow: 'hidden' }}>
                  <div style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.1)', padding: '24px' }}>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.38)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.08em', margin: '0 0 8px', textTransform: 'uppercase' }}>Project workspace</p>
                    <div style={{ alignItems: 'flex-end', display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'space-between' }}>
                      <h3 style={{ ...fontStyle, color: textColor.strong, fontSize: '20px', fontWeight: 500, lineHeight: 1.2, margin: 0 }}>Senior Product Recruiter · AI SaaS</h3>
                      <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '10px', margin: 0 }}>24 people · Ranked by Project fit</p>
                    </div>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <div style={{ minWidth: '660px' }}>
                      <div style={{ ...fontStyle, backgroundColor: '#F6F7F9', color: 'rgba(10, 10, 10, 0.38)', display: 'grid', fontSize: '9px', fontWeight: 500, gridTemplateColumns: '52px minmax(230px,1.4fr) 86px minmax(210px,1fr)', letterSpacing: '0.05em', padding: '12px 18px', textTransform: 'uppercase' }}>
                        <span>Rank</span><span>Person</span><span>Fit</span><span>Evaluation overview</span>
                      </div>
                      {[
                        { rank: '01', name: 'Alex Morgan', role: 'Senior Product Recruiter · Aperture AI', fit: '92', evaluation: 'Strong experience · AI SaaS · Enterprise scaling', active: true },
                        { rank: '02', name: 'Olivia Chen', role: 'TA Lead · Enterprise Software', fit: '87', evaluation: 'Strong experience · SaaS · Partial AI exposure', active: false },
                        { rank: '03', name: 'Marco Silva', role: 'Growth Recruiter · B2B Technology', fit: '81', evaluation: 'Relevant role · B2B SaaS · Scaling experience', active: false },
                        { rank: '04', name: 'Priya Nair', role: 'Recruiting Partner · Fintech', fit: '76', evaluation: 'Relevant role · Enterprise · Different industry', active: false },
                        { rank: '05', name: 'Sarah Chen', role: 'Technical Sourcer · AI Platform', fit: '71', evaluation: 'AI exposure · Technical sourcing · Less senior', active: false },
                      ].map((person) => (
                        <div key={person.name} style={{ ...fontStyle, alignItems: 'center', backgroundColor: person.active ? 'rgba(36, 89, 211, 0.055)' : '#FFFFFF', borderBottom: '1px solid rgba(10, 10, 10, 0.07)', borderLeft: person.active ? '2px solid #2459d3' : '2px solid transparent', color: 'rgba(10, 10, 10, 0.54)', display: 'grid', fontSize: '10px', gridTemplateColumns: '52px minmax(230px,1.4fr) 86px minmax(210px,1fr)', minHeight: '84px', padding: '12px 16px' }}>
                          <span style={{ color: 'rgba(10, 10, 10, 0.3)' }}>{person.rank}</span>
                          <span>
                            <strong style={{ color: textColor.strong, display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '5px' }}>{person.name}</strong>
                            <span style={{ color: 'rgba(10, 10, 10, 0.42)', fontSize: '9px' }}>{person.role}</span>
                          </span>
                          <strong style={{ color: '#2459d3', fontSize: '20px', fontWeight: 500 }}>{person.fit}</strong>
                          <span style={{ color: 'rgba(10, 10, 10, 0.48)', lineHeight: 1.55 }}>{person.evaluation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <aside style={{ backgroundColor: '#FFFFFF', borderLeft: '1px solid rgba(10, 10, 10, 0.1)', display: 'flex', flexDirection: 'column', minHeight: '620px', padding: 'clamp(26px, 4vw, 40px)' }}>
                  <p style={{ ...fontStyle, color: '#2459d3', fontSize: '9px', fontWeight: 500, letterSpacing: '0.08em', margin: '0 0 28px', textTransform: 'uppercase' }}>Profile Panel</p>
                  <div style={{ alignItems: 'center', display: 'flex', gap: '14px', marginBottom: '30px' }}>
                    <span style={{ ...fontStyle, alignItems: 'center', backgroundColor: 'rgba(36, 89, 211, 0.12)', borderRadius: '50%', color: '#2459d3', display: 'flex', fontSize: '12px', fontWeight: 500, height: '48px', justifyContent: 'center', width: '48px' }}>AM</span>
                    <div>
                      <h3 style={{ ...fontStyle, color: textColor.strong, fontSize: '18px', fontWeight: 500, lineHeight: 1.2, margin: '0 0 4px' }}>Alex Morgan</h3>
                      <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.48)', fontSize: '10px', lineHeight: '16px', margin: 0 }}>Senior Product Recruiter · Aperture AI</p>
                    </div>
                  </div>
                  <div style={{ alignItems: 'center', backgroundColor: 'rgba(36, 89, 211, 0.055)', border: '1px solid rgba(36, 89, 211, 0.14)', display: 'flex', justifyContent: 'space-between', marginBottom: '24px', padding: '14px' }}>
                    <span style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.5)', fontSize: '10px', textTransform: 'uppercase' }}>Project fit</span>
                    <strong style={{ ...fontStyle, color: '#2459d3', fontSize: '24px', fontWeight: 500 }}>92</strong>
                  </div>
                  {[
                    ['Profile information', '8+ years across product and technical recruiting roles.'],
                    ['Evaluation details', 'Strong match across recruiting experience, industry context, and team scaling.'],
                    ['Supporting context', 'Current and previous roles support the Project-specific criteria.'],
                  ].map(([label, body]) => (
                    <div key={label} style={{ borderTop: '1px solid rgba(10, 10, 10, 0.1)', padding: '20px 0' }}>
                      <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.38)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.07em', margin: '0 0 10px', textTransform: 'uppercase' }}>{label}</p>
                      <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.56)', fontSize: '10px', lineHeight: 1.6, margin: 0 }}>{body}</p>
                    </div>
                  ))}
                </aside>
              </div>

              <div className="grid grid-cols-1 gap-px bg-black/10 sm:grid-cols-3" style={{ marginTop: '24px' }}>
                {['Ranked within the Project', 'Evaluation visible in the list', 'Details without leaving the workspace'].map((annotation) => (
                  <p key={annotation} style={{ ...fontStyle, backgroundColor: '#F7F9FD', color: '#2459d3', fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', lineHeight: '18px', margin: 0, padding: '16px 18px', textAlign: 'center', textTransform: 'uppercase' }}>{annotation}</p>
                ))}
              </div>
            </div>

            <div hidden style={{ marginTop: 'clamp(80px, 10vw, 128px)' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 24px', textTransform: 'uppercase' }}>Three layers of the workspace</p>
              <div className="grid grid-cols-1 md:grid-cols-3" style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.14)', borderTop: '1px solid rgba(10, 10, 10, 0.14)' }}>
                {[
                  ['Ranked list', 'Surface the most relevant people first', 'Profiles were organized within the current Project and ranked using its evaluation framework.'],
                  ['Evaluation overview', 'Compare people using the same criteria', 'The list surfaced each person’s result so profiles could be compared within the Project.'],
                  ['Profile Panel', 'Inspect a person without leaving the list', 'Selecting a profile revealed detailed information and evaluation context while preserving list position.'],
                ].map(([eyebrow, title, body], index) => (
                  <article key={eyebrow} className={index > 0 ? 'border-t border-black/15 md:border-l md:border-t-0' : ''} style={{ display: 'flex', flexDirection: 'column', minHeight: '370px', padding: 'clamp(32px, 5vw, 52px)' }}>
                    <p style={{ ...fontStyle, color: 'rgba(36, 89, 211, 0.72)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', lineHeight: '17px', margin: '0 0 42px', textTransform: 'uppercase' }}>{String(index + 1).padStart(2, '0')} — {eyebrow}</p>
                    <h3 style={{ ...fontStyle, color: index === 2 ? '#2459d3' : textColor.strong, fontSize: 'clamp(22px, 2.3vw, 30px)', fontWeight: 500, lineHeight: 1.2, margin: '0 0 20px' }}>{title}</h3>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.54)', fontSize: '14px', fontWeight: 300, lineHeight: 1.65, margin: 0 }}>{body}</p>
                  </article>
                ))}
              </div>
            </div>

            <div hidden style={{ marginTop: 'clamp(80px, 10vw, 120px)' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 24px', textTransform: 'uppercase' }}>How users reviewed people</p>
              <div style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.14)', borderTop: '1px solid rgba(10, 10, 10, 0.14)', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))', overflowX: 'auto' }}>
                {[
                  ['Scan', 'Review the Project at a glance', 'Scan the people list, ranking, and evaluation results.'],
                  ['Compare', 'Identify stronger and weaker matches', 'Compare multiple people against the same Project goal.'],
                  ['Inspect', 'Open the Profile Panel for detail', 'Examine one person without navigating away from the list.'],
                  ['Prioritize', 'Decide who deserves attention', 'Focus further review on the people most relevant to the Project.'],
                ].map(([action, title, body], index) => (
                  <article key={action} style={{ borderLeft: index > 0 ? '1px solid rgba(10, 10, 10, 0.1)' : 0, minHeight: '280px', padding: '36px 30px' }}>
                    <p style={{ ...fontStyle, color: 'rgba(36, 89, 211, 0.7)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', margin: '0 0 36px', textTransform: 'uppercase' }}>{String(index + 1).padStart(2, '0')} — {action}</p>
                    <h3 style={{ ...fontStyle, color: index === 3 ? '#2459d3' : textColor.strong, fontSize: '22px', fontWeight: 500, lineHeight: 1.2, margin: '0 0 18px' }}>{title}</h3>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.54)', fontSize: '13px', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>{body}</p>
                  </article>
                ))}
              </div>
            </div>

            <div hidden style={{ backgroundColor: '#FAFAFA', borderBottom: '1px solid rgba(10, 10, 10, 0.12)', borderTop: '1px solid rgba(10, 10, 10, 0.12)', marginTop: 'clamp(80px, 10vw, 128px)', padding: 'clamp(40px, 6vw, 64px)' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 18px', textTransform: 'uppercase' }}>Keeping list and detail in the same context</p>
              <h2 style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(30px, 3.8vw, 48px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.12, margin: '0 0 24px' }}>Reducing the experience from three layers to two</h2>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.52)', fontSize: '14px', fontWeight: 300, lineHeight: 1.65, margin: '0 0 clamp(40px, 6vw, 58px)', maxWidth: '900px' }}>The earlier structure separated profile list and detail across navigation levels. The Project workspace kept comparison and detailed review in one environment.</p>
              {[
                { label: 'Before', nodes: ['Project list', 'Profile list', 'Profile detail'], note: 'Three separate navigation levels' },
                { label: 'After', nodes: ['Project list', 'Project workspace'], note: 'People list · Ranking · Evaluation · Profile Panel' },
              ].map((model, rowIndex) => (
                <div key={model.label} className="grid grid-cols-1 gap-5 border-t border-black/15 py-7 md:grid-cols-[110px_1fr_330px]" style={{ alignItems: 'center' }}>
                  <p style={{ ...fontStyle, color: rowIndex === 1 ? '#2459d3' : 'rgba(10, 10, 10, 0.46)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', margin: 0, textTransform: 'uppercase' }}>{model.label}</p>
                  <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {model.nodes.map((node, index) => (
                      <span key={node} style={{ alignItems: 'center', display: 'inline-flex', gap: '10px' }}>
                        <span style={{ ...fontStyle, backgroundColor: rowIndex === 1 && index === 1 ? 'rgba(36, 89, 211, 0.08)' : '#FFFFFF', border: rowIndex === 1 && index === 1 ? '1px solid rgba(36, 89, 211, 0.25)' : '1px solid rgba(10, 10, 10, 0.12)', color: rowIndex === 1 && index === 1 ? '#2459d3' : 'rgba(10, 10, 10, 0.58)', fontSize: '12px', fontWeight: 500, lineHeight: '18px', padding: '10px 14px' }}>{node}</span>
                        {index < model.nodes.length - 1 && <span aria-hidden="true" style={{ color: 'rgba(10, 10, 10, 0.3)' }}>→</span>}
                      </span>
                    ))}
                  </div>
                  <p style={{ ...fontStyle, color: rowIndex === 1 ? '#2459d3' : 'rgba(10, 10, 10, 0.42)', fontSize: '11px', lineHeight: 1.5, margin: 0 }}>{model.note}</p>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid rgba(10, 10, 10, 0.14)', marginTop: 'clamp(80px, 10vw, 120px)', paddingTop: 'clamp(52px, 7vw, 80px)' }}>
              <p style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(36px, 4.4vw, 54px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.12, margin: '0 0 24px', maxWidth: '1100px' }}>
                The dashboard turned a collection of saved profiles into a <span style={{ color: '#2459d3' }}>prioritized working list.</span>
              </p>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.5)', fontSize: '16px', fontWeight: 300, lineHeight: 1.6, margin: 0, maxWidth: '880px' }}>
                Users could move between overview and detail without losing the Project context behind each evaluation.
              </p>
            </div>

            <div hidden>

            <div style={{ backgroundColor: '#F7F9FD', border: '1px solid rgba(36, 89, 211, 0.12)', padding: 'clamp(32px, 6vw, 72px)' }}>
              <h2 style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(34px, 4.4vw, 56px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 22px', maxWidth: '980px' }}>
                Project preserved the context behind every profile.
              </h2>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.6)', fontSize: '17px', fontWeight: 300, lineHeight: 1.65, margin: '0 0 clamp(48px, 7vw, 76px)', maxWidth: '980px' }}>
                A saved profile retained its source, AI evaluation, notes, current stage, and next action. Users could move from reviewing a LinkedIn result to managing the person without rebuilding the context in a spreadsheet, ATS, or CRM.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-[8fr_4fr]" style={{ border: '1px solid rgba(10, 10, 10, 0.1)' }}>
                <div style={{ backgroundColor: '#FFFFFF', minHeight: '620px', overflow: 'hidden' }}>
                  <div style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.1)', padding: '24px' }}>
                    <div style={{ alignItems: 'flex-start', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.38)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.08em', margin: '0 0 8px', textTransform: 'uppercase' }}>
                          Project workspace
                        </p>
                        <h3 style={{ ...fontStyle, color: textColor.strong, fontSize: '20px', fontWeight: 500, lineHeight: 1.2, margin: 0 }}>
                          Senior Product Recruiter · AI SaaS
                        </h3>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                        {['All stages', 'Fit: High to low', 'Owner', 'Next action'].map((filter) => (
                          <span key={filter} style={{ ...fontStyle, border: '1px solid rgba(10, 10, 10, 0.12)', borderRadius: '999px', color: 'rgba(10, 10, 10, 0.5)', fontSize: '9px', lineHeight: '16px', padding: '5px 9px' }}>
                            {filter}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <div style={{ minWidth: '700px' }}>
                      <div
                        style={{
                          ...fontStyle,
                          backgroundColor: '#F6F7F9',
                          color: 'rgba(10, 10, 10, 0.38)',
                          display: 'grid',
                          fontSize: '9px',
                          fontWeight: 500,
                          gridTemplateColumns: '42px minmax(210px,1.5fr) 64px 110px 90px 120px',
                          letterSpacing: '0.05em',
                          padding: '12px 18px',
                          textTransform: 'uppercase',
                        }}
                      >
                        <span>#</span><span>Person</span><span>Fit</span><span>Stage</span><span>Owner</span><span>Next action</span>
                      </div>
                      {[
                        { rank: '01', name: 'Alex Morgan', role: 'Senior Product Recruiter · Aperture AI', fit: '92', stage: 'Qualified', owner: 'Mei', action: 'Review evidence', active: true },
                        { rank: '02', name: 'Olivia Chen', role: 'TA Lead · Enterprise Software', fit: '87', stage: 'Contacted', owner: 'Jordan', action: 'Follow up Friday', active: false },
                        { rank: '03', name: 'Marco Silva', role: 'Growth Recruiter · B2B Tech', fit: '81', stage: 'Sourced', owner: 'Mei', action: 'Qualify profile', active: false },
                        { rank: '04', name: 'Priya Nair', role: 'Recruiting Partner · Fintech', fit: '76', stage: 'Replied', owner: 'Alex', action: 'Schedule call', active: false },
                        { rank: '05', name: 'Sarah Chen', role: 'Technical Sourcer · AI Platform', fit: '71', stage: 'Sourced', owner: '—', action: 'Assign owner', active: false },
                      ].map((person) => (
                        <div
                          key={person.name}
                          style={{
                            ...fontStyle,
                            alignItems: 'center',
                            backgroundColor: person.active ? 'rgba(36, 89, 211, 0.055)' : '#FFFFFF',
                            borderBottom: '1px solid rgba(10, 10, 10, 0.07)',
                            borderLeft: person.active ? '2px solid #2459d3' : '2px solid transparent',
                            color: 'rgba(10, 10, 10, 0.54)',
                            display: 'grid',
                            fontSize: '10px',
                            gridTemplateColumns: '42px minmax(210px,1.5fr) 64px 110px 90px 120px',
                            minHeight: '76px',
                            padding: '12px 16px',
                          }}
                        >
                          <span style={{ color: 'rgba(10, 10, 10, 0.3)' }}>{person.rank}</span>
                          <span>
                            <strong style={{ color: textColor.strong, display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px' }}>{person.name}</strong>
                            <span style={{ color: 'rgba(10, 10, 10, 0.42)', fontSize: '9px' }}>{person.role}</span>
                          </span>
                          <strong style={{ color: '#2459d3', fontSize: '17px', fontWeight: 500 }}>{person.fit}</strong>
                          <span style={{ backgroundColor: 'rgba(36, 89, 211, 0.07)', color: '#2459d3', justifySelf: 'start', padding: '5px 8px' }}>{person.stage}</span>
                          <span>{person.owner}</span>
                          <span>{person.action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <aside style={{ backgroundColor: '#FFFFFF', borderLeft: '1px solid rgba(10, 10, 10, 0.1)', display: 'flex', flexDirection: 'column', minHeight: '620px', padding: 'clamp(26px, 4vw, 42px)' }}>
                  <div style={{ alignItems: 'center', display: 'flex', gap: '14px', marginBottom: '30px' }}>
                    <span style={{ ...fontStyle, alignItems: 'center', backgroundColor: 'rgba(36, 89, 211, 0.12)', borderRadius: '50%', color: '#2459d3', display: 'flex', fontSize: '12px', fontWeight: 500, height: '48px', justifyContent: 'center', width: '48px' }}>AM</span>
                    <div>
                      <h3 style={{ ...fontStyle, color: textColor.strong, fontSize: '18px', fontWeight: 500, lineHeight: 1.2, margin: '0 0 4px' }}>Alex Morgan</h3>
                      <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.48)', fontSize: '10px', lineHeight: '16px', margin: 0 }}>Senior Product Recruiter · Aperture AI</p>
                    </div>
                  </div>
                  <div style={{ alignItems: 'center', backgroundColor: 'rgba(36, 89, 211, 0.055)', border: '1px solid rgba(36, 89, 211, 0.14)', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', padding: '14px' }}>
                    <span style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.5)', fontSize: '10px', textTransform: 'uppercase' }}>Project fit</span>
                    <strong style={{ ...fontStyle, color: '#2459d3', fontSize: '24px', fontWeight: 500 }}>92</strong>
                  </div>
                  <div style={{ borderTop: '1px solid rgba(10, 10, 10, 0.1)', paddingTop: '20px' }}>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.38)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.07em', margin: '0 0 12px', textTransform: 'uppercase' }}>Evaluation evidence</p>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.58)', fontSize: '11px', lineHeight: 1.55, margin: '0 0 20px' }}>8+ years in product and technical recruiting with direct AI and enterprise SaaS experience.</p>
                  </div>
                  <div style={{ borderTop: '1px solid rgba(10, 10, 10, 0.1)', paddingTop: '20px' }}>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.38)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.07em', margin: '0 0 10px', textTransform: 'uppercase' }}>Notes and activity</p>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.54)', fontSize: '10px', lineHeight: 1.55, margin: '0 0 8px' }}>Mei · Reviewed evidence and marked as qualified.</p>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.38)', fontSize: '9px', lineHeight: 1.5, margin: 0 }}>Today, 10:42</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2" style={{ marginTop: 'auto', paddingTop: '28px' }}>
                    <span style={{ ...fontStyle, border: '1px solid rgba(10, 10, 10, 0.14)', color: 'rgba(10, 10, 10, 0.58)', fontSize: '10px', fontWeight: 500, padding: '10px', textAlign: 'center' }}>Stage · Qualified</span>
                    <span style={{ ...fontStyle, backgroundColor: '#2459d3', color: '#FFFFFF', fontSize: '10px', fontWeight: 500, padding: '10px', textAlign: 'center' }}>Add to Campaign</span>
                  </div>
                </aside>
              </div>

              <div className="grid grid-cols-1 gap-px bg-black/10 sm:grid-cols-3" style={{ marginTop: '24px' }}>
                {['Ranked within the Project', 'Details without leaving the list', 'Stage and next action in context'].map((annotation) => (
                  <p key={annotation} style={{ ...fontStyle, backgroundColor: '#F7F9FD', color: '#2459d3', fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', lineHeight: '18px', margin: 0, padding: '16px 18px', textAlign: 'center', textTransform: 'uppercase' }}>
                    {annotation}
                  </p>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'clamp(80px, 10vw, 128px)' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 24px', textTransform: 'uppercase' }}>
                Three parts of the Project workspace
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3" style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.14)', borderTop: '1px solid rgba(10, 10, 10, 0.14)' }}>
                {[
                  {
                    eyebrow: '01 — Prioritized people',
                    title: 'Start with the strongest matches',
                    body: 'People were listed by relevance to the current Project, allowing users to compare fit and focus on the most promising candidates or leads first.',
                    note: 'Ranking remained specific to the Project because the same person could have different relevance in another context.',
                  },
                  {
                    eyebrow: '02 — Profile context',
                    title: 'Review the person without leaving the workspace',
                    body: 'Selecting a person opened a detail panel containing profile information, evaluation breakdown, notes, and activity history.',
                    note: 'Users could investigate a profile and return to the list without losing filters, ranking, or position.',
                  },
                  {
                    eyebrow: '03 — Pipeline progress',
                    title: 'Record where every person stood',
                    body: 'Each person had a current stage, ownership, latest activity, and next action within the Project.',
                    note: 'The Project became a living pipeline rather than a static collection of saved profiles.',
                  },
                ].map((area, index) => (
                  <article key={area.title} className={index > 0 ? 'border-t border-black/15 md:border-l md:border-t-0' : ''} style={{ display: 'flex', flexDirection: 'column', minHeight: '390px', padding: 'clamp(32px, 5vw, 52px)' }}>
                    <p style={{ ...fontStyle, color: 'rgba(36, 89, 211, 0.72)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', lineHeight: '17px', margin: '0 0 42px', textTransform: 'uppercase' }}>{area.eyebrow}</p>
                    <h2 style={{ ...fontStyle, color: index === 2 ? '#2459d3' : textColor.strong, fontSize: 'clamp(23px, 2.4vw, 31px)', fontWeight: 500, lineHeight: 1.18, margin: '0 0 20px' }}>{area.title}</h2>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.58)', fontSize: '15px', fontWeight: 300, lineHeight: 1.65, margin: '0 0 28px' }}>{area.body}</p>
                    <p style={{ ...fontStyle, borderTop: '1px solid rgba(10, 10, 10, 0.1)', color: 'rgba(10, 10, 10, 0.42)', fontSize: '12px', fontWeight: 400, lineHeight: 1.55, margin: 'auto 0 0', paddingTop: '18px' }}>{area.note}</p>
                  </article>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#FAFAFA', borderBottom: '1px solid rgba(10, 10, 10, 0.12)', borderTop: '1px solid rgba(10, 10, 10, 0.12)', marginTop: 'clamp(80px, 10vw, 128px)', padding: 'clamp(40px, 6vw, 64px)' }}>
              <h2 style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(30px, 3.8vw, 48px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.12, margin: '0 0 clamp(44px, 6vw, 64px)' }}>
                Reducing navigation from three layers to two
              </h2>
              {[
                { label: 'Before', nodes: ['Project list', 'Profile list', 'Profile detail'], note: 'Context changed across three separate pages.' },
                { label: 'After', nodes: ['Project list', 'Project workspace'], note: 'Ranking · Detail · Evaluation · Pipeline' },
              ].map((model, rowIndex) => (
                <div key={model.label} className="grid grid-cols-1 gap-5 border-t border-black/15 py-7 md:grid-cols-[110px_1fr_280px]" style={{ alignItems: 'center' }}>
                  <p style={{ ...fontStyle, color: rowIndex === 1 ? '#2459d3' : 'rgba(10, 10, 10, 0.46)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', margin: 0, textTransform: 'uppercase' }}>{model.label}</p>
                  <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {model.nodes.map((node, index) => (
                      <span key={node} style={{ alignItems: 'center', display: 'inline-flex', gap: '10px' }}>
                        <span style={{ ...fontStyle, backgroundColor: rowIndex === 1 && index === 1 ? 'rgba(36, 89, 211, 0.08)' : '#FFFFFF', border: rowIndex === 1 && index === 1 ? '1px solid rgba(36, 89, 211, 0.25)' : '1px solid rgba(10, 10, 10, 0.12)', color: rowIndex === 1 && index === 1 ? '#2459d3' : 'rgba(10, 10, 10, 0.58)', fontSize: '12px', fontWeight: 500, lineHeight: '18px', padding: '10px 14px' }}>{node}</span>
                        {index < model.nodes.length - 1 && <span aria-hidden="true" style={{ color: 'rgba(10, 10, 10, 0.3)' }}>→</span>}
                      </span>
                    ))}
                  </div>
                  <p style={{ ...fontStyle, color: rowIndex === 1 ? '#2459d3' : 'rgba(10, 10, 10, 0.42)', fontSize: '11px', lineHeight: 1.5, margin: 0 }}>{model.note}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 'clamp(80px, 10vw, 120px)' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 24px', textTransform: 'uppercase' }}>
                How users managed people
              </p>
              <div style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.14)', borderTop: '1px solid rgba(10, 10, 10, 0.14)', overflowX: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))', minWidth: '880px' }}>
                  {[
                    { action: 'Compare', title: 'Review people against the same goal', body: 'Scan fit, criteria, stage, and key profile details across the Project list.' },
                    { action: 'Inspect', title: 'Open details without losing the list', body: 'Use a side panel to reveal profile and evaluation information in context.' },
                    { action: 'Update', title: 'Keep progress visible to the team', body: 'Change stage, add notes, assign ownership, and define the next action.' },
                    { action: 'Select', title: 'Move the right people toward outreach', body: 'Send qualified candidates or leads to a Campaign without recreating the audience.' },
                  ].map((item, index) => (
                    <article key={item.action} style={{ borderLeft: index > 0 ? '1px solid rgba(10, 10, 10, 0.1)' : 0, minHeight: '280px', padding: '36px 30px' }}>
                      <p style={{ ...fontStyle, color: 'rgba(36, 89, 211, 0.7)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', margin: '0 0 36px', textTransform: 'uppercase' }}>{String(index + 1).padStart(2, '0')} — {item.action}</p>
                      <h3 style={{ ...fontStyle, color: index === 3 ? '#2459d3' : textColor.strong, fontSize: '22px', fontWeight: 500, lineHeight: 1.2, margin: '0 0 18px' }}>{item.title}</h3>
                      <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.54)', fontSize: '13px', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>{item.body}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'clamp(80px, 10vw, 120px)' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 28px', textTransform: 'uppercase' }}>
                One model, different pipelines
              </p>
              {[
                { label: 'Recruiting', stages: ['Sourced', 'Qualified', 'Contacted', 'Replied', 'Submitted', 'Interviewing', 'Placed'] },
                { label: 'Sales', stages: ['Identified', 'Qualified', 'Contacted', 'Replied', 'Meeting', 'Opportunity', 'Converted'] },
              ].map((pipeline) => (
                <div key={pipeline.label} className="grid grid-cols-1 gap-5 border-t border-black/15 py-7 lg:grid-cols-[150px_1fr]">
                  <p style={{ ...fontStyle, color: textColor.strong, fontSize: '14px', fontWeight: 500, lineHeight: '22px', margin: 0 }}>{pipeline.label}</p>
                  <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {pipeline.stages.map((stage, index) => (
                      <span key={stage} style={{ alignItems: 'center', display: 'inline-flex', gap: '8px' }}>
                        <span style={{ ...fontStyle, border: '1px solid rgba(10, 10, 10, 0.12)', borderRadius: '999px', color: 'rgba(10, 10, 10, 0.58)', fontSize: '11px', fontWeight: 400, lineHeight: '18px', padding: '5px 10px' }}>{stage}</span>
                        {index < pipeline.stages.length - 1 && <span aria-hidden="true" style={{ color: 'rgba(10, 10, 10, 0.28)', fontSize: '14px' }}>→</span>}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <p style={{ ...fontStyle, borderTop: '1px solid rgba(10, 10, 10, 0.14)', color: 'rgba(10, 10, 10, 0.5)', fontSize: '14px', fontWeight: 300, lineHeight: 1.6, margin: 0, paddingTop: '24px' }}>
                The stage labels could change by workflow, while the underlying model remained consistent: status, activity, ownership, next action, and outcome.
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(10, 10, 10, 0.14)', marginTop: 'clamp(80px, 10vw, 120px)', paddingTop: 'clamp(52px, 7vw, 80px)' }}>
              <p style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(34px, 4.2vw, 52px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.12, margin: '0 0 24px', maxWidth: '1080px' }}>
                Project turned a search result into a{' '}<span style={{ color: '#2459d3' }}>managed relationship.</span>
              </p>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.5)', fontSize: '16px', fontWeight: 300, lineHeight: 1.6, margin: 0, maxWidth: '840px' }}>
                It preserved why the person was relevant, what had already happened, and what the team needed to do next.
              </p>
            </div>
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>

      <section
        hidden
        className="w-screen"
        data-case-nav-label="Building and Shipping in Six Weeks"
        style={{
          backgroundColor: '#FAFAFA',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          padding: 'clamp(88px, 11vw, 152px) clamp(24px, 6vw, 96px)',
        }}
      >
        <ScrollAnimatedSection>
          <div style={{ margin: '0 auto', maxWidth: '1400px' }}>
            <p style={{ ...fontStyle, color: '#2459d3', fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 16px', textTransform: 'uppercase' }}>
              05 — Building and shipping in six weeks
            </p>
            <h1 style={{ ...headingLevel1Style, fontSize: 'clamp(44px, 5.5vw, 68px)', lineHeight: 1.06, marginBottom: '28px', maxWidth: '1080px' }}>
              Creating enough structure to move fast without creating chaos
            </h1>
            <div style={{ marginBottom: 'clamp(72px, 9vw, 112px)', maxWidth: '920px' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.64)', fontSize: 'clamp(18px, 1.8vw, 22px)', fontWeight: 300, lineHeight: 1.6, margin: '0 0 16px' }}>
                With only six weeks to design the MVP, the challenge was not simply producing screens quickly. The Chrome Extension and web dashboard also needed to feel like one product and remain practical for engineering to build.
              </p>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.64)', fontSize: 'clamp(18px, 1.8vw, 22px)', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>
                I created a lightweight design foundation using Figma Variables, design tokens, and reusable components. This allowed the team to move quickly without treating every new screen as a separate design problem.
              </p>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(10, 10, 10, 0.1)', padding: 'clamp(32px, 6vw, 72px)' }}>
              <h2 style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(34px, 4.4vw, 56px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 22px', maxWidth: '980px' }}>
                Build the system alongside the product
              </h2>
              <div style={{ marginBottom: 'clamp(48px, 7vw, 76px)', maxWidth: '940px' }}>
                <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.62)', fontSize: '17px', fontWeight: 300, lineHeight: 1.65, margin: '0 0 8px' }}>
                  Instead of waiting until the interface was complete, I established the core visual rules and reusable patterns while designing the MVP.
                </p>
                <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.62)', fontSize: '17px', fontWeight: 300, lineHeight: 1.65, margin: 0 }}>
                  The goal was not a comprehensive design system. It was the minimum structure required for consistent and efficient delivery.
                </p>
              </div>

              <div hidden style={{ border: '1px solid rgba(10, 10, 10, 0.1)', overflow: 'hidden' }}>
                <DesignSystemComponentsMock fontStyle={fontStyle} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2" style={{ border: '1px solid rgba(10, 10, 10, 0.1)' }}>
                <div style={{ backgroundColor: '#F5F7FA', borderRight: '1px solid rgba(10, 10, 10, 0.1)', minHeight: '540px', padding: 'clamp(28px, 4vw, 46px)' }}>
                  <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.38)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.08em', margin: '0 0 34px', textTransform: 'uppercase' }}>Figma Variables</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      ['Color', 'Brand / Primary', '#2459D3'],
                      ['Typography', 'Text / Strong', 'Inter 500'],
                      ['Spacing', 'Space / 06', '24 px'],
                      ['Radius', 'Radius / Medium', '6 px'],
                      ['State', 'Action / Selected', 'Primary 08%'],
                    ].map(([group, name, value], index) => (
                      <div key={name} style={{ alignItems: 'center', backgroundColor: '#FFFFFF', border: index === 0 ? '1px solid rgba(36, 89, 211, 0.2)' : '1px solid rgba(10, 10, 10, 0.09)', display: 'grid', gap: '12px', gridTemplateColumns: '80px 1fr auto', padding: '15px' }}>
                        <span style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.36)', fontSize: '9px', fontWeight: 500, textTransform: 'uppercase' }}>{group}</span>
                        <span style={{ ...fontStyle, color: textColor.strong, fontSize: '11px', fontWeight: 500 }}>{name}</span>
                        <span style={{ ...fontStyle, color: index === 0 ? '#2459d3' : 'rgba(10, 10, 10, 0.48)', fontSize: '10px' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                  <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '11px', lineHeight: 1.6, margin: '26px 0 0' }}>Recurring visual decisions stayed visible and reusable as the product expanded.</p>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', minHeight: '540px', padding: 'clamp(28px, 4vw, 46px)' }}>
                  <p style={{ ...fontStyle, color: '#2459d3', fontSize: '10px', fontWeight: 500, letterSpacing: '0.08em', margin: '0 0 34px', textTransform: 'uppercase' }}>Design tokens</p>
                  <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '28px' }}>
                    {[
                      ['Semantic color', ['#2459D3', '#EAF0FC', '#0A0A0A', '#FAFAFA']],
                      ['Spacing scale', ['4', '8', '16', '24']],
                      ['Type scale', ['12', '16', '24', '48']],
                      ['Corner radius', ['2', '4', '6', '999']],
                    ].map(([label, values], index) => (
                      <div key={label as string} style={{ border: '1px solid rgba(10, 10, 10, 0.09)', minHeight: '150px', padding: '18px' }}>
                        <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.4)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.06em', margin: '0 0 22px', textTransform: 'uppercase' }}>{label as string}</p>
                        <div style={{ alignItems: 'flex-end', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {(values as string[]).map((value, valueIndex) => (
                            index === 0 ? (
                              <span key={value} title={value} style={{ backgroundColor: value, border: '1px solid rgba(10, 10, 10, 0.1)', height: '28px', width: '28px' }} />
                            ) : (
                              <span key={value} style={{ ...fontStyle, alignItems: 'center', backgroundColor: index === 1 ? 'rgba(36, 89, 211, 0.07)' : '#F5F6F8', border: '1px solid rgba(10, 10, 10, 0.08)', color: 'rgba(10, 10, 10, 0.52)', display: 'flex', fontSize: index === 2 ? `${10 + valueIndex * 2}px` : '9px', height: index === 3 ? `${20 + valueIndex * 4}px` : '30px', justifyContent: 'center', minWidth: '30px', padding: '0 7px' }}>{value}</span>
                            )
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ borderTop: '1px solid rgba(10, 10, 10, 0.1)', paddingTop: '22px' }}>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.38)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.06em', margin: '0 0 14px', textTransform: 'uppercase' }}>Component states</p>
                    <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      <button type="button" style={{ ...fontStyle, backgroundColor: '#2459d3', border: 0, borderRadius: '6px', color: '#FFFFFF', cursor: 'default', fontSize: '10px', padding: '9px 14px' }}>Default</button>
                      <button type="button" style={{ ...fontStyle, backgroundColor: '#1E4BB5', border: 0, borderRadius: '6px', color: '#FFFFFF', cursor: 'default', fontSize: '10px', padding: '9px 14px' }}>Active</button>
                      <button type="button" disabled style={{ ...fontStyle, backgroundColor: '#E7E9ED', border: 0, borderRadius: '6px', color: 'rgba(10, 10, 10, 0.34)', fontSize: '10px', padding: '9px 14px' }}>Disabled</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-px bg-black/10 sm:grid-cols-3" style={{ marginTop: '24px' }}>
                {['Shared visual rules', 'Reusable values', 'Consistent states'].map((annotation) => (
                  <p key={annotation} style={{ ...fontStyle, backgroundColor: '#FFFFFF', color: '#2459d3', fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', lineHeight: '18px', margin: 0, padding: '16px 18px', textAlign: 'center', textTransform: 'uppercase' }}>{annotation}</p>
                ))}
              </div>
            </div>

            <div hidden style={{ marginTop: 'clamp(80px, 10vw, 128px)' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 24px', textTransform: 'uppercase' }}>Three parts of the foundation</p>
              <div className="grid grid-cols-1 md:grid-cols-3" style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.14)', borderTop: '1px solid rgba(10, 10, 10, 0.14)' }}>
                {[
                  { eyebrow: 'Variables and tokens', title: 'Create one source of truth', body: 'Figma Variables and design tokens defined recurring decisions across the Extension and web platform.', details: ['Semantic colors', 'Text styles', 'Spacing', 'Radius', 'State values'] },
                  { eyebrow: 'Reusable components', title: 'Design repeated patterns once', body: 'Frequently used interface elements became reusable components instead of being redesigned for each screen.', details: ['Buttons', 'Inputs', 'Navigation', 'Profile rows', 'Feedback states'] },
                  { eyebrow: 'Design and development alignment', title: 'Make implementation decisions visible early', body: 'Design and engineering shared reusable rules, component states, and recurring product patterns.', details: ['Shared rules', 'Visible states', 'Reusable behavior'] },
                ].map((item, index) => (
                  <article key={item.eyebrow} className={index > 0 ? 'border-t border-black/15 md:border-l md:border-t-0' : ''} style={{ display: 'flex', flexDirection: 'column', minHeight: '410px', padding: 'clamp(32px, 5vw, 52px)' }}>
                    <p style={{ ...fontStyle, color: 'rgba(36, 89, 211, 0.72)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', lineHeight: '17px', margin: '0 0 42px', textTransform: 'uppercase' }}>{String(index + 1).padStart(2, '0')} — {item.eyebrow}</p>
                    <h3 style={{ ...fontStyle, color: index === 2 ? '#2459d3' : textColor.strong, fontSize: 'clamp(22px, 2.3vw, 30px)', fontWeight: 500, lineHeight: 1.2, margin: '0 0 20px' }}>{item.title}</h3>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.54)', fontSize: '14px', fontWeight: 300, lineHeight: 1.65, margin: '0 0 28px' }}>{item.body}</p>
                    <p style={{ ...fontStyle, borderTop: '1px solid rgba(10, 10, 10, 0.1)', color: 'rgba(10, 10, 10, 0.4)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.04em', lineHeight: 1.8, margin: 'auto 0 0', paddingTop: '18px', textTransform: 'uppercase' }}>{item.details.join(' · ')}</p>
                  </article>
                ))}
              </div>
            </div>

            <div hidden style={{ marginTop: 'clamp(80px, 10vw, 128px)' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 24px', textTransform: 'uppercase' }}>One system across two surfaces</p>
              <h2 style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(30px, 3.8vw, 48px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.12, margin: '0 0 22px', maxWidth: '900px' }}>One visual language, adapted to different contexts</h2>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.52)', fontSize: '15px', fontWeight: 300, lineHeight: 1.65, margin: '0 0 clamp(40px, 6vw, 58px)', maxWidth: '900px' }}>The Chrome Extension and web dashboard had different space and interaction constraints, but still needed to feel like parts of the same product.</p>
              <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.14)', borderTop: '1px solid rgba(10, 10, 10, 0.14)' }}>
                {[
                  ['Chrome Extension', 'Compact and task-focused', ['Limited horizontal space', 'Short collection flow', 'Clear primary action', 'Immediate feedback']],
                  ['Web Dashboard', 'Information-dense and comparative', ['Larger workspace', 'Profile lists and rankings', 'Evaluation content', 'Detail panels']],
                ].map(([surface, title, details], index) => (
                  <article key={surface as string} className={index > 0 ? 'border-t border-black/15 md:border-l md:border-t-0' : ''} style={{ minHeight: '320px', padding: 'clamp(36px, 5vw, 56px)' }}>
                    <p style={{ ...fontStyle, color: 'rgba(36, 89, 211, 0.72)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', margin: '0 0 34px', textTransform: 'uppercase' }}>{surface as string}</p>
                    <h3 style={{ ...fontStyle, color: index === 0 ? '#2459d3' : textColor.strong, fontSize: 'clamp(24px, 2.6vw, 34px)', fontWeight: 500, lineHeight: 1.2, margin: '0 0 24px' }}>{title as string}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(details as string[]).map((detail) => <span key={detail} style={{ ...fontStyle, border: '1px solid rgba(10, 10, 10, 0.1)', color: 'rgba(10, 10, 10, 0.5)', fontSize: '10px', padding: '7px 10px' }}>{detail}</span>)}
                    </div>
                  </article>
                ))}
              </div>
              <p style={{ ...fontStyle, borderBottom: '1px solid rgba(10, 10, 10, 0.14)', color: '#2459d3', fontSize: '12px', fontWeight: 500, letterSpacing: '0.05em', lineHeight: 1.7, margin: 0, padding: '22px', textAlign: 'center', textTransform: 'uppercase' }}>Shared foundation · Color · Typography · Controls · States · Profile patterns</p>
            </div>

            <div style={{ borderTop: '1px solid rgba(10, 10, 10, 0.14)', marginTop: 'clamp(80px, 10vw, 120px)', paddingTop: 'clamp(52px, 7vw, 80px)' }}>
              <p style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(36px, 4.4vw, 54px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.12, margin: '0 0 24px', maxWidth: '1140px' }}>
                The design system was part of the MVP delivery strategy—<span style={{ color: '#2459d3' }}>not a separate project.</span>
              </p>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.5)', fontSize: '16px', fontWeight: 300, lineHeight: 1.6, margin: 0, maxWidth: '920px' }}>
                A lightweight foundation helped the team maintain consistency across two product surfaces while continuing to design and build in parallel.
              </p>
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>

      <section
        hidden
        className="w-screen"
        data-case-nav-label="Extending into Outreach"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          padding: 'clamp(88px, 11vw, 152px) clamp(24px, 6vw, 96px)',
        }}
      >
        <ScrollAnimatedSection>
          <div style={{ margin: '0 auto', maxWidth: '1400px' }}>
            <p style={{ ...fontStyle, color: '#2459d3', fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 16px', textTransform: 'uppercase' }}>
              06 — Extending into outreach
            </p>
            <span style={{ ...fontStyle, backgroundColor: 'rgba(36, 89, 211, 0.045)', border: '1px solid rgba(36, 89, 211, 0.28)', color: '#2459d3', display: 'inline-block', fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', marginBottom: '22px', padding: '6px 10px', textTransform: 'uppercase' }}>
              Ongoing
            </span>
            <h1 style={{ ...headingLevel1Style, fontSize: 'clamp(44px, 5.5vw, 68px)', lineHeight: 1.06, marginBottom: '28px', maxWidth: '1080px' }}>
              Turning prioritized people into structured outreach
            </h1>
            <div style={{ marginBottom: 'clamp(72px, 9vw, 112px)', maxWidth: '940px' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.64)', fontSize: 'clamp(18px, 1.8vw, 22px)', fontWeight: 300, lineHeight: 1.6, margin: '0 0 16px' }}>
                After users collected, evaluated, and ranked people, the next step was to contact the strongest candidates or leads.
              </p>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.64)', fontSize: 'clamp(18px, 1.8vw, 22px)', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>
                I began extending ConnectNova beyond sourcing and evaluation through an outreach module built around Campaigns, Leads, and messaging Sequences. This work was still ongoing and had not yet been fully delivered or validated.
              </p>
            </div>

            <div style={{ backgroundColor: '#F7F9FD', borderBottom: '1px solid rgba(36, 89, 211, 0.14)', borderTop: '1px solid rgba(36, 89, 211, 0.14)', padding: 'clamp(40px, 6vw, 64px)' }}>
              <p style={{ ...fontStyle, color: '#2459d3', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 20px', textTransform: 'uppercase' }}>Ongoing exploration</p>
              <h2 style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(30px, 3.8vw, 48px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.12, margin: '0 0 20px', maxWidth: '980px' }}>
                Move from deciding who matters to preparing how to reach them
              </h2>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.54)', fontSize: '15px', fontWeight: 300, lineHeight: 1.65, margin: '0 0 clamp(40px, 6vw, 58px)', maxWidth: '940px' }}>
                Selected profiles could move into a structured messaging workflow without rebuilding the audience or losing the Project context already collected.
              </p>
              <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[1fr_auto_1fr]">
                {[
                  { label: 'Project / ranked people', items: ['Selected profiles', 'Evaluation context', 'Prioritized people'], accent: false },
                  { label: 'Outreach module', items: ['Campaigns', 'Leads', 'Sequences'], accent: true },
                ].map((group, index) => (
                  <div key={group.label} style={{ display: 'contents' }}>
                    {index === 1 && <div aria-hidden="true" style={{ ...fontStyle, alignItems: 'center', color: '#2459d3', display: 'flex', fontSize: '28px', justifyContent: 'center', padding: '12px' }}>→</div>}
                    <div style={{ backgroundColor: group.accent ? 'rgba(36, 89, 211, 0.055)' : '#FFFFFF', border: group.accent ? '1px solid rgba(36, 89, 211, 0.2)' : '1px solid rgba(10, 10, 10, 0.1)', padding: 'clamp(28px, 4vw, 42px)' }}>
                      <p style={{ ...fontStyle, color: group.accent ? '#2459d3' : 'rgba(10, 10, 10, 0.4)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.08em', margin: '0 0 28px', textTransform: 'uppercase' }}>{group.label}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {group.items.map((item) => <span key={item} style={{ ...fontStyle, borderTop: '1px solid rgba(10, 10, 10, 0.1)', color: group.accent ? '#2459d3' : 'rgba(10, 10, 10, 0.56)', fontSize: '13px', fontWeight: 500, paddingTop: '12px' }}>{item}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div hidden style={{ marginTop: 'clamp(80px, 10vw, 128px)' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 24px', textTransform: 'uppercase' }}>Three parts of the outreach model</p>
              <div className="grid grid-cols-1 md:grid-cols-3" style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.14)', borderTop: '1px solid rgba(10, 10, 10, 0.14)' }}>
                {[
                  ['Campaigns', 'Organize outreach around a shared objective', 'Group selected people and prepare a coordinated recruiting or sales outreach effort.'],
                  ['Leads', 'Bring selected people into the outreach workflow', 'Connect people already reviewed in Projects with the next stage of the workflow.'],
                  ['Sequences', 'Structure messages into reusable steps', 'Prepare a clear, repeatable series of outreach messages instead of writing each independently.'],
                ].map(([module, title, body], index) => (
                  <article key={module} className={index > 0 ? 'border-t border-black/15 md:border-l md:border-t-0' : ''} style={{ display: 'flex', flexDirection: 'column', minHeight: '360px', padding: 'clamp(32px, 5vw, 52px)' }}>
                    <p style={{ ...fontStyle, color: 'rgba(36, 89, 211, 0.72)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', lineHeight: '17px', margin: '0 0 42px', textTransform: 'uppercase' }}>{String(index + 1).padStart(2, '0')} — {module}</p>
                    <h3 style={{ ...fontStyle, color: index === 2 ? '#2459d3' : textColor.strong, fontSize: 'clamp(22px, 2.3vw, 30px)', fontWeight: 500, lineHeight: 1.2, margin: '0 0 20px' }}>{title}</h3>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.54)', fontSize: '14px', fontWeight: 300, lineHeight: 1.65, margin: 0 }}>{body}</p>
                  </article>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#F7F9FD', border: '1px solid rgba(36, 89, 211, 0.12)', marginTop: 'clamp(80px, 10vw, 128px)', padding: 'clamp(32px, 6vw, 72px)' }}>
              <div className="grid grid-cols-1">
                <div hidden style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(10, 10, 10, 0.1)', padding: '10px' }}>
                  <Image
                    src="/img/connectnova/outreach%20.avif"
                    alt="ConnectNova outreach campaign and lead design exploration"
                    width={1600}
                    height={1000}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    style={{ display: 'block', height: 'auto', width: '100%' }}
                  />
                </div>
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(10, 10, 10, 0.1)', padding: 'clamp(10px, 2vw, 20px)' }}>
                  <Image
                    src="/img/connectnova/Workflow.avif"
                    alt="ConnectNova outreach platform information architecture"
                    width={2000}
                    height={1250}
                    sizes="100vw"
                    style={{ display: 'block', height: 'auto', width: '100%' }}
                  />
                </div>
              </div>

              <div hidden className="grid grid-cols-1 lg:grid-cols-2" style={{ border: '1px solid rgba(10, 10, 10, 0.1)' }}>
                <div style={{ backgroundColor: '#FFFFFF', borderRight: '1px solid rgba(10, 10, 10, 0.1)', minHeight: '580px' }}>
                  <div style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.1)', padding: '24px' }}>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.38)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.08em', margin: '0 0 8px', textTransform: 'uppercase' }}>Campaign / Lead screen</p>
                    <h3 style={{ ...fontStyle, color: textColor.strong, fontSize: '20px', fontWeight: 500, margin: 0 }}>AI Product Recruiter Outreach</h3>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', marginBottom: '22px' }}>
                      <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.4)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.07em', margin: 0, textTransform: 'uppercase' }}>Selected Leads · 3</p>
                      <span style={{ ...fontStyle, backgroundColor: 'rgba(36, 89, 211, 0.07)', color: '#2459d3', fontSize: '9px', padding: '6px 9px' }}>Project context connected</span>
                    </div>
                    {[
                      ['Alex Morgan', 'Senior Product Recruiter', '92'],
                      ['Olivia Chen', 'Talent Acquisition Lead', '87'],
                      ['Marco Silva', 'Growth Recruiter', '81'],
                    ].map(([name, role, score], index) => (
                      <div key={name} style={{ alignItems: 'center', backgroundColor: index === 0 ? 'rgba(36, 89, 211, 0.045)' : '#FFFFFF', border: index === 0 ? '1px solid rgba(36, 89, 211, 0.18)' : '1px solid rgba(10, 10, 10, 0.09)', display: 'grid', gap: '12px', gridTemplateColumns: '38px 1fr auto', marginBottom: '10px', padding: '15px' }}>
                        <span style={{ ...fontStyle, alignItems: 'center', backgroundColor: '#EEF2F8', borderRadius: '50%', color: '#2459d3', display: 'flex', fontSize: '9px', fontWeight: 500, height: '34px', justifyContent: 'center', width: '34px' }}>{name.split(' ').map((part) => part[0]).join('')}</span>
                        <span><strong style={{ ...fontStyle, color: textColor.strong, display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px' }}>{name}</strong><span style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '9px' }}>{role}</span></span>
                        <span style={{ ...fontStyle, color: '#2459d3', fontSize: '17px', fontWeight: 500 }}>{score}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', minHeight: '580px', padding: 'clamp(24px, 4vw, 38px)' }}>
                  <div style={{ alignItems: 'flex-start', display: 'flex', justifyContent: 'space-between', marginBottom: '28px' }}>
                    <div><p style={{ ...fontStyle, color: '#2459d3', fontSize: '9px', fontWeight: 500, letterSpacing: '0.08em', margin: '0 0 8px', textTransform: 'uppercase' }}>Sequence builder</p><h3 style={{ ...fontStyle, color: textColor.strong, fontSize: '20px', fontWeight: 500, margin: 0 }}>Initial outreach</h3></div>
                    <span style={{ ...fontStyle, border: '1px solid rgba(36, 89, 211, 0.24)', color: '#2459d3', fontSize: '9px', padding: '6px 9px', textTransform: 'uppercase' }}>Ongoing</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      ['01', 'Connection message', 'Personalized introduction using Project and profile context'],
                      ['02', 'First follow-up', 'Continue the conversation with a role or objective summary'],
                      ['03', 'Final follow-up', 'Close the sequence with a concise next step'],
                    ].map(([number, title, body], index) => (
                      <div key={number} style={{ backgroundColor: index === 0 ? 'rgba(36, 89, 211, 0.045)' : '#FAFAFA', border: index === 0 ? '1px solid rgba(36, 89, 211, 0.18)' : '1px solid rgba(10, 10, 10, 0.09)', display: 'grid', gap: '14px', gridTemplateColumns: '34px 1fr', padding: '17px' }}>
                        <span style={{ ...fontStyle, color: '#2459d3', fontSize: '11px', fontWeight: 500 }}>{number}</span>
                        <span><strong style={{ ...fontStyle, color: textColor.strong, display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '6px' }}>{title}</strong><span style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.44)', fontSize: '10px', lineHeight: 1.5 }}>{body}</span></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-px bg-black/10 sm:grid-cols-3" style={{ marginTop: '24px' }}>
                {['Group people into Campaigns', 'Manage selected Leads', 'Organize outreach into Sequence steps'].map((annotation) => <p key={annotation} style={{ ...fontStyle, backgroundColor: '#F7F9FD', color: '#2459d3', fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', lineHeight: '18px', margin: 0, padding: '16px 18px', textAlign: 'center', textTransform: 'uppercase' }}>{annotation}</p>)}
              </div>

              <div style={{ marginTop: 'clamp(48px, 7vw, 72px)' }}>
                <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 12px', textTransform: 'uppercase' }}>
                  Sequence editing canvas
                </p>
                <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.56)', fontSize: '15px', fontWeight: 300, lineHeight: 1.65, margin: '0 0 24px', maxWidth: '900px' }}>
                  Users can visually build and edit a Sequence by adding nodes and connecting steps. This original interactive prototype focuses on component organization and a first-pass interaction experience.
                </p>
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(10, 10, 10, 0.1)', height: 'min(620px, 72svh)', overflow: 'hidden' }}>
                  <iframe
                    title="ConnectNova outreach sequence prototype"
                    style={{ border: 0, display: 'block', height: '100%', width: '100%' }}
                    src="https://embed.figma.com/proto/e7hxbnwajw3R2vy3S79kQU/ConnectNova?node-id=379-1216&viewport=238%2C698%2C0.44&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=379%3A1216&page-id=373%3A1205&embed-host=share"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

            <div hidden style={{ marginTop: 'clamp(80px, 10vw, 120px)' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 24px', textTransform: 'uppercase' }}>Design direction</p>
              <div className="grid grid-cols-1 md:grid-cols-3" style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.14)', borderTop: '1px solid rgba(10, 10, 10, 0.14)' }}>
                {[
                  ['Familiar patterns', 'Reuse established structures for Campaign creation, Lead management, and Sequence building.'],
                  ['Connected workflow', 'Extend sourcing and evaluation instead of introducing a separate product.'],
                  ['Focused MVP', 'Define the essential structure before expanding into advanced outreach capabilities.'],
                ].map(([title, body], index) => (
                  <div key={title} className={index > 0 ? 'border-t border-black/15 md:border-l md:border-t-0' : ''} style={{ padding: '30px clamp(26px, 4vw, 42px)' }}>
                    <h3 style={{ ...fontStyle, color: index === 1 ? '#2459d3' : textColor.strong, fontSize: '18px', fontWeight: 500, lineHeight: 1.25, margin: '0 0 12px' }}>{title}</h3>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.5)', fontSize: '12px', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>{body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#FAFAFA', borderBottom: '1px solid rgba(10, 10, 10, 0.12)', borderTop: '1px solid rgba(10, 10, 10, 0.12)', marginTop: 'clamp(72px, 9vw, 112px)', padding: 'clamp(40px, 6vw, 64px)' }}>
              <p style={{ ...fontStyle, color: '#2459d3', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 30px', textTransform: 'uppercase' }}>Ongoing status</p>
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                {[
                  ['Designed or being explored', ['Campaign structure', 'Lead management views', 'Sequence creation', 'Multi-step message organization', 'Core outreach navigation']],
                  ['Not yet presented as validated outcomes', ['Final workflow and implementation', 'Usability or product-performance results', 'Advanced outreach capabilities', 'Pipeline capabilities outside the completed MVP']],
                ].map(([title, items], index) => (
                  <div key={title as string} style={{ borderTop: index === 0 ? '2px solid rgba(36, 89, 211, 0.55)' : '1px solid rgba(10, 10, 10, 0.16)', paddingTop: '24px' }}>
                    <h3 style={{ ...fontStyle, color: index === 0 ? '#2459d3' : textColor.strong, fontSize: '18px', fontWeight: 500, margin: '0 0 22px' }}>{title as string}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>{(items as string[]).map((item) => <span key={item} style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.5)', fontSize: '12px', lineHeight: 1.5 }}>— {item}</span>)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(10, 10, 10, 0.14)', marginTop: 'clamp(80px, 10vw, 120px)', paddingTop: 'clamp(52px, 7vw, 80px)' }}>
              <p style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(36px, 4.4vw, 54px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.12, margin: '0 0 24px', maxWidth: '1160px' }}>
                Outreach was the next extension of the workflow—<span style={{ color: '#2459d3' }}>not part of the validated core MVP yet.</span>
              </p>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.5)', fontSize: '16px', fontWeight: 300, lineHeight: 1.6, margin: 0, maxWidth: '920px' }}>
                The exploration showed how ConnectNova could move from helping users decide who to prioritize toward helping them prepare structured outreach.
              </p>
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>

      <section
        hidden
        className="w-screen"
        data-case-nav-label="Results and Reflection"
        style={{
          backgroundColor: '#FAFAFA',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          padding: 'clamp(88px, 11vw, 152px) clamp(24px, 6vw, 96px)',
        }}
      >
        <ScrollAnimatedSection>
          <div style={{ margin: '0 auto', maxWidth: '1400px' }}>
            <p style={{ ...fontStyle, color: '#2459d3', fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 16px', textTransform: 'uppercase' }}>
              07 — Results and reflection
            </p>
            <h1 style={{ ...headingLevel1Style, fontSize: 'clamp(44px, 5.5vw, 68px)', lineHeight: 1.06, marginBottom: '28px', maxWidth: '1080px' }}>
              What the MVP validated—and what still needed work
            </h1>
            <div style={{ marginBottom: 'clamp(72px, 9vw, 112px)', maxWidth: '940px' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.64)', fontSize: 'clamp(18px, 1.8vw, 22px)', fontWeight: 300, lineHeight: 1.6, margin: '0 0 16px' }}>
                The six-week MVP demonstrated that ConnectNova could connect LinkedIn profile collection, Project-based organization, and AI-assisted evaluation into one coherent workflow.
              </p>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.64)', fontSize: 'clamp(18px, 1.8vw, 22px)', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>
                The results showed improvements in the core collection and evaluation experience, while also revealing where the product needed clearer measurement, broader validation, and continued development.
              </p>
            </div>

            <div>
              <p style={{ ...fontStyle, color: '#2459d3', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 18px', textTransform: 'uppercase' }}>Results</p>
              <h2 style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(30px, 3.8vw, 48px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.12, margin: '0 0 clamp(40px, 6vw, 58px)' }}>A more effective core workflow</h2>
              <div style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.14)', borderTop: '1px solid rgba(10, 10, 10, 0.14)', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(230px, 1fr))', overflowX: 'auto' }}>
                {[
                  ['76% → 93%', 'Collection completion rate', 'The redesigned collection flow improved successful task completion.'],
                  ['72% → 87%', 'Save rate after collection', 'Clearer save feedback improved completion after profiles were collected.'],
                  ['84%', 'Adopted AI-generated evaluation criteria', 'Most users retained at least part of the framework created by ConnectNova.'],
                  ['31%', 'Edited the generated criteria', 'Users treated AI as a starting point and adapted it to their own requirements.'],
                ].map(([value, label, body], index) => (
                  <article key={value} style={{ borderLeft: index > 0 ? '1px solid rgba(10, 10, 10, 0.1)' : 0, minHeight: '330px', minWidth: 0, overflow: 'hidden', padding: 'clamp(30px, 4vw, 44px) clamp(20px, 2vw, 28px)' }}>
                    <p style={{ ...fontStyle, color: '#2459d3', fontSize: index < 2 ? 'clamp(30px, 2.5vw, 42px)' : 'clamp(48px, 4.5vw, 66px)', fontWeight: 500, letterSpacing: index < 2 ? '-0.065em' : '-0.05em', lineHeight: 1, margin: '0 0 26px', maxWidth: '100%', whiteSpace: 'nowrap' }}>{value}</p>
                    <h3 style={{ ...fontStyle, color: textColor.strong, fontSize: '15px', fontWeight: 500, lineHeight: 1.4, margin: '0 0 14px' }}>{label}</h3>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.5)', fontSize: '12px', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>{body}</p>
                  </article>
                ))}
              </div>
              <div style={{ backgroundColor: 'rgba(36, 89, 211, 0.055)', borderBottom: '1px solid rgba(36, 89, 211, 0.14)', padding: 'clamp(30px, 5vw, 52px)' }}>
                <p style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(22px, 2.7vw, 34px)', fontWeight: 400, letterSpacing: '-0.015em', lineHeight: 1.35, margin: '0 0 16px', maxWidth: '1120px' }}>
                  The strongest signal was not only that users accepted AI-generated criteria, but that they also felt able to <span style={{ color: '#2459d3' }}>modify them.</span>
                </p>
                <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.5)', fontSize: '13px', fontWeight: 300, lineHeight: 1.65, margin: 0, maxWidth: '940px' }}>This supported making the evaluation framework visible and editable instead of presenting users with a fixed AI judgment.</p>
              </div>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.38)', fontSize: '10px', lineHeight: 1.6, margin: '18px 0 0' }}>Data note: Exact task definitions, sample size, testing method, and measurement period must be added from the original research records before publishing.</p>
            </div>

            <div hidden style={{ backgroundColor: '#F1F2F4', marginTop: 'clamp(80px, 10vw, 128px)', padding: 'clamp(40px, 6vw, 64px)' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 18px', textTransform: 'uppercase' }}>Limitations</p>
              <h2 style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(28px, 3.4vw, 44px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.15, margin: '0 0 clamp(38px, 5vw, 54px)' }}>What the current results did not prove</h2>
              <div style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.12)', borderTop: '1px solid rgba(10, 10, 10, 0.12)', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))', overflowX: 'auto' }}>
                {[
                  ['Limited validation scope', 'Results focused on collection and evaluation, not the complete vision across sourcing, outreach, and people management.'],
                  ['Incomplete metric definitions', 'The exported case study did not include full task names, sample size, or testing conditions.'],
                  ['Outreach remained ongoing', 'Campaigns, Leads, and Sequences had not yet produced validated usability or product-performance outcomes.'],
                  ['Re-ranking evidence still needed', 'The case contained stronger evidence for collection and evaluation than full AI re-ranking performance.'],
                ].map(([title, body], index) => (
                  <article key={title} style={{ borderLeft: index > 0 ? '1px solid rgba(10, 10, 10, 0.1)' : 0, minHeight: '230px', padding: '30px 26px' }}>
                    <h3 style={{ ...fontStyle, color: textColor.strong, fontSize: '17px', fontWeight: 500, lineHeight: 1.3, margin: '0 0 14px' }}>{title}</h3>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.5)', fontSize: '12px', fontWeight: 300, lineHeight: 1.65, margin: 0 }}>{body}</p>
                  </article>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'clamp(80px, 10vw, 128px)' }}>
              <p style={{ ...fontStyle, color: '#2459d3', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 18px', textTransform: 'uppercase' }}>Reflection</p>
              <h2 style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(30px, 3.8vw, 48px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.12, margin: '0 0 clamp(40px, 6vw, 58px)' }}>What the project changed in my practice</h2>
              <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.14)', borderTop: '1px solid rgba(10, 10, 10, 0.14)' }}>
                {[
                  { eyebrow: 'Code as a design medium', title: 'Prototype close to the final experience', learning: 'Working in code reduced translation between interaction decisions and implementation.', next: 'The closer the prototype is to real behavior, the faster the team can evaluate product decisions.' },
                  { eyebrow: 'Workflow before IA', title: 'Map the real job before shaping navigation', learning: 'The strongest architecture decisions came from understanding how sourcing continued beyond one search session.', next: 'Information architecture should follow the user’s work—not the first feature request.' },
                  { eyebrow: 'Same job, different context', title: 'Design one flexible model for shared behavior', learning: 'Recruiting and sales used different language but followed the same underlying people workflow.', next: 'Shared product objects can support different contexts without splitting the experience.' },
                  { eyebrow: 'Beyond the brief', title: 'Challenge short-term requests when the model is too narrow', learning: 'Introducing Project changed the product from a one-shot ranking tool into a reusable workspace.', next: 'A designer’s role includes identifying the structure the product will need next.' },
                  { eyebrow: 'Foundations create speed', title: 'Build reusable rules while building the product', learning: 'Tokens and components helped two product surfaces stay coherent within six weeks.', next: 'Speed came from good foundations, not from treating every screen as an exception.' },
                ].map((item, index) => (
                  <article key={item.eyebrow} className={`${index % 2 === 1 ? 'md:border-l md:border-black/15' : ''} ${index > 1 ? 'border-t border-black/15' : index === 1 ? 'border-t border-black/15 md:border-t-0' : ''}`} style={{ minHeight: '390px', padding: 'clamp(34px, 5vw, 54px)' }}>
                    <p style={{ ...fontStyle, color: 'rgba(36, 89, 211, 0.72)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', lineHeight: '17px', margin: '0 0 36px', textTransform: 'uppercase' }}>{String(index + 1).padStart(2, '0')} — {item.eyebrow}</p>
                    <h3 style={{ ...fontStyle, color: index === 3 ? '#2459d3' : textColor.strong, fontSize: 'clamp(23px, 2.5vw, 32px)', fontWeight: 500, lineHeight: 1.2, margin: '0 0 18px' }}>{item.title}</h3>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.54)', fontSize: '13px', fontWeight: 300, lineHeight: 1.65, margin: '0 0 24px' }}>{item.learning}</p>
                    <p style={{ ...fontStyle, borderTop: '1px solid rgba(10, 10, 10, 0.1)', color: index === 3 ? '#2459d3' : 'rgba(10, 10, 10, 0.44)', fontSize: '12px', lineHeight: 1.6, margin: 0, paddingTop: '18px' }}>{item.next}</p>
                  </article>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'clamp(80px, 10vw, 120px)' }}>
              <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.42)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 24px', textTransform: 'uppercase' }}>Next steps</p>
              <div style={{ borderBottom: '1px solid rgba(10, 10, 10, 0.14)', borderTop: '1px solid rgba(10, 10, 10, 0.14)', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))', overflowX: 'auto' }}>
                {[
                  ['Structured user testing', 'Validate the connected workflow with repeated, task-based studies.'],
                  ['Outreach automation', 'Test how Campaigns and Sequences extend the Project context.'],
                  ['Pipeline tracking', 'Explore status, progress, and outcomes after outreach.'],
                  ['Team collaboration', 'Define shared ownership, visibility, and coordinated follow-up.'],
                ].map(([title, body], index) => (
                  <article key={title} style={{ borderLeft: index > 0 ? '1px solid rgba(10, 10, 10, 0.1)' : 0, minHeight: '240px', padding: '32px 26px' }}>
                    <p style={{ ...fontStyle, color: 'rgba(36, 89, 211, 0.7)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', margin: '0 0 30px' }}>{String(index + 1).padStart(2, '0')}</p>
                    <h3 style={{ ...fontStyle, color: index === 3 ? '#2459d3' : textColor.strong, fontSize: '19px', fontWeight: 500, lineHeight: 1.25, margin: '0 0 14px' }}>{title}</h3>
                    <p style={{ ...fontStyle, color: 'rgba(10, 10, 10, 0.5)', fontSize: '12px', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>{body}</p>
                  </article>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(10, 10, 10, 0.14)', marginTop: 'clamp(80px, 10vw, 120px)', paddingTop: 'clamp(52px, 7vw, 80px)' }}>
              <p style={{ ...fontStyle, color: textColor.strong, fontSize: 'clamp(34px, 4.2vw, 52px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.14, margin: 0, maxWidth: '1200px' }}>
                The MVP validated a <span style={{ color: '#2459d3' }}>connected foundation</span> for collecting, organizing, and evaluating people—but the complete workflow still required <span style={{ color: '#2459d3' }}>broader validation</span> and continued development.
              </p>
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>

      {/* Process Section —— 四步线性叙事：Discovery → Product decision → IA → Design system。
          视觉策略：
          · 白底，紧接 Hero 展开方法论，再由 Problem 进入背景叙事
          · 两栏栅格（desktop 160px 编号列 | 1fr 叙事列），移动端堆叠
          · 大号 thin 数字 01/02/03/04 作为视觉脊梁，呼应 Problem 里的 "3–4 hrs/day" 排印节奏
          · Step 3 用纯 CSS "三层 vs 两层" IA 对比图作为分区 centerpiece，其它三步配统一样式的占位图
          · 整块顶部一条 hairline，作为 Hero 与正文内容切换的信号 */}
      <section
        hidden
        className="w-screen"
        data-case-nav-label="Design Process"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '96px',
          paddingBottom: '96px',
        }}
      >
        <ScrollAnimatedSection>
          <div style={{ maxWidth: CASE_STUDY_CONTENT_WIDTH, margin: '0 auto' }}>
            {/* 分区一级标题 + 导语 */}
            <h1 style={headingLevel1Style}>Design Process</h1>
            <p
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '30px',
                fontWeight: 400,
                color: 'rgba(0, 0, 0, 0.88)',
                maxWidth: '780px',
                marginBottom: '72px',
              }}
            >
              As the sole designer and frontend engineer on a two-person startup team, I run a compressed loop where prototyping happens in code, not Figma — eliminating the handoff entirely and letting the backend ship as soon as requirements are clear.
            </p>

            {/* 六阶段流程总览 */}
            <div
              className="grid grid-cols-1 md:grid-cols-3"
              style={{
                gap: '16px',
                marginBottom: '96px',
              }}
            >
              {[
                {
                  phase: 'Research',
                  title: 'Active research + live feedback',
                  body: 'Conducted user research and continuously collected real feedback from shipped V0 users — design decisions are grounded in actual usage, not assumptions.',
                  output: 'User insights',
                },
                {
                  phase: 'Prototype',
                  title: 'Build in code, not Figma',
                  body: 'Rapidly implemented functional frontend via vibe coding. The output is real, runnable code — not a static mockup — so there is no translation loss when handing off to the backend.',
                  output: 'Functional frontend',
                },
                {
                  phase: 'Validate',
                  title: 'Test with domain expertise',
                  body: 'Internal testing with the full team, including a market partner who works in the recruiting industry — validation is grounded in real domain knowledge.',
                  output: 'Validated flows',
                },
                {
                  phase: 'Ship',
                  title: 'Backend hooks in, MVP goes live',
                  body: 'The backend engineer connects APIs directly to the already-built frontend. Speed is possible because the frontend is real code from day one.',
                  output: 'Live product',
                },
                {
                  phase: 'Polish',
                  title: 'Design after shipping, not before',
                  body: 'Used Figma MCP to generate a Figma file from the live codebase, then systematically refined the UI — design decisions are grounded in what actually shipped.',
                  output: 'Refined UI system',
                },
                {
                  phase: 'Iterate',
                  title: 'Feedback feeds the next cycle',
                  body: 'Collect real user feedback, make targeted adjustments, and rapidly prototype the next version — the loop restarts from a position of live data.',
                  output: 'Next version brief',
                },
              ].map((item, i) => (
                <div
                  key={item.phase}
                  style={{
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    borderRadius: '16px',
                    background: i === 0 ? '#000000' : '#FFFFFF',
                    color: i === 0 ? '#FFFFFF' : 'rgb(0, 0, 0)',
                    padding: '24px',
                    minHeight: '240px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      ...fontStyle,
                      fontSize: '11px',
                      lineHeight: '16px',
                      fontWeight: 500,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: i === 0 ? 'rgba(255,255,255,0.58)' : 'oklch(0.556 0 0)',
                      marginBottom: '18px',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')} · {item.phase}
                  </div>
                  <h2
                    style={{
                      ...fontStyle,
                      fontSize: '18px',
                      lineHeight: '26px',
                      fontWeight: 500,
                      color: i === 0 ? '#FFFFFF' : 'rgb(0, 0, 0)',
                      marginTop: 0,
                      marginBottom: '12px',
                    }}
                  >
                    {item.title}
                  </h2>
                  <p
                    style={{
                      ...fontStyle,
                      fontSize: '14px',
                      lineHeight: '22px',
                      fontWeight: 400,
                      color: i === 0 ? 'rgba(255,255,255,0.72)' : 'rgba(0, 0, 0, 0.66)',
                      margin: 0,
                    }}
                  >
                    {item.body}
                  </p>
                  <div
                    style={{
                      ...fontStyle,
                      fontSize: '12px',
                      lineHeight: '18px',
                      fontWeight: 500,
                      color: i === 0 ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.35)',
                      marginTop: 'auto',
                      paddingTop: '24px',
                    }}
                  >
                    Output · {item.output}
                  </div>
                </div>
              ))}
            </div>

            {/* Problem Section —— 编辑体叙事：日常现实 + 现有工具为何不解决 + 设计挑战。
                用浅灰 #FAFAFA 与上（Hero，白）、下（UX research，白）区分节奏；
                内部三个小节用"编号眉题 + H2"的杂志排版节奏，避免与 UX research 的标题层级撞车。 */}
            <section
              hidden
              aria-hidden="true"
              className="w-screen"
              style={{
                backgroundColor: '#FAFAFA',
                marginLeft: 'calc(-50vw + 50%)',
                marginRight: 'calc(-50vw + 50%)',
                paddingTop: '80px',
                paddingBottom: '80px',
              }}
            >
              <ScrollAnimatedSection>
                <div style={{ maxWidth: CASE_STUDY_CONTENT_WIDTH, margin: '0 auto' }}>
                  {/* 分区一级标题 */}
                  <h1 style={headingLevel1Style}>Problem</h1>

                  {/* ——————————————————————————————————————————————
                      SUBSECTION 00 · Who it's for — Personas
                      —————————————————————————————————————————————— */}
                  <div style={{ marginBottom: '80px' }}>
                    <div style={{ ...fontStyle, fontSize: '12px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'oklch(0.556 0 0)', marginBottom: '12px' }}>
                      00 · Who it&apos;s for
                    </div>
                    <h2 style={{ ...fontStyle, fontSize: '28px', lineHeight: '36px', fontWeight: 500, color: 'rgb(0,0,0)', marginBottom: '12px' }}>
                      Two users, one shared problem
                    </h2>
                    <p style={{ ...fontStyle, fontSize: '17px', lineHeight: '28px', fontWeight: 400, color: 'rgba(0,0,0,0.65)', maxWidth: '680px', marginBottom: '36px' }}>
                      ConnectNova is built for anyone who finds people on LinkedIn — but two user types define the core problem space.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '16px' }}>

                      {/* Persona 01 — Alex Chen · Headhunter (Validated) */}
                      <div style={{ background: '#000', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column' as const }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                          <span style={{ ...fontStyle, fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.45)' }}>01 · Headhunter</span>
                          <span style={{ ...fontStyle, fontSize: '11px', fontWeight: 500, color: '#fff', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '999px', padding: '3px 10px' }}>Validated User</span>
                        </div>

                        <div style={{ ...fontStyle, fontSize: '22px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', marginBottom: '3px' }}>Alex Chen</div>
                        <div style={{ ...fontStyle, fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '24px' }}>Independent Headhunter · Technical &amp; Management Roles</div>

                        <blockquote style={{ margin: '0 0 24px', padding: '16px 18px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', borderLeft: '2px solid rgba(255,255,255,0.25)' }}>
                          <p style={{ ...fontStyle, fontSize: '15px', lineHeight: '24px', fontStyle: 'italic', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                            &ldquo;I can get 500 results from a LinkedIn search. The problem is I still have to open every single one.&rdquo;
                          </p>
                        </blockquote>

                        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px', marginBottom: '28px' }}>
                          {[
                            'Reviews ~500 profiles manually per search to build a shortlist',
                            'LinkedIn Recruiter Lite costs $170/month — but ranking who\'s worth contacting still relies on human judgment for every profile',
                            'Connection requests and follow-ups sent one by one — no way to scale outreach',
                          ].map((pt, i) => (
                            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.35)', flexShrink: 0, marginTop: '9px', display: 'inline-block' }} />
                              <span style={{ ...fontStyle, fontSize: '14px', lineHeight: '22px', color: 'rgba(255,255,255,0.68)' }}>{pt}</span>
                            </div>
                          ))}
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                          <div style={{ ...fontStyle, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.35)', marginBottom: '10px' }}>Current tools</div>
                          <span style={{ ...fontStyle, fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.65)', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)', borderRadius: '6px', padding: '4px 10px' }}>LinkedIn Recruiter Lite</span>
                        </div>
                      </div>

                      {/* Persona 02 — Jordan Park · Sales/BD (Target) */}
                      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column' as const }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                          <span style={{ ...fontStyle, fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'oklch(0.556 0 0)' }}>02 · Sales &amp; BD</span>
                          <span style={{ ...fontStyle, fontSize: '11px', fontWeight: 500, color: 'oklch(0.556 0 0)', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '999px', padding: '3px 10px' }}>Target User · Not yet validated</span>
                        </div>

                        <div style={{ ...fontStyle, fontSize: '22px', fontWeight: 600, color: '#000', letterSpacing: '-0.01em', marginBottom: '3px' }}>Jordan Park</div>
                        <div style={{ ...fontStyle, fontSize: '13px', color: 'oklch(0.556 0 0)', marginBottom: '24px' }}>Account Executive · B2B Sales &amp; Business Development</div>

                        <blockquote style={{ margin: '0 0 24px', padding: '16px 18px', background: 'rgba(0,0,0,0.03)', borderRadius: '10px', borderLeft: '2px solid rgba(0,0,0,0.18)' }}>
                          <p style={{ ...fontStyle, fontSize: '15px', lineHeight: '24px', fontStyle: 'italic', color: 'rgba(0,0,0,0.82)', margin: 0 }}>
                            &ldquo;Sales Navigator tells me who&apos;s out there. It doesn&apos;t tell me who&apos;s worth my time.&rdquo;
                          </p>
                        </blockquote>

                        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px', marginBottom: '28px' }}>
                          {[
                            'Sales Navigator gives a list — but ranking by ICP criteria is still manual evaluation for every profile',
                            'Dripify automates outreach sequences but requires a pre-curated list; it can\'t tell you who to contact',
                            'Two-tool workflow (Sales Nav → manual curation → Dripify) creates a gap that costs time and quality',
                          ].map((pt, i) => (
                            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(0,0,0,0.25)', flexShrink: 0, marginTop: '9px', display: 'inline-block' }} />
                              <span style={{ ...fontStyle, fontSize: '14px', lineHeight: '22px', color: 'rgba(0,0,0,0.68)' }}>{pt}</span>
                            </div>
                          ))}
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                          <div style={{ ...fontStyle, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'rgba(0,0,0,0.35)', marginBottom: '10px' }}>Current tools</div>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
                            {['LinkedIn Sales Navigator', 'Dripify'].map((tool) => (
                              <span key={tool} style={{ ...fontStyle, fontSize: '12px', fontWeight: 500, color: 'rgba(0,0,0,0.6)', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', padding: '4px 10px' }}>{tool}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* ——————————————————————————————————————————————
                      SUBSECTION 01 · Field observation
                      —————————————————————————————————————————————— */}
                  <div style={{ marginBottom: '64px' }}>
                    <div style={{ ...fontStyle, fontSize: '12px', lineHeight: '16px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'oklch(0.556 0 0)', marginBottom: '12px' }}>
                      01 · Field observation
                    </div>
                    <h2 style={{ ...fontStyle, fontSize: '28px', lineHeight: '36px', fontWeight: 500, color: 'rgb(0,0,0)', marginBottom: '20px' }}>
                      The same friction, two different contexts
                    </h2>
                    <p style={{ ...fontStyle, fontSize: '17px', lineHeight: '30px', fontWeight: 400, color: 'rgba(0,0,0,0.82)', maxWidth: '760px', marginBottom: '32px' }}>
                      Whether searching for a candidate or a prospect, the workflow is structurally identical: run a LinkedIn search, get hundreds of results, then open each profile one by one — reading, judging, copying notes into a spreadsheet. Repeat for every role or segment, every day.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', columnGap: '32px', padding: '28px 0', borderTop: '1px solid rgba(0,0,0,0.12)', borderBottom: '1px solid rgba(0,0,0,0.12)', maxWidth: '760px', marginBottom: '32px' }}>
                      <div style={{ ...fontStyle, fontSize: 'clamp(48px, 7vw, 72px)', lineHeight: '1', fontWeight: 300, color: 'rgb(0,0,0)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                        500<span style={{ fontSize: '0.35em', marginLeft: '6px', fontWeight: 400, letterSpacing: '0' }}>profiles / search</span>
                      </div>
                      <div style={{ ...fontStyle, fontSize: '14px', lineHeight: '22px', fontWeight: 400, color: 'oklch(0.556 0 0)', borderLeft: '1px solid rgba(0,0,0,0.12)', paddingLeft: '24px' }}>
                        Average LinkedIn search results our market partner — a seasoned headhunter — has to manually review per role. Sales reps face the same volume when prospecting by ICP.
                      </div>
                    </div>

                    <p style={{ ...fontStyle, fontSize: '17px', lineHeight: '30px', fontWeight: 400, color: 'rgba(0,0,0,0.82)', maxWidth: '760px', margin: 0 }}>
                      The frustration wasn&apos;t just the time — it was the lack of structure. No way to systematically compare people, no record of who had been reviewed, and no connection between this session and the next one for the same goal.
                    </p>
                  </div>

                  {/* ——————————————————————————————————————————————
                      SUBSECTION 02 · Tooling audit
                      —————————————————————————————————————————————— */}
                  <div style={{ marginBottom: '64px' }}>
                    <div style={{ ...fontStyle, fontSize: '12px', lineHeight: '16px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'oklch(0.556 0 0)', marginBottom: '12px' }}>
                      02 · Tooling audit
                    </div>
                    <h2 style={{ ...fontStyle, fontSize: '28px', lineHeight: '36px', fontWeight: 500, color: 'rgb(0,0,0)', marginBottom: '24px' }}>
                      Why existing tools don&apos;t solve it
                    </h2>

                    <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', background: '#FFFFFF', overflow: 'hidden', marginBottom: '32px' }}>
                      {[
                        { tool: 'LinkedIn Recruiter Lite', user: 'Alex', reason: 'Provides search access and InMail credits — but deciding who\'s the best fit is still a manual call, profile by profile.' },
                        { tool: 'LinkedIn Sales Navigator', user: 'Jordan', reason: 'Advanced search and company data — but evaluating ICP fit for each result remains entirely manual.' },
                        { tool: 'Dripify', user: 'Jordan', reason: 'Automates outreach sequences — but requires a pre-curated list. It can\'t tell you who\'s worth contacting.' },
                        { tool: "LinkedIn's native search", user: null, reason: 'Ranks by keyword match and premium status — not by fit for a specific role or ICP.' },
                        { tool: 'Spreadsheets', user: null, reason: 'Capture data but add manual overhead — and still require someone to do the ranking.' },
                      ].map(({ tool, user, reason }, idx, arr) => (
                        <div key={tool} className="grid grid-cols-1 md:grid-cols-[minmax(220px,300px)_1fr]" style={{ columnGap: '32px', rowGap: '4px', padding: '20px 24px', borderBottom: idx < arr.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none', alignItems: 'baseline' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ ...fontStyle, fontSize: '15px', lineHeight: '26px', fontWeight: 500, color: 'rgb(0,0,0)' }}>{tool}</span>
                            {user && (
                              <span style={{ ...fontStyle, fontSize: '10px', fontWeight: 500, color: 'oklch(0.556 0 0)', background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '4px', padding: '1px 6px', letterSpacing: '0.04em' }}>{user}</span>
                            )}
                          </div>
                          <div style={{ ...fontStyle, fontSize: '15px', lineHeight: '26px', fontWeight: 400, color: 'rgba(0,0,0,0.68)' }}>{reason}</div>
                        </div>
                      ))}
                    </div>

                    <blockquote style={{ margin: 0, borderLeft: '2px solid rgb(0,0,0)', paddingLeft: '20px', maxWidth: '760px' }}>
                      <p style={{ ...fontStyle, fontSize: '19px', lineHeight: '30px', fontWeight: 400, fontStyle: 'italic', color: 'rgb(0,0,0)', margin: 0 }}>
                        The gap was the same for both users: nothing existed between <span style={{ fontStyle: 'normal', fontWeight: 500 }}>&quot;run a LinkedIn search&quot;</span> and <span style={{ fontStyle: 'normal', fontWeight: 500 }}>&quot;have a ranked, actionable shortlist — ready to reach.&quot;</span>
                      </p>
                    </blockquote>
                  </div>

                  {/* ——————————————————————————————————————————————
                      SUBSECTION 03 · The design challenge
                      —————————————————————————————————————————————— */}
                  <div>
                    <div style={{ ...fontStyle, fontSize: '12px', lineHeight: '16px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'oklch(0.556 0 0)', marginBottom: '12px' }}>
                      03 · Brief
                    </div>
                    <h2 style={{ ...fontStyle, fontSize: '28px', lineHeight: '36px', fontWeight: 500, color: 'rgb(0,0,0)', marginBottom: '24px' }}>
                      The design challenge
                    </h2>

                    <div style={{ background: 'rgb(0,0,0)', color: '#FFFFFF', borderRadius: '16px', padding: '36px 40px', maxWidth: '900px' }}>
                      <p style={{ ...fontStyle, fontSize: '20px', lineHeight: '32px', fontWeight: 300, color: '#FFFFFF', marginTop: 0, marginBottom: '28px' }}>
                        Build a tool <strong style={{ fontWeight: 500, color: '#FFFFFF' }}>fast enough to ship in 6 weeks</strong>, <strong style={{ fontWeight: 500, color: '#FFFFFF' }}>simple enough for recruiters and sales teams to adopt without training</strong> — and <strong style={{ fontWeight: 500, color: '#FFFFFF' }}>structured enough to grow into a full Find → Rank → Reach platform</strong>, not just a one-trick ranking widget.
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '10px' }}>
                        {['6-week shipping window', 'Zero-training adoption', 'Find → Rank → Reach'].map((label) => (
                          <span key={label} style={{ ...fontStyle, fontSize: '13px', lineHeight: '20px', fontWeight: 500, color: '#FFFFFF', padding: '6px 14px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.24)', background: 'rgba(255,255,255,0.06)' }}>
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollAnimatedSection>
            </section>

            {/* ——————————————————————————————————————————————
                STEP 01 · DISCOVERY
                —————————————————————————————————————————————— */}
            <div
              data-case-nav-label="01 / Discovery"
              className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 md:gap-14"
              style={{ marginTop: '96px', marginBottom: '96px' }}
            >
              {/* 左列：超大 thin 数字 + 眉题标签 */}
              <div>
                <div
                  style={{
                    ...fontStyle,
                    fontSize: 'clamp(64px, 8vw, 96px)',
                    lineHeight: '1',
                    fontWeight: 200,
                    letterSpacing: '-0.04em',
                    color: 'rgb(0, 0, 0)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  01
                </div>
                <div
                  style={{
                    ...fontStyle,
                    fontSize: '11px',
                    lineHeight: '16px',
                    fontWeight: 500,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'oklch(0.556 0 0)',
                    marginTop: '16px',
                  }}
                >
                  Discovery
                </div>
              </div>
              {/* 右列：叙事 + 用户段对比图 */}
              <div>
                <h2
                  style={{
                    ...fontStyle,
                    fontSize: '28px',
                    lineHeight: '36px',
                    fontWeight: 500,
                    color: 'rgb(0, 0, 0)',
                    marginTop: 0,
                    marginBottom: '20px',
                  }}
                >
                  Understanding the workflow
                </h2>
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '17px',
                    lineHeight: '30px',
                    fontWeight: 400,
                    color: 'rgba(0, 0, 0, 0.82)',
                    maxWidth: '760px',
                    marginTop: 0,
                    marginBottom: '20px',
                  }}
                >
                  Before touching any design, I mapped how our two core users actually work today — tracing every step from the moment they open LinkedIn to the moment they reach out to someone.
                </p>
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '17px',
                    lineHeight: '30px',
                    fontWeight: 400,
                    color: 'rgba(0, 0, 0, 0.82)',
                    maxWidth: '760px',
                    margin: 0,
                  }}
                >
                  The same gap surfaced in both workflows: <strong style={{ fontWeight: 500, color: 'rgb(0,0,0)' }}>LinkedIn surfaces people but provides no way to rank or prioritize them</strong>. Everything after &quot;find&quot; is handled by a disconnected tool — or not at all.
                </p>

                {/* Fig 1：两类用户的工作流程图 + 痛点 */}
                {(() => {
                  const segments = [
                    {
                      label: 'Alex · Headhunter',
                      badge: 'Validated user',
                      badgeBlue: true,
                      steps: [
                        { label: 'Search in\nRecruiter Lite', sub: 'Keywords +\nfilters', pain: null },
                        { label: 'Scroll ~500\nresults', sub: 'Browse profiles\nin feed', pain: 'No way to\npre-filter' },
                        { label: 'Open each\nprofile', sub: 'One by one,\nnew tab', pain: 'No AI\nscreening' },
                        { label: 'Copy to\nSpreadsheet', sub: 'Paste name,\ntitle, URL', pain: 'Manual &\nerror-prone' },
                        { label: 'Message\nmanually', sub: 'Connection req\n+ follow-up', pain: 'No way\nto scale' },
                      ],
                    },
                    {
                      label: 'Jordan · Sales & BD',
                      badge: 'Target user',
                      badgeBlue: false,
                      steps: [
                        { label: 'Search in\nSales Navigator', sub: 'Advanced\npeople search', pain: null },
                        { label: 'Evaluate\nICP fit', sub: 'Review each\nprofile manually', pain: 'No ranking\nby criteria' },
                        { label: 'Curate list\nmanually', sub: 'Copy names\ninto spreadsheet', pain: 'Time-consuming\n& subjective' },
                        { label: 'Import to\nDripify', sub: 'Upload list\nfor outreach', pain: 'Two-tool\ngap' },
                        { label: 'Run outreach\nsequence', sub: 'Auto connect\n+ message', pain: null },
                      ],
                    },
                  ];

                  return (
                    <div
                      style={{
                        marginTop: '32px',
                        border: '1px solid rgba(0,0,0,0.08)',
                        borderRadius: '14px',
                        background: '#FFFFFF',
                        overflow: 'hidden',
                      }}
                    >
                      {segments.map(({ label, badge, badgeBlue, steps }, si) => (
                        <div
                          key={label}
                          style={{
                            padding: '24px 24px 20px',
                            borderBottom: si < segments.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                          }}
                        >
                          {/* 段标题 */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <span
                              style={{
                                ...fontStyle,
                                fontSize: '12px',
                                fontWeight: 500,
                                color: 'rgb(0,0,0)',
                              }}
                            >
                              {label}
                            </span>
                            {badge && (
                              <span
                                style={{
                                  ...fontStyle,
                                  fontSize: '10px',
                                  fontWeight: 500,
                                  color: badgeBlue ? '#0052CC' : 'rgba(0,0,0,0.45)',
                                  background: badgeBlue ? 'rgba(0,82,204,0.07)' : 'rgba(0,0,0,0.05)',
                                  border: `1px solid ${badgeBlue ? 'rgba(0,82,204,0.18)' : 'rgba(0,0,0,0.1)'}`,
                                  borderRadius: '4px',
                                  padding: '2px 7px',
                                }}
                              >
                                {badge}
                              </span>
                            )}
                          </div>

                          {/* 流程节点行 */}
                          <div className="flex items-start" style={{ gap: '0', rowGap: '20px' }}>
                            {steps.map(({ label: stepLabel, sub, pain }, i) => (
                              <div key={i} className="flex items-start" style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
                                  <div
                                    style={{
                                      border: pain ? '1.5px solid rgba(220,60,40,0.22)' : '1px solid rgba(0,0,0,0.10)',
                                      borderRadius: '8px',
                                      background: pain ? 'rgba(220,60,40,0.03)' : 'rgba(0,0,0,0.02)',
                                      padding: '8px 12px',
                                      width: '100%',
                                      textAlign: 'center',
                                    }}
                                  >
                                    <div
                                      style={{
                                        ...fontStyle,
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        color: 'rgb(0,0,0)',
                                        lineHeight: '16px',
                                        marginBottom: '3px',
                                        whiteSpace: 'pre-line',
                                      }}
                                    >
                                      {stepLabel}
                                    </div>
                                    <div
                                      style={{
                                        ...fontStyle,
                                        fontSize: '10px',
                                        fontWeight: 400,
                                        color: 'rgba(0,0,0,0.4)',
                                        lineHeight: '14px',
                                        whiteSpace: 'pre-line',
                                      }}
                                    >
                                      {sub}
                                    </div>
                                  </div>
                                  {pain ? (
                                    <div
                                      style={{
                                        ...fontStyle,
                                        fontSize: '10px',
                                        fontWeight: 500,
                                        color: 'rgba(200,50,30,0.85)',
                                        background: 'rgba(220,60,40,0.07)',
                                        border: '1px solid rgba(220,60,40,0.18)',
                                        borderRadius: '5px',
                                        padding: '3px 7px',
                                        textAlign: 'center',
                                        lineHeight: '13px',
                                        whiteSpace: 'pre-line',
                                      }}
                                    >
                                      ↑ {pain}
                                    </div>
                                  ) : (
                                    <div style={{ height: '32px' }} />
                                  )}
                                </div>
                                {i < steps.length - 1 && (
                                  <div
                                    aria-hidden
                                    style={{
                                      ...fontStyle,
                                      fontSize: '14px',
                                      fontWeight: 300,
                                      color: 'rgba(0,0,0,0.2)',
                                      padding: '0 5px',
                                      marginTop: '22px',
                                      flexShrink: 0,
                                    }}
                                  >
                                    →
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* 底部结论 */}
                      <div
                        style={{
                          padding: '14px 24px',
                          borderTop: '1px solid rgba(0,0,0,0.06)',
                          background: 'rgba(0,0,0,0.015)',
                          ...fontStyle,
                          fontSize: '13px',
                          lineHeight: '20px',
                          fontWeight: 400,
                          color: 'oklch(0.556 0 0)',
                          fontStyle: 'italic',
                        }}
                      >
                        Shared gap: LinkedIn gives you a list of people. Neither user has a way to rank, prioritize, or reach them without switching tools and doing it manually.
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* ——————————————————————————————————————————————
                STEP 02 · PRODUCT DECISION
                —————————————————————————————————————————————— */}
            <div
              data-case-nav-label="02 / Product Decision"
              className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 md:gap-14"
              style={{ marginBottom: '96px' }}
            >
              <div>
                <div
                  style={{
                    ...fontStyle,
                    fontSize: 'clamp(64px, 8vw, 96px)',
                    lineHeight: '1',
                    fontWeight: 200,
                    letterSpacing: '-0.04em',
                    color: 'rgb(0, 0, 0)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  02
                </div>
                <div
                  style={{
                    ...fontStyle,
                    fontSize: '11px',
                    lineHeight: '16px',
                    fontWeight: 500,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'oklch(0.556 0 0)',
                    marginTop: '16px',
                  }}
                >
                  Product decision
                </div>
              </div>
              <div>
                <h2
                  style={{
                    ...fontStyle,
                    fontSize: '28px',
                    lineHeight: '36px',
                    fontWeight: 500,
                    color: 'rgb(0, 0, 0)',
                    marginTop: 0,
                    marginBottom: '20px',
                  }}
                >
                  Introducing &ldquo;Project&rdquo;
                </h2>
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '17px',
                    lineHeight: '30px',
                    fontWeight: 400,
                    color: 'rgba(0, 0, 0, 0.82)',
                    maxWidth: '760px',
                    marginTop: 0,
                    marginBottom: '20px',
                  }}
                >
                  The original ask was straightforward: collect profiles from LinkedIn using the Chrome extension, describe what you&apos;re looking for, get an AI-ranked shortlist.
                </p>
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '17px',
                    lineHeight: '30px',
                    fontWeight: 400,
                    color: 'rgba(0, 0, 0, 0.82)',
                    maxWidth: '760px',
                    marginTop: 0,
                    marginBottom: '24px',
                  }}
                >
                  I pushed back and advocated for introducing the <strong style={{ fontWeight: 500, color: 'rgb(0, 0, 0)' }}>Project</strong> concept — a container that groups collected profiles under a specific search goal. Three reasons:
                </p>

                {/* 编号理由列表：小号 eyebrow 数字 + 内容 */}
                <ol
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    marginBottom: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    maxWidth: '760px',
                  }}
                >
                  {[
                    'Users work on multiple goals simultaneously — a headhunter runs several roles at once, a sales rep targets different segments. Profiles need to be scoped per goal, not mixed together.',
                    'A single sourcing goal often spans multiple LinkedIn search sessions. Project gives all those sessions a shared home so nothing gets lost between them.',
                    'Long-term the platform needs to support outreach, notes, and pipeline tracking. Project is the architectural foundation — without it, none of that has a place to live.',
                  ].map((reason, i) => (
                    <li
                      key={i}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        columnGap: '16px',
                        alignItems: 'baseline',
                      }}
                    >
                      <span
                        style={{
                          ...fontStyle,
                          fontSize: '13px',
                          lineHeight: '30px',
                          fontWeight: 500,
                          color: 'oklch(0.556 0 0)',
                          fontVariantNumeric: 'tabular-nums',
                          letterSpacing: '0.08em',
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        style={{
                          ...fontStyle,
                          fontSize: '16px',
                          lineHeight: '28px',
                          fontWeight: 400,
                          color: 'rgba(0, 0, 0, 0.82)',
                        }}
                      >
                        {reason}
                      </span>
                    </li>
                  ))}
                </ol>

                {/* Pull quote —— 这段贯穿整个 Process 的论点 */}
                <blockquote
                  style={{
                    margin: 0,
                    marginBottom: '32px',
                    borderLeft: '2px solid rgb(0, 0, 0)',
                    paddingLeft: '20px',
                    maxWidth: '760px',
                  }}
                >
                  <p
                    style={{
                      ...fontStyle,
                      fontSize: '19px',
                      lineHeight: '30px',
                      fontWeight: 400,
                      fontStyle: 'italic',
                      color: 'rgb(0, 0, 0)',
                      margin: 0,
                    }}
                  >
                    &ldquo;This shouldn&apos;t just be a ranking tool. It should be a pipeline management platform.&rdquo;
                  </p>
                </blockquote>

                {/* Fig 2：Before vs After — 引入 Project 概念的设计决策 */}
                <div
                  style={{
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: '14px',
                    background: '#FFFFFF',
                    overflow: 'hidden',
                  }}
                >
                  {/* BEFORE 行 */}
                  <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <div
                      style={{
                        ...fontStyle,
                        fontSize: '10px',
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                        color: 'oklch(0.556 0 0)',
                        marginBottom: '16px',
                      }}
                    >
                      Before · one-shot ranking
                    </div>
                    {/* 流程节点 */}
                    <div className="flex flex-wrap items-center" style={{ gap: '8px', marginBottom: '14px' }}>
                      {[
                        { label: 'Set search goal', sub: 'Any people-search goal' },
                        { label: 'Extract LinkedIn profiles', sub: 'From this search only' },
                        { label: 'AI ranking', sub: 'One-time analysis' },
                        { label: 'Done', sub: 'Session ends', terminal: true },
                      ].map(({ label, sub, terminal }, i, arr) => (
                        <span key={label} className="flex items-center" style={{ gap: '8px' }}>
                          <span
                            style={{
                              ...fontStyle,
                              fontSize: '13px',
                              fontWeight: 500,
                              color: terminal ? 'rgba(0,0,0,0.32)' : 'rgb(0,0,0)',
                              padding: '8px 14px',
                              borderRadius: '999px',
                              border: terminal ? '1px dashed rgba(0,0,0,0.2)' : '1px solid rgba(0,0,0,0.14)',
                              background: terminal ? 'rgba(0,0,0,0.02)' : '#fff',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '1px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {label}
                            <span style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(0,0,0,0.36)' }}>{sub}</span>
                          </span>
                          {i < arr.length - 1 && (
                            <span aria-hidden style={{ ...fontStyle, fontSize: '14px', fontWeight: 300, color: 'rgba(0,0,0,0.28)' }}>→</span>
                          )}
                        </span>
                      ))}
                    </div>
                    <div style={{ ...fontStyle, fontSize: '13px', color: 'oklch(0.556 0 0)', fontStyle: 'italic' }}>
                      Results aren&apos;t saved. Each session starts from zero. Candidates from different searches can&apos;t be combined.
                    </div>
                  </div>

                  {/* AFTER 行 */}
                  <div style={{ padding: '24px 28px', background: 'rgba(0,0,0,0.015)' }}>
                    <div
                      style={{
                        ...fontStyle,
                        fontSize: '10px',
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                        color: 'oklch(0.556 0 0)',
                        marginBottom: '16px',
                      }}
                    >
                      After · Project as a container
                    </div>

                    {/* Project 卡 */}
                    <div
                      style={{
                        border: '1.5px solid rgba(0,82,204,0.2)',
                        borderRadius: '10px',
                        background: '#fff',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Project 顶部：名称 + search goal；标题行右侧为继续收集示意 CTA */}
                      <div
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid rgba(0,0,0,0.06)',
                          background: 'rgba(0,82,204,0.03)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                        }}
                      >
                        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                            <span style={{ ...fontStyle, fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, color: 'rgba(0,82,204,0.7)' }}>Project</span>
                            <span style={{ ...fontStyle, fontSize: '13px', fontWeight: 600, color: 'rgb(0,0,0)' }}>Senior Product Manager — Fintech</span>
                          </div>
                          <div style={{ ...fontStyle, fontSize: '11px', color: 'rgba(0,0,0,0.48)', lineHeight: '16px' }}>
                            Search goal: 5+ yrs PM in fintech; strong data sense; US-based
                          </div>
                        </div>
                        <button
                          type="button"
                          style={{
                            ...fontStyle,
                            alignSelf: 'center',
                            flexShrink: 0,
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 10px',
                            fontSize: '10px',
                            fontWeight: 600,
                            lineHeight: '14px',
                            color: '#FFFFFF',
                            background: 'linear-gradient(135deg, #004ac6 0%, #2563eb 100%)',
                            boxShadow: '0 4px 12px rgba(0, 74, 198, 0.2)',
                            cursor: 'default',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Collect More Candidates
                        </button>
                      </div>

                      {/* 两列：profile池 + 排名版本 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2">
                        {/* 候选人池 */}
                        <div style={{ padding: '12px 16px', borderRight: '1px solid rgba(0,0,0,0.06)' }}>
                          <div style={{ ...fontStyle, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500, color: 'rgba(0,0,0,0.36)', marginBottom: '10px' }}>
                            Profile pool · 24 total
                          </div>
                          <div style={{ ...fontStyle, fontSize: '10px', color: 'rgba(0,0,0,0.4)', marginBottom: '6px' }}>
                            Session 1 · Jan 10 · 12 profiles
                          </div>
                          <div style={{ ...fontStyle, fontSize: '10px', color: 'rgba(0,0,0,0.4)', marginBottom: '10px' }}>
                            Session 2 · Jan 18 · 12 profiles
                          </div>
                          {['Alex Morgan', 'Jamie Carter', 'Taylor Nguyen'].map((name) => (
                            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(0,0,0,0.07)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', ...fontStyle, fontSize: '7px', fontWeight: 600, color: 'rgba(0,0,0,0.4)' }}>
                                {name.split(' ').map(p => p[0]).join('')}
                              </div>
                              <span style={{ ...fontStyle, fontSize: '11px', fontWeight: 500, color: 'rgb(0,0,0)' }}>{name}</span>
                            </div>
                          ))}
                          <div style={{ ...fontStyle, fontSize: '10px', color: 'rgba(0,0,0,0.3)', marginTop: '6px', fontStyle: 'italic' }}>+ 21 more</div>
                        </div>

                        {/* 排名版本 */}
                        <div style={{ padding: '12px 16px' }}>
                          <div style={{ ...fontStyle, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500, color: 'rgba(0,0,0,0.36)', marginBottom: '10px' }}>
                            Ranking versions
                          </div>
                          {[
                            { v: 'v2', name: 'After client feedback', date: 'Jan 22', count: 15, current: true },
                            { v: 'v1', name: 'Initial ranking', date: 'Jan 15', count: 20, current: false },
                          ].map(({ v, name, date, count, current }) => (
                            <div
                              key={v}
                              style={{
                                border: current ? '1.5px solid rgba(0,82,204,0.2)' : '1px solid rgba(0,0,0,0.08)',
                                borderRadius: '6px',
                                padding: '8px 10px',
                                marginBottom: '6px',
                                background: current ? 'rgba(0,82,204,0.03)' : 'transparent',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ ...fontStyle, fontSize: '9px', fontWeight: 700, color: current ? '#0052CC' : 'rgba(0,0,0,0.35)', letterSpacing: '0.04em' }}>{v}</span>
                                  <span style={{ ...fontStyle, fontSize: '11px', fontWeight: 500, color: 'rgb(0,0,0)' }}>{name}</span>
                                  {current && <span style={{ ...fontStyle, fontSize: '8px', fontWeight: 500, color: '#0052CC', background: 'rgba(0,82,204,0.1)', borderRadius: '3px', padding: '1px 4px' }}>Current</span>}
                                </div>
                                <span style={{ ...fontStyle, fontSize: '9px', color: 'rgba(0,0,0,0.34)' }}>{date} · {count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ ...fontStyle, fontSize: '13px', color: 'oklch(0.556 0 0)', fontStyle: 'italic', marginTop: '14px' }}>
                      One Project = one search goal · profiles accumulate across sessions, so you keep adding to the same project and manage one unified ranking pipeline — not loose, disconnected lists that each need their own separate rank pass · rankings are versioned and reusable.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ——————————————————————————————————————————————
                STEP 03 · INFORMATION ARCHITECTURE
                centerpiece: 纯 CSS 三层 vs 两层对比图
                —————————————————————————————————————————————— */}
            <div
              data-case-nav-label="03 / Information Architecture"
              className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 md:gap-14"
              style={{ marginBottom: '96px' }}
            >
              <div>
                <div
                  style={{
                    ...fontStyle,
                    fontSize: 'clamp(64px, 8vw, 96px)',
                    lineHeight: '1',
                    fontWeight: 200,
                    letterSpacing: '-0.04em',
                    color: 'rgb(0, 0, 0)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  03
                </div>
                <div
                  style={{
                    ...fontStyle,
                    fontSize: '11px',
                    lineHeight: '16px',
                    fontWeight: 500,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'oklch(0.556 0 0)',
                    marginTop: '16px',
                  }}
                >
                  Information architecture
                </div>
              </div>
              <div>
                <h2
                  style={{
                    ...fontStyle,
                    fontSize: '28px',
                    lineHeight: '36px',
                    fontWeight: 500,
                    color: 'rgb(0, 0, 0)',
                    marginTop: 0,
                    marginBottom: '20px',
                  }}
                >
                  From three layers to two
                </h2>
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '17px',
                    lineHeight: '30px',
                    fontWeight: 400,
                    color: 'rgba(0, 0, 0, 0.82)',
                    maxWidth: '760px',
                    marginTop: 0,
                    marginBottom: '20px',
                  }}
                >
                  The early structure was the textbook three-layer model: <strong style={{ fontWeight: 500, color: 'rgb(0, 0, 0)' }}>Project list → Rank list → Rank detail</strong>.
                </p>
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '17px',
                    lineHeight: '30px',
                    fontWeight: 400,
                    color: 'rgba(0, 0, 0, 0.82)',
                    maxWidth: '760px',
                    marginTop: 0,
                    marginBottom: '32px',
                  }}
                >
                  But after studying actual usage patterns, one thing stood out: every time a recruiter opens the dashboard, <strong style={{ fontWeight: 500, color: 'rgb(0, 0, 0)' }}>90% of the time they only care about the latest ranking for that role</strong>. Forcing one extra click to reach the thing they came for is friction with no payoff.
                </p>

                {/* IA 对比图：card 里两行 "Before" / "After" */}
                <div
                  style={{
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    borderRadius: '14px',
                    background: '#FFFFFF',
                    overflow: 'hidden',
                  }}
                >
                  {/* BEFORE 行 */}
                  <div
                    style={{
                      padding: '28px 28px',
                      borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <div
                      style={{
                        ...fontStyle,
                        fontSize: '10px',
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                        color: 'oklch(0.556 0 0)',
                        marginBottom: '16px',
                      }}
                    >
                      Before · three layers
                    </div>
                    <div
                      className="flex flex-wrap items-center"
                      style={{ gap: '10px' }}
                    >
                      {[
                        { label: 'Project list', dim: false, strike: false },
                        { label: 'Rank list', dim: true, strike: true },
                        { label: 'Rank detail', dim: false, strike: false },
                      ].map(({ label, dim, strike }, i, arr) => (
                        <span key={label} className="flex items-center" style={{ gap: '10px' }}>
                          <span
                            style={{
                              ...fontStyle,
                              fontSize: '14px',
                              lineHeight: '20px',
                              fontWeight: 500,
                              color: dim ? 'rgba(0, 0, 0, 0.32)' : 'rgb(0, 0, 0)',
                              padding: '8px 14px',
                              borderRadius: '999px',
                              border: dim
                                ? '1px dashed rgba(0, 0, 0, 0.24)'
                                : '1px solid rgba(0, 0, 0, 0.14)',
                              background: dim ? 'rgba(0, 0, 0, 0.02)' : '#FFFFFF',
                              textDecoration: strike ? 'line-through' : 'none',
                              textDecorationColor: 'rgba(0, 0, 0, 0.45)',
                              textDecorationThickness: '1px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {label}
                          </span>
                          {i < arr.length - 1 && (
                            <span
                              aria-hidden
                              style={{
                                ...fontStyle,
                                fontSize: '14px',
                                fontWeight: 300,
                                color: 'rgba(0, 0, 0, 0.32)',
                              }}
                            >
                              →
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                    <div
                      style={{
                        ...fontStyle,
                        fontSize: '13px',
                        lineHeight: '20px',
                        fontWeight: 400,
                        color: 'oklch(0.556 0 0)',
                        marginTop: '12px',
                      }}
                    >
                      An extra hop users didn&apos;t ask for.
                    </div>
                  </div>

                  {/* AFTER 行 */}
                  <div style={{ padding: '28px 28px', background: 'rgba(0, 0, 0, 0.02)' }}>
                    <div
                      style={{
                        ...fontStyle,
                        fontSize: '10px',
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                        color: 'rgb(0, 0, 0)',
                        marginBottom: '16px',
                      }}
                    >
                      After · two layers
                    </div>
                    <div
                      className="flex flex-wrap items-center"
                      style={{ gap: '10px' }}
                    >
                      {['Project list', 'Project detail'].map((label, i, arr) => (
                        <span key={label} className="flex items-center" style={{ gap: '10px' }}>
                          <span
                            style={{
                              ...fontStyle,
                              fontSize: '14px',
                              lineHeight: '20px',
                              fontWeight: 500,
                              color: 'rgb(0, 0, 0)',
                              padding: '8px 14px',
                              borderRadius: '999px',
                              border: '1px solid rgb(0, 0, 0)',
                              background: '#FFFFFF',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {label}
                          </span>
                          {i < arr.length - 1 && (
                            <span
                              aria-hidden
                              style={{
                                ...fontStyle,
                                fontSize: '14px',
                                fontWeight: 300,
                                color: 'rgb(0, 0, 0)',
                              }}
                            >
                              →
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                    <div
                      style={{
                        ...fontStyle,
                        fontSize: '13px',
                        lineHeight: '20px',
                        fontWeight: 400,
                        color: 'rgba(0, 0, 0, 0.72)',
                        marginTop: '12px',
                      }}
                    >
                      Latest rank shown inline · previous versions available via a history switch.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ——————————————————————————————————————————————
                STEP 04 · SYSTEM BUILDING
                —————————————————————————————————————————————— */}
            <div
              className="grid grid-cols-1 gap-6 md:grid-cols-[160px_minmax(0,1fr)] md:gap-14"
              data-case-nav-label="04 / System Building"
            >
              <div className="min-w-0">
                <div
                  style={{
                    ...fontStyle,
                    fontSize: 'clamp(64px, 8vw, 96px)',
                    lineHeight: '1',
                    fontWeight: 200,
                    letterSpacing: '-0.04em',
                    color: 'rgb(0, 0, 0)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  04
                </div>
                <div
                  style={{
                    ...fontStyle,
                    fontSize: '11px',
                    lineHeight: '16px',
                    fontWeight: 500,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'oklch(0.556 0 0)',
                    marginTop: '16px',
                  }}
                >
                  System building
                </div>
              </div>
              <div className="min-w-0">
                <h2
                  style={{
                    ...fontStyle,
                    fontSize: '28px',
                    lineHeight: '36px',
                    fontWeight: 500,
                    color: 'rgb(0, 0, 0)',
                    marginTop: 0,
                    marginBottom: '20px',
                  }}
                >
                  Speed without chaos
                </h2>
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '17px',
                    lineHeight: '30px',
                    fontWeight: 400,
                    color: 'rgba(0, 0, 0, 0.82)',
                    maxWidth: '760px',
                    marginTop: 0,
                    marginBottom: '20px',
                  }}
                >
                  The team had <strong style={{ fontWeight: 500, color: 'rgb(0, 0, 0)' }}>six weeks</strong> to go from zero to a shippable MVP. Design had to move fast without fracturing.
                </p>
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '17px',
                    lineHeight: '30px',
                    fontWeight: 400,
                    color: 'rgba(0, 0, 0, 0.82)',
                    maxWidth: '760px',
                    marginTop: 0,
                    marginBottom: '32px',
                  }}
                >
                  I used <strong style={{ fontWeight: 500, color: 'rgb(0, 0, 0)' }}>Stitch</strong> to rapidly explore direction and lock in a token system — color, type, spacing, radius — then built every screen on top of it. The Chrome extension and the web dashboard ended up speaking the same visual language, and engineers had a clean variable reference to work from.
                </p>

                {/* Fig 3：Design token 展示板 */}
                <div
                  style={{
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: '14px',
                    background: '#FFFFFF',
                    overflow: 'hidden',
                  }}
                >
                  {/* 标题行 */}
                  <div
                    style={{
                      padding: '16px 24px',
                      borderBottom: '1px solid rgba(0,0,0,0.06)',
                      background: 'rgba(0,0,0,0.015)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ ...fontStyle, fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 500, color: 'rgba(0,0,0,0.4)' }}>
                      Design tokens · ConnectNova
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {['Color', 'Typography', 'Spacing', 'Radius'].map(t => (
                        <span key={t} style={{ ...fontStyle, fontSize: '10px', fontWeight: 500, color: 'rgba(0,0,0,0.45)', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', padding: '2px 7px' }}>{t}</span>
                      ))}
                    </div>
                  </div>

                  {/* 四列 token 面板 */}
                  <div className="grid grid-cols-2 md:grid-cols-4" style={{ padding: '0' }}>

                    {/* Color */}
                    <div style={{ padding: '20px 20px', borderRight: '1px solid rgba(0,0,0,0.05)' }}>
                      <div style={{ ...fontStyle, fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, color: 'rgba(0,0,0,0.35)', marginBottom: '14px' }}>Color</div>
                      {[
                        { name: '--cn-primary', value: '#004ac6', bg: '#004ac6', light: true },
                        { name: '--cn-primary-dark', value: '#003da8', bg: '#003da8', light: true },
                        { name: '--cn-primary-light', value: 'rgba(0,74,198,.07)', bg: 'rgba(0,74,198,.07)', light: false },
                        { name: '--cn-danger', value: 'rgba(200,40,20,.9)', bg: 'rgba(200,40,20,.9)', light: true },
                        { name: '--cn-success', value: 'rgba(20,130,60,.9)', bg: 'rgba(20,130,60,.9)', light: true },
                        { name: '--cn-text', value: '#000000', bg: '#000000', light: true },
                        { name: '--cn-text-muted', value: 'rgba(0,0,0,0.5)', bg: 'rgba(0,0,0,0.5)', light: true },
                        { name: '--cn-border', value: 'rgba(0,0,0,0.14)', bg: 'rgba(0,0,0,0.14)', light: false },
                      ].map(({ name, value, bg }) => (
                        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: bg, border: '1px solid rgba(0,0,0,0.08)', flexShrink: 0 }} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ ...fontStyle, fontSize: '11px', fontWeight: 500, color: 'rgb(0,0,0)', lineHeight: '14px' }}>{name}</div>
                            <div style={{ ...fontStyle, fontSize: '9px', fontWeight: 400, color: 'rgba(0,0,0,0.38)', lineHeight: '12px', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Typography */}
                    <div style={{ padding: '20px 20px', borderRight: '1px solid rgba(0,0,0,0.05)' }}>
                      <div style={{ ...fontStyle, fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, color: 'rgba(0,0,0,0.35)', marginBottom: '14px' }}>Typography</div>
                      {[
                        { name: 'h1', sample: 'Heading 1', size: '32px', weight: '600', leading: '40px' },
                        { name: 'h2', sample: 'Heading 2', size: '24px', weight: '500', leading: '32px' },
                        { name: 'h3', sample: 'Heading 3', size: '20px', weight: '500', leading: '28px' },
                        { name: 'body-lg', sample: 'Body large', size: '17px', weight: '400', leading: '28px' },
                        { name: 'body', sample: 'Body', size: '15px', weight: '400', leading: '24px' },
                        { name: 'small', sample: 'Small', size: '13px', weight: '400', leading: '20px' },
                        { name: 'label', sample: 'LABEL', size: '10px', weight: '500', leading: '14px' },
                      ].map(({ name, sample, size, weight, leading }) => (
                        <div key={name} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                          <div style={{ ...fontStyle, fontSize: size, fontWeight: parseInt(weight), color: 'rgb(0,0,0)', lineHeight: leading, marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sample}</div>
                          <div style={{ ...fontStyle, fontSize: '9px', color: 'rgba(0,0,0,0.36)', fontVariantNumeric: 'tabular-nums' }}>{name} · {size}/{leading} · {weight}</div>
                        </div>
                      ))}
                    </div>

                    {/* Spacing */}
                    <div style={{ padding: '20px 20px', borderRight: '1px solid rgba(0,0,0,0.05)' }}>
                      <div style={{ ...fontStyle, fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, color: 'rgba(0,0,0,0.35)', marginBottom: '14px' }}>Spacing</div>
                      {[
                        { name: '--cn-space-1', value: '4px' },
                        { name: '--cn-space-2', value: '8px' },
                        { name: '--cn-space-3', value: '12px' },
                        { name: '--cn-space-4', value: '16px' },
                        { name: '--cn-space-5', value: '20px' },
                        { name: '--cn-space-6', value: '24px' },
                        { name: '--cn-space-8', value: '32px' },
                        { name: '--cn-space-12', value: '48px' },
                      ].map(({ name, value }) => (
                        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <div style={{ height: '12px', background: '#004ac6', borderRadius: '2px', opacity: 0.7, flexShrink: 0, width: value }} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ ...fontStyle, fontSize: '11px', fontWeight: 500, color: 'rgb(0,0,0)', lineHeight: '14px' }}>{name}</div>
                            <div style={{ ...fontStyle, fontSize: '9px', color: 'rgba(0,0,0,0.38)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Radius */}
                    <div style={{ padding: '20px 20px' }}>
                      <div style={{ ...fontStyle, fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, color: 'rgba(0,0,0,0.35)', marginBottom: '14px' }}>Radius</div>
                      {[
                        { name: '--cn-radius-sm', value: '6px', r: 6 },
                        { name: '--cn-radius-md', value: '7px', r: 7 },
                        { name: '--cn-radius-lg', value: '10px', r: 10 },
                        { name: '--cn-radius-xl', value: '12px', r: 12 },
                        { name: '--cn-radius-2xl', value: '14px', r: 14 },
                        { name: '--cn-radius-full', value: '999px', r: 999 },
                      ].map(({ name, value, r }) => (
                        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '9px' }}>
                          <div style={{ width: '48px', height: '32px', border: '1.5px solid #004ac6', borderRadius: Math.min(r, 16) + 'px', opacity: 0.6, flexShrink: 0 }} />
                          <div>
                            <div style={{ ...fontStyle, fontSize: '11px', fontWeight: 500, color: 'rgb(0,0,0)', lineHeight: '14px' }}>{name}</div>
                            <div style={{ ...fontStyle, fontSize: '9px', color: 'rgba(0,0,0,0.38)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 底部注脚 */}
                  <div
                    style={{
                      padding: '12px 24px',
                      borderTop: '1px solid rgba(0,0,0,0.06)',
                      background: 'rgba(0,0,0,0.015)',
                      ...fontStyle,
                      fontSize: '13px',
                      color: 'oklch(0.556 0 0)',
                      fontStyle: 'italic',
                    }}
                  >
                    Built in Stitch · tokens exported as CSS variables · shared across Chrome extension and web dashboard
                  </div>
                </div>

                <DesignSystemComponentsMock fontStyle={fontStyle} />
              </div>
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>
      {/* Solution Section —— 产品亮相：The platform at a glance + Chrome Extension + Web Dashboard (2x2) + Design decisions。
          视觉策略：
          · 灰底 #FAFAFA，与 Problem 共用同一灰基调（"事实陈述型"章节），与顶部 Process 的白底拉开节奏
          · 每个 subsection 有独立的 layout（hero/split/2x2/table），避免四段均质
          · Extension 占位图用 mock LinkedIn 顶栏"装"一下，兑现"嵌入 LinkedIn"的语义
          · Dashboard 的 4 个功能用 2x2 feature grid 作为 Solution 的视觉 centerpiece */}
      <section
        hidden
        className="w-screen"
        data-case-nav-label="Solution"
        style={{
          backgroundColor: '#FAFAFA',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '96px',
          paddingBottom: '96px',
        }}
      >
        <ScrollAnimatedSection>
          <div style={{ maxWidth: CASE_STUDY_CONTENT_WIDTH, margin: '0 auto' }}>
            {/* 分区一级标题 + 导语 */}
            <h1 style={headingLevel1Style}>Solution</h1>
            <p
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '30px',
                fontWeight: 400,
                color: 'rgba(0, 0, 0, 0.88)',
                maxWidth: '780px',
                marginBottom: '72px',
              }}
            >
              Two tightly coupled products — an extension that lives inside LinkedIn, and a dashboard that turns collected profiles into a ranked, manageable pipeline.
            </p>

            {/* ——————————————————————————————————————————————
                01 · OVERVIEW — The platform at a glance
                —————————————————————————————————————————————— */}
            <div data-case-nav-label="01 / Overview" style={{ marginBottom: '96px' }}>
              <div
                style={{
                  ...fontStyle,
                  fontSize: '12px',
                  lineHeight: '16px',
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'oklch(0.556 0 0)',
                  marginBottom: '12px',
                }}
              >
                01 · Overview
              </div>
              <h2
                style={{
                  ...fontStyle,
                  fontSize: '28px',
                  lineHeight: '36px',
                  fontWeight: 500,
                  color: 'rgb(0, 0, 0)',
                  marginTop: 0,
                  marginBottom: '20px',
                }}
              >
                The platform at a glance
              </h2>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '17px',
                  lineHeight: '30px',
                  fontWeight: 400,
                  color: 'rgba(0, 0, 0, 0.82)',
                  maxWidth: '760px',
                  marginTop: 0,
                  marginBottom: '32px',
                }}
              >
                ConnectNova is made up of two tightly coupled products — a <strong style={{ fontWeight: 500, color: 'rgb(0, 0, 0)' }}>Chrome extension</strong> that lives inside LinkedIn, and a <strong style={{ fontWeight: 500, color: 'rgb(0, 0, 0)' }}>web dashboard</strong> for managing, ranking, and reviewing candidates.
              </p>

              {/* Platform overview：Dashboard + Extension 双图并排 */}
              <div
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '16px',
                  background: '#F8F9FB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '10px',
                  padding: '14px',
                }}
                aria-label="Platform overview — Dashboard and Chrome Extension"
              >
                {/* 左图切换：Ranking MVP 与 With outreach；右图保持不变 */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', marginBottom: '4px' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      gap: '6px',
                      padding: '4px',
                      borderRadius: '999px',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      background: '#FFFFFF',
                    }}
                  >
                    {[
                      { key: 'ranking' as const, label: 'Ranking MVP' },
                      { key: 'outreach' as const, label: 'With outreach' },
                    ].map(({ key, label }) => {
                      const active = overviewDashboardMode === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setOverviewDashboardMode(key)}
                          style={{
                            ...fontStyle,
                            fontSize: '12px',
                            lineHeight: '18px',
                            fontWeight: 500,
                            borderRadius: '999px',
                            border: '1px solid transparent',
                            padding: '6px 12px',
                            color: active ? '#FFFFFF' : 'rgba(0, 0, 0, 0.7)',
                            background: active ? '#0052CC' : 'transparent',
                            cursor: 'pointer',
                            transition: 'all 160ms ease',
                          }}
                          aria-pressed={active}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      flex: '0 1 auto',
                      height: 'min(410px, 33vw)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      borderRadius: '20px',
                      border: '8px solid #E5E7EB',
                    }}
                  >
                    <img
                      src={
                        overviewDashboardMode === 'outreach'
                          ? '/img/connectnova/DashboardLayout.avif'
                          : '/img/connectnova/Dashboard.avif'
                      }
                      alt={
                        overviewDashboardMode === 'outreach'
                          ? 'ConnectNova dashboard overview with outreach workflow'
                          : 'ConnectNova dashboard overview ranking MVP'
                      }
                      style={{ width: 'auto', height: '100%', maxWidth: '100%', objectFit: 'contain', display: 'block' }}
                    />
                  </div>
                  <div
                    style={{
                      flex: '0 1 auto',
                      height: 'min(410px, 33vw)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      borderRadius: '20px',
                      border: '8px solid #E5E7EB',
                    }}
                  >
                    <img
                      src="/img/connectnova/Extension_home.avif"
                      alt="ConnectNova Chrome extension overview"
                      style={{ width: 'auto', height: '100%', maxWidth: '100%', objectFit: 'contain', display: 'block' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ——————————————————————————————————————————————
                02 · CHROME EXTENSION — 整图导出（与 Overview 卡片视觉一致）
                —————————————————————————————————————————————— */}
            <div data-case-nav-label="02 / Chrome Extension" style={{ marginBottom: '96px' }}>
              <div
                style={{
                  ...fontStyle,
                  fontSize: '12px',
                  lineHeight: '16px',
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'oklch(0.556 0 0)',
                  marginBottom: '12px',
                }}
              >
                02 · Chrome extension
              </div>
              <h2
                style={{
                  ...fontStyle,
                  fontSize: '28px',
                  lineHeight: '36px',
                  fontWeight: 500,
                  color: 'rgb(0, 0, 0)',
                  marginTop: 0,
                  marginBottom: '20px',
                }}
              >
                Collect without leaving LinkedIn
              </h2>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '17px',
                  lineHeight: '30px',
                  fontWeight: 400,
                  color: 'rgba(0, 0, 0, 0.82)',
                  marginTop: 0,
                  marginBottom: '24px',
                  maxWidth: '760px',
                }}
              >
                I designed the extension as an in-context collection tool for LinkedIn search pages, focusing on clear page recognition, flexible collection controls, and calmer feedback during long-running collection tasks.
              </p>

              <ol
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  marginBottom: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  maxWidth: '760px',
                }}
              >
                {[
                  {
                    title: 'LinkedIn Search page detected',
                    body: 'A visible detection state helps users understand whether they are on the correct LinkedIn page before starting collection.',
                  },
                  {
                    title: 'Flexible collection inputs',
                    body: 'I used input + stepper and input + slider patterns so recruiters can choose the collection range that best fits different sourcing needs.',
                  },
                  {
                    title: 'Animated collecting state',
                    body: 'The collecting process includes motion feedback to make progress feel active and reduce waiting anxiety during longer tasks.',
                  },
                ].map(({ title, body }, i) => (
                  <li
                    key={title}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr',
                      columnGap: '16px',
                      alignItems: 'baseline',
                    }}
                  >
                    <span
                      style={{
                        ...fontStyle,
                        fontSize: '13px',
                        lineHeight: '24px',
                        fontWeight: 500,
                        color: 'oklch(0.556 0 0)',
                        fontVariantNumeric: 'tabular-nums',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>
                      <span
                        style={{
                          ...fontStyle,
                          fontSize: '16px',
                          lineHeight: '24px',
                          fontWeight: 500,
                          color: 'rgb(0, 0, 0)',
                        }}
                      >
                        {title}
                      </span>
                      <span style={{ display: 'block', marginTop: '4px' }}>
                        <span
                          style={{
                            ...fontStyle,
                            fontSize: '15px',
                            lineHeight: '24px',
                            fontWeight: 400,
                            color: 'rgba(0, 0, 0, 0.72)',
                          }}
                        >
                          {body}
                        </span>
                      </span>
                    </span>
                  </li>
                ))}
              </ol>

              <div
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                style={{
                  maxWidth: '760px',
                  marginBottom: '32px',
                }}
                aria-label="Chrome extension collection performance data"
              >
                {[
                  {
                    value: '76% -> 93%',
                    label: 'collect completion rate',
                  },
                  {
                    value: '72% -> 87%',
                    label: 'save rate after collection',
                  },
                ].map(({ value, label }) => (
                  <div
                    key={label}
                    style={{
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: '16px',
                      background: '#FFFFFF',
                      padding: '24px',
                    }}
                  >
                    <div
                      style={{
                        ...fontStyle,
                        fontSize: '44px',
                        lineHeight: '50px',
                        fontWeight: 600,
                        letterSpacing: '-0.05em',
                        color: 'rgb(0, 0, 0)',
                        marginBottom: '10px',
                      }}
                    >
                      {value}
                    </div>
                    <div
                      style={{
                        ...fontStyle,
                        fontSize: '15px',
                        lineHeight: '24px',
                        fontWeight: 400,
                        color: 'rgba(0, 0, 0, 0.72)',
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '16px',
                  background: '#F8F9FB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '14px',
                }}
                aria-label="ConnectNova Chrome extension — full export"
              >
                <img
                  src="/img/connectnova/Extension.avif"
                  alt="ConnectNova Chrome extension embedded in LinkedIn"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: '100%',
                    display: 'block',
                    objectFit: 'contain',
                    borderRadius: '12px',
                  }}
                />
              </div>
            </div>

            {/* ——————————————————————————————————————————————
                03 · NEW RANKING/RERANK — 整图导出（沿用 Chrome extension 流程格式）
                —————————————————————————————————————————————— */}
            <div data-case-nav-label="03 / Ranking & Rerank" style={{ marginBottom: '96px' }}>
              <div
                style={{
                  ...fontStyle,
                  fontSize: '12px',
                  lineHeight: '16px',
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'oklch(0.556 0 0)',
                  marginBottom: '12px',
                }}
              >
                03 · New Ranking/Rerank
              </div>
              <h2
                style={{
                  ...fontStyle,
                  fontSize: '28px',
                  lineHeight: '36px',
                  fontWeight: 500,
                  color: 'rgb(0, 0, 0)',
                  marginTop: 0,
                  marginBottom: '20px',
                }}
              >
                Make AI evaluation criteria visible and editable
              </h2>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '17px',
                  lineHeight: '30px',
                  fontWeight: 400,
                  color: 'rgba(0, 0, 0, 0.82)',
                  marginTop: 0,
                  marginBottom: '24px',
                  maxWidth: '760px',
                }}
              >
                To balance transparency, trust, and control in AI products — and to keep the ranking process from feeling like a black box — I designed an evaluation criteria layer that users can review, adjust, and apply before generating a new ranking.
              </p>

              <ol
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  marginBottom: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  maxWidth: '760px',
                }}
              >
                {[
                  {
                    title: 'Expose AI-generated criteria',
                    body: 'The system translates the hiring brief into evaluation criteria before ranking, making the AI logic visible to recruiters.',
                  },
                  {
                    title: 'Support user edits',
                    body: 'Users can modify the generated evaluation criteria when they need more control over how candidates are assessed.',
                  },
                ].map(({ title, body }, i) => (
                  <li
                    key={title}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr',
                      columnGap: '16px',
                      alignItems: 'baseline',
                    }}
                  >
                    <span
                      style={{
                        ...fontStyle,
                        fontSize: '13px',
                        lineHeight: '24px',
                        fontWeight: 500,
                        color: 'oklch(0.556 0 0)',
                        fontVariantNumeric: 'tabular-nums',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>
                      <span
                        style={{
                          ...fontStyle,
                          fontSize: '16px',
                          lineHeight: '24px',
                          fontWeight: 500,
                          color: 'rgb(0, 0, 0)',
                        }}
                      >
                        {title}
                      </span>
                      <span style={{ display: 'block', marginTop: '4px' }}>
                        <span
                          style={{
                            ...fontStyle,
                            fontSize: '15px',
                            lineHeight: '24px',
                            fontWeight: 400,
                            color: 'rgba(0, 0, 0, 0.72)',
                          }}
                        >
                          {body}
                        </span>
                      </span>
                    </span>
                  </li>
                ))}
              </ol>

              <div
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                style={{
                  maxWidth: '760px',
                  marginBottom: '32px',
                }}
                aria-label="Evaluation criteria usage data"
              >
                {[
                  {
                    value: '84%',
                    label: 'of ranks included AI-generated evaluation criteria',
                  },
                  {
                    value: '31%',
                    label: 'of ranks had criteria edited before the ranking ran',
                  },
                ].map(({ value, label }) => (
                  <div
                    key={value}
                    style={{
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: '16px',
                      background: '#FFFFFF',
                      padding: '24px',
                    }}
                  >
                    <div
                      style={{
                        ...fontStyle,
                        fontSize: '56px',
                        lineHeight: '60px',
                        fontWeight: 600,
                        letterSpacing: '-0.05em',
                        color: 'rgb(0, 0, 0)',
                        marginBottom: '10px',
                      }}
                    >
                      {value}
                    </div>
                    <div
                      style={{
                        ...fontStyle,
                        fontSize: '15px',
                        lineHeight: '24px',
                        fontWeight: 400,
                        color: 'rgba(0, 0, 0, 0.72)',
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '16px',
                  background: '#F8F9FB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '14px',
                }}
                aria-label="ConnectNova new ranking and rerank flow"
              >
                <img
                  src="/img/connectnova/Rerank.avif"
                  alt="ConnectNova new ranking and rerank workflow"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: '100%',
                    display: 'block',
                    objectFit: 'contain',
                    borderRadius: '12px',
                  }}
                />
              </div>
            </div>

            {/* ——————————————————————————————————————————————
                04 · WEB DASHBOARD — 4-feature 2x2 showcase
                —————————————————————————————————————————————— */}
            <div data-case-nav-label="04 / Web Dashboard" style={{ marginBottom: '96px' }}>
              <div
                style={{
                  ...fontStyle,
                  fontSize: '12px',
                  lineHeight: '16px',
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'oklch(0.556 0 0)',
                  marginBottom: '12px',
                }}
              >
                04 · Web dashboard
              </div>
              <h2
                style={{
                  ...fontStyle,
                  fontSize: '28px',
                  lineHeight: '36px',
                  fontWeight: 500,
                  color: 'rgb(0, 0, 0)',
                  marginTop: 0,
                  marginBottom: '20px',
                }}
              >
                Manage, rank, decide
              </h2>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '17px',
                  lineHeight: '30px',
                  fontWeight: 400,
                  color: 'rgba(0, 0, 0, 0.82)',
                  maxWidth: '760px',
                  marginTop: 0,
                  marginBottom: '36px',
                }}
              >
                Every candidate the extension collects lands here. Four surfaces carry the day-to-day work — from overview to individual profile.
              </p>

              <div className="grid grid-cols-1 gap-6">
                {[
                  {
                    tag: '4.1',
                    title: 'Project list',
                    body: 'Every hiring need appears as a Project card. Status is visible at a glance — which are ranked, which still have unprocessed candidates.',
                    figNumber: 6,
                    figCaption: 'Project overview · card grid',
                  },
                  {
                    tag: '4.2',
                    title: 'Project detail · AI Ranking',
                    body: 'Opening a project lands on the latest ranking, no extra hop. Each candidate ships with an AI score, a dimension breakdown, and the rationale behind it. History is a version-switch away.',
                    figNumber: 7,
                    figCaption: 'Ranking view · score + dimension breakdown',
                  },
                  {
                    tag: '4.3',
                    title: 'Candidate Pool',
                    body: 'Every candidate in the project — ranked or not — in one view. Search, tag, annotate. The foundation for pipeline management down the road.',
                    figNumber: 8,
                    figCaption: 'Candidate pool · full roster',
                  },
                  {
                    tag: '4.4',
                    title: 'Profile Panel',
                    body: "Clicking a candidate slides in their full LinkedIn profile — work history, education, skills — alongside any notes the recruiter has added.",
                    figNumber: 9,
                    figCaption: 'Profile panel · slide-in detail view',
                  },
                ].map(({ tag, title, body, figNumber, figCaption }) => {
                  const copyBlock = (
                    <div>
                      <div
                        style={{
                          ...fontStyle,
                          fontSize: '11px',
                          lineHeight: '16px',
                          fontWeight: 500,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: 'oklch(0.556 0 0)',
                          marginBottom: '8px',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {tag}
                      </div>
                      <h3
                        style={{
                          ...fontStyle,
                          fontSize: '20px',
                          lineHeight: '28px',
                          fontWeight: 500,
                          color: 'rgb(0, 0, 0)',
                          marginTop: 0,
                          marginBottom: '10px',
                        }}
                      >
                        {title}
                      </h3>
                      <p
                        style={{
                          ...fontStyle,
                          fontSize: '15px',
                          lineHeight: '24px',
                          fontWeight: 400,
                          color: 'rgba(0, 0, 0, 0.72)',
                          margin: 0,
                        }}
                      >
                        {body}
                      </p>
                    </div>
                  );

                  const placeholderVisual = (
                    <div
                      style={{
                        border: '1px dashed rgba(0, 0, 0, 0.16)',
                        borderRadius: '10px',
                        background: 'rgba(0, 0, 0, 0.02)',
                        aspectRatio: '16 / 9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: '6px',
                        padding: '20px',
                      }}
                      aria-label={`Placeholder for ${title}`}
                    >
                      <div
                        style={{
                          ...fontStyle,
                          fontSize: '10px',
                          letterSpacing: '0.18em',
                          textTransform: 'uppercase',
                          fontWeight: 500,
                          color: 'oklch(0.556 0 0)',
                        }}
                      >
                        Placeholder · Fig {figNumber}
                      </div>
                      <div
                        style={{
                          ...fontStyle,
                          fontSize: '13px',
                          fontWeight: 400,
                          color: 'rgba(0, 0, 0, 0.56)',
                          fontStyle: 'italic',
                          textAlign: 'center',
                        }}
                      >
                        {figCaption}
                      </div>
                    </div>
                  );

                  return (
                    <div
                      key={tag}
                      style={{
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        borderRadius: '16px',
                        background: '#FFFFFF',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                      }}
                    >
                      {tag === '4.4' ? (
                        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,460px)] lg:gap-8">
                          {/* Profile Panel：左文案 + 右 Fig 9（lg 起双列；小屏文案在上） */}
                          <div className="min-w-0">{copyBlock}</div>
                          <div className="min-w-0 w-full justify-self-stretch lg:justify-self-end">
                            <ProfilePanelSlideMock fontStyle={fontStyle} />
                          </div>
                        </div>
                      ) : (
                        <>
                          {tag === '4.1' ? (
                            <ProjectListViewMock fontStyle={fontStyle} />
                          ) : tag === '4.2' || tag === '4.3' ? (
                            <AIRankingViewMock fontStyle={fontStyle} defaultTab={tag === '4.3' ? 'pool' : 'rankings'} />
                          ) : (
                            placeholderVisual
                          )}
                          {copyBlock}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ——————————————————————————————————————————————
                05 · OUTREACH — ongoing prototype
                —————————————————————————————————————————————— */}
            <div data-case-nav-label="05 / Outreach" style={{ marginBottom: '96px' }}>
              <div
                style={{
                  ...fontStyle,
                  fontSize: '12px',
                  lineHeight: '16px',
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'oklch(0.556 0 0)',
                  marginBottom: '12px',
                }}
              >
                05 · outreach
              </div>
              <h2
                style={{
                  ...fontStyle,
                  fontSize: '28px',
                  lineHeight: '36px',
                  fontWeight: 500,
                  color: 'rgb(0, 0, 0)',
                  marginTop: 0,
                  marginBottom: '20px',
                }}
              >
                Outreach module (ongoing)
              </h2>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '17px',
                  lineHeight: '30px',
                  fontWeight: 400,
                  color: 'rgba(0, 0, 0, 0.82)',
                  maxWidth: '760px',
                  marginTop: 0,
                  marginBottom: '24px',
                }}
              >
                Ongoing exploration for recruiter outreach workflows. This prototype tests messaging loops and follow-up orchestration on top of the current platform architecture.
              </p>

              {/* Outreach：01 Problem Definition — 双栏版式与 Process「01 · Discovery」一致，右侧留图文位 */}
              <div
                className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 md:gap-14"
                style={{ marginTop: '56px', marginBottom: '72px' }}
              >
                <div>
                  <div
                    style={{
                      ...fontStyle,
                      fontSize: 'clamp(64px, 8vw, 96px)',
                      lineHeight: '1',
                      fontWeight: 200,
                      letterSpacing: '-0.04em',
                      color: 'rgb(0, 0, 0)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    01
                  </div>
                  <div
                    style={{
                      ...fontStyle,
                      fontSize: '11px',
                      lineHeight: '16px',
                      fontWeight: 500,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'oklch(0.556 0 0)',
                      marginTop: '16px',
                      maxWidth: '160px',
                    }}
                  >
                    Problem Definition
                  </div>
                </div>
                <div>
                  <h2
                    style={{
                      ...fontStyle,
                      fontSize: '28px',
                      lineHeight: '36px',
                      fontWeight: 500,
                      color: 'rgb(0, 0, 0)',
                      marginTop: 0,
                      marginBottom: '20px',
                    }}
                  >
                    Projects, Candidates, Campaigns, and Leads
                  </h2>
                  <ol
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      marginBottom: '28px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      maxWidth: '760px',
                    }}
                  >
                    {[
                      'Users are already familiar with the Campaigns/Leads model. How do we introduce Projects and Candidates without creating conceptual confusion or duplicating mental models?',
                      'How do we map Candidates (scoped to a Project) to Leads (scoped to a Campaign), when the same person may exist across multiple Projects and Campaigns?',
                      'How do we design the trigger logic so users can launch a Campaign directly from a Project context, with Candidates automatically becoming Leads?',
                    ].map((q, i) => (
                      <li
                        key={`outreach-problem-${i}`}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'auto 1fr',
                          columnGap: '16px',
                          alignItems: 'baseline',
                        }}
                      >
                        <span
                          style={{
                            ...fontStyle,
                            fontSize: '13px',
                            lineHeight: '30px',
                            fontWeight: 500,
                            color: 'oklch(0.556 0 0)',
                            fontVariantNumeric: 'tabular-nums',
                            letterSpacing: '0.08em',
                          }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          style={{
                            ...fontStyle,
                            fontSize: '16px',
                            lineHeight: '28px',
                            fontWeight: 400,
                            color: 'rgba(0, 0, 0, 0.82)',
                          }}
                        >
                          {q}
                        </span>
                      </li>
                    ))}
                  </ol>
                  {/* 触点1：Campaign 创建流程 — 仅在关键步骤下挂 ↑ 考量（与 Discovery 同样式） */}
                  <div
                    style={{
                      marginTop: '4px',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: '14px',
                      background: '#FFFFFF',
                      overflow: 'hidden',
                    }}
                    aria-label="Touchpoint 1 — Campaign creation flow from Project"
                  >
                    <div style={{ padding: '24px 24px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            ...fontStyle,
                            fontSize: '12px',
                            fontWeight: 500,
                            color: 'rgb(0, 0, 0)',
                          }}
                        >
                          Touchpoint 1 · Campaign from Project
                        </span>
                        <span
                          style={{
                            ...fontStyle,
                            fontSize: '10px',
                            fontWeight: 500,
                            color: '#0052CC',
                            background: 'rgba(0, 82, 204, 0.07)',
                            border: '1px solid rgba(0, 82, 204, 0.18)',
                            borderRadius: '4px',
                            padding: '2px 7px',
                          }}
                        >
                          Outreach MVP
                        </span>
                      </div>
                      <div className="flex items-start overflow-x-auto pb-1" style={{ gap: 0, rowGap: '20px' }}>
                        {[
                          {
                            label: 'Create\nCampaign',
                            sub: 'New outreach\ncampaign',
                            pain: null,
                          },
                          {
                            label: 'Select\nProject',
                            sub: 'Sourcing\ncontainer',
                            pain: 'Keeps Leads scoped\nto one hiring goal',
                          },
                          {
                            label: 'Leads from\nranking',
                            sub: 'Version · latest\nby default',
                            pain: 'Latest rank avoids\nstale cohort drift',
                          },
                          {
                            label: 'Score\nfilter',
                            sub: 'e.g. above 80\nor above 60',
                            pain: 'Scores become a\nsendable slice',
                          },
                          {
                            label: 'Sequence',
                            sub: 'Select or\ncreate new',
                            pain: null,
                          },
                          {
                            label: 'Launch &\ntrack',
                            sub: 'Created ·\nmonitor campaign',
                            pain: null,
                          },
                        ].map(({ label: stepLabel, sub, pain }, i, arr) => (
                          <div key={stepLabel} className="flex items-start" style={{ flex: '1 0 88px', minWidth: '88px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  border: '1px solid rgba(0, 0, 0, 0.1)',
                                  borderRadius: '8px',
                                  background: 'rgba(0, 0, 0, 0.02)',
                                  padding: '8px 10px',
                                  width: '100%',
                                  textAlign: 'center',
                                }}
                              >
                                <div
                                  style={{
                                    ...fontStyle,
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    color: 'rgb(0, 0, 0)',
                                    lineHeight: '16px',
                                    marginBottom: '3px',
                                    whiteSpace: 'pre-line',
                                  }}
                                >
                                  {stepLabel}
                                </div>
                                <div
                                  style={{
                                    ...fontStyle,
                                    fontSize: '10px',
                                    fontWeight: 400,
                                    color: 'rgba(0, 0, 0, 0.4)',
                                    lineHeight: '14px',
                                    whiteSpace: 'pre-line',
                                  }}
                                >
                                  {sub}
                                </div>
                              </div>
                              {pain ? (
                                <div
                                  style={{
                                    ...fontStyle,
                                    fontSize: '10px',
                                    fontWeight: 500,
                                    color: 'rgba(200, 50, 30, 0.85)',
                                    background: 'rgba(220, 60, 40, 0.07)',
                                    border: '1px solid rgba(220, 60, 40, 0.18)',
                                    borderRadius: '5px',
                                    padding: '3px 7px',
                                    textAlign: 'center',
                                    lineHeight: '13px',
                                    whiteSpace: 'pre-line',
                                  }}
                                >
                                  ↑ {pain}
                                </div>
                              ) : (
                                <div style={{ height: '32px' }} />
                              )}
                            </div>
                            {i < arr.length - 1 && (
                              <div
                                aria-hidden
                                style={{
                                  ...fontStyle,
                                  fontSize: '14px',
                                  fontWeight: 300,
                                  color: 'rgba(0, 0, 0, 0.2)',
                                  padding: '0 4px',
                                  marginTop: '22px',
                                  flexShrink: 0,
                                }}
                              >
                                →
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 触点2：Rank 结束后触发 Outreach — 同上，仅重点步骤带考量 */}
                  <div
                    style={{
                      marginTop: '24px',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: '14px',
                      background: '#FFFFFF',
                      overflow: 'hidden',
                    }}
                    aria-label="Touchpoint 2 — Outreach after ranking completes"
                  >
                    <div style={{ padding: '24px 24px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            ...fontStyle,
                            fontSize: '12px',
                            fontWeight: 500,
                            color: 'rgb(0, 0, 0)',
                          }}
                        >
                          Touchpoint 2 · After ranking completes
                        </span>
                        <span
                          style={{
                            ...fontStyle,
                            fontSize: '10px',
                            fontWeight: 500,
                            color: '#0052CC',
                            background: 'rgba(0, 82, 204, 0.07)',
                            border: '1px solid rgba(0, 82, 204, 0.18)',
                            borderRadius: '4px',
                            padding: '2px 7px',
                          }}
                        >
                          Outreach MVP
                        </span>
                      </div>
                      <div className="flex items-start overflow-x-auto pb-1" style={{ gap: 0, rowGap: '20px' }}>
                        {[
                          {
                            label: 'Ranking\ncomplete',
                            sub: 'Rank run\nfinishes',
                            pain: null,
                          },
                          {
                            label: 'Start\noutreach?',
                            sub: 'Post-rank\nprompt',
                            pain: 'Explicit opt-in,\nno pushy automation',
                          },
                          {
                            label: 'Score\nfilter',
                            sub: 'e.g. above 80\nor above 60',
                            pain: null,
                          },
                          {
                            label: 'Sequence',
                            sub: 'Select or\ncreate new',
                            pain: null,
                          },
                          {
                            label: 'Launch &\ntrack',
                            sub: 'Go live +\nmonitor',
                            pain: 'Closes rank →\nreach loop',
                          },
                        ].map(({ label: stepLabel, sub, pain }, i, arr) => (
                          <div key={`tp2-${i}`} className="flex items-start" style={{ flex: '1 0 88px', minWidth: '88px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  border: '1px solid rgba(0, 0, 0, 0.1)',
                                  borderRadius: '8px',
                                  background: 'rgba(0, 0, 0, 0.02)',
                                  padding: '8px 10px',
                                  width: '100%',
                                  textAlign: 'center',
                                }}
                              >
                                <div
                                  style={{
                                    ...fontStyle,
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    color: 'rgb(0, 0, 0)',
                                    lineHeight: '16px',
                                    marginBottom: '3px',
                                    whiteSpace: 'pre-line',
                                  }}
                                >
                                  {stepLabel}
                                </div>
                                <div
                                  style={{
                                    ...fontStyle,
                                    fontSize: '10px',
                                    fontWeight: 400,
                                    color: 'rgba(0, 0, 0, 0.4)',
                                    lineHeight: '14px',
                                    whiteSpace: 'pre-line',
                                  }}
                                >
                                  {sub}
                                </div>
                              </div>
                              {pain ? (
                                <div
                                  style={{
                                    ...fontStyle,
                                    fontSize: '10px',
                                    fontWeight: 500,
                                    color: 'rgba(200, 50, 30, 0.85)',
                                    background: 'rgba(220, 60, 40, 0.07)',
                                    border: '1px solid rgba(220, 60, 40, 0.18)',
                                    borderRadius: '5px',
                                    padding: '3px 7px',
                                    textAlign: 'center',
                                    lineHeight: '13px',
                                    whiteSpace: 'pre-line',
                                  }}
                                >
                                  ↑ {pain}
                                </div>
                              ) : (
                                <div style={{ height: '32px' }} />
                              )}
                            </div>
                            {i < arr.length - 1 && (
                              <div
                                aria-hidden
                                style={{
                                  ...fontStyle,
                                  fontSize: '14px',
                                  fontWeight: 300,
                                  color: 'rgba(0, 0, 0, 0.2)',
                                  padding: '0 4px',
                                  marginTop: '22px',
                                  flexShrink: 0,
                                }}
                              >
                                →
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Outreach：02 Competitive analysis — 与 Process「02 · Product decision」同构；长眉题允许在左栏折行 */}
              <div
                className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 md:gap-14"
                style={{ marginBottom: '72px' }}
              >
                <div>
                  <div
                    style={{
                      ...fontStyle,
                      fontSize: 'clamp(64px, 8vw, 96px)',
                      lineHeight: '1',
                      fontWeight: 200,
                      letterSpacing: '-0.04em',
                      color: 'rgb(0, 0, 0)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    02
                  </div>
                  <div
                    style={{
                      ...fontStyle,
                      fontSize: '11px',
                      lineHeight: '16px',
                      fontWeight: 500,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'oklch(0.556 0 0)',
                      marginTop: '16px',
                      maxWidth: '160px',
                    }}
                  >
                    Competitive Analysis &amp; Design Adaptation
                  </div>
                </div>
                <div>
                  <h2
                    style={{
                      ...fontStyle,
                      fontSize: '28px',
                      lineHeight: '36px',
                      fontWeight: 500,
                      color: 'rgb(0, 0, 0)',
                      marginTop: 0,
                      marginBottom: '20px',
                    }}
                  >
                    MVP patterns from established outreach tools
                  </h2>
                  <p
                    style={{
                      ...fontStyle,
                      fontSize: '17px',
                      lineHeight: '30px',
                      fontWeight: 400,
                      color: 'rgba(0, 0, 0, 0.82)',
                      maxWidth: '760px',
                      marginTop: 0,
                      marginBottom: '16px',
                    }}
                  >
                    Since we are building an MVP, we referenced established outreach platforms (e.g. Apollo, Outreach.io, Salesloft) for core functionality and interaction patterns, adapting only the visual language to align with our design system.
                  </p>
                  <div
                    style={{
                      ...fontStyle,
                      fontSize: '15px',
                      lineHeight: '24px',
                      fontWeight: 500,
                      color: 'rgb(0, 0, 0)',
                      marginBottom: '10px',
                    }}
                  >
                    Features referenced:
                  </div>
                  <ul
                    style={{
                      ...fontStyle,
                      margin: '0 0 28px',
                      paddingLeft: '1.15em',
                      fontSize: '16px',
                      lineHeight: '28px',
                      fontWeight: 400,
                      color: 'rgba(0, 0, 0, 0.78)',
                      maxWidth: '760px',
                    }}
                  >
                    <li style={{ marginBottom: '8px' }}>
                      <strong style={{ fontWeight: 500, color: 'rgb(0, 0, 0)' }}>Campaign creation flow</strong> — multi-step setup with audience, sequence, and schedule
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      <strong style={{ fontWeight: 500, color: 'rgb(0, 0, 0)' }}>Lead status tracking</strong> — pipeline view with stages (New / Contacted / Replied / Converted)
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      <strong style={{ fontWeight: 500, color: 'rgb(0, 0, 0)' }}>Sequence builder</strong> — automated multi-touch messaging with delay intervals
                    </li>
                    <li>
                      <strong style={{ fontWeight: 500, color: 'rgb(0, 0, 0)' }}>Campaign analytics</strong> — open rate, reply rate, conversion per campaign
                    </li>
                  </ul>
                  <div
                    style={{
                      width: '100%',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      background: '#F8F9FB',
                      padding: '10px',
                    }}
                    aria-label="Competitive analysis — outreach reference visual"
                  >
                    <img
                      src="/img/connectnova/outreach%20.avif"
                      alt="ConnectNova outreach — competitive analysis and design adaptation reference"
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        borderRadius: '8px',
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ width: '100%', margin: '0 0 48px' }}>
                <div
                  style={{
                    ...fontStyle,
                    fontSize: '11px',
                    lineHeight: '16px',
                    fontWeight: 500,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'oklch(0.556 0 0)',
                    marginBottom: '8px',
                  }}
                >
                  Outreach workflow
                </div>
                <div
                  style={{
                    width: '100%',
                    borderRadius: '14px',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src="/img/connectnova/Workflow.avif"
                    alt="Outreach workflow for ConnectNova"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              </div>
              <div
                style={{
                  ...fontStyle,
                  fontSize: '17px',
                  lineHeight: '30px',
                  fontWeight: 400,
                  color: 'rgba(0, 0, 0, 0.82)',
                  marginTop: 0,
                  marginBottom: '24px',
                  maxWidth: '980px',
                }}
              >
                Sequence editing canvas — users can visually build and edit a Sequence by adding nodes and connecting steps. This interactive prototype focuses on component organization and a first-pass interaction experience.
              </div>
              <div
                style={{
                  width: '100%',
                  maxWidth: '980px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <iframe
                  style={{ border: 0, width: '100%', height: '560px', display: 'block' }}
                  src="https://embed.figma.com/proto/e7hxbnwajw3R2vy3S79kQU/ConnectNova?node-id=379-1216&viewport=238%2C698%2C0.44&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=379%3A1216&page-id=373%3A1205&embed-host=share"
                  allowFullScreen
                />
              </div>
            </div>

            {/* ——————————————————————————————————————————————
                06 · DESIGN DECISIONS — decision / rationale table
                复用 Problem "Why tools don't solve it" 的表格 DNA
                —————————————————————————————————————————————— */}
            <div data-case-nav-label="06 / Design Decisions">
              <div
                style={{
                  ...fontStyle,
                  fontSize: '12px',
                  lineHeight: '16px',
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'oklch(0.556 0 0)',
                  marginBottom: '12px',
                }}
              >
                06 · Design decisions
              </div>
              <h2
                style={{
                  ...fontStyle,
                  fontSize: '28px',
                  lineHeight: '36px',
                  fontWeight: 500,
                  color: 'rgb(0, 0, 0)',
                  marginTop: 0,
                  marginBottom: '24px',
                }}
              >
                What held it together
              </h2>

              <div
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '14px',
                  background: '#FFFFFF',
                  overflow: 'hidden',
                }}
              >
                {[
                  {
                    decision: 'Two-layer IA instead of three',
                    reason: 'Recruiters care most about the latest ranking — removing the extra hop puts them one click away from what they came for.',
                  },
                  {
                    decision: 'The Project concept',
                    reason: 'Lays the architectural foundation for the platform to grow into full candidate management over time.',
                  },
                  {
                    decision: 'Shared token system across extension + dashboard',
                    reason: 'Consistent visual language across surfaces; clean variable reference for engineers; shippable inside the six-week window.',
                  },
                  {
                    decision: 'Candidate Pool as a separate tab',
                    reason: 'Decouples collection from ranking and supports sourcing candidates across multiple sessions for the same role.',
                  },
                ].map(({ decision, reason }, idx, arr) => (
                  <div
                    key={decision}
                    className="grid grid-cols-1 md:grid-cols-[minmax(220px,320px)_1fr]"
                    style={{
                      columnGap: '32px',
                      rowGap: '4px',
                      padding: '22px 24px',
                      borderBottom: idx < arr.length - 1 ? '1px solid rgba(0, 0, 0, 0.06)' : 'none',
                    }}
                  >
                    <div
                      style={{
                        ...fontStyle,
                        fontSize: '16px',
                        lineHeight: '26px',
                        fontWeight: 500,
                        color: 'rgb(0, 0, 0)',
                      }}
                    >
                      {decision}
                    </div>
                    <div
                      style={{
                        ...fontStyle,
                        fontSize: '16px',
                        lineHeight: '26px',
                        fontWeight: 400,
                        color: 'rgba(0, 0, 0, 0.72)',
                      }}
                    >
                      {reason}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>

      {/* Reflection Section —— Case study 的收尾：Proud / Would redo / Next 三幕。
          视觉策略（与 Problem/Process/Solution 拉开距离）：
          · 白底 + 无卡片 / 无占位图，恢复最纯粹的排版
          · 窄阅读栏 760px（向左对齐到 1280 容器内），营造"专栏文章"而非产品仪表盘
          · 眉题系统从 "NN · label" 升级为大号 thin 罗马数字 + 竖线 + 小 tracked caps 标签
          · kicker 首次全部使用 italic medium —— 作为 Reflection 独有的排印 signature */}
      <section
        hidden
        className="w-screen"
        data-case-nav-label="Reflection"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '96px',
          paddingBottom: '112px',
        }}
      >
        <ScrollAnimatedSection>
          <div style={{ maxWidth: CASE_STUDY_CONTENT_WIDTH, margin: '0 auto' }}>
            {/* 分区一级标题 + 导语 */}
            <h1 style={headingLevel1Style}>Reflection</h1>
            <p
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '30px',
                fontWeight: 400,
                color: 'rgba(0, 0, 0, 0.88)',
                maxWidth: '760px',
                marginTop: 0,
                marginBottom: '72px',
              }}
            >
              A few honest notes on what worked, what I&apos;d rework, and where the product is headed from here.
            </p>

            {/* 四幕容器 —— 窄阅读栏，居左而非居中，保持整页左对齐的节律 */}
            <div
              style={{
                maxWidth: '760px',
                marginLeft: 0,
                marginRight: 'auto',
              }}
            >
              {[
                {
                  roman: 'I',
                  label: 'Process',
                  items: [
                    {
                      kicker: 'Code is a design medium.',
                      body: 'Prototyping in real code meant zero translation between design and engineering. What got designed got shipped — no handoff gap, no fidelity loss.',
                    },
                    {
                      kicker: 'Figma came after, not before.',
                      body: 'Used Figma MCP to generate specs from the live codebase. Design documentation caught up to the product — not the other way around.',
                    },
                  ],
                },
                {
                  roman: 'II',
                  label: 'Methods',
                  items: [
                    {
                      kicker: 'Map the workflow before touching the IA.',
                      body: "Tracing both users' end-to-end journeys — before any interface decisions — made the shared gap obvious. The problem defined itself once the workflow was visible.",
                    },
                    {
                      kicker: 'Same job, different context.',
                      body: 'Recruiters and sales reps share one core JTBD: find and prioritize people on LinkedIn. Recognizing this let us design one platform instead of two separate products.',
                    },
                    {
                      kicker: 'Domain expertise is a research shortcut — with a cost.',
                      body: 'One expert partner gave us speed and depth. But a single perspective has blind spots. The tradeoff was velocity over breadth.',
                    },
                  ],
                },
                {
                  roman: 'III',
                  label: 'Proud of',
                  items: [
                    {
                      kicker: 'Designing beyond the brief.',
                      body: "Project wasn't in the original spec. Advocating for it changed the platform from a ranking widget into the foundation for a full pipeline product.",
                    },
                    {
                      kicker: 'Speed through good foundations.',
                      body: 'A token-based design system established early meant every screen felt coherent at launch — not polished later, but right from the start.',
                    },
                  ],
                },
                {
                  roman: 'IV',
                  label: 'What comes next',
                  items: [
                    {
                      kicker: null,
                      body: 'V0 is live. Next priority: structured testing with real users to validate the two-layer IA and the Project concept.',
                    },
                    {
                      kicker: null,
                      body: 'Roadmap: outreach automation, pipeline tracking, and team collaboration — all of which the current architecture was designed to support.',
                    },
                  ],
                },
              ].map(({ roman, label, items }, actIdx, acts) => (
                <div
                  key={roman}
                  style={{
                    marginTop: actIdx === 0 ? 0 : '80px',
                  }}
                >
                  {/* 幕首：大号 thin 罗马数字 + 竖细分隔线 + 小 tracked caps 标签 */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      marginBottom: '32px',
                    }}
                  >
                    <div
                      style={{
                        ...fontStyle,
                        fontSize: '56px',
                        lineHeight: '1',
                        fontWeight: 200,
                        letterSpacing: '0.02em',
                        color: 'rgb(0, 0, 0)',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {roman}
                    </div>
                    <div
                      aria-hidden
                      style={{
                        width: '1px',
                        height: '40px',
                        background: 'rgba(0, 0, 0, 0.16)',
                      }}
                    />
                    <div
                      style={{
                        ...fontStyle,
                        fontSize: '12px',
                        lineHeight: '16px',
                        fontWeight: 500,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'rgb(0, 0, 0)',
                      }}
                    >
                      {label}
                    </div>
                  </div>

                  {/* 幕内容 */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '28px',
                    }}
                  >
                    {items.map((item, itemIdx) => (
                      <div key={itemIdx}>
                        {item.kicker && (
                          <div
                            style={{
                              ...fontStyle,
                              fontSize: '19px',
                              lineHeight: '28px',
                              fontWeight: 500,
                              fontStyle: 'italic',
                              color: 'rgb(0, 0, 0)',
                              marginBottom: '10px',
                            }}
                          >
                            {item.kicker}
                          </div>
                        )}
                        <p
                          style={{
                            ...fontStyle,
                            fontSize: '17px',
                            lineHeight: '30px',
                            fontWeight: 400,
                            color: 'rgba(0, 0, 0, 0.82)',
                            margin: 0,
                          }}
                        >
                          {item.body}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* 幕间分割：除最后一幕外，在幕底留一条极淡的 hairline 作为换幕暗示 */}
                  {actIdx < acts.length - 1 && (
                    <div
                      aria-hidden
                      style={{
                        marginTop: '80px',
                        height: '1px',
                        width: '120px',
                        background: 'rgba(0, 0, 0, 0.16)',
                      }}
                    />
                  )}
                </div>
              ))}

              <div style={{ marginTop: '72px' }}>
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '15px',
                    lineHeight: '24px',
                    fontWeight: 500,
                    color: 'oklch(0.4 0 0)',
                    marginBottom: '16px',
                  }}
                >
                  Live and in production · Used by real recruiting teams
                </p>
                <a
                  href="https://connectnova.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    ...fontStyle,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    borderRadius: '9999px',
                    backgroundColor: '#010214',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    fontSize: '15px',
                    lineHeight: '22px',
                    fontWeight: 500,
                    padding: '12px 18px',
                  }}
                >
                  Explore the live site
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0 }}
                    aria-hidden
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>
              <div style={{ marginTop: '56px' }}>
                <CaseStudyBackButton />
              </div>
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>


    </div>
  );
}
