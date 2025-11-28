# アプリ構造

## ルート構成
```text
src/
  screens/
    SettingScreen.tsx
  features/
    pomodoro/
      __tests__/
        PomodoroSettingsContext.test.tsx
        usePomodoroTimer.test.ts
      contexts/
        PomodoroSettingsContext.tsx
      hooks/
        usePomodoroTimer.ts
      screens/
        PomodoroScreen.tsx
      types/
        pomodoro.ts
  components/
    TimerControls.tsx
    TimerDisplay.tsx
  utils/
    __tests__/
      time.test.ts
    time.ts
```

## 役割定義

- `screens/`
  - アプリケーションの画面単位のルートコンポーネント
  - `SettingScreen.tsx`: 設定画面

- `features/pomodoro/`
  - ポモドーロ機能に特化した実装を全て含む
  - `contexts/`: 設定管理のコンテキスト（AsyncStorage連携）
  - `hooks/`: タイマーロジックのカスタムフック
  - `screens/`: ポモドーロタイマーのメイン画面
  - `types/`: ポモドーロ関連の型定義
  - `__tests__/`: テストコード

- `components/`
  - 再利用可能なUI部品
  - `TimerDisplay.tsx`: タイマー表示コンポーネント
  - `TimerControls.tsx`: タイマー制御ボタンコンポーネント

- `utils/`
  - 汎用的なヘルパー関数
  - `time.ts`: 時間フォーマット関数
  - `__tests__/`: テストコード
