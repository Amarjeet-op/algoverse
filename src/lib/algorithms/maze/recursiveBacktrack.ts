import { MazeCell, MazeStep, createMazeGrid, getMazeNeighbors } from '@/lib/utils/maze';
import { shuffleArray } from '@/lib/utils/helpers';

export function generateMazeRecursive(rows: number, cols: number): { grid: MazeCell[][]; steps: MazeStep[] } {
  const grid = createMazeGrid(rows, cols);
  const steps: MazeStep[] = [];
  const visited = new Array(rows).fill(0).map(() => new Array(cols).fill(false));

  function carve(r: number, c: number) {
    visited[r][c] = true;
    grid[r][c].visited = true;
    steps.push({ row: r, col: c, type: 'visit' });

    // FIX: shuffleArray is non-mutating, must use the returned array
    const neighbors = shuffleArray(getMazeNeighbors(r, c, rows, cols, grid));

    for (const n of neighbors) {
      if (!visited[n.r][n.c]) {
        // Remove walls in grid
        grid[r][c].walls.delete(n.wall1);
        grid[n.r][n.c].walls.delete(n.wall2);
        
        // Add step
        steps.push({ 
          row: r, col: c, 
          type: 'carve', 
          wallToRemove: n.wall1,
          target: { r: n.r, c: n.c }
        });

        carve(n.r, n.c);
        
        // Backtrack
        steps.push({ row: r, col: c, type: 'visit' });
      }
    }
  }

  carve(0, 0);
  return { grid, steps };
}

export function generateRandomMaze(rows: number, cols: number): { grid: MazeCell[][]; steps: MazeStep[] } {
  const grid = createMazeGrid(rows, cols);
  const steps: MazeStep[] = [];

  // Random maze must also ensure a path exists - so we combine randomness with a basic path
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const neighbors = getMazeNeighbors(r, c, rows, cols, grid);
      for (const n of neighbors) {
        // Higher probability for paths that lean towards bottom-right to help guarantee solution
        const prob = (n.r > r || n.c > c) ? 0.35 : 0.2;
        if (Math.random() < prob) {
          grid[r][c].walls.delete(n.wall1);
          grid[n.r][n.c].walls.delete(n.wall2);
          steps.push({ row: r, col: c, type: 'carve', wallToRemove: n.wall1, target: { r: n.r, c: n.c } });
        }
      }
    }
  }
  
  // Guarantee at least one "snake" path if all else fails
  for(let i=0; i<rows-1; i++) {
     grid[i][0].walls.delete('bottom'); grid[i+1][0].walls.delete('top');
  }
  for(let j=0; j<cols-1; j++) {
     grid[rows-1][j].walls.delete('right'); grid[rows-1][j+1].walls.delete('left');
  }

  return { grid, steps };
}
