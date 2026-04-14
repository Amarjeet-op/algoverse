import { create } from 'zustand';
import { generateArray } from '@/lib/utils/helpers';
import { SearchStep } from '@/lib/algorithms/searching/types';
import { SEARCHING_ALGORITHMS } from '@/config/algorithms';
import { linearSearch } from '@/lib/algorithms/searching/linearSearch';
import { binarySearch } from '@/lib/algorithms/searching/binarySearch';
import { jumpSearch } from '@/lib/algorithms/searching/jumpSearch';
import { interpolationSearch } from '@/lib/algorithms/searching/interpolationSearch';

const searchFunctions: Record<string, (arr: number[], target: number) => SearchStep[]> = {
  'linear-search': linearSearch,
  'binary-search': binarySearch,
  'jump-search': jumpSearch,
  'interpolation-search': interpolationSearch,
};

interface SearchingStore {
  array: number[];
  arraySize: number;
  algorithm: string;
  targetValue: number;
  steps: SearchStep[];
  algorithmMetadata: typeof SEARCHING_ALGORITHMS[0];
  regenerate: () => void;
  setArraySize: (size: number) => void;
  setAlgorithm: (slug: string) => void;
  setTarget: (val: number) => void;
  generateSteps: () => void;
}

export const useSearchingStore = create<SearchingStore>((set, get) => ({
  array: Array(20).fill(0).map((_, i) => i + 1),
  arraySize: 20,
  algorithm: 'linear-search',
  targetValue: 42,
  steps: [],
  algorithmMetadata: SEARCHING_ALGORITHMS[0],
  regenerate: () => {
    const { arraySize, algorithm, generateSteps } = get();
    let newArray = generateArray(arraySize, 1, 100);
    if (['binary-search', 'jump-search', 'interpolation-search'].includes(algorithm)) {
      newArray.sort((a, b) => a - b);
    }
    set({ array: newArray });
    generateSteps();
  },
  setArraySize: (size) => {
    const { algorithm } = get();
    let newArray = generateArray(size, 1, 100);
    if (['binary-search', 'jump-search', 'interpolation-search'].includes(algorithm)) {
      newArray.sort((a, b) => a - b);
    }
    set({ arraySize: size, array: newArray });
    get().generateSteps();
  },
  setAlgorithm: (slug) => {
    const meta = SEARCHING_ALGORITHMS.find((a) => a.slug === slug)!;
    const { array } = get();
    let newArray = [...array];
    if (['binary-search', 'jump-search', 'interpolation-search'].includes(slug)) {
      newArray.sort((a, b) => a - b);
    } else {
      // Shuffle if moving to an unsorted required algorithm (Linear)
      // Or just regenerate to be sure it's random
      newArray = generateArray(array.length, 1, 100);
    }
    set({ algorithm: slug, algorithmMetadata: meta, array: newArray });
    get().generateSteps();
  },
  setTarget: (val) => {
    set({ targetValue: val });
    const { array, algorithm } = get();
    const fn = searchFunctions[algorithm];
    if (fn) set({ steps: fn(array, val) });
  },
  generateSteps: () => {
    const { array, algorithm, targetValue } = get();
    const fn = searchFunctions[algorithm];
    if (fn) set({ steps: fn(array, targetValue) });
  },
}));
