'use client';

// The cards that hang over the stage nodes in the river scene.
//
// Each card is a real button, so it can be clicked, focused and read by a screen
// reader. Journey.tsx moves them every frame to sit above their 3D markers (it
// finds them by [data-river-node]); this component only owns what they say and
// which one is open. The card of the stage the runner has reached opens by itself;
// clicking a card opens it too, and clicking it again, opening another, or pressing
// Escape closes it.

import { useEffect, useState } from "react";
import { stages } from "./content";
import s from "./river.module.css";

export default function StageNodes() {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // The runner opens the cards as she goes: reaching a stage opens its card, and
  // running on closes it. A click still opens or closes any card in between.
  useEffect(() => {
    const onStage = (e: Event) => {
      const at = (e as CustomEvent<number>).detail;
      setOpen(at >= 0 ? at : null);
    };
    window.addEventListener("river:stage", onStage);
    return () => window.removeEventListener("river:stage", onStage);
  }, []);

  return (
    <ol className={s.nodes}>
      {stages.map((stage, i) => {
        const isOpen = open === i;
        return (
          <li key={stage.years} className={s.node} data-river-node data-open={isOpen || undefined}>
            <button
              type="button"
              className={s.nodeButton}
              aria-expanded={isOpen}
              aria-controls={`stage-more-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className={s.nodeYears}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {stage.years}
                {/* a plus that turns into a cross as the card opens */}
                <span className={s.nodeToggle} aria-hidden="true">
                  +
                </span>
              </span>
              <span className={s.nodeRole}>{stage.role}</span>
              <span className={s.nodePlace}>{stage.place}</span>
            </button>
            {/* kept in the DOM so it can animate; inert keeps it out of reach while closed */}
            <div id={`stage-more-${i}`} className={s.nodeMore} inert={!isOpen} aria-hidden={!isOpen}>
              <div className={s.nodeMoreInner}>
                {(stage.company || stage.impact.length > 0) && (
                  <div className={s.nodeFacts}>
                    {stage.company && <p className={s.nodeCompany}>{stage.company}</p>}
                    {stage.impact.length > 0 && (
                      <dl className={s.nodeImpact}>
                        {stage.impact.map((m) => (
                          <div key={m.value}>
                            <dt>{m.value}</dt>
                            <dd>{m.label}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </div>
                )}
                <div className={s.nodeWork}>
                  {stage.did && (
                    <p className={s.nodeDid}>
                      <span>What I did</span>
                      {stage.did}
                    </p>
                  )}
                  {stage.methodsLabel && <span className={s.nodeListLabel}>{stage.methodsLabel}</span>}
                  <ul className={s.nodeMethods} aria-label={stage.methodsLabel ?? "Methods and tools"}>
                    {stage.methods.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
