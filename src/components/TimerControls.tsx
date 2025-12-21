/**
 * タイマーの制御ボタンを表示するコンポーネント
 *
 * タイマーの状態に応じて「開始」または「一時停止」ボタンを表示し、
 * 常に「リセット」ボタンを表示。
 */
import React from "react";
import { View, StyleSheet } from "react-native";
import { PomodoroControls } from "../features/pomodoro/types/pomodoro";
import { CustomButton } from "./CustomButton";

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
      {!isRunning ? (
        <CustomButton
          title="開始"
          onPress={start}
          variant="primary"
          size="large"
        />
      ) : (
        <CustomButton
          title="一時停止"
          onPress={pause}
          variant="secondary"
          size="large"
        />
      )}
      <CustomButton
        title="リセット"
        onPress={reset}
        variant="outline"
        size="medium"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
});
