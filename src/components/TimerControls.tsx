import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { PomodoroControls } from "../features/pomodoro/types/pomodoro";

type Props = PomodoroControls & {
  isRunning: boolean;
};

export const TimerControls: React.FC<Props> = ({
  isRunning,
  toggle,
  reset,
}) => {
  return (
    <View style={styles.buttonRow}>
      <Button title={isRunning ? "一時停止" : "開始"} onPress={toggle} />
      <Button title="リセット" onPress={reset} />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonRow: { flexDirection: "row", gap: 10 },
});
