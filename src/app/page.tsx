"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  Search,
  GitBranch,
  Map,
  Grid3x3,
  Zap,
  Code2,
  Eye,
  ArrowRight,
  Sparkles,
  Play,
  GraduationCap,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Sorting Algorithms",
    desc: "Bubble, Quick, Merge, Insertion, Selection & Heap Sort with real-time bar animations.",
    href: "/sorting",
    count: 6,
    color: "#b8ff00",
  },
  {
    icon: Search,
    title: "Searching Algorithms",
    desc: "Linear, Binary, Jump & Interpolation Search visualized on sorted arrays.",
    href: "/searching",
    count: 4,
    color: "#2979ff",
  },
  {
    icon: Map,
    title: "Pathfinding",
    desc: "Dijkstra, A*, BFS & DFS on interactive grids with wall drawing.",
    href: "/pathfinding",
    count: 4,
    color: "#00e676",
  },
  {
    icon: Grid3x3,
    title: "Maze Solver",
    desc: "Generate mazes with Recursive Backtracking and solve them with BFS/DFS.",
    href: "/maze",
    count: 3,
    color: "#aa44ff",
  },
  {
    icon: GitBranch,
    title: "Recursion Visualizer",
    desc: "Fibonacci, Factorial, Tower of Hanoi & N-Queens with call-stack trees.",
    href: "/recursion",
    count: 4,
    color: "#ffba00",
  },
];

const stats = [
  { value: "21+", label: "Algorithms" },
  { value: "5", label: "Categories" },
  { value: "∞", label: "Visualizations" },
  { value: "0", label: "Cost" },
];

export default function LandingPage() {
  return (
    <div className="landing">
      {/* ─── NAV ─── */}
      <nav className="ln-nav">
        <div className="ln-nav-inner">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <a href="/" className="ln-brand" style={{ textDecoration: 'none' }}>
              <div className="ln-logo-icon">
                <Zap size={18} />
              </div>
              <span className="ln-logo-text">
                ALGO<span className="ln-logo-dim">VERSE</span>
              </span>
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="ln-nav-links"
          >
            <a href="#features">Features</a>
            <a href="#algorithms">Algorithms</a>
            <a href="#about">About</a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/sorting" className="ln-nav-cta">
              Launch App <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="ln-hero">
        <div className="ln-hero-bg">
          <div className="ln-orb ln-orb-1" />
          <div className="ln-orb ln-orb-2" />
          <div className="ln-orb ln-orb-3" />
        </div>
        <div className="ln-hero-content">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="ln-badge"
          >
            <Sparkles size={12} />
            <span>Interactive Algorithm Visualizer</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="ln-h1"
          >
            See Algorithms
            <br />
            <span className="ln-h1-accent">Come Alive</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="ln-hero-sub"
          >
            Watch sorting, searching, pathfinding, maze solving and recursion algorithms
            execute step-by-step with stunning real-time visualizations. The best way
            to truly understand how algorithms work.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="ln-hero-actions"
          >
            <Link href="/sorting" className="ln-btn-primary">
              <Play size={16} />
              Start Visualizing
            </Link>
            <a href="#features" className="ln-btn-secondary">
              <Eye size={16} />
              Explore Features
            </a>
          </motion.div>
          <div className="ln-stats">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="ln-stat"
              >
                <div className="ln-stat-val">{s.value}</div>
                <div className="ln-stat-lbl">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Animated grid preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="ln-hero-visual"
        >
          <div className="ln-preview-card">
            <div className="ln-preview-bar-wrap">
              {[52, 28, 78, 45, 92, 35, 65, 18, 85, 40, 70, 22, 58, 95, 30].map(
                (h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.05 }}
                    className="ln-preview-bar"
                    style={{
                      background: `linear-gradient(to top, var(--lime), rgba(184,255,0,0.2))`,
                      boxShadow: `0 0 20px rgba(184,255,0,0.2)`,
                      opacity: 1
                    }}
                  />
                )
              )}
            </div>
            <div className="ln-preview-label">Visualization</div>
          </div>
        </motion.div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="ln-features" id="features">
        <div className="ln-section-header">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="ln-section-badge"
          >
            <Code2 size={12} />
            <span>Modules</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="ln-h2"
          >
            Five Powerful <span className="ln-h2-accent">Visualization Modules</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="ln-section-sub"
          >
            Each module is a full-featured interactive environment with step-by-step
            controls, real-time code highlighting, and complexity analysis.
          </motion.p>
        </div>

        <div className="ln-cards">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link href={f.href} className="ln-card">
                  <div className="ln-card-glow" style={{ background: f.color }} />
                  <div className="ln-card-icon" style={{ color: f.color, borderColor: `${f.color}33` }}>
                    <Icon size={22} />
                  </div>
                  <h3 className="ln-card-title">{f.title}</h3>
                  <p className="ln-card-desc">{f.desc}</p>
                  <div className="ln-card-footer">
                    <span className="ln-card-count" style={{ color: f.color }}>
                      {f.count} algorithms
                    </span>
                    <span className="ln-card-arrow" style={{ color: f.color }}>
                      Explore <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="ln-how" id="algorithms">
        <div className="ln-section-header">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="ln-section-badge"
          >
            <GraduationCap size={12} />
            <span>How It Works</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="ln-h2"
          >
            Learn by <span className="ln-h2-accent">Watching</span>
          </motion.h2>
        </div>

        <div className="ln-steps-grid">
          {[
            { num: "01", title: "Choose an Algorithm", desc: "Select from 21+ algorithms across 5 categories." },
            { num: "02", title: "Configure & Customize", desc: "Adjust array sizes, speeds, grid layouts and more." },
            { num: "03", title: "Watch & Step Through", desc: "Play, pause, or step through each operation one at a time." },
            { num: "04", title: "Understand the Code", desc: "See the source code and complexity analysis side-by-side." }
          ].map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="ln-step"
            >
              <div className="ln-step-num">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── ABOUT / CTA ─── */}
      <section className="ln-cta-section" id="about">
        <div className="ln-cta-bg" />
        <div className="ln-cta-content">
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="ln-h2"
            style={{ textAlign: "center" }}
          >
            Ready to <span className="ln-h2-accent">Visualize</span>?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="ln-section-sub"
            style={{ textAlign: "center" }}
          >
            Jump straight into any module and start exploring algorithms with beautiful,
            interactive visualizations. No sign-up required.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="ln-cta-buttons"
          >
            <Link href="/sorting" className="ln-btn-primary ln-btn-lg">
              <Play size={18} />
              Launch ALGOVERSE
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="ln-footer">
        <div className="ln-footer-inner">
          <div className="ln-footer-brand">
            <Zap size={14} />
            <span>ALGOVERSE</span>
          </div>
          <p className="ln-footer-copy">
            Built with Next.js, React & Zustand. Made to help developers learn algorithms.
          </p>
          <div className="ln-footer-links">
            <Link href="/sorting">Sorting</Link>
            <Link href="/searching">Searching</Link>
            <Link href="/pathfinding">Pathfinding</Link>
            <Link href="/maze">Maze</Link>
            <Link href="/recursion">Recursion</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
