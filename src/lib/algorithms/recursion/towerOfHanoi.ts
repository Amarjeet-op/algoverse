import { RecursionStep, RecursionNode } from './types';

let idCounter = 0;
function nextId(): string { return `hanoi-${idCounter++}`; }

export function towerOfHanoi(n: number): { steps: RecursionStep[]; tree: RecursionNode; moves: string[] } {
  const steps: RecursionStep[] = [];
  const movesLog: string[] = [];
  idCounter = 0;

  function run(n: number, src: string, dest: string, aux: string, depth: number): RecursionNode {
    const id = nextId();
    const node: RecursionNode = { 
        id, 
        label: `Hanoi(${n}, ${src}→${dest})`, 
        children: [], 
        status: 'pending' 
    };

    const pushFrame = { name: 'hanoi', args: [String(n), src, dest, aux], depth, id };
    steps.push({ action: 'push', frame: pushFrame });

    if (n === 1) {
      const move = `Disk 1: ${src} to ${dest}`;
      movesLog.push(move);
      steps.push({ action: 'compute', frame: { ...pushFrame, result: move } });
    } else {
      // Step 1: Move n-1 from src to aux
      const left = run(n - 1, src, aux, dest, depth + 1);
      
      // Step 2: Move n from src to dest
      const moveId = nextId();
      const move = `Disk ${n}: ${src} to ${dest}`;
      const moveNode: RecursionNode = { id: moveId, label: move, children: [], status: 'done' };
      movesLog.push(move);
      
      // Step 3: Move n-1 from aux to dest
      const right = run(n - 1, aux, dest, src, depth + 1);
      
      node.children = [left, moveNode, right];
    }

    steps.push({ action: 'pop', frame: pushFrame });
    return node;
  }

  const tree = run(n, 'A', 'C', 'B', 0);
  return { steps, tree, moves: movesLog };
}
