/**
 * タイマーの残り時間を表示するコンポーネント
 * mm:ss形式の時間を大きなフォントで表示
 */
import React from "react";
import { Text, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { getThemeColors } from "../theme/colors";

type Props = {
  /** 表示する時間（mm:ss形式の文字列） */
  time: string;
};

export const TimerDisplay: React.FC<Props> = ({ time }) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);

  return (
    <Text
      style={[styles.time, { color: colors.primary.main, textShadowColor: colors.primary.glowStrong }]}
      numberOfLines={1}
      adjustsFontSizeToFit={true}
      minimumFontScale={0.75} // 最小フォントサイズを75%に制限
    >
      {time}
    </Text>
  );
};

const styles = StyleSheet.create({
  time: {
    fontSize: 72,
    fontFamily: "Orbitron-Bold",
    marginBottom: 40,
    width: "100%",
    textAlign: "center",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 24,
    letterSpacing: 6,
  },
});
