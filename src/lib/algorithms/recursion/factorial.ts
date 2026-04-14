import { RecursionStep, RecursionNode } from './types';

let idCounter = 0;
function nextId(): string { return `fact-${idCounter++}`; }

export function factorial(n: number): { steps: RecursionStep[]; tree: RecursionNode } {
  const steps: RecursionStep[] = [];
  idCounter = 0;

  function run(val: number, depth: number): { result: number, node: RecursionNode } {
    const id = nextId();
    const node: RecursionNode = { id, label: `${val}!`, children: [], status: 'pending' };
    const pushFrame = { name: 'factorial', args: [String(val)], depth, id };
    steps.push({ action: 'push', frame: pushFrame });

    let result: number;
    if (val <= 1) {
      result = 1;
    } else {
      const child = run(val - 1, depth + 1);
      result = val * child.result;
      node.children = [child.node];
    }

    steps.push({ action: 'pop', frame: { ...pushFrame, result: String(result) } });
    return { result, node };
  }

  const { node: tree } = run(n, 0);
  return { steps, tree };
}
