# アプリ構造

## ルート構成
```text
src/
  screens/
    PomodoroScreen.tsx
    SettingsScreen.tsx
  features/
    pomodoro/
      hooks/
      components/
      types/
      utils/
  components/
  constants/
  types/
  utils/
```

## 役割定義

- screens/
  - 画面単位の UI コンテナ

- features/pomodoro/
  - ポモドーロ機能に特化したロジック・UI・型・ユーティリティ

- components/
  - 再利用可能な共通コンポーネント（ボタンなど）

- constants/
  - カラーテーマ、固定値

- types/
  - アプリ全体で共有する型

- utils/
  - 共通のユーティリティ関数
