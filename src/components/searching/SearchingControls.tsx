import { Play, Pause, RotateCcw, StepForward, StepBack, Shuffle } from "lucide-react";
import { SEARCHING_ALGORITHMS } from "@/config/algorithms";

interface SearchingControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  isComplete: boolean;
  speed: number;
  target: number;
  arraySize: number;
  algorithm: string;
  setArraySize: (size: number) => void;
  setAlgorithm: (slug: string) => void;
  setTarget: (val: number) => void;
  regenerate: () => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (speed: number) => void;
}

export function SearchingControls({
  isPlaying, isPaused, isComplete, speed,
  target, arraySize, algorithm, setArraySize, setAlgorithm,
  setTarget, regenerate, onPlay, onPause, onReset, onStepForward, onStepBackward, onSpeedChange
}: SearchingControlsProps) {
  return (
    <div className="mt-6 flex flex-col gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Algorithm selector */}
        <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
          {SEARCHING_ALGORITHMS.map((a) => (
            <option key={a.slug} value={a.slug}>{a.name}</option>
          ))}
        </select>

        {/* Target value */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500 dark:text-gray-400">Target:</label>
          <input type="number" value={target} onChange={(e) => setTarget(parseInt(e.target.value))}
            className="w-20 px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button onClick={onStepBackward} disabled={isComplete} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30">
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
        <button onClick={onStepForward} disabled={isComplete} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30">
          <StepForward className="w-5 h-5" />
        </button>
        <button onClick={onReset} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <RotateCcw className="w-5 h-5" />
        </button>
        <button onClick={regenerate} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <Shuffle className="w-5 h-5" />
        </button>
      </div>

      {/* Speed and Size */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500 dark:text-gray-400">Speed:</label>
          <input type="range" min={0.1} max={10} step={0.1} value={speed} onChange={(e) => onSpeedChange(parseFloat(e.target.value))} className="w-32" />
          <span className="text-sm font-mono">{speed.toFixed(1)}x</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500 dark:text-gray-400">Size:</label>
          <input type="range" min={5} max={50} value={arraySize} onChange={(e) => setArraySize(parseInt(e.target.value))} className="w-32" />
          <span className="text-sm font-mono">{arraySize}</span>
        </div>
      </div>
    </div>
  );
}
