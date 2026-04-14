import { MazeCell, MazeStep } from '@/lib/utils/maze';

type Direction = 'top' | 'bottom' | 'left' | 'right';

const DIR_ORDER: Direction[] = ['top', 'right', 'bottom', 'left'];
const MOVES: Record<Direction, [number, number]> = {
  top: [-1, 0], bottom: [1, 0], left: [0, -1], right: [0, 1],
};
const LEFT_TURN: Record<Direction, Direction> = {
  top: 'left', left: 'bottom', bottom: 'right', right: 'top',
};
const OPPOSITE: Record<Direction, Direction> = {
  top: 'bottom', bottom: 'top', left: 'right', right: 'left',
};

export function solveMazeWallFollowing(grid: MazeCell[][], startRow: number, startCol: number, endRow: number, endCol: number): { steps: MazeStep[] } {
  const steps: MazeStep[] = [];
  let currentRow = startRow, currentCol = startCol;
  let dir: Direction = 'right';

  const visited = new Set<string>();
  visited.add(`${currentRow},${currentCol}`);

  while (currentRow !== endRow || currentCol !== endCol) {
    // Check left
    const leftDir: Direction = LEFT_TURN[dir];
    const [ldr, ldc]: [number, number] = MOVES[leftDir];
    const lr = currentRow + ldr, lc = currentCol + ldc;
    let moved = false;

    // Try to turn left
    if (canMove(grid, leftDir, currentRow, currentCol)) {
      dir = leftDir;
    } else if (canMove(grid, dir, currentRow, currentCol)) {
      // Continue forward
    } else if (canMove(grid, DIR_ORDER[(DIR_ORDER.indexOf(dir) + 1) % 4], currentRow, currentCol)) {
      dir = DIR_ORDER[(DIR_ORDER.indexOf(dir) + 1) % 4];
    } else {
      steps.push({ row: currentRow, col: currentCol, type: 'backtrack' });
      break; // Stuck
    }

    const [mr, mc] = MOVES[dir];
    const nr = currentRow + mr, nc = currentCol + mc;
    if (canMove(grid, dir, currentRow, currentCol)) {
      currentRow = nr;
      currentCol = nc;
      moved = true;
    }

    if (moved) {
      const key = `${currentRow},${currentCol}`;
      if (currentRow !== startRow || currentCol !== startCol) {
        if (visited.has(key)) {
          steps.push({ row: currentRow, col: currentCol, type: 'backtrack' });
        } else {
          steps.push({ row: currentRow, col: currentCol, type: 'visit' });
          visited.add(key);
        }
      }
    } else {
      break;
    }
  }

  // Reconstruct solution path
  const solution: [number, number][] = [];
  let r = endRow, c = endCol;
  for (const key of visited) {
    const [vr, vc] = key.split(',').map(Number);
    solution.push([vr, vc]);
  }

  return { steps };
}

function canMove(grid: MazeCell[][], direction: Direction, row: number, col: number): boolean {
  const cell = grid[row][col];
  if (cell.walls.has(direction)) return false;
  const [dr, dc] = MOVES[direction];
  const nr = row + dr, nc = col + dc;
  if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length) return false;
  return true;
}
