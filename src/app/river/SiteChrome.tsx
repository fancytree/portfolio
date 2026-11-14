// The header and footer of the river homepage, shared with the pages that follow
// its look (the Playground). On the homepage the links are anchors on the page
// itself; elsewhere they lead back to it.

import { contact } from "./content";
import s from "./river.module.css";

export function SiteHeader({ home = false }: { home?: boolean }) {
  const to = (id: string) => (home ? `#${id}` : `/#${id}`);
  return (
    <header className={s.header}>
      <div className={`${s.container} ${s.headerInner}`}>
        <a className={s.brand} href={home ? "#top" : "/"} aria-label={home ? "Mei Chai, back to top" : "Mei Chai, home"}>
          {/* the same mark as the live site's navbar */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={s.brandLogo} src="/logo.gif" alt="" width={33} height={20} />
          <span className={s.brandMark}>Mei Chai°</span>
        </a>
        <nav aria-label="Primary">
          <ul className={s.nav}>
            <li><a href={to("work")}>Work</a></li>
            <li><a href={to("experience")}>Experience</a></li>
            <li><a href={to("about")}>About</a></li>
            <li><a href="/playground" aria-current={home ? undefined : "page"}>Play</a></li>
            <li><a href={contact.cv} target="_blank" rel="noreferrer">Resume</a></li>
            <li><a href={to("contact")}>Contact <span aria-hidden="true">↗</span></a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className={s.footer}>
      <div className={`${s.container} ${s.footerInner}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={`${s.brandLogo} ${s.brandLogoInverse}`} src="/logo.gif" alt="" width={33} height={20} />
        <span className={s.brandMark}>Mei Chai°</span>
        <span className={s.footerMeta}>© {new Date().getFullYear()}</span>
        <ul className={s.footerLinks}>
          <li><a href={`mailto:${contact.email}`}>Email</a></li>
          <li><a href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
          <li><a href={contact.github} target="_blank" rel="noreferrer">GitHub</a></li>
          <li><a href={contact.cv} download>Resume <span aria-hidden="true">↓</span></a></li>
          <li><a href="#top">Back to top <span aria-hidden="true">↑</span></a></li>
        </ul>
      </div>
    </footer>
  );
}
