import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { gradients } from "../theme/colors";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "default" | "dark";
};

export const GradientBackground: React.FC<Props> = ({
  children,
  style,
  variant = "default",
}) => {
  const gradientColors =
    variant === "dark"
      ? gradients.background.dark
      : gradients.background.radial;

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
