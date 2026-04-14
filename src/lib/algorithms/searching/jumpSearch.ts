import { SearchStep } from './types';

export function jumpSearch(arr: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  const n = arr.length;
  let step = Math.floor(Math.sqrt(n));
  let prev = 0;

  while (prev < n && arr[Math.min(step, n) - 1] < target) {
    steps.push({ index: Math.min(step, n) - 1, action: 'check' });
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) break;
  }

  for (let i = prev; i < Math.min(step, n); i++) {
    steps.push({ index: i, action: 'check' });
    if (arr[i] === target) {
      steps.push({ index: i, action: 'found' });
      return steps;
    }
    steps.push({ index: i, action: 'eliminate' });
  }
  steps.push({ index: -1, action: 'notFound' });
  return steps;
}
