import { PathStep } from './types';
import { GridCellState, getNeighbors } from '@/lib/utils/pathfinding';

export function bfs(grid: GridCellState[][], startRow: number, startCol: number, endRow: number, endCol: number, rows: number, cols: number): { steps: PathStep[] } {
  const steps: PathStep[] = [];
  const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
  const prev: (string | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
  const queue: [number, number][] = [[startRow, startCol]];
  visited[startRow][startCol] = true;

  let found = false;
  while (queue.length > 0) {
    const [cr, cc] = queue.shift()!;
    if (grid[cr][cc].type !== 'start' && grid[cr][cc].type !== 'end') {
      steps.push({ row: cr, col: cc, type: 'visit' });
    }
    if (cr === endRow && cc === endCol) { found = true; break; }

    for (const { r, c } of getNeighbors(cr, cc, rows, cols, grid)) {
      if (!visited[r][c]) {
        visited[r][c] = true;
        prev[r][c] = `${cr},${cc}`;
        queue.push([r, c]);
      }
    }
  }

  if (found) {
    let curr: string | null = `${endRow},${endCol}`;
    while (curr) {
      const parts: number[] = curr!.split(',').map(Number);
      const pr: number = parts[0];
      const pc: number = parts[1];
      if (grid[pr][pc].type !== 'start' && grid[pr][pc].type !== 'end') {
        steps.push({ row: pr, col: pc, type: 'path' });
      }
      curr = prev[pr][pc];
    }
  }

  return { steps };
}
