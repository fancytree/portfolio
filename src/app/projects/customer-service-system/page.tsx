import React from 'react';
import { fontFamily, textStyle } from '@/lib/design-tokens';

export default function CustomerServiceSystemPage() {
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
                color: 'rgb(0, 0, 0)',
                marginBottom: '20px',
              }}
            >
              Integrated Chat and Customer Service System
            </h1>
            <p
              style={{
                ...fontStyle,
                ...textStyle.leadSm,
                color: 'rgb(0, 0, 0)',
                maxWidth: '760px',
              }}
            >
              This system is a multi-role chat platform for regular users, promoters, and support agents. It enables
              real-time customer support and communication between promoters and their subordinates. An admin panel
              handles user roles, chat logs, and service workflows.
            </p>
          </div>

          {/* Meta */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              marginBottom: '40px',
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
                Product Designer · End-to-end Service
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
                2022 · 4 weeks
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
                Web platform · multi-role dashboards
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* My role (hidden for Other Works) */}
      {false && (
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
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)',
            gap: '40px',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <h2
              style={{
                ...fontStyle,
                ...textStyle.h3,
                color: '#171616',
                marginBottom: '24px',
              }}
            >
              My role
            </h2>
            <p
              style={{
                ...fontStyle,
                ...textStyle.bodyReading,
                color: '#171616',
                marginBottom: '24px',
              }}
            >
              As the lead UX designer, I was responsible for the full-cycle design of this integrated chat and customer
              service system from requirements analysis to wireframing, prototyping, and developer handoff.
            </p>
            <ol
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                counterReset: 'role-counter',
              }}
            >
              {[
                'Requirements Analysis: Worked closely with stakeholders to define core requirements for regular users, promoters, and support agents, identifying needs such as real-time messaging, multi-session handling, and role-based access.',
                'User Flow Design: Mapped distinct workflows for regular users, promoters, and support agents to ensure clarity and role-based logic.',
                'Wireframing & Prototyping: Created low- to high-fidelity wireframes for user-facing chat interfaces and backend dashboards.',
                'Interaction Design: Designed messaging interactions, session handling, and notification behaviors tailored to each role.',
                'Collaboration & Handoff: Partnered with developers on feasibility, and prepared detailed specs for smooth handoff.',
                'System Thinking: Helped structure platform logic between frontend clients, customer support backend, and admin console.',
              ].map((text, index) => (
                <li
                  key={index}
                  style={{
                    position: 'relative',
                    paddingLeft: '24px',
                    marginBottom: '16px',
                    ...fontStyle,
                    ...textStyle.bodyLight,
                    color: '#171616',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      ...fontStyle,
                      fontSize: '16px',
                      fontWeight: 300,
                    }}
                  >
                    {index + 1}.
                  </span>
                  {text}
                </li>
              ))}
            </ol>
          </div>

          {/* Right: key visual */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              position: 'sticky',
              top: '120px',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '420px',
                borderRadius: '16px',
              }}
            >
              <img
                src="/img/customer-service-system/customer-service-system.avif"
                alt="Customer Service System overview"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: '12px',
                }}
              />
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Requirements Analysis */}
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
              textAlign: 'center',
              color: '#171616',
              marginBottom: '32px',
            }}
          >
            Requirements Analysis
          </h2>
          <div
            style={{
              maxWidth: '920px',
              margin: '0 auto 40px auto',
            }}
          >
            <p
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '27px',
                fontWeight: 300,
                color: '#171616',
              }}
            >
              I worked closely with stakeholders to define core requirements for regular users, promoters, and support
              agents. Through interviews and workflow reviews, I identified key needs such as real-time messaging,
              multi-session handling, and role-based access. These insights shaped the user flows and laid the
              groundwork for a scalable and role-specific design solution.
            </p>
          </div>

          {/* User Role Map */}
          <div
            style={{
              maxWidth: '920px',
              margin: '0 auto',
              textAlign: 'left',
            }}
          >
            <h3
              style={{
                ...fontStyle,
                fontSize: '28px',
                lineHeight: '36px',
                fontWeight: 400,
                color: '#171616',
                textAlign: 'center',
                marginBottom: '24px',
              }}
            >
              User Role Map
            </h3>
            <p
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '27px',
                fontWeight: 300,
                color: '#171616',
                marginBottom: '24px',
              }}
            >
              To support diverse user types while maintaining clarity and operational efficiency, I designed a
              four-role map with clearly defined permissions and interaction boundaries:
            </p>
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
              <strong>End User:</strong> Can initiate support requests, describe issues, and provide feedback. Their
              access is intentionally limited to prevent exposure to affiliate or admin data.
            </p>
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
              <strong>Affiliate:</strong> Focused on managing downline communication, with tools to view engagement and
              conversation history per user. They operate independently of other affiliates.
            </p>
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
              <strong>Customer Support:</strong> Handles real-time queries, tags issues, and escalates when needed. To
              ensure service quality, they cannot independently end sessions or view affiliate relationships.
            </p>
            <p
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '27px',
                fontWeight: 300,
                color: '#171616',
                marginBottom: '24px',
              }}
            >
              <strong>Admin:</strong> Manages platform configuration, agent permissions, and performance monitoring.
              They have no direct involvement in user conversations to maintain role separation.
            </p>
            <p
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '27px',
                fontWeight: 300,
                color: '#171616',
                marginBottom: '32px',
              }}
            >
              This structure balances task relevance, information security, and workflow clarity, ensuring that each
              role has exactly what it needs—no more, no less.
            </p>
          </div>

          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              marginTop: '32px',
            }}
          >
            <div
              style={{
                padding: '24px',
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid rgba(0, 0, 0, 0.06)',
              }}
            >
              <img
                src="/img/customer-service-system/User Role Map.avif"
                alt="User role map"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: '16px',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* User Journey Maps */}
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
          <h2
            style={{
              ...fontStyle,
              fontSize: '32px',
              lineHeight: '40px',
              fontWeight: 300,
              textAlign: 'center',
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            User Journey Maps
          </h2>
          <div
            style={{
              maxWidth: '920px',
              margin: '0 auto 32px auto',
            }}
          >
            <p
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '27px',
                fontWeight: 300,
                color: '#171616',
              }}
            >
              To design a chat system that supports both platform users and customer support agents, I mapped out two
              parallel user journeys. This helped identify emotional pain points, system limitations, and key
              optimization opportunities across roles.
            </p>
          </div>

          {/* End User Journey */}
          <div
            style={{
              maxWidth: '1200px',
              margin: '40px auto',
            }}
          >
            <div
              style={{
                padding: '24px',
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                marginBottom: '32px',
              }}
            >
              <img
                src="/img/customer-service-system/End User Journey.avif"
                alt="End User Journey"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: '16px',
                }}
              />
            </div>

            <div
              style={{
                maxWidth: '920px',
                margin: '0 auto 32px auto',
              }}
            >
              <h3
                style={{
                  ...fontStyle,
                  fontSize: '24px',
                  lineHeight: '32px',
                  fontWeight: 400,
                  color: '#171616',
                  marginBottom: '16px',
                }}
              >
                End User Journey
              </h3>
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
                The end user&apos;s experience begins with uncertainty and often anxiety about getting help. By
                visualizing the entire journey—from chat initiation to resolution—I identified key friction points such
                as unclear entry points, long waiting times, and repetitive transfers.
              </p>
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
                Design proposals included more prominent help entry placement, wait-time indicators to manage
                expectations, clear session handoff with context preservation, and satisfaction feedback prompts to
                close the loop.
              </p>
            </div>

            <div
              style={{
                maxWidth: '920px',
                margin: '0 auto',
                paddingLeft: '24px',
                borderLeft: '4px solid #6444DC',
              }}
            >
              <p
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '27px',
                  fontWeight: 300,
                  color: '#171616',
                }}
              >
                Human-centered automation can balance speed and clarity, while small UX details like welcome messages or
                emoji-enhanced replies help reduce perceived support friction.
              </p>
            </div>
          </div>

          {/* Customer Support Journey */}
          <div
            style={{
              maxWidth: '1200px',
              margin: '40px auto',
            }}
          >
            <div
              style={{
                padding: '24px',
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                marginBottom: '32px',
              }}
            >
              <img
                src="/img/customer-service-system/Customer Support Journey.avif"
                alt="Customer Support Journey"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: '16px',
                }}
              />
            </div>

            <div
              style={{
                maxWidth: '920px',
                margin: '0 auto 32px auto',
              }}
            >
              <h3
                style={{
                  ...fontStyle,
                  fontSize: '24px',
                  lineHeight: '32px',
                  fontWeight: 400,
                  color: '#171616',
                  marginBottom: '16px',
                }}
              >
                Customer Support Journey
              </h3>
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
                For support agents, the journey is fast-paced and task-intensive. I mapped their workflow from receiving
                a session to either resolving or escalating it. Challenges included inconsistent context visibility,
                lack of smart reply tools, and uncertainty around session closure.
              </p>
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
                Design proposals included smart macros and template suggestions, auto-transfer with session context,
                canned replies synced with internal notes, and session-end signals triggered by user behavior.
              </p>
            </div>

            <div
              style={{
                maxWidth: '920px',
                margin: '0 auto',
                paddingLeft: '24px',
                borderLeft: '4px solid #6444DC',
              }}
            >
              <p
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '27px',
                  fontWeight: 300,
                  color: '#171616',
                }}
              >
                Empowering agents with the right tools—without overwhelming them—drives both efficiency and service
                quality. System automation should assist, not replace, human expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Admin System Scope Map */}
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
              textAlign: 'center',
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            Admin System Scope Map
          </h2>
          <div
            style={{
              maxWidth: '920px',
              margin: '0 auto 32px auto',
            }}
          >
            <p
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '27px',
                fontWeight: 300,
                color: '#171616',
              }}
            >
              To clarify the functional scope of the backend and ensure alignment with user roles and operational logic,
              I created a system architecture diagram centered on the Admin&apos;s responsibilities.
            </p>
          </div>

          <div
            style={{
              maxWidth: '1180px',
              margin: '0 auto',
            }}
          >
            <img
              src="/img/customer-service-system/Admin System Scope Map.avif"
              alt="Admin System Scope Map"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '24px',
              }}
            />
          </div>

          <div
            style={{
              maxWidth: '920px',
              margin: '32px auto 0 auto',
              paddingLeft: '24px',
              borderLeft: '4px solid #6444DC',
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
              This visual map helped define the three core functional domains of the admin console:
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
              <strong>Support Agent Management</strong> – Role setup, permissions, shift management<br />
              <strong>Customer Service Monitoring</strong> – Real-time visibility and KPI tracking<br />
              <strong>Customer Conversation Management</strong> – Standardization of chat behavior and automation logic
            </p>
            <p
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '27px',
                fontWeight: 300,
                color: '#171616',
                marginTop: '16px',
              }}
            >
              This architecture diagram served as a foundation for subsequent design phases, including information
              architecture, interface layout, and feature prioritization.
            </p>
          </div>
        </div>
      </section>

      {/* Design Process & Cross-role Flows */}
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
          <h2
            style={{
              ...fontStyle,
              fontSize: '32px',
              lineHeight: '40px',
              fontWeight: 300,
              textAlign: 'center',
              color: '#171616',
              marginBottom: '32px',
            }}
          >
            Design Process
          </h2>
          <div
            style={{
              maxWidth: '920px',
              margin: '0 auto',
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
              In the first iteration of this project, I focused on designing three core system interfaces: End User,
              Customer Support, and Admin. Each interface serves a distinct role within the support ecosystem, requiring
              tailored workflows, interaction models, and permission logic.
            </p>
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
              To ensure a scalable and role-specific experience, I mapped each role to its responsibilities and
              operational touchpoints. This role-based foundation shaped decisions from information architecture to
              interface prototyping.
            </p>
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
              This initial scope was defined based on system dependency mapping and priority user journeys identified
              during requirements analysis.
            </p>
          </div>

          <div
            style={{
              maxWidth: '920px',
              margin: '24px auto 0 auto',
              paddingLeft: '24px',
              borderLeft: '4px solid #6444DC',
            }}
          >
            <p
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '27px',
                fontWeight: 300,
                color: '#171616',
              }}
            >
              The Affiliate Chat Interface, which handles communications between affiliates and their downlines, is
              scheduled for a future iteration to maintain modular rollout and system clarity.
            </p>
          </div>

          {/* Cross-role Flows */}
          <div
            style={{
              marginTop: '56px',
            }}
          >
            <h3
              style={{
                ...fontStyle,
                fontSize: '28px',
                lineHeight: '36px',
                fontWeight: 400,
                textAlign: 'center',
                color: '#171616',
                marginBottom: '24px',
              }}
            >
              Cross-role User Flows: Swimlane Map
            </h3>
            <div
              style={{
                maxWidth: '920px',
                margin: '0 auto 32px auto',
              }}
            >
              <p
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '27px',
                  fontWeight: 300,
                  color: '#171616',
                }}
              >
                To visualize role-specific responsibilities and system logic across the customer service lifecycle, I
                used swimlane diagrams. These helped identify dependencies, clarify handoff rules, and inform
                permission-aware interface design for each user type.
              </p>
            </div>

            <div
              style={{
                maxWidth: '1200px',
                margin: '0 auto',
                overflow: 'hidden',
                borderRadius: '24px',
                border: '1px solid rgba(0, 0, 0, 0.06)',
              }}
            >
              <img
                src="/img/customer-service-system/Cross-role User Flows.avif"
                alt="Cross-role User Flows"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </div>
          </div>

          {/* End User – Mobile & Desktop / Customer Support - Desktop */}
          <div
            style={{
              marginTop: '56px',
            }}
          >
            <h3
              style={{
                ...fontStyle,
                fontSize: '28px',
                lineHeight: '36px',
                fontWeight: 400,
                textAlign: 'center',
                color: '#171616',
                marginBottom: '16px',
              }}
            >
              End User – Mobile &amp; Desktop
            </h3>
            <div
              style={{
                maxWidth: '920px',
                margin: '0 auto 24px auto',
              }}
            >
              <p
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '27px',
                  fontWeight: 300,
                  color: '#171616',
                }}
              >
                To support seamless access across platforms, I designed the End User interface with full responsiveness
                for both mobile and desktop. The goal was to make support feel immediate, reassuring, and human—regardless
                of device.
              </p>
            </div>
            <div
              style={{
                maxWidth: '1200px',
                margin: '0 auto',
              }}
            >
              <img
                src="/img/customer-service-system/End User – Mobile & Desktop.avif"
                alt="End User – Mobile & Desktop"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'contain',
                }}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: '56px',
            }}
          >
            <h3
              style={{
                ...fontStyle,
                fontSize: '28px',
                lineHeight: '36px',
                fontWeight: 400,
                textAlign: 'center',
                color: '#171616',
                marginBottom: '16px',
              }}
            >
              Customer Support – Desktop
            </h3>
            <div
              style={{
                maxWidth: '920px',
                margin: '0 auto 24px auto',
              }}
            >
              <p
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '27px',
                  fontWeight: 300,
                  color: '#171616',
                }}
              >
                The Customer Support interface was designed for speed, clarity, and control in a multi-tasking
                environment. Agents need to manage multiple live sessions, maintain context, and respond quickly—
                without losing track of priorities.
              </p>
            </div>
            <div
              style={{
                maxWidth: '1200px',
                margin: '0 auto',
              }}
            >
              <img
                src="/img/customer-service-system/Customer Support - Desktop.avif"
                alt="Customer Support - Desktop"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'contain',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion */}
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
              fontSize: '32px',
              lineHeight: '40px',
              fontWeight: 300,
              color: '#171616',
              marginBottom: '24px',
            }}
          >
            Conclusion
          </h2>
          <div
            style={{
              maxWidth: '920px',
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
              As the lead UX designer, I was responsible for the full-cycle design of this integrated chat and customer
              service system from requirements analysis to wireframing, prototyping, and developer handoff.
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
              My responsibilities included working closely with stakeholders to define core requirements, mapping
              distinct workflows for three user types, creating wireframes and prototypes, designing intuitive
              interactions, collaborating with developers, and helping structure the platform logic between frontend
              clients, customer support backend, and admin console.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}


