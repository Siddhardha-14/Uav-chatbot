"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme-provider";

const nav = [
  { href: "/", label: "Home" },
  { href: "/analyzer", label: "Analyzer" },
  { href: "/admin", label: "Admin" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      role="banner"
      className="sticky top-0 z-40 border-b border-card-border bg-card/80 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="truncate text-sm font-semibold tracking-tight text-foreground sm:text-base"
          >
            UAV Mission Intent Analyzer
          </Link>
          <span className="hidden rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent sm:inline">
            BERT · mission NLP
          </span>
        </div>
        <nav
          className="flex items-center gap-1 sm:gap-2"
          aria-label="Primary"
        >
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors sm:px-3 ${
                  active
                    ? "bg-accent-soft text-accent"
                    : "text-muted hover:bg-accent-soft/60 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={toggleTheme}
            className="ml-1 rounded-lg border border-card-border px-2.5 py-1.5 text-sm text-foreground hover:bg-accent-soft/40"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </nav>
      </div>
    </header>
  );
}
