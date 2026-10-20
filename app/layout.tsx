import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import "./globals.css";

const pretendard = localFont({
  display: "swap",
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
});

export const metadata: Metadata = {
  title: {
    default: "Portfolio",
    template: "%s | Portfolio",
  },
  description: "프로젝트와 개발 경험을 소개하는 개인 포트폴리오입니다.",
};

type RootLayoutProps = {
  children: ReactNode;
};

const themeScript = `
  try {
    const savedTheme = localStorage.getItem('portfolio-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.dataset.theme = savedTheme ?? (prefersDark ? 'dark' : 'light');
  } catch {
    document.documentElement.dataset.theme = 'light';
  }
`;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      className={pretendard.variable}
      lang="ko"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Header />
        <div className="site-content">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
