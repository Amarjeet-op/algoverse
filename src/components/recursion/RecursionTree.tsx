import { useEffect, useRef, useMemo } from "react";
import { RecursionNode, RecursionStep } from "@/lib/algorithms/recursion/types";

interface RecursionTreeProps {
  tree: RecursionNode | null;
  activeSteps: RecursionStep[];
}

export function RecursionTree({ tree, activeSteps }: RecursionTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const pushedIds = useMemo(() => new Set(activeSteps.filter(s => s.action === 'push').map(s => s.frame.id)), [activeSteps]);
  const poppedIds = useMemo(() => new Set(activeSteps.filter(s => s.action === 'pop').map(s => s.frame.id)), [activeSteps]);
  
  const activeStack = useMemo(() => activeSteps.reduce((acc: string[], s) => {
    if (s.action === 'push') acc.push(s.frame.id);
    if (s.action === 'pop') acc.pop();
    return acc;
  }, []), [activeSteps]);
  
  const currentId = activeStack[activeStack.length - 1];

  const activePathIds = useMemo(() => {
    const ids = new Set<string>();
    if (!tree || !currentId) return ids;
    const findPath = (node: RecursionNode): boolean => {
      if (node.id === currentId) { ids.add(node.id); return true; }
      for (const child of node.children) { if (findPath(child)) { ids.add(node.id); return true; } }
      return false;
    };
    findPath(tree);
    return ids;
  }, [tree, currentId]);

  const resultsMap: Record<string, string> = {};
  activeSteps.forEach(s => { if (s.frame.result !== undefined) resultsMap[s.frame.id] = String(s.frame.result); });

  useEffect(() => {
    if (currentId && containerRef.current) {
      const activeEl = containerRef.current.querySelector(`[data-node-id="${currentId}"]`);
      if (activeEl) activeEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }, [currentId]);

  if (!tree) return <div className="empty-state">Select parameters and click Start</div>;

  return (
    <div className="rtree-root">
      <div className="rtree-header">RECURSION FLOW ENGINE</div>
      <div className="rtree-viewport" ref={containerRef}>
        <div className="rtree-canvas">
          <TreeNode 
            node={tree} 
            pushedIds={pushedIds} 
            poppedIds={poppedIds} 
            currentId={currentId} 
            resultsMap={resultsMap}
            activePathIds={activePathIds}
            isRoot={true}
          />
        </div>
      </div>
      
      <style jsx global>{`
        .rtree-root {
          background: #050505;
          border-radius: 12px;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          color: white;
          font-family: 'JetBrains Mono', monospace;
        }
        .rtree-header {
          padding: 8px 16px;
          background: #000;
          border-bottom: 1px solid #111;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 3px;
          color: #333;
        }
        .rtree-viewport {
          flex: 1;
          overflow: auto;
          padding: 100px;
          background-image: 
            radial-gradient(rgba(204, 255, 0, 0.05) 1px, transparent 1px);
          background-size: 30px 30px;
          position: relative;
        }
        .rtree-canvas {
          display: flex;
          justify-content: center;
          min-width: min-content;
        }

        /* --- THE NODES --- */
        .t-node { display: flex; flex-direction: column; align-items: center; position: relative; }
        .t-box-wrap { position: relative; z-index: 50; padding-bottom: 40px; }

        .t-box {
          background: rgba(17, 17, 17, 0.8);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 8px 20px;
          min-width: 100px;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }

        .t-box.active {
          border-color: var(--lime);
          background: rgba(184, 255, 0, 0.15);
          transform: scale(1.15) translateY(-4px);
          box-shadow: 0 0 30px var(--lime), 0 0 60px rgba(184, 255, 0, 0.2);
          z-index: 60;
        }
        
        .t-box.completed {
          border-color: #9333ea;
          background: rgba(147, 51, 234, 0.05);
          opacity: 0.8;
        }

        .t-lbl { font-size: 12px; font-weight: 700; color: #fff; letter-spacing: 0.5px; }
        .t-res { font-size: 11px; color: var(--lime); margin-top: 6px; font-weight: 900; text-shadow: 0 0 10px rgba(184, 255, 0, 0.6); }

        /* --- VIBRANT CONNECTORS --- */
        
        /* 1. Stem down */
        .t-box-wrap::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 2px;
          height: 40px;
          background: #222;
          display: none;
        }
        .has-children > .t-box-wrap::after { display: block; }
        
        /* Highlighting active path stems */
        .is-on-path.has-children > .t-box-wrap::after { 
          background: var(--lime); 
          box-shadow: 0 0 15px rgba(184,255,0,0.4); 
          z-index: 10; 
          width: 2px; 
        }

        .t-children { display: flex; list-style: none; padding: 0; margin: 0; }
        .t-child-li { position: relative; padding: 40px 15px 0 15px; }

        /* Bridge */
        .t-child-li::before, .t-child-li::after {
          content: '';
          position: absolute;
          top: 0;
          width: 50%;
          height: 2px;
          background: #222;
          z-index: 1;
        }
        .t-child-li::before { left: 0; }
        .t-child-li::after { right: 0; }
        .t-child-li:first-child::before { display: none; }
        .t-child-li:last-child::after { display: none; }

        /* Ticks */
        .t-child-li .t-tick {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          width: 2px;
          height: 40px;
          background: #222;
          z-index: 2;
        }
        
        /* Active Ticks Glow */
        .t-child-li.is-on-path .t-tick {
          background: var(--lime);
          width: 2px;
          box-shadow: 0 0 15px rgba(184,255,0,0.4);
          z-index: 10;
        }

        .empty-state { height:100%; display:flex; align-items:center; justify-content:center; color:#222; font-size:10px; font-weight:900; letter-spacing:4px; }
      `}</style>
    </div>
  );
}

function TreeNode({ node, pushedIds, poppedIds, currentId, resultsMap, isRoot, activePathIds }: { 
  node: RecursionNode; 
  pushedIds: Set<string>; 
  poppedIds: Set<string>;
  currentId: string | undefined;
  resultsMap: Record<string, string>;
  isRoot?: boolean;
  activePathIds: Set<string>;
}) {
  const isPushed = pushedIds.has(node.id);
  const isPopped = poppedIds.has(node.id);
  const isActive = node.id === currentId;
  const isOnPath = activePathIds.has(node.id);
  const result = resultsMap[node.id];

  if (!isRoot && !isPushed) return null;

  const visibleChildren = node.children.filter(c => pushedIds.has(c.id));

  return (
    <div className={`t-node ${visibleChildren.length > 0 ? 'has-children' : ''} ${isOnPath ? 'is-on-path' : ''}`}>
      <div className="t-box-wrap">
        <div 
          className={`t-box ${isActive ? 'active' : ''} ${isPopped ? 'completed' : ''}`}
          data-node-id={node.id}
        >
          <div className="t-lbl">{node.label}</div>
          {result !== undefined && (
            <div className="t-res">→ {result}</div>
          )}
        </div>
      </div>
      
      {visibleChildren.length > 0 && (
        <div className="t-children">
          {visibleChildren.map((child) => (
            <div 
              key={child.id} 
              className={`t-child-li ${activePathIds.has(child.id) ? 'is-on-path' : ''}`}
            >
              <div className="t-tick" />
              <TreeNode 
                node={child} 
                pushedIds={pushedIds} 
                poppedIds={poppedIds} 
                currentId={currentId} 
                resultsMap={resultsMap}
                activePathIds={activePathIds}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
