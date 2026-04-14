import { AlgorithmMeta } from '@/types';

export const CATEGORIES = [
  { id: 'sorting', name: 'Sorting', icon: 'bars-3', description: 'Visualize how sorting algorithms organize data' },
  { id: 'searching', name: 'Searching', icon: 'magnifying-glass', description: 'Watch algorithms find elements in arrays' },
  { id: 'recursion', name: 'Recursion', icon: 'arrows-right-left', description: 'See recursive calls unfold as trees and stacks' },
  { id: 'pathfinding', name: 'Pathfinding', icon: 'map', description: 'Explore how algorithms navigate grids' },
  { id: 'maze', name: 'Maze Solver', icon: 'rectangle-group', description: 'Generate and solve mazes step by step' },
] as const;

export const SORTING_ALGORITHMS: AlgorithmMeta[] = [
  { name: 'Bubble Sort', slug: 'bubble-sort', description: 'Repeatedly swaps adjacent elements if they are in wrong order', category: 'sorting', complexity: { timeBest: 'O(n)', timeAvg: 'O(n²)', timeWorst: 'O(n²)', space: 'O(1)' } },
  { name: 'Quick Sort', slug: 'quick-sort', description: 'Divides array using a pivot and recursively sorts partitions', category: 'sorting', complexity: { timeBest: 'O(n log n)', timeAvg: 'O(n log n)', timeWorst: 'O(n²)', space: 'O(log n)' } },
  { name: 'Merge Sort', slug: 'merge-sort', description: 'Divides array in half, sorts halves, then merges them', category: 'sorting', complexity: { timeBest: 'O(n log n)', timeAvg: 'O(n log n)', timeWorst: 'O(n log n)', space: 'O(n)' } },
  { name: 'Insertion Sort', slug: 'insertion-sort', description: 'Builds sorted array one element at a time by inserting each into correct position', category: 'sorting', complexity: { timeBest: 'O(n)', timeAvg: 'O(n²)', timeWorst: 'O(n²)', space: 'O(1)' } },
  { name: 'Selection Sort', slug: 'selection-sort', description: 'Selects the smallest element and places it at the beginning', category: 'sorting', complexity: { timeBest: 'O(n²)', timeAvg: 'O(n²)', timeWorst: 'O(n²)', space: 'O(1)' } },
  { name: 'Heap Sort', slug: 'heap-sort', description: 'Builds a max heap and repeatedly extracts the maximum element', category: 'sorting', complexity: { timeBest: 'O(n log n)', timeAvg: 'O(n log n)', timeWorst: 'O(n log n)', space: 'O(1)' } },
];

export const SEARCHING_ALGORITHMS: AlgorithmMeta[] = [
  { name: 'Linear Search', slug: 'linear-search', description: 'Checks each element sequentially until target is found', category: 'searching', complexity: { timeBest: 'O(1)', timeAvg: 'O(n)', timeWorst: 'O(n)', space: 'O(1)' } },
  { name: 'Binary Search', slug: 'binary-search', description: 'Divides sorted array in half repeatedly to find target', category: 'searching', complexity: { timeBest: 'O(1)', timeAvg: 'O(log n)', timeWorst: 'O(log n)', space: 'O(1)' } },
  { name: 'Jump Search', slug: 'jump-search', description: 'Jumps ahead by fixed block size then linear searches within block', category: 'searching', complexity: { timeBest: 'O(1)', timeAvg: 'O(√n)', timeWorst: 'O(√n)', space: 'O(1)' } },
  { name: 'Interpolation Search', slug: 'interpolation-search', description: 'Estimates position of target using value distribution', category: 'searching', complexity: { timeBest: 'O(1)', timeAvg: 'O(log log n)', timeWorst: 'O(n)', space: 'O(1)' } },
];

export const RECURSION_ALGORITHMS: AlgorithmMeta[] = [
  { name: 'Fibonacci', slug: 'fibonacci', description: 'Computes Fibonacci sequence where each number is the sum of the two preceding', category: 'recursion', complexity: { timeBest: 'O(2ⁿ)', timeAvg: 'O(2ⁿ)', timeWorst: 'O(2ⁿ)', space: 'O(n)' } },
  { name: 'Factorial', slug: 'factorial', description: 'Computes n! as n * (n-1) * ... * 1 recursively', category: 'recursion', complexity: { timeBest: 'O(n)', timeAvg: 'O(n)', timeWorst: 'O(n)', space: 'O(n)' } },
  { name: 'Tower of Hanoi', slug: 'tower-of-hanoi', description: 'Moves disks between pegs following specific rules using recursion', category: 'recursion', complexity: { timeBest: 'O(2ⁿ)', timeAvg: 'O(2ⁿ)', timeWorst: 'O(2ⁿ)', space: 'O(n)' } },
  { name: 'N-Queens', slug: 'n-queens', description: 'Places N queens on an NxN board so none attack each other', category: 'recursion', complexity: { timeBest: 'O(N!)', timeAvg: 'O(N!)', timeWorst: 'O(N!)', space: 'O(N)' } },
];

export const PATHFINDING_ALGORITHMS: AlgorithmMeta[] = [
  { name: 'Dijkstra', slug: 'dijkstra', description: 'Find shortest path using weighted distances from start', category: 'pathfinding', complexity: { timeBest: 'O(V + E log V)', timeAvg: 'O(V + E log V)', timeWorst: 'O(V + E log V)', space: 'O(V)' } },
  { name: 'A* (A-Star)', slug: 'astar', description: 'Uses heuristics to find shortest path more efficiently', category: 'pathfinding', complexity: { timeBest: 'O(V log V)', timeAvg: 'O(V log V)', timeWorst: 'O(V log V)', space: 'O(V)' } },
  { name: 'BFS', slug: 'bfs', description: 'Explores level by level using a queue', category: 'pathfinding', complexity: { timeBest: 'O(V + E)', timeAvg: 'O(V + E)', timeWorst: 'O(V + E)', space: 'O(V)' } },
  { name: 'DFS', slug: 'dfs', description: 'Explores as far as possible along each branch before backtracking', category: 'pathfinding', complexity: { timeBest: 'O(V + E)', timeAvg: 'O(V + E)', timeWorst: 'O(V + E)', space: 'O(V)' } },
];

export const MAZE_ALGORITHMS: AlgorithmMeta[] = [
  { name: 'Recursive Backtracking', slug: 'recursive-backtrack', description: 'Generates a perfect maze with a single unique path using a depth-first search approach.', category: 'maze', complexity: { timeBest: 'O(V)', timeAvg: 'O(V)', timeWorst: 'O(V)', space: 'O(V)' } },
  { name: 'Random Maze', slug: 'random-maze', description: 'Generates a maze with randomized wall blocks, often resulting in multiple paths to the end.', category: 'maze', complexity: { timeBest: 'O(V)', timeAvg: 'O(V)', timeWorst: 'O(V)', space: 'O(1)' } },
];
