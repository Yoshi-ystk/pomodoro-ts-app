import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PomodoroConfig, PomodoroSettings } from "../types/pomodoro";

// AsyncStorageのキー
const STORAGE_KEYS = {
  CONFIG: "@Pomodoro:config",
  SETTING: "@pomodoro:settings",
} as const;

// デフォルト設定

const defaultConfig: PomodoroConfig = {
  workSeconds: 25 * 60,
  shortBreakSeconds: 5 * 60,
  longBreakSeconds: 15 * 60,
  roundsUntilLongBreak: 4,
};

const defaultSettings: PomodoroSettings = {
  phaseLabels: {
    work: "作業",
    shortBreak: "短休憩",
    longBreak: "長休憩",
  },
  useCustomConfig: false,
  customConfig: defaultConfig,
};

export const usePomodoroSettings = () => {
  const [config, setConfig] = useState<PomodoroConfig>(defaultConfig);
  const [settings, setSettings] = useState<PomodoroSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // 初期読み込み
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);

        // 設定を読み込む
        const [configJson, settingsJson] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.CONFIG),
          AsyncStorage.getItem(STORAGE_KEYS.SETTING),
        ]);

        if (configJson) {
          const loadedConfig = JSON.parse(configJson) as PomodoroConfig;
          setConfig(loadedConfig);
        }

        if (settingsJson) {
          const loadedSettings = JSON.parse(
            settingsJson
          ) as Partial<PomodoroSettings>;
          setSettings({
            ...defaultSettings,
            ...loadedSettings,
            customConfig: {
              ...defaultSettings.customConfig,
              ...loadedSettings?.customConfig,
            },
          });
        }
      } catch (error) {
        console.error("設定の読み込みに失敗しました:", error);
        // エラー時はデフォルト値を使用
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // 設定を保存する関数
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

  const saveSettings = useCallback(
    async (nextSettings: Partial<PomodoroSettings>) => {
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

  // phase表示名を更新する関数
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

  // カスタムモード切替ヘルパー
  const toggleCustomMode = useCallback(
    async (useCustom: boolean) => {
      if (useCustom) {
        await saveConfig(settings.customConfig);
        await saveSettings({ useCustomConfig: true });
      }
    },
    [settings.customConfig, saveConfig, saveSettings]
  );

  // 現在のphaseの表示名を取得する関数
  const getPhaseLabel = useCallback(
    (phase: "work" | "shortBreak" | "longBreak"): string => {
      return settings.phaseLabels[phase];
    },
    [settings]
  );

  return {
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
};
