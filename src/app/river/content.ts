// Copy and data for the RIVER° homepage. Section copy follows "Potfolio redesign.md".
// Nothing here invents metrics or outcomes.

import { productProjects, type WorkProject } from "@/lib/work-projects";

// Selected Work mirrors the current homepage: the same projects, in the same
// order, read straight from the site's project data so the two never drift apart.
// Titles, roles, descriptions and impact numbers are used as written there.
const FEATURED = ["Procurement Agent", "DEF Beauty ERP", "JobNova", "ConnectNova"];
const EXPERIMENTS = ["Mono", "MemQ", "SenseFlow", "Team HQ", "Milan Site Selection"];

export type RiverProject = {
  number: string;
  title: string;
  role: string;
  time: string;
  description: string;
  tags: string[];
  impact?: { value: string; label: string };
  image: string;
  imageAlt: string;
  href: string;
  external: boolean;
};

const pick = (titles: string[]): RiverProject[] =>
  titles
    .map((title) => productProjects.find((p) => p.title === title))
    .filter((p): p is WorkProject => !!p)
    .map((p, i) => ({
      number: String(i + 1).padStart(2, "0"),
      title: p.title,
      role: p.category,
      time: p.time,
      description: p.description,
      tags: p.tags,
      impact: p.impact,
      image: p.coverScreen ?? p.image,
      imageAlt: `${p.title} interface`,
      href: p.href,
      // case studies are pages of this site; everything else opens on its own
      external: !p.href.startsWith("/projects/"),
    }));

export const projects = pick(FEATURED);
export const experiments = pick(EXPERIMENTS);

export const contact = {
  email: "mei.chai@mail.polimi.it",
  linkedin: "https://www.linkedin.com/in/meichai/",
  github: "https://github.com/fancytree",
  cv: "/MeiChai_Product_Designer_Resume.pdf",
};

// Stages shown in the transition between Selected Work and About.
// Years, titles and employers follow the CV. `method` is a one-line reading of
// how the work got made at each stage: editorial copy, meant to be edited.
export type Stage = { short: string; years: string; role: string; place: string; body: string; method: string };

export const stages: Stage[] = [
  {
    short: "2017",
    years: "2017 – 2020",
    role: "UX Designer",
    place: "Sohu, Beijing",
    body: "Interaction and interface design for consumer products: the chat and feed modules of Huyou, and Moke, a tool that turns long-form posts into shareable images.",
    method: "Design, spec, hand off.",
  },
  {
    short: "2020",
    years: "2020 – 2022",
    role: "User Research Specialist",
    place: "Smart Walnut Education, Beijing",
    body: "Two years on the other side of the table: interviews, behavioural patterns, and turning what people actually do into decisions a product team can use.",
    method: "Listen, synthesise, frame the problem.",
  },
  {
    short: "2022",
    years: "2022 – 2025",
    role: "MSc, Digital and Interaction Design",
    place: "Politecnico di Milano",
    body: "A move to Milan and back to making. Research and design in the same pair of hands, with prototypes as the way to think.",
    method: "Prototype, test, iterate.",
  },
  {
    short: "2024",
    years: "2024 – 2026",
    role: "Founding Designer",
    place: "Liba Space, remote",
    body: "AI agents that people stay in control of: JobNova's job-search agent and ConnectNova's recruiting workflow, on a shared design system, designed and built in code.",
    method: "Design the system, ship it in code.",
  },
  {
    short: "Now",
    years: "2026 – now",
    role: "Freelance Product Designer",
    place: "Milan",
    body: "An ERP and a procurement agent for DEF Beauty, alongside MemQ and Mono: products taken from first conversation to shipped build with AI as a working partner.",
    method: "Describe, build, review.",
  },
];

// Mei's photograph, shown when the drawn portrait is hovered. A path under /public.
export const portraitPhoto: string | null = "/img/river/mei.png";
// The part of that photograph that lines up with the drawn bust, in source pixels:
// left edge, top edge (negative leaves headroom above her), and width. The height
// follows from the frame's 4:5 shape.
export const portraitCrop = { x: 162, y: -113, width: 755 };

// How she works: the methods from the previous homepage's Strategy section, each cut
// down to what it settles, one line on how, and the artifacts it left behind.
export const strategy = {
  methods: [
  {
    title: 'Workflow observation and interviews',
    settles: 'Which problem is worth solving',
    artifacts: [
      {
        src: '/img/strategy/method/interviews.webp',
        alt: 'Printed interview scripts spread across a desk, with handwritten notes in blue ink.',
        caption: 'Interview scripts with handwritten notes',
      },
      {
        src: '/img/strategy/method/affinity-map.webp',
        alt: 'Affinity board with five participant rows of notes clustered into themed columns.',
        caption: 'Affinity map across five participant interviews',
      },
    ],
    body: 'Interviews, workflow observation, and product behavior show where people get stuck.',
  },
  {
    title: 'Journey and service mapping',
    settles: 'Where the service breaks between people and systems',
    body: 'One picture of the whole chain: what a person does, what each system returns, and who picks up the next move.',
    artifacts: [
      {
        src: '/img/strategy/method/journey-map.webp',
        alt: 'User journey map with steps, actions, touchpoints, an emotion curve, and opportunities.',
        caption: 'User journey with emotion and opportunities',
      },
      {
        src: '/img/Clarity/User flow.svg',
        alt: 'Service map connecting a user, a tracking device, the app, a doctor, and the national health service.',
        caption: 'Service map across device, app, doctor, and health service',
      },
      {
        src: '/img/Milano Partecipa/Service Map.svg',
        alt: 'Service blueprint connecting citizens, an AI chatbot, city projects, the municipality, and partners.',
        caption: 'Service blueprint across citizens, city, and partners',
      },
    ],
  },
  {
    title: 'Human and AI responsibility mapping',
    settles: 'What the agent does, where a person decides',
    artifacts: [
      {
        src: '/img/strategy/method/human-handoff.webp',
        alt: 'Diagram: agent output, then a person reviews or dismisses, then product code saves the change.',
        caption: 'Where the agent stops and a person confirms',
      },
      {
        src: '/img/strategy/method/swimlane.webp',
        alt: 'Three-lane swimlane flow across end user, chat system, and support agent.',
        caption: 'Cross-role swimlane: user, system, support agent',
      },
    ],
    body: 'Decision points, states, and exceptions, mapped with product and engineering.',
  },
  {
    title: 'Design systems',
    settles: 'What gets reused instead of rebuilt',
    artifacts: [
      {
        src: '/img/strategy/method/design-system-jobnova.webp',
        alt: 'Design system board with colours, typography, spacing tokens, buttons, icons, and cards.',
        caption: 'Visual foundations and component vocabulary',
      },
      {
        src: '/img/strategy/method/design-system-def.webp',
        alt: 'Typography, semantic colours, spacing, and shape tokens taken from the ERP source.',
        caption: 'Typography, colour, spacing, and shape tokens',
      },
    ],
    body: 'Tokens, components, states, and usage rules, kept aligned between design and code.',
  },
  {
    title: 'Prototyping in Figma and code',
    settles: 'Whether people understand it before it ships',
    body: 'The workflow made tangible early, to test how people read a recommendation, change it, and recover.',
    artifacts: [
      {
        src: '/img/strategy/method/wireframes.webp',
        alt: 'Wireframe board connecting landing, sign-up, matching, and interview screens with flow arrows.',
        caption: 'Wireframe flow from sign-up to matching',
      },
      {
        src: '/img/strategy/method/user-test.webp',
        alt: 'A participant at a test table with the app on two phones, a feedback board, and a researcher taking notes.',
        caption: 'Testing the app in person, with a board for how it felt',
      },
    ],
  },
  {
    title: 'Behavioral evidence',
    settles: 'What to change next',
    artifacts: [],
    body: 'PostHog funnels, heatmaps, and session recordings show where people drop out.',
  },
  ],
};
