"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { BrainCircuit } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/sorting", label: "Sorting" },
  { href: "/searching", label: "Searching" },
  { href: "/recursion", label: "Recursion" },
  { href: "/pathfinding", label: "Pathfinding" },
  { href: "/maze", label: "Maze" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold hover:opacity-80">
            <BrainCircuit className="w-6 h-6 text-[var(--color-primary)]" />
            <span>AlgoVision</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  pathname === link.href
                    ? "bg-[var(--color-primary)] text-white"
                    : "hover:bg-[var(--color-card)] text-[var(--color-muted)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <nav className="flex md:hidden gap-2">
            <ThemeToggle />
          </nav>
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
