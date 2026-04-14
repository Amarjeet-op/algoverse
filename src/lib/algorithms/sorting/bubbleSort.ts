import { SortingStep } from './types';

export function bubbleSort(arr: number[]): SortingStep[] {
  const steps: SortingStep[] = [];
  const a = [...arr];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ indices: [j, j + 1], action: 'compare' });
      if (a[j] > a[j + 1]) {
        steps.push({ indices: [j, j + 1], action: 'swap' });
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
      }
    }
    steps.push({ indices: [n - i - 1], action: 'sorted' });
  }
  steps.push({ indices: [0], action: 'sorted' });
  for (let i = 0; i < n; i++) {
    steps.push({ indices: [i], action: 'sorted' });
  }
  return steps;
}
