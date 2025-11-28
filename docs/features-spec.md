# タイマー挙動仕様

## フェーズ
`phase:`
- `"work"`（作業）
- `"shortBreak"`（短休憩）
- `"longBreak"`（長休憩）

## フェーズ遷移
- `work` → `shortBreak`（周回数が`roundsUntilLongBreak`の倍数でない場合）
- `work` → `longBreak`（周回数が`roundsUntilLongBreak`の倍数の場合）
- `shortBreak` → `work`（周回数をインクリメント）
- `longBreak` → `work`（周回数をインクリメント）

## 状態
```typescript
{
  seconds: number,        // 残り秒数
  phase: PomodoroPhase,   // 現在のフェーズ
  round: number,          // 現在の周回数（1から開始）
  isRunning: boolean     // タイマーが実行中かどうか
}
```

## 開始
- `isRunning` を `true` にすると 1秒ごとに `seconds` が減少

## 0秒になったとき
- タイマーを自動停止（`isRunning = false`）
- フェーズに応じて `seconds` を次の値にセット
- 次の `phase` を決定
- 休憩から作業に戻る場合、`round` をインクリメント

## リセット
- `seconds` = `config.workSeconds`
- `phase` = `"work"`
- `round` = `1`
- `isRunning` = `false`

## 設定変更時
- 設定（`config`）が変更されたら、タイマーを自動リセット

## 例:
- `round = 1` の `work` が終わる → `shortBreak`（`roundsUntilLongBreak = 4`の場合）
- `round = 4` の `work` が終わる → `longBreak`（`roundsUntilLongBreak = 4`の場合）
- `shortBreak` が終わる → `work`（`round = 2`に更新）
