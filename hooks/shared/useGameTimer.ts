import { useState, useEffect, useCallback } from "react";

/**
 * هوك مشترك للتعامل مع مؤقت اللعبة
 * 
 * @param initialSeconds الثواني الافتراضية للبدء
 * @returns حالة المؤقت ودوال للتحكم به
 */
export function useGameTimer(initialSeconds: number) {
  const [timer, setTimer] = useState<number>(initialSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // تحديث المؤقت
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const startTimer = useCallback(() => setIsTimerRunning(true), []);
  const stopTimer = useCallback(() => setIsTimerRunning(false), []);
  const resetTimer = useCallback((newTime: number = initialSeconds) => {
    setTimer(newTime);
    setIsTimerRunning(false);
  }, [initialSeconds]);

  return {
    timer,
    setTimer,
    isTimerRunning,
    setIsTimerRunning,
    startTimer,
    stopTimer,
    resetTimer
  };
}
