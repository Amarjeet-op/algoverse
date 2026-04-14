import { RecursionStep, RecursionNode } from './types';

let idCounter = 0;
function nextId(): string { return `nq-${idCounter++}`; }

export function nQueens(n: number): { steps: RecursionStep[]; tree: RecursionNode; solution: number[] | null } {
  const steps: RecursionStep[] = [];
  const initialBoard = Array(n).fill(-1);
  let globalSolution: number[] | null = null;
  idCounter = 0;

  function isSafe(row: number, col: number, board: number[]): boolean {
    for (let r = 0; r < row; r++) {
      if (board[r] === col || Math.abs(board[r] - col) === Math.abs(r - row)) return false;
    }
    return true;
  }

  function run(row: number, board: number[]): { found: boolean, node: RecursionNode } {
    const id = nextId();
    const node: RecursionNode = { 
      id, 
      label: row === 0 ? "Start" : `Row ${row-1}`, 
      children: [], 
      status: 'pending' 
    };

    if (row === n) {
      if (!globalSolution) globalSolution = [...board];
      return { found: true, node };
    }

    let foundChild = false;
    for (let col = 0; col < n; col++) {
      const childId = nextId();
      const pushFrame = { name: 'place', args: [String(row), String(col)], depth: row, id: childId };
      steps.push({ action: 'push', frame: pushFrame });

      const childNode: RecursionNode = { id: childId, label: `Q @ [${row},${col}]`, children: [], status: 'pending' };
      node.children.push(childNode);

      if (isSafe(row, col, board)) {
        board[row] = col;
        steps.push({ action: 'compute', frame: { ...pushFrame, result: 'Safe' } });
        
        const childResult = run(row + 1, board);
        childNode.children = childResult.node.children;
        if (childResult.found) foundChild = true;
        
        board[row] = -1;
        steps.push({ action: 'pop', frame: { name: 'queen-remove', args: [String(row), String(col)], depth: row, id: childId } });
      } else {
        steps.push({ action: 'pop', frame: { ...pushFrame, result: 'Conflict' } });
      }
    }
    return { found: foundChild, node };
  }

  const { node: tree } = run(0, initialBoard);
  return { steps, tree, solution: globalSolution };
}
