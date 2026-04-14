import { Play, Pause, RotateCcw, StepForward, StepBack } from "lucide-react";
import { RECURSION_ALGORITHMS } from "@/config/algorithms";

interface RecursionControlsProps {
isPlaying: boolean;
  isPaused: boolean;
  isComplete: boolean;
  speed: number;
  input: number;
  algorithm: string;
  setAlgorithm: (slug: string) => void;
  setInput: (val: number) => void;
  generateSteps: () => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (speed: number) => void;
}

export function RecursionControls({
  isPlaying, isPaused, isComplete, speed,
  input, algorithm, setAlgorithm, setInput, generateSteps,
  onPlay, onPause, onReset, onStepForward, onStepBackward, onSpeedChange
}: RecursionControlsProps) {
  return (
    <div className="mt-6 flex flex-col gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap gap-4 items-center">
        <select value={algorithm} onChange={(e) => { setAlgorithm(e.target.value); setTimeout(generateSteps, 0); }}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
          {RECURSION_ALGORITHMS.map((a) => (
            <option key={a.slug} value={a.slug}>{a.name}</option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500 dark:text-gray-400">
            {algorithm === "tower-of-hanoi" ? "Disks:" : algorithm === "n-queens" ? "N:" : "n:"}
          </label>
          <input type="number" min={algorithm === "n-queens" ? 1 : 1} max={algorithm === "fibonacci" ? 12 : algorithm === "n-queens" ? 8 : 20}
            value={input} onChange={(e) => setInput(parseInt(e.target.value) || 1)}
            className="w-20 px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onStepBackward} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <StepBack className="w-5 h-5" />
        </button>
        {!isPlaying || isPaused ? (
          <button onClick={onPlay} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium">
            <Play className="w-4 h-4 inline mr-1" /> Play
          </button>
        ) : (
          <button onClick={onPause} className="px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium">
            <Pause className="w-4 h-4 inline mr-1" /> Pause
          </button>
        )}
        <button onClick={onStepForward} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <StepForward className="w-5 h-5" />
        </button>
        <button onClick={onReset} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-500 dark:text-gray-400">Speed:</label>
        <input type="range" min={0.1} max={10} step={0.1} value={speed} onChange={(e) => onSpeedChange(parseFloat(e.target.value))} className="w-32" />
        <span className="text-sm font-mono">{speed.toFixed(1)}x</span>
      </div>
    </div>
  );
}
