import { SortingStep } from './types';

export function heapSort(arr: number[]): SortingStep[] {
  const steps: SortingStep[] = [];
  const a = [...arr];
  const n = a.length;

  function heapify(size: number, i: number) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    // Show the parent being heapified
    steps.push({ indices: [i], action: 'pivot' });

    if (l < size) {
      steps.push({ indices: [largest, l], action: 'compare' });
      if (a[l] > a[largest]) largest = l;
    }

    if (r < size) {
      steps.push({ indices: [largest, r], action: 'compare' });
      if (a[r] > a[largest]) largest = r;
    }

    if (largest !== i) {
      steps.push({ indices: [i, largest], action: 'swap' });
      [a[i], a[largest]] = [a[largest], a[i]];
      heapify(size, largest);
    }
  }

  // Build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  // One by one extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    steps.push({ indices: [0, i], action: 'swap' });
    [a[0], a[i]] = [a[i], a[0]];
    
    // The last element is now sorted
    steps.push({ indices: [i], action: 'sorted' });
    
    // call max heapify on the reduced heap
    heapify(i, 0);
  }
  
  // The final element is sorted
  steps.push({ indices: [0], action: 'sorted' });
  
  // Final victory lap
  for (let i = 0; i < n; i++) steps.push({ indices: [i], action: 'sorted' });

  return steps;
}
