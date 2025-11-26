import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { PomodoroControls } from "../features/pomodoro/types/pomodoro";

type Props = Omit<PomodoroControls, "toggle"> & {
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
      {!isRunning && <Button title="開始" onPress={start} />}
      {isRunning && <Button title="一時停止" onPress={pause} />}
      <Button title="リセット" onPress={reset} />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonRow: { flexDirection: "row", gap: 10 },
});
