import Link from 'next/link';
import type { WorkProject } from '@/lib/work-projects';

const fontDisplay: React.CSSProperties = { fontFamily: 'var(--font-fraunces)' };
const fontBody: React.CSSProperties = { fontFamily: 'var(--font-inter)' };

export default function WorkProjectRows({ items }: { items: WorkProject[] }) {
  return (
    <>
      {items.map((project, projectIndex) => (
        <Link
          key={project.title}
          href={project.href}
          className="mei-interactive-row group flex flex-col gap-2 py-6 first:pt-0"
          style={{ transitionDelay: `${projectIndex * 24}ms` }}
        >
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-[22px] text-[#0a0a0a] md:text-[24px]" style={fontDisplay}>
              {project.title}
            </h3>
            <span
              className="whitespace-nowrap text-[15px] font-light text-[#0a0a0a]/60 md:text-[18px]"
              style={fontBody}
            >
              {project.category}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#ed5b2b] px-3 py-1 text-[13px] text-white"
                style={fontBody}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 默认收起，hover 时展开项目图、时间和简介 */}
          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <div className="flex flex-col gap-5 pt-8 md:flex-row md:items-start md:gap-9">
                <div
                  className="h-[220px] w-full shrink-0 overflow-hidden md:h-[239px] md:w-[360px]"
                  style={{ background: project.imageBackground ?? '#cccccc' }}
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
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-5 pt-1 md:min-h-[194px]">
                  <p className="text-[15px] text-[#ed5b2b] md:text-[16px]" style={fontBody}>
                    {project.time}
                  </p>
                  <p className="text-[15px] font-light text-[#0a0a0a] md:text-[16px]" style={fontBody}>
                    {project.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
