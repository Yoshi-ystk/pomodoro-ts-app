/**
 * FOCUSTEP アイコンデザインに基づくカラーパレット
 *
 * アイコンの特徴:
 * - 主色: 鮮やかな青緑色（シアン/アクア）のネオン風グロー
 * - 背景: ダークグレー（チャコールグレー）
 * - グラデーション: 中心が少し明るい放射状のグラデーション
 */

export const colors = {
  // メインカラー（アイコンの青緑グロー）
  primary: {
    main: "#00D9FF", // 鮮やかなシアン（メイン）
    light: "#33E0FF", // 明るいシアン（グロー効果）
    dark: "#00B8D9", // 濃いシアン
    glow: "rgba(0, 217, 255, 0.3)", // グロー効果用
    glowStrong: "rgba(0, 217, 255, 0.5)", // 強いグロー
    background: "rgba(0, 217, 255, 0.15)", // セカンダリボタンやバッジ用の背景
  },

  // アクセントカラー（バリエーション）
  accent: {
    cyan: "#00E5FF", // より明るいシアン
    teal: "#00FFD9", // ティール寄り
    aqua: "#00D4FF", // アクア
  },

  // 背景色（アイコンのダークグレー背景）
  background: {
    dark: "#1A1A1A", // チャコールグレー（メイン背景）
    darker: "#0F0F0F", // より濃い背景
    surface: "#252525", // サーフェス（カードなど）
    surfaceLight: "#2A2A2A", // 明るいサーフェス
  },

  // テキスト色
  text: {
    primary: "#FFFFFF", // メインテキスト
    secondary: "#B0B0B0", // セカンダリテキスト
    muted: "#808080", // ミュートされたテキスト
    accent: "#00D9FF", // アクセントテキスト（グロー効果付き）
  },

  // ボーダー・分割線
  border: {
    default: "rgba(0, 217, 255, 0.2)", // デフォルトボーダー（グロー風）
    light: "rgba(0, 217, 255, 0.1)",
    strong: "rgba(0, 217, 255, 0.4)",
  },

  // 状態色
  state: {
    success: "#00FF88", // 成功（グリーン寄りシアン）
    warning: "#FFD700", // 警告（ゴールド）
    error: "#FF3366", // エラー（ピンク）
    info: "#00D9FF", // 情報（プライマリと同じ）
  },
};

// グラデーション定義（アイコンの放射状グラデーションを再現）
export const gradients = {
  // 背景グラデーション（中心が明るい放射状）
  background: {
    radial: ["#1A1A1A", "#252525", "#1A1A1A"] as const,
    dark: ["#0F0F0F", "#1A1A1A"] as const,
  },

  // プライマリグラデーション（青緑のグロー）
  primary: {
    glow: ["#00D9FF", "#00E5FF", "#00D9FF"] as const,
    subtle: ["rgba(0, 217, 255, 0.1)", "rgba(0, 217, 255, 0.3)"] as const,
  },

  // ボタン用グラデーション
  button: {
    primary: ["#00D9FF", "#00B8D9"] as const,
    secondary: ["rgba(0, 217, 255, 0.2)", "rgba(0, 217, 255, 0.1)"] as const,
  },
};

// シャドウ定義（グロー効果を再現）
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

export const headerButton = {
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
    color: colors.text.accent,
  },
  activeOpacity: 0.8,
};
