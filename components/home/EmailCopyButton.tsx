"use client";

import { useEffect, useRef, useState } from "react";

import ContactIcon from "@/components/home/ContactIcon";

type EmailCopyButtonProps = {
  email: string;
};

export default function EmailCopyButton({ email }: EmailCopyButtonProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopyState("idle"), 1800);
  }

  const message =
    copyState === "copied"
      ? "이메일 주소가 복사되었습니다."
      : copyState === "failed"
        ? "이메일 주소를 복사하지 못했습니다."
        : "이메일 주소 복사";

  return (
    <button
      aria-label="이메일 주소 복사"
      className="contact-dock-item contact-dock-item-email"
      data-copied={copyState === "copied"}
      onClick={copyEmail}
      title={message}
      type="button"
    >
      {copyState === "copied" ? (
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
          <path
            d="m5 12.5 4.2 4.2L19 7"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      ) : (
        <ContactIcon name="email" />
      )}
      <span aria-live="polite" className="sr-only">
        {copyState === "idle" ? "" : message}
      </span>
    </button>
  );
}
