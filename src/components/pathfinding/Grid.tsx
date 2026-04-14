"use client";

import { GridCellState } from "@/lib/utils/pathfinding";
import { useState } from "react";

interface GridProps {
  grid: GridCellState[][];
  visited: { row: number; col: number }[];
  path: { row: number; col: number }[];
  rows: number;
  cols: number;
  toggleCell: (row: number, col: number) => void;
  dragMode: string;
  setDragMode: (mode: any) => void;
}

export function Grid({ grid, visited, path, rows, cols, toggleCell, dragMode, setDragMode }: GridProps) {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const visitedSet = new Set(visited.map((v) => `${v.row},${v.col}`));
  const pathSet = new Set(path.map((p) => `${p.row},${p.col}`));

  const getCellClass = (cell: GridCellState): string => {
    const key = `${cell.row},${cell.col}`;
    if (cell.type === 'start') return 'start';
    if (cell.type === 'end') return 'end';
    if (cell.type === 'wall') return 'wall';
    if (pathSet.has(key)) return 'path';
    if (visitedSet.has(key)) return 'visited';
    return '';
  };

  const handleMouseDown = (r: number, c: number) => {
    setIsMouseDown(true);
    toggleCell(r, c);
  };

  const handleMouseEnter = (r: number, c: number) => {
    if (isMouseDown) toggleCell(r, c);
  };

  const handleMouseUp = () => setIsMouseDown(false);

  return (
    <div className="grid-wrap" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <div
        className="pf-grid"
        style={{ 
          gridTemplateColumns: `repeat(${cols}, 1fr)`, 
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          width: '100%',
          height: '100%'
        }}
      >
        {grid.map((row) =>
          row.map((cell) => (
            <div
              key={`${cell.row}-${cell.col}`}
              className={`cell ${getCellClass(cell)}`}
              onMouseDown={() => handleMouseDown(cell.row, cell.col)}
              onMouseEnter={() => handleMouseEnter(cell.row, cell.col)}
            >
              {(getCellClass(cell) === 'visited' || getCellClass(cell) === 'path') && <div className="cell-glow" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
