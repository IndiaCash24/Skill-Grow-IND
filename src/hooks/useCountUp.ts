import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to animate numeric values like a high-speed "boom timer" / fast odometer
 * over a specified duration (6 seconds by default), with smooth deceleration to the exact target.
 * 
 * @param targetValue The final number to reach (e.g. user updated earning amount)
 * @param duration Duration in milliseconds (default 6000ms / 6s)
 * @param triggerKey Optional key to re-trigger counting on swipe-down refresh
 * @param startValue Starting value (default 0)
 */
export function useCountUp(
  targetValue: number,
  duration: number = 6000,
  triggerKey?: number | string,
  startValue: number = 0
): number {
  const [currentValue, setCurrentValue] = useState<number>(startValue);
  const startTimeRef = useRef<number | null>(null);
  const startValRef = useRef<number>(startValue);
  const targetValRef = useRef<number>(targetValue);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // If target value is 0, display 0 immediately
    if (targetValue === 0) {
      setCurrentValue(0);
      return;
    }

    startValRef.current = 0; // Always start count-up from 0 for the boom timer experience
    targetValRef.current = targetValue;
    startTimeRef.current = null;

    if (duration <= 0) {
      setCurrentValue(targetValue);
      return;
    }

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // "Boom Timer" fast-paced kinetic curve:
      // High speed surge in the beginning, followed by an ultra-smooth glide into the final value
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const nextValue = startValRef.current + (targetValRef.current - startValRef.current) * easeOutQuart;
      
      setCurrentValue(nextValue);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentValue(targetValRef.current);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [targetValue, duration, triggerKey]);

  return currentValue;
}
