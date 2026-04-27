'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// 统一从 design-tokens 引用字体与文字样式预设，避免每页重复声明 Manrope 实例
import { fontFamily, textStyle, textColor } from '@/lib/design-tokens';
// 详情页通用 Hero（MemQ 风格的可展开"项目概览"），由两个项目页共享
import ProjectHero from '../../components/ProjectHero';

/** Fig 7：Solution 卡片内嵌 mock 外框高度 */
const connectNovaSolutionMockFrameClassName =
  'h-[min(380px,45svh)] w-full min-h-0 overflow-hidden rounded-[10px] border border-dashed border-black/15 sm:h-[min(400px,48svh)]';

/** Fig 9：Profile Panel mock 专用外框（比 Fig 7 更高，便于侧栏内滚动与内容展开） */
const connectNovaProfilePanelMockFrameClassName =
  'h-[min(500px,58svh)] w-full min-h-0 overflow-hidden rounded-[10px] border border-dashed border-black/15 sm:h-[min(540px,62svh)]';

// 自定义 hook：检测元素是否进入视口并触发动画
function useScrollAnimation(initialDelay: number = 0) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -100px 0px',
        }
      );

      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInViewport) {
          setIsVisible(true);
        } else {
          observer.observe(ref.current);
        }
      }

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, initialDelay);

    return () => {
      clearTimeout(timer);
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
}: {
  fontStyle: { fontFamily: string };
  defaultTab?: 'rankings' | 'pool';
}) {
  // 对齐截图主色（ConnectNova 系蓝）
  const primary = '#0052CC';

  const [hasEntered, setHasEntered] = useState(false);
  const [activeTab, setActiveTab] = useState<'rankings' | 'pool'>(defaultTab);
  const [expandedCandidateName, setExpandedCandidateName] = useState<string | null>(null);

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
    return () => window.clearTimeout(timer);
  }, []);

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
      className={`flex flex-col bg-slate-50 ${connectNovaSolutionMockFrameClassName}`}
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
                    <Image
                      src={item.avatarSrc}
                      alt=""
                      width={28}
                      height={28}
                      className="h-7 w-7 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="truncate text-[9px] font-semibold text-slate-900">{item.name}</span>
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
                        {/* 左侧：点击展开 Criteria */}
                        <button
                          type="button"
                          onClick={handleToggleCriteria}
                          className="flex min-w-0 flex-1 items-start gap-1.5 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-[#0052CC]/25"
                        >
                          <span
                            className={`inline-flex h-7 min-w-[26px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold tabular-nums ${
                              isRankOne
                                ? 'bg-neutral-900 text-white'
                                : 'border border-slate-300 bg-white text-slate-700'
                            }`}
                          >
                            {candidate.rank}
                          </span>
                          <Image
                            src={candidate.avatarSrc}
                            alt=""
                            width={28}
                            height={28}
                            className="h-7 w-7 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <span className="min-w-0">
                            <span className="flex flex-wrap items-center gap-1">
                              <span className="truncate text-[10px] font-bold text-slate-900">{candidate.name}</span>
                              <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] bg-[#0A66C2]">
                                <Image src="/LinkedIN.svg" alt="" width={10} height={10} className="h-2.5 w-2.5 invert" />
                              </span>
                            </span>
                            <span className="mt-0.5 line-clamp-2 text-[8px] leading-3 text-slate-500">{candidate.headline}</span>
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
                          </span>
                        </button>

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
    </div>
  );
}

/** Fig 9：列表 + Profile 抽屉（结构对齐 ConnectNova `Sheet` Profile，外框高度与 Fig 7 共用常量） */
function ProfilePanelSlideMock({ fontStyle }: { fontStyle: { fontFamily: string } }) {
  const primary = '#0052CC';
  const [gridOpen, setGridOpen] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
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
    setPanelVisible(false);
    closeTimerRef.current = window.setTimeout(() => {
      setGridOpen(false);
      setActiveRowId(null);
      setAboutExpanded(false);
      setNotesEditing(false);
      closeTimerRef.current = null;
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
      className={`grid min-h-0 bg-slate-50 ${connectNovaProfilePanelMockFrameClassName}`}
      style={{
        ...fontStyle,
        gridTemplateColumns: gridOpen ? 'minmax(0,1fr) 300px' : 'minmax(0,1fr) 0fr',
        transition: 'grid-template-columns 280ms ease',
      }}
      aria-label="Profile panel slide-in mock"
    >
      {/* 左：Ranked 列表（示意 Fig 7 入口） */}
      <div className="flex min-h-0 min-w-0 flex-col border-r border-black/[0.06] bg-white">
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
      <div className="relative min-h-0 overflow-hidden bg-white">
        <div
          className="absolute inset-y-0 right-0 h-full min-h-0 w-[300px] border-l border-black/[0.08] bg-white"
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
                  src="/img/jobnova/persona-sarah.jpg"
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-white/80"
                />
                <div className="min-w-0 pt-0.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h2 className="text-[13px] font-bold leading-tight text-black/90">Sarah Chen</h2>
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
                    Senior Product Manager · Roadmaps, discovery, and shipping cross-team outcomes.
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
                      Google
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
                      San Francisco Bay Area
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
    <div className="cn-scope" style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', background: '#FFFFFF', overflow: 'hidden', marginTop: '12px', position: 'relative' as const }}>
      {/* Header */}
      <div style={{ padding: '14px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(0,0,0,0.015)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ ...s, fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase' as const, fontWeight: 500, color: 'rgba(0,0,0,0.4)' }}>
          Components
        </div>
        <span style={{ ...s, fontSize: '10px', fontWeight: 500, color: 'rgba(0,0,0,0.38)', fontStyle: 'italic' as const }}>Interactive · hover &amp; click to explore</span>
      </div>

      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column' as const, gap: '24px' }}>

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
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '20px' }}>
          <div>
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
          <div>
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
          <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: '12px' }}>
            {/* Search */}
            <div>
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
            <div>
              <div style={{ ...s, fontSize: '11px', fontWeight: 500, color: 'rgba(0,0,0,0.5)', marginBottom: '6px' }}>Project name</div>
              <input
                type="text"
                placeholder="e.g. Senior PM – Fintech"
                className="cn-input"
                style={s}
              />
            </div>
            {/* Disabled input */}
            <div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '20px' }}>
          {/* Dropdown */}
          <div>
            {sectionLabel('Dropdown')}
            <div style={{ position: 'relative' as const }}>
              <button
                onClick={() => setDropdownOpen(v => !v)}
                style={{ ...s, fontSize: '13px', fontWeight: 400, color: 'rgb(0,0,0)', background: '#fff', border: `1px solid ${dropdownOpen ? 'var(--cn-primary)' : 'rgba(0,0,0,0.16)'}`, borderRadius: '7px', padding: '8px 12px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', outline: 'none', boxShadow: dropdownOpen ? '0 0 0 3px var(--cn-primary-ring)' : 'none', transition: 'border-color 0.15s' }}
              >
                <span>{selectedVersion}</span>
                <span style={{ ...s, fontSize: '10px', color: 'rgba(0,0,0,0.35)', transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>▾</span>
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
          <div>
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
      <div style={{ padding: '12px 24px', borderTop: '1px solid rgba(0,0,0,0.06)', background: 'rgba(0,0,0,0.015)', ...s, fontSize: '13px', color: 'oklch(0.556 0 0)', fontStyle: 'italic' as const }}>
        All components share the same token layer — swap a color variable and both extension and dashboard update together
      </div>

      {/* Popup overlay */}
      {popupOpen && (
        <div
          style={{ position: 'absolute' as const, inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, borderRadius: '14px' }}
          onClick={() => setPopupOpen(false)}
        >
          <div
            style={{ background: '#fff', borderRadius: '12px', padding: '24px', width: '300px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
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

  const extensionMockRows = [
    { name: 'Alex Morgan', role: 'Senior Product Manager @ Stripe' },
    { name: 'Jamie Carter', role: 'Principal PM @ Notion' },
    { name: 'Taylor Nguyen', role: 'Lead Product Manager @ Airbnb' },
    { name: 'Jordan Patel', role: 'Group Product Manager @ Uber' },
  ];
  const totalMockCandidates = extensionMockRows.length;
  const defaultMockCollectionMode: 'pages' | 'count' = 'count';
  const defaultMockMaxPages = 4;
  const defaultMockMaxCount = 4;
  const [collectionState, setCollectionState] = useState<'idle' | 'collecting' | 'done'>('idle');
  const [collectedCount, setCollectedCount] = useState(0);
  const [isCountFlipping, setIsCountFlipping] = useState(false);
  const [mockCollectionMode, setMockCollectionMode] = useState<'pages' | 'count'>(defaultMockCollectionMode);
  const [mockMaxPages, setMockMaxPages] = useState(defaultMockMaxPages);
  const [mockMaxCount, setMockMaxCount] = useState(defaultMockMaxCount);
  const [mockCountCustomOpen, setMockCountCustomOpen] = useState(false);
  const [mockCountCustomDraft, setMockCountCustomDraft] = useState(String(defaultMockMaxCount));
  const [isDashboardRedirecting, setIsDashboardRedirecting] = useState(false);
  const [removedMockCandidates, setRemovedMockCandidates] = useState<string[]>([]);
  const demoTargetCount =
    mockCollectionMode === 'pages'
      ? Math.max(1, Math.min(mockMaxPages, totalMockCandidates))
      : Math.max(1, Math.min(mockMaxCount, totalMockCandidates));
  const doneVisibleCandidates = extensionMockRows
    .slice(0, demoTargetCount)
    .filter((candidate) => !removedMockCandidates.includes(candidate.name));
  const doneCollectedCount = doneVisibleCandidates.length;
  const quickCountPresets = [1, 2, 3, 4];
  const mockCountSliderPercent =
    ((mockMaxCount - 1) / Math.max(1, totalMockCandidates - 1)) * 100;

  const getMockInitials = (name: string) =>
    name
      .split(' ')
      .map((part) => part[0] ?? '')
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const resetCollectionDemo = () => {
    setCollectionState('idle');
    setCollectedCount(0);
    setIsCountFlipping(false);
    setIsDashboardRedirecting(false);
    setRemovedMockCandidates([]);
    setMockCollectionMode(defaultMockCollectionMode);
    setMockMaxPages(defaultMockMaxPages);
    setMockMaxCount(defaultMockMaxCount);
    setMockCountCustomOpen(false);
    setMockCountCustomDraft(String(defaultMockMaxCount));
  };

  const handleStartCollection = () => {
    if (collectionState !== 'idle') return;
    setCollectedCount(0);
    setRemovedMockCandidates([]);
    setMockCountCustomOpen(false);
    setCollectionState('collecting');
  };

  const handleGoToDashboard = () => {
    if (collectionState !== 'done' || isDashboardRedirecting || doneCollectedCount === 0) return;
    setIsDashboardRedirecting(true);
    window.setTimeout(() => {
      resetCollectionDemo();
    }, 650);
  };

  const handleRemoveDoneCandidate = (name: string) => {
    setRemovedMockCandidates((prev) => (prev.includes(name) ? prev : [...prev, name]));
  };

  // 逐条收集动画：每 600ms 完成一条并推进计数
  useEffect(() => {
    if (collectionState !== 'collecting') return;
    if (collectedCount >= demoTargetCount) {
      // 避免在 effect 同步路径里直接 setState（eslint react-hooks/set-state-in-effect）
      const doneTimer = window.setTimeout(() => {
        setCollectionState('done');
      }, 0);
      return () => window.clearTimeout(doneTimer);
    }

    const timer = window.setTimeout(() => {
      setCollectedCount((prev) => prev + 1);
      setIsCountFlipping(true);
    }, 600);

    return () => window.clearTimeout(timer);
  }, [collectionState, collectedCount, demoTargetCount]);

  // 数字翻动的轻量动效：持续 200ms
  useEffect(() => {
    if (!isCountFlipping) return;
    const timer = window.setTimeout(() => {
      setIsCountFlipping(false);
    }, 200);
    return () => window.clearTimeout(timer);
  }, [isCountFlipping]);

  // 完成态停留 2 秒后自动回到 Idle
  useEffect(() => {
    if (collectionState !== 'done' || isDashboardRedirecting) return;
    const timer = window.setTimeout(() => {
      resetCollectionDemo();
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [collectionState, isDashboardRedirecting]);

  return (
    <div className="w-full min-w-0" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Hero Section —— 结构与 MemQ 详情页顶部一致：返回按钮 + 可展开"项目概览" + H1 + 描述 */}
      <section 
        className="w-screen"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '120px',
          paddingBottom: '80px',
        }}
      >
        <ScrollAnimatedSection initialDelay={200}>
          {/* Hero 内层使用通用 ProjectHero 组件（与 jobnova 共享） */}
          <ProjectHero
            title="ConnectNova"
            roleSummary="Founding Product Designer · AI Startup · 2026 – Present (Ongoing)"
            roleDetails={[
              'Requirements definition & product strategy · Competitive benchmarking · Rapid design iteration',
              'Chrome Extension UI · Web Dashboard & AI ranking interface · Token-based design system · Live 0-to-1 MVP',
            ]}
            description="An AI-powered recruiting platform — a Chrome extension that collects LinkedIn candidate profiles, paired with a web dashboard to manage projects, rank candidates instantly, and build a structured pipeline. Designed to replace hours of manual screening with a fast, systematic workflow."
          />
        </ScrollAnimatedSection>
      </section>

      {/* Problem Section —— 编辑体叙事：日常现实 + 现有工具为何不解决 + 设计挑战。
          用浅灰 #FAFAFA 与上（Hero，白）、下（UX research，白）区分节奏；
          内部三个小节用"编号眉题 + H2"的杂志排版节奏，避免与 UX research 的标题层级撞车。 */}
      <section
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
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            {/* 分区一级标题 */}
            <h1 style={headingLevel1Style}>Problem</h1>

            {/* ——————————————————————————————————————————————
                SUBSECTION 1 · The recruiter's daily reality
                两段叙事 + 中间一个视觉锚定的 pull-stat "3–4 hrs / day"
                —————————————————————————————————————————————— */}
            <div style={{ marginBottom: '64px' }}>
              {/* 眉题：小号字母间距大 */}
              <div
                style={{
                  ...fontStyle,
                  fontSize: '12px',
                  lineHeight: '16px',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'oklch(0.556 0 0)',
                  marginBottom: '12px',
                }}
              >
                01 · Field observation
              </div>
              <h2
                style={{
                  ...fontStyle,
                  fontSize: '28px',
                  lineHeight: '36px',
                  fontWeight: 500,
                  color: 'rgb(0, 0, 0)',
                  marginBottom: '20px',
                }}
              >
                The recruiter&apos;s daily reality
              </h2>

              <p
                style={{
                  ...fontStyle,
                  fontSize: '17px',
                  lineHeight: '30px',
                  fontWeight: 400,
                  color: 'rgba(0, 0, 0, 0.82)',
                  maxWidth: '760px',
                  marginBottom: '32px',
                }}
              >
                A typical sourcing session on LinkedIn looks like this: search for <em style={{ fontStyle: 'italic', color: 'rgb(0, 0, 0)' }}>&quot;Senior Product Manager, San Francisco,&quot;</em> get hundreds of results, then open each profile one by one — reading, judging, copying notes into a spreadsheet. Repeat for every role, every day.
              </p>

              {/* Pull stat —— 数据锚：左边大数字，右边一句出处 */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  alignItems: 'center',
                  columnGap: '32px',
                  padding: '28px 0',
                  borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                  maxWidth: '760px',
                  marginBottom: '32px',
                }}
              >
                <div
                  style={{
                    ...fontStyle,
                    fontSize: 'clamp(48px, 7vw, 72px)',
                    lineHeight: '1',
                    fontWeight: 300,
                    color: 'rgb(0, 0, 0)',
                    letterSpacing: '-0.02em',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  3–4<span style={{ fontSize: '0.45em', marginLeft: '6px', fontWeight: 400, letterSpacing: '0' }}>hrs / day</span>
                </div>
                <div
                  style={{
                    ...fontStyle,
                    fontSize: '14px',
                    lineHeight: '22px',
                    fontWeight: 400,
                    color: 'oklch(0.556 0 0)',
                    borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                    paddingLeft: '24px',
                  }}
                >
                  Spent on manual sourcing alone, estimated by our market partner — a seasoned headhunter who walked us through his daily workflow.
                </div>
              </div>

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
                The frustration wasn&apos;t just the time — it was the lack of structure. There was no way to systematically compare candidates, no record of who had been reviewed, and no connection between this session and the next one for the same role.
              </p>
            </div>

            {/* ——————————————————————————————————————————————
                SUBSECTION 2 · Why existing tools don't solve it
                3 行对比表 + 以左侧 accent bar 收尾的 gap 陈述
                —————————————————————————————————————————————— */}
            <div style={{ marginBottom: '64px' }}>
              <div
                style={{
                  ...fontStyle,
                  fontSize: '12px',
                  lineHeight: '16px',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'oklch(0.556 0 0)',
                  marginBottom: '12px',
                }}
              >
                02 · Tooling audit
              </div>
              <h2
                style={{
                  ...fontStyle,
                  fontSize: '28px',
                  lineHeight: '36px',
                  fontWeight: 500,
                  color: 'rgb(0, 0, 0)',
                  marginBottom: '24px',
                }}
              >
                Why existing tools don&apos;t solve it
              </h2>

              {/* 对比表：单卡容器 + 每行独立 2 列网格，左工具 / 右原因，行间细分隔线 */}
              <div
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '14px',
                  background: '#FFFFFF',
                  overflow: 'hidden',
                  marginBottom: '32px',
                }}
              >
                {[
                  {
                    tool: "LinkedIn's native search",
                    reason: 'Ranks by keyword match and premium status — not by fit for a specific role.',
                  },
                  {
                    tool: 'ATS platforms',
                    reason: "Enter the picture after sourcing is done; they don't touch the screening phase.",
                  },
                  {
                    tool: 'Spreadsheets',
                    reason: 'Capture data but add manual overhead — and still require someone to do the ranking.',
                  },
                ].map(({ tool, reason }, idx, arr) => (
                  <div
                    key={tool}
                    className="grid grid-cols-1 md:grid-cols-[minmax(200px,280px)_1fr]"
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
                      {tool}
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

              {/* Gap 陈述：以 2px 左侧 accent 条 + italic 带出，视觉上像 pull quote */}
              <blockquote
                style={{
                  margin: 0,
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
                  The gap was clear: nothing existed between <span style={{ fontStyle: 'normal', fontWeight: 500 }}>&quot;run a LinkedIn search&quot;</span> and <span style={{ fontStyle: 'normal', fontWeight: 500 }}>&quot;have a ranked, manageable shortlist.&quot;</span>
                </p>
              </blockquote>
            </div>

            {/* ——————————————————————————————————————————————
                SUBSECTION 3 · The design challenge
                深色反白卡片 + 3 颗约束 pill，作为整个 Problem 分区的收尾
                —————————————————————————————————————————————— */}
            <div>
              <div
                style={{
                  ...fontStyle,
                  fontSize: '12px',
                  lineHeight: '16px',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'oklch(0.556 0 0)',
                  marginBottom: '12px',
                }}
              >
                03 · Brief
              </div>
              <h2
                style={{
                  ...fontStyle,
                  fontSize: '28px',
                  lineHeight: '36px',
                  fontWeight: 500,
                  color: 'rgb(0, 0, 0)',
                  marginBottom: '24px',
                }}
              >
                The design challenge
              </h2>

              <div
                style={{
                  background: 'rgb(0, 0, 0)',
                  color: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '36px 40px',
                  maxWidth: '900px',
                }}
              >
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '20px',
                    lineHeight: '32px',
                    fontWeight: 300,
                    color: '#FFFFFF',
                    marginTop: 0,
                    marginBottom: '28px',
                  }}
                >
                  Build a tool <strong style={{ fontWeight: 500, color: '#FFFFFF' }}>fast enough to ship in 6 weeks</strong>, <strong style={{ fontWeight: 500, color: '#FFFFFF' }}>simple enough for busy recruiters to adopt without training</strong> — and <strong style={{ fontWeight: 500, color: '#FFFFFF' }}>structured enough to grow into a full candidate management platform</strong>, not just a one-trick ranking widget.
                </p>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  {['6-week shipping window', 'Zero-training adoption', 'Platform, not widget'].map((label) => (
                    <span
                      key={label}
                      style={{
                        ...fontStyle,
                        fontSize: '13px',
                        lineHeight: '20px',
                        fontWeight: 500,
                        color: '#FFFFFF',
                        padding: '6px 14px',
                        borderRadius: '999px',
                        border: '1px solid rgba(255, 255, 255, 0.24)',
                        background: 'rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>

      {/* Process Section —— 四步线性叙事：Discovery → Product decision → IA → Design system。
          视觉策略：
          · 白底，与上方 Problem（#FAFAFA）形成节奏对比
          · 两栏栅格（desktop 160px 编号列 | 1fr 叙事列），移动端堆叠
          · 大号 thin 数字 01/02/03/04 作为视觉脊梁，呼应 Problem 里的 "3–4 hrs/day" 排印节奏
          · Step 3 用纯 CSS "三层 vs 两层" IA 对比图作为分区 centerpiece，其它三步配统一样式的占位图
          · 整块顶部一条 hairline，与 Problem 作为"分区切换"的信号 */}
      <section
        className="w-screen"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '96px',
          paddingBottom: '96px',
        }}
      >
        <ScrollAnimatedSection>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            {/* 分区一级标题 + 导语 */}
            <h1 style={headingLevel1Style}>Process</h1>
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
              Four decisions that shaped ConnectNova — from the first conversation with our market partner, through the architectural calls that turned a ranking widget into a platform.
            </p>

            {/* ——————————————————————————————————————————————
                STEP 01 · DISCOVERY
                —————————————————————————————————————————————— */}
            <div
              className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 md:gap-14"
              style={{ marginBottom: '96px' }}
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
                  Before touching any design, I mapped three distinct user segments — each with a different toolchain and a different kind of friction. The primary user is an <strong style={{ fontWeight: 500, color: 'rgb(0,0,0)' }}>individual LinkedIn user</strong> who searches for people regularly but has no structured way to collect or revisit results. Our market partner — a seasoned headhunter — works with <strong style={{ fontWeight: 500, color: 'rgb(0,0,0)' }}>LinkedIn Recruiter Lite</strong> and manages multiple roles simultaneously. Enterprise teams add a third layer: an <strong style={{ fontWeight: 500, color: 'rgb(0,0,0)' }}>ATS platform</strong> that handles post-apply tracking but offers no sourcing intelligence.
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
                  Across all three, the same gap surfaced: <strong style={{ fontWeight: 500, color: 'rgb(0,0,0)' }}>LinkedIn surfaces candidates but provides no place to collect, rank, or manage them</strong>. Everything after "find" is handled by a disconnected tool — or not at all.
                </p>

                {/* Fig 1：三类用户各自的工作流程图 + 痛点 */}
                {(() => {
                  const segments = [
                    {
                      label: 'Individual LinkedIn user',
                      badge: 'Primary',
                      badgeBlue: true,
                      steps: [
                        { label: 'Run search', sub: 'Keywords + filters', pain: null },
                        { label: 'Scroll results', sub: 'Browse profiles\nin feed', pain: 'No way to\nsave results' },
                        { label: 'Open profiles', sub: 'Each in a\nnew tab', pain: 'Context lost\nbetween tabs' },
                        { label: 'Take notes', sub: 'Screenshot or\ncopy URL', pain: 'No structure\nor format' },
                        { label: 'Re-search later', sub: 'Start over\nnext time', pain: 'Duplicates\neffort' },
                      ],
                    },
                    {
                      label: 'Headhunter / talent scout',
                      badge: 'Market partner',
                      badgeBlue: false,
                      steps: [
                        { label: 'Search in\nRecruiter Lite', sub: "LinkedIn's paid\nsourcing tool", pain: null },
                        { label: 'Shortlist\nmanually', sub: 'Review each\nprofile', pain: 'No AI\npre-screening' },
                        { label: 'Copy to Sheets', sub: 'Paste name,\ntitle, URL', pain: 'Manual &\nerror-prone' },
                        { label: 'Present\nto client', sub: 'Export or\nemail file', pain: 'Version\nchaos' },
                        { label: 'Track status', sub: 'Update cells\nper candidate', pain: 'No pipeline\nview' },
                      ],
                    },
                    {
                      label: 'Enterprise recruiter',
                      badge: null,
                      badgeBlue: false,
                      steps: [
                        { label: 'Post job\nin ATS', sub: 'Greenhouse,\nLever, etc.', pain: null },
                        { label: 'Source on\nLinkedIn', sub: 'Separate tool,\nno bridge', pain: 'ATS & LinkedIn\nnot connected' },
                        { label: 'Copy profiles\nmanually', sub: 'Switch tabs,\ncopy fields', pain: 'Duplicate\ndata entry' },
                        { label: 'Import to ATS', sub: 'Re-enter data\nby hand', pain: 'Sourcing\ncontext lost' },
                        { label: 'Track pipeline', sub: 'Screen &\ninterview', pain: null },
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
                        Shared gap across all three: LinkedIn surfaces candidates but provides no place to collect, rank, or track them.
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
                  The original ask was simple: paste a JD, upload candidates, get a ranking.
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
                  I pushed back and advocated for introducing the <strong style={{ fontWeight: 500, color: 'rgb(0, 0, 0)' }}>Project</strong> concept — a container that binds candidates to a specific hiring need. Three reasons:
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
                    'Headhunters juggle multiple roles simultaneously; candidates need to be scoped per role.',
                    'A single role is often sourced across multiple sessions — those candidates have to consolidate into the same project.',
                    'Long-term the platform has to grow into candidate management — pipeline, outreach, notes. Project is the architectural foundation for all of it.',
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
                    &ldquo;This shouldn&apos;t just be a ranking tool. It should be a candidate management platform.&rdquo;
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
                        { label: 'Paste JD', sub: 'Job description' },
                        { label: 'Upload candidates', sub: 'From this session only' },
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
                      Results aren't saved. Each session starts from zero. Candidates from different searches can't be combined.
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
                      {/* Project 顶部：名称 + hiring need */}
                      <div
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid rgba(0,0,0,0.06)',
                          background: 'rgba(0,82,204,0.03)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ ...fontStyle, fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, color: 'rgba(0,82,204,0.7)' }}>Project</span>
                          <span style={{ ...fontStyle, fontSize: '13px', fontWeight: 600, color: 'rgb(0,0,0)' }}>Senior Product Manager — Fintech</span>
                        </div>
                        <div style={{ ...fontStyle, fontSize: '11px', color: 'rgba(0,0,0,0.48)', lineHeight: '16px' }}>
                          Hiring need: 5+ yrs PM in fintech; strong data sense; US-based
                        </div>
                      </div>

                      {/* 两列：候选人池 + 排名版本 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2">
                        {/* 候选人池 */}
                        <div style={{ padding: '12px 16px', borderRight: '1px solid rgba(0,0,0,0.06)' }}>
                          <div style={{ ...fontStyle, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500, color: 'rgba(0,0,0,0.36)', marginBottom: '10px' }}>
                            Candidate pool · 24 total
                          </div>
                          <div style={{ ...fontStyle, fontSize: '10px', color: 'rgba(0,0,0,0.4)', marginBottom: '6px' }}>
                            Session 1 · Jan 10 · 12 candidates
                          </div>
                          <div style={{ ...fontStyle, fontSize: '10px', color: 'rgba(0,0,0,0.4)', marginBottom: '10px' }}>
                            Session 2 · Jan 18 · 12 candidates
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
                      One Project = one hiring need · candidates accumulate across sessions · rankings are versioned and reusable.
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
            <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 md:gap-14">
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
                      ].map(({ name, value, bg, light }) => (
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
          · 灰底 #FAFAFA，与 Problem 共用同一灰基调（"事实陈述型"章节），让 Process 的白底在中间作为叙事转折
          · 每个 subsection 有独立的 layout（hero/split/2x2/table），避免四段均质
          · Extension 占位图用 mock LinkedIn 顶栏"装"一下，兑现"嵌入 LinkedIn"的语义
          · Dashboard 的 4 个功能用 2x2 feature grid 作为 Solution 的视觉 centerpiece */}
      <section
        className="w-screen"
        style={{
          backgroundColor: '#FAFAFA',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '96px',
          paddingBottom: '96px',
        }}
      >
        <ScrollAnimatedSection>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
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
            <div style={{ marginBottom: '96px' }}>
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
                  padding: '28px',
                }}
                aria-label="Platform overview — Dashboard and Chrome Extension"
              >
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
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      borderRadius: '20px',
                      border: '8px solid #E5E7EB',
                    }}
                  >
                    <img
                      src="/img/connectnova/Dashboard.avif"
                      alt="ConnectNova dashboard overview"
                      style={{ width: 'auto', height: 'auto', maxWidth: '100%', objectFit: 'contain', display: 'block' }}
                    />
                  </div>
                  <div
                    style={{
                      flex: '0 1 auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      borderRadius: '20px',
                      border: '8px solid #E5E7EB',
                    }}
                  >
                    <img
                      src="/img/connectnova/Extension.avif"
                      alt="ConnectNova extension overview"
                      style={{ width: 'auto', height: 'auto', maxWidth: '100%', objectFit: 'contain', display: 'block' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ——————————————————————————————————————————————
                02 · CHROME EXTENSION — split layout
                —————————————————————————————————————————————— */}
            <div
              className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-14 items-start"
              style={{ marginBottom: '96px' }}
            >
              {/* 左：文字 + 编号 bullets */}
              <div>
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
                  }}
                >
                  Recruiters already do their sourcing on LinkedIn&apos;s search pages. The extension embeds as a side panel, so collection happens <em style={{ fontStyle: 'italic' }}>inside</em> the existing workflow — not next to it.
                </p>

                <ol
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {[
                    {
                      title: 'Define collection scope',
                      body: 'Set a page range or a candidate count — whatever matches the role\u2019s sourcing depth.',
                    },
                    {
                      title: 'One click to start',
                      body: 'The extension walks through the search results and captures every profile it finds.',
                    },
                    {
                      title: 'Save to a project',
                      body: 'Results are saved into a chosen project and land directly in the dashboard — no copy-paste.',
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
              </div>

              {/* 右：Mock LinkedIn chrome 包裹的占位图
                    —— 给"嵌入 LinkedIn"的叙事一个具体的视觉锚 */}
              <div
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '14px',
                  background: '#FFFFFF',
                  overflow: 'hidden',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px -12px rgba(0, 0, 0, 0.08)',
                }}
              >
                {/* Mock browser bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px 16px',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                    background: '#FAFAFA',
                  }}
                >
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['#F56E6E', '#F5BA3A', '#6BD19F'].map((c) => (
                      <span
                        key={c}
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '999px',
                          background: c,
                          display: 'inline-block',
                        }}
                      />
                    ))}
                  </div>
                  <div
                    style={{
                      ...fontStyle,
                      fontSize: '11px',
                      lineHeight: '20px',
                      fontWeight: 400,
                      color: 'oklch(0.556 0 0)',
                      background: '#FFFFFF',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: '6px',
                      padding: '2px 10px',
                      flex: '1 1 auto',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    linkedin.com/search/results/people/?keywords=senior+product+manager
                  </div>
                </div>
                {/* 交互演示区：Chrome Extension 收集流程 */}
                <div
                  style={{
                    height: '600px',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(170px, 0.62fr) minmax(320px, 1fr)',
                  }}
                  aria-label="Chrome extension collection flow demo"
                >
                  {/* 左侧：LinkedIn 环境提示（静态，不参与交互） */}
                  <div
                    style={{
                      background: '#FFFFFF',
                      padding: '14px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        ...fontStyle,
                        fontSize: '9px',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                        color: 'rgba(0, 0, 0, 0.46)',
                      }}
                    >
                      LinkedIn search results
                    </div>
                    {extensionMockRows.map((candidate) => {
                      return (
                        <div
                          key={candidate.name}
                          style={{
                            height: '50px',
                            display: 'grid',
                            gridTemplateColumns: '36px 1fr auto',
                            alignItems: 'center',
                            columnGap: '8px',
                            borderRadius: '8px',
                            padding: '0 8px',
                            borderLeft: '2px solid transparent',
                            background: '#FFFFFF',
                          }}
                        >
                          <span
                            aria-hidden
                            style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '999px',
                              background: 'rgba(0, 0, 0, 0.1)',
                              display: 'inline-block',
                            }}
                          />
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <span
                              style={{
                                ...fontStyle,
                                fontSize: '11px',
                                lineHeight: '14px',
                                fontWeight: 500,
                                color: 'rgba(0, 0, 0, 0.7)',
                              }}
                            >
                              {candidate.name}
                            </span>
                            <span
                              style={{
                                ...fontStyle,
                                fontSize: '9px',
                                lineHeight: '11px',
                                fontWeight: 400,
                                color: 'rgba(0, 0, 0, 0.48)',
                                maxWidth: '120px',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                              }}
                            >
                              {candidate.role}
                            </span>
                          </div>
                          <span
                            aria-hidden
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '999px',
                              background: 'rgba(0, 0, 0, 0.12)',
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* 右侧：ConnectNova 侧边栏 panel */}
                  <div
                    style={{
                      background: '#f5f9ff',
                      borderLeft: '1px solid rgba(0, 0, 0, 0.08)',
                      padding: '0',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* 顶部栏：对齐真实 extension 的品牌头部 */}
                    <div
                      style={{
                        background: '#FFFFFF',
                        borderBottom: '1px solid rgba(13, 28, 46, 0.06)',
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <span
                          aria-hidden
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '6px',
                            background: 'linear-gradient(135deg, #004ac6 0%, #2563eb 100%)',
                          }}
                        />
                        <span
                          style={{
                            ...fontStyle,
                            fontSize: '14px',
                            lineHeight: '16px',
                            fontWeight: 700,
                            color: '#0d1c2e',
                          }}
                        >
                          ConnectNova
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={resetCollectionDemo}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          padding: 0,
                          ...fontStyle,
                          fontSize: '14px',
                          lineHeight: '14px',
                          fontWeight: 500,
                          color: 'rgba(13, 28, 46, 0.4)',
                          cursor: 'pointer',
                        }}
                      >
                        ×
                      </button>
                    </div>

                    <div
                      style={{
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        flex: '1 1 auto',
                        minHeight: 0,
                      }}
                    >
                      {/* Idle：配置卡片（1:1 对齐 extension Step1） */}
                      {collectionState === 'idle' && (
                        <>
                          <div
                            style={{
                              borderRadius: '12px',
                              background: '#FFFFFF',
                              boxShadow: '0 2px 12px rgba(13, 28, 46, 0.06)',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                height: '34px',
                                padding: '0 12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: '0 1px 0 rgba(13, 28, 46, 0.06)',
                              }}
                            >
                              <span
                                aria-hidden
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '999px',
                                  background: '#006a61',
                                }}
                              />
                              <span
                                style={{
                                  ...fontStyle,
                                  fontSize: '11px',
                                  lineHeight: '14px',
                                  fontWeight: 500,
                                  color: 'rgba(13, 28, 46, 0.88)',
                                }}
                              >
                                LinkedIn people search detected
                              </span>
                            </div>

                            <div style={{ padding: '10px 12px 12px' }}>
                              <div
                                style={{
                                  ...fontStyle,
                                  fontSize: '9px',
                                  lineHeight: '12px',
                                  fontWeight: 700,
                                  letterSpacing: '0.12em',
                                  textTransform: 'uppercase',
                                  color: 'rgba(13, 28, 46, 0.45)',
                                  marginBottom: '4px',
                                }}
                              >
                                Save to project
                              </div>
                              <div
                                style={{
                                  ...fontStyle,
                                  fontSize: '13px',
                                  lineHeight: '18px',
                                  fontWeight: 600,
                                  color: '#0d1c2e',
                                  background: '#f5f9ff',
                                  borderRadius: '10px',
                                  padding: '8px 10px',
                                  marginBottom: '10px',
                                }}
                              >
                                Senior PM · SF
                              </div>

                              <div
                                style={{
                                  ...fontStyle,
                                  fontSize: '9px',
                                  lineHeight: '12px',
                                  fontWeight: 700,
                                  letterSpacing: '0.12em',
                                  textTransform: 'uppercase',
                                  color: '#004ac6',
                                  marginBottom: '4px',
                                }}
                              >
                                Step 1
                              </div>
                              <div
                                style={{
                                  ...fontStyle,
                                  fontSize: '14px',
                                  lineHeight: '20px',
                                  fontWeight: 700,
                                  color: '#0d1c2e',
                                  marginBottom: '8px',
                                }}
                              >
                                Collection mode
                              </div>

                              <div
                                style={{
                                  display: 'grid',
                                  gridTemplateColumns: '1fr 1fr',
                                  borderRadius: '10px',
                                  background: '#f5f9ff',
                                  padding: '4px',
                                  gap: '4px',
                                  marginBottom: '8px',
                                }}
                              >
                                {[
                                  { key: 'pages', label: 'By pages' },
                                  { key: 'count', label: 'By count' },
                                ].map((mode) => (
                                  <button
                                    key={mode.key}
                                    type="button"
                                    onClick={() => setMockCollectionMode(mode.key as 'pages' | 'count')}
                                    style={{
                                      ...fontStyle,
                                      height: '30px',
                                      borderRadius: '8px',
                                      border: 'none',
                                      fontSize: '11px',
                                      lineHeight: '14px',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      color: mockCollectionMode === mode.key ? '#0d1c2e' : 'rgba(13, 28, 46, 0.52)',
                                      background: mockCollectionMode === mode.key ? '#FFFFFF' : 'transparent',
                                      boxShadow:
                                        mockCollectionMode === mode.key
                                          ? '0 1px 4px rgba(13, 28, 46, 0.08)'
                                          : 'none',
                                      transition: 'all 180ms ease',
                                    }}
                                  >
                                    {mode.label}
                                  </button>
                                ))}
                              </div>

                              {mockCollectionMode === 'pages' ? (
                                <div
                                  style={{
                                    borderRadius: '10px',
                                    background: '#f5f9ff',
                                    padding: '8px 10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <button
                                    type="button"
                                    onClick={() => setMockMaxPages((prev) => Math.max(1, prev - 1))}
                                    style={{
                                      width: '22px',
                                      height: '22px',
                                      borderRadius: '6px',
                                      border: 'none',
                                      background: '#FFFFFF',
                                      color: 'rgba(13, 28, 46, 0.8)',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    -
                                  </button>
                                  <span
                                    style={{
                                      ...fontStyle,
                                      fontSize: '12px',
                                      lineHeight: '16px',
                                      fontWeight: 600,
                                      color: '#0d1c2e',
                                      fontVariantNumeric: 'tabular-nums',
                                    }}
                                  >
                                    {mockMaxPages} pages
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setMockMaxPages((prev) => Math.min(9, prev + 1))}
                                    style={{
                                      width: '22px',
                                      height: '22px',
                                      borderRadius: '6px',
                                      border: 'none',
                                      background: '#FFFFFF',
                                      color: 'rgba(13, 28, 46, 0.8)',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                <div
                                  style={{
                                    borderRadius: '10px',
                                    background: '#f5f9ff',
                                    padding: '8px 10px',
                                  }}
                                >
                                  <div
                                    style={{
                                      position: 'relative',
                                      paddingTop: '18px',
                                      marginBottom: '6px',
                                    }}
                                  >
                                    <span
                                      style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: `calc(${mockCountSliderPercent}% )`,
                                        transform: 'translateX(-50%)',
                                        ...fontStyle,
                                        fontSize: '9px',
                                        lineHeight: '12px',
                                        fontWeight: 700,
                                        color: '#004ac6',
                                        background: '#eaf1ff',
                                        border: '1px solid #c9d9f6',
                                        borderRadius: '6px',
                                        height: '18px',
                                        padding: '0 6px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontVariantNumeric: 'tabular-nums',
                                      }}
                                    >
                                      {mockMaxCount}
                                    </span>
                                    <input
                                      type="range"
                                      min={1}
                                      max={totalMockCandidates}
                                      step={1}
                                      value={mockMaxCount}
                                      onChange={(event) => {
                                        const value = Number(event.target.value);
                                        setMockMaxCount(value);
                                        setMockCountCustomDraft(String(value));
                                      }}
                                      style={{
                                        width: '100%',
                                        accentColor: '#2563eb',
                                      }}
                                    />
                                  </div>

                                  <div style={{ display: 'flex', gap: '5px', marginBottom: '7px', flexWrap: 'wrap' }}>
                                    {quickCountPresets.map((preset) => (
                                      <button
                                        key={preset}
                                        type="button"
                                        onClick={() => {
                                          setMockMaxCount(preset);
                                          setMockCountCustomOpen(false);
                                          setMockCountCustomDraft(String(preset));
                                        }}
                                        style={{
                                          height: '20px',
                                          minWidth: '24px',
                                          borderRadius: '6px',
                                          border: 'none',
                                          padding: '0 6px',
                                          ...fontStyle,
                                          fontSize: '10px',
                                          lineHeight: '12px',
                                          fontWeight: 600,
                                          fontVariantNumeric: 'tabular-nums',
                                          color: mockMaxCount === preset ? '#004ac6' : 'rgba(13, 28, 46, 0.6)',
                                          background: mockMaxCount === preset ? '#d5e3fc' : '#FFFFFF',
                                          cursor: 'pointer',
                                        }}
                                      >
                                        {preset}
                                      </button>
                                    ))}
                                    {!mockCountCustomOpen ? (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setMockCountCustomOpen(true);
                                          setMockCountCustomDraft(String(mockMaxCount));
                                        }}
                                        style={{
                                          height: '20px',
                                          borderRadius: '6px',
                                          border: 'none',
                                          padding: '0 8px',
                                          ...fontStyle,
                                          fontSize: '10px',
                                          lineHeight: '12px',
                                          fontWeight: 600,
                                          color: 'rgba(13, 28, 46, 0.6)',
                                          background: '#FFFFFF',
                                          cursor: 'pointer',
                                        }}
                                      >
                                        Custom
                                      </button>
                                    ) : (
                                      <input
                                        type="number"
                                        min={1}
                                        max={totalMockCandidates}
                                        value={mockCountCustomDraft}
                                        autoFocus
                                        onChange={(event) => setMockCountCustomDraft(event.target.value)}
                                        onBlur={() => {
                                          const value = Number.parseInt(mockCountCustomDraft, 10);
                                          if (!Number.isNaN(value)) {
                                            const nextValue = Math.min(totalMockCandidates, Math.max(1, value));
                                            setMockMaxCount(nextValue);
                                            setMockCountCustomDraft(String(nextValue));
                                          } else {
                                            setMockCountCustomDraft(String(mockMaxCount));
                                          }
                                          setMockCountCustomOpen(false);
                                        }}
                                        style={{
                                          width: '46px',
                                          height: '20px',
                                          borderRadius: '6px',
                                          border: '1px solid rgba(13, 28, 46, 0.14)',
                                          background: '#FFFFFF',
                                          textAlign: 'center',
                                          ...fontStyle,
                                          fontSize: '10px',
                                          lineHeight: '12px',
                                          fontWeight: 600,
                                          color: '#0d1c2e',
                                          fontVariantNumeric: 'tabular-nums',
                                        }}
                                      />
                                    )}
                                  </div>

                                  <div
                                    style={{
                                      ...fontStyle,
                                      fontSize: '11px',
                                      lineHeight: '14px',
                                      fontWeight: 600,
                                      color: '#0d1c2e',
                                      fontVariantNumeric: 'tabular-nums',
                                    }}
                                  >
                                    Up to {mockMaxCount} profiles
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div
                            style={{
                              borderRadius: '10px',
                              background: '#d5e3fc',
                              padding: '9px 10px',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '7px',
                            }}
                          >
                            <span
                              aria-hidden
                              style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '999px',
                                background: 'rgba(255, 255, 255, 0.65)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#004ac6',
                                fontSize: '11px',
                                fontWeight: 700,
                              }}
                            >
                              i
                            </span>
                            <p
                              style={{
                                ...fontStyle,
                                fontSize: '11px',
                                lineHeight: '14px',
                                fontWeight: 400,
                                color: 'rgba(0, 74, 198, 0.76)',
                                margin: 0,
                              }}
                            >
                              Collection pauses if you switch tabs and resumes when you return.
                            </p>
                          </div>
                        </>
                      )}

                      {/* Collecting：Step2 + 进度 + 候选人列表 */}
                      {collectionState === 'collecting' && (
                        <div
                          style={{
                            borderRadius: '12px',
                            background: '#FFFFFF',
                            boxShadow: '0 2px 12px rgba(13, 28, 46, 0.06)',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: 0,
                            flex: '1 1 auto',
                          }}
                        >
                          <div
                            style={{
                              padding: '10px 12px',
                              boxShadow: '0 1px 0 rgba(13, 28, 46, 0.06)',
                            }}
                          >
                            <div
                              style={{
                                ...fontStyle,
                                fontSize: '9px',
                                lineHeight: '12px',
                                fontWeight: 700,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                color: '#004ac6',
                                marginBottom: '4px',
                              }}
                            >
                              Step 2
                            </div>
                            <div
                              style={{
                                ...fontStyle,
                                fontSize: '14px',
                                lineHeight: '20px',
                                fontWeight: 700,
                                color: '#0d1c2e',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <span>Collecting...</span>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  height: '20px',
                                  padding: '0 8px',
                                  borderRadius: '999px',
                                  background: '#d5e3fc',
                                  color: '#004ac6',
                                  fontSize: '10px',
                                  fontWeight: 700,
                                  fontVariantNumeric: 'tabular-nums',
                                  transform: isCountFlipping ? 'translateY(-2px)' : 'translateY(0)',
                                  opacity: isCountFlipping ? 0.72 : 1,
                                  transition: 'transform 200ms ease, opacity 200ms ease',
                                }}
                              >
                                <span
                                  className="animate-spin"
                                  style={{
                                    width: '9px',
                                    height: '9px',
                                    borderRadius: '999px',
                                    border: '2px solid rgba(0, 74, 198, 0.25)',
                                    borderTopColor: '#004ac6',
                                    display: 'inline-block',
                                  }}
                                />
                                {collectedCount}
                              </span>
                            </div>
                            <div
                              style={{
                                ...fontStyle,
                                fontSize: '11px',
                                lineHeight: '14px',
                                fontWeight: 400,
                                color: 'rgba(13, 28, 46, 0.56)',
                              }}
                            >
                              Scanning LinkedIn results and extracting profiles.
                            </div>
                          </div>

                          <div style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0 }}>
                            <div
                              style={{
                                ...fontStyle,
                                fontSize: '11px',
                                lineHeight: '14px',
                                fontWeight: 500,
                                color: 'rgba(13, 28, 46, 0.72)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '6px',
                              }}
                            >
                              <span>Progress</span>
                              <span style={{ color: '#004ac6', fontVariantNumeric: 'tabular-nums' }}>
                                {Math.round((collectedCount / demoTargetCount) * 100)}%
                              </span>
                            </div>
                            <div
                              style={{
                                height: '6px',
                                borderRadius: '999px',
                                background: '#d5e3fc',
                                overflow: 'hidden',
                                marginBottom: '8px',
                              }}
                            >
                              <span
                                style={{
                                  display: 'block',
                                  height: '100%',
                                  width: `${(collectedCount / demoTargetCount) * 100}%`,
                                  background: 'linear-gradient(90deg, #004ac6 0%, #2563eb 100%)',
                                  transition: 'width 300ms ease',
                                }}
                              />
                            </div>
                            <div
                              style={{
                                ...fontStyle,
                                fontSize: '11px',
                                lineHeight: '14px',
                                fontWeight: 400,
                                color: 'rgba(13, 28, 46, 0.52)',
                                marginBottom: '8px',
                              }}
                            >
                              {mockCollectionMode === 'pages'
                                ? `Collecting page ${Math.min(collectedCount + 1, demoTargetCount)}/${demoTargetCount}`
                                : `Collecting: ${collectedCount}/${demoTargetCount} candidates`}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {extensionMockRows
                                .slice(0, demoTargetCount)
                                .slice(0, collectedCount)
                                .reverse()
                                .map((candidate, idx) => {
                                  const isNewest = idx === 0 && collectedCount < demoTargetCount;
                                  return (
                                    <div
                                      key={`collecting-${candidate.name}`}
                                      style={{
                                        borderRadius: '10px',
                                        background: '#f5f9ff',
                                        padding: '7px 9px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        boxShadow: isNewest ? '0 3px 12px rgba(0, 74, 198, 0.14)' : 'none',
                                        transition: 'box-shadow 200ms ease',
                                      }}
                                    >
                                      <div style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: '7px' }}>
                                        <span
                                          aria-hidden
                                          style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '999px',
                                            background: '#dfe7f5',
                                            color: 'rgba(13, 28, 46, 0.72)',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            ...fontStyle,
                                            fontSize: '9px',
                                            lineHeight: '9px',
                                            fontWeight: 700,
                                            flex: '0 0 auto',
                                          }}
                                        >
                                          {getMockInitials(candidate.name)}
                                        </span>
                                        <div style={{ minWidth: 0 }}>
                                          <div
                                            style={{
                                              ...fontStyle,
                                              fontSize: '11px',
                                              lineHeight: '14px',
                                              fontWeight: 500,
                                              color: 'rgba(13, 28, 46, 0.82)',
                                              whiteSpace: 'nowrap',
                                              overflow: 'hidden',
                                              textOverflow: 'ellipsis',
                                              maxWidth: '108px',
                                            }}
                                          >
                                            {candidate.name}
                                          </div>
                                          <div
                                            style={{
                                              ...fontStyle,
                                              fontSize: '9px',
                                              lineHeight: '12px',
                                              fontWeight: 400,
                                              color: 'rgba(13, 28, 46, 0.48)',
                                              whiteSpace: 'nowrap',
                                              overflow: 'hidden',
                                              textOverflow: 'ellipsis',
                                              maxWidth: '108px',
                                            }}
                                          >
                                            {candidate.role}
                                          </div>
                                        </div>
                                      </div>
                                      <span
                                        style={{
                                          height: '20px',
                                          borderRadius: '999px',
                                          padding: '0 8px',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          ...fontStyle,
                                          fontSize: '9px',
                                          fontWeight: 700,
                                          color: isNewest ? '#004ac6' : '#006a61',
                                          background: isNewest ? '#d5e3fc' : '#e6f6f1',
                                        }}
                                      >
                                        {isNewest ? 'Collecting' : 'Collected'}
                                      </span>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Done：完成统计 + 完整列表 */}
                      {collectionState === 'done' && (
                        <div
                          style={{
                            borderRadius: '12px',
                            background: '#FFFFFF',
                            boxShadow: '0 2px 12px rgba(13, 28, 46, 0.06)',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            flex: '1 1 auto',
                            minHeight: 0,
                          }}
                        >
                          <div style={{ padding: '10px 12px' }}>
                            <div
                              style={{
                                ...fontStyle,
                                fontSize: '9px',
                                lineHeight: '12px',
                                fontWeight: 700,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                color: '#006a61',
                                marginBottom: '4px',
                              }}
                            >
                              Completed
                            </div>
                            <div
                              style={{
                                ...fontStyle,
                                fontSize: '14px',
                                lineHeight: '20px',
                                fontWeight: 700,
                                color: '#0d1c2e',
                                marginBottom: '8px',
                              }}
                            >
                              Collection finished
                            </div>
                            <div
                              style={{
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #ecf8f5 0%, #f5f9ff 100%)',
                                padding: '8px 10px',
                                marginBottom: '8px',
                              }}
                            >
                              <div
                                style={{
                                  ...fontStyle,
                                  fontSize: '9px',
                                  lineHeight: '12px',
                                  fontWeight: 700,
                                  letterSpacing: '0.06em',
                                  textTransform: 'uppercase',
                                  color: 'rgba(13, 28, 46, 0.45)',
                                  marginBottom: '2px',
                                }}
                              >
                                Total profiles collected
                              </div>
                              <div
                                style={{
                                  ...fontStyle,
                                  fontSize: '24px',
                                  lineHeight: '1.1',
                                  fontWeight: 700,
                                  color: '#006a61',
                                  fontVariantNumeric: 'tabular-nums',
                                  transform: isCountFlipping ? 'translateY(-2px)' : 'translateY(0)',
                                  opacity: isCountFlipping ? 0.72 : 1,
                                  transition: 'transform 200ms ease, opacity 200ms ease',
                                }}
                              >
                                {doneCollectedCount}
                              </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {doneVisibleCandidates.map((candidate) => (
                                <div
                                  key={`done-${candidate.name}`}
                                  style={{
                                    borderRadius: '10px',
                                    background: '#f5f9ff',
                                    padding: '7px 9px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <div style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: '7px' }}>
                                    <span
                                      aria-hidden
                                      style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '999px',
                                        background: '#dfe7f5',
                                        color: 'rgba(13, 28, 46, 0.72)',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        ...fontStyle,
                                        fontSize: '9px',
                                        lineHeight: '9px',
                                        fontWeight: 700,
                                        flex: '0 0 auto',
                                      }}
                                    >
                                      {getMockInitials(candidate.name)}
                                    </span>
                                    <div style={{ minWidth: 0 }}>
                                      <div
                                        style={{
                                          ...fontStyle,
                                          fontSize: '11px',
                                          lineHeight: '14px',
                                          fontWeight: 500,
                                          color: 'rgba(13, 28, 46, 0.82)',
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          maxWidth: '108px',
                                        }}
                                      >
                                        {candidate.name}
                                      </div>
                                      <div
                                        style={{
                                          ...fontStyle,
                                          fontSize: '9px',
                                          lineHeight: '12px',
                                          fontWeight: 400,
                                          color: 'rgba(13, 28, 46, 0.48)',
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          maxWidth: '108px',
                                        }}
                                      >
                                        {candidate.role}
                                      </div>
                                    </div>
                                  </div>
                                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                    <a
                                      href={`https://www.linkedin.com/in/${candidate.name.toLowerCase().replace(/\s+/g, '-')}/`}
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{
                                        height: '20px',
                                        borderRadius: '999px',
                                        padding: '0 8px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        ...fontStyle,
                                        fontSize: '9px',
                                        fontWeight: 700,
                                        color: '#004ac6',
                                        background: '#d5e3fc',
                                        textDecoration: 'none',
                                      }}
                                    >
                                      LinkedIn
                                    </a>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveDoneCandidate(candidate.name)}
                                      style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        ...fontStyle,
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: 'rgba(13, 28, 46, 0.52)',
                                        background: '#eef3fc',
                                        cursor: 'pointer',
                                      }}
                                    >
                                      ×
                                    </button>
                                  </div>
                                </div>
                              ))}
                              {doneVisibleCandidates.length === 0 && (
                                <div
                                  style={{
                                    ...fontStyle,
                                    fontSize: '10px',
                                    lineHeight: '14px',
                                    fontWeight: 500,
                                    color: 'rgba(13, 28, 46, 0.45)',
                                    textAlign: 'center',
                                    padding: '10px 0 2px',
                                  }}
                                >
                                  No candidates left in this collection.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {collectionState === 'idle' && (
                      <button
                        type="button"
                        onClick={handleStartCollection}
                        style={{
                          ...fontStyle,
                          margin: '0 12px 12px',
                          width: 'calc(100% - 24px)',
                          height: '42px',
                          borderRadius: '10px',
                          border: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          fontSize: '14px',
                          lineHeight: '20px',
                          fontWeight: 500,
                          color: '#FFFFFF',
                          background: 'linear-gradient(135deg, #004ac6 0%, #2563eb 100%)',
                          cursor: 'pointer',
                          boxShadow: '0 8px 20px rgba(0, 74, 198, 0.28)',
                        }}
                      >
                        Start Collection
                      </button>
                    )}

                    {collectionState === 'collecting' && (
                      <div
                        style={{
                          ...fontStyle,
                          margin: '0 12px 12px',
                          fontSize: '11px',
                          lineHeight: '14px',
                          fontWeight: 400,
                          color: 'rgba(13, 28, 46, 0.42)',
                          textAlign: 'center',
                        }}
                      >
                        You can close this panel; collection continues in the background.
                      </div>
                    )}

                    {collectionState === 'done' && (
                      <div
                        style={{
                          margin: '0 12px 12px',
                          display: 'grid',
                          gridTemplateColumns: '1fr 1.2fr',
                          gap: '8px',
                        }}
                      >
                        <button
                          type="button"
                          onClick={resetCollectionDemo}
                          style={{
                            ...fontStyle,
                            height: '40px',
                            borderRadius: '10px',
                            border: '1px solid #c9d9f6',
                            background: '#FFFFFF',
                            color: '#004ac6',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          New collection
                        </button>
                        <button
                          type="button"
                          onClick={handleGoToDashboard}
                          disabled={isDashboardRedirecting || doneCollectedCount === 0}
                          style={{
                            ...fontStyle,
                            height: '40px',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #004ac6 0%, #2563eb 100%)',
                            color: '#FFFFFF',
                            fontSize: '12px',
                            fontWeight: 600,
                            boxShadow: '0 8px 20px rgba(0, 74, 198, 0.28)',
                            cursor: isDashboardRedirecting || doneCollectedCount === 0 ? 'default' : 'pointer',
                            opacity: isDashboardRedirecting || doneCollectedCount === 0 ? 0.72 : 1,
                          }}
                        >
                          {isDashboardRedirecting ? (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                              }}
                            >
                              <span
                                className="animate-spin"
                                style={{
                                  width: '10px',
                                  height: '10px',
                                  borderRadius: '999px',
                                  border: '2px solid rgba(255, 255, 255, 0.35)',
                                  borderTopColor: '#FFFFFF',
                                  display: 'inline-block',
                                }}
                              />
                              Opening...
                            </span>
                          ) : (
                            doneCollectedCount === 0 ? 'No candidates' : 'Go to dashboard'
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ——————————————————————————————————————————————
                03 · WEB DASHBOARD — 4-feature 2x2 showcase
                —————————————————————————————————————————————— */}
            <div style={{ marginBottom: '96px' }}>
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
                03 · Web dashboard
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
                    tag: '3.1',
                    title: 'Project list',
                    body: 'Every hiring need appears as a Project card. Status is visible at a glance — which are ranked, which still have unprocessed candidates.',
                    figNumber: 6,
                    figCaption: 'Project overview · card grid',
                  },
                  {
                    tag: '3.2',
                    title: 'Project detail · AI Ranking',
                    body: 'Opening a project lands on the latest ranking, no extra hop. Each candidate ships with an AI score, a dimension breakdown, and the rationale behind it. History is a version-switch away.',
                    figNumber: 7,
                    figCaption: 'Ranking view · score + dimension breakdown',
                  },
                  {
                    tag: '3.3',
                    title: 'Candidate Pool',
                    body: 'Every candidate in the project — ranked or not — in one view. Search, tag, annotate. The foundation for pipeline management down the road.',
                    figNumber: 8,
                    figCaption: 'Candidate pool · full roster',
                  },
                  {
                    tag: '3.4',
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
                      {tag === '3.4' ? (
                        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,460px)] lg:gap-8">
                          {/* Profile Panel：左文案 + 右 Fig 9（lg 起双列；小屏文案在上） */}
                          <div className="min-w-0">{copyBlock}</div>
                          <div className="min-w-0 w-full justify-self-stretch lg:justify-self-end">
                            <ProfilePanelSlideMock fontStyle={fontStyle} />
                          </div>
                        </div>
                      ) : (
                        <>
                          {tag === '3.1' ? (
                            <ProjectListViewMock fontStyle={fontStyle} />
                          ) : tag === '3.2' || tag === '3.3' ? (
                            <AIRankingViewMock fontStyle={fontStyle} defaultTab={tag === '3.3' ? 'pool' : 'rankings'} />
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
                04 · DESIGN DECISIONS — decision / rationale table
                复用 Problem "Why tools don't solve it" 的表格 DNA
                —————————————————————————————————————————————— */}
            <div>
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
                04 · Design decisions
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
        className="w-screen"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '96px',
          paddingBottom: '112px',
        }}
      >
        <ScrollAnimatedSection>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
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

            {/* 三幕容器 —— 窄阅读栏，居左而非居中，保持整页左对齐的节律 */}
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
                  label: 'Proud of',
                  items: [
                    {
                      kicker: 'Designing beyond the brief.',
                      body: "The decision to introduce the Project concept wasn't in the original requirements. It came from stepping back and asking where this product needed to be in a year — not just what it needed to do this week. That one structural decision changed the platform's trajectory from a disposable ranking widget to something with a real foundation for growth.",
                    },
                    {
                      kicker: 'Shipping a coherent product in six weeks.',
                      body: "With a token-based design system in place early, every page felt like it belonged to the same product. The speed didn't come from cutting corners — it came from making the right foundational decisions fast.",
                    },
                  ],
                },
                {
                  roman: 'II',
                  label: 'Would redo',
                  items: [
                    {
                      kicker: 'Earlier and broader user research.',
                      body: 'Our primary domain insight came from one market partner. That was invaluable, but a single perspective — however expert — has blind spots. I would have pushed to speak with three to five recruiters with different workflows before committing to the IA.',
                    },
                  ],
                },
                {
                  roman: 'III',
                  label: 'What comes next',
                  items: [
                    {
                      kicker: null,
                      body: 'V0 is live. The immediate priority is structured user testing with real recruiters — validating the two-layer IA, the ranking interface, and whether the Project concept matches how they actually think about their work.',
                    },
                    {
                      kicker: null,
                      body: 'Longer term, the platform roadmap points toward pipeline management, candidate outreach, and team collaboration — all of which the current architecture was deliberately designed to support.',
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
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>

      {/* 页尾返回作品集 */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '48px 24px 80px',
          textAlign: 'center',
        }}
      >
        <Link
          href="/"
          style={{
            ...fontStyle,
            fontSize: '16px',
            fontWeight: 500,
            color: 'rgb(0, 0, 0)',
            textDecoration: 'none',
            borderBottom: '1px solid rgba(0,0,0,0.25)',
          }}
        >
          ← Back to Work
        </Link>
      </div>


    </div>
  );
}
