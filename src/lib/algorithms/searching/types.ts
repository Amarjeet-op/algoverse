export type SearchAction = 'check' | 'found' | 'notFound' | 'eliminate' | 'midpoint';

export interface SearchStep {
  index: number;
  action: SearchAction;
}
