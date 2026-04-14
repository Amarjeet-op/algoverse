import { MazeCell, MazeStep, CellWall } from "@/lib/utils/maze";

interface MazeGridProps {
  grid: MazeCell[][];
  rows: number;
  cols: number;
  activeStep?: number;
  steps?: MazeStep[];
  solving?: boolean;
  status: 'idle' | 'run' | 'done' | 'pause';
}

export function MazeGrid({ grid, rows, cols, activeStep, steps, solving, status }: MazeGridProps) {
  // We use CSS-driven responsive sizing to ensure we never exceed the viewport or container.
  // We'll pass the calculated size as a CSS variable or use it in the grid styles.
  const cellSizeCss = `min(calc(45vw / ${cols}), calc(50vh / ${rows}), 30px)`;

  // Replay CARVE steps ONLY if we are actively 'running' the generator.
  // In all other cases (done, idle, solving), we start with the final generated grid walls.
  const reachedEnd = activeStep === undefined || !steps || activeStep >= steps.length - 1;
  const isGeneratingReplay = status === 'run' && !solving && !reachedEnd;

  const displayGrid = grid.map(r => r.map(c => {
    return {
      ...c,
      walls: isGeneratingReplay ? new Set(['top', 'bottom', 'left', 'right'] as CellWall[]) : new Set(c.walls),
      isV: false,
      isS: false,
      isP: false,
      isC: false
    };
  }));
  
  if (activeStep !== undefined && steps && steps.length > 0) {
    const currentSteps = steps.slice(0, activeStep + 1);
    currentSteps.forEach((step, idx) => {
      const cell = displayGrid[step.row][step.col];
      
      if (step.type === 'visit') cell.isV = true;
      if (step.type === 'solve') cell.isS = true;
      if (step.type === 'path') cell.isP = true;
      
      if (step.type === 'carve' && step.wallToRemove && step.target) {
        cell.walls.delete(step.wallToRemove);
        const opp: Record<CellWall, CellWall> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
        displayGrid[step.target.r][step.target.c].walls.delete(opp[step.wallToRemove]);
      }
      
      if (idx === activeStep) cell.isC = true;
    });
  }

  return (
    <div className="maze-container" style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      overflow: 'auto', // Defensive scroll if it still overflows
      padding: '20px'
    }}>
      <div className="maze-frame" style={{
        padding: "6px",
        background: "#7c3aed",
        borderRadius: "8px",
        boxShadow: "0 0 50px rgba(124, 58, 237, 0.4)",
        display: "inline-block", // Ensure frame hugs the board
        margin: 'auto'
      }}>
        <div className="maze-board" style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${cellSizeCss})`,
          gridTemplateRows: `repeat(${rows}, ${cellSizeCss})`,
          background: "#080808",
          borderRight: "2px solid #7c3aed",
          borderBottom: "2px solid #7c3aed",
        }}>
          {displayGrid.flat().map((cell) => {
            let cellClass = "";
            if (cell.isC) cellClass = "curr";
            else if (cell.isP) cellClass = "path";
            else if (cell.isS) cellClass = "scan";
            else if (cell.isV) cellClass = "hist";

            const isStart = cell.row === 0 && cell.col === 0;
            const isEnd = cell.row === rows - 1 && cell.col === cols - 1;

            const wallCol = "#7c3aed";
            const wallSty = `2px solid ${wallCol}`;

            return (
              <div
                key={`${cell.row}-${cell.col}`}
                className={`mcell ${cellClass}`}
                style={{
                  width: "100%", // Fill the grid cell
                  height: "100%",
                  aspectRatio: "1/1",
                  borderTop: (cell.row > 0 && cell.walls.has('top')) ? wallSty : "none",
                  borderLeft: (cell.col > 0 && cell.walls.has('left')) ? wallSty : "none",
                  position: "relative",
                  boxSizing: 'border-box'
                }}
              >
                {isStart && (
                  <div className="node-marker start">
                    <span style={{ fontSize: `calc(${cellSizeCss} * 0.4)` }}>S</span>
                  </div>
                )}
                {isEnd && (
                  <div className="node-marker end">
                    <span style={{ fontSize: `calc(${cellSizeCss} * 0.4)` }}>E</span>
                  </div>
                )}
                
                {cell.isP && !isStart && !isEnd && (
                  <div className="p-trail">
                    <div className="p-core" />
                  </div>
                )}
                {cell.isC && <div className="scanner-head" />}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .maze-board {
          position: relative;
          z-index: 1;
        }
        .mcell {
          box-sizing: border-box;
          transition: background 0.2s ease;
        }

        /* Scan Phase Colors: Cyan/Magenta Gradient pulse */
        .mcell.scan {
          background: rgba(6, 182, 212, 0.15); /* Bright Cyan */
          box-shadow: inset 0 0 10px rgba(6, 182, 212, 0.2);
          animation: scan-flicker 1.5s infinite;
        }
        .mcell.hist {
          background: rgba(255, 255, 255, 0.02);
        }

        /* Path found: Neon Electric Trail */
        .p-trail {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          display: flex; align-items: center; justify-content: center;
          z-index: 5;
        }
        .p-core {
          width: 25%; height: 25%;
          background: #ccff00;
          border-radius: 50%;
          box-shadow: 
            0 0 10px #ccff00,
            0 0 20px rgba(204, 255, 0, 0.4);
          animation: path-pulse 1.5s infinite alternate;
        }
        .mcell.path {
          background: rgba(204, 255, 0, 0.08);
        }

        @keyframes path-pulse {
          from { transform: scale(0.8); opacity: 0.7; box-shadow: 0 0 10px #ccff00; }
          to { transform: scale(1.1); opacity: 1; box-shadow: 0 0 20px #ccff00; }
        }

        /* The active "Head" of the scanner */
        .scanner-head {
          position: absolute;
          top: 3px; left: 3px; right: 3px; bottom: 3px;
          background: #00f2ff;
          box-shadow: 0 0 20px #00f2ff;
          z-index: 10;
          animation: head-pulse 0.4s infinite alternate;
          border-radius: 2px;
        }

        /* Start/End Markers */
        .node-marker {
          position: absolute;
          top: 3px; left: 3px; right: 3px; bottom: 3px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 900; z-index: 20;
        }
        .node-marker.start {
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 4px;
          color: white;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.6);
        }
        .node-marker.end {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border-radius: 4px;
          color: white;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
        }

        @keyframes scan-flicker {
          0%, 100% { background: rgba(6, 182, 212, 0.1); }
          50% { background: rgba(6, 182, 212, 0.25); }
        }
        @keyframes head-pulse {
          from { opacity: 0.7; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
