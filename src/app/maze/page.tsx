"use client";

import { useState, useCallback, useEffect } from "react";
import { useMazeStore } from "@/lib/store/mazeStore";
import { useAnimation } from "@/lib/hooks/useAnimation";
import { MazeGrid } from "@/components/maze/MazeGrid";
import { ComplexityInfo } from "@/components/shared/ComplexityInfo";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CODE_SNIPPETS } from "@/config/codeSnippets";
import { MAZE_ALGORITHMS, PATHFINDING_ALGORITHMS } from "@/config/algorithms";
import { Shell } from "@/components/layout/Shell";

export default function MazePage() {
  const { 
    grid, rows, cols, algorithm, algorithmMetadata: algorithmMeta, 
    generateMaze, solveMaze, solutionSteps, setGridSize,
    reset: resetMaze, setAlgorithm, steps, isGenerated,
    solverAlgorithm, setSolverAlgorithm
  } = useMazeStore();

  const [statusText, setStatusText] = useState<string>("IDLE");
  const [statusType, setStatusType] = useState<"idle" | "run" | "done" | "pause">("idle");
  const [solving, setSolving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { currentStep, isPlaying, isPaused, isComplete, play, pause, reset: resetAnim, jumpToStep, speed, setSpeed, stepForward } = useAnimation({
    totalSteps: solving ? solutionSteps.length : steps.length,
    speed: 5,
  });

  useEffect(() => {
    if (steps.length === 0) generateMaze();
  }, [generateMaze, steps.length]);

  const handleGenerate = useCallback(() => {
    setSolving(false);
    resetAnim();
    generateMaze();
    setStatusText('GENERATED');
    setStatusType('done');
  }, [generateMaze, resetAnim]);

  const handleSolve = useCallback(() => {
    solveMaze();
    resetAnim();
    setSolving(true);
    setStatusText('SOLVING');
    setStatusType('run');
    play();
  }, [solveMaze, play, resetAnim]);

  const handleReset = useCallback(() => {
    pause();
    resetAnim();
    setSolving(false);
    // We don't call regenerate, just clear variables
    setStatusText('GENERATED');
    setStatusType('done');
  }, [pause, resetAnim]);

  useEffect(() => {
    if (isComplete && (steps.length > 0 || solutionSteps.length > 0)) {
      setStatusText(solving ? 'SOLVED' : 'GENERATED');
      setStatusType('done');
    }
  }, [isComplete, steps.length, solutionSteps.length, solving]);

  if (!mounted) return null;

  return (
    <Shell status={statusType} statusText={statusText}>
      <div className="page-content">
        <div className="cbar">
          <div className="cg">
            <span className="clbl">Maze</span>
            <select className="asel" style={{ width: 110 }} value={algorithm} onChange={e => setAlgorithm(e.target.value)} disabled={isPlaying || solving}>
              {MAZE_ALGORITHMS.map(a => <option key={a.slug} value={a.slug}>{a.name}</option>)}
            </select>
          </div>

          <div className="cg">
            <span className="clbl">Solver</span>
            <select className="asel" style={{ width: 100 }} value={solverAlgorithm} onChange={e => setSolverAlgorithm(e.target.value)} disabled={isPlaying || solving}>
              <option value="bfs">BFS</option>
              <option value="dfs">DFS</option>
            </select>
          </div>
          
          <div className="cdiv"></div>
          <div className="control-group" style={{ display: 'flex', alignItems: 'center' }}>
            <input 
              type="number" 
              min={5} 
              max={11} 
              value={rows} 
              title="Rows"
              onChange={(e) => setGridSize(parseInt(e.target.value) || 5, cols)} 
              style={{ width: 45, height: 24, fontSize: 11, textAlign: 'left' }}
              disabled={isPlaying || solving}
            />
            <span style={{ color: '#666', margin: '0 6px', fontSize: 12, lineHeight: 1 }}>×</span>
            <input 
              type="number" 
              min={5} 
              max={20} 
              value={cols} 
              title="Cols"
              onChange={(e) => setGridSize(rows, parseInt(e.target.value) || 5)} 
              style={{ width: 45, height: 24, fontSize: 11, textAlign: 'right' }}
              disabled={isPlaying || solving}
            />
          </div>
          <div className="cdiv"></div>

          <div className="cg">
            <span className="clbl" style={{ marginLeft: 10 }}>Speed</span>
            <input type="range" min={0.5} max={20} step={0.5} style={{width: 60}} value={speed} onChange={e => setSpeed(+e.target.value)} />
          </div>

          <div className="cdiv"></div>

          <div className="cg">
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-sc" style={{ padding: '6px 12px', fontSize: 10, background: '#333' }} onClick={handleReset}>
                RESET
              </button>
              <button className="btn btn-p" style={{ padding: '6px 12px', fontSize: 10 }} onClick={handleGenerate} disabled={isPlaying}>
                NEW MAZE
              </button>
              <button className="btn btn-s" style={{ padding: '6px 12px', fontSize: 10, minWidth: 90 }} onClick={!solving ? handleSolve : (isPlaying ? pause : play)} disabled={!isGenerated}>
                {!solving ? "SOLVE" : (isPlaying ? "PAUSE" : "RESUME")}
              </button>
              <button className="btn btn-a" style={{ padding: '6px 10px', fontSize: 10 }} onClick={() => { if (!solving) { solveMaze(); resetAnim(); setSolving(true); setStatusText('SOLVING'); setStatusType('run'); pause(); } stepForward(); }} disabled={!isGenerated}>
                STEP ▸
              </button>
            </div>
          </div>

          <div className="stats-row" style={{ marginLeft: 'auto' }}>
            <div className="schip"><span className="sl">PHASE</span><span className="sv">{statusText}</span></div>
            <div className="schip"><span className="sl">STEPS</span><span className="sv">{currentStep}</span></div>
          </div>
        </div>

        <div className="split-row" style={{ minHeight: 0 }}>
          <div className="split-left" style={{ minHeight: 0 }}>
              <div className="viz maze-wrap" style={{ 
                flex: 1,
                overflow: "hidden",
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <MazeGrid 
                  grid={grid} 
                  rows={rows} 
                  cols={cols} 
                  activeStep={currentStep} 
                  steps={solving ? solutionSteps : steps} 
                  solving={solving}
                  status={statusType}
                />
                </div>
              
              <div className="info-row" style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <div className="pl-i" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#c8ccdf' }}>
                    <span style={{ width: 12, height: 12, borderRadius: 3, background: "#10b981", boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)', display: 'inline-block' }}></span>
                    Start
                  </div>
                  <div className="pl-i" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#c8ccdf' }}>
                    <span style={{ width: 12, height: 12, borderRadius: 3, background: "#f43f5e", boxShadow: '0 0 10px rgba(244, 63, 94, 0.4)', display: 'inline-block' }}></span>
                    End
                  </div>
                  <div className="pl-i" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#c8ccdf' }}>
                    <span style={{ width: 12, height: 12, borderRadius: 3, background: "#06b6d4", display: 'inline-block' }}></span>
                    Visited
                  </div>
                  <div className="pl-i" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#c8ccdf' }}>
                    <span style={{ width: 12, height: 12, borderRadius: 3, background: "#f59e0b", boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)', display: 'inline-block' }}></span>
                    Path
                  </div>
                </div>
              </div>
          </div>

          <div className="split-right" style={{ padding: '20px', overflowY: 'auto' }}>
            <div className="tabs" style={{ display: 'flex', gap: 15, marginBottom: 20, borderBottom: '1px solid var(--bdr)', paddingBottom: 10 }}>
              <button className={`tab-btn ${!solving ? 'active' : ''}`} onClick={() => setSolving(false)} style={{ background: 'none', border: 'none', color: !solving ? 'var(--lime)' : 'var(--textdim)', cursor: 'pointer', fontSize: 11, fontWeight: 600, borderBottom: !solving ? '2px solid var(--lime)' : 'none' }}>
                GENERATOR
              </button>
              <button className={`tab-btn ${solving ? 'active' : ''}`} onClick={() => setSolving(true)} style={{ background: 'none', border: 'none', color: solving ? 'var(--lime)' : 'var(--textdim)', cursor: 'pointer', fontSize: 11, fontWeight: 600, borderBottom: solving ? '2px solid var(--purple)' : 'none' }}>
                SOLVER
              </button>
            </div>
            <div key={`meta-${solving}`} style={{ marginBottom: 20 }}>
              <ComplexityInfo complexity={solving ? (PATHFINDING_ALGORITHMS.find(a => a.slug === solverAlgorithm)!.complexity) : algorithmMeta.complexity} />
            </div>
            <CodeBlock key={`code-${solving}`} code={CODE_SNIPPETS[solving ? solverAlgorithm : algorithmMeta.slug] || ""} title={solving ? `Code: ${solverAlgorithm.toUpperCase()}` : `Code: ${algorithmMeta.name}`} language="typescript" />
          </div>
        </div>
      </div>
    </Shell>
  );
}
