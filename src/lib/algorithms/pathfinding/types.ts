export interface PathNode {
  row: number;
  col: number;
  g: number;
  h: number;
  f: number;
  parent: PathNode | null;
}

export interface PathStep {
  row: number;
  col: number;
  type: 'visit' | 'path';
}
