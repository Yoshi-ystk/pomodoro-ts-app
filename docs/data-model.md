# データモデル

## PomodoroPhase
`"focus"` | `"short_break"` | `"long_break"`

## PomodoroState
```typescript
{
  seconds: number;
  phase: PomodoroPhase;
  round: number;
  isRunning: boolean;
}
```
## Settings
```typescript
{
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  roundsPerSet: number;
}
```
