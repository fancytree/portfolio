const workSections = [
  {
    id: 'designer-page',
    title: 'Designer',
    subtitle: 'Product strategy, UX systems, and interface craft.',
    projects: [
      {
        title: 'ConnectNova',
        description: 'AI-powered recruiting workflow for ranking LinkedIn candidates quickly, with a Chrome extension and web dashboard.',
        image: '/img/Connectnova.avif',
        href: '/projects/connectnova',
      },
      {
        title: 'Jobnova',
        description: 'AI-native career ecosystem for tailored job discovery and personalized application workflows.',
        image: '/img/Jobnova.avif',
        href: '/projects/jobnova',
      },
      {
        title: 'MemQ',
        description: 'Mobile learning app for capturing knowledge, generating quizzes, and building durable memory.',
        image: '/img/MemQ.avif',
        href: '/projects/memq',
      },
      {
        title: 'Beikemama',
        description: 'Live parenting community for pregnant women and young families, combining expert Q&A and social support.',
        image: '/img/Beikemama.avif',
        href: '/projects/beikemama',
      },
    ],
  },
  {
    id: 'researcher-page',
    title: 'Researcher',
    subtitle: 'Discovery, validation, service mapping, and civic systems.',
    projects: [
      {
        title: 'Milano Partecipa',
        description: 'Civic participation service research for improving daily access, awareness, and community engagement.',
        image: '/img/Milano%20Partecipa.avif',
        href: '/projects/milano-partecipa',
      },
      {
        title: 'Clarity',
        description: 'Digital health product work for menopause symptom tracking, insights, and healthcare communication.',
        image: '/img/Clarity.avif',
        href: '/projects/clarity',
      },
    ],
  },
  {
    id: 'ai-builder-page',
    title: 'AI Builder',
    subtitle: 'Agentic UX, generative UI, and LLM-connected product systems.',
    projects: [
      {
        title: 'Mono',
        description: 'Intent-driven generative UI financial agent that turns natural language into structured interface states.',
        image: '/img/mono_cover.avif',
        href: '/projects/mono',
      },
      {
        title: 'CrackInterview.AI',
        description: 'AI mock interview platform with structured feedback loops for technical candidates.',
        image: '/img/CrackInterview_cover.avif',
        href: '/projects/crackinterview',
      },
    ],
  },
  {
    id: 'creative-coder-page',
    title: 'Creative Coder',
    subtitle: 'Code-based prototypes, systems thinking, and interaction experiments.',
    projects: [
      {
        title: 'Customer Service System',
        description: 'Multi-role chat and support workflows for users, promoters, support teams, and admins.',
        image: '/img/customer-service-system_cover.avif',
        href: '/projects/customer-service-system',
      },
      {
        title: 'This Portfolio',
        description: 'A living interface experiment blending reference-driven motion, interaction, and portfolio storytelling.',
        image: '/meiwave.gif',
        href: '/',
      },
    ],
  },
];

export default function WorksPage() {
  return (
    <section
      className="mei-works-page w-screen"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
      }}
    >
      <header className="mei-works-header">
        <h1>Works</h1>
        <p>Case studies, experiments, and systems grouped by the roles from the opening scene.</p>
      </header>

      <div className="mei-work-details-stack">
        {workSections.map((section, index) => (
          <details key={section.id} id={section.id} className="mei-work-details" open={index === 0}>
            <summary className="mei-work-summary">
              <span>{section.title}</span>
              <small>{section.subtitle}</small>
            </summary>
            <div className="mei-work-section-content">
              <ul className="mei-project-list">
                {section.projects.map((project) => (
                  <li className="mei-project-card" key={project.title}>
                    <a href={project.href} className="mei-project-card-link">
                      <div className="mei-project-image">
                        <img src={project.image} alt="" />
                      </div>
                      <div className="mei-project-info">
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                        <span className="mei-project-link">Read More</span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
