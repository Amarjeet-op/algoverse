import { SortingStep } from './types';

export function insertionSort(arr: number[]): SortingStep[] {
  const steps: SortingStep[] = [];
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    
    // First compare with the immediate neighbor
    steps.push({ indices: [i, j], action: 'compare' });
    
    while (j >= 0 && a[j] > key) {
      // Comparison already happened or is happening
      steps.push({ indices: [j, j + 1], action: 'compare' });
      
      // Instead of simple swap, we "shift" which is a placement of a[j] into j+1
      const valToShift = a[j];
      a[j + 1] = valToShift;
      steps.push({ indices: [j + 1], action: 'place', value: valToShift });
      j--;
    }
    
    // Final placement of the key
    a[j + 1] = key;
    steps.push({ indices: [j + 1], action: 'place', value: key });
  }
  
  // Final sorted pass
  for (let i = 0; i < a.length; i++) steps.push({ indices: [i], action: 'sorted' });
  return steps;
}
