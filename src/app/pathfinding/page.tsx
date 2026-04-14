"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathfindingStore } from "@/lib/store/pathfindingStore";
import { useAnimation } from "@/lib/hooks/useAnimation";
import { Grid } from "@/components/pathfinding/Grid";
import { ComplexityInfo } from "@/components/shared/ComplexityInfo";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CODE_SNIPPETS } from "@/config/codeSnippets";
import { PATHFINDING_ALGORITHMS } from "@/config/algorithms";
import { Shell } from "@/components/layout/Shell";

export default function PathfindingPage() {
  const grid = usePathfindingStore((s) => s.grid);
  const visited = usePathfindingStore((s) => s.visited);
  const path = usePathfindingStore((s) => s.path);
  const algorithm = usePathfindingStore((s) => s.algorithm);
  const algorithmMeta = usePathfindingStore((s) => s.algorithmMetadata);
  const runAlgorithmAnimated = usePathfindingStore((s) => s.runAlgorithmAnimated);
  const setAnimatedState = usePathfindingStore((s) => s.setAnimatedState);
  const reset = usePathfindingStore((s) => s.reset);
  const rows = usePathfindingStore((s) => s.rows);
  const cols = usePathfindingStore((s) => s.cols);
  const setAlgorithm = usePathfindingStore((s) => s.setAlgorithm);
  const dragMode = usePathfindingStore((s) => s.dragMode);
  const setDragMode = usePathfindingStore((s) => s.setDragMode);
  const toggleCell = usePathfindingStore((s) => s.toggleCell);
  const clearWalls = usePathfindingStore((s) => s.clearWalls);
  const steps = usePathfindingStore((s) => s.steps);

  const [mounted, setMounted] = useState(false);
  const [statusText, setStatusText] = useState("IDLE");
  const [statusType, setStatusType] = useState<"idle" | "run" | "done" | "pause">("idle");

  useEffect(() => { setMounted(true); }, []);

  const { currentStep, isPlaying, isPaused, isComplete, play, pause, reset: resetAnim, speed, setSpeed, stepForward } = useAnimation({
    totalSteps: steps.length,
    speed: 1,
  });

  useEffect(() => {
    resetAnim();
  }, [steps.length]);

  useEffect(() => {
    setAnimatedState(currentStep);
  }, [currentStep, setAnimatedState]);

  useEffect(() => {
    if (isComplete) {
      setStatusText('COMPLETE');
      setStatusType('done');
    }
  }, [isComplete]);

  const [shouldPlay, setShouldPlay] = useState(false);

  useEffect(() => {
    if (shouldPlay && steps.length > 0) {
      play();
      setShouldPlay(false);
    }
  }, [steps.length, shouldPlay, play]);

  const handleRun = useCallback(() => {
    runAlgorithmAnimated();
    setStatusText('RUNNING');
    setStatusType('run');
    setShouldPlay(true);
  }, [runAlgorithmAnimated]);

  const handlePause = useCallback(() => {
    setStatusText('PAUSED');
    setStatusType('pause');
    setShouldPlay(false);
    pause();
  }, [pause]);

  const [shouldStep, setShouldStep] = useState(false);

  useEffect(() => {
    if (shouldStep && steps.length > 0) {
      stepForward();
      setShouldStep(false);
    }
  }, [steps.length, shouldStep, stepForward]);

  const handleStep = useCallback(() => {
    if (steps.length === 0) {
      runAlgorithmAnimated();
      setShouldStep(true);
    } else {
      stepForward();
    }
  }, [steps.length, runAlgorithmAnimated, stepForward]);

  const handleReset = useCallback(() => {
    setStatusText('IDLE');
    setStatusType('idle');
    setShouldPlay(false);
    setShouldStep(false);
    reset();
    resetAnim();
  }, [reset, resetAnim]);

  if (!mounted) return null;

  return (
    <Shell status={statusType} statusText={statusText}>
      <div className="page-content">
        <div className="cbar">
          <div className="cg">
            <span className="clbl">Algorithm</span>
            <select className="asel" value={algorithm} onChange={e => setAlgorithm(e.target.value)}>
              {PATHFINDING_ALGORITHMS.map(a => <option key={a.slug} value={a.slug}>{a.name}</option>)}
            </select>
          </div>
          <div className="cdiv"></div>
          <div className="cg">
            <span className="clbl">Mode</span>
            <select className="asel" value={dragMode} onChange={e => setDragMode(e.target.value as any)}>
              <option value="wall">Draw Walls</option>
              <option value="start">Move Start</option>
              <option value="end">Move End</option>
            </select>
          </div>
          <div className="cdiv"></div>
          <div className="cg">
            <span className="clbl">Speed</span>
            <div className="rng-wrap">
              <input type="range" min={0.1} max={10} step={0.1} value={speed} onChange={e => setSpeed(+e.target.value)} />
              <span className="rval">{speed.toFixed(1)}x</span>
            </div>
          </div>
          <div className="cdiv"></div>
          <div className="cg">
            <button className="btn btn-p" onClick={handleRun} disabled={isPlaying && !isPaused}>▶ Run</button>
            <button className="btn btn-a" title="Pause" onClick={handlePause}>⏸</button>
            <button className="btn btn-s" title="Step" onClick={handleStep} disabled={isComplete}>⏭</button>
            <button className="btn btn-d" title="Restart Visualization" onClick={handleReset}>↺ Restart</button>
            <button className="btn btn-i" title="Clear Walls" onClick={clearWalls}>⟳ Clear Board</button>
          </div>
          <div className="stats-row">
            <div className="schip"><span className="sl">VISITED</span><span className="sv">{visited.length}</span></div>
            <div className="schip"><span className="sl">PATH</span><span className="sv">{path.length}</span></div>
          </div>
        </div>

        <div className="split-row" style={{ minHeight: 0 }}>
          <div className="split-left" style={{ minHeight: 0 }}>
            <div className="viz pf-outer" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <Grid grid={grid} visited={visited} path={path} rows={rows} cols={cols} toggleCell={toggleCell} dragMode={dragMode} setDragMode={setDragMode} />
            </div>
            
            <div className="info-row" style={{ padding: '15px 40px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
                <div className="pl-i" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#c8ccdf' }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: "#10b981", boxShadow: '0 0 10px rgba(16, 185, 201, 0.4)', display: 'inline-block' }}></span>
                  Start
                </div>
                <div className="pl-i" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#c8ccdf' }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: "#f43f5e", boxShadow: '0 0 10px rgba(244, 63, 94, 0.4)', display: 'inline-block' }}></span>
                  End
                </div>
                <div className="pl-i" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#c8ccdf' }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: "#475569", display: 'inline-block' }}></span>
                  Wall
                </div>
                <div className="pl-i" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#c8ccdf' }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: "rgba(6, 182, 212, 0.6)", display: 'inline-block' }}></span>
                  Visited
                </div>
                <div className="pl-i" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#c8ccdf' }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: "#f59e0b", boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)', display: 'inline-block' }}></span>
                  Path
                </div>
              </div>
            </div>
          </div>

          <div className="split-right" style={{ padding: '20px', overflowY: 'auto' }}>
            <div style={{ marginBottom: 20 }}>
              <ComplexityInfo complexity={algorithmMeta.complexity} />
            </div>
            <CodeBlock 
              code={CODE_SNIPPETS[algorithm === "astar" ? "astar" : algorithm] || ""} 
              title={`Code: ${algorithmMeta.name}`} 
            />
          </div>
        </div>
      </div>
    </Shell>
  );
}
