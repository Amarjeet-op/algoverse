export const CODE_SNIPPETS: Record<string, string> = {
  'bubble-sort': `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
  'quick-sort': `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    let pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot && ++i, [arr[i], arr[j]] = [arr[j], arr[i]]);
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
  'merge-sort': `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  let mid = Math.floor(arr.length / 2);
  let left = mergeSort(arr.slice(0, mid));
  let right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  let result = [], i = 0, j = 0;
  while (i < left.length && j < right.length) {
    result.push(left[i] <= right[j] ? left[i++] : right[j++]);
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}`,
  'insertion-sort': `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
  'selection-sort': `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}`,
  'heap-sort': `function heapSort(arr) {
  let n = arr.length;
  for (let i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}

function heapify(arr, n, i) {
  let largest = i, l = 2 * i + 1, r = 2 * i + 2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
  'linear-search': `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
  'binary-search': `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    arr[mid] < target ? (left = mid + 1) : (right = mid - 1);
  }
  return -1;
}`,
  'jump-search': `function jumpSearch(arr, target) {
  let n = arr.length;
  let step = Math.floor(Math.sqrt(n));
  let prev = 0;
  while (arr[Math.min(step, n) - 1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) return -1;
  }
  while (arr[prev] < target) {
    prev++;
    if (prev === Math.min(step, n)) return -1;
  }
  return arr[prev] === target ? prev : -1;
}`,
  'interpolation-search': `function interpolationSearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
    let pos = lo + Math.floor(
      ((target - arr[lo]) * (hi - lo)) / (arr[hi] - arr[lo])
    );
    if (arr[pos] === target) return pos;
    arr[pos] < target ? (lo = pos + 1) : (hi = pos - 1);
  }
  return -1;
}`,
  fibonacci: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
  factorial: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}`,
  'tower-of-hanoi': `function towerOfHanoi(n, source, target, auxiliary) {
  if (n === 1) {
    console.log(\`Move disk 1 from \${source} to \${target}\`);
    return;
  }
  towerOfHanoi(n - 1, source, auxiliary, target);
  console.log(\`Move disk \${n} from \${source} to \${target}\`);
  towerOfHanoi(n - 1, auxiliary, target, source);
}`,
  'n-queens': `function solveNQueens(n) {
  const board = Array(n).fill(-1);
  const solutions = [];

  function isSafe(row, col) {
    for (let r = 0; r < row; r++) {
      if (board[r] === col ||
          Math.abs(board[r] - col) === Math.abs(r - row)) return false;
    }
    return true;
  }

  function place(row) {
    if (row === n) { solutions.push([...board]); return; }
    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) { board[row] = col; place(row + 1); }
    }
  }
  place(0);
  return solutions;
}`,
  dijkstra: `function dijkstra(grid, start, end) {
  let visited = new Set();
  let distances = {};
  let previous = {};

  for each node in grid:
    distances[node] = Infinity;
  distances[start] = 0;

  while unvisited nodes remain:
    let current = node with smallest distance;
    visited.add(current);
    for each neighbor of current:
      let newDist = distances[current] + 1;
      if newDist < distances[neighbor]:
        distances[neighbor] = newDist;
        previous[neighbor] = current;

  return reconstructPath(previous, end);
}`,
  astar: `function aStar(grid, start, end) {
  let openSet = [start];
  let gScore = {};
  let fScore = {};
  let previous = {};

  gScore[start] = 0;
  fScore[start] = heuristic(start, end);

  while openSet is not empty:
    let current = node in openSet with lowest fScore;
    if current === end: return reconstructPath(previous, end);

    openSet.remove(current);
    for each neighbor of current:
      let tentativeG = gScore[current] + 1;
      if tentativeG < gScore[neighbor]:
        previous[neighbor] = current;
        gScore[neighbor] = tentativeG;
        fScore[neighbor] = tentativeG + heuristic(neighbor, end);
        openSet.add(neighbor);

  return null;
}`,
  bfs: `function bfs(grid, start, end) {
  let queue = [[start]];
  let visited = new Set([start]);

  while queue.length > 0:
    let path = queue.shift();
    let current = path[path.length - 1];

    if current === end: return path;

    for each neighbor of current:
      if not visited.has(neighbor):
        visited.add(neighbor);
        queue.push([...path, neighbor]);

  return null;
}`,
  dfs: `function dfs(grid, start, end) {
  let visited = new Set();
  let path = [];

  function explore(node) {
    if node === end: return true;
    visited.add(node);
    path.push(node);

    for each neighbor of node:
      if not visited.has(neighbor):
        if explore(neighbor): return true;

    path.pop();
    return false;
  }

  return explore(start) ? path : null;
}`,
  'recursive-backtrack': `function generateMaze(grid) {
  function carve(row, col) {
    grid[row][col].visited = true;
    let neighbors = getUnvisitedNeighbors(row, col);
    shuffle(neighbors);

    for (let neighbor of neighbors) {
      removeWall(grid, row, col, neighbor);
      carve(neighbor.row, neighbor.col);
    }
  }
  carve(0, 0);
}`,
  'random-maze': `function generateRandom(rows, cols) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (Math.random() < 0.3) {
        grid[r][c].isWall = true;
      }
    }
  }
}`,
  'wall-following': `function wallFollowing(maze, start, end) {
  let current = start;
  let direction = 0;
  let path = [current];

  while current !== end:
    if canTurnRight(current, direction):
      direction = (direction + 1) % 4;
    if canMoveForward(current, direction):
      current = move(current, direction);
      path.push(current);
    else:
      direction = (direction + 3) % 4;

  return path;
}`,
};
