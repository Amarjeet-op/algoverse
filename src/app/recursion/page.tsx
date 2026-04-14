"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRecursionStore } from "@/lib/store/recursionStore";
import { useAnimation } from "@/lib/hooks/useAnimation";
import { CallStack } from "@/components/recursion/CallStack";
import { RecursionTree } from "@/components/recursion/RecursionTree";
import { ComplexityInfo } from "@/components/shared/ComplexityInfo";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CODE_SNIPPETS } from "@/config/codeSnippets";
import { RECURSION_ALGORITHMS } from "@/config/algorithms";
import { Shell } from "@/components/layout/Shell";

export default function RecursionPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const { 
    steps, tree, algorithm, input, moves, algorithmMetadata: algorithmMeta,
    generateSteps, setInput, setAlgorithm 
  } = useRecursionStore();

  const [statusText, setStatusText] = useState("IDLE");
  const [statusType, setStatusType] = useState<"idle" | "run" | "done" | "pause">("idle");
  const moveLogRef = useRef<HTMLDivElement>(null);

  const { currentStep, isPlaying, isPaused, isComplete, play, pause, reset, speed, setSpeed, stepForward } = useAnimation({
    totalSteps: steps.length,
    speed: 1,
  });

  useEffect(() => { 
    setHasMounted(true);
    generateSteps(); 
  }, []);

  const activeSteps = steps.slice(0, currentStep + 1);
  const totalCalls = activeSteps.filter(s => s.action === 'push').length;
  const maxDepth = Math.max(0, ...activeSteps.filter(s => s.action === 'push').map(s => (s.frame?.depth || 0)));
  const lastResult = [...activeSteps].reverse().find(s => s.frame?.result)?.frame?.result ?? "—";

  const nQueensBoard = useMemo(() => {
    if (algorithm !== 'n-queens') return null;
    const board = Array(input).fill(-1);
    activeSteps.forEach(s => {
      if (s.action === 'push' || s.action === 'compute') {
        const row = parseInt(s.frame.args[0]);
        const col = parseInt(s.frame.args[1]);
        if (!isNaN(row) && !isNaN(col)) {
          if (s.frame.result?.includes('Queen')) {
            board[row] = col;
          } else if (s.action === 'push') {
             board[row] = col;
          }
        }
      }
      if (s.action === 'pop' && s.frame.name === 'queen-remove') {
        const row = parseInt(s.frame.args[0]);
        board[row] = -1;
      }
    });
    return board;
  }, [activeSteps, algorithm, input]);

  const handlePlay = useCallback(() => { 
    if (steps.length === 0) generateSteps();
    setStatusText('RUNNING'); 
    setStatusType('run'); 
    play(); 
  }, [play, generateSteps, steps.length]);

  const handlePause = useCallback(() => { setStatusText('PAUSED'); setStatusType('pause'); pause(); }, [pause]);
  const handleReset = useCallback(() => { setStatusText('IDLE'); setStatusType('idle'); reset(); }, [reset]);

  useEffect(() => {
    if (isComplete) { setStatusText('COMPLETE'); setStatusType('done'); }
  }, [isComplete]);

  useEffect(() => {
    if (moveLogRef.current) moveLogRef.current.scrollTop = moveLogRef.current.scrollHeight;
  }, [currentStep, algorithm]);

  if (!hasMounted) return null;

  return (
    <Shell status={statusType} statusText={statusText}>
      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="cbar">
          <div className="cg">
            <span className="clbl">Algo</span>
            <select className="asel" style={{ width: 140 }} value={algorithm} onChange={e => { setAlgorithm(e.target.value); }}>
              {RECURSION_ALGORITHMS.map(a => <option key={a.slug} value={a.slug}>{a.name}</option>)}
            </select>
          </div>
          <div className="cg">
            <span className="clbl" style={{ marginLeft: 8 }}>N =</span>
            <input 
              className="num-in" 
              type="number" 
              min={1} 
              max={algorithm === 'tower-of-hanoi' ? 8 : algorithm === 'fibonacci' ? 12 : algorithm === 'n-queens' ? 8 : 20}
              value={input} 
              onChange={e => { const v = parseInt(e.target.value); if (!isNaN(v)) setInput(v); }} 
            />
          </div>
          <div className="cdiv"></div>
          <div className="cg">
            <span className="clbl">Speed</span>
            <div className="rng-wrap">
              <input type="range" min={0.5} max={10} step={0.5} style={{ width: 60 }} value={speed} onChange={e => setSpeed(+e.target.value)} />
              <span className="rval" style={{ minWidth: 35 }}>{speed.toFixed(1)}x</span>
            </div>
          </div>
          <div className="cdiv"></div>
          <div className="cg">
            <button className="btn btn-p" onClick={handlePlay} disabled={isComplete}>
              ▶ {statusType === 'idle' ? 'Visualize' : 'Resume'}
            </button>
            <button className="btn btn-a" onClick={handlePause}>⏸</button>
            <button className="btn btn-d" onClick={handleReset}>↺ Reset</button>
          </div>
          <div className="stats-row">
            <div className="schip"><span className="sl">CALLS</span><span className="sv">{totalCalls}</span></div>
            <div className="schip"><span className="sl">DEPTH</span><span className="sv">{maxDepth}</span></div>
            <div className="schip"><span className="sl">RESULT</span><span className="sv">{lastResult}</span></div>
          </div>
        </div>

        <div className="split-row" style={{ flex: 1, minHeight: 0 }}>
          <div className="split-left" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="viz-card" style={{ flex: 1, borderRadius: 'var(--r)', overflow: 'hidden', border: '1px solid var(--bdr)', background: 'var(--bg2)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <RecursionTree tree={tree} activeSteps={activeSteps} />
              </div>
              
              {algorithm === 'n-queens' && nQueensBoard && (
                <div style={{ height: 260, borderTop: '1px solid var(--bdr)', background: 'var(--bg1)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${input}, 30px)`, gap: 1, border: '2px solid var(--bdr)', background: 'var(--bdr)' }}>
                    {Array.from({ length: input * input }).map((_, i) => {
                      const row = Math.floor(i / input);
                      const col = i % input;
                      const hasQueen = nQueensBoard[row] === col;
                      const isBlack = (row + col) % 2 === 1;
                      return (
                        <div key={i} style={{ 
                          width: 30, height: 30, background: isBlack ? '#2e2e2e' : '#4a4a4a', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
                        }}>
                          {hasQueen && <span style={{ color: 'var(--lime)', filter: 'drop-shadow(0 0 5px var(--lime))' }}>♛</span>}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginLeft: 30, color: 'var(--textdim)', fontSize: 11 }}>
                    <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>BOARD STATE</div>
                    <div style={{ fontFamily: 'monospace' }}>
                      {nQueensBoard.map((c, r) => (
                        <div key={r}>Row {r}: {c === -1 ? 'Empty' : `Col ${c}`}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="split-right" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
            <div className="right-scroll-container" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--bg1)', paddingBottom: 12 }}>
                 <ComplexityInfo complexity={algorithmMeta.complexity} />
              </div>
              
              <div className="section-block">
                <CodeBlock code={CODE_SNIPPETS[algorithm] || ""} title={`Code: ${algorithmMeta.name}`} />
              </div>
              
              <div className="section-block" style={{ marginTop: 24 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--textdim)', marginBottom: 12, letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--lime)' }}></div>
                  LIVE CALL STACK
                </div>
                <CallStack activeSteps={activeSteps} />
              </div>

              {algorithm === "tower-of-hanoi" && moves.length > 0 && (
                <div style={{ marginTop: 24 }}>
                   <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--textdim)', marginBottom: 12, letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--coral)' }}></div>
                    FULL MOVES LOG
                  </div>
                  <div ref={moveLogRef} style={{ maxHeight: 250, overflowY: 'auto', padding: "16px", background: "var(--bg2)", border: "1px solid var(--bdr)", borderRadius: 'var(--r)', fontSize: 10, fontFamily: "monospace", color: "var(--textdim)", scrollBehavior: 'smooth' }}>
                    {moves.slice(0, Math.floor(currentStep / 2) + 1).map((m, i) => (
                      <div key={i} style={{ padding: '2px 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                        <span style={{ color: 'var(--coral)', marginRight: 8 }}>[{i + 1}]</span> → {m}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
