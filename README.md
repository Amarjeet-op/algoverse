# ALGOVERSE ⚡

### Premium Interactive Algorithm Visualizer

ALGOVERSE is a state-of-the-art web application designed to help developers and students visualize, understand, and master complex algorithms through beautiful real-time animations and step-by-step execution.


## 🚀 Vision

Most algorithm visualizers are basic and functional. **ALGOVERSE** aims to provide a **SaaS-grade experience** with:
- **Premium Aesthetics**: Smooth glassmorphism, vibrant neon accents, and fluid animations.
- **Interactive Control**: Play, pause, step-forward, and step-backward through execution.
- **Real-time Analysis**: Watch complexity markers and code highlighting as the algorithm runs.
- **Customizable Data**: Adjust array sizes, speeds, and grid layouts on the fly.

---

## 📦 Modules

### ⣿ Sorting
Visualize how sorting algorithms organize data. Includes **Bubble Sort, Quick Sort, Merge Sort, Insertion Sort, Selection Sort, and Heap Sort**.

Features:
- Real-time bar animations
- Color-coded states (comparing, swapping, sorted, pivot)
- Step-by-step execution control
- Code display with syntax highlighting

### ⟐ Searching
Watch algorithms find elements in arrays using **Linear Search, Binary Search, Jump Search, and Interpolation Search**.

Features:
- Array visualization with target highlighting
- Binary search tree representation
- Step-by-step element comparison

### ⌘ Recursion
See recursive calls unfold as visual trees. Includes **Fibonacci sequence, Factorials, Tower of Hanoi, and the N-Queens problem**.

Features:
- Call stack visualization
- Recursion tree display
- Interactive input configuration

### ⊞ Pathfinding
Explore how algorithms navigate grids. Draw walls and watch **Dijkstra, A*, BFS, and DFS** find the shortest path.

Features:
- Interactive grid with wall drawing
- Start/end point selection
- Path visualization with distance markers

### ◎ Maze Solver
Generate complex mazes using **Recursive Backtracking** and solve them using various traversal algorithms.

Features:
- Maze generation with multiple algorithms
- Solution path display
- Animated solving process

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.2.2 (App Router) |
| UI Library | React 19.2.4 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| State Management | Zustand 5.0.12 |
| Animations | Framer Motion 12.38.0 |
| Icons | Lucide React 1.7.0 |

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Amarjeet-op/algoverse.git
cd algoverse

# Install dependencies
npm install

# Run the development server
npm run dev

# Open http://localhost:3000
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 📊 Algorithm Complexity Reference

### Sorting Algorithms

| Algorithm    | Best Case    | Average Case | Worst Case | Space   |
|--------------|--------------|--------------|------------|---------|
| Bubble Sort  | O(n)         | O(n²)        | O(n²)      | O(1)    |
| Quick Sort   | O(n log n)   | O(n log n)   | O(n²)      | O(log n)|
| Merge Sort   | O(n log n)   | O(n log n)   | O(n log n) | O(n)    |
| Insertion    | O(n)         | O(n²)        | O(n²)      | O(1)    |
| Selection    | O(n²)        | O(n²)        | O(n²)      | O(1)    |
| Heap Sort    | O(n log n)   | O(n log n)   | O(n log n) | O(1)    |

### Searching Algorithms

| Algorithm          | Best Case | Average Case | Worst Case | Space |
|--------------------|-----------|--------------|------------|-------|
| Linear Search      | O(1)      | O(n)         | O(n)       | O(1)  |
| Binary Search      | O(1)      | O(log n)     | O(log n)   | O(1)  |
| Jump Search        | O(1)      | O(√n)        | O(√n)      | O(1)  |
| Interpolation      | O(1)      | O(log log n) | O(n)       | O(1)  |

### Pathfinding Algorithms

| Algorithm | Time Complexity | Space Complexity |
|-----------|-----------------|------------------|
| Dijkstra  | O(V + E log V) | O(V)             |
| A*        | O(V log V)     | O(V)             |
| BFS       | O(V + E)       | O(V)             |
| DFS       | O(V + E)       | O(V)             |

---

## 📂 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing page
│   ├── sorting/            # Sorting visualization page
│   ├── searching/          # Searching visualization page
│   ├── pathfinding/        # Pathfinding visualization page
│   ├── maze/               # Maze solver page
│   ├── recursion/          # Recursion visualizer page
│   └── layout.tsx          # Root layout
│
├── components/             # React components
│   ├── layout/             # Shell, Header, Footer, ThemeToggle
│   ├── sorting/            # SortingBars, SortingControls
│   ├── pathfinding/        # Grid, PathfindingControls
│   ├── maze/               # MazeGrid, MazeControls
│   ├── recursion/          # RecursionTree, CallStack, RecursionControls
│   ├── searching/          # SearchingArray, SearchingControls
│   ├── shared/             # ComplexityInfo
│   └── ui/                 # CodeBlock, Badge
│
├── lib/                    # Core library code
│   ├── algorithms/         # Algorithm implementations
│   │   ├── sorting/        # bubbleSort, quickSort, mergeSort, etc.
│   │   ├── searching/     # linearSearch, binarySearch, etc.
│   │   ├── pathfinding/   # dijkstra, aStar, bfs, dfs
│   │   ├── maze/          # recursiveBacktrack, wallFollowing
│   │   └── recursion/     # fibonacci, factorial, towerOfHanoi, nQueens
│   ├── store/             # Zustand stores (sorting, pathfinding, etc.)
│   ├── hooks/             # useAnimation
│   └── utils/             # Helper functions
│
├── config/                 # Configuration
│   ├── algorithms.ts       # Algorithm metadata & complexity
│   └── codeSnippets.ts     # Code snippets for display
│
└── types/                  # TypeScript type definitions
```

---

## 🔧 Key Features

### Interactive Controls
- **Play/Pause** - Start or pause visualization
- **Step Forward** - Execute one step at a time
- **Restart** - Reset to initial state
- **Randomize** - Generate new random data
- **Speed Control** - Adjust animation speed (0.1x - 10x)

### Real-time Statistics
- **Comparisons (CMP)** - Number of comparisons made
- **Swaps (SWP)** - Number of swaps/operations performed
- **Time** - Elapsed execution time

### Visual Feedback
- Color-coded states (comparing, swapping, sorted, pivot)
- Code highlighting during execution
- Complexity information display

---

## 📄 License

This project is open-source and available under the MIT License.

---

Built with ❤️ by the ALGOVERSE Team.
