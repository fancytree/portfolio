'use client';

// 顶部导航栏组件
// 使用方法：在布局组件或页面中直接使用 <Navbar /> 渲染导航栏

import { useState } from 'react';
import Link from "next/link";
import Image from "next/image";

const navFontStyle = {
  fontFamily: 'interstate-mono, var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace',
};

const navLinks = [
  { href: '/works', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

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
          }}
          onClick={closeMenu}
          aria-label="Mei portfolio home"
        >
          <Image src="/logo.gif" alt="" width={96} height={48} className="mei-logo-img" unoptimized />
        </Link>

        {/* 桌面端链接 */}
        <div className="hidden md:flex items-center justify-center gap-4">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                ...navFontStyle,
                color: '#1E1E14',
                fontSize: '15px',
                fontWeight: 500,
                border: '2px solid #1E1E14',
                borderRadius: '999px',
                padding: '0.45em 1.35em',
                background: '#FFFFFF',
              }}
              className="mei-nav-link"
            >
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
              backgroundColor: '#1E1E14',
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
              backgroundColor: '#1E1E14',
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
              backgroundColor: '#1E1E14',
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
          borderBottom: '2px solid #1E1E14',
        }}
      >
        <div className="flex flex-col px-6 pb-6 pt-2 gap-5">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              style={{ ...navFontStyle, color: '#1E1E14', fontSize: '20px', fontWeight: 600 }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
