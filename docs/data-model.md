# データモデル

## PomodoroPhase
```typescript
"work" | "shortBreak" | "longBreak"
```

## PomodoroConfig
タイマーの設定（時間とセット回数）
```typescript
{
  workSeconds: number;              // 作業時間（秒）
  shortBreakSeconds: number;        // 短休憩時間（秒）
  longBreakSeconds: number;         // 長休憩時間（秒）
  roundsUntilLongBreak: number;     // 長休憩までの作業回数
}
```

## PomodoroState
タイマーの現在の状態
```typescript
{
  seconds: number;        // 残り秒数
  phase: PomodoroPhase;  // 現在のフェーズ
  round: number;         // 現在の周回数
  isRunning: boolean;   // タイマーが実行中かどうか
}
```

## PomodoroSettings
アプリ全体の設定
```typescript
{
  phaseLabels: {
    work: string;        // 作業フェーズの表示名
    shortBreak: string;  // 短休憩フェーズの表示名
    longBreak: string;   // 長休憩フェーズの表示名
  };
  useCustomConfig: boolean;  // カスタムモードが有効かどうか
  customConfig: PomodoroConfig;  // カスタム設定
}
```

## デフォルト設定
```typescript
{
  workSeconds: 25 * 60,           // 25分
  shortBreakSeconds: 5 * 60,      // 5分
  longBreakSeconds: 15 * 60,      // 15分
  roundsUntilLongBreak: 4         // 4回
}
```
