import type { ContactIconName } from "@/data/profile";

type ContactIconProps = {
  name: ContactIconName;
};

export default function ContactIcon({ name }: ContactIconProps) {
  const commonProps = {
    "aria-hidden": true,
    fill: "none",
    height: 22,
    viewBox: "0 0 24 24",
    width: 22,
  } as const;

  if (name === "email") {
    return (
      <svg {...commonProps}>
        <rect height="16" rx="3" stroke="currentColor" strokeWidth="1.8" width="20" x="2" y="4" />
        <path d="m4 7 8 6 8-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    );
  }

  if (name === "github") {
    return (
      <svg {...commonProps} fill="currentColor">
        <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.57 9.57 0 0 1 12 6.82c.85 0 1.71.11 2.51.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
      </svg>
    );
  }

  if (name === "instagram") {
    return (
      <svg {...commonProps}>
        <rect height="19" rx="5" stroke="currentColor" strokeWidth="1.8" width="19" x="2.5" y="2.5" />
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.5" cy="6.5" fill="currentColor" r="1.1" />
      </svg>
    );
  }

  if (name === "blog") {
    return (
      <svg {...commonProps}>
        <rect height="19" rx="3" stroke="currentColor" strokeWidth="1.8" width="16" x="4" y="2.5" />
        <path d="M8 7h8M8 11h8M8 15h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M5 3.5h10.5A3.5 3.5 0 0 1 19 7v13.5H8.5A3.5 3.5 0 0 1 5 17V3.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M8.5 7.5h7M8.5 11h7M8.5 14.5h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}
