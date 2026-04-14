"use client";

import { MAZE_ALGORITHMS } from "@/config/algorithms";

interface MazeControlsProps {
  algorithm: string;
  setAlgorithm: (slug: string) => void;
  onGenerate: () => void;
  onReset: () => void;
  isGenerated: boolean;
}

export function MazeControls({ algorithm, setAlgorithm, onGenerate, onReset, isGenerated }: MazeControlsProps) {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 items-center">
      <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
        {MAZE_ALGORITHMS.map((a) => (
          <option key={a.slug} value={a.slug}>{a.name}</option>
        ))}
      </select>
      <button onClick={onGenerate} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium">
        Generate Maze
      </button>
      <button onClick={onReset} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm font-medium">
        Reset
      </button>
    </div>
  );
}
