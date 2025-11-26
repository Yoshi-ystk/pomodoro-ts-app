import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { usePomodoroTimer } from "../hooks/usePomodoroTimer";
import { formatTime } from "../../../utils/time";
import { TimerControls } from "../../../components/TimerControls";
import { usePomodoroSettings } from "../contexts/PomodoroSettingsContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Pomodoro: undefined;
  Settings: undefined;
};

export const PomodoroScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isLoading, getPhaseLabel } = usePomodoroSettings();
  const { seconds, phase, round, isRunning, start, pause, reset } =
    usePomodoroTimer();

  const phaseLabel = getPhaseLabel(phase);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate("Settings")}
      >
        <Text style={styles.settingsButtonText}>設定</Text>
      </TouchableOpacity>
      <Text style={styles.phaseText}>{phaseLabel}</Text>
      <Text style={styles.roundText}>{round} 周目</Text>
      <Text style={styles.time}>{formatTime(seconds)}</Text>

      <TimerControls
        isRunning={isRunning}
        start={start}
        pause={pause}
        reset={reset}
      />
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
  settingsButton: {
    position: "absolute",
    top: 60,
    right: 24,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  settingsButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  time: { fontSize: 60, fontWeight: "bold", marginBottom: 40 },
  phaseText: { fontSize: 24, marginBottom: 10 },
  roundText: { fontSize: 20, marginBottom: 20 },
});
