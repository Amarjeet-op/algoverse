"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSortingStore } from "@/lib/store/sortingStore";
import { useAnimation } from "@/lib/hooks/useAnimation";
import { ComplexityInfo } from "@/components/shared/ComplexityInfo";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CODE_SNIPPETS } from "@/config/codeSnippets";
import { SORTING_ALGORITHMS } from "@/config/algorithms";
import { Shell } from "@/components/layout/Shell";
import { SortingBars } from "@/components/sorting/SortingBars";

export default function SortingPage() {
  const array = useSortingStore((s) => s.array);
  const steps = useSortingStore((s) => s.steps);
  const algorithm = useSortingStore((s) => s.algorithm);
  const algorithmMeta = useSortingStore((s) => s.algorithmMetadata);
  const setArraySize = useSortingStore((s) => s.setArraySize);
  const setAlgorithm = useSortingStore((s) => s.setAlgorithm);
  const regenerate = useSortingStore((s) => s.regenerate);
  const arraySize = useSortingStore((s) => s.arraySize);

  const [cmps, setCmps] = useState(0);
  const [swps, setSwps] = useState(0);
  const [elapsed, setElapsed] = useState("0.00s");
  const [timerRef, setTimerRef] = useState<any>(null);
  const [statusText, setStatusText] = useState("IDLE");
  const [statusType, setStatusType] = useState<"idle" | "run" | "done" | "pause">("idle");

  const [mounted, setMounted] = useState(false);
  const { currentStep, isPlaying, isPaused, isComplete, play, pause, reset, speed, setSpeed, stepForward } = useAnimation({
    totalSteps: steps.length,
    speed: 1,
  });

  useEffect(() => { 
    setMounted(true);
    regenerate(); 
  }, []);

  useEffect(() => {
    reset();
  }, [steps.length]);

  useEffect(() => {
    const active = steps.slice(0, currentStep + 1);
    let c = 0, s = 0;
    for (const step of active) {
      if (step.action === 'compare') c++;
      else if (step.action === 'swap' || step.action === 'place' || step.action === 'overwrite') s++;
    }
    setCmps(c);
    setSwps(s);
  }, [currentStep, steps]);

  const t0Ref = useRef<number | null>(null);
  const intervalRef = useRef<any>(null);

  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    t0Ref.current = Date.now();
    intervalRef.current = setInterval(() => {
      setElapsed(((Date.now() - (t0Ref.current ?? Date.now())) / 1000).toFixed(2) + 's');
    }, 100);
  }, []);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  const handlePlay = useCallback(() => {
    startTimer();
    setStatusText('RUNNING');
    setStatusType('run');
    play();
  }, [play, startTimer]);

  const handlePause = useCallback(() => {
    stopTimer();
    setStatusText('PAUSED');
    setStatusType('pause');
    pause();
  }, [pause, stopTimer]);

  const handleReset = useCallback(() => {
    stopTimer();
    setCmps(0); setSwps(0); setElapsed('0.00s');
    setStatusText('IDLE'); setStatusType('idle');
    reset();
  }, [reset, stopTimer]);

  useEffect(() => {
    if (isComplete) { stopTimer(); setStatusText('COMPLETE'); setStatusType('done'); }
  }, [isComplete, stopTimer]);

  // Replay steps to get intermediate state
  const displayArray = [...array];
  const states = new Map<number, string>(); // bar color state
  const sortedSet = new Set<number>();

  for (const step of steps.slice(0, currentStep + 1)) {
    if (step.action === 'swap' && step.indices.length >= 2) {
      const [a, b] = step.indices;
      [displayArray[a], displayArray[b]] = [displayArray[b], displayArray[a]];
      states.set(a, 's');
      states.set(b, 's');
    } else if (step.action === 'place' || step.action === 'overwrite') {
      for (const idx of step.indices) states.set(idx, 'p');
    } else if (step.action === 'compare') {
      for (const idx of step.indices) states.set(idx, 'c');
    } else if (step.action === 'sorted') {
      for (const idx of step.indices) sortedSet.add(idx);
    }
  }

  if (!mounted) return null;

  return (
    <Shell status={statusType} statusText={statusText}>
      <div className="page-content">
        {/* Control Bar */}
        <div className="cbar">
          <div className="cg">
            <span className="clbl">Algorithm</span>
            <select className="asel" value={algorithm} disabled={isPlaying || isPaused} onChange={e => setAlgorithm(e.target.value)}>
              {SORTING_ALGORITHMS.map(a => <option key={a.slug} value={a.slug}>{a.name}</option>)}
            </select>
          </div>
          <div className="cdiv"></div>
          <div className="cg">
            <span className="clbl">Size</span>
            <div className="rng-wrap">
              <input type="range" min={5} max={50} value={arraySize} disabled={isPlaying || isPaused} onChange={e => setArraySize(+e.target.value)} />
              <span className="rval">{arraySize}</span>
            </div>
          </div>
          <div className="cg">
            <span className="clbl">Speed</span>
            <div className="rng-wrap">
              <input type="range" min={0.1} max={10} step={0.1} value={speed} onChange={e => setSpeed(+e.target.value)} />
              <span className="rval">{speed.toFixed(1)}x</span>
            </div>
          </div>
          <div className="cdiv"></div>
          <div className="cg">
            <button className="btn btn-p" onClick={handlePlay} disabled={isPlaying || isComplete || steps.length === 0}>▶ Run</button>
            <button className="btn btn-a" title="Pause" onClick={handlePause} disabled={!isPlaying && !isPaused}>⏸</button>
            <button className="btn btn-s" title="Step" onClick={stepForward} disabled={isPlaying || isComplete}>⏭</button>
            <button className="btn btn-d" title="Restart Visualization" onClick={handleReset}>↺ Restart</button>
            <button className="btn btn-i" title="Randomize Array" onClick={regenerate} disabled={isPlaying || isPaused}>⟳ Randomize</button>
          </div>
          <div className="stats-row">
            <div className="schip"><span className="sl">CMP</span><span className="sv">{cmps}</span></div>
            <div className="schip"><span className="sl">SWP</span><span className="sv">{swps}</span></div>
            <div className="schip"><span className="sl">TIME</span><span className="sv">{elapsed}</span></div>
          </div>
        </div>

        {/* Split viz | code */}
        {displayArray.length > 0 ? (() => {
          const maxVal = Math.max(...displayArray, 1);
          const showVals = displayArray.length <= 60;

          return (
            <div className="split-row" style={{ minHeight: 0 }}>
              <div className="split-left" style={{ minHeight: 0 }}>
                <div className="viz" style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
                  <SortingBars 
                    array={array} 
                    activeSteps={steps.slice(0, currentStep + 1)} 
                  />
                </div>
                <div className="info-row">
                  <div className="sort-legend" style={{ display: 'flex', gap: '15px', alignItems: 'center', marginLeft: 'auto' }}>
                    <div className="pl-i" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#c8ccdf' }}>
                      <span style={{ width: 12, height: 12, borderRadius: 3, background: "#3b82f6", boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)', display: 'inline-block' }}></span>
                      Default
                    </div>
                    <div className="pl-i" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#c8ccdf' }}>
                      <span style={{ width: 12, height: 12, borderRadius: 3, background: "#ffba00", boxShadow: '0 0 8px rgba(255, 186, 0, 0.5)', display: 'inline-block' }}></span>
                      Comparing
                    </div>
                    <div className="pl-i" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#c8ccdf' }}>
                      <span style={{ width: 12, height: 12, borderRadius: 3, background: "#ff4757", boxShadow: '0 0 8px rgba(255, 71, 87, 0.5)', display: 'inline-block' }}></span>
                      Swapping
                    </div>
                    <div className="pl-i" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#c8ccdf' }}>
                      <span style={{ width: 12, height: 12, borderRadius: 3, background: "#ff7f50", boxShadow: '0 0 8px rgba(255, 127, 80, 0.5)', display: 'inline-block' }}></span>
                      Placing
                    </div>
                    <div className="pl-i" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#c8ccdf' }}>
                      <span style={{ width: 12, height: 12, borderRadius: 3, background: "#aa44ff", boxShadow: '0 0 8px rgba(170, 68, 255, 0.5)', display: 'inline-block' }}></span>
                      Pivot
                    </div>
                    <div className="pl-i" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#c8ccdf' }}>
                      <span style={{ width: 12, height: 12, borderRadius: 3, background: "#b8ff00", boxShadow: '0 0 10px rgba(184, 255, 0, 0.6)', display: 'inline-block' }}></span>
                      Sorted
                    </div>
                  </div>
                </div>
              </div>
              <div className="split-right" style={{ padding: '20px', overflowY: 'auto' }}>
                <div style={{ marginBottom: 20 }}>
                  <ComplexityInfo complexity={algorithmMeta.complexity} />
                </div>
                <CodeBlock key={algorithm} code={CODE_SNIPPETS[algorithm] || ""} title={`Code: ${algorithmMeta.name}`} />
              </div>
            </div>
          );
        })() : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--textdim)" }}>Loading...</div>
        )}
      </div>
    </Shell>
  );
}
