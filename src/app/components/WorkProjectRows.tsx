import Image from 'next/image';
import Link from 'next/link';
import {
  Activity,
  ArrowUpRight,
  Blocks,
  Brain,
  CalendarDays,
  ChartNoAxesCombined,
  Coins,
  FileText,
  Headphones,
  Heart,
  Layers3,
  Link2,
  LockKeyhole,
  MapPin,
  MessageCircle,
  MessagesSquare,
  Mic2,
  Package,
  Search,
  Share2,
  Sparkles,
  Target,
  UsersRound,
  Vote,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { CSSProperties } from 'react';
import type { WorkProject } from '@/lib/work-projects';
import styles from './WorkProjectRows.module.css';

const fontDisplay: React.CSSProperties = { fontFamily: 'var(--font-inter)' };
const fontBody: React.CSSProperties = { fontFamily: 'var(--font-inter)' };

const motifIcons: Record<NonNullable<WorkProject['coverMotif']>, [LucideIcon, LucideIcon]> = {
  beauty: [Sparkles, Package],
  procurement: [Package, FileText],
  recruiting: [UsersRound, Link2],
  'job-search': [Target, Zap],
  learning: [Brain, Layers3],
  parenting: [Heart, MessageCircle],
  finance: [Coins, ChartNoAxesCombined],
  interview: [Mic2, MessageCircle],
  support: [Headphones, MessagesSquare],
  civic: [MapPin, Vote],
  health: [Activity, CalendarDays],
  'research-sharing': [LockKeyhole, Share2],
  'research-coding': [Blocks, Search],
};

function CoverDecorations({ motif }: { motif?: WorkProject['coverMotif'] }) {
  if (!motif) return null;

  const [PrimaryIcon, SecondaryIcon] = motifIcons[motif];

  return (
    <div className={styles.decorations} data-motif={motif} aria-hidden="true">
      <span className={`${styles.decorObject} ${styles.decorPrimary}`}>
        <PrimaryIcon />
      </span>
      <span className={`${styles.decorObject} ${styles.decorSecondary}`}>
        <SecondaryIcon />
      </span>
      <span className={styles.decorDash} />
    </div>
  );
}

export default function WorkProjectRows({ items }: { items: WorkProject[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
      {items.map((project) => {
        const device = project.coverDevice ?? 'laptop';
        const coverStyle = {
          '--cover-accent': project.coverAccent ?? '#64748b',
        } as CSSProperties;

        return (
          <Link
            key={project.title}
            href={project.href}
            className={`${styles.card} flex flex-col gap-4`}
            data-cursor="pill"
            data-cursor-label="View project"
          >
            <div className={styles.cover} style={coverStyle}>
              <span className={styles.wash} aria-hidden="true" />
              <span className={styles.orbit} aria-hidden="true" />
              <span className={styles.orb} aria-hidden="true" />
              <span className={styles.dots} aria-hidden="true" />

              <div className={`${styles.device} ${styles[device]}`}>
                {device === 'phone-stack' ? (
                  (project.coverScreens ?? [project.coverScreen ?? project.image]).slice(0, 3).map((screen, index) => (
                    <div className={styles.stackPhone} key={screen}>
                      <div className={styles.stackScreen}>
                        <Image
                          src={screen}
                          alt={`${project.title} product interface ${index + 1}`}
                          fill
                          sizes="(min-width: 640px) 15vw, 29vw"
                          style={{ objectFit: 'cover', objectPosition: 'top' }}
                        />
                        <span className={styles.glare} aria-hidden="true" />
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className={styles.screen}>
                      <Image
                        src={project.coverScreen ?? project.image}
                        alt={`${project.title} product interface`}
                        fill
                        sizes="(min-width: 640px) 46vw, 92vw"
                        style={{
                          objectFit: project.coverScreenFit ?? 'cover',
                          objectPosition: project.coverScreenPosition ?? 'center',
                        }}
                      />
                      {device !== 'freeform' && <span className={styles.glare} aria-hidden="true" />}
                    </div>
                    {device === 'laptop' && <span className={styles.laptopBase} aria-hidden="true" />}
                    {device === 'phone' && <span className={styles.phoneNotch} aria-hidden="true" />}
                    {device === 'tablet' && <span className={styles.tabletCamera} aria-hidden="true" />}
                  </>
                )}
              </div>

              <CoverDecorations motif={project.coverMotif} />
              <span className={`${styles.arrow} flex size-9 items-center justify-center rounded-full bg-white/90 text-[#0a0a0a] shadow-sm backdrop-blur`}>
                <ArrowUpRight size={18} strokeWidth={1.75} />
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                <h3 className="text-[18px] text-[#0a0a0a] md:text-[20px]" style={fontDisplay}>
                  {project.title}
                </h3>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {project.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-[#ed5b2b] px-1.5 py-0.5 text-[10px] text-white"
                      style={fontBody}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="line-clamp-2 text-[14px] leading-snug font-light text-[#0a0a0a]/70 md:text-[15px]" style={fontBody}>
                {project.description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
