"use client";

import { useEffect, useRef, useState } from "react";
import { contact } from "./content";
import s from "./river.module.css";

export default function BookingDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousOverscroll = root.style.overscrollBehavior;

    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    root.style.overscrollBehavior = "none";

    return () => {
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyOverflow;
      root.style.overscrollBehavior = previousOverscroll;
    };
  }, [open]);

  function showBooking() {
    setOpen(true);
    dialog.current?.showModal();
  }

  return (
    <div className={s.booking}>
      <button className={s.bookingToggle} type="button" onClick={showBooking}>
        <span>Book a call</span>
        <svg className={s.contactArrow} aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 10.5L10.5 3.5M5 3.5H10.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" /></svg>
      </button>
      <dialog
        ref={dialog}
        className={s.bookingDialog}
        aria-labelledby="booking-title"
        onClose={() => setOpen(false)}
      >
        <div className={s.bookingHeader}>
          <span className={s.bookingIndex} aria-hidden="true">01</span>
          <h2 id="booking-title" className={s.bookingTitle}>Intro call <span aria-hidden="true">·</span> 30 min</h2>
          <button className={s.bookingClose} type="button" onClick={() => dialog.current?.close()} aria-label="Close booking dialog" autoFocus>
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
        {open && (
          <iframe
            className={s.bookingFrame}
            src={contact.booking}
            title="Book an intro call with Mei"
          />
        )}
      </dialog>
    </div>
  );
}
