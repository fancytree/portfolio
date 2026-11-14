import type { Metadata } from "next";
import Image from "next/image";
import ConnectNovaCover from "../components/connectnova-cover/ConnectNovaCover";
import DefErpCover from "../components/def-erp-cover/DefErpCover";
import JobNovaCover from "../components/jobnova-cover/JobNovaCover";
import ProcurementCover from "../components/procurement-cover/ProcurementCover";
import home from "../components/WorkProjectRows.module.css";
import HashScroll from "./HashScroll";
import Journey from "./Journey";
import MoreList from "./MoreList";
import Portrait from "./Portrait";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import ToolShelf from "./ToolShelf";
import WorkFloaters from "./WorkFloaters";
import StageNodes from "./StageNodes";
import { plexMono } from "./fonts";
import { contact, experiments, projects, strategy } from "./content";
import s from "./river.module.css";

export const metadata: Metadata = {
  title: "Mei Chai — Product Designer",
  description:
    "Mei Chai is a product designer with 6+ years in UX and user research, designing B2B SaaS, AI agents and enterprise workflows: human-in-the-loop by design, built on design systems, shipped in code.",
};

// The four featured projects use the same animated covers as the homepage, in the
// homepage's own cover frame, so a project looks the same wherever it is listed.
const COVERS: Record<string, () => React.JSX.Element> = {
  "/projects/procurement-agent-kit": ProcurementCover,
  "/projects/def-erp-kit": DefErpCover,
  "/projects/jobnova-kit": JobNovaCover,
  "/projects/connectnova-kit": ConnectNovaCover,
};

function Label({ children }: { children: string }) {
  return <p className={s.label}>[ {children} ]</p>;
}

export default function RiverHome() {
  return (
    <div className={`${s.root} ${plexMono.variable}`}>
      <a className={s.skip} href="#main">
        Skip to content
      </a>
      <HashScroll />
      <Journey className={s.journey} flyerClassName={s.flyer} />

      <SiteHeader home />

      <main id="main">
        {/* inside main, so it stacks with the Work cards: over the sheet, under the cards */}
        <WorkFloaters />

        {/* 01 — Hero */}
        <section id="top" className={s.hero} aria-labelledby="hero-title" data-river-window>
          <div className={`${s.container} ${s.grid}`}>
            <div className={s.heroText} data-river-text>
              <div className={s.heroMeta}>
                <Label>HELLO, WORLD</Label>
                <p className={s.heroBase}>
                  <i aria-hidden="true" />
                  Based in Milan
                </p>
              </div>
              <h1 id="hero-title" className={s.h1}>
                Hi, I’m Mei.
                <br />
                I design AI-native
                <br />
                products that <em>flow.</em>
              </h1>
              <p className={s.lead}>
                Product designer with 6+ years in UX and user research. I design B2B SaaS, AI agents
                and enterprise workflows: human-in-the-loop by design, built on design systems, and
                shipped in code.
              </p>
              {/* an invitation to scroll rather than buttons: the page is the journey */}
              <a className={s.scrollCue} href="#work">
                <span className={s.cueBadge} aria-hidden="true">
                  <svg className={s.cueRing} viewBox="0 0 120 120">
                    <defs>
                      <path id="cue-circle" d="M60 60 m-45 0 a45 45 0 1 1 90 0 a45 45 0 1 1 -90 0" />
                    </defs>
                    <text>
                      <textPath href="#cue-circle" textLength="278">
                        SCROLL · DIVE IN · SCROLL · DIVE IN · SCROLL · DIVE IN ·
                      </textPath>
                    </text>
                  </svg>
                  <span className={s.cueArrow}>↓</span>
                </span>
                <span className={s.scrollText}>
                  Scroll to dive in
                </span>
              </a>
            </div>

            <div className={s.heroScene} aria-hidden="true">
            </div>
          </div>
        </section>

        {/* more river before the next sheet: room for the project cards to lift out of the water */}
        <div className={s.heroTail} data-river-window aria-hidden="true" />

        {/* 02 — Selected Work */}
        <section id="work" className={`${s.section} ${s.work}`} aria-labelledby="work-title">
          <div className={s.container}>
            <div className={s.sectionHead} data-fish-zone="head">
              <div>
                <Label>SELECTED WORK</Label>
                <h2 id="work-title" className={s.h2}>Selected Work.</h2>
                <p className={s.sectionIntro}>
                  AI agents, B2B SaaS and enterprise systems, taken from research to shipped
                  product, with the numbers they moved.
                </p>
              </div>
            </div>

            <ul className={s.cards}>
              {projects.map((p, i) => (
                <li key={p.title}>
                  <a className={s.card} data-work-card={i} href={p.href} {...(p.external ? { target: "_blank", rel: "noreferrer" } : {})}>
                    {/* a window's title bar: index, role and dates, three squares */}
                    <div className={s.cardBar}>
                      <span className={s.cardNo}>{p.number}</span>
                      <span className={s.cardRole}>
                        {p.role} · {p.time}
                      </span>
                      <span className={s.cardSquares} aria-hidden="true">
                        <i />
                        <i />
                        <i />
                      </span>
                    </div>
                    <div className={s.cardInner}>
                    <h3 className={s.cardTitle}>{p.title}</h3>
                    <p className={s.cardBody}>{p.description}</p>
                    {p.impact && (
                      <p className={s.cardImpact}>
                        <strong>{p.impact.value}</strong>
                        <span>{p.impact.label}</span>
                      </p>
                    )}
                    <ul className={s.tags} aria-label="Tags">
                      {p.tags.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                    {COVERS[p.href] ? (
                      <div className={`${home.cover} ${s.cardCover}`} data-presentation="animation">
                        <div className={home.animatedCover} inert aria-hidden="true">
                          {(() => {
                            const Cover = COVERS[p.href];
                            return <Cover />;
                          })()}
                        </div>
                      </div>
                    ) : (
                      <div className={s.cardImage}>
                        <Image src={p.image} alt={p.imageAlt} fill sizes="(min-width: 768px) 50vw, 100vw" />
                      </div>
                    )}
                    <div className={s.cardFoot}>
                      <span>View case study</span>
                      <span className={s.cardGo} aria-hidden="true">↗</span>
                    </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>

            <div className={s.more} data-fish-zone="more">
              <h3 className={s.colLabel}>Experiments and side projects</h3>
              <MoreList items={experiments} />
            </div>
          </div>
        </section>

        {/* Between the sheets the page opens onto the river again, further downstream */}
        <section className={s.interlude} data-river-window data-river-stretch aria-labelledby="stages-title">
          {/* where the Experience link lands: a little way in, with the first stage already in view */}
          <span id="experience" className={s.interludeAnchor} aria-hidden="true" />
          {/* The stages stand in the river scene as landmarks; these cards hang over them and open on click. */}
          <h2 id="stages-title" className={s.srOnly}>
            Experience
          </h2>
          <StageNodes />
        </section>

        {/* 03 — About */}
        <section id="about" className={`${s.section} ${s.about}`} aria-labelledby="about-title">
          <div className={`${s.container} ${s.grid}`}>
            {/* the introduction and the portrait share a row of their own, so the pinned portrait stops before the tools */}
            <div className={s.aboutTop}>
              <div className={s.aboutPortrait}>
                <Portrait />
              </div>

              <div className={s.aboutIntro}>
                <Label>ABOUT ME</Label>
                <h2 id="about-title" className={s.h2}>
                  Curious by nature.
                  <br />
                  Designer by <em>practice.</em>
                </h2>
                <p className={s.bodyLarge}>
                  I design AI-native SaaS and enterprise products, with a background in interaction
                  design at Sohu and user research at Smart Walnut. Most of my work is complex B2B
                  workflows: agents that act for people, and the review, approval and control that
                  keep those people in charge.
                </p>
                <p className={s.body}>
                  I work end to end: research and problem framing, interaction design, design systems
                  in Figma and code, and front-end delivery with AI-assisted development.
                </p>
                {/* how she works: six methods, one open at a time */}
                <div className={s.methods}>
                  {strategy.methods.map((m) => (
                    <details key={m.title} className={s.method} name="strategy-method">
                      <summary>
                        <span className={s.methodTitle}>{m.title}</span>
                        <span className={s.methodSettles}>{m.settles}</span>
                        <span className={s.methodToggle} aria-hidden="true">+</span>
                      </summary>
                      <div className={s.methodMore}>
                        <p className={s.body}>{m.body}</p>
                        {m.artifacts.length > 0 && (
                          <div className={s.methodFigures}>
                            {m.artifacts.map((f) => (
                              <figure key={f.src}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={f.src} alt={f.alt} loading="lazy" decoding="async" />
                                <figcaption>{f.caption}</figcaption>
                              </figure>
                            ))}
                          </div>
                        )}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>

            <div className={s.aboutTools}>
              <h3 className={s.srOnly}>Tools</h3>
              <ToolShelf />
            </div>
          </div>
        </section>

        {/* 04 — Contact */}
        <section id="contact" className={`${s.section} ${s.contact}`} aria-labelledby="contact-title" data-river-window>
          <div className={`${s.container} ${s.grid}`}>
            <div className={s.contactText} data-river-text>
              {/* the end of the river: one thing to do, and the water */}
              <h2 id="contact-title" className={s.srOnly}>
                Contact
              </h2>
              <a className={s.touch} href={`mailto:${contact.email}`}>
                Get in <em>touch</em>
                <span className={s.touchArrow} aria-hidden="true">↗</span>
              </a>
              <p className={s.touchNote}>{contact.email}</p>
            </div>

          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
