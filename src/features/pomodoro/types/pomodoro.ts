export type PomodoroState = {
  seconds: number;
  isRunning: boolean;
};

export type PomodoroControls = {
  toggle: () => void;
  reset: () => void;
};

export type UsePomodoroTimerReturn = PomodoroState & PomodoroControls;
