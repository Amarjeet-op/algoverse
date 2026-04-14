import { PathStep } from './types';
import { GridCellState, getNeighbors } from '@/lib/utils/pathfinding';

export function dijkstra(grid: GridCellState[][], startRow: number, startCol: number, endRow: number, endCol: number, rows: number, cols: number): { steps: PathStep[] } {
  const steps: PathStep[] = [];
  const dist: number[][] = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const prev: (string | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
  const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
  dist[startRow][startCol] = 0;

  const pq: string[] = [`${startRow},${startCol}`];

  while (pq.length > 0) {
    pq.sort((a, b) => {
      const [ar, ac] = a.split(',').map(Number);
      const [br, bc] = b.split(',').map(Number);
      return dist[ar][ac] - dist[br][bc];
    });
    const current = pq.shift()!;
    const [cr, cc] = current.split(',').map(Number);
    if (visited[cr][cc]) continue;
    visited[cr][cc] = true;

    if (grid[cr][cc].type !== 'start' && grid[cr][cc].type !== 'end') {
      steps.push({ row: cr, col: cc, type: 'visit' });
    }

    if (cr === endRow && cc === endCol) {
      // Reconstruct path
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
      break;
    }

    for (const { r, c } of getNeighbors(cr, cc, rows, cols, grid)) {
      if (visited[r][c]) continue;
      const newDist = dist[cr][cc] + 1;
      if (newDist < dist[r][c]) {
        dist[r][c] = newDist;
        prev[r][c] = `${cr},${cc}`;
        pq.push(`${r},${c}`);
      }
    }
  }

  return { steps };
}
