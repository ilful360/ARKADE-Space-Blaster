import { useRef, useEffect, useCallback } from 'react';

export function useGameLoop(callback: (deltaTime: number) => void, isRunning: boolean) {
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== 0) {
      const deltaTime = Math.min((time - previousTimeRef.current) / 1000, 0.05);
      callbackRef.current(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (isRunning) {
      previousTimeRef.current = 0;
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isRunning, animate]);
}
