"use client";

import { useEffect, useRef } from "react";

const buttonClassName =
  "cursor-pointer rounded-full border border-[var(--border)] bg-[var(--nav-background)] px-7 py-3 text-base font-medium text-[var(--text)] shadow-[0_3px_10px_rgb(0_0_0/4%)] backdrop-blur-xl transition hover:-translate-y-px hover:border-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] max-md:px-4 max-md:py-2 max-md:text-sm";

export default function ContactPromptButton() {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  function highlightContact() {
    const contactDock = document.getElementById("contact");
    if (!contactDock) return;

    if (timerRef.current) window.clearTimeout(timerRef.current);
    contactDock.classList.remove("contact-dock-highlighted");
    void contactDock.offsetWidth;
    contactDock.classList.add("contact-dock-highlighted");

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    contactDock.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "center",
    });

    timerRef.current = window.setTimeout(() => {
      contactDock.classList.remove("contact-dock-highlighted");
    }, 2400);
  }

  return (
    <button className={buttonClassName} onClick={highlightContact} type="button">
      어떻게 연락할 수 있나요?
    </button>
  );
}
