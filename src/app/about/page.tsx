import Image from 'next/image';

const skillColumns = [
  {
    title: 'Strategy & Research',
    items: ['User Research', 'Data Analysis', 'Usability Testing', 'Information Architecture', 'Content Design'],
  },
  {
    title: 'UX/UI Design',
    items: ['Interaction Design', 'Design Systems', 'Wireframing', 'Prototyping', 'Accessibility (WCAG)'],
  },
  {
    title: 'Tech & Specialized',
    items: ['Agentic Design', 'Conversational UX', 'AR/VR', 'Rapid Prototyping (Vibe Coding, MCP)'],
  },
  {
    title: 'Tools',
    items: ['Figma', 'ProtoPie', 'Adobe Creative Suite', 'Dify & Coze', 'ComfyUI'],
  },
];

const capabilities = [
  {
    title: 'AI product design',
    body: 'I shape AI-powered workflows from research and product strategy to interaction design, design systems, and working prototypes people can trust.',
  },
  {
    title: 'Research to shipped prototypes',
    body: 'I translate interviews, behavioral patterns, and messy product logic into clear flows, testable interfaces, and code-based prototypes.',
  },
];

const tools = [
  'Figma',
  'ProtoPie',
  'Maze',
  'Miro',
  'Dify & Coze',
  'Python',
  'Supabase',
  'Principle',
  'HTML/CSS',
  'Design Systems',
  'ComfyUI',
  'Arduino',
  'TouchDesigner',
  'GitHub',
  'Unity',
];

const contactLinks = [
  {
    title: 'Email',
    body: 'Send a message',
    href: 'mailto:mei.chai@mail.polimi.it',
    icon: '/Mail.svg',
  },
  {
    title: 'LinkedIn',
    body: 'Contact',
    href: 'https://www.linkedin.com/in/meichai/',
    icon: '/LinkedIN.svg',
  },
  {
    title: 'GitHub',
    body: 'Check my profile',
    href: 'https://github.com/fancytree',
    icon: '/Github.svg',
  },
];

export default function AboutPage() {
  return (
    <section
      className="mei-tab-page mei-about-page w-screen"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
      }}
    >
      <div className="mei-tab-container">
        <header className="mei-tab-header">
          <h1>About</h1>
          <p>AI product designer focused on making complex systems understandable, trustworthy, and ready to ship.</p>
        </header>

        <section className="mei-about-section">
          <p className="mei-section-kicker">Approach</p>
          <p className="mei-approach-statement">
            I work where <span>research</span>, product logic, and implementation meet, turning ambiguous AI workflows into interfaces that feel calm, legible, and useful.
          </p>
        </section>

        <section className="mei-about-section">
          <p className="mei-section-kicker">What I Do</p>
          <div className="mei-capability-list">
            {capabilities.map((capability) => (
              <article className="mei-capability-item" key={capability.title}>
                <h2>{capability.title}</h2>
                <p>{capability.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mei-about-section">
          <p className="mei-section-kicker">Tools & Technologies</p>
          <div className="mei-tool-cloud">
            {tools.map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </div>
        </section>

        <section className="mei-about-section">
          <p className="mei-section-kicker">About</p>
          <div className="mei-about-copy">
            <p>
              I design AI-powered product experiences from research to working prototypes, turning complex systems into interfaces people can understand, trust, and use.
            </p>
            <p>
              My work spans founding design for Nova AI products, independent iOS product development, and UX research for education, community, and decision-making systems.
            </p>
          </div>

          <div className="mei-about-grid">
            {skillColumns.map((column) => (
              <section className="mei-about-column" key={column.title}>
                <h2>{column.title}</h2>
                <ul>
                  {column.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>

        <section className="mei-about-section">
          <p className="mei-section-kicker">Get in Touch</p>
          <p className="mei-contact-copy">
            Open to thoughtful chats about AI products, UX strategy, prototyping, and work that needs both product judgment and hands-on making.
          </p>

          <div className="mei-contact-grid">
            {contactLinks.map((link) => (
              <a
                className="mei-contact-card"
                href={link.href}
                key={link.title}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                <span className="mei-contact-icon" aria-hidden="true">
                  <Image src={link.icon} alt="" width={22} height={22} />
                </span>
                <span className="mei-contact-card-copy">
                  <span>{link.title}</span>
                  <strong>{link.body}</strong>
                </span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
