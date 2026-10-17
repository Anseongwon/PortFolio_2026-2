"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { href: "/about", label: "About Me" },
  { href: "/issues", label: "Dev Issues" },
  { href: "/projects", label: "Projects" },
  { href: "/guestbook", label: "Guestbook" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggleTheme() {
    const root = document.documentElement;
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";

    root.dataset.theme = nextTheme;
    window.localStorage.setItem("portfolio-theme", nextTheme);
  }

  return (
    <header className="site-header">
      <div className="glass-surface header-inner">
        <Link className="site-logo" href="/">
          ASW<span aria-hidden="true">.</span>
        </Link>

        <nav
          aria-label="주요 메뉴"
          className={`site-navigation ${isMenuOpen ? "site-navigation-open" : ""}`}
          id="site-navigation"
        >
          <ul className="nav-list">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  aria-current={
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(`${item.href}/`))
                      ? "page"
                      : undefined
                  }
                  onClick={() => setIsMenuOpen(false)}
                  className={`nav-link ${
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(`${item.href}/`))
                      ? "nav-link-active"
                      : ""
                  }`}
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          aria-controls="site-navigation"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen((current) => !current)}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>

        <button
          aria-label="다크 모드 전환"
          className="theme-toggle"
          onClick={toggleTheme}
          title="다크 모드 전환"
          type="button"
        >
          <svg
            aria-hidden="true"
            className="theme-icon moon-icon"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M20.4 14.3A8.5 8.5 0 0 1 9.7 3.6 8.5 8.5 0 1 0 20.4 14.3Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
          <svg
            aria-hidden="true"
            className="theme-icon sun-icon"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4M18.7 18.7l-1.4-1.4M6.7 6.7 5.3 5.3"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.8"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
