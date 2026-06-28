'use client';

// 顶部导航栏组件 —— 按 Figma node 680:966 实现：图标 + 标签胶囊，当前页为深色激活态。

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const navLinks: { href: string; label: string; icon: string }[] = [
  { href: '/', label: 'Home', icon: '/home.svg' },
  { href: '/not-daily-fun', label: 'Not daily fun', icon: '/fun.svg' },
  { href: '/about', label: 'Resume', icon: '/resume.svg' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setMenuOpen(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="fixed w-full top-0 z-50">
      {/* 背景层 */}
      <div className="absolute inset-0 -z-10" style={{ background: 'rgba(255, 255, 255, 0.88)', backdropFilter: 'blur(14px)' }} />

      {/* 导航栏主体 */}
      <nav
        className="relative z-10 flex w-full items-center justify-center"
        style={{
          height: 'clamp(60px, 10vh, 80px)',
          padding: 'clamp(0.5rem, 2vh, 1rem) 0',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="mei-logo-link"
          style={{
            textDecoration: 'none',
            position: 'absolute',
            left: 'clamp(0.5rem, 1vw, 2vw)',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
          onClick={closeMenu}
          aria-label="Mei portfolio home"
        >
          <Image src="/logo.gif" alt="" width={80} height={40} className="mei-logo-img" unoptimized />
        </Link>

        {/* 桌面端链接 —— gap 24px（Figma） */}
        <div className="hidden md:flex items-center justify-center" style={{ gap: '24px' }}>
          {navLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`mei-nav-pill${isActive(href) ? ' is-active' : ''}`}
              aria-current={isActive(href) ? 'page' : undefined}
            >
              <img src={icon} alt="" width={20} height={20} className="mei-nav-ico" />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* 移动端汉堡按钮 */}
        <button
          className="absolute right-4 md:hidden flex flex-col justify-center items-center gap-1.5"
          style={{
            height: 'clamp(48px, 9vw, 64px)',
            width: 'clamp(48px, 9vw, 64px)',
          }}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span
            style={{
              display: 'block',
              width: '22px',
              height: '2px',
              backgroundColor: '#222222',
              borderRadius: '2px',
              transition: 'transform 0.3s ease, opacity 0.3s ease',
              transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none',
            }}
          />
          <span
            style={{
              display: 'block',
              width: '22px',
              height: '2px',
              backgroundColor: '#222222',
              borderRadius: '2px',
              transition: 'opacity 0.3s ease',
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              display: 'block',
              width: '22px',
              height: '2px',
              backgroundColor: '#222222',
              borderRadius: '2px',
              transition: 'transform 0.3s ease, opacity 0.3s ease',
              transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
            }}
          />
        </button>
      </nav>

      {/* 移动端下拉菜单 */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: menuOpen ? '240px' : '0px',
          backgroundColor: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(16px)',
          borderBottom: '2px solid #222222',
        }}
      >
        <div className="flex flex-col px-6 pb-6 pt-3 gap-3 items-start">
          {navLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              className={`mei-nav-pill${isActive(href) ? ' is-active' : ''}`}
              aria-current={isActive(href) ? 'page' : undefined}
            >
              <img src={icon} alt="" width={20} height={20} className="mei-nav-ico" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
