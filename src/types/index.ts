export interface AlgorithmMeta {
  name: string;
  slug: string;
  description: string;
  category: string;
  complexity: { timeBest: string; timeAvg: string; timeWorst: string; space: string };
}

export interface AnimationState {
  isPlaying: boolean;
  isPaused: boolean;
  currentStep: number;
  speed: number;
  isComplete: boolean;
}
