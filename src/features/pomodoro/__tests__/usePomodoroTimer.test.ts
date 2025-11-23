import { create } from "react-test-renderer";
import { act } from "react";
import { usePomodoroTimer } from "../hooks/usePomodoroTimer";
import { PomodoroConfig } from "../types/pomodoro";
import React from "react";

// renderHookヘルパー関数
function renderHook<T>(hook: () => T) {
  let result: T | undefined;
  const TestComponent = () => {
    result = hook();
    return null;
  };
  let renderer: ReturnType<typeof create>;
  act(() => {
    renderer = create(React.createElement(TestComponent) as any);
  });
  // フックが実行されるまで待機
  if (result === undefined) {
    throw new Error("Hook result is undefined after render");
  }
  return {
    result: {
      get current() {
        if (result === undefined) {
          throw new Error("Hook result is undefined");
        }
        return result;
      },
    },
    rerender: () => {
      act(() => {
        renderer!.update(React.createElement(TestComponent) as any);
      });
    },
    unmount: () => {
      act(() => {
        renderer!.unmount();
      });
    },
  };
}

describe("usePomodoroTimer", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("自動遷移と周回数の更新", () => {
    it("25分の作業と5分の休憩が終わった後、自動的に次の作業25分のカウントダウンが開始される", () => {
      // テスト用に短い時間を設定（作業10秒、休憩5秒）
      const testConfig: PomodoroConfig = {
        workSeconds: 10,
        shortBreakSeconds: 5,
        longBreakSeconds: 15,
        roundsUntilLongBreak: 4,
      };

      const { result } = renderHook(() => usePomodoroTimer(testConfig));

      // 初期状態の確認
      expect(result.current.phase).toBe("work");
      expect(result.current.round).toBe(1);
      expect(result.current.seconds).toBe(10);
      expect(result.current.isRunning).toBe(false);

      // タイマーを開始
      act(() => {
        result.current.toggle();
      });
      expect(result.current.isRunning).toBe(true);

      // 作業時間（10秒）を進める
      act(() => {
        jest.advanceTimersByTime(10000);
      });

      // 作業が終了し、短休憩に自動遷移していることを確認
      expect(result.current.phase).toBe("shortBreak");
      expect(result.current.seconds).toBe(5);
      expect(result.current.round).toBe(1); // まだ周回数は変わらない
      expect(result.current.isRunning).toBe(false); // 自動的に停止する

      // 休憩時間を開始
      act(() => {
        result.current.toggle();
      });
      expect(result.current.isRunning).toBe(true);

      // 休憩時間（5秒）を進める
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // 休憩が終了し、次の作業に自動遷移していることを確認
      expect(result.current.phase).toBe("work");
      expect(result.current.seconds).toBe(10); // 作業時間に戻る
      expect(result.current.isRunning).toBe(false); // 自動的に停止する
    });

    it("25分の作業と5分の休憩が終わった後、自動的に次の作業25分のカウントダウンが開始される際、「１周目」の表示が「２周目」に変更される", () => {
      // テスト用に短い時間を設定（作業10秒、休憩5秒）
      const testConfig: PomodoroConfig = {
        workSeconds: 10,
        shortBreakSeconds: 5,
        longBreakSeconds: 15,
        roundsUntilLongBreak: 4,
      };

      const { result } = renderHook(() => usePomodoroTimer(testConfig));

      // 初期状態の確認（1周目）
      expect(result.current.round).toBe(1);

      // 1周目の作業を開始して完了
      act(() => {
        result.current.toggle();
      });
      act(() => {
        jest.advanceTimersByTime(10000);
      });

      // 休憩に遷移（まだ1周目）
      expect(result.current.round).toBe(1);
      expect(result.current.phase).toBe("shortBreak");

      // 休憩を開始して完了
      act(() => {
        result.current.toggle();
      });
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // 次の作業に自動遷移し、周回数が2に増加していることを確認
      expect(result.current.phase).toBe("work");
      expect(result.current.round).toBe(2); // 1周目から2周目に変更
      expect(result.current.seconds).toBe(10);
    });

    it("複数周回の自動遷移が正常に動作する", () => {
      // テスト用に短い時間を設定
      const testConfig: PomodoroConfig = {
        workSeconds: 10,
        shortBreakSeconds: 5,
        longBreakSeconds: 15,
        roundsUntilLongBreak: 4,
      };

      const { result } = renderHook(() => usePomodoroTimer(testConfig));

      // 1周目: 作業 → 休憩 → 作業（2周目）
      act(() => {
        result.current.toggle();
      });
      act(() => {
        jest.advanceTimersByTime(10000);
      });
      expect(result.current.round).toBe(1);
      expect(result.current.phase).toBe("shortBreak");

      act(() => {
        result.current.toggle();
      });
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      expect(result.current.round).toBe(2);
      expect(result.current.phase).toBe("work");

      // 2周目: 作業 → 休憩 → 作業（3周目）
      act(() => {
        result.current.toggle();
      });
      act(() => {
        jest.advanceTimersByTime(10000);
      });
      expect(result.current.round).toBe(2);
      expect(result.current.phase).toBe("shortBreak");

      act(() => {
        result.current.toggle();
      });
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      expect(result.current.round).toBe(3);
      expect(result.current.phase).toBe("work");
    });
  });
});
