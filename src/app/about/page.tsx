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
    title: 'UX/UI designer',
    body: 'User-centered design focused on creating intuitive interfaces that solve real problems. From wireframes to high-fidelity prototypes, I craft experiences that balance aesthetics with functionality.',
  },
  {
    title: 'AI & Conversation designer',
    body: 'I design AI assistants that feel like part of the product, not a gimmick. I map conversations and connect large language models to real product data so people get clearer, faster answers.',
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
    href: 'mailto:flyskytoo@outlook.com',
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
          <p>Human-first, logic-driven product design for complex systems.</p>
        </header>

        <section className="mei-about-section">
          <p className="mei-section-kicker">Approach</p>
          <p className="mei-approach-statement">
            Explore my process of transforming <span>insights</span> into impact. Dive into stories of <span>user-centered</span> design where <span>strategic thinking</span> meets <span>technical precision</span>.
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
              I am a UX Designer focused on transforming complex logic into intuitive human experiences. My philosophy centers on user agency: I believe even the most sophisticated systems should feel like a natural extension of the user&apos;s intent.
            </p>
            <p>
              To ensure impact, I anchor my process in rigorous user research and functional validation. I treat design not as a visual layer, but as a system that must be refined through real-world feedback. By integrating a human-centered focus with rapid prototyping, I translate deep user insights into high-fidelity experiences that meet the highest standards of usability.
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
            I am always interested in collaborating on projects that demand rigorous user research and technical precision. From deep usability testing to responsive, code-based interfaces, I am ready to help bring product visions to life with a human-first approach.
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
