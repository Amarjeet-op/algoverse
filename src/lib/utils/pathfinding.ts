export function manhattanDistance(
  r1: number, c1: number, r2: number, c2: number
): number {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2);
}

export type GridCellType = 'empty' | 'wall' | 'start' | 'end' | 'visited' | 'visited-path' | 'final-path';

export interface GridCellState {
  row: number;
  col: number;
  type: GridCellType;
}

export function createEmptyGrid(rows: number, cols: number, startRow: number, startCol: number, endRow: number, endCol: number): GridCellState[][] {
  const grid: GridCellState[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: GridCellState[] = [];
    for (let c = 0; c < cols; c++) {
      let type: GridCellType = 'empty';
      if (r === startRow && c === startCol) type = 'start';
      if (r === endRow && c === endCol) type = 'end';
      row.push({ row: r, col: c, type });
    }
    grid.push(row);
  }
  return grid;
}

export function getNeighbors(row: number, col: number, rows: number, cols: number, grid: GridCellState[][]): { r: number; c: number }[] {
  const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
  const neighbors: { r: number; c: number }[] = [];
  for (const [dr, dc] of dirs) {
    const nr = row + dr, nc = col + dc;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].type !== 'wall') {
      neighbors.push({ r: nr, c: nc });
    }
  }
  return neighbors;
}
