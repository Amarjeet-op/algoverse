"use client";

import { Play, Pause } from "lucide-react";
import { PathStep } from "@/lib/algorithms/pathfinding/types";

interface PathfindingControlsProps {
  algorithm: string;
  setAlgorithm: (slug: string) => void;
  onRun: () => void;
  onClear: () => void;
  onReset: () => void;
  isComplete: boolean;
  steps: PathStep[];
  isPlaying?: boolean;
  isPaused?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onStepForward?: () => void;
  onStepBackward?: () => void;
}

export function PathfindingControls({
  algorithm, setAlgorithm, onRun, onClear, onReset,
  isComplete, steps, isPlaying, isPaused,
  onPlay, onPause, onStepForward, onStepBackward
}: PathfindingControlsProps) {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
        {steps.length > 0 && <option value={algorithm}>{algorithm}</option>}
      </select>
      <button onClick={onRun} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium">
        Run
      </button>
      {onPlay && (
        <>
          {isPlaying && !isPaused ? (
            <button onClick={onPause} className="px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium">
              Pause
            </button>
          ) : (
            <button onClick={onPlay} disabled={isComplete || steps.length === 0} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium disabled:opacity-30">
              <Play className="w-4 h-4" />
            </button>
          )}
          {onStepBackward && <button onClick={onStepBackward} disabled={isComplete} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm font-medium disabled:opacity-30">Prev</button>}
          {onStepForward && <button onClick={onStepForward} disabled={isComplete} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm font-medium disabled:opacity-30">Next</button>}
        </>
      )}
      <button onClick={onClear} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm font-medium">
        Clear Walls
      </button>
      <button onClick={onReset} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm font-medium">
        Reset
      </button>
    </div>
  );
}
