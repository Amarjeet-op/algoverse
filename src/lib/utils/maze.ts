export type CellWall = 'top' | 'bottom' | 'left' | 'right';

export interface MazeCell {
  row: number;
  col: number;
  walls: Set<CellWall>;
  visited: boolean;
}

export type MazeStepType = 'visit' | 'carve' | 'solve' | 'path' | 'backtrack';

export interface MazeStep {
  row: number;
  col: number;
  type: MazeStepType;
  wallToRemove?: CellWall;
  target?: { r: number, c: number };
}

export function createMazeGrid(rows: number, cols: number): MazeCell[][] {
  const grid: MazeCell[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: MazeCell[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        walls: new Set(['top', 'bottom', 'left', 'right'] as CellWall[]),
        visited: false,
      });
    }
    grid.push(row);
  }
  return grid;
}

export function getMazeNeighbors(row: number, col: number, rows: number, cols: number, grid: MazeCell[][]): { r: number; c: number; wall1: CellWall; wall2: CellWall }[] {
  const dirs: { dr: number; dc: number; w1: CellWall; w2: CellWall }[] = [
    { dr: -1, dc: 0, w1: 'top', w2: 'bottom' },
    { dr: 1, dc: 0, w1: 'bottom', w2: 'top' },
    { dr: 0, dc: -1, w1: 'left', w2: 'right' },
    { dr: 0, dc: 1, w1: 'right', w2: 'left' },
  ];
  const neighbors: { r: number; c: number; wall1: CellWall; wall2: CellWall }[] = [];
  for (const { dr, dc, w1, w2 } of dirs) {
    const nr = row + dr, nc = col + dc;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
      neighbors.push({ r: nr, c: nc, wall1: w1, wall2: w2 });
    }
  }
  return neighbors;
}
