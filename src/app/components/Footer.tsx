'use client';

import { useState } from 'react';

const footerLinks = [
  { href: 'mailto:flyskytoo@outlook.com', label: 'Email' },
  { href: 'https://www.linkedin.com/in/meichai/', label: 'LinkedIn' },
  { href: 'https://github.com/fancytree', label: 'GitHub' },
];

export default function Footer() {
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });

  const handleGetInTouch = () => {
    if (typeof window === 'undefined') return;
    window.location.href = '/contact';
  };

  return (
    <footer
      className="mei-contact-footer w-screen"
      onMouseEnter={() => setCursor((prev) => ({ ...prev, visible: true }))}
      onMouseLeave={() => setCursor((prev) => ({ ...prev, visible: false }))}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setCursor({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          visible: true,
        });
      }}
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
      }}
    >
      <div className="mei-footer-content-wrapper">
        <h2 className="mei-footer-title">Let&apos;s work together</h2>
        <button type="button" className="mei-footer-cta-button" onClick={handleGetInTouch}>
          Get in Touch
        </button>

        <div className="mei-footer-links" aria-label="Footer links">
          {footerLinks.map((link, index) => (
            <span className="mei-footer-link-group" key={link.href}>
              <a
                href={link.href}
                className="mei-footer-link"
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {link.label}
              </a>
              {index < footerLinks.length - 1 ? (
                <span className="mei-link-separator" aria-hidden="true">
                  |
                </span>
              ) : null}
            </span>
          ))}
        </div>
      </div>

      <div className="mei-footer-bottom-bar">
        <p>© 2026 MEI CHAI</p>
      </div>

      <div
        className="mei-cursor-effects"
        aria-hidden="true"
        style={{
          left: cursor.x,
          top: cursor.y,
          opacity: cursor.visible ? 1 : 0,
          transform: `translate(-50%, -50%) scale(${cursor.visible ? 1 : 0})`,
        }}
      />
    </footer>
  );
}
