import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { WorkProject } from '@/lib/work-projects';

const fontDisplay: React.CSSProperties = { fontFamily: 'var(--font-inter)' };
const fontBody: React.CSSProperties = { fontFamily: 'var(--font-inter)' };

export default function WorkProjectRows({ items }: { items: WorkProject[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
      {items.map((project) => (
        <Link
          key={project.title}
          href={project.href}
          className="group flex flex-col gap-4"
          data-cursor="pill"
          data-cursor-label="View project"
        >
          <div
            className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl transition-transform duration-300 ease-out group-hover:-translate-y-1"
            style={{ background: project.imageBackground ?? '#f3f1ea' }}
          >
            <img
              src={project.image}
              alt=""
              className={`h-full w-full ${project.imageFit === 'contain' ? 'object-contain' : 'object-cover'}`}
              style={{
                objectPosition: 'center',
                transform: `translateY(${project.imageTranslateY ?? '0'}) scale(${project.imageScale ?? 1})`,
                transformOrigin: project.imageTranslateY ? 'center top' : 'center',
              }}
            />
            <span className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-white/90 text-[#0a0a0a] shadow-sm backdrop-blur transition-transform duration-300 ease-out group-hover:rotate-45">
              <ArrowUpRight size={18} strokeWidth={1.75} />
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <h3 className="text-[18px] text-[#0a0a0a] md:text-[20px]" style={fontDisplay}>
                {project.title}
              </h3>
              <div className="flex flex-wrap items-center justify-end gap-2">
                {project.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-[#ed5b2b] px-1.5 py-0.5 text-[10px] text-white"
                    style={fontBody}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <p className="line-clamp-2 text-[14px] leading-snug font-light text-[#0a0a0a]/70 md:text-[15px]" style={fontBody}>
              {project.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
