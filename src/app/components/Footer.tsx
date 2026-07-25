'use client';

// 页脚组件 —— 按 Figma node 27:892 实现：整版橘色，社交链接 + 回到顶部，
// "Let's work together" 大标题 + 徽章印章（黑底橙色弧形文字 + 信封图标），版权栏收尾。

import { ArrowRight, ArrowUp, Mail } from 'lucide-react';

const fontDisplay: React.CSSProperties = { fontFamily: 'var(--font-fraunces)' };
const fontBody: React.CSSProperties = { fontFamily: 'var(--font-inter)' };

const socialLinks = [
  { href: 'https://www.linkedin.com/in/meichai/', label: 'LinkedIn' },
  { href: 'mailto:mei.chai@mail.polimi.it', label: 'Email' },
  { href: 'https://github.com/fancytree', label: 'GitHub' },
  { href: '/about', label: 'Resume' },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="flex w-full flex-col items-center gap-10 bg-[#ed5b2b] px-6 py-3 sm:px-8 md:gap-16">
      {/* 顶部：社交链接 + 回到顶部 */}
      <div className="flex w-full items-center justify-between py-2">
        <p className="text-[12px] text-[#0a0a0a]" style={fontBody}>
          {socialLinks.map((link, i) => (
            <span key={link.label}>
              <a
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="hover:underline"
              >
                {link.label}
              </a>
              {i < socialLinks.length - 1 ? <span className="mx-1.5">/</span> : null}
            </span>
          ))}
        </p>
        <button
          type="button"
          onClick={scrollToTop}
          className="mei-back-to-top flex items-center justify-end gap-2 text-[16px] font-light text-[#070707]"
          style={fontBody}
        >
          <span className="mei-back-to-top-text whitespace-nowrap">Scroll to top</span>
          <span className="mei-back-to-top-icon-frame" aria-hidden="true">
            <ArrowUp size={17} strokeWidth={1.5} className="mei-back-to-top-icon" />
          </span>
        </button>
      </div>

      {/* 中部：Let's work together + 印章徽标 */}
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col items-start justify-between gap-10 sm:flex-row sm:items-end">
          <a href="mailto:mei.chai@mail.polimi.it" className="group flex items-center gap-3">
            <h2
              className="text-[40px] leading-[1.05] text-[#0a0a0a] sm:text-[56px] md:text-[72px]"
              style={fontDisplay}
            >
              Let&apos;s work together
            </h2>
            <ArrowRight
              size={40}
              strokeWidth={1.5}
              className="shrink-0 text-[#0a0a0a] transition-transform duration-300 group-hover:translate-x-2 md:size-[55px]"
            />
          </a>

          <a
            href="mailto:mei.chai@mail.polimi.it"
            aria-label="Email Mei"
            className="relative flex size-[140px] shrink-0 items-center justify-center self-center transition-transform duration-300 hover:scale-105 sm:size-[170px] md:size-[214px]"
          >
            <img src="/img/footer/reach-out-badge.svg" alt="" className="absolute inset-0 size-full" />
            <Mail size={28} strokeWidth={1.5} className="relative text-[#ed5b2b] md:size-8" />
          </a>
        </div>

        <div className="flex w-full items-end justify-center border-t border-[#0a0a0a] py-2">
          <p className="flex-1 text-[16px] text-[#0a0a0a]" style={fontBody}>
            © {new Date().getFullYear()} Mei Chai. Designed with intention.
          </p>
        </div>
      </div>
    </footer>
  );
}
