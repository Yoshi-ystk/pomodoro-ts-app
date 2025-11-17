import React from "react";
import { View, StyleSheet } from "react-native";
import { usePomodoroTimer } from "./hooks/usePomodoroTimer";
import { TimerDisplay } from "../../components/TimerDisplay";
import { TimerControls } from "../../components/TimerControls";
import { formatTime } from "../../utils/time";

export const PomodoroScreen = () => {
  const { seconds, isRunning, toggle, reset } = usePomodoroTimer();

  return (
    <View style={styles.container}>
      <TimerDisplay time={formatTime(seconds)} />
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
});
