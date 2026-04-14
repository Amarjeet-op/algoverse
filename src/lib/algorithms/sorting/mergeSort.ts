import { SortingStep } from './types';

export function mergeSort(arr: number[]): SortingStep[] {
  const steps: SortingStep[] = [];
  const a = [...arr];

  function sort(start: number, end: number) {
    if (start >= end) return;
    const mid = Math.floor((start + end) / 2);
    sort(start, mid);
    sort(mid + 1, end);
    merge(start, mid, end);
  }

  function merge(start: number, mid: number, end: number) {
    const left = a.slice(start, mid + 1);
    const right = a.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;
    
    while (i < left.length && j < right.length) {
      steps.push({ indices: [start + i, mid + 1 + j], action: 'compare' });
      if (left[i] <= right[j]) {
        a[k] = left[i];
        steps.push({ indices: [k], action: 'place', value: left[i] });
        i++;
      } else {
        a[k] = right[j];
        steps.push({ indices: [k], action: 'place', value: right[j] });
        j++;
      }
      k++;
    }
    
    while (i < left.length) { 
      a[k] = left[i]; 
      steps.push({ indices: [k], action: 'place', value: left[i] }); 
      i++; 
      k++; 
    }
    while (j < right.length) { 
      a[k] = right[j]; 
      steps.push({ indices: [k], action: 'place', value: right[j] }); 
      j++; 
      k++; 
    }
  }

  sort(0, a.length - 1);
  for (let i = 0; i < a.length; i++) steps.push({ indices: [i], action: 'sorted' });
  return steps;
}
