export interface CallFrame {
  name: string;
  args: string[];
  depth: number;
  result?: string;
  id: string;
}

export type RecursionAction = 'push' | 'pop' | 'compute';

export interface RecursionStep {
  action: RecursionAction;
  frame: CallFrame;
}

export interface RecursionNode {
  label: string;
  value?: string;
  children: RecursionNode[];
  status: 'pending' | 'active' | 'done';
  id: string;
}
