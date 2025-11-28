/**
 * ポモドーロタイマー関連の型定義
 */

/**
 * タイマーのフェーズ（作業/短休憩/長休憩）
 */
export type PomodoroPhase = "work" | "shortBreak" | "longBreak";

/**
 * タイマーの設定（時間とセット回数）
 */
export type PomodoroConfig = {
  workSeconds: number; // 作業時間（秒）
  shortBreakSeconds: number; // 短休憩時間（秒）
  longBreakSeconds: number; // 長休憩時間（秒）
  roundsUntilLongBreak: number; // 長休憩までの作業回数（例: 4回作業したら長休憩）
};

/**
 * タイマーの現在の状態
 */
export type PomodoroState = {
  seconds: number; // 残り秒数
  phase: PomodoroPhase; // 現在のフェーズ
  round: number; // 現在の周回数
  isRunning: boolean; // タイマーが実行中かどうか
};

/**
 * タイマーの制御関数
 */
export type PomodoroControls = {
  start: () => void; // タイマーを開始
  pause: () => void; // タイマーを一時停止
  reset: () => void; // タイマーをリセット
};

/**
 * アプリ全体の設定
 */
export type PomodoroSettings = {
  phaseLabels: {
    work: string; // 作業フェーズの表示名
    shortBreak: string; // 短休憩フェーズの表示名
    longBreak: string; // 長休憩フェーズの表示名
  };
  useCustomConfig: boolean; // カスタムモードが有効かどうか
  customConfig: PomodoroConfig; // カスタム設定（カスタムモード時の設定）
};

/**
 * usePomodoroTimerフックの戻り値の型
 * タイマーの状態と制御関数を組み合わせた型
 */
export type UsePomodoroTimerReturn = PomodoroState & PomodoroControls;
