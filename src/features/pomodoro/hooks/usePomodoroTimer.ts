import { useState, useEffect } from "react";
import {
  PomodoroState,
  PomodoroControls,
  UsePomodoroTimerReturn,
} from "../types/pomodoro";

export const usePomodoroTimer = (
  initialSeconds: number = 25 * 60
): UsePomodoroTimerReturn => {
  const [seconds, setSeconds] =
    useState<PomodoroState["seconds"]>(initialSeconds);
  const [isRunning, setIsRunning] = useState<PomodoroState["isRunning"]>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const toggle = () => setIsRunning((prev) => !prev);
  const reset = () => setSeconds(initialSeconds);

  return { seconds, isRunning, toggle, reset };
};
