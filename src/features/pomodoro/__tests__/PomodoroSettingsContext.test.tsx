import React from "react";
import { create } from "react-test-renderer";
import { act } from "react";
import {
  PomodoroSettingsProvider,
  usePomodoroSettings,
} from "../contexts/PomodoroSettingsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PomodoroConfig, PomodoroSettings } from "../types/pomodoro";

// AsyncStorageをモック
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe("PomodoroSettingsContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  // テスト用のヘルパー関数
  const TestComponent = ({
    onRender,
  }: {
    onRender: (context: ReturnType<typeof usePomodoroSettings>) => void;
  }) => {
    const context = usePomodoroSettings();
    React.useEffect(() => {
      onRender(context);
    }, [context]);
    return null;
  };

  const renderWithProvider = (
    onRender: (context: ReturnType<typeof usePomodoroSettings>) => void
  ) => {
    let renderer: ReturnType<typeof create>;
    act(() => {
      renderer = create(
        React.createElement(PomodoroSettingsProvider, {
          children: React.createElement(TestComponent, { onRender }),
        }) as any
      );
    });
    return renderer!;
  };

  describe("初期状態", () => {
    it("AsyncStorageが空の場合、デフォルト設定が使用される", async () => {
      let contextValue: ReturnType<typeof usePomodoroSettings> | null = null;

      const renderer = renderWithProvider((context) => {
        contextValue = context;
      });

      // 非同期読み込みを待つ
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      expect(contextValue).not.toBeNull();
      expect(contextValue!.isLoading).toBe(false);
      expect(contextValue!.config.workSeconds).toBe(25 * 60);
      expect(contextValue!.config.shortBreakSeconds).toBe(5 * 60);
      expect(contextValue!.config.longBreakSeconds).toBe(15 * 60);
      expect(contextValue!.config.roundsUntilLongBreak).toBe(4);
      expect(contextValue!.settings.phaseLabels.work).toBe("作業");
      expect(contextValue!.settings.phaseLabels.shortBreak).toBe("短休憩");
      expect(contextValue!.settings.phaseLabels.longBreak).toBe("長休憩");
      expect(contextValue!.settings.useCustomConfig).toBe(false);

      act(() => {
        renderer.unmount();
      });
    });

    it("AsyncStorageに設定がある場合、その設定が読み込まれる", async () => {
      const savedConfig: PomodoroConfig = {
        workSeconds: 30 * 60,
        shortBreakSeconds: 10 * 60,
        longBreakSeconds: 20 * 60,
        roundsUntilLongBreak: 3,
      };

      const savedSettings: PomodoroSettings = {
        phaseLabels: {
          work: "集中",
          shortBreak: "小休憩",
          longBreak: "大休憩",
        },
        useCustomConfig: true,
        customConfig: savedConfig,
      };

      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === "@Pomodoro:config") {
          return Promise.resolve(JSON.stringify(savedConfig));
        }
        if (key === "@pomodoro:settings") {
          return Promise.resolve(JSON.stringify(savedSettings));
        }
        return Promise.resolve(null);
      });

      let contextValue: ReturnType<typeof usePomodoroSettings> | null = null;

      const renderer = renderWithProvider((context) => {
        contextValue = context;
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      expect(contextValue).not.toBeNull();
      expect(contextValue!.isLoading).toBe(false);
      expect(contextValue!.config.workSeconds).toBe(30 * 60);
      expect(contextValue!.config.shortBreakSeconds).toBe(10 * 60);
      expect(contextValue!.settings.phaseLabels.work).toBe("集中");
      expect(contextValue!.settings.useCustomConfig).toBe(true);

      act(() => {
        renderer.unmount();
      });
    });
  });

  describe("saveConfig", () => {
    it("設定を保存できる", async () => {
      let contextValue: ReturnType<typeof usePomodoroSettings> | null = null;

      const renderer = renderWithProvider((context) => {
        contextValue = context;
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      const newConfig: PomodoroConfig = {
        workSeconds: 20 * 60,
        shortBreakSeconds: 5 * 60,
        longBreakSeconds: 15 * 60,
        roundsUntilLongBreak: 4,
      };

      await act(async () => {
        await contextValue!.saveConfig(newConfig);
      });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@Pomodoro:config",
        JSON.stringify(newConfig)
      );
      expect(contextValue!.config.workSeconds).toBe(20 * 60);

      act(() => {
        renderer.unmount();
      });
    });

    it("保存に失敗した場合、エラーがスローされる", async () => {
      let contextValue: ReturnType<typeof usePomodoroSettings> | null = null;

      const renderer = renderWithProvider((context) => {
        contextValue = context;
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error("Storage error")
      );

      const newConfig: PomodoroConfig = {
        workSeconds: 20 * 60,
        shortBreakSeconds: 5 * 60,
        longBreakSeconds: 15 * 60,
        roundsUntilLongBreak: 4,
      };

      await expect(
        act(async () => {
          await contextValue!.saveConfig(newConfig);
        })
      ).rejects.toThrow("Storage error");

      act(() => {
        renderer.unmount();
      });
    });
  });

  describe("saveSettings", () => {
    it("設定を保存できる", async () => {
      let contextValue: ReturnType<typeof usePomodoroSettings> | null = null;

      const renderer = renderWithProvider((context) => {
        contextValue = context;
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      const partialSettings: Partial<PomodoroSettings> = {
        phaseLabels: {
          work: "集中",
          shortBreak: "小休憩",
          longBreak: "大休憩",
        },
      };

      await act(async () => {
        await contextValue!.saveSettings(partialSettings);
      });

      expect(AsyncStorage.setItem).toHaveBeenCalled();
      expect(contextValue!.settings.phaseLabels.work).toBe("集中");
      expect(contextValue!.settings.phaseLabels.shortBreak).toBe("小休憩");
      expect(contextValue!.settings.phaseLabels.longBreak).toBe("大休憩");

      act(() => {
        renderer.unmount();
      });
    });

    it("カスタム設定を保存できる", async () => {
      let contextValue: ReturnType<typeof usePomodoroSettings> | null = null;

      const renderer = renderWithProvider((context) => {
        contextValue = context;
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      const customConfig: PomodoroConfig = {
        workSeconds: 30 * 60,
        shortBreakSeconds: 10 * 60,
        longBreakSeconds: 20 * 60,
        roundsUntilLongBreak: 3,
      };

      await act(async () => {
        await contextValue!.saveSettings({
          customConfig,
        });
      });

      expect(contextValue!.settings.customConfig.workSeconds).toBe(30 * 60);
      expect(contextValue!.settings.customConfig.roundsUntilLongBreak).toBe(3);

      act(() => {
        renderer.unmount();
      });
    });
  });

  describe("toggleCustomMode", () => {
    it("カスタムモードをONにできる", async () => {
      let contextValue: ReturnType<typeof usePomodoroSettings> | null = null;

      const renderer = renderWithProvider((context) => {
        contextValue = context;
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // カスタム設定を先に設定
      const customConfig: PomodoroConfig = {
        workSeconds: 30 * 60,
        shortBreakSeconds: 10 * 60,
        longBreakSeconds: 20 * 60,
        roundsUntilLongBreak: 3,
      };

      await act(async () => {
        await contextValue!.saveSettings({ customConfig });
      });

      await act(async () => {
        await contextValue!.toggleCustomMode(true);
      });

      expect(contextValue!.settings.useCustomConfig).toBe(true);
      expect(contextValue!.config.workSeconds).toBe(30 * 60);

      act(() => {
        renderer.unmount();
      });
    });

    it("カスタムモードをOFFにできる", async () => {
      let contextValue: ReturnType<typeof usePomodoroSettings> | null = null;

      const renderer = renderWithProvider((context) => {
        contextValue = context;
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // カスタムモードをONにする
      const customConfig: PomodoroConfig = {
        workSeconds: 30 * 60,
        shortBreakSeconds: 10 * 60,
        longBreakSeconds: 20 * 60,
        roundsUntilLongBreak: 3,
      };

      await act(async () => {
        await contextValue!.saveSettings({ customConfig });
        await contextValue!.toggleCustomMode(true);
      });

      // カスタムモードをOFFにする
      await act(async () => {
        await contextValue!.toggleCustomMode(false);
      });

      expect(contextValue!.settings.useCustomConfig).toBe(false);
      expect(contextValue!.config.workSeconds).toBe(25 * 60); // デフォルトに戻る

      act(() => {
        renderer.unmount();
      });
    });
  });

  describe("updatePhaseLabel", () => {
    it("フェーズラベルを更新できる", async () => {
      let contextValue: ReturnType<typeof usePomodoroSettings> | null = null;

      const renderer = renderWithProvider((context) => {
        contextValue = context;
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      await act(async () => {
        await contextValue!.updatePhaseLabel("work", "集中タイム");
      });

      expect(contextValue!.settings.phaseLabels.work).toBe("集中タイム");
      expect(contextValue!.settings.phaseLabels.shortBreak).toBe("短休憩"); // 他のラベルは変更されない

      act(() => {
        renderer.unmount();
      });
    });
  });

  describe("getPhaseLabel", () => {
    it("現在のフェーズラベルを取得できる", async () => {
      let contextValue: ReturnType<typeof usePomodoroSettings> | null = null;

      const renderer = renderWithProvider((context) => {
        contextValue = context;
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      expect(contextValue!.getPhaseLabel("work")).toBe("作業");
      expect(contextValue!.getPhaseLabel("shortBreak")).toBe("短休憩");
      expect(contextValue!.getPhaseLabel("longBreak")).toBe("長休憩");

      // ラベルを変更後も正しく取得できる
      await act(async () => {
        await contextValue!.updatePhaseLabel("work", "集中");
      });

      expect(contextValue!.getPhaseLabel("work")).toBe("集中");

      act(() => {
        renderer.unmount();
      });
    });
  });

  describe("usePomodoroSettings", () => {
    it("Provider外で呼び出すとエラーがスローされる", () => {
      // Provider外で直接呼び出す
      const TestComponent = () => {
        try {
          usePomodoroSettings();
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toContain(
            "usePomodoroSettings must be used within PomodoroSettingsProvider"
          );
        }
        return null;
      };

      act(() => {
        create(React.createElement(TestComponent) as any);
      });
    });
  });
});
