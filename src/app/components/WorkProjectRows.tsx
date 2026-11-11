import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { WorkProject } from '@/lib/work-projects';
import styles from './WorkProjectRows.module.css';
import ProcurementCover from './procurement-cover/ProcurementCover';
import DefErpCover from './def-erp-cover/DefErpCover';
import ConnectNovaCover from './connectnova-cover/ConnectNovaCover';
import JobNovaCover from './jobnova-cover/JobNovaCover';

const fontName: React.CSSProperties = {
  fontFamily: 'var(--mei-font-display), Oswald, sans-serif',
  fontWeight: 400,
};
const fontBody: React.CSSProperties = { fontFamily: 'var(--font-inter)' };

export default function WorkProjectRows({ items, animatedCovers = false }: { items: WorkProject[]; animatedCovers?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
      {items.map((project) => {
        const device = project.coverDevice ?? 'laptop';
        const procurementCover = animatedCovers && project.href === '/projects/procurement-agent-kit';
        const defErpCover = animatedCovers && project.href === '/projects/def-erp-kit';
        const connectNovaCover = animatedCovers && project.href === '/projects/connectnova-kit';
        const jobNovaCover = animatedCovers && project.href === '/projects/jobnova-kit';
        const coverStyle = {
          '--cover-accent': project.coverAccent ?? '#64748b',
        } as CSSProperties;

        return (
          <Link
            key={project.title}
            href={project.href}
            className={`${styles.card} flex flex-col gap-4`}
            data-project={project.title}
            // Live product sites open in a new tab so the portfolio stays where the reader left it.
            {...(/^https?:\/\//.test(project.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            data-cursor="pill"
            data-cursor-label="View project"
          >
            <div className={styles.cover} data-presentation={procurementCover || defErpCover || connectNovaCover || jobNovaCover ? 'animation' : device} style={coverStyle}>
              {jobNovaCover ? (
                <div className={styles.animatedCover} inert aria-hidden="true"><JobNovaCover /></div>
              ) : connectNovaCover ? (
                <div className={styles.animatedCover} inert aria-hidden="true"><ConnectNovaCover /></div>
              ) : defErpCover ? (
                <div className={styles.animatedCover} inert aria-hidden="true"><DefErpCover /></div>
              ) : procurementCover ? (
                <div className={styles.animatedCover} inert aria-hidden="true"><ProcurementCover /></div>
              ) : (<>
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
                        unoptimized={device === 'interface' || Boolean(project.coverScreenHover)}
                        sizes="(min-width: 640px) 46vw, 92vw"
                        style={{
                          objectFit: project.coverScreenFit ?? (device === 'interface' ? 'contain' : 'cover'),
                          objectPosition: project.coverScreenPosition ?? 'center',
                        }}
                        className={project.coverScreenHover ? styles.coverImageDefault : undefined}
                      />
                      {project.coverScreenHover && (
                        <Image
                          src={project.coverScreenHover}
                          alt=""
                          aria-hidden="true"
                          fill
                          unoptimized
                          sizes="(min-width: 640px) 46vw, 92vw"
                          className={styles.coverImageHover}
                          style={{
                            objectFit: project.coverScreenFit ?? (device === 'interface' ? 'contain' : 'cover'),
                            objectPosition: project.coverScreenPosition ?? 'center',
                          }}
                        />
                      )}
                    </div>
                    {device === 'laptop' && <span className={styles.laptopBase} aria-hidden="true" />}
                    {device === 'phone' && <span className={styles.phoneNotch} aria-hidden="true" />}
                    {device === 'tablet' && <span className={styles.tabletCamera} aria-hidden="true" />}
                  </>
                )}
              </div>

              </>)}
              <span className={`${styles.arrow} flex size-9 items-center justify-center rounded-full bg-black text-white shadow-sm`}>
                <ArrowUpRight size={18} strokeWidth={1.5} />
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                <h3 className="text-[22px] leading-none text-[#0a0a0a] md:text-[26px]" style={fontName}>
                  {project.title}
                </h3>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {project.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-[#f2f2f2] px-1.5 py-0.5 text-[10px] text-[#000]"
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
              {project.impact && (
                <p className="m-0 mt-1 flex flex-wrap items-baseline gap-x-2 border-t border-[#0a0a0a]/10 pt-2.5 text-[13px] leading-snug text-[#0a0a0a]/60" style={fontBody}>
                  <span className="text-[15px] font-medium text-[#0a0a0a]">{project.impact.value}</span>
                  <span>{project.impact.label}</span>
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
