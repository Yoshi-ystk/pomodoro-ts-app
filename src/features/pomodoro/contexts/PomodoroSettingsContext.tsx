/**
 * ポモドーロタイマーの設定を管理するコンテキスト
 *
 * AsyncStorageを使用して設定を永続化し、アプリ全体で設定を共有。
 * 基本モード（デフォルト設定）とカスタムモードの切り替えをサポート。
 */
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PomodoroConfig, PomodoroSettings } from "../types/pomodoro";

/**
 * AsyncStorageに保存する際のキー
 */
const STORAGE_KEYS = {
  CONFIG: "@Pomodoro:config", // タイマー設定（作業時間、休憩時間など）
  SETTING: "@pomodoro:settings", // アプリ設定（ラベル、カスタムモードの有効/無効など）
} as const;

/**
 * デフォルトのタイマー設定（基本モード）
 * ポモドーロ法の標準設定：25分作業、5分短休憩、15分長休憩、4回で1セット
 */
const defaultConfig: PomodoroConfig = {
  workSeconds: 25 * 60, // 25分
  shortBreakSeconds: 5 * 60, // 5分
  longBreakSeconds: 15 * 60, // 15分
  roundsUntilLongBreak: 4, // 4回作業したら長休憩
};

/**
 * デフォルトのアプリ設定
 */
const defaultSettings: PomodoroSettings = {
  phaseLabels: {
    work: "作業",
    shortBreak: "短休憩",
    longBreak: "長休憩",
  },
  useCustomConfig: false, // デフォルトは基本モード
  customConfig: defaultConfig, // カスタム設定（初期値はデフォルトと同じ）
};

/**
 * コンテキストの値の型定義
 */
type PomodoroSettingsContextValue = {
  config: PomodoroConfig; // 現在使用中のタイマー設定
  settings: PomodoroSettings; // アプリ全体の設定
  isLoading: boolean; // 設定の読み込み中かどうか
  defaultConfig: PomodoroConfig; // デフォルト設定（基本モード）
  saveConfig: (newConfig: PomodoroConfig) => Promise<void>; // タイマー設定を保存
  saveSettings: (nextSettings: Partial<PomodoroSettings>) => Promise<void>; // アプリ設定を保存
  toggleCustomMode: (useCustom: boolean) => Promise<void>; // カスタムモードの切り替え
  updatePhaseLabel: (
    phase: "work" | "shortBreak" | "longBreak",
    label: string
  ) => Promise<void>; // フェーズラベルの更新
  getPhaseLabel: (phase: "work" | "shortBreak" | "longBreak") => string; // フェーズラベルの取得
};

/**
 * ポモドーロ設定のコンテキスト
 */
const PomodoroSettingsContext =
  createContext<PomodoroSettingsContextValue | null>(null);

type ProviderProps = {
  children: ReactNode;
};

/**
 * ポモドーロ設定を提供するプロバイダーコンポーネント
 *
 * AsyncStorageから設定を読み込み、アプリ全体で設定を共有します。
 */
export const PomodoroSettingsProvider = ({ children }: ProviderProps) => {
  // 状態管理
  const [config, setConfig] = useState<PomodoroConfig>(defaultConfig); // 現在のタイマー設定
  const [settings, setSettings] = useState<PomodoroSettings>(defaultSettings); // アプリ設定
  const [isLoading, setIsLoading] = useState(true); // 読み込み状態

  /**
   * アプリ起動時にAsyncStorageから設定を読み込む
   * 保存された設定があればそれを、なければデフォルト設定を使用します
   */
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);

        // AsyncStorageから設定を並列で読み込む
        const [configJson, settingsJson] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.CONFIG),
          AsyncStorage.getItem(STORAGE_KEYS.SETTING),
        ]);

        // タイマー設定を読み込む
        let loadedConfig = config;
        if (configJson) {
          loadedConfig = JSON.parse(configJson) as PomodoroConfig;
          setConfig(loadedConfig);
        }

        // アプリ設定を読み込む
        if (settingsJson) {
          const loadedSettings = JSON.parse(
            settingsJson
          ) as Partial<PomodoroSettings>;

          // デフォルト設定と読み込んだ設定をマージ
          const mergedSettings = {
            ...defaultSettings,
            ...loadedSettings,
            customConfig: {
              ...defaultSettings.customConfig,
              ...loadedSettings?.customConfig,
            },
          };
          setSettings(mergedSettings);

          // カスタムモードが有効な場合はカスタム設定を、無効な場合はデフォルト設定を使用
          if (mergedSettings.useCustomConfig) {
            setConfig(mergedSettings.customConfig);
          } else {
            setConfig(defaultConfig);
          }
        }
      } catch (error) {
        console.error("設定の読み込みに失敗しました:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  /**
   * タイマー設定を保存する関数
   * AsyncStorageに保存し、状態も更新します
   */
  const saveConfig = useCallback(async (newConfig: PomodoroConfig) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.CONFIG,
        JSON.stringify(newConfig)
      );
      setConfig(newConfig);
    } catch (error) {
      console.error("設定の保存に失敗しました:", error);
      throw error;
    }
  }, []);

  /**
   * アプリ設定を保存する関数
   * 既存の設定とマージして保存します
   */
  const saveSettings = useCallback(
    async (nextSettings: Partial<PomodoroSettings>) => {
      // 既存の設定と新しい設定をマージ
      const mergedSettings: PomodoroSettings = {
        ...settings,
        ...nextSettings,
        customConfig: {
          ...settings.customConfig,
          ...nextSettings.customConfig,
        },
      };
      try {
        await AsyncStorage.setItem(
          STORAGE_KEYS.SETTING,
          JSON.stringify(mergedSettings)
        );
        setSettings(mergedSettings);
      } catch (error) {
        console.error("設定の保存に失敗しました:", error);
        throw error;
      }
    },
    [settings]
  );

  /**
   * フェーズ（作業/短休憩/長休憩）の表示名を更新する関数
   */
  const updatePhaseLabel = useCallback(
    async (phase: "work" | "shortBreak" | "longBreak", label: string) => {
      const newSettings: PomodoroSettings = {
        ...settings,
        phaseLabels: {
          ...settings.phaseLabels,
          [phase]: label,
        },
      };
      await saveSettings(newSettings);
    },
    [settings, saveSettings]
  );

  /**
   * カスタムモードの切り替えを行う関数
   *
   * @param useCustom - true: カスタムモードを有効化、false: 基本モードに戻す
   */
  const toggleCustomMode = useCallback(
    async (useCustom: boolean) => {
      if (useCustom) {
        // カスタムモードを有効化：カスタム設定を適用
        await saveConfig(settings.customConfig);
        await saveSettings({ useCustomConfig: true });
      } else {
        // 基本モードに戻す：デフォルト設定を適用
        await saveConfig(defaultConfig);
        await saveSettings({ useCustomConfig: false });
      }
    },
    [settings.customConfig, saveConfig, saveSettings]
  );

  /**
   * 指定されたフェーズの表示名を取得する関数
   */
  const getPhaseLabel = useCallback(
    (phase: "work" | "shortBreak" | "longBreak"): string => {
      return settings.phaseLabels[phase];
    },
    [settings]
  );

  const value = {
    config,
    settings,
    isLoading,
    defaultConfig,
    saveConfig,
    saveSettings,
    toggleCustomMode,
    updatePhaseLabel,
    getPhaseLabel,
  };

  return (
    <PomodoroSettingsContext.Provider value={value}>
      {children}
    </PomodoroSettingsContext.Provider>
  );
};

/**
 * ポモドーロ設定コンテキストを使用するカスタムフック
 *
 * @returns ポモドーロ設定の値と操作関数
 * @throws PomodoroSettingsProviderの外で使用された場合にエラーをスロー
 */
export const usePomodoroSettings = () => {
  const context = useContext(PomodoroSettingsContext);
  if (!context) {
    throw new Error(
      "usePomodoroSettings must be used within PomodoroSettingsProvider"
    );
  }
  return context;
};
