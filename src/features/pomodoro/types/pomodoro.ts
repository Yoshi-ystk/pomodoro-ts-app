export type PomodoroPhase = "work" | "shortBreak" | "longBreak";

export type PomodoroConfig = {
  workSeconds: number;
  shortBreakSeconds: number;
  longBreakSeconds: number;
  roundsUntilLongBreak: number;
};

export type PomodoroState = {
  seconds: number;
  phase: PomodoroPhase;
  round: number;
  isRunning: boolean;
};

export type PomodoroControls = {
  toggle: () => void;
  reset: () => void;
};

export type PomodoroSettings = {
  phaseLabels: {
    work: string;
    shortBreak: string;
    longBreak: string;
  };
  useCustomConfig: boolean;
  customConfig: PomodoroConfig;
};
export type UsePomodoroTimerReturn = PomodoroState & PomodoroControls;
