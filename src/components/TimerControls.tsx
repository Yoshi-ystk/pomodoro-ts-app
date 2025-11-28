/**
 * タイマーの制御ボタンを表示するコンポーネント
 *
 * タイマーの状態に応じて「開始」または「一時停止」ボタンを表示し、
 * 常に「リセット」ボタンを表示。
 */
import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { PomodoroControls } from "../features/pomodoro/types/pomodoro";

type Props = Omit<PomodoroControls, "toggle"> & {
  /** タイマーが実行中かどうか */
  isRunning: boolean;
};

export const TimerControls: React.FC<Props> = ({
  isRunning,
  start,
  pause,
  reset,
}) => {
  return (
    <View style={styles.buttonRow}>
      {/* タイマーが停止中の場合、「開始」ボタンを表示 */}
      {!isRunning && <Button title="開始" onPress={start} />}
      {/* タイマーが実行中の場合、「一時停止」ボタンを表示 */}
      {isRunning && <Button title="一時停止" onPress={pause} />}
      {/* 常に「リセット」ボタンを表示 */}
      <Button title="リセット" onPress={reset} />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonRow: { flexDirection: "row", gap: 10 },
});
