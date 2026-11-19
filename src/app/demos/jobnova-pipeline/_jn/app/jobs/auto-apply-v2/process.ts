// What Auto Apply does while an application is "In process", step by step, and what it has
// prepared for it. Sample content: deterministic per job so the demo is stable.

export type ProcStep = { key: string; label: string; short: string; detail: (c: Ctx) => string }
type Ctx = { company: string; title: string; ats: string }

export const STEPS: ProcStep[] = [
  { key: 'prepare', label: 'Prepared your materials', short: 'Preparing materials', detail: () => 'Tailored the resume and wrote a cover letter for this role.' },
  { key: 'open', label: 'Opened the application form', short: 'Opening the form', detail: c => `Found the form on ${c.ats} and checked which fields it asks for.` },
  { key: 'profile', label: 'Filled in your profile', short: 'Filling in your profile', detail: () => 'Name, contact details, location and work history, from your JobNova profile.' },
  { key: 'questions', label: 'Answered screening questions', short: 'Answering questions', detail: () => 'Work authorization, years of experience, and one written answer.' },
  { key: 'attach', label: 'Attached resume and cover letter', short: 'Attaching documents', detail: () => 'Uploaded the tailored resume and the cover letter as PDFs.' },
  { key: 'submit', label: 'Review and submit', short: 'Reviewing and submitting', detail: c => `Checks every field, then submits to ${c.company}.` },
]

const ATS = ['Greenhouse', 'Lever', 'Workday', 'Ashby']
export const atsFor = (id: number) => ATS[id % ATS.length]
/** Where each in-process application starts in the demo, so the column shows a spread */
const START: Record<number, number> = { 4: 2, 5: 0, 15: 4, 16: 1, 17: 3, 18: 5 }
export const startStep = (id: number) => START[id] ?? id % STEPS.length

export type Answer = { q: string; a: string; source: 'profile' | 'nova' }
export function answersFor(company: string, title: string): Answer[] {
  return [
    { q: 'Are you authorized to work in the United States?', a: 'Yes', source: 'profile' },
    { q: 'Will you now or in the future require sponsorship?', a: 'No', source: 'profile' },
    { q: 'Years of relevant experience', a: '6', source: 'profile' },
    { q: `Why do you want to join ${company}?`, a: `I’ve used ${company}’s product for years, and the ${title} role sits where I do my best work: turning research into shipped UI with engineers.`, source: 'nova' },
  ]
}

export const PROFILE_FIELDS = [
  ['Name', 'Alex Moretti'],
  ['Email', 'alex.moretti@example.com'],
  ['Phone', '+39 123 456 789'],
  ['Location', 'Milan, Italy'],
  ['LinkedIn', 'linkedin.com/in/alexmoretti'],
] as const

/** Why an application stopped, at which step, and the fix that lets Auto Apply carry on */
export type Failure = {
  step: number
  reason: string
  fix: { label: string; done: string; field?: { label: string; placeholder: string } }
}
// The two real causes: information only the person can give, and a human check (CAPTCHA) Auto Apply must not pass for them
export const FAILURES: Record<number, Failure> = {
  8: { step: 1, reason: 'The site asked for a human check (CAPTCHA). Auto Apply won’t answer it for you.', fix: { label: 'Do the check, then continue', done: 'Check passed. Auto Apply carried on.' } },
  24: { step: 3, reason: 'One required question isn’t in your profile: “Desired salary (USD)”.', fix: { label: 'Answer and retry', done: 'Answer saved to your profile. Auto Apply carried on.', field: { label: 'Desired salary (USD)', placeholder: 'e.g. 140,000' } } },
  25: { step: 3, reason: 'One required question isn’t in your profile: “Notice period”.', fix: { label: 'Answer and retry', done: 'Answer saved to your profile. Auto Apply carried on.', field: { label: 'Notice period', placeholder: 'e.g. 4 weeks' } } },
  26: { step: 5, reason: 'The site asked for a human check (CAPTCHA) before submitting.', fix: { label: 'Do the check, then submit', done: 'Check passed. Submitting.' } },
}
