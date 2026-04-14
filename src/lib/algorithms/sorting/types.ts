export type SortAction = 'compare' | 'swap' | 'place' | 'sorted' | 'overwrite' | 'pivot';

export interface SortingStep {
  indices: number[];
  action: SortAction;
  value?: number; // Used for "place" or "overwrite" actions, especially in merge sort
}
