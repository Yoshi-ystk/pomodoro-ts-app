# タイマー挙動仕様

## フェーズ
`phase:`
- `focus`（作業）
- `short_break`（短休憩）
- `long_break`（長休憩）

## フェーズ遷移
`focus` → `short_break`（1〜3回目の作業後）
`focus` → `long_break`（4回目の作業後）
`short_break` → `focus`
`long_break` → `focus`（セット完了後、カウントリセット）

## 状態
```typescript
state = {
  seconds: number,
  phase: PomodoroPhase,
  round: number,     // focus の回数
  isRunning: boolean
}
```

## 開始
- `isRunning` を `true` にすると 1秒ごとに減少

## 0秒になったとき
- フェーズに応じて `seconds` を次の値にセット
- 次の `phase` を決定
- `round` を更新

## リセット
- `seconds` = `focusMinutes` * 60
- `phase` = `"focus"`
- `round` = `0`
- `isRunning` = `false`

## 例:
`round` = 3 の `focus` が終わる → next = `short_break`
`round` = 4 の `focus` が終わる → next = `long_break`
