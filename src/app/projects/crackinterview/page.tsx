import React from 'react';
import { fontFamily, textStyle } from '@/lib/design-tokens';

export default function CrackInterviewPage() {
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
          {/* Back link */}
          <a
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
          </a>

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
              CrackInterview
            </h1>
            <div style={{ marginBottom: '16px' }}>
              <a
                href="https://crackinterview.ai/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                }}
                className="live-site-button"
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
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>
            <p
              style={{
                ...fontStyle,
                ...textStyle.leadSm,
                color: '#171616',
                maxWidth: '760px',
              }}
            >
              <strong>CrackInterview.AI</strong> is an AI-powered mock interview platform designed to help users
              practice and improve their performance in tech job interviews. I led the UX/UI design, focusing on
              creating a streamlined user flow and an intuitive, engaging experience.
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
                Product Designer · UX & UI
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
                2025 · 8 weeks
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
                Web app
              </div>
            </div>
          </div>

          {/* Cover image inside hero */}
          <div
            style={{
              width: '100%',
              marginTop: 0,
              marginBottom: '8px',
            }}
          >
            <img
              src="/img/crackinterview/cover.avif"
              alt="CrackInterview cover"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '16px',
              }}
            />
          </div>
        </div>
      </section>


      {/* Project Background & Goals */}
      <section
        className="w-screen"
        style={{
          backgroundColor: '#F9FBFD',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '64px',
          paddingBottom: '64px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          <h2
            style={{
              ...fontStyle,
              fontSize: '32px',
              lineHeight: '40px',
              fontWeight: 300,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            Project Background &amp; Goals
          </h2>

          {/* 上：文字说明 */}
          <div
            style={{
              maxWidth: '920px',
              marginBottom: '32px',
            }}
          >
            <p
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '27px',
                fontWeight: 300,
                color: '#171616',
                marginBottom: '16px',
              }}
            >
              CrackInterview.AI was developed as an extension of liba.space, a career platform known for its mentorship
              network and job training programs for Chinese-speaking professionals. While liba.space provided valuable
              guidance, users needed a more interactive and scalable way to practice for tech interviews—especially when
              targeting roles in North America.
            </p>
            <p
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '27px',
                fontWeight: 300,
                color: '#171616',
              }}
            >
              To meet this need, we created CrackInterview.AI
            </p>
          </div>

          {/* 下：图片独占一行 */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginTop: '8px',
            }}
          >
            <img
              src="/img/crackinterview/Sysytem.svg"
              alt="CrackInterview system overview"
              style={{
                width: '100%',
                maxWidth: '560px',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>
        </div>
      </section>

      {/* Research & Discovery + Core Features + User Flow + Conversation Design */}
      <section
        className="w-screen"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '64px',
          paddingBottom: '64px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          {/* Design Process / Research */}
          <h2
            style={{
              ...fontStyle,
              fontSize: '32px',
              lineHeight: '40px',
              fontWeight: 300,
              color: '#171616',
              marginBottom: '12px',
            }}
          >
            Design Process
          </h2>
          <p
            style={{
              ...fontStyle,
              ...textStyle.bodyReading,
              color: '#171616',
              marginBottom: '20px',
              maxWidth: '920px',
            }}
          >
            Our design process followed an iterative, user-centered approach, combining rapid prototyping, AI prompt
            design, and continuous user feedback.
          </p>
          {/* Research & Discovery */}
          <h3
            style={{
              ...fontStyle,
              fontSize: '24px',
              lineHeight: '32px',
              fontWeight: 300,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            Research &amp; Discovery
          </h3>
          {/* 顶部描述：整行铺满 */}
          <div
            style={{
              maxWidth: '920px',
              marginBottom: '32px',
            }}
          >
            <p
              style={{
                ...fontStyle,
                ...textStyle.bodyReading,
                color: '#171616',
              }}
            >
              To better understand the challenges faced by early-career job seekers—especially international students
              targeting tech roles in North America—we conducted a mixed-method research phase combining surveys and
              semi-structured interviews.
            </p>
          </div>
          {/* 下方：左侧 Persona，右侧 Key Insights，结构与原站一致 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 2.5fr) minmax(0, 3fr)',
              gap: '40px',
              marginBottom: '56px',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                src="/img/crackinterview/Persona.avif"
                alt="Research Persona"
                style={{
                  width: '100%',
                  maxWidth: '520px',
                  borderRadius: '8px',
                  display: 'block',
                }}
              />
            </div>
            <div>
              <h3
                style={{
                  ...fontStyle,
                  ...textStyle.h4,
                  color: '#171616',
                  marginBottom: '16px',
                }}
              >
                Key Insights
              </h3>
              <ul
                style={{
                  ...fontStyle,
                  ...textStyle.bodyLight,
                  color: '#171616',
                  paddingLeft: 0,
                  margin: 0,
                  listStylePosition: 'inside',
                }}
              >
                <li style={{ marginBottom: '10px' }}>
                  <span style={{ fontWeight: 500 }}>Lack of feedback:</span> Most candidates never hear back after
                  interviews and struggle to understand what went wrong.
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <span style={{ fontWeight: 500 }}>Limited interview opportunities:</span> International students face
                  higher rejection rates due to visa constraints and limited networks.
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <span style={{ fontWeight: 500 }}>Overwhelming platforms:</span> Tools like LinkedIn and Indeed feel
                  cluttered, repetitive, and not personalized enough for users&apos; specific needs.
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <span style={{ fontWeight: 500 }}>Desire for targeted guidance:</span> Many users prefer human
                  mentorship and contextual advice over generic AI suggestions.
                </li>
                <li>
                  <span style={{ fontWeight: 500 }}>Referral barriers:</span> Getting a referral remains one of the
                  biggest hurdles without insider access or strong alumni networks.
                </li>
              </ul>
            </div>
          </div>

          {/* Core Features */}
          <h2
            style={{
              ...fontStyle,
              ...textStyle.h3,
              color: '#171616',
              marginBottom: '16px',
            }}
          >
            Core Features
          </h2>
          <p
            style={{
              ...fontStyle,
              ...textStyle.bodyReading,
              color: '#171616',
              maxWidth: '920px',
              marginBottom: '32px',
            }}
          >
            Based on research, CrackInterview.AI focuses on the most pressing needs of job seekers—especially
            international candidates—by combining AI-driven simulation with human support.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: '24px',
              marginBottom: '56px',
            }}
          >
            {[
              {
                img: 'Core Features1.avif',
                title: 'Smart Job Matching',
                desc: 'A custom job crawler monitors hiring platforms and, via AI matching, pushes high-relevance roles to users based on their profiles.',
              },
              {
                img: 'Core Features2.avif',
                title: 'AI-Powered Mock Interviews',
                desc: 'Simulates realistic, multi-stage interview flows and generates structured reports with actionable guidance.',
              },
              {
                img: 'Core Features3.avif',
                title: 'Mentor Guidance',
                desc: 'Connects mock interview results to liba.space’s mentor network for targeted career coaching.',
              },
              {
                img: 'Core Features4.avif',
                title: 'Referral Support',
                desc: 'Enables internal referrals through a trusted network once candidates are interview-ready.',
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  padding: '16px',
                  borderRadius: '16px',
                  backgroundColor: '#F7F8FA',
                  border: '1px solid rgba(0, 0, 0, 0.04)',
                  height: '100%',
                }}
              >
                <img
                  src={`/img/crackinterview/${item.img}`}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    marginBottom: '8px',
                  }}
                />
                <h3
                  style={{
                    ...fontStyle,
                    fontSize: '16px',
                    lineHeight: '22px',
                    fontWeight: 500,
                    color: '#171616',
                    margin: 0,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '14px',
                    lineHeight: '22px',
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

          {/* User Flow */}
          <h2
            style={{
              ...fontStyle,
              ...textStyle.h3,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            User Flow
          </h2>
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto 56px auto',
            }}
          >
            <img
              src="/img/crackinterview/User Flow.svg"
              alt="CrackInterview User Flow"
              style={{
                width: '80%',
                height: 'auto',
                borderRadius: '8px',
                display: 'block',
                margin: '0 auto',
              }}
            />
          </div>

          {/* Conversation Design */}
          <h2
            style={{
              ...fontStyle,
              ...textStyle.h3,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            Conversation Design
          </h2>
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto 32px auto',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                marginBottom: '24px',
              }}
            >
              <img
                src="/img/crackinterview/Conversation%20Design.avif"
                alt="Conversation Design"
                style={{
                  width: '50%',
                  maxWidth: '720px',
                  height: 'auto',
                  borderRadius: '8px',
                  display: 'inline-block',
                }}
              />
            </div>
            <div
              style={{
                maxWidth: '960px',
                margin: '0 auto 32px auto',
              }}
            >
              <p
                style={{
                  ...fontStyle,
                  ...textStyle.bodyReading,
                  color: '#171616',
                  textAlign: 'center',
                  margin: 0,
                }}
              >
                I crafted voice-interactive conversational flows that mimic natural, human-like dialogue to simulate
                realistic interview experiences tailored to different tech roles and stages.
              </p>
            </div>

            {/* AI Interviewer Persona */}
            <h3
              style={{
                ...fontStyle,
                fontSize: '22px',
                lineHeight: '30px',
                fontWeight: 400,
                color: '#171616',
                marginBottom: '24px',
              }}
            >
              AI Interviewer Persona
            </h3>
            <div
              style={{
                display: 'flex',
                gap: '4%',
                marginBottom: '20px',
              }}
            >
              <img
                src="/img/crackinterview/Persona1.avif"
                alt="AI Interviewer Persona 1"
                style={{
                  width: '48%',
                  height: 'auto',
                  borderRadius: '8px',
                  display: 'block',
                }}
              />
              <img
                src="/img/crackinterview/Persona2.avif"
                alt="AI Interviewer Persona 2"
                style={{
                  width: '48%',
                  height: 'auto',
                  borderRadius: '8px',
                  display: 'block',
                }}
              />
            </div>
            <p
              style={{
                ...fontStyle,
                ...textStyle.bodyReading,
                color: '#171616',
                textAlign: 'center',
                marginBottom: '32px',
              }}
            >
              AI interviewers are matched to each interview stage to simulate realistic tone, style, and expectations
              across the hiring process.
            </p>

            {/* Chatflow */}
            <h3
              style={{
                ...fontStyle,
                fontSize: '22px',
                lineHeight: '30px',
                fontWeight: 400,
                color: '#171616',
                marginBottom: '16px',
              }}
            >
              Chatflow
            </h3>
            <div
              style={{
                display: 'flex',
                gap: '32px',
                alignItems: 'flex-start',
                marginTop: '8px',
              }}
            >
              {/* 左侧：详细 Chatflow 步骤（按原站还原） */}
              <div
                style={{
                  flex: '0 0 55%',
                  ...fontStyle,
                  ...textStyle.bodyReading,
                  color: '#171616',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>1. Welcome &amp; Setup</div>
                  <p style={{ margin: '4px 0 0 0' }}>
                    AI: “Hi, welcome to your mock interview. I&apos;ll be guiding you through a few questions based on your
                    selected role and interview stage.”
                  </p>
                  <p style={{ margin: '4px 0 0 0' }}>
                    Let the user know it&apos;s a voice-based interview and encourage them to find a quiet environment.
                  </p>
                </div>

                <div>
                  <div style={{ fontWeight: 600 }}>2. Confirm Start</div>
                  <p style={{ margin: '4px 0 0 0' }}>AI: “Are you ready to begin?”</p>
                  <p style={{ margin: '4px 0 0 0' }}>Wait for voice input: user says “Yes” → proceed to the first question.</p>
                  <p style={{ margin: '4px 0 0 0' }}>
                    If the user is silent for a few seconds, give a gentle reminder: “Take your time. Just say ‘Yes’ when
                    you&apos;re ready.”
                  </p>
                </div>

                <div>
                  <div style={{ fontWeight: 600 }}>🔹 a. Ask Question</div>
                  <p style={{ margin: '4px 0 0 0' }}>
                    AI: “Tell me about a time you had to resolve a team conflict.”
                  </p>
                </div>

                <div>
                  <div style={{ fontWeight: 600 }}>🔹 b. Wait for User Response (Max: ~1 minute)</div>
                  <p style={{ margin: '4px 0 0 0' }}>
                    <span style={{ fontWeight: 500 }}>Silence handling:</span>
                  </p>
                  <p style={{ margin: '2px 0 0 0' }}>After ~4 seconds of silence – 1st reminder: “You can start whenever you&apos;re ready.”</p>
                  <p style={{ margin: '2px 0 0 0' }}>
                    Still no response – 2nd prompt: “Think about a project where you disagreed with a teammate.”
                  </p>
                  <p style={{ margin: '2px 0 0 0' }}>
                    Still no response – 3rd fallback: “Would you like to skip this question and move on?”
                  </p>
                  <p style={{ margin: '2px 0 0 0' }}>
                    If skipped → jump to the next question. If the user responds → proceed to the follow-up and summary.
                  </p>
                </div>

                <div>
                  <div style={{ fontWeight: 600 }}>🔹 c. Response Summary &amp; Transition</div>
                  <p style={{ margin: '4px 0 0 0' }}>
                    AI: “Got it. Sounds like you handled that situation thoughtfully.” [short pause] “Let&apos;s move on to
                    the next question.”
                  </p>
                </div>

                <div>
                  <div style={{ fontWeight: 600 }}>4. Repeat for Next Questions</div>
                  <p style={{ margin: '4px 0 0 0' }}>
                    Typically 3–5 questions per round. The interviewer persona can change based on the selected round or
                    difficulty.
                  </p>
                </div>

                <div>
                  <div style={{ fontWeight: 600 }}>5. End Interview</div>
                  <p style={{ margin: '4px 0 0 0' }}>
                    AI: “Great job today. You stayed thoughtful and composed throughout—that&apos;s already a strong skill
                    in any interview.” [short pause] “I&apos;m putting together your report—you&apos;ll be able to check it
                    for suggestions on how to improve.”
                  </p>
                </div>
              </div>

              {/* 右侧：Chatflow 示意图（滚动时固定） */}
              <div
                style={{
                  flex: '0 0 45%',
                  display: 'flex',
                  justifyContent: 'center',
                  position: 'sticky',
                  top: '120px',
                }}
              >
                <img
                  src="/img/crackinterview/Chatflow.svg"
                  alt="Chatflow diagram"
                  style={{
                    width: '100%',
                    maxWidth: '420px',
                    height: 'auto',
                    borderRadius: '8px',
                    display: 'block',
                  }}
                />
              </div>
            </div>

            {/* Interactive Demo 模块 */}
            <div style={{ marginTop: '40px' }}>
              <h3
                style={{
                  ...fontStyle,
                  fontSize: '24px',
                  lineHeight: '32px',
                  fontWeight: 400,
                  color: '#171616',
                  marginBottom: '30px',
                  textAlign: 'left',
                }}
              >
                Interactive Demo
              </h3>

              {/* 提示说明块，对应原站 chatflow-note */}
              <div
                style={{
                  marginTop: '0',
                  marginBottom: '24px',
                  padding: '20px',
                  backgroundColor: '#F8F9FA',
                  borderLeft: '4px solid #007BFF',
                  borderRadius: '4px',
                  width: '100%',
                }}
              >
                <p
                  style={{
                    ...fontStyle,
                    ...textStyle.bodyReading,
                    color: '#495057',
                    margin: 0,
                    fontStyle: 'italic',
                  }}
                >
                  Through iterative tuning and testing with ElevenLabs, we enhanced the naturalness and accuracy of the
                  AI interviewer’s responses. As a UX designer, I focused on refining the dialogue flow to create a more
                  realistic and immersive interview simulation experience, ensuring the AI could replicate the tone and
                  rhythm of real interview scenarios.
                </p>
              </div>

              {/* 中心居中的 Demo 卡片和说明，对应 animation-demo-content */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <a
                    href="https://elevenlabs.io/app/talk-to?agent_id=agent_3001k1ea0743fzzsb7qapacgmk90"
                    target="_blank"
                    rel="noreferrer"
                    className="ci-animation-demo-link"
                    aria-label="Interactive Demo"
                  />
                </div>

                <div
                  style={{
                    textAlign: 'center',
                    maxWidth: '640px',
                  }}
                >
                  <p
                    style={{
                      ...fontStyle,
                      ...textStyle.bodyReading,
                      color: '#171616',
                      margin: 0,
                    }}
                  >
                    Experience our AI interviewer in action. Click to try the interactive demo and see how natural
                    conversation flows work in practice.
                  </p>
                </div>
              </div>
            </div>

            {/* Wireframe 模块 */}
            <div style={{ marginTop: '40px' }}>
              <h2
                style={{
                  ...fontStyle,
                  fontSize: '24px',
                  lineHeight: '32px',
                  fontWeight: 400,
                  color: '#171616',
                  marginBottom: '30px',
                  textAlign: 'left',
                }}
              >
                Wireframe
              </h2>
              <div style={{ width: '100%' }}>
                <div
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    backgroundColor: '#F7F8FA',
                    padding: '20px',
                    borderRadius: '8px',
                  }}
                >
                  <img
                    src="/img/crackinterview/Wireframe.avif"
                    alt="Wireframe"
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      borderRadius: '8px',
                      display: 'inline-block',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features 模块 */}
      <section
        className="w-screen"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '64px',
          paddingBottom: '72px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          <h2
            style={{
              ...fontStyle,
              ...textStyle.h3,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            Main Features
          </h2>

          {/* Mock Interview 模块 */}
          <div style={{ marginBottom: '40px' }}>
            <h3
              style={{
                ...fontStyle,
                fontSize: '22px',
                lineHeight: '30px',
                fontWeight: 400,
                color: '#171616',
                marginBottom: '12px',
              }}
            >
              Mock Interview
            </h3>
              <div
                style={{
                  ...fontStyle,
                  ...textStyle.bodyReading,
                  color: '#171616',
                  maxWidth: '820px',
                }}
              >
              <p style={{ marginBottom: '8px' }}>
                Our AI-powered mock interview simulates real job interviews based on users&apos; resumes and the selected
                job description. Sessions are video recorded so candidates can reflect on their performance and track
                progress over time.
              </p>
              <p style={{ marginBottom: '8px' }}>
                Because running AI digital interviewers can be expensive, the platform offers two formats based on the
                user&apos;s subscription plan:
              </p>
              <ul
                style={{
                  paddingLeft: 0,
                  margin: 0,
                  textAlign: 'left',
                  listStylePosition: 'inside',
                }}
              >
                <li
                  style={{
                    marginBottom: '4px',
                  }}
                >
                  <strong>AI Digital Interviewer Mode:</strong> A lifelike AI avatar conducts the interview for a more
                  immersive experience.
                </li>
                <li>
                  <strong>Standard Mode:</strong> A more lightweight format without the avatar, ideal for self-guided
                  practice while watching your own performance.
                </li>
              </ul>
            </div>
          </div>

          {/* 三种 Interview 模式容器，对应 mock-interview-bottom-container */}
          <div
            style={{
              backgroundColor: '#F7F7F7',
              borderRadius: '24px',
              padding: '32px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '56px',
              marginTop: '32px',
              marginBottom: '80px',
            }}
          >
            {/* AI Digital Interviewer */}
            <div
              style={{
                margin: 0,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '32px',
                }}
              >
                <div style={{ flex: '0 0 55%' }}>
                  <img
                    src="/img/crackinterview/AI Digital Interviewer.avif"
                    alt="AI Digital Interviewer"
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '12px',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      display: 'block',
                    }}
                  />
                </div>
                <div
                  style={{
                    flex: 1,
                    ...fontStyle,
                    ...textStyle.bodyReading,
                    color: '#171616',
                  }}
                >
                  <h4
                    style={{
                      ...fontStyle,
                      fontSize: '16px',
                      lineHeight: '22px',
                      fontWeight: 500,
                      margin: '0 0 6px 0',
                    }}
                  >
                    AI Digital Interviewer
                  </h4>
                  <p style={{ margin: 0 }}>
                    An AI-generated interviewer simulates a lifelike virtual recruiter, enhancing immersion and realism.
                    Questions are asked via voice and displayed with subtitles at the bottom, allowing users to practice
                    in a human-like scenario.
                  </p>
                </div>
              </div>
            </div>

            {/* Standard Mode */}
            <div
              style={{
                margin: 0,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '32px',
                }}
              >
                <div
                  style={{
                    flex: 1,
                    ...fontStyle,
                    ...textStyle.bodyReading,
                    color: '#171616',
                  }}
                >
                  <h4
                    style={{
                      ...fontStyle,
                      fontSize: '16px',
                      lineHeight: '22px',
                      fontWeight: 500,
                      margin: '0 0 6px 0',
                    }}
                  >
                    Standard Mode
                  </h4>
                  <p style={{ margin: 0 }}>
                    A simpler text-based interface where users can enable their webcam to observe body language in
                    real time. Conversation history is shown on the right panel so they can review the full flow and
                    self-reflect more easily.
                  </p>
                </div>
                <div style={{ flex: '0 0 55%' }}>
                  <img
                    src="/img/crackinterview/Standard Mode.avif"
                    alt="Standard Mode"
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '12px',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      display: 'block',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Code Mode */}
            <div
              style={{
                margin: 0,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '32px',
                }}
              >
                <div style={{ flex: '0 0 55%' }}>
                  <img
                    src="/img/crackinterview/Code Mode.avif"
                    alt="Code Mode"
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '12px',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      display: 'block',
                    }}
                  />
                </div>
                <div
                  style={{
                    flex: 1,
                    ...fontStyle,
                    ...textStyle.bodyReading,
                    color: '#171616',
                  }}
                >
                  <h4
                    style={{
                      ...fontStyle,
                      fontSize: '16px',
                      lineHeight: '22px',
                      fontWeight: 500,
                      margin: '0 0 6px 0',
                    }}
                  >
                    Code Mode
                  </h4>
                  <p style={{ margin: 0 }}>
                    Designed for technical roles, this mode presents real-time coding questions and provides a built-in
                    code editor. Users can type, run, and explain their logic while answering—mimicking real coding
                    interviews.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mock Interview result 模块 */}
          <div style={{ marginBottom: '40px' }}>
            <h3
              style={{
                ...fontStyle,
                fontSize: '22px',
                lineHeight: '30px',
                fontWeight: 400,
                color: '#171616',
                marginBottom: '12px',
              }}
            >
              Mock Interview result
            </h3>
            <p
              style={{
                ...fontStyle,
                ...textStyle.bodyReading,
                color: '#171616',
                maxWidth: '820px',
                marginBottom: '16px',
              }}
            >
              The Result page gives candidates a structured summary of their AI mock interview performance, making it
              easy to understand strengths, spot weaknesses, and decide what to practice next.
            </p>
            <div
              style={{
                width: '100%',
                margin: '0 auto',
              }}
            >
              <div
                style={{
                  backgroundColor: '#F7F7F7',
                  borderRadius: '24px',
                  padding: '24px',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img
                  src="/img/crackinterview/Mock Interview result.avif"
                  alt="Mock Interview result"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Job Pages 模块 */}
          <div>
            <h3
              style={{
                ...fontStyle,
                fontSize: '22px',
                lineHeight: '30px',
                fontWeight: 400,
                color: '#171616',
                marginBottom: '12px',
              }}
            >
              Job Pages
            </h3>
            <p
              style={{
                ...fontStyle,
                ...textStyle.bodyReading,
                color: '#171616',
                maxWidth: '820px',
                marginBottom: '16px',
              }}
            >
              The Job List page connects users with curated opportunities based on their profile. Each listing includes a
              clear match score so candidates can focus on roles that best fit their background.
            </p>
            <div
              style={{
                width: '100%',
                margin: '0 auto',
              }}
            >
              <div
                style={{
                  backgroundColor: '#F7F7F7',
                  borderRadius: '24px',
                  padding: '24px',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img
                  src="/img/crackinterview/Job Pages.avif"
                  alt="Job Pages"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Improvements (summary of card content) */}
      <section
        className="w-screen"
        style={{
          backgroundColor: '#F9FBFD',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '64px',
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
          <p
            style={{
              ...fontStyle,
              ...textStyle.bodyReading,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            To further enhance the platform&apos;s value for both job seekers and employers, we outlined several future
            directions:
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '24px',
            }}
          >
            {[
              {
                img: 'Future Improvements1.avif',
                title: 'Partner Job Integration + Report Sharing',
                desc: 'Allow candidates to share interview reports directly with employers to build trust and improve screening success rates.',
              },
              {
                img: 'Future Improvements2.avif',
                title: 'Talent Pool for Employers',
                desc: 'Create a centralized talent pool where employers can browse candidates along with performance data and highlights.',
              },
              {
                img: 'Future Improvements3.avif',
                title: 'AI Resume Matching + Auto-Apply',
                desc: 'Automatically match resumes to verified job openings and submit applications on behalf of the user.',
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  padding: '16px',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={`/img/crackinterview/${item.img}`}
                    alt={item.title}
                    style={{
                      width: '60%',
                      height: 'auto',
                      display: 'block',
                      borderRadius: '8px',
                    }}
                  />
                </div>
                <h3
                  style={{
                    ...fontStyle,
                    fontSize: '16px',
                    lineHeight: '22px',
                    fontWeight: 500,
                    color: '#171616',
                    marginBottom: '8px',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '14px',
                    lineHeight: '22px',
                    fontWeight: 300,
                    color: '#171616',
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

