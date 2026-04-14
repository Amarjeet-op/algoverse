"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchingStore } from "@/lib/store/searchingStore";
import { useAnimation } from "@/lib/hooks/useAnimation";
import { ComplexityInfo } from "@/components/shared/ComplexityInfo";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CODE_SNIPPETS } from "@/config/codeSnippets";
import { SEARCHING_ALGORITHMS } from "@/config/algorithms";
import { Shell } from "@/components/layout/Shell";

export default function SearchingPage() {
  const array = useSearchingStore((s) => s.array);
  const steps = useSearchingStore((s) => s.steps);
  const algorithm = useSearchingStore((s) => s.algorithm);
  const algorithmMeta = useSearchingStore((s) => s.algorithmMetadata);
  const target = useSearchingStore((s) => s.targetValue);
  const setTarget = useSearchingStore((s) => s.setTarget);
  const setAlgorithm = useSearchingStore((s) => s.setAlgorithm);
  const regenerate = useSearchingStore((s) => s.regenerate);
  const arraySize = useSearchingStore((s) => s.arraySize);
  const setArraySize = useSearchingStore((s) => s.setArraySize);
  const generateSteps = useSearchingStore((s) => s.generateSteps);

  const [cmps, setCmps] = useState(0);
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
    let c = 0;
    for (const step of active) if (step.action === 'check') c++;
    setCmps(c);
  }, [currentStep, steps]);

  const [shouldPlay, setShouldPlay] = useState(false);
  useEffect(() => {
    if (shouldPlay && steps.length > 0) {
      play();
      setShouldPlay(false);
    }
  }, [steps.length, shouldPlay, play]);

  const handlePlay = useCallback(() => { 
    if (steps.length === 0) generateSteps();
    setStatusText('RUNNING'); 
    setStatusType('run'); 
    setShouldPlay(true);
  }, [generateSteps, steps.length]);

  const handlePause = useCallback(() => { 
    setStatusText('PAUSED'); 
    setStatusType('pause'); 
    pause(); 
    setShouldPlay(false);
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
      generateSteps();
      setShouldStep(true);
    } else {
      stepForward();
    }
  }, [steps.length, generateSteps, stepForward]);

  const handleReset = useCallback(() => { 
    setCmps(0); 
    setStatusText('IDLE'); 
    setStatusType('idle'); 
    reset(); 
    setShouldPlay(false);
    setShouldStep(false);
  }, [reset]);

  useEffect(() => {
    if (isComplete) { setStatusText('COMPLETE'); setStatusType('done'); }
  }, [isComplete]);

  const activeSteps = steps.slice(0, currentStep + 1);
  const latest = activeSteps[activeSteps.length - 1];

  // Determine cell states
  const cellStates = new Map<number, string>();
  for (const step of activeSteps) {
    if (step.index !== undefined) {
      if (step.action === 'found') cellStates.set(step.index, 'found');
      else if (step.action === 'eliminate') cellStates.set(step.index, 'eliminated');
      else if (step.action === 'midpoint') cellStates.set(step.index, 'midpoint');
      else if (step.action === 'check') cellStates.set(step.index, 'checking');
    }
  }

  if (!mounted) return null;

  return (
    <Shell status={statusType} statusText={statusText}>
      <style jsx>{`
        @keyframes searchPulse {
          0% { box-shadow: 0 0 20px var(--blue), 0 0 40px rgba(41, 121, 255, 0.4); }
          100% { box-shadow: 0 0 40px var(--blue), 0 0 80px rgba(41, 121, 255, 0.8); }
        }
        .animate-search-pulse {
          animation: searchPulse 0.8s infinite alternate ease-in-out;
        }
      `}</style>
      <div className="page-content">
        <div className="cbar">
          <div className="cg">
            <span className="clbl">Algo</span>
            <select className="asel" style={{ width: 140 }} value={algorithm} disabled={isPlaying || isPaused} onChange={e => setAlgorithm(e.target.value)}>
              {SEARCHING_ALGORITHMS.map(a => <option key={a.slug} value={a.slug}>{a.name}</option>)}
            </select>
            <span className="clbl" style={{ marginLeft: 8 }}>Find</span>
            <input className="num-in" type="number" value={target} disabled={isPlaying || isPaused} onChange={e => {
              const v = parseInt(e.target.value); if (!isNaN(v)) setTarget(v);
            }} />
          </div>
          <div className="cdiv"></div>
          <div className="cg">
            <span className="clbl">Size</span>
            <div className="rng-wrap">
              <input type="range" min={5} max={50} style={{ width: 60 }} value={arraySize} disabled={isPlaying || isPaused} onChange={e => setArraySize(+e.target.value)} />
              <span className="rval" style={{ minWidth: 20 }}>{arraySize}</span>
            </div>
          </div>
          <div className="cg">
            <span className="clbl" style={{ marginLeft: 4 }}>Speed</span>
            <div className="rng-wrap">
              <input type="range" min={0.1} max={10} step={0.1} style={{ width: 60 }} value={speed} onChange={e => setSpeed(+e.target.value)} />
              <span className="rval" style={{ minWidth: 35 }}>{speed.toFixed(1)}x</span>
            </div>
          </div>
          <div className="cdiv"></div>
          <div className="cg">
            <button className="btn btn-p" onClick={handlePlay} disabled={isPlaying || isComplete}>▶ Run</button>
            <button className="btn btn-a" title="Pause" onClick={handlePause} disabled={!isPlaying && !isPaused}>⏸</button>
            <button className="btn btn-s" title="Step Forward" onClick={handleStep} disabled={isPlaying || isComplete}>⏭</button>
            <button className="btn btn-d" title="Restart Visualization" onClick={handleReset}>↺ Restart</button>
            <button className="btn btn-i" title="Randomize Array" onClick={regenerate} disabled={isPlaying || isPaused}>⟳ Randomize</button>
          </div>
          <div className="stats-row">
            <div className="schip"><span className="sl">CMP</span><span className="sv">{cmps}</span></div>
          </div>
        </div>

        <div className="split-row" style={{ minHeight: 0 }}>
          <div className="split-left" style={{ minHeight: 0 }}>
            <div className="viz sc-outer" style={{ padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, background: 'radial-gradient(circle at center, rgba(41,121,255,0.05) 0%, transparent 70%)' }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center", maxWidth: 800 }}>
                {array.map((val, i) => {
                  const state = cellStates.get(i) || 'default';
                  const isLarge = array.length > 20;
                  
                  const isChecking = state === 'checking';
                  const isFound = state === 'found';
                  const isMid = state === 'midpoint';
                  const isElim = state === 'eliminated';

                  const baseBg = isFound ? '#b8ff00' : isChecking ? '#2979ff' : isMid ? '#ffab00' : isElim ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)';
                  const glowColor = isFound ? 'rgba(184,255,0,0.6)' : isChecking ? 'rgba(41,121,255,0.6)' : isMid ? 'rgba(255,171,0,0.4)' : 'transparent';
                  
                  return (
                    <div key={i} className={`search-cell ${state} ${isChecking ? 'animate-search-pulse' : ''}`} style={{
                      width: isLarge ? 36 : 50,
                      height: isLarge ? 36 : 50,
                      fontSize: isLarge ? 12 : 16,
                      fontWeight: 800,
                      background: baseBg,
                      color: isFound ? '#000' : '#fff',
                      boxShadow: (isChecking || isFound || isMid) ? `0 0 20px ${glowColor}, 0 0 40px ${glowColor}` : 'none',
                      border: (isChecking || isFound || isMid) ? '1px solid #fff' : '1px solid rgba(255,255,255,0.1)',
                      transform: isChecking ? 'scale(1.2) translateY(-5px)' : isFound ? 'scale(1.3)' : 'scale(1)',
                      zIndex: isFound ? 30 : isChecking ? 20 : 1,
                      opacity: isElim ? 0.2 : 1,
                      filter: isElim ? 'grayscale(1)' : 'none',
                      position: 'relative',
                      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}>
                      <span style={{ position: 'relative', zIndex: 10 }}>{val}</span>
                      {(isChecking || isFound || isMid) && (
                        <div style={{
                          position: 'absolute',
                          inset: -15,
                          background: glowColor,
                          filter: 'blur(30px)',
                          opacity: 0.9,
                          zIndex: -1,
                          borderRadius: '50%'
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div style={{ height: 60, marginTop: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {latest && (
                  <div className="status-badge" style={{ 
                    fontFamily: "var(--f-mono)", 
                    padding: '10px 24px', 
                    borderRadius: 30,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: isComplete && latest?.action === 'found' ? '0 0 20px rgba(184,255,0,0.2)' : 'none',
                    fontSize: 13,
                    letterSpacing: 0.5
                  }}>
                    {latest.action === 'found' && <span style={{ color: "var(--lime)", fontWeight: 800 }}>✔ TARGET LOCATED: {target} at index {latest.index}</span>}
                    {latest.action === 'notFound' && <span style={{ color: "var(--coral)", fontWeight: 800 }}>✘ SEARCH TERMINATED: {target} not found</span>}
                    {latest.action === 'check' && <span>SCANNING INDEX <span style={{ color: 'var(--blue)', fontWeight: 800 }}>{latest.index}</span> (VAL: {array[latest.index]})</span>}
                    {latest.action === 'midpoint' && <span>OPTIMIZING SEARCH SPACE: Midpoint index <span style={{ color: 'var(--amber)', fontWeight: 800 }}>{latest.index}</span></span>}
                    {latest.action === 'eliminate' && <span style={{ opacity: 0.5 }}>PRUNING DATA RANGE: Index {latest.index}...</span>}
                  </div>
                )}
              </div>
            </div>
            <div className="info-row" style={{ padding: '10px 40px', background: 'transparent', borderTop: 'none' }}>
              <div className="sort-legend" style={{ display: 'flex', gap: 15, flexWrap: "wrap", justifyContent: 'center', margin: '0 auto' }}>
                <div className="pl-i" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#c8ccdf' }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: "#2979ff", boxShadow: '0 0 10px rgba(41, 121, 255, 0.4)', display: 'inline-block' }}></span>
                  Checking
                </div>
                <div className="pl-i" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#c8ccdf' }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: "#ffab00", boxShadow: '0 0 10px rgba(255, 171, 0, 0.4)', display: 'inline-block' }}></span>
                  Midpoint
                </div>
                <div className="pl-i" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#c8ccdf' }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: "#b8ff00", boxShadow: '0 0 10px rgba(184, 255, 0, 0.5)', display: 'inline-block' }}></span>
                  Found
                </div>
                <div className="pl-i" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#c8ccdf' }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: "#111", border: '1px solid #333', display: 'inline-block' }}></span>
                  Eliminated
                </div>
              </div>
            </div>
          </div>

          <div className="split-right">
            <CodeBlock code={CODE_SNIPPETS[algorithm] || ""} title={`${algorithmMeta.name}: Implementation`} alwaysOpen />
          </div>
        </div>
      </div>
    </Shell>
  );
}
