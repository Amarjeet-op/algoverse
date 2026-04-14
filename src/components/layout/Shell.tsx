"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/sorting", label: "Sorting", ico: "⣿" },
  { href: "/pathfinding", label: "PathFinding", ico: "⊞" },
  { href: "/recursion", label: "Recursion", ico: "⌘" },
  { href: "/maze", label: "Maze Solver", ico: "◎" },
  { href: "/searching", label: "Searching", ico: "⟐" },
];

const crumbs: Record<string, string> = {
  sorting: "Sorting Algorithms",
  pathfinding: "Path Finding Algorithms",
  recursion: "Recursion Tree Visualizer",
  "maze solver": "Maze Solver",
  searching: "Searching Algorithms",
};

interface ShellProps {
  children?: React.ReactNode;
  status?: "idle" | "run" | "done" | "pause";
  statusText?: string;
}

export function Shell({ children, status = "idle", statusText = "IDLE" }: ShellProps) {
  const pathname = usePathname();
  const activeTab = navItems.find(n => pathname.startsWith(n.href))?.label || "";
  const breadcrumb = crumbs[activeTab?.toLowerCase()] || "";

  return (
    <div className="page-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <a href="/" className="logo-area" style={{ textDecoration: 'none' }}>
          <div className="logo-text">ALGO<span style={{ color: "var(--textdim)" }}>VERSE</span></div>
          <div className="logo-sub">Algorithm Visualizer</div>
        </a>

        <div className="nav-label">Modules</div>
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item${item.label === activeTab ? " active" : ""}`}
          >
            <div className="nav-ico">{item.ico}</div>
            {item.label}
          </Link>
        ))}

      </aside>

      {/* MAIN */}
      <div className="main-wrap">
        {/* TOPBAR */}
        <header className="topbar">
          <a href="/" className="topbar-title" style={{ textDecoration: 'none' }}>ALGOVERSE</a>
          <div className="topbar-crumb">
            <span className="topbar-sep">/</span>
            <span>{breadcrumb}</span>
          </div>
          <div className={`status-chip${status !== "idle" ? ` ${status}` : ""}`}>
            <div className="sdot"></div>
            <span>{statusText}</span>
          </div>
        </header>

        {/* CONTENT */}
        {children}
      </div>
    </div>
  );
}
