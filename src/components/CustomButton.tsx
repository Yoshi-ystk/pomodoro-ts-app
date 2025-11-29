import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, shadows, gradients } from "../theme/colors";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

export const CustomButton: React.FC<Props> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
}) => {
  const ButtonContent = () => (
    <>
      {loading ? (
        <ActivityIndicator
          color={
            variant === "outline" ? colors.primary.main : colors.text.primary
          }
        />
      ) : (
        <Text
          style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`]]}
        >
          {title}
        </Text>
      )}
    </>
  );

  if (variant === "primary") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[
          styles.button,
          styles[size],
          disabled && styles.disabled,
          style,
        ]}
      >
        <LinearGradient
          colors={gradients.button.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, styles[size]]}
        >
          <ButtonContent />
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === "secondary") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[
          styles.button,
          styles.secondary,
          styles[size],
          disabled && styles.disabled,
          shadows.glow.subtle,
          style,
        ]}
      >
        <ButtonContent />
      </TouchableOpacity>
    );
  }

  // outline variant
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        styles.outline,
        styles[size],
        disabled && styles.disabled,
        style,
      ]}
    >
      <ButtonContent />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  gradient: {
    width: "100%",
    height: "40%",
    alignItems: "center",
    justifyContent: "center",
  },
  secondary: {
    backgroundColor: colors.primary.background,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.primary.main,
  },
  small: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 100,
  },
  medium: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    minWidth: 140,
  },
  large: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    minWidth: 200,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontFamily: "Orbitron-Medium",
    fontWeight: "600",
    letterSpacing: 1,
  },
  primaryText: {
    color: colors.text.primary,
    textShadowColor: colors.primary.glowStrong,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  secondaryText: {
    color: colors.primary.main,
  },
  outlineText: {
    color: colors.primary.main,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
});
