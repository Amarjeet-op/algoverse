import { create } from 'zustand';
import { GridCellState, createEmptyGrid } from '@/lib/utils/pathfinding';
import { PathStep } from '@/lib/algorithms/pathfinding/types';
import { PATHFINDING_ALGORITHMS } from '@/config/algorithms';
import { dijkstra } from '@/lib/algorithms/pathfinding/dijkstra';
import { aStar } from '@/lib/algorithms/pathfinding/aStar';
import { bfs } from '@/lib/algorithms/pathfinding/bfs';
import { dfs } from '@/lib/algorithms/pathfinding/dfs';

type DragMode = 'wall' | 'start' | 'end' | 'clear';

interface PathfindingStore {
  grid: GridCellState[][];
  rows: number;
  cols: number;
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
  dragging: boolean;
  dragMode: DragMode;
  algorithm: string;
  visited: { row: number, col: number }[];
  path: { row: number, col: number }[];
  steps: PathStep[];
  isRunning: boolean;
  isComplete: boolean;
  algorithmMetadata: typeof PATHFINDING_ALGORITHMS[0];
  setGridSize: (rows: number, cols: number) => void;
  setAlgorithm: (slug: string) => void;
  toggleCell: (row: number, col: number) => void;
  clearWalls: () => void;
  runAlgorithmAnimated: () => void;
  setAnimatedState: (currentStep: number) => void;
  reset: () => void;
  setDragMode: (mode: DragMode) => void;
}

export const usePathfindingStore = create<PathfindingStore>((set, get) => ({
  grid: createEmptyGrid(18, 30, 9, 5, 9, 25),
  rows: 18,
  cols: 30,
  startRow: 9,
  startCol: 5,
  endRow: 9,
  endCol: 25,
  dragging: false,
  dragMode: 'wall',
  algorithm: 'dijkstra',
  visited: [],
  path: [],
  steps: [],
  isRunning: false,
  isComplete: false,
  algorithmMetadata: PATHFINDING_ALGORITHMS[0],
  setGridSize: (rows, cols) => {
    set({
      rows, cols,
      startRow: Math.floor(rows / 2),
      startCol: Math.floor(cols / 4),
      endRow: Math.floor(rows / 2),
      endCol: Math.floor(3 * cols / 4),
      grid: createEmptyGrid(rows, cols, Math.floor(rows / 2), Math.floor(cols / 4), Math.floor(rows / 2), Math.floor(3 * cols / 4)),
      visited: [],
      path: [],
      steps: [],
      isComplete: false,
    });
  },
  setAlgorithm: (slug) => {
    const meta = PATHFINDING_ALGORITHMS.find((a) => a.slug === slug)!;
    set({ algorithm: slug, algorithmMetadata: meta, visited: [], path: [], steps: [], isComplete: false });
  },
  toggleCell: (row, col) => {
    const { grid, startRow, startCol, endRow, endCol, dragMode } = get();
    const newGrid = [...grid.map(r => [...r])];

    if (dragMode === 'start') {
      if (row === endRow && col === endCol) return;
      newGrid[startRow][startCol].type = 'empty';
      newGrid[row][col].type = 'start';
      set({ 
        grid: newGrid, 
        startRow: row, 
        startCol: col,
        visited: [], path: [], steps: [], isComplete: false 
      });
      return;
    }

    if (dragMode === 'end') {
      if (row === startRow && col === startCol) return;
      newGrid[endRow][endCol].type = 'empty';
      newGrid[row][col].type = 'end';
      set({ 
        grid: newGrid, 
        endRow: row, 
        endCol: col,
        visited: [], path: [], steps: [], isComplete: false 
      });
      return;
    }

    if (dragMode === 'wall') {
      if ((row === startRow && col === startCol) || (row === endRow && col === endCol)) return;
      newGrid[row][col].type = newGrid[row][col].type === 'wall' ? 'empty' : 'wall';
      set({ grid: newGrid, visited: [], path: [], steps: [], isComplete: false });
    }
  },
  clearWalls: () => {
    const { grid } = get();
    const newGrid = grid.map(r => r.map(c => ({ ...c, type: c.type === 'wall' ? 'empty' as const : c.type })));
    set({ grid: newGrid, visited: [], path: [], steps: [], isComplete: false });
  },
  runAlgorithmAnimated: () => {
    const { grid, algorithm, startRow, startCol, endRow, endCol, rows, cols } = get();
    const run = { 
      'dijkstra': dijkstra, 
      'astar': aStar, 
      'bfs': bfs, 
      'dfs': dfs 
    }[algorithm] ?? undefined;
    const result = run?.(grid, startRow, startCol, endRow, endCol, rows, cols);
    if (result) {
      set({ steps: result.steps, visited: [], path: [], isComplete: false, isRunning: true });
    }
  },
  setAnimatedState: (currentStep: number) => {
    const { steps } = get();
    const active = steps.slice(0, currentStep + 1);
    const visitedCells = active.filter(s => s.type === 'visit').map(s => ({ row: s.row, col: s.col }));
    const pathCells = active.filter(s => s.type === 'path').map(s => ({ row: s.row, col: s.col }));
    set({ visited: visitedCells, path: pathCells });
  },
  reset: () => set({ visited: [], path: [], steps: [], isComplete: false, isRunning: false }),
  setDragMode: (mode) => set({ dragMode: mode }),
}));
