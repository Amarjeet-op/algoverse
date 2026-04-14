import { SearchStep } from './types';

export function binarySearch(arr: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    steps.push({ index: mid, action: 'midpoint' });
    steps.push({ index: mid, action: 'check' });
    if (arr[mid] === target) {
      steps.push({ index: mid, action: 'found' });
      return steps;
    }
    if (arr[mid] < target) {
      for (let i = left; i <= mid; i++) steps.push({ index: i, action: 'eliminate' });
      left = mid + 1;
    } else {
      for (let i = mid; i <= right; i++) steps.push({ index: i, action: 'eliminate' });
      right = mid - 1;
    }
  }
  steps.push({ index: -1, action: 'notFound' });
  return steps;
}
