import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAnimationProps {
  totalSteps: number;
  speed: number;
  onComplete?: () => void;
}

interface UseAnimationReturn {
  currentStep: number;
  isPlaying: boolean;
  isPaused: boolean;
  isComplete: boolean;
  speed: number;
  play: () => void;
  pause: () => void;
  reset: () => void;
  jumpToStep: (step: number) => void;
  stepForward: () => void;
  stepBackward: () => void;
  setSpeed: (speed: number) => void;
}

export function useAnimation({ totalSteps, speed: initialSpeed, onComplete }: UseAnimationProps): UseAnimationReturn {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  const requestRef = useRef<number | undefined>(undefined);
  const lastUpdateRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = undefined;
    }
  }, []);

  const animate = useCallback((time: number) => {
    if (totalSteps <= 0) return;
    if (!lastUpdateRef.current) lastUpdateRef.current = time;
    
    const interval = Math.max(1, 400 / (speed * 2)); 
    const delta = time - lastUpdateRef.current;

    if (delta >= interval) {
      const stepsToAdvance = Math.max(1, Math.floor(delta / interval));
      
      setCurrentStep((prev) => {
        const next = prev + stepsToAdvance;
        if (next >= totalSteps - 1) {
          setIsPlaying(false);
          setIsComplete(true);
          onComplete?.();
          return Math.max(0, totalSteps - 1);
        }
        return next;
      });
      lastUpdateRef.current = time;
    }

    requestRef.current = requestAnimationFrame(animate);
  }, [speed, totalSteps, onComplete]);

  useEffect(() => {
    if (currentStep >= totalSteps && totalSteps > 0) {
      setCurrentStep(Math.max(0, totalSteps - 1));
    }
  }, [totalSteps, currentStep]);

  useEffect(() => {
    if (isPlaying && !isPaused && !isComplete) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      clearTimer();
    }
    return () => clearTimer();
  }, [isPlaying, isPaused, isComplete, animate, clearTimer]);

  const play = useCallback(() => {
    if (totalSteps <= 0) return;
    if (currentStep >= totalSteps - 1) {
      setCurrentStep(0);
      setIsComplete(false);
    }
    setIsPlaying(true);
    setIsPaused(false);
    lastUpdateRef.current = 0;
  }, [currentStep, totalSteps]);

  const pause = useCallback(() => {
    setIsPaused(true);
    clearTimer();
  }, [clearTimer]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
    setIsComplete(false);
    setCurrentStep(0);
    lastUpdateRef.current = 0;
    clearTimer();
  }, [clearTimer]);

  const jumpToStep = useCallback((step: number) => {
    const target = Math.min(Math.max(0, step), totalSteps - 1);
    setCurrentStep(target);
    setIsComplete(target >= totalSteps - 1);
  }, [totalSteps]);

  const stepForward = useCallback(() => {
    setIsPaused(true);
    setIsPlaying(false);
    setCurrentStep((prev) => {
      const next = Math.min(prev + 1, totalSteps - 1);
      if (next >= totalSteps - 1) setIsComplete(true);
      return next;
    });
  }, [totalSteps]);

  const stepBackward = useCallback(() => {
    setIsPaused(true);
    setIsPlaying(false);
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  return { currentStep, isPlaying, isPaused, isComplete, speed, setSpeed, play, pause, reset, jumpToStep, stepForward, stepBackward };
}
