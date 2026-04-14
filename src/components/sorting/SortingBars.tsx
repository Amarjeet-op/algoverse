import { useMemo } from "react";
import { SortingStep } from "@/lib/algorithms/sorting/types";

interface SortingBarsProps {
  array: number[];
  activeSteps: SortingStep[];
}

export function SortingBars({ array, activeSteps }: SortingBarsProps) {
  if (!array.length) return <div className="empty-state">INITIALIZING...</div>;

  const { currentArray, states, sortedSet } = useMemo(() => {
    const displayArray = [...array];
    const sorted = new Set<number>();
    const currentStates = new Map<number, string>();

    // Process all steps to get the current array values
    for (const step of activeSteps) {
      if (step.action === 'swap') {
        const [a, b] = step.indices;
        if (a !== undefined && b !== undefined) {
          [displayArray[a], displayArray[b]] = [displayArray[b], displayArray[a]];
        }
      } else if (step.action === 'place' || step.action === 'overwrite') {
        const [idx] = step.indices;
        if (idx !== undefined && step.value !== undefined) {
          displayArray[idx] = step.value;
        }
      } else if (step.action === 'sorted') {
        for (const idx of step.indices) sorted.add(idx);
      }
    }

    // FIX: To ensure we see animations even at high speeds or with "jumped" steps,
    // we look at the last FEW steps added to the slice.
    const lookback = 3; 
    const recentSteps = activeSteps.slice(-lookback);

    for (const step of recentSteps) {
      const type = 
        step.action === 'compare' ? 'comparing' :
        step.action === 'swap' ? 'swapping' :
        step.action === 'pivot' ? 'pivoting' :
        (step.action === 'place' || step.action === 'overwrite') ? 'placing' : 
        'default';

      if (type !== 'default') {
        step.indices.forEach(idx => currentStates.set(idx, type));
      }
    }

    return { currentArray: displayArray, states: currentStates, sortedSet: sorted };
  }, [array, activeSteps]);

  const maxVal = Math.max(...currentArray, 1);
  const showLabels = currentArray.length <= 50;

  return (
    <div className="s-container">
      <div className="s-bars-area">
        {currentArray.map((val, i) => {
          const isSorted = sortedSet.has(i);
          const state = isSorted ? 'sorted' : states.get(i) || 'default';
          const height = (val / maxVal) * 100;
          
          return (
            <div
              key={i}
              className={`s-bar-wrap ${state}`}
              style={{ 
                height: `${height}%`,
                flex: 1,
                minWidth: array.length > 100 ? 1 : 2
              }}
            >
              {showLabels && <div className="s-bar-label">{val}</div>}
              <div className="s-bar-core" style={{ height: '100%' }} />
              <div className="s-bar-aura" />
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        .s-container {
          height: 100%; width: 100%;
          background: #0a0b10; display: flex; flex-direction: column; position: relative;
        }
        .s-bars-area {
          flex: 1; display: flex; align-items: flex-end; justify-content: center;
          gap: 1px; padding: 30px 10px 10px; position: relative;
          overflow: hidden;
        }
        .s-bar-wrap {
          position: relative; transition: height 0.05s linear;
          display: flex; flex-direction: column; justify-content: flex-end;
          flex: 1;
          min-width: 1px;
        }

        .s-bar-label {
          position: absolute; bottom: calc(100% + 10px); left: 50%;
          transform: translateX(-50%); font-size: 10px; font-family: var(--font-mono);
          color: #fff; font-weight: 700; pointer-events: none; z-index: 50;
          text-shadow: 0 0 4px #000;
        }

        .s-bar-core { width: 100%; height: 100%; border-radius: 2px 2px 0 0; z-index: 2; position: relative; }
        .s-bar-aura { position: absolute; inset: -2px; filter: blur(5px); opacity: 0.1; z-index: 1; border-radius: 4px; }

        .s-bar-wrap.default .s-bar-core { background: #3b82f6; }
        .s-bar-wrap.comparing .s-bar-core { background: #ffba00; } /* EXACT BUBBLE SORT AMBER */
        .s-bar-wrap.comparing .s-bar-aura { background: #ffba00; opacity: 0.3; }
        .s-bar-wrap.comparing .s-bar-label { color: #ffba00; }

        .s-bar-wrap.swapping .s-bar-core { background: #ff4757; } /* Red */
        .s-bar-wrap.swapping .s-bar-aura { background: #ff4757; opacity: 0.5; }
        .s-bar-wrap.swapping .s-bar-label { color: #ff4757; }

        .s-bar-wrap.placing .s-bar-core { background: #ff7f50; } /* Coral */
        .s-bar-wrap.placing .s-bar-aura { background: #ff7f50; opacity: 0.4; }

        .s-bar-wrap.pivoting .s-bar-core { background: #aa44ff; }
        .s-bar-wrap.pivoting .s-bar-aura { background: #aa44ff; opacity: 0.3; }

        .s-bar-wrap.sorted .s-bar-core { background: #b8ff00; } /* GREEN */
        .s-bar-wrap.sorted .s-bar-aura { background: #b8ff00; opacity: 0.15; }

        .empty-state { flex: 1; display: flex; align-items: center; justify-content: center; color: #444; }
      `}</style>
    </div>
  );
}
