import { BrainCircuit, Code } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <BrainCircuit className="w-4 h-4 text-[var(--color-primary)]" />
            <span>AlgoVision - Algorithm Visualizer</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <Link
              href="/sorting"
              className="hover:text-[var(--color-primary)] transition"
            >
              Sorting
            </Link>
            <Link
              href="/searching"
              className="hover:text-[var(--color-primary)] transition"
            >
              Searching
            </Link>
            <Link
              href="/recursion"
              className="hover:text-[var(--color-primary)] transition"
            >
              Recursion
            </Link>
            <Link
              href="/pathfinding"
              className="hover:text-[var(--color-primary)] transition"
            >
              Pathfinding
            </Link>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Built with Next.js</span>
            <Code className="w-4 h-4" />
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
          &copy; {new Date().getFullYear()} AlgoVision. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
