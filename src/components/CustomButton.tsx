/**
 * カスタムボタンコンポーネント
 * テーマ対応のボタン。primary、secondary、outlineの3種類のバリアントをサポート
 */
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { getThemeColors } from "../theme/colors";
import { shadows } from "../theme/colors";

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
  const { theme } = useTheme();
  const colors = getThemeColors(theme);

  // ボタン内のコンテンツ（ローディング表示またはテキスト）
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
          style={[
            styles.text,
            styles[`${variant}Text`],
            styles[`${size}Text`],
            variant === "primary" && {
              color: "#FFFFFF",
              textShadowColor: colors.primary.glowStrong,
            },
            (variant === "secondary" || variant === "outline") && {
              color: colors.primary.main,
            },
          ]}
        >
          {title}
        </Text>
      )}
    </>
  );

  // primary: 塗りつぶしボタン
  if (variant === "primary") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[
          styles.button,
          styles.primary,
          styles[size],
          disabled && styles.disabled,
          {
            backgroundColor: colors.primary.main,
          },
          style,
        ]}
      >
        <ButtonContent />
      </TouchableOpacity>
    );
  }

  // secondary: 背景色付きボーダーボタン
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
          {
            backgroundColor: colors.primary.background,
            borderColor: colors.primary.main,
          },
          style,
        ]}
      >
        <ButtonContent />
      </TouchableOpacity>
    );
  }

  // outline: ボーダーのみのボタン
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
        {
          borderColor: colors.primary.main,
        },
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
  primary: {
    // 背景色は動的に適用
  },
  secondary: {
    borderWidth: 1,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
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
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  secondaryText: {
    // スタイルは動的に適用されるため空
  },
  outlineText: {
    // スタイルは動的に適用されるため空
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
