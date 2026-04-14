import { RecursionStep, RecursionNode } from './types';

let idCounter = 0;
function nextId(): string { return `fib-${idCounter++}`; }

export function fibonacci(n: number): { steps: RecursionStep[]; tree: RecursionNode } {
  const steps: RecursionStep[] = [];
  
  // Single pass to generate both tree and steps for perfect ID alignment
  idCounter = 0;
  
  function run(val: number, depth: number): { result: number; node: RecursionNode } {
    const id = nextId();
    const node: RecursionNode = { id, label: `fib(${val})`, children: [], status: 'pending' };
    
    const pushFrame = { name: 'fib', args: [String(val)], depth, id };
    steps.push({ action: 'push', frame: pushFrame });

    let result: number;
    if (val <= 1) {
      result = val;
    } else {
      const left = run(val - 1, depth + 1);
      const right = run(val - 2, depth + 1);
      result = left.result + right.result;
      node.children = [left.node, right.node];
    }

    const popFrame = { name: 'fib', args: [String(val)], depth, result: String(result), id };
    steps.push({ action: 'pop', frame: popFrame });
    
    return { result, node };
  }

  const { node: tree } = run(n, 0);
  return { steps, tree };
}
