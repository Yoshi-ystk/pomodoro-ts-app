/**
 * ポモドーロタイマーのメイン画面コンポーネント
 *
 * タイマーの状態（残り時間、フェーズ、周回数）を表示し、
 * タイマーの制御（開始/一時停止/リセット）と設定画面への遷移を提供。
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { usePomodoroTimer } from "../hooks/usePomodoroTimer";
import { formatTime } from "../../../utils/time";
import { usePomodoroSettings } from "../contexts/PomodoroSettingsContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { TimerDisplay } from "../../../components/TimerDisplay";
import { GradientBackground } from "../../../components/GradientBackground";
import { CustomButton } from "../../../components/CustomButton";
import { colors, shadows } from "../../../theme/colors";
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
    <GradientBackground>
      {/* フェーズ表示 - グロー効果付き */}
      <View style={styles.phaseContainer}>
        <Text style={styles.phaseText}>{phaseLabel}</Text>
        <View style={[styles.roundBadge, shadows.glow.small]}>
          <Text style={styles.roundText}>{round} 周目</Text>
        </View>
      </View>

      {/* タイマー表示 */}
      <TimerDisplay time={formatTime(seconds)} />

      {/* コントロールボタン */}
      <View style={styles.controlsContainer}>
        {!isRunning ? (
          <CustomButton
            title="START"
            onPress={start}
            variant="primary"
            size="large"
            style={styles.controlButton}
          />
        ) : (
          <CustomButton
            title="PAUSE"
            onPress={pause}
            variant="secondary"
            size="large"
            style={styles.controlButton}
          />
        )}
        <CustomButton
          title="RESET"
          onPress={reset}
          variant="outline"
          size="medium"
          style={styles.controlButton}
        />
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  phaseContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  phaseText: {
    fontSize: 32,
    fontFamily: "Orbitron-Bold",
    color: colors.primary.main,
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 3,
    textShadowColor: colors.primary.glow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  roundBadge: {
    backgroundColor: colors.primary.background,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  roundText: {
    fontSize: 14,
    fontFamily: "Orbitron-Medium",
    color: colors.text.secondary,
    letterSpacing: 1,
  },
  controlsContainer: {
    marginTop: 40,
    gap: 16,
    width: "100%",
    alignItems: "center",
  },
  controlButton: {
    width: "100%",
    maxWidth: 280,
  },
});
