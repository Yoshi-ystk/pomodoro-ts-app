/**
 * アプリケーションのルートコンポーネント
 *
 * 以下の構成でアプリを初期化：
 * - PomodoroSettingsProvider: ポモドーロ設定を管理するコンテキストプロバイダー
 * - NavigationContainer: React Navigationのナビゲーションコンテナ
 * - Stack.Navigator: スタックナビゲーション（ポモドーロ画面と設定画面）
 */
import React from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { PomodoroSettingsProvider } from "./src/features/pomodoro/contexts/PomodoroSettingsContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PomodoroScreen } from "./src/features/pomodoro/screens/PomodoroScreen";
import { SettingScreen } from "./src/screens/SettingScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Orbitron-Regular": require("./assets/fonts/Orbitron-Regular.ttf"),
    "Orbitron-Bold": require("./assets/fonts/Orbitron-Bold.ttf"),
    "Orbitron-Medium": require("./assets/fonts/Orbitron-Medium.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // フォントが読み込まれるまでは何も表示しない
  }

  return (
    <PomodoroSettingsProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {/* メイン画面：ポモドーロタイマー */}
          <Stack.Screen
            name="FOCUSTEP"
            component={PomodoroScreen}
            options={{ title: "FOCUSTEP" }}
          />
          {/* 設定画面 */}
          <Stack.Screen
            name="Settings"
            component={SettingScreen}
            options={{ title: "設定" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PomodoroSettingsProvider>
  );
}
