'use client';

// 顶部导航栏组件
// 使用方法：在布局组件或页面中直接使用 <Navbar /> 渲染导航栏

import { useState } from 'react';
import Link from "next/link";
import Image from "next/image";

const fontStyle = {
  fontFamily: 'system-ui, -apple-system, sans-serif',
};

const navLinks = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed w-full top-0 z-50">
      {/* 背景层 */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/50 to-transparent backdrop-blur-lg -z-10" />

      {/* 导航栏主体 */}
      <nav
        className="relative z-10 flex items-center justify-between mx-auto px-6 md:px-12"
        style={{ height: '72px', maxWidth: '1280px', width: '100%' }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3" style={{ textDecoration: 'none' }} onClick={closeMenu}>
          <Image src="/logo.svg" alt="Logo" width={24} height={24} className="object-contain" />
          <span style={{ ...fontStyle, color: '#000000', fontSize: '16px', fontWeight: 500, lineHeight: '24px' }}>
            River
          </span>
        </Link>

        {/* 桌面端链接 */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{ ...fontStyle, color: '#000000', fontSize: '16px', fontWeight: 500 }}
              className="transition-colors duration-700"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* 移动端汉堡按钮 */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span
            style={{
              display: 'block',
              width: '22px',
              height: '2px',
              backgroundColor: '#000',
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
              backgroundColor: '#000',
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
              backgroundColor: '#000',
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
          backgroundColor: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex flex-col px-6 pb-6 pt-2 gap-5">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              style={{ ...fontStyle, color: '#000000', fontSize: '20px', fontWeight: 500 }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
