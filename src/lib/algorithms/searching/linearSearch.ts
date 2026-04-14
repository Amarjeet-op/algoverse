import { SearchStep } from './types';

export function linearSearch(arr: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  for (let i = 0; i < arr.length; i++) {
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
