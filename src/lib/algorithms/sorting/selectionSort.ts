import { SortingStep } from './types';

export function selectionSort(arr: number[]): SortingStep[] {
  const steps: SortingStep[] = [];
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    // Mark the current minimum we're comparing against
    steps.push({ indices: [minIdx], action: 'pivot' }); 
    
    for (let j = i + 1; j < a.length; j++) {
      steps.push({ indices: [minIdx, j], action: 'compare' });
      if (a[j] < a[minIdx]) {
        minIdx = j;
        // Update the pivot to the new minimum found
        steps.push({ indices: [minIdx], action: 'pivot' });
      }
    }
    
    if (minIdx !== i) {
      steps.push({ indices: [i, minIdx], action: 'swap' });
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
    }
    
    // Mark as sorted
    steps.push({ indices: [i], action: 'sorted' });
  }
  
  // Final sorted pass for all remaining
  for (let i = 0; i < a.length; i++) {
    steps.push({ indices: [i], action: 'sorted' });
  }
  
  return steps;
}
