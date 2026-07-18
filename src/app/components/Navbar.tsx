'use client';

// 顶部导航栏组件 —— Logo + 词标，右侧大写文字链接，透明磨砂背景。

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks: { href: string; label: string; target?: '_blank' }[] = [
  { href: '/#work', label: 'Work' },
  { href: '/#strategy', label: 'Strategy' },
  { href: '/#about', label: 'About me' },
  { href: '/MeiChai_Product%20designer.pdf', label: 'Resume', target: '_blank' },
];

const fontBody: React.CSSProperties = { fontFamily: 'var(--font-inter)' };

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setMenuOpen(false);

  const isActive = (href: string) => {
    if (href.includes('#')) return false;
    return href === '/' ? pathname === '/' : pathname.startsWith(href);
  };

  // next/link 在同页跳转到 hash 时不会触发滚动，已在当前页时手动 scrollIntoView。
  const handleNavClick = (href: string) => (e: React.MouseEvent) => {
    closeMenu();
    const [path, hash] = href.split('#');
    if (!hash || pathname !== (path || '/')) return;
    const target = document.getElementById(hash);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: 'smooth' });
    history.replaceState(null, '', href);
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-white/20 backdrop-blur-md">
      <nav className="flex h-12 w-full items-center justify-between px-6 sm:px-8">
        {/* Logo */}
        <Link href="/" className="mei-logo-link flex items-center gap-2" onClick={closeMenu} aria-label="Mei portfolio home">
          <img src="/logo.gif" alt="" width={33} height={20} className="mei-logo-img" style={{ height: '20px', width: 'auto' }} />
          <span className="text-[16px] text-[#0a0a0a]" style={fontBody}>
            MEI CHAI
          </span>
        </Link>

        {/* 桌面端链接 */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ href, label, target }) => (
            <Link
              key={label}
              href={href}
              target={target}
              rel={target ? 'noopener noreferrer' : undefined}
              onClick={handleNavClick(href)}
              className="relative text-[13px] text-[#0a0a0a] uppercase transition-opacity hover:opacity-60"
              style={{ ...fontBody, opacity: isActive(href) ? 1 : 0.75 }}
              aria-current={isActive(href) ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* 移动端汉堡按钮 */}
        <button
          className="flex h-9 w-9 flex-col items-center justify-center gap-1 md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span
            style={{
              display: 'block',
              width: '18px',
              height: '2px',
              backgroundColor: '#0a0a0a',
              borderRadius: '2px',
              transition: 'transform 0.3s ease, opacity 0.3s ease',
              transform: menuOpen ? 'translateY(5px) rotate(45deg)' : 'none',
            }}
          />
          <span
            style={{
              display: 'block',
              width: '18px',
              height: '2px',
              backgroundColor: '#0a0a0a',
              borderRadius: '2px',
              transition: 'opacity 0.3s ease',
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              display: 'block',
              width: '18px',
              height: '2px',
              backgroundColor: '#0a0a0a',
              borderRadius: '2px',
              transition: 'transform 0.3s ease, opacity 0.3s ease',
              transform: menuOpen ? 'translateY(-5px) rotate(-45deg)' : 'none',
            }}
          />
        </button>
      </nav>

      {/* 移动端下拉菜单 */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out md:hidden"
        style={{
          maxHeight: menuOpen ? '240px' : '0px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex flex-col items-start gap-4 px-6 py-5">
          {navLinks.map(({ href, label, target }) => (
            <Link
              key={label}
              href={href}
              target={target}
              rel={target ? 'noopener noreferrer' : undefined}
              onClick={handleNavClick(href)}
              className="text-[14px] text-[#0a0a0a] uppercase"
              style={{ ...fontBody, opacity: isActive(href) ? 1 : 0.75 }}
              aria-current={isActive(href) ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
