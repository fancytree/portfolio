// Resume co-editing v2: sample content (a fictional candidate). The original drawer
// (src/app/jobs/detail/ResumeDrawer.tsx) and the original demo (../jobnova-resume) are untouched.

export type Author = 'original' | 'ai' | 'you'

export type Block = {
  id: string
  group: 'profile' | 'skills' | 'experience' | 'projects' | 'education' | 'extra'
  /** What the person's own resume said */
  original: string
  /** The AI's rewrite, shown in place with its new words marked */
  suggestion?: string
}

const b = (id: string, group: Block['group'], original: string, suggestion?: string): Block => ({ id, group, original, suggestion })

export const BLOCKS: Block[] = [
  b('profile', 'profile',
    'Designer with experience across web and mobile projects. Worked with different teams on products for customers. Strong communicator who likes solving problems and is looking for a new role.',
    'UX designer with 6 years shipping web and mobile products, from research to production UI. Partners with engineering and product to turn user research into measurable gains, and builds the design systems that keep teams consistent.'),

  b('skills', 'skills',
    'Figma, Photoshop, HTML, CSS, JavaScript, user research, wireframing and prototyping.',
    'Figma, Design Systems, Prototyping, Usability Testing, Accessibility (WCAG), HTML/CSS, A/B Testing.'),
  b('tools', 'skills',
    'Tools: Figma, Miro, Jira, Notion, Photoshop, Illustrator.',
    'Tools: Figma (variables, auto layout), FigJam, Maze, Hotjar, Jira, Notion, Storybook.'),

  // Experience 1
  b('e1', 'experience',
    'Responsible for designing screens for an internal app used by the operations team.',
    'Lead Interaction Designer for a maintenance platform used by 3,000 field engineers, owning research through visual design.'),
  b('e1b1', 'experience',
    'Worked on the design of an internal maintenance app for the operations team.',
    'Redesigned the maintenance workflow after 12 field interviews, cutting task errors by 32%.'),
  b('e1b2', 'experience',
    'Helped the team with user research, wireframes and prototypes for new features.',
    'Led prototyping and usability testing that lifted task completion from 61% to 89%.'),
  b('e1b3', 'experience',
    'Did design QA before releases.',
    'Introduced a design QA checklist that cut visual defects in release builds by 55%.'),
  b('e1b4', 'experience',
    'Supported developers when they had questions about the designs.',
    'Ran weekly design and engineering reviews, reducing rework requests from developers by a third.'),

  // Experience 2
  b('e2', 'experience',
    'Worked on website and app features together with the product team.',
    'Owned checkout and onboarding for a consumer app with 2M monthly users, partnering with product and engineering.'),
  b('e2b1', 'experience',
    'Made mockups and presented them in team meetings.',
    'Shipped a redesigned onboarding flow that raised week-one activation by 18%.'),
  b('e2b2', 'experience',
    'Fixed design issues reported by users.',
    'Built a component library adopted by 6 squads, cutting design-to-dev handoff time by 40%.'),
  b('e2b3', 'experience',
    'Worked on the checkout pages.',
    'Simplified checkout from five steps to three, lowering cart abandonment by 11% in an A/B test.'),
  b('e2b4', 'experience',
    'Helped junior designers.',
    'Mentored two junior designers and ran weekly design critiques across the product team.'),

  // Experience 3
  b('e3', 'experience',
    'Designed pages for a software company.',
    'Designed responsive web experiences for a B2B analytics platform used by 400 enterprise customers.'),
  b('e3b1', 'experience',
    'Made dashboards and reports look better.',
    'Redesigned the reporting dashboard around the five questions customers asked most, halving support tickets about reports.'),
  b('e3b2', 'experience',
    'Created icons and visual assets.',
    'Introduced design tokens and a Figma-to-code workflow that halved front-end rework.'),
  b('e3b3', 'experience',
    'Checked designs for colour contrast.',
    'Audited the product for accessibility and fixed 120+ WCAG AA issues across core flows.'),

  // Experience 4
  b('e4', 'experience',
    'Internship in a design agency.',
    'Design intern at a digital agency, working on websites and campaigns for retail and hospitality clients.'),
  b('e4b1', 'experience',
    'Made website layouts and banners.',
    'Designed landing pages for 8 client campaigns, from wireframes to handoff.'),
  b('e4b2', 'experience',
    'Took part in client meetings.',
    'Presented concepts in client reviews and turned feedback into revised prototypes within a day.'),

  // Projects
  b('p1', 'projects',
    'A mobile app for booking sports courts, made as a side project.',
    'CourtBook: a side project for booking sports courts. Interviewed 15 players, tested three prototypes, and reached 900 users in the first season.'),
  b('p2', 'projects',
    'Redesign concept for a public transport app.',
    'Transit redesign concept: mapped the journey of daily commuters and tested a live-arrival view with 10 riders.'),

  // Education
  b('ed1', 'education', 'Thesis on voice interfaces for older adults. GPA 3.7.'),
  b('ed2', 'education', 'Coursework: Visual Communication, Typography, Interaction Design.'),

  // Certifications, languages
  b('cert', 'extra',
    'Google UX Design Certificate. Nielsen Norman course.',
    'Google UX Design Certificate (2022) · NN/g UX Certification, Interaction Design specialty (2023).'),
  b('lang', 'extra', 'Languages: Italian (native), English (fluent), Spanish (intermediate).'),
]

export const EXPERIENCE: { company: string; dates: string; title: string; place: string; intro: string; bullets: string[] }[] = [
  { company: 'Fieldwise', dates: 'Nov 2024 - Present', title: 'Lead Interaction Designer', place: 'Remote', intro: 'e1', bullets: ['e1b1', 'e1b2', 'e1b3', 'e1b4'] },
  { company: 'Lumo', dates: 'Mar 2021 - Oct 2024', title: 'Product Designer', place: 'Milan, Italy', intro: 'e2', bullets: ['e2b1', 'e2b2', 'e2b3', 'e2b4'] },
  { company: 'Metrica', dates: 'Jun 2019 - Feb 2021', title: 'UX/UI Designer', place: 'Turin, Italy', intro: 'e3', bullets: ['e3b1', 'e3b2', 'e3b3'] },
  { company: 'Studio Nove', dates: 'Sep 2018 - May 2019', title: 'Design Intern', place: 'Milan, Italy', intro: 'e4', bullets: ['e4b1', 'e4b2'] },
]

export const PROJECTS: { name: string; dates: string; text: string }[] = [
  { name: 'CourtBook', dates: '2023', text: 'p1' },
  { name: 'Transit redesign', dates: '2022', text: 'p2' },
]

export const EDUCATION: { school: string; dates: string; degree: string; place: string; text: string }[] = [
  { school: 'Politecnico di Milano', dates: '2017 - 2019', degree: 'MSc, Digital and Interaction Design', place: 'Milan, Italy', text: 'ed1' },
  { school: 'Università IUAV di Venezia', dates: '2014 - 2017', degree: 'BA, Communication Design', place: 'Venice, Italy', text: 'ed2' },
]

export const PERSON = { name: 'Alex Moretti', contact: 'Milan, Italy | (+39) 123 456 789 | alex.moretti@example.com | alexmoretti.design' }

export const GROUPS: { id: Block['group']; title: string; summary: string }[] = [
  { id: 'profile', title: 'Profile rewritten for this role', summary: 'Leads with UX and work with engineering, as the posting does.' },
  { id: 'skills', title: 'Skills matched to the job description', summary: 'Adds the posting’s terms. JavaScript was dropped by mistake: the ATS check catches it.' },
  { id: 'experience', title: 'Experience rewritten as results', summary: 'Each bullet now says what changed and by how much.' },
]

/** Keywords taken from the job description, and how to find them in the resume */
export const KEYWORDS: { label: string; test: RegExp }[] = [
  { label: 'UX design', test: /\bux design/i },
  { label: 'Prototyping', test: /prototyp/i },
  { label: 'Usability testing', test: /usability test/i },
  { label: 'Design systems', test: /design system|component library/i },
  { label: 'Accessibility', test: /accessibility|wcag/i },
  { label: 'HTML/CSS', test: /\bhtml\b/i },
  { label: 'A/B testing', test: /a\/b test/i },
  { label: 'JavaScript', test: /javascript/i },
  { label: 'React', test: /\breact\b/i },
  { label: 'Python', test: /\bpython\b/i },
]

export const JOB = { title: 'UI/UX Developer', company: 'Kforce' }
