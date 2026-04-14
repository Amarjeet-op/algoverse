import { create } from 'zustand';
import { generateArray } from '@/lib/utils/helpers';
import { SortingStep } from '@/lib/algorithms/sorting/types';
import { SORTING_ALGORITHMS } from '@/config/algorithms';
import { bubbleSort } from '@/lib/algorithms/sorting/bubbleSort';
import { quickSort } from '@/lib/algorithms/sorting/quickSort';
import { mergeSort } from '@/lib/algorithms/sorting/mergeSort';
import { insertionSort } from '@/lib/algorithms/sorting/insertionSort';
import { selectionSort } from '@/lib/algorithms/sorting/selectionSort';
import { heapSort } from '@/lib/algorithms/sorting/heapSort';

const sortFunctions: Record<string, (arr: number[]) => SortingStep[]> = {
  'bubble-sort': bubbleSort,
  'quick-sort': quickSort,
  'merge-sort': mergeSort,
  'insertion-sort': insertionSort,
  'selection-sort': selectionSort,
  'heap-sort': heapSort,
};

interface SortingStore {
  array: number[];
  arraySize: number;
  algorithm: string;
  targetValue: number;
  steps: SortingStep[];
  algorithmMetadata: typeof SORTING_ALGORITHMS[0];
  regenerate: () => void;
  setArraySize: (size: number) => void;
  setAlgorithm: (slug: string) => void;
  generateSteps: () => void;
}

export const useSortingStore = create<SortingStore>((set, get) => ({
  array: [],
  arraySize: 30,
  algorithm: 'bubble-sort',
  targetValue: 0,
  steps: [],
  algorithmMetadata: SORTING_ALGORITHMS[0],
  regenerate: () => {
    const { arraySize, algorithm, generateSteps } = get();
    const newArray = generateArray(arraySize);
    set({ array: newArray });
    generateSteps();
  },
  setArraySize: (size) => {
    set({ arraySize: size, array: generateArray(size) });
    get().generateSteps();
  },
  setAlgorithm: (slug) => {
    const meta = SORTING_ALGORITHMS.find((a) => a.slug === slug)!;
    set({ algorithm: slug, algorithmMetadata: meta });
    get().generateSteps();
  },
  generateSteps: () => {
    const { array, algorithm } = get();
    const fn = sortFunctions[algorithm];
    if (fn) set({ steps: fn(array) });
  },
}));
