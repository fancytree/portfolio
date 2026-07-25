'use client';

import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { fontFamily } from '@/lib/design-tokens';
import CaseStudyBackButton from './CaseStudyBackButton';

type CaseStudyMetaItem = {
  label: string;
  value?: string[];
  icons?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    containerSize?: number;
    transform?: string;
  }[];
};

type CaseStudyHeroProps = {
  title: string;
  subtitle: string;
  tags: string[];
  aboutLabel: string;
  about: string;
  meta: CaseStudyMetaItem[];
  liveSiteHref?: string;
  liveSiteLabel?: string;
  visualLabel?: string;
  compactTypography?: boolean;
  wideDetails?: boolean;
};

export default function CaseStudyHero({
  title,
  subtitle,
  tags,
  aboutLabel,
  about,
  meta,
  liveSiteHref,
  liveSiteLabel = 'View live site',
  visualLabel = 'Project visual placeholder',
  compactTypography = false,
  wideDetails = false,
}: CaseStudyHeroProps) {
  const fontStyle = { fontFamily: fontFamily.sans };

  return (
    <section
      id="case-study-top"
      className="mei-case-study-hero w-screen"
      style={{
        backgroundColor: '#FFFFFF',
        color: '#0a0a0a',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        marginTop: '-48px',
        minHeight: '100svh',
        padding: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          gap: 0,
          width: '100%',
        }}
      >
        <div
          aria-label={visualLabel}
          style={{
            alignItems: 'center',
            background:
              'radial-gradient(circle at 50% 80%, rgb(237 91 43 / 0.14), transparent 34%), linear-gradient(135deg, #f3f1ea, #ffffff 44%, #d7d7d7)',
            border: 0,
            borderRadius: 0,
            color: 'rgb(10 10 10 / 0.38)',
            display: 'flex',
            fontFamily: fontFamily.sans,
            fontSize: '12px',
            fontWeight: 300,
            justifyContent: 'center',
            letterSpacing: '0.02em',
            minHeight: 'clamp(320px, 54svh, 620px)',
            overflow: 'hidden',
            position: 'relative',
            width: '100%',
          }}
        >
          <span
            aria-hidden
            style={{
              position: 'absolute',
              inset: 'clamp(28px, 5vw, 72px)',
              border: '1px dashed rgb(10 10 10 / 0.18)',
              borderRadius: '8px',
            }}
          />
          <span
            style={{
              background: 'rgb(255 255 255 / 0.72)',
              border: '1px solid rgb(10 10 10 / 0.14)',
              borderRadius: '8px',
              color: 'rgb(10 10 10 / 0.45)',
              padding: '18px 26px',
            }}
          >
            {visualLabel}
          </span>
        </div>

        <div style={{ padding: 'clamp(34px, 6vh, 64px) clamp(28px, 6vw, 118px) clamp(46px, 7vh, 76px)' }}>
          <div style={{ marginBottom: '34px' }}>
            <CaseStudyBackButton />
          </div>

          <div style={{ marginBottom: 'clamp(42px, 7vh, 72px)' }}>
            <h1
              style={{
                ...fontStyle,
                color: '#0a0a0a',
                fontSize: compactTypography ? 'clamp(29px, 3vw, 46px)' : 'clamp(32px, 3.5vw, 54px)',
                fontWeight: 400,
                lineHeight: compactTypography ? 1.12 : 1.08,
                margin: '0 0 10px',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                ...fontStyle,
                color: 'rgb(10 10 10 / 0.64)',
                fontSize: compactTypography ? 'clamp(14px, 1.1vw, 18px)' : 'clamp(15px, 1.25vw, 20px)',
                fontWeight: 300,
                lineHeight: 1.45,
                margin: '0 0 14px',
                maxWidth: '820px',
              }}
            >
              {subtitle}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    ...fontStyle,
                    alignItems: 'center',
                    background: 'rgb(243 241 234 / 0.86)',
                    borderRadius: '999px',
                    color: 'rgb(10 10 10 / 0.58)',
                    display: 'inline-flex',
                    fontSize: '11px',
                    fontWeight: 400,
                    lineHeight: '18px',
                    minHeight: '25px',
                    padding: '0 10px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div
            className={`grid grid-cols-1 gap-10 ${
              wideDetails
                ? 'relative left-1/2 w-[calc(100vw-48px)] max-w-[1330px] -translate-x-1/2 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)]'
                : 'lg:grid-cols-[minmax(360px,0.9fr)_minmax(0,1.25fr)]'
            }`}
            style={{ alignItems: 'start' }}
          >
            <div>
              <p
                style={{
                  ...fontStyle,
                  color: '#ed5b2b',
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  lineHeight: '18px',
                  margin: '0 0 9px',
                  textTransform: 'uppercase',
                }}
              >
                {aboutLabel}
              </p>
              <p
                style={{
                  ...fontStyle,
                  color: 'rgb(10 10 10 / 0.72)',
                  fontSize: compactTypography ? '14px' : '15px',
                  fontWeight: 300,
                  lineHeight: 1.6,
                  margin: '0 0 18px',
                  maxWidth: '650px',
                }}
              >
                {about}
              </p>
              {liveSiteHref && (
                <a
                  href={liveSiteHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mei-view-all-work-link mei-case-study-live-link group"
                  style={{
                    ...fontStyle,
                    alignItems: 'center',
                    border: '1px solid rgb(10 10 10 / 0.72)',
                    borderRadius: '999px',
                    display: 'inline-flex',
                    fontSize: '14px',
                    fontWeight: 400,
                    gap: '10px',
                    lineHeight: '20px',
                    padding: '9px 16px',
                    textDecoration: 'none',
                  }}
                >
                  <ArrowUpRight aria-hidden strokeWidth={1.6} className="mei-view-all-work-icon size-5 shrink-0" />
                  <span className="relative z-10">{liveSiteLabel}</span>
                  <ArrowUpRight aria-hidden strokeWidth={1.6} className="mei-view-all-work-icon size-5 shrink-0" />
                </a>
              )}
            </div>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
              style={{
                columnGap: '48px',
                rowGap: '42px',
              }}
            >
              {meta.map((item) => (
                <div key={item.label}>
                  <p
                    style={{
                      ...fontStyle,
                      color: '#ed5b2b',
                      fontSize: '12px',
                      fontWeight: 500,
                      letterSpacing: '0.02em',
                      lineHeight: '18px',
                      margin: '0 0 7px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.label}
                  </p>
                  {item.icons?.length ? (
                    <div style={{ alignItems: 'center', display: 'flex', gap: '24px' }}>
                      {item.icons.map((icon) => (
                        <span
                          key={icon.src}
                          style={{
                            alignItems: 'center',
                            background: '#fff',
                            borderRadius: icon.containerSize ? '10px' : 0,
                            display: 'inline-flex',
                            height: `${icon.containerSize ?? icon.height}px`,
                            justifyContent: 'center',
                            overflow: 'hidden',
                            width: `${icon.containerSize ?? icon.width}px`,
                          }}
                        >
                          <Image
                            src={icon.src}
                            alt={icon.alt}
                            width={icon.width}
                            height={icon.height}
                            style={{
                              height: `${icon.height}px`,
                              transform: icon.transform,
                              width: `${icon.width}px`,
                            }}
                          />
                        </span>
                      ))}
                    </div>
                  ) : (
                    item.value?.map((line) => (
                      <p
                        key={line}
                        style={{
                          ...fontStyle,
                          color: 'rgb(10 10 10 / 0.68)',
                          fontSize: '14px',
                          fontWeight: 300,
                          lineHeight: '23px',
                          margin: 0,
                        }}
                      >
                        {line}
                      </p>
                    ))
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
