/**
 * ポモドーロタイマーのロジックを管理するカスタムフック
 *
 * タイマーの状態（残り秒数、フェーズ、周回数、実行状態）を管理し、
 * 自動的にフェーズ遷移を行う。
 *
 * @returns タイマーの状態と制御関数
 */
import { useState, useEffect } from "react";
import { usePomodoroSettings } from "../contexts/PomodoroSettingsContext";
import { PomodoroPhase, UsePomodoroTimerReturn } from "../types/pomodoro";

export const usePomodoroTimer = (): UsePomodoroTimerReturn => {
  // 設定コンテキストからタイマー設定を取得
  const { config } = usePomodoroSettings();

  // タイマーの状態管理
  const [phase, setPhase] = useState<PomodoroPhase>("work"); // 現在のフェーズ（作業/短休憩/長休憩）
  const [round, setRound] = useState(1); // 現在の周回数
  const [seconds, setSeconds] = useState(config.workSeconds); // 残り秒数
  const [isRunning, setIsRunning] = useState(false); // タイマーが実行中かどうか

  /**
   * タイマーのカウントダウン処理
   * isRunningがtrueの間、1秒ごとに残り秒数を減らす
   */
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    // クリーンアップ：タイマーをクリア
    return () => clearInterval(timer);
  }, [isRunning]);

  /**
   * 残り秒数が0になったら次のフェーズへ自動遷移
   *
   * 遷移ロジック：
   * - 作業 → 短休憩（通常）または長休憩（周回数がroundsUntilLongBreakの倍数の場合）
   * - 休憩（短休憩/長休憩） → 作業（周回数をインクリメント）
   */
  useEffect(() => {
    if (seconds !== 0) return;

    // タイマーを自動停止
    setIsRunning(false);

    if (phase === "work") {
      // 作業が終了した場合
      // 周回数がroundsUntilLongBreakの倍数かどうかで長休憩か短休憩かを判定
      if (round % config.roundsUntilLongBreak === 0) {
        setPhase("longBreak");
        setSeconds(config.longBreakSeconds);
      } else {
        setPhase("shortBreak");
        setSeconds(config.shortBreakSeconds);
      }
    } else {
      // 休憩が終了した場合、次の作業フェーズに移行
      setPhase("work");
      setSeconds(config.workSeconds);
      setRound((r) => r + 1); // 周回数をインクリメント
    }
  }, [seconds, config, round, phase]);

  /**
   * タイマーを開始する
   */
  const start = () => setIsRunning(true);

  /**
   * タイマーを一時停止する
   */
  const pause = () => setIsRunning(false);

  /**
   * タイマーをリセットする
   * 作業フェーズ、1周目、設定された作業時間に戻す
   */
  const reset = () => {
    setPhase("work");
    setRound(1);
    setSeconds(config.workSeconds);
    setIsRunning(false);
  };

  /**
   * 設定（config）が変更されたらタイマーをリセット
   * ユーザーが設定を変更した際に、新しい設定を反映させる
   */
  useEffect(() => {
    reset();
  }, [config]);

  return { seconds, phase, round, isRunning, start, pause, reset };
};
