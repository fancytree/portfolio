import Link from 'next/link';
import CaseStudyBackButton from '../components/CaseStudyBackButton';
import WorkProjectRows from '../components/WorkProjectRows';
import { allWorkGroups } from '@/lib/work-projects';

export const metadata = {
  title: 'Work — Mei Chai',
};

const fontDisplay: React.CSSProperties = { fontFamily: 'var(--font-fraunces)' };
const fontBody: React.CSSProperties = { fontFamily: 'var(--font-inter)' };

export default function WorksPage() {
  return (
    <section className="flex w-full flex-col items-center bg-white px-6 pb-16 sm:px-10 md:px-16 md:pb-24">
      <div className="w-full max-w-[1200px]">
        <div className="flex flex-col gap-6 border-b border-[#cccccc] py-12 md:flex-row md:items-end md:justify-between md:py-16">
          <div className="flex flex-col gap-6">
            <CaseStudyBackButton />
            <h1 className="m-0 text-[56px] leading-none md:text-[80px]" style={fontDisplay}>
              All works
            </h1>
          </div>
          <p className="m-0 max-w-[520px] text-[16px] font-light text-[#0a0a0a] md:text-[20px]" style={fontBody}>
            The full set of product and research case studies, including projects not shown on the homepage.
          </p>
        </div>

        <div className="flex flex-col gap-16 pt-16 md:gap-24">
          {allWorkGroups.map((group) => (
            <div key={group.label} className="flex flex-col gap-6 md:flex-row md:gap-16">
              <p className="w-full shrink-0 text-[22px] text-[#0a0a0a] md:w-[140px] md:text-[32px]" style={fontBody}>
                {group.label}
              </p>
              <div className="flex-1 divide-y divide-[#cccccc]">
                <WorkProjectRows items={group.items} />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-16">
          <Link href="/#work" className="text-[14px] font-light text-[#0a0a0a]/60" style={fontBody}>
            ← Back to selected work
          </Link>
        </div>
      </div>
    </section>
  );
}
