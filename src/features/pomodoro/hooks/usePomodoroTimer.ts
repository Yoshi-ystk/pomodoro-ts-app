import { useState, useEffect } from "react";
import { usePomodoroSettings } from "../contexts/PomodoroSettingsContext";
import { PomodoroPhase, UsePomodoroTimerReturn } from "../types/pomodoro";

export const usePomodoroTimer = (): UsePomodoroTimerReturn => {
  const { config } = usePomodoroSettings();
  const [phase, setPhase] = useState<PomodoroPhase>("work");
  const [round, setRound] = useState(1);
  const [seconds, setSeconds] = useState(config.workSeconds);
  const [isRunning, setIsRunning] = useState(false);

  // 時間のカウントダウン
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  // 0になったら次のフェーズへ自動遷移
  useEffect(() => {
    if (seconds !== 0) return;

    setIsRunning(false);

    if (phase === "work") {
      // 次が長休憩か短休憩か
      if (round % config.roundsUntilLongBreak === 0) {
        setPhase("longBreak");
        setSeconds(config.longBreakSeconds);
      } else {
        setPhase("shortBreak");
        setSeconds(config.shortBreakSeconds);
      }
    } else {
      // 休憩の次は作業
      setPhase("work");
      setSeconds(config.workSeconds);
      setRound((r) => r + 1);
    }
  }, [seconds, config, round]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);

  const reset = () => {
    setPhase("work");
    setRound(1);
    setSeconds(config.workSeconds);
    setIsRunning(false);
  };

  // configが変更されたらタイマーをリセットする
  useEffect(() => {
    reset();
  }, [config]);

  return { seconds, phase, round, isRunning, start, pause, reset };
};
