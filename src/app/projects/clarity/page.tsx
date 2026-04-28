import React from 'react';
import Link from 'next/link';
import { fontFamily, textStyle } from '@/lib/design-tokens';

export default function ClarityProjectPage() {
  const fontStyle = {
    fontFamily: fontFamily.system,
  };

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
          <Link
            href="/"
            style={{
              ...fontStyle,
              ...textStyle.body,
              color: 'oklch(0.556 0 0)',
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: '40px',
            }}
          >
            ← Back to Work
          </Link>

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
                ...textStyle.displayXl,
                color: '#171616',
                marginBottom: '16px',
              }}
            >
              Clarity
            </h1>
            <p
              style={{
                ...fontStyle,
                ...textStyle.leadSm,
                color: '#171616',
                maxWidth: '760px',
              }}
            >
              Clarity is a system designed to support women approaching or experiencing menopause. It combines a mobile
              app and a portable tracking device to help users monitor symptoms, track emotions, and gain insights for a
              healthier life. The system aims to improve communication with healthcare providers, empowering women to
              make informed decisions about their health and manage menopause more proactively.
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
                  ...textStyle.caption,
                  color: '#666666',
                  marginBottom: '4px',
                }}
              >
                Role
              </div>
              <div
                style={{
                  ...fontStyle,
                  ...textStyle.bodyLight,
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
                  ...textStyle.caption,
                  color: '#666666',
                  marginBottom: '4px',
                }}
              >
                Timeline
              </div>
              <div
                style={{
                  ...fontStyle,
                  ...textStyle.bodyLight,
                  color: '#171616',
                }}
              >
                2024 · 15 weeks
              </div>
            </div>

            <div>
              <div
                style={{
                  ...fontStyle,
                  ...textStyle.caption,
                  color: '#666666',
                  marginBottom: '4px',
                }}
              >
                Platform
              </div>
              <div
                style={{
                  ...fontStyle,
                  ...textStyle.bodyLight,
                  color: '#171616',
                }}
              >
                Mobile app & wearable device
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project overview video & Main Problem */}
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
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '32px',
            }}
          >
            <video
              src="/img/Clarity/Clarity.mp4"
              controls
              playsInline
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>

          {/* Main Problem — 按 Figma node 135-4037 实现：左图、右文；下方三点配图 + 文案 */}
          <h2
            style={{
              ...fontStyle,
              ...textStyle.h3,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            Main Problem
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 360px) minmax(0, 1fr)',
              gap: '48px',
              alignItems: 'center',
              marginBottom: '56px',
              width: '100%',
            }}
          >
            {/* 左侧配图：Main problem.svg 放大并占满列宽 */}
            <div
              style={{
                width: '100%',
                maxWidth: '360px',
              }}
            >
              <img
                src="/img/Clarity/Main%20problem.svg"
                alt="Main problem illustration"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </div>
            {/* 右侧：Figma 正文三段的强调与措辞 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                maxWidth: '640px',
              }}
            >
              <p
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '1.5',
                  fontWeight: 400,
                  color: '#363C56',
                  margin: 0,
                }}
              >
                Menopause is a turning point for most women in their{' '}
                <strong style={{ fontWeight: 600 }}>late 40s to early 50s</strong>, which impact their{' '}
                <strong style={{ fontWeight: 600 }}>daily life and behaviour</strong>. Unfortunately, many women are{' '}
                <strong style={{ fontWeight: 600 }}>unprepared</strong> for this transition.
              </p>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '1.5',
                  fontWeight: 400,
                  color: '#363C56',
                  margin: 0,
                }}
              >
                The significance of menopause in a woman&apos;s life is profound, both{' '}
                <strong style={{ fontWeight: 600 }}>biologically</strong> and{' '}
                <strong style={{ fontWeight: 600 }}>psychologically</strong>.
              </p>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '1.5',
                  fontWeight: 400,
                  color: '#363C56',
                  margin: 0,
                }}
              >
                Only <strong style={{ fontWeight: 700 }}>4 in 10</strong> Perimenopausal Women say a health care
                provider talked to them about what to expect in Menopause.
              </p>
            </div>
          </div>

          {/* 下方三点：图片与文案居中对齐 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '48px',
              alignItems: 'start',
              marginBottom: '48px',
            }}
          >
            {/* 点 1 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <img
                src="/img/Clarity/Problem%201.svg"
                alt=""
                style={{
                  width: '100px',
                  height: 'auto',
                  display: 'block',
                }}
              />
              <p
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '1.2',
                  fontWeight: 400,
                  color: '#363C56',
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                Most women are <strong style={{ fontWeight: 600 }}>not informed on menopausal symptoms</strong> and
                what measures to take.
              </p>
            </div>

            {/* 点 2 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <img
                src="/img/Clarity/Problem%202.svg"
                alt=""
                style={{
                  width: '165px',
                  height: 'auto',
                  display: 'block',
                }}
              />
              <p
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '1.2',
                  fontWeight: 400,
                  color: '#363C56',
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                About <strong style={{ fontWeight: 600 }}>2 in 3 women</strong> say there is a general{' '}
                <strong style={{ fontWeight: 600 }}>lack of support and understanding.</strong>
              </p>
            </div>

            {/* 点 3 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <img
                src="/img/Clarity/Problem%203.svg"
                alt="60%"
                style={{
                  width: '100px',
                  height: 'auto',
                  display: 'block',
                }}
              />
              <p
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '1.2',
                  fontWeight: 400,
                  color: '#363C56',
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                Over <strong style={{ fontWeight: 600 }}>60% of women</strong> experience symptoms resulting in{' '}
                <strong style={{ fontWeight: 600 }}>behaviour changes.</strong>
              </p>
            </div>
          </div>

          {/* Persona — Figma node 135-4116：左侧 Persona.png，右侧姓名/身份/引用/描述/症状 */}
          <h2
            style={{
              ...fontStyle,
              ...textStyle.h3,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            Persona
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 380px) minmax(0, 1fr)',
              gap: '48px',
              alignItems: 'center',
              marginBottom: '48px',
              width: '100%',
            }}
          >
            {/* 左侧：Persona 长方形图片，后面一层渐变圆 */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '380px',
                height: '420px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-20%',
                  left: '-10%',
                  width: '120%',
                  aspectRatio: '1',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 30% 20%, #FFE1E2 0%, #FE989B 40%, rgba(254,152,155,0) 70%)',
                  opacity: 0.7,
                  zIndex: -1,
                  pointerEvents: 'none',
                }}
              />
              <img
                src="/img/Clarity/Persona.avif"
                alt="Grace Shelton"
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  zIndex: 1,
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                maxWidth: '640px',
              }}
            >
              <p
                style={{
                  ...fontStyle,
                  fontSize: '32px',
                  lineHeight: '1.2',
                  fontWeight: 600,
                  color: '#363C56',
                  margin: 0,
                }}
              >
                Grace Shelton
              </p>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '20px',
                  lineHeight: '1.3',
                  fontWeight: 500,
                  color: '#363C56',
                  margin: 0,
                }}
              >
                47 years old / Office Manager / Married
              </p>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '1.4',
                  fontWeight: 500,
                  color: '#363C56',
                  margin: 0,
                  padding: '20px 24px',
                  backgroundColor: 'rgba(254, 152, 155, 0.08)',
                  borderRadius: '12px',
                  borderLeft: '4px solid #FE989B',
                }}
              >
                I want to improve communication with my doctor, express my symptoms clearly and be more involved, for
                more personalised care.
              </p>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '1.5',
                  fontWeight: 400,
                  color: '#363C56',
                  margin: 0,
                }}
              >
                Grace is experiencing the <strong style={{ fontWeight: 600 }}>first symptoms</strong> of Menopause but
                is <strong style={{ fontWeight: 600 }}>not aware</strong> of what is happening. The symptoms are
                compromising her work and her general wellbeing.
              </p>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '24px',
                  alignItems: 'center',
                  marginTop: '8px',
                }}
              >
                {/* Hot Flashes 带图标 */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <img
                    src="/img/Clarity/Hot%20Flashes.svg"
                    alt="Hot Flashes"
                    style={{ width: '28px', height: '28px', display: 'block' }}
                  />
                  <span style={{ ...fontStyle, fontSize: '18px', fontWeight: 500, color: '#363C56' }}>Hot Flashes</span>
                </div>

                {/* Palpitations 带图标 */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <img
                    src="/img/Clarity/Palpitations.svg"
                    alt="Palpitations"
                    style={{ width: '28px', height: '28px', display: 'block' }}
                  />
                  <span style={{ ...fontStyle, fontSize: '18px', fontWeight: 500, color: '#363C56' }}>Palpitations</span>
                </div>

                {/* Brain Fog 带图标 */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <img
                    src="/img/Clarity/Brain%20Fog.svg"
                    alt="Brain Fog"
                    style={{ width: '28px', height: '28px', display: 'block' }}
                  />
                  <span style={{ ...fontStyle, fontSize: '18px', fontWeight: 500, color: '#363C56' }}>Brain Fog</span>
                </div>
              </div>
            </div>
          </div>

          {/* Solution — Figma node 135-4145：左侧 App 图，右侧文字 + Device 图 + 列表 */}
          <h2
            style={{
              ...fontStyle,
              ...textStyle.h3,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            Solution
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 420px) minmax(0, 1fr)',
              gap: '56px',
              alignItems: 'flex-start',
              marginBottom: '72px',
              width: '100%',
            }}
          >
            {/* 左侧：APP 手机界面，上半部分可见，下半部分被容器裁切 */}
            <div
              style={{
                width: '100%',
                maxWidth: '440px',
                height: '600px',
                overflow: 'hidden',
              }}
            >
              <img
                src="/img/Clarity/APP.avif"
                alt="Clarity app insights overview"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </div>

            {/* 右侧：标题句 + 设备图 + 两点列表（设备同样只显示上半部分） */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                maxWidth: '640px',
                marginTop: '260px',
              }}
            >
              <p
                style={{
                  ...fontStyle,
                  fontSize: '24px',
                  lineHeight: '1.4',
                  fontWeight: 500,
                  color: '#363C56',
                  margin: 0,
                }}
              >
                A system <strong style={{ fontWeight: 600, color: '#001133' }}>supporting women</strong> approaching or
                going through menopause, with the help of the
                <strong style={{ fontWeight: 600, color: '#001133' }}> Italian National Health Service (SSN)</strong>.
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '32px',
                }}
              >
                <div
                  style={{
                    width: '220px',
                    maxWidth: '260px',
                    height: '260px',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src="/img/Clarity/Device.avif"
                    alt="Clarity portable device"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                    }}
                  />
                </div>
                <ol
                  style={{
                    ...fontStyle,
                    fontSize: '18px',
                    lineHeight: '1.6',
                    fontWeight: 400,
                    color: '#363C56',
                    margin: 0,
                    paddingLeft: '24px',
                  }}
                >
                  <li>Clarity Application</li>
                  <li>Portable Device</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Solution Details：三块功能场景图 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '32px',
              marginBottom: '80px',
            }}
          >
            {[
              {
                img: '/img/Clarity/Solution%201.png',
                alt: 'Symptom tracking overview',
                title: 'Symptom Tracking',
                desc: 'Track symptoms and emotions easily to gain insights for a healthier life.',
              },
              {
                img: '/img/Clarity/Solution%202.png',
                alt: 'Knowledge learning section',
                title: 'Knowledge Empowerment',
                desc: 'Dive into the learning section to empower menopause understanding.',
              },
              {
                img: '/img/Clarity/Solution%203.png',
                alt: 'Doctor communication view',
                title: 'Improve communication with doctor',
                desc: 'Data is seamlessly shared with the doctor, ensuring better communication.',
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    maxWidth: '320px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={item.img}
                    alt={item.alt}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                    }}
                  />
                </div>
                <h3
                  style={{
                    ...fontStyle,
                    fontSize: '20px',
                    lineHeight: '26px',
                    fontWeight: 600,
                    color: '#363C56',
                    margin: 0,
                    textAlign: 'center',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    ...fontStyle,
                    ...textStyle.bodyLight,
                    color: '#363C56',
                    margin: 0,
                    textAlign: 'center',
                    maxWidth: '360px',
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* User Flow：整体系统流程示意图 */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '64px',
            }}
          >
            <img
              src="/img/Clarity/User%20flow.svg"
              alt="Clarity user flow overview"
              style={{
                width: '100%',
                maxWidth: '960px',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>

          {/* User Journey：整图展示（Figma node 276-2603） */}
          <h2
            style={{
              ...fontStyle,
              ...textStyle.h3,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            User Journey
          </h2>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '64px',
            }}
          >
            <img
              src="/img/Clarity/User%20Journey.avif"
              alt="Clarity user journey"
              style={{
                width: '100%',
                maxWidth: '1120px',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>

          {/* App Design：标题叠在背景图上 */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              borderRadius: '8px',
              backgroundImage: "url('/img/Clarity/App%20Design.avif')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#F7F8FA',
              aspectRatio: '16 / 9',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              padding: '32px 40px',
            }}
          >
            <h2
              style={{
                ...fontStyle,
                ...textStyle.h3,
                color: '#171616',
                margin: 0,
              }}
            >
              App Design
            </h2>
          </div>
          {/* Figma node 2217-2635：Tracking / Insights / Learning / Visits 四块图+文案 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '48px 80px',
              marginTop: '64px',
              marginBottom: '64px',
            }}
          >
            {[
              {
                img: '/img/Clarity/Tracking.avif',
                alt: 'Tracking',
                title: 'Tracking',
                desc: (
                  <>
                    Easy to <span style={{ color: '#FE989B' }}>log symptoms, period and other relevant factors</span> for
                    more comprehensive data
                  </>
                ),
              },
              {
                img: '/img/Clarity/Insights.avif',
                alt: 'Insights',
                title: 'Insights',
                desc: (
                  <>
                    See how <span style={{ color: '#FE989B' }}>symptoms</span> and{' '}
                    <span style={{ color: '#FE989B' }}>emotions</span> are evolving over time for a healthier daily life
                  </>
                ),
              },
              {
                img: '/img/Clarity/Learning.avif',
                alt: 'Learning',
                title: 'Learning',
                desc: (
                  <>
                    Access to <span style={{ color: '#FE989B' }}>credible articles</span> provided by the SSN to improve
                    knowledge on menopause
                  </>
                ),
              },
              {
                img: '/img/Clarity/Visits.avif',
                alt: 'Visits',
                title: 'Visits',
                desc: (
                  <>
                    Check upcoming visits and add <span style={{ color: '#FE989B' }}>notes to the doctor</span> for
                    improved communication
                  </>
                ),
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    maxWidth: index === 3 ? '254px' : undefined,
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={item.img}
                    alt={item.alt}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                    }}
                  />
                </div>
                <h3
                  style={{
                    ...fontStyle,
                    fontSize: '28px',
                    lineHeight: '1.2',
                    fontWeight: 500,
                    color: '#363C56',
                    margin: 0,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '18px',
                    lineHeight: '1.5',
                    fontWeight: 400,
                    color: '#1E1E1E',
                    margin: 0,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* App User Test — Figma node 2218-2642：左三条例项，右图 Test.png */}
          <h2
            style={{
              ...fontStyle,
              ...textStyle.h3,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            App User Test
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 480px)',
              gap: '48px',
              alignItems: 'center',
              marginBottom: '64px',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {[
                {
                  num: '1',
                  title: 'Insights: Remove unnecessary info',
                  desc: 'Keep only the most important info for the user - weekly overview, symptoms and period',
                },
                {
                  num: '2',
                  title: 'Symptom Insights: Simplify display',
                  desc: 'Switch between frequency and intensity for a cleaner view and allow comparisons with medication/activity',
                },
                {
                  num: '3',
                  title: 'Weekly Overview: More positive',
                  desc: 'Always provide a reassuring message to keep a positive view, avoiding terms like "Bad" or "Negative"',
                },
              ].map((item) => (
                <div
                  key={item.num}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#5C77F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        ...fontStyle,
                        fontSize: '20px',
                        fontWeight: 400,
                        color: '#EFF2FF',
                        lineHeight: 1,
                      }}
                    >
                      {item.num}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        ...fontStyle,
                        fontSize: '22px',
                        lineHeight: '1.3',
                        fontWeight: 600,
                        color: '#363C56',
                        margin: '0 0 8px 0',
                      }}
                    >
                      {item.title}
                    </p>
                    <p
                      style={{
                        ...fontStyle,
                        fontSize: '18px',
                        lineHeight: '1.5',
                        fontWeight: 400,
                        color: '#363C56',
                        margin: 0,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                width: '100%',
                maxWidth: '480px',
                borderRadius: '16px',
                overflow: 'hidden',
              }}
            >
              <img
                src="/img/Clarity/Test.avif"
                alt="User test"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </div>
          </div>

          {/* Device Design — Figma node 2218-2646：左文案 + 右图 Device intensity.png */}
          <h2
            style={{
              ...fontStyle,
              ...textStyle.h3,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            Device Design
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 360px) minmax(0, 1fr)',
              gap: '48px',
              alignItems: 'center',
              marginBottom: '64px',
              width: '100%',
            }}
          >
            {/* 左侧：Figma 2218-2645 — 标题 + 副标题 + 三项（文案上、图标下），图标色 #5C77F6 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '48px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  alignItems: 'center',
                }}
              >
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '32px',
                    lineHeight: '1.25',
                    fontWeight: 600,
                    color: '#363C56',
                    margin: 0,
                  }}
                >
                  Symptom tracking with a simple click.
                </p>
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '20px',
                    lineHeight: '1.4',
                    fontWeight: 400,
                    color: '#363C56',
                    margin: 0,
                  }}
                >
                  For symptoms that occur multiple times during the day/night
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '40px',
                  alignItems: 'flex-end',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#5C77F6',
                      maskImage: "url('/img/Clarity/Hot%20Flashes.svg')",
                      maskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMaskImage: "url('/img/Clarity/Hot%20Flashes.svg')",
                      WebkitMaskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                    }}
                  />
                  <span style={{ ...fontStyle, fontSize: '16px', fontWeight: 500, color: '#5C77F6' }}>Hot flashes</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#5C77F6',
                      maskImage: "url('/img/Clarity/Brain%20Fog.svg')",
                      maskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMaskImage: "url('/img/Clarity/Brain%20Fog.svg')",
                      WebkitMaskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                    }}
                  />
                  <span style={{ ...fontStyle, fontSize: '16px', fontWeight: 500, color: '#5C77F6' }}>Brain Fog</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#5C77F6',
                      maskImage: "url('/img/Clarity/Palpitations.svg')",
                      maskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMaskImage: "url('/img/Clarity/Palpitations.svg')",
                      WebkitMaskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                    }}
                  />
                  <span style={{ ...fontStyle, fontSize: '16px', fontWeight: 500, color: '#5C77F6' }}>Palpitations</span>
                </div>
              </div>
            </div>
            <div
              style={{
                width: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <img
                src="/img/Clarity/Device%20intensity.avif"
                alt="Device intensity"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </div>
          </div>

          {/* Device Feedback — Figma 2218-2661：左图 Device feedback.png + 右列表，无区块标题 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 560px) minmax(0, 1fr)',
              gap: '48px',
              alignItems: 'center',
              marginBottom: '64px',
              width: '100%',
            }}
          >
            <div
              style={{
                width: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <img
                src="/img/Clarity/Device%20feedback.avif"
                alt="Device feedback"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </div>
            {/* 右侧：与 App User Test 左侧同款 list，内容来自 Figma 2218-2660 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginLeft: '32px' }}>
              {[
                { num: '1', title: 'Complementary Use with the App' },
                { num: '2', title: 'Accessibility for Different Users' },
                { num: '3', title: 'Reduced Screen Time' },
                { num: '4', title: 'Higher Engagement' },
                { num: '5', title: 'Sign of Support from the SNN' },
              ].map((item) => (
                <div
                  key={item.num}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#5C77F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        ...fontStyle,
                        fontSize: '20px',
                        fontWeight: 400,
                        color: '#EFF2FF',
                        lineHeight: 1,
                      }}
                    >
                      {item.num}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        ...fontStyle,
                        fontSize: '22px',
                        lineHeight: '1.3',
                        fontWeight: 600,
                        color: '#363C56',
                        margin: 0,
                      }}
                    >
                      {item.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device User Test — Figma 2219-2662：左列表，右图 Device User Test.png */}
          <h2
            style={{
              ...fontStyle,
              ...textStyle.h3,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            Device User Test
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 480px)',
              gap: '48px',
              alignItems: 'center',
              marginBottom: '64px',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {[
                {
                  num: '1',
                  title: 'Feedback: Colour of the LEDs',
                  desc: 'The colour of lights needs more consideration, according to colour scheme that remains consistent throughout the application',
                },
                {
                  num: '2',
                  title: 'Feedforward: Icons and Instructions',
                  desc: "Guide users through the device's features, using icons and instructions",
                },
                {
                  num: '3',
                  title: 'Feedforward: Click Instead of Press',
                  desc: 'Clicking seemed to be more intuitive and simpler than the long press to increase symptom intensity, which was associated with rebooting the device.',
                },
              ].map((item) => (
                <div
                  key={item.num}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#5C77F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        ...fontStyle,
                        fontSize: '20px',
                        fontWeight: 400,
                        color: '#EFF2FF',
                        lineHeight: 1,
                      }}
                    >
                      {item.num}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        ...fontStyle,
                        fontSize: '22px',
                        lineHeight: '1.3',
                        fontWeight: 600,
                        color: '#363C56',
                        margin: '0 0 8px 0',
                      }}
                    >
                      {item.title}
                    </p>
                    <p
                      style={{
                        ...fontStyle,
                        fontSize: '18px',
                        lineHeight: '1.5',
                        fontWeight: 400,
                        color: '#363C56',
                        margin: 0,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                width: '100%',
                maxWidth: '480px',
                borderRadius: '16px',
                overflow: 'hidden',
              }}
            >
              <img
                src="/img/Clarity/Device%20User%20Test.avif"
                alt="Device user test"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </div>
          </div>

          {/* Future Improvements — Figma 2219-2915：三张图 + 对应文案 */}
          <h2
            style={{
              ...fontStyle,
              ...textStyle.h3,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            Future Improvements
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '32px',
              marginBottom: '64px',
              width: '100%',
            }}
          >
            {[
              {
                img: "/img/Clarity/Doctor%20Interface.avif",
                alt: "Doctor's Interface",
                title: "Doctor's Interface",
                desc: "Design and test the doctor's interface to ensure it surfaces the right information and fits into clinical workflows.",
              },
              {
                img: "/img/Clarity/Further%20Testing.avif",
                alt: "Further Testing",
                title: "Further Testing",
                desc: "Test new versions of the device and app with the target audience to validate effectiveness and usability.",
              },
              {
                img: "/img/Clarity/Other%20Diseases.avif",
                alt: "Other Diseases",
                title: "Other Conditions",
                desc: "Adapt the system to other chronic health conditions, improving overall doctor–patient communication.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={item.img}
                    alt={item.alt}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                    }}
                  />
                </div>
                <h3
                  style={{
                    ...fontStyle,
                    fontSize: '20px',
                    lineHeight: '1.3',
                    fontWeight: 600,
                    color: '#363C56',
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

        </div>
      </section>
    </div>
  );
}

