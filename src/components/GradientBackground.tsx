/**
 * グラデーション背景コンポーネント
 * テーマに応じたグラデーション背景を提供
 */
import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../theme/ThemeContext";
import { getThemeGradients } from "../theme/colors";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "default" | "dark"; // default: 放射状グラデーション、dark: ダークグラデーション
};

export const GradientBackground: React.FC<Props> = ({
  children,
  style,
  variant = "default",
}) => {
  const { theme } = useTheme();
  const themeGradients = getThemeGradients(theme);

  // バリアントに応じてグラデーション色を選択
  const gradientColors =
    variant === "dark"
      ? themeGradients.background.dark
      : themeGradients.background.radial;

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.container, style]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
