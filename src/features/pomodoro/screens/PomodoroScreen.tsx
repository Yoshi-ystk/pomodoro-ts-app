/**
 * ポモドーロタイマーのメイン画面コンポーネント
 * タイマーの状態表示と制御（開始/一時停止/リセット）を提供
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { usePomodoroTimer } from "../hooks/usePomodoroTimer";
import { formatTime } from "../../../utils/time";
import { usePomodoroSettings } from "../contexts/PomodoroSettingsContext";
import { TimerDisplay } from "../../../components/TimerDisplay";
import { GradientBackground } from "../../../components/GradientBackground";
import { CustomButton } from "../../../components/CustomButton";
import { useTheme } from "../../../theme/ThemeContext";
import { getThemeColors } from "../../../theme/colors";
import { shadows } from "../../../theme/colors";

export const PomodoroScreen = () => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);

  // 設定コンテキストから設定を取得
  const { isLoading, getPhaseLabel } = usePomodoroSettings();

  // タイマーフックからタイマーの状態と制御関数を取得
  const { seconds, phase, round, isRunning, start, pause, reset } =
    usePomodoroTimer();

  // 現在のフェーズの表示名を取得
  const phaseLabel = getPhaseLabel(phase);

  // 設定読み込み中のローディング表示
  if (isLoading) {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <Text style={{ color: colors.text.primary }}>読み込み中...</Text>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      {/* フェーズ表示 - グロー効果付き */}
      <View style={styles.phaseContainer}>
        <Text
          style={[
            styles.phaseText,
            {
              color: colors.primary.main,
              textShadowColor: colors.primary.glow,
            },
          ]}
        >
          {phaseLabel}
        </Text>
        <View
          style={[
            styles.roundBadge,
            shadows.glow.small,
            {
              backgroundColor: colors.primary.background,
              borderColor: colors.primary.main,
            },
          ]}
        >
          <Text style={[styles.roundText, { color: colors.text.secondary }]}>
            {round} 周目
          </Text>
        </View>
      </View>

      {/* タイマー表示 */}
      <TimerDisplay time={formatTime(seconds)} />

      {/* コントロールボタン */}
      <View style={styles.controlsContainer}>
        <CustomButton
          title={isRunning ? "PAUSE" : "START"}
          onPress={isRunning ? pause : start}
          variant={isRunning ? "secondary" : "primary"}
          size="large"
          style={styles.controlButton}
        />
        <CustomButton
          title="RESET"
          onPress={reset}
          variant="outline"
          size="large"
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
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 3,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  roundBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  roundText: {
    fontSize: 14,
    fontFamily: "Orbitron-Medium",
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
