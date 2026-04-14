import { create } from 'zustand';
import { RecursionStep, RecursionNode } from '@/lib/algorithms/recursion/types';
import { RECURSION_ALGORITHMS } from '@/config/algorithms';
import { fibonacci } from '@/lib/algorithms/recursion/fibonacci';
import { factorial } from '@/lib/algorithms/recursion/factorial';
import { towerOfHanoi } from '@/lib/algorithms/recursion/towerOfHanoi';
import { nQueens } from '@/lib/algorithms/recursion/nQueens';

interface RecursionResult {
  steps: RecursionStep[];
  tree: RecursionNode;
  moves?: string[];
  solution?: number[] | null;
}

const recursionFunctions: Record<string, (n: number) => RecursionResult> = {
  fibonacci,
  factorial,
  'tower-of-hanoi': towerOfHanoi,
  'n-queens': nQueens,
};

interface RecursionStore {
  algorithm: string;
  input: number;
  steps: RecursionStep[];
  tree: RecursionNode | null;
  moves: string[];
  solution: number[] | null;
  algorithmMetadata: typeof RECURSION_ALGORITHMS[0];
  setAlgorithm: (slug: string) => void;
  setInput: (val: number) => void;
  generateSteps: () => void;
}

export const useRecursionStore = create<RecursionStore>((set, get) => ({
  algorithm: 'fibonacci',
  input: 5,
  steps: [],
  tree: null,
  moves: [],
  solution: null,
  algorithmMetadata: RECURSION_ALGORITHMS[0],
  setAlgorithm: (slug) => {
    const meta = RECURSION_ALGORITHMS.find((a) => a.slug === slug)!;
    set({ algorithm: slug, algorithmMetadata: meta });
    get().generateSteps();
  },
  setInput: (val) => {
    set({ input: val });
    get().generateSteps();
  },
  generateSteps: () => {
    const { algorithm, input } = get();
    const fn = recursionFunctions[algorithm];
    if (fn) {
      const result = fn(input);
     set({ steps: result.steps, tree: result.tree, moves: result.moves || [], solution: result.solution || null });
    }
  },
}));
