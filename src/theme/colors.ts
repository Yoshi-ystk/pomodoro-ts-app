/**
 * カラーパレットとテーマ定義
 * ダークモードとライトモードのカラー、グラデーション、シャドウを定義
 */

// テーマの型定義
export type Theme = "light" | "dark";

// ダークモード用のカラーパレット
export const darkColors = {
  primary: {
    main: "#00D9FF",
    light: "#33E0FF",
    dark: "#00B8D9",
    glow: "rgba(0, 217, 255, 0.3)",
    glowStrong: "rgba(0, 217, 255, 0.5)",
    background: "rgba(0, 217, 255, 0.15)",
  },
  accent: {
    cyan: "#00E5FF",
    teal: "#00FFD9",
    aqua: "#00D4FF",
  },
  background: {
    dark: "#1A1A1A",
    darker: "#0F0F0F",
    surface: "#252525",
    surfaceLight: "#2A2A2A",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#B0B0B0",
    muted: "#808080",
    accent: "#00D9FF",
  },
  border: {
    default: "rgba(0, 217, 255, 0.2)",
    light: "rgba(0, 217, 255, 0.1)",
    strong: "rgba(0, 217, 255, 0.4)",
  },
  state: {
    success: "#00FF88",
    warning: "#FFD700",
    error: "#FF3366",
    info: "#00D9FF",
  },
};

// ライトモード用のカラーパレット
export const lightColors = {
  primary: {
    main: "#6366F1",
    light: "#818CF8",
    dark: "#4F46E5",
    glow: "rgba(99, 102, 241, 0.12)",
    glowStrong: "rgba(99, 102, 241, 0.2)",
    background: "rgba(99, 102, 241, 0.06)",
  },
  accent: {
    cyan: "#6366F1",
    teal: "#818CF8",
    aqua: "#6366F1",
  },
  background: {
    dark: "#ffffff",
    darker: "#f9fafb",
    surface: "#ffffff",
    surfaceLight: "#ffffff",
  },
  text: {
    primary: "#111827",
    secondary: "#4b5563",
    muted: "#6b7280",
    accent: "#6366F1",
  },
  border: {
    default: "rgba(99, 102, 241, 0.2)",
    light: "rgba(99, 102, 241, 0.1)",
    strong: "rgba(99, 102, 241, 0.3)",
  },
  state: {
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#6366F1",
  },
};

// 後方互換性のため、colorsをエクスポート（デフォルトはダークモード）
export const colors = darkColors;

// テーマに応じたカラーパレットを返す
export const getThemeColors = (theme: Theme) => {
  return theme === "light" ? lightColors : darkColors;
};

// ダークモード用のグラデーション
export const darkGradients = {
  background: {
    radial: ["#1A1A1A", "#252525", "#1A1A1A"] as const,
    dark: ["#0F0F0F", "#1A1A1A"] as const,
  },

  primary: {
    glow: ["#00D9FF", "#00E5FF", "#00D9FF"] as const,
    subtle: ["rgba(0, 217, 255, 0.1)", "rgba(0, 217, 255, 0.3)"] as const,
  },

  button: {
    primary: ["#00D9FF", "#00B8D9"] as const,
    secondary: ["rgba(0, 217, 255, 0.2)", "rgba(0, 217, 255, 0.1)"] as const,
  },
};

// グロー効果用のシャドウ定義（ダークモード用）
export const shadows = {
  glow: {
    small: {
      shadowColor: "#00D9FF",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    subtle: {
      shadowColor: "#00D9FF",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: "#00D9FF",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 16,
    },
    large: {
      shadowColor: "#00D9FF",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.7,
      shadowRadius: 24,
      elevation: 24,
    },
  },
};

// ライトモード用のグラデーション
export const lightGradients = {
  background: {
    radial: ["#ffffff", "#f9fafb", "#ffffff"] as const,
    dark: ["#f9fafb", "#ffffff"] as const,
  },
  primary: {
    glow: ["#6366F1", "#818CF8", "#6366F1"] as const,
    subtle: ["rgba(99, 102, 241, 0.06)", "rgba(99, 102, 241, 0.12)"] as const,
  },
  button: {
    primary: ["#6366F1", "#4F46E5"] as const,
    secondary: ["rgba(99, 102, 241, 0.1)", "rgba(99, 102, 241, 0.06)"] as const,
  },
};

// 後方互換性のため、gradientsをエクスポート（デフォルトはダークモード）
export const gradients = darkGradients;

// テーマに応じたグラデーションパレットを返す
export const getThemeGradients = (theme: Theme) => {
  return theme === "light" ? lightGradients : darkGradients;
};

// ヘッダーボタンのスタイル（テーマ対応）
export const getHeaderButton = (theme: Theme) => {
  const themeColors = getThemeColors(theme);
  return {
    container: {
      marginRight: 16,
      width: 48,
      height: 48,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      ...shadows.glow.subtle,
    },
    icon: {
      fontSize: 30,
      color: themeColors.text.accent,
    },
    activeOpacity: 0.8,
  };
};

// 後方互換性のため、headerButtonをエクスポート（デフォルトはダークモード）
export const headerButton = getHeaderButton("dark");
