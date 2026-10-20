import type { ReactNode } from "react";

import AmbientBackground from "@/components/layout/AmbientBackground";

type PageShellProps = {
  children: ReactNode;
  className: string;
};

export default function PageShell({ children, className }: PageShellProps) {
  return (
    <main className={className}>
      <AmbientBackground />
      {children}
    </main>
  );
}
