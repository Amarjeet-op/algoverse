import { SortingStep } from './types';

export function quickSort(arr: number[]): SortingStep[] {
  const steps: SortingStep[] = [];
  const a = [...arr];

  function sort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    }
  }

  function partition(low: number, high: number): number {
    const pivot = a[high];
    steps.push({ indices: [high], action: 'pivot' }); // Mark initial pivot
    
    let i = low - 1;
    for (let j = low; j < high; j++) {
      steps.push({ indices: [j, high], action: 'compare' });
      if (a[j] < pivot) {
        i++;
        steps.push({ indices: [i, j], action: 'swap' });
        [a[i], a[j]] = [a[j], a[i]];
      }
    }
    steps.push({ indices: [i + 1, high], action: 'swap' });
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    steps.push({ indices: [i + 1], action: 'sorted' });
    return i + 1;
  }

  sort(0, a.length - 1);
  for (let i = 0; i < a.length; i++) steps.push({ indices: [i], action: 'sorted' });
  return steps;
}
