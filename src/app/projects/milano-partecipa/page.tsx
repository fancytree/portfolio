'use client';

import React, { useState } from 'react';

export default function MilanoPartecipaProjectPage() {
  const fontStyle = {
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  const [heuristicsImageModalOpen, setHeuristicsImageModalOpen] = useState(false);

  return (
    <div className="w-full" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Hero / Overview */}
      <section
        className="w-screen"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '120px',
          paddingBottom: 0,
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          {/* Back link */}
          <a
            href="/"
            style={{
              ...fontStyle,
              fontSize: '16px',
              lineHeight: '24px',
              fontWeight: 400,
              color: 'oklch(0.556 0 0)',
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: '40px',
            }}
          >
            ← Back to Work
          </a>

          {/* Title + intro */}
          <div
            style={{
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              paddingBottom: '24px',
              marginBottom: '32px',
            }}
          >
            <h1
              style={{
                ...fontStyle,
                fontSize: '40px',
                lineHeight: '52px',
                fontWeight: 300,
                color: '#171616',
                marginBottom: '16px',
              }}
            >
              Milano Partecipa
            </h1>
            <p
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '30px',
                fontWeight: 300,
                color: '#171616',
                maxWidth: '760px',
              }}
            >
              Milano Partecipa redesigns the Municipality of Milan’s digital platform for citizen engagement. Through user research and information architecture refinement, the project improves accessibility, usability, and participation—supporting activities like referendums and petitions with open-source tools and a focus on inclusivity for underrepresented groups.
            </p>
          </div>

          {/* Meta */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              marginBottom: '64px',
            }}
          >
            <div
              style={{
                paddingRight: '24px',
                borderRight: '1px solid rgba(0, 0, 0, 0.08)',
              }}
            >
              <div
                style={{
                  ...fontStyle,
                  fontSize: '14px',
                  lineHeight: '20px',
                  fontWeight: 300,
                  color: '#666666',
                  marginBottom: '4px',
                }}
              >
                Role
              </div>
              <div
                style={{
                  ...fontStyle,
                  fontSize: '16px',
                  lineHeight: '24px',
                  fontWeight: 300,
                  color: '#171616',
                }}
              >
                Product & Service Designer
              </div>
            </div>

            <div
              style={{
                paddingRight: '24px',
              }}
            >
              <div
                style={{
                  ...fontStyle,
                  fontSize: '14px',
                  lineHeight: '20px',
                  fontWeight: 300,
                  color: '#666666',
                  marginBottom: '4px',
                }}
              >
                Timeline
              </div>
              <div
                style={{
                  ...fontStyle,
                  fontSize: '16px',
                  lineHeight: '24px',
                  fontWeight: 300,
                  color: '#171616',
                }}
              >
                2023 · 16 weeks
              </div>
            </div>

            <div>
              <div
                style={{
                  ...fontStyle,
                  fontSize: '14px',
                  lineHeight: '20px',
                  fontWeight: 300,
                  color: '#666666',
                  marginBottom: '4px',
                }}
              >
                Platform
              </div>
              <div
                style={{
                  ...fontStyle,
                  fontSize: '16px',
                  lineHeight: '24px',
                  fontWeight: 300,
                  color: '#171616',
                }}
              >
                Web & Mobile platform
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Project overview image + What is Milano Partecipa? */}
      <section
        className="w-screen"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingBottom: '80px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          <div
            style={{
              width: '100%',
              borderRadius: '24px',
              overflow: 'hidden',
              marginBottom: '48px',
            }}
          >
            <img
              src="/img/Milano%20Partecipa/bg.avif"
              alt="Milano Partecipa"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>

          {/* What is Milano Partecipa? — Figma 2229-2959：左文案，右图 */}
          <h2
            style={{
              ...fontStyle,
              fontSize: '28px',
              lineHeight: '36px',
              fontWeight: 300,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            What is Milano Partecipa?
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 480px)',
              gap: '80px',
              alignItems: 'center',
              marginBottom: '64px',
              width: '100%',
            }}
          >
            <div style={{ maxWidth: '640px' }}>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '1.6',
                  fontWeight: 300,
                  color: '#171616',
                  margin: 0,
                }}
              >
                Milano Partecipa redesigns Milan’s <strong style={{ fontWeight: 600 }}>digital platform for citizen engagement</strong>. The project improves <strong style={{ fontWeight: 600 }}>accessibility, usability, and participation</strong>—supporting <strong style={{ fontWeight: 600 }}>referendums and petitions</strong> with a focus on <strong style={{ fontWeight: 600 }}>inclusivity</strong>.
              </p>
            </div>
            <div
              style={{
                width: '100%',
                borderRadius: '12px 12px 0 0',
                overflow: 'hidden',
              }}
            >
              <img
                src="/img/Milano%20Partecipa/What%20is%20Milano%20Partecipa.avif"
                alt="What is Milano Partecipa"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </div>
          </div>

          {/* 三张卡片 — Figma 2230-2963：Adoption / Information / Target */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '32px',
              marginTop: '64px',
              marginBottom: '64px',
              width: '100%',
            }}
          >
            {[
              {
                icon: '/img/Milano%20Partecipa/Adoption.svg',
                title: 'Adoption',
                desc: 'Support adoption and uptake of the platform by citizens and stakeholders.',
              },
              {
                icon: '/img/Milano%20Partecipa/Information.svg',
                title: 'Information',
                desc: 'Clear, accessible information architecture for civic processes and content.',
              },
              {
                icon: '/img/Milano%20Partecipa/Target.svg',
                title: 'Target',
                desc: 'Target diverse audiences and underrepresented groups for inclusive participation.',
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '16px',
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                }}
              >
                <img
                  src={item.icon}
                  alt=""
                  style={{ width: '48px', height: '48px', display: 'block' }}
                />
                <h3
                  style={{
                    ...fontStyle,
                    fontSize: '20px',
                    lineHeight: '1.3',
                    fontWeight: 600,
                    color: '#171616',
                    margin: 0,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '16px',
                    lineHeight: '1.5',
                    fontWeight: 300,
                    color: '#171616',
                    margin: 0,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* The Process — 整区图片 */}
          <h2
            style={{
              ...fontStyle,
              fontSize: '28px',
              lineHeight: '36px',
              fontWeight: 300,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            The Process
          </h2>
          <div
            style={{
              width: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '64px',
            }}
          >
            <img
              src="/img/Milano%20Partecipa/The%20Process.avif"
              alt="The Process"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>

          {/* Research — Desk Research：左右两卡，右卡带图标 Initial Idea.svg */}
          <h2
            style={{
              ...fontStyle,
              fontSize: '28px',
              lineHeight: '36px',
              fontWeight: 300,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            Research
          </h2>
          <h3
            style={{
              ...fontStyle,
              fontSize: '20px',
              lineHeight: '1.3',
              fontWeight: 600,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            Desk Research
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
              gap: '56px',
              marginBottom: '64px',
              width: '100%',
            }}
          >
            {/* 左侧卡片 — Figma 141-10264：Insights + 三点 */}
            <div
              style={{
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
              }}
            >
              <h4
                style={{
                  ...fontStyle,
                  fontSize: '22px',
                  lineHeight: '1.3',
                  fontWeight: 600,
                  color: 'rgb(237, 72, 59)',
                  margin: '0 0 16px 0',
                }}
              >
                Insights
              </h4>
              <ul
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '1.6',
                  fontWeight: 300,
                  color: '#171616',
                  margin: 0,
                  paddingLeft: '20px',
                  listStyle: 'none',
                }}
              >
                <li
                  style={{
                    position: 'relative',
                    paddingLeft: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '0.5em',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'rgb(237, 72, 59)',
                    }}
                  />
                  The high proportion of immigrants in Milan indicates their significant role in the city and their impact on the economy, culture, and social life.
                </li>
                <li
                  style={{
                    position: 'relative',
                    paddingLeft: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '0.5em',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'rgb(237, 72, 59)',
                    }}
                  />
                  As permanent residents, immigrants have similar needs and expectations to Milanese citizens, such as employment opportunities, education, healthcare, and social integration.
                </li>
                <li
                  style={{
                    position: 'relative',
                    paddingLeft: '12px',
                    marginBottom: 0,
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '0.5em',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'rgb(237, 72, 59)',
                    }}
                  />
                  Immigrant populations usually have diverse backgrounds and needs, covering common issues faced by many groups.
                </li>
              </ul>
            </div>
            {/* 右侧卡片 — Figma 141-10249：Initial Idea 图标 + 标题 + 正文，居中 */}
            <div
              style={{
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '16px',
              }}
            >
              <img
                src="/img/Milano%20Partecipa/Initial%20Idea.svg"
                alt=""
                style={{ width: '48px', height: '48px', display: 'block' }}
              />
              <h4
                style={{
                  ...fontStyle,
                  fontSize: '22px',
                  lineHeight: '1.3',
                  fontWeight: 600,
                  color: 'rgb(237, 72, 59)',
                  margin: 0,
                }}
              >
                Initial Idea
              </h4>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '1.6',
                  fontWeight: 300,
                  color: '#171616',
                  margin: 0,
                }}
              >
                Based on this finding, if we design our service solutions with this immigrant group as the starting point, we have the potential to develop more <strong style={{ fontWeight: 600 }}>inclusive</strong> and widely applicable solutions that can meet the needs of <strong style={{ fontWeight: 600 }}>different groups</strong>.
              </p>
            </div>
          </div>

          {/* Heuristics Analysis：左卡（同 Desk Research 样式）+ 右图 */}
          <h3
            style={{
              ...fontStyle,
              fontSize: '20px',
              lineHeight: '1.3',
              fontWeight: 600,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            Heuristics Analysis
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
              gap: '56px',
              alignItems: 'stretch',
              marginBottom: '64px',
              width: '100%',
            }}
          >
            <div
              style={{
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
              }}
            >
              <h4
                style={{
                  ...fontStyle,
                  fontSize: '22px',
                  lineHeight: '1.3',
                  fontWeight: 600,
                  color: 'rgb(237, 72, 59)',
                  margin: '0 0 12px 0',
                }}
              >
                Insights and next steps
              </h4>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '1.6',
                  fontWeight: 300,
                  color: '#171616',
                  margin: '0 0 20px 0',
                }}
              >
                After conducting the heuristics analysis, we got some valuable insights that we later took into consideration as we designed the interfaces.
              </p>
              <h4
                style={{
                  ...fontStyle,
                  fontSize: '22px',
                  lineHeight: '1.3',
                  fontWeight: 600,
                  color: 'rgb(237, 72, 59)',
                  margin: '0 0 12px 0',
                }}
              >
                Actions to Keep in Mind
              </h4>
              <ul
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '1.6',
                  fontWeight: 300,
                  color: '#171616',
                  margin: 0,
                  paddingLeft: '20px',
                  listStyle: 'disc',
                }}
              >
                <li style={{ marginBottom: '8px' }}>
                  Keep navigation simple and transparent at all times by communicating effectively, which are the clickable elements in the UI, and keeping consistency through the design system definition.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  Enhance overall site hierarchy and information architecture by performing suitable tests with users to develop a logical structure.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  As a priority, give feedback at all times to the user based on his actions.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  Add shortcuts to enhance navigation from the first screen the user access.
                </li>
                <li style={{ marginBottom: 0 }}>
                  Ensure the user can change basic settings such as language and profile details.
                </li>
              </ul>
            </div>
            <div
              style={{
                width: '100%',
                height: '100%',
                minHeight: 0,
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <img
                src="/img/Milano%20Partecipa/Heuristics%20Analysis.avif"
                alt="Heuristics Analysis"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'left center',
                  display: 'block',
                }}
              />
              <button
                type="button"
                onClick={() => setHeuristicsImageModalOpen(true)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  bottom: '12px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
                aria-label="View full size"
              >
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </div>
          </div>

          {/* 原图弹窗 */}
          {heuristicsImageModalOpen && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Heuristics Analysis full size"
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
              }}
              onClick={() => setHeuristicsImageModalOpen(false)}
            >
              <button
                type="button"
                onClick={() => setHeuristicsImageModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  cursor: 'pointer',
                  fontSize: '24px',
                  lineHeight: 1,
                  color: '#171616',
                }}
                aria-label="Close"
              >
                ×
              </button>
              <img
                src="/img/Milano%20Partecipa/Heuristics%20Analysis.avif"
                alt="Heuristics Analysis (full size)"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Benchmarking：左卡（截图文案）+ 右图 */}
          <h3
            style={{
              ...fontStyle,
              fontSize: '20px',
              lineHeight: '1.3',
              fontWeight: 600,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            Benchmarking
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
              gap: '56px',
              alignItems: 'stretch',
              marginBottom: '64px',
              width: '100%',
            }}
          >
            <div
              style={{
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderLeft: '3px solid rgb(237, 72, 59)',
              }}
            >
              <p
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '1.6',
                  fontWeight: 400,
                  color: '#171616',
                  margin: '0 0 20px 0',
                }}
              >
                How do we want to position Milano Partecipa in the current participatory systems landscape?
              </p>
              <div style={{ marginBottom: '20px' }}>
                <h4
                  style={{
                    ...fontStyle,
                    fontSize: '22px',
                    lineHeight: '1.3',
                    fontWeight: 600,
                    color: 'rgb(237, 72, 59)',
                    margin: '0 0 8px 0',
                  }}
                >
                  Hybrid Citizen Engagement
                </h4>
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '18px',
                    lineHeight: '1.6',
                    fontWeight: 300,
                    color: '#171616',
                    margin: 0,
                  }}
                >
                  Create a platform that combines elements of aggregative and deliberative democracy, allowing users to both propose new initiatives and actively participate in existing services provided by the Municipality.
                </p>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <h4
                  style={{
                    ...fontStyle,
                    fontSize: '22px',
                    lineHeight: '1.3',
                    fontWeight: 600,
                    color: 'rgb(237, 72, 59)',
                    margin: '0 0 8px 0',
                  }}
                >
                  Community Empowerment
                </h4>
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '18px',
                    lineHeight: '1.6',
                    fontWeight: 300,
                    color: '#171616',
                    margin: 0,
                  }}
                >
                  We aimed to enhance community building and foster social engagement within the city, specifically focusing on empowering and supporting immigrant communities through the platform.
                </p>
              </div>
              <div>
                <h4
                  style={{
                    ...fontStyle,
                    fontSize: '22px',
                    lineHeight: '1.3',
                    fontWeight: 600,
                    color: 'rgb(237, 72, 59)',
                    margin: '0 0 8px 0',
                  }}
                >
                  Access and Communication
                </h4>
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '18px',
                    lineHeight: '1.6',
                    fontWeight: 300,
                    color: '#171616',
                    margin: 0,
                  }}
                >
                  Promote citizen interaction and facilitate communication on shared topics while prioritising the inclusion of multiple language translations to meet the standards set by competitors in the market.
                </p>
              </div>
            </div>
            <div
              style={{
                width: '100%',
                height: '100%',
                minHeight: 0,
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <img
                src="/img/Milano%20Partecipa/Benchmarking.avif"
                alt="Benchmarking"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'left center',
                  display: 'block',
                }}
              />
            </div>
          </div>

          {/* Interview：四张卡片，红标题 + 正文 */}
          <h3
            style={{
              ...fontStyle,
              fontSize: '20px',
              lineHeight: '1.3',
              fontWeight: 600,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            Interview
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: '24px',
              marginBottom: '64px',
              width: '100%',
            }}
          >
            <div
              style={{
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                backgroundColor: '#FFFFFF',
              }}
            >
              <h4 style={{ ...fontStyle, fontSize: '18px', lineHeight: '1.3', fontWeight: 600, color: 'rgb(237, 72, 59)', margin: '0 0 10px 0' }}>Low awareness</h4>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '1.5', fontWeight: 300, color: '#171616', margin: 0 }}>
                Partecipa has <strong style={{ fontWeight: 600 }}>low awareness</strong>; boost visibility via <strong style={{ fontWeight: 600 }}>daily touchpoints</strong> and <strong style={{ fontWeight: 600 }}>social media</strong>.
              </p>
            </div>
            <div
              style={{
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                backgroundColor: '#FFFFFF',
              }}
            >
              <h4 style={{ ...fontStyle, fontSize: '18px', lineHeight: '1.3', fontWeight: 600, color: 'rgb(237, 72, 59)', margin: '0 0 10px 0' }}>Interest-driven engagement</h4>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '1.5', fontWeight: 300, color: '#171616', margin: 0 }}>
                Users engage when policies or projects affect their <strong style={{ fontWeight: 600 }}>personal interests</strong>.
              </p>
            </div>
            <div
              style={{
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                backgroundColor: '#FFFFFF',
              }}
            >
              <h4 style={{ ...fontStyle, fontSize: '18px', lineHeight: '1.3', fontWeight: 600, color: 'rgb(237, 72, 59)', margin: '0 0 10px 0' }}>Complexity barrier</h4>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '1.5', fontWeight: 300, color: '#171616', margin: 0 }}>
                Too complex for <strong style={{ fontWeight: 600 }}>non-professionals</strong>, hindering <strong style={{ fontWeight: 600 }}>meaningful suggestions</strong> and causing <strong style={{ fontWeight: 600 }}>low engagement</strong> and high failure rates.
              </p>
            </div>
            <div
              style={{
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                backgroundColor: '#FFFFFF',
              }}
            >
              <h4 style={{ ...fontStyle, fontSize: '18px', lineHeight: '1.3', fontWeight: 600, color: 'rgb(237, 72, 59)', margin: '0 0 10px 0' }}>Build Trust and Efficacy</h4>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '1.5', fontWeight: 300, color: '#171616', margin: 0 }}>
                Participants doubt if their input is valued. Building <strong style={{ fontWeight: 600 }}>trust</strong> and <strong style={{ fontWeight: 600 }}>efficacy</strong> is crucial so <strong style={{ fontWeight: 600 }}>contributions</strong> are seen to lead to change.
              </p>
            </div>
          </div>

          <h2
            style={{
              ...fontStyle,
              fontSize: '28px',
              lineHeight: '36px',
              fontWeight: 300,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            Concept
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: '24px',
              marginBottom: '64px',
              width: '100%',
            }}
          >
            <div
              style={{
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                backgroundColor: '#FFFFFF',
              }}
            >
              <h4 style={{ ...fontStyle, fontSize: '18px', lineHeight: '1.3', fontWeight: 600, color: 'rgb(237, 72, 59)', margin: '0 0 10px 0' }}>Boost Platform Reach</h4>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '1.5', fontWeight: 300, color: '#171616', margin: 0 }}>
                Place <strong style={{ fontWeight: 600 }}>QR codes</strong> in parks, libraries, and transport stations for quick access; integrate with <strong style={{ fontWeight: 600 }}>social media</strong> to maximize engagement.
              </p>
            </div>
            <div
              style={{
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                backgroundColor: '#FFFFFF',
              }}
            >
              <h4 style={{ ...fontStyle, fontSize: '18px', lineHeight: '1.3', fontWeight: 600, color: 'rgb(237, 72, 59)', margin: '0 0 10px 0' }}>Interest-based Engagement Tools</h4>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '1.5', fontWeight: 300, color: '#171616', margin: 0 }}>
                Personalized dashboards to <strong style={{ fontWeight: 600 }}>follow updates</strong> on policies that affect users&apos; interests (e.g. <strong style={{ fontWeight: 600 }}>local renovations</strong>, transport). Geo-targeted notifications for nearby events.
              </p>
            </div>
            <div
              style={{
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                backgroundColor: '#FFFFFF',
              }}
            >
              <h4 style={{ ...fontStyle, fontSize: '18px', lineHeight: '1.3', fontWeight: 600, color: 'rgb(237, 72, 59)', margin: '0 0 10px 0' }}>Enhance Quality of Participation</h4>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '1.5', fontWeight: 300, color: '#171616', margin: 0 }}>
                Deeper participation for <strong style={{ fontWeight: 600 }}>Citizens and City Users</strong>: propose, give opinions, and discuss hot topics through <strong style={{ fontWeight: 600 }}>multiple levels of participatory processes</strong>.
              </p>
            </div>
            <div
              style={{
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                backgroundColor: '#FFFFFF',
              }}
            >
              <h4 style={{ ...fontStyle, fontSize: '18px', lineHeight: '1.3', fontWeight: 600, color: 'rgb(237, 72, 59)', margin: '0 0 10px 0' }}>Building Trust</h4>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '1.5', fontWeight: 300, color: '#171616', margin: 0 }}>
                <strong style={{ fontWeight: 600 }}>Transparent project budgets</strong> and <strong style={{ fontWeight: 600 }}>success cases</strong> so citizens trust the platform and see their input leading to change.
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '64px' }}>
            <div
              style={{
                width: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '12px',
              }}
            >
              <img
                src="/img/Milano%20Partecipa/Service%20Map.svg"
                alt="Service Map"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </div>
            <p
              style={{
                ...fontStyle,
                fontSize: '16px',
                lineHeight: '1.4',
                fontWeight: 400,
                color: '#171616',
                margin: 0,
                textAlign: 'center',
              }}
            >
              Service Map
            </p>
          </div>

          <h3
            style={{
              ...fontStyle,
              fontSize: '20px',
              lineHeight: '1.3',
              fontWeight: 600,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            Main Features
          </h3>
          <div
            style={{
              maxWidth: '720px',
              margin: '0 auto 120px auto',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <img
              src="/img/Milano%20Partecipa/Home.avif"
              alt="Home"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>
          <div
            style={{
              width: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '120px',
            }}
          >
            <img
              src="/img/Milano%20Partecipa/Main%20Features%201.avif"
              alt="Main Features 1"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>
          <div
            style={{
              width: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '120px',
            }}
          >
            <img
              src="/img/Milano%20Partecipa/Main%20Features%202.avif"
              alt="Main Features 2"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>
          <div
            style={{
              width: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '120px',
            }}
          >
            <img
              src="/img/Milano%20Partecipa/Main%20Features%203.avif"
              alt="Main Features 3"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>
          <div
            style={{
              width: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '120px',
            }}
          >
            <img
              src="/img/Milano%20Partecipa/Main%20Features%204.avif"
              alt="Main Features 4"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>

          <h2
            style={{
              ...fontStyle,
              fontSize: '28px',
              lineHeight: '36px',
              fontWeight: 300,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            Design process
          </h2>

          <h3
            style={{
              ...fontStyle,
              fontSize: '20px',
              lineHeight: '1.3',
              fontWeight: 600,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            Information Architecture
          </h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              marginBottom: '64px',
              width: '100%',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                flex: '1 1 200px',
                minWidth: 0,
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <img
                src="/img/Milano%20Partecipa/Open%20Card%20Sorting.avif"
                alt="Open Card Sorting"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
            <img
              src="/img/Milano%20Partecipa/Arrow.svg"
              alt=""
              style={{ width: '32px', height: '32px', flexShrink: 0 }}
            />
            <div
              style={{
                flex: '1 1 200px',
                minWidth: 0,
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <img
                src="/img/Milano%20Partecipa/Closed%20Card%20Sorting.avif"
                alt="Closed Card Sorting"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
            <img
              src="/img/Milano%20Partecipa/Arrow.svg"
              alt=""
              style={{ width: '32px', height: '32px', flexShrink: 0 }}
            />
            <div
              style={{
                flex: '1 1 200px',
                minWidth: 0,
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <img
                src="/img/Milano%20Partecipa/Tree%20Testing.avif"
                alt="Tree Testing"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '48px' }}>
            <div style={{ width: '100%', overflow: 'hidden', marginBottom: '12px' }}>
              <img
                src="/img/Milano%20Partecipa/IA_APP.avif"
                alt="Information Architecture: APP"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
            <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '1.4', fontWeight: 400, color: '#171616', margin: 0, textAlign: 'center' }}>
              Information Architecture: APP
            </p>
          </div>
          <div style={{ marginBottom: '64px' }}>
            <div style={{ width: '100%', overflow: 'hidden', marginBottom: '12px' }}>
              <img
                src="/img/Milano%20Partecipa/IA_Website.avif"
                alt="Information Architecture: Website"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
            <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '1.4', fontWeight: 400, color: '#171616', margin: 0, textAlign: 'center' }}>
              Information Architecture: Website
            </p>
          </div>

          <h3
            style={{
              ...fontStyle,
              fontSize: '20px',
              lineHeight: '1.3',
              fontWeight: 600,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            Wireframes
          </h3>
          <div style={{ width: '100%', overflow: 'hidden', marginBottom: '24px' }}>
            <img
              src="/img/Milano%20Partecipa/Wireframes_app.avif"
              alt="Wireframes app"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
          <div style={{ width: '100%', overflow: 'hidden', marginBottom: '64px' }}>
            <img
              src="/img/Milano%20Partecipa/Wireframes_Web.avif"
              alt="Wireframes Web"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          <h3
            style={{
              ...fontStyle,
              fontSize: '20px',
              lineHeight: '1.3',
              fontWeight: 600,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            Design System
          </h3>
          <div style={{ width: '100%', overflow: 'hidden', marginBottom: '24px' }}>
            <img
              src="/img/Milano%20Partecipa/Design%20System%201.avif"
              alt="Design System 1"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
          <div style={{ width: '100%', overflow: 'hidden', marginBottom: '24px' }}>
            <img
              src="/img/Milano%20Partecipa/Design%20System%202.avif"
              alt="Design System 2"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
          <div style={{ width: '100%', overflow: 'hidden', marginBottom: '64px' }}>
            <img
              src="/img/Milano%20Partecipa/Design%20System%203.avif"
              alt="Design System 3"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          <h3
            style={{
              ...fontStyle,
              fontSize: '20px',
              lineHeight: '1.3',
              fontWeight: 600,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            Hi-Fi Prototype
          </h3>
          <div style={{ width: '100%', overflow: 'hidden', marginBottom: '24px' }}>
            <img
              src="/img/Milano%20Partecipa/Hi-Fi%20Prototype%201.avif"
              alt="Hi-Fi Prototype 1"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
          <div style={{ width: '100%', overflow: 'hidden', marginBottom: '24px' }}>
            <img
              src="/img/Milano%20Partecipa/Hi-Fi%20Prototype%202.avif"
              alt="Hi-Fi Prototype 2"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
          <div style={{ width: '100%', overflow: 'hidden', marginBottom: '64px' }}>
            <img
              src="/img/Milano%20Partecipa/Hi-Fi%20Prototype%203.avif"
              alt="Hi-Fi Prototype 3"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          {/* Usability Test — Figma 141-10722：Tasks 网格 */}
          <h3
            style={{
              ...fontStyle,
              fontSize: '20px',
              lineHeight: '1.3',
              fontWeight: 600,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            Usability Test
          </h3>
          <div style={{ marginBottom: '64px' }}>
            <h4
              style={{
                ...fontStyle,
                fontSize: '22px',
                lineHeight: '1.3',
                fontWeight: 600,
                color: '#FF694B',
                margin: '0 0 16px 0',
                textAlign: 'center',
              }}
            >
              Tasks
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: '20px',
                width: '100%',
              }}
            >
              {[
                { num: '01', text: 'You want to start a chat to solve simple questions about Milan Municipality.' },
                { num: '02', text: 'You want to join an online live discussion in your community.' },
                { num: '03', text: 'You are new to the city and you want to participate in some local activities.' },
                { num: '04', text: 'You want to create a petition for an idea you have to improve the city.' },
                { num: '05', text: 'You want to check a debate about a topic of your interest.' },
                { num: '06', text: 'You want to check your published petitions.' },
                { num: '07', text: 'You want to save one of the city projects available in the app.' },
                { num: '08', text: 'You want to check your saved debates.' },
              ].map((task) => (
                <div
                  key={task.num}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    padding: '20px',
                    borderRadius: '12px',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: '#EDEFF6',
                      color: '#282855',
                      ...fontStyle,
                      fontSize: '16px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {task.num}
                  </div>
                  <p
                    style={{
                      ...fontStyle,
                      fontSize: '16px',
                      lineHeight: '1.5',
                      fontWeight: 400,
                      color: '#171616',
                      margin: 0,
                      flex: 1,
                    }}
                  >
                    {task.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Problem Analysis + Potential Improvement：左文案压缩，右图一排 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 360px) minmax(0, 1fr)',
              gap: '48px',
              alignItems: 'flex-start',
              marginBottom: '64px',
              width: '100%',
            }}
          >
            <div>
              <h4
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '1.3',
                  fontWeight: 600,
                  color: 'rgb(237, 72, 59)',
                  margin: '0 0 8px 0',
                }}
              >
                Problem Analysis
              </h4>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '16px',
                  lineHeight: '1.5',
                  fontWeight: 300,
                  color: '#171616',
                  margin: '0 0 16px 0',
                }}
              >
                Elevated misclick rate on Homepage for petition and debate tasks: users clicked the &quot;petitions&quot; and &quot;debates&quot; filters in &quot;Popular Proposals&quot; to access those pages, confusing them with buttons.
              </p>
              <h4
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '1.3',
                  fontWeight: 600,
                  color: 'rgb(237, 72, 59)',
                  margin: '0 0 8px 0',
                }}
              >
                Potential Improvement
              </h4>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '16px',
                  lineHeight: '1.5',
                  fontWeight: 300,
                  color: '#171616',
                  margin: 0,
                }}
              >
                Based on <strong style={{ fontWeight: 600 }}>Nielsen&apos;s Heuristics #6: Recognition rather than recall</strong>. (1) Two separate highlighted sections for debates and petitions. (2) An &quot;Essentials&quot; section with shortcuts to the most important features.
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '56px',
                alignItems: 'flex-end',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <img
                  src="/img/Milano%20Partecipa/Heatmap.avif"
                  alt="Homepage heatmap"
                  style={{
                    height: '400px',
                    width: 'auto',
                    display: 'block',
                    verticalAlign: 'bottom',
                  }}
                />
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '16px',
                    lineHeight: '1.4',
                    fontWeight: 400,
                    color: '#171616',
                    margin: 0,
                    textAlign: 'center',
                  }}
                >
                  Homepage Heatmap
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <img
                  src="/img/Milano%20Partecipa/Proposed%20Solution.avif"
                  alt="Proposed solution"
                  style={{
                    height: '400px',
                    width: 'auto',
                    display: 'block',
                    verticalAlign: 'bottom',
                  }}
                />
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '16px',
                    lineHeight: '1.4',
                    fontWeight: 400,
                    color: '#171616',
                    margin: 0,
                    textAlign: 'center',
                  }}
                >
                  Proposed Solution
                </p>
              </div>
            </div>
          </div>

          <h2
            style={{
              ...fontStyle,
              fontSize: '28px',
              lineHeight: '36px',
              fontWeight: 300,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            Conclusions & Further Actions
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '24px',
              width: '100%',
            }}
          >
            <div
              style={{
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(144, 202, 249, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...fontStyle,
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#171616',
                }}
              >
                01
              </div>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '1.5', fontWeight: 300, color: '#171616', margin: 0 }}>
                While we aimed at an inclusive platform for minorities and underrepresented communities, the solution serves all users in the Municipality&apos;s &quot;Citizen&quot; and &quot;City Users&quot; categories.
              </p>
            </div>
            <div
              style={{
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(144, 202, 249, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...fontStyle,
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#171616',
                }}
              >
                02
              </div>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '1.5', fontWeight: 300, color: '#171616', margin: 0 }}>
                We ran rigorous testing and iterations to validate IA and UI. Most users completed tasks successfully; minor improvements are planned for future iterations.
              </p>
            </div>
            <div
              style={{
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(144, 202, 249, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...fontStyle,
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#171616',
                }}
              >
                03
              </div>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '1.5', fontWeight: 300, color: '#171616', margin: 0 }}>
                We focused on features that build community and trust. Activities and Communities sections are key and will be developed further.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
