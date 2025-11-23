import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { usePomodoroTimer } from "../features/pomodoro/hooks/usePomodoroTimer";
import { formatTime } from "../utils/time";
import { TimerControls } from "../components/TimerControls";

export const PomodoroScreen = () => {
  const { seconds, phase, round, isRunning, toggle, reset } =
    usePomodoroTimer();

  return (
    <View style={styles.container}>
      <Text style={styles.phaseText}>{phase}</Text>
      <Text style={styles.roundText}>{round} 周目</Text>
      <Text style={styles.time}>{formatTime(seconds)}</Text>

      <TimerControls isRunning={isRunning} toggle={toggle} reset={reset} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  time: { fontSize: 60, fontWeight: "bold", marginBottom: 40 },
  phaseText: { fontSize: 24, marginBottom: 10 },
  roundText: { fontSize: 20, marginBottom: 20 },
});
