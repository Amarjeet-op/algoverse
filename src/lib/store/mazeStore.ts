import { create } from 'zustand';
import { MazeCell, MazeStep, createMazeGrid, getMazeNeighbors, CellWall } from '@/lib/utils/maze';
import { generateMazeRecursive, generateRandomMaze } from '@/lib/algorithms/maze/recursiveBacktrack';
import { MAZE_ALGORITHMS } from '@/config/algorithms';

interface MazeStore {
  grid: MazeCell[][];
  rows: number;
  cols: number;
  algorithm: string;
  solverAlgorithm: string;
  steps: MazeStep[];
  solutionSteps: MazeStep[];
  isGenerated: boolean;
  isComplete: boolean;
  isRunning: boolean;
  algorithmMetadata: typeof MAZE_ALGORITHMS[0];
  setGridSize: (rows: number, cols: number) => void;
  setAlgorithm: (slug: string) => void;
  setSolverAlgorithm: (slug: string) => void;
  generateMaze: () => void;
  solveMaze: () => void;
  reset: () => void;
}

export const useMazeStore = create<MazeStore>((set, get) => ({
  grid: createMazeGrid(11, 20),
  rows: 11,
  cols: 20,
  algorithm: 'recursive-backtrack',
  solverAlgorithm: 'bfs',
  steps: [],
  solutionSteps: [],
  isGenerated: false,
  isComplete: false,
  isRunning: false,
  algorithmMetadata: MAZE_ALGORITHMS[0],
  setGridSize: (rows, cols) => {
    const r = Math.min(Math.max(5, rows), 11);
    const c = Math.min(Math.max(5, cols), 20);
    set({
      rows: r,
      cols: c,
      grid: createMazeGrid(r, c),
      steps: [],
      solutionSteps: [],
      isGenerated: false,
      isComplete: false,
    });
  },
  setAlgorithm: (slug) => {
    const meta = MAZE_ALGORITHMS.find((a) => a.slug === slug)!;
    set({ algorithm: slug, algorithmMetadata: meta });
  },
  setSolverAlgorithm: (slug) => set({ solverAlgorithm: slug }),
  generateMaze: () => {
    const { rows, cols, algorithm } = get();
    let result;
    if (algorithm === 'random-maze') {
      result = generateRandomMaze(rows, cols);
    } else {
      result = generateMazeRecursive(rows, cols);
    }
    set({ grid: result.grid, steps: result.steps, isGenerated: true, isComplete: false, isRunning: false, solutionSteps: [] });
  },
  solveMaze: () => {
    const { grid, rows, cols, solverAlgorithm } = get();
    const start = { r: 0, c: 0 };
    const end = { r: rows - 1, c: cols - 1 };
    
    const solveSteps: MazeStep[] = [];
    const visited = new Set<string>();
    const parent = new Map<string, string>();
    
    // Abstracting neighbors check
    const isPassable = (r1: number, c1: number, n: any) => {
      return !grid[r1][c1].walls.has(n.wall1);
    };

    if (solverAlgorithm === 'dfs') {
      const stack: { r: number, c: number }[] = [start];
      visited.add('0,0');
      while (stack.length > 0) {
        const { r, c } = stack.pop()!;
        solveSteps.push({ row: r, col: c, type: 'solve' });
        if (r === end.r && c === end.c) break;
        const neighbors = getMazeNeighbors(r, c, rows, cols, grid);
        for (const n of neighbors) {
          const key = `${n.r},${n.c}`;
          if (isPassable(r, c, n) && !visited.has(key)) {
            visited.add(key);
            parent.set(key, `${r},${c}`);
            stack.push({ r: n.r, c: n.c });
          }
        }
      }
    } else {
      const queue: { r: number, c: number }[] = [start];
      visited.add('0,0');
      while (queue.length > 0) {
        const { r, c } = queue.shift()!;
        solveSteps.push({ row: r, col: c, type: 'solve' });
        if (r === end.r && c === end.c) break;
        const neighbors = getMazeNeighbors(r, c, rows, cols, grid);
        for (const n of neighbors) {
          const key = `${n.r},${n.c}`;
          if (isPassable(r, c, n) && !visited.has(key)) {
            visited.add(key);
            parent.set(key, `${r},${c}`);
            queue.push({ r: n.r, c: n.c });
          }
        }
      }
    }

    let curr = `${end.r},${end.c}`;
    const path: MazeStep[] = [];
    if (visited.has(curr)) {
      while (curr) {
        const [pr, pc] = curr.split(',').map(Number);
        path.push({ row: pr, col: pc, type: 'path' });
        curr = parent.get(curr)!;
      }
    }
    set({ solutionSteps: [...solveSteps, ...path.reverse()], isComplete: true });
  },
  reset: () => {
    const { rows, cols } = get();
    set({ grid: createMazeGrid(rows, cols), steps: [], solutionSteps: [], isGenerated: false, isComplete: false });
  },
}));
