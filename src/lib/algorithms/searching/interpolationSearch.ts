import { SearchStep } from './types';

export function interpolationSearch(arr: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  let lo = 0, hi = arr.length - 1;

  while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
    const pos = lo + Math.floor(((target - arr[lo]) * (hi - lo)) / Math.max(1, arr[hi] - arr[lo]));
    steps.push({ index: pos, action: 'midpoint' });
    steps.push({ index: pos, action: 'check' });
    if (arr[pos] === target) { steps.push({ index: pos, action: 'found' }); return steps; }
    if (arr[pos] < target) { lo = pos + 1; } else { hi = pos - 1; }
  }

  steps.push({ index: -1, action: 'notFound' });
  return steps;
}
