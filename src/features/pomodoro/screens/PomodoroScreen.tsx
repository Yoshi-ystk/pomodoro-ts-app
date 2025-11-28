/**
 * ポモドーロタイマーのメイン画面コンポーネント
 *
 * タイマーの状態（残り時間、フェーズ、周回数）を表示し、
 * タイマーの制御（開始/一時停止/リセット）と設定画面への遷移を提供。
 */
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { usePomodoroTimer } from "../hooks/usePomodoroTimer";
import { formatTime } from "../../../utils/time";
import { TimerControls } from "../../../components/TimerControls";
import { usePomodoroSettings } from "../contexts/PomodoroSettingsContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { TimerDisplay } from "../../../components/TimerDisplay";
/**
 * ナビゲーションのパラメータ型定義
 */
type RootStackParamList = {
  Pomodoro: undefined;
  Settings: undefined;
};

export const PomodoroScreen = () => {
  // ナビゲーション
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // 設定コンテキストから設定を取得
  const { isLoading, getPhaseLabel } = usePomodoroSettings();

  // タイマーフックからタイマーの状態と制御関数を取得
  const { seconds, phase, round, isRunning, start, pause, reset } =
    usePomodoroTimer();

  // 現在のフェーズの表示名を取得
  const phaseLabel = getPhaseLabel(phase);

  // 設定の読み込み中はローディング表示
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 設定画面への遷移ボタン */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate("Settings")}
      >
        <Text style={styles.settingsButtonText}>設定</Text>
      </TouchableOpacity>

      {/* 現在のフェーズ表示（作業/短休憩/長休憩） */}
      <Text style={styles.phaseText}>{phaseLabel}</Text>

      {/* 現在の周回数表示 */}
      <Text style={styles.roundText}>{round} 周目</Text>

      {/* 残り時間表示（mm:ss形式） */}
      <TimerDisplay time={formatTime(seconds)} />

      {/* タイマー制御ボタン（開始/一時停止/リセット） */}
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

  phaseText: { fontSize: 24, marginBottom: 10 },
  roundText: { fontSize: 20, marginBottom: 20 },
});
