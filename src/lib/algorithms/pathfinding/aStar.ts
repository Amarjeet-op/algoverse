import { PathStep } from './types';
import { GridCellState, getNeighbors, manhattanDistance } from '@/lib/utils/pathfinding';

export function aStar(grid: GridCellState[][], startRow: number, startCol: number, endRow: number, endCol: number, rows: number, cols: number): { steps: PathStep[] } {
  const steps: PathStep[] = [];
  const gScore: number[][] = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const fScore: number[][] = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const prev: (string | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
  const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
  gScore[startRow][startCol] = 0;
  fScore[startRow][startCol] = manhattanDistance(startRow, startCol, endRow, endCol);

  const pq: string[] = [`${startRow},${startCol}`];

  while (pq.length > 0) {
    pq.sort((a, b) => {
      const [ar, ac] = a.split(',').map(Number);
      const [br, bc] = b.split(',').map(Number);
      return fScore[ar][ac] - fScore[br][bc];
    });
    const current = pq.shift()!;
    const [cr, cc] = current.split(',').map(Number);
    if (visited[cr][cc]) continue;
    visited[cr][cc] = true;

    if (grid[cr][cc].type !== 'start' && grid[cr][cc].type !== 'end') {
      steps.push({ row: cr, col: cc, type: 'visit' });
    }

    if (cr === endRow && cc === endCol) {
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
      const tentG = gScore[cr][cc] + 1;
      if (tentG < gScore[r][c]) {
        prev[r][c] = `${cr},${cc}`;
        gScore[r][c] = tentG;
        fScore[r][c] = tentG + manhattanDistance(r, c, endRow, endCol);
        pq.push(`${r},${c}`);
      }
    }
  }

  return { steps };
}
