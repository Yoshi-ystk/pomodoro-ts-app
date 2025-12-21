/**
 * アプリケーションのルートコンポーネント
 * フォント読み込み、テーマ管理、ナビゲーションの初期化を行う
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
import { HeaderButton } from "./src/components/HeaderButton";
import { ThemeProvider, useTheme } from "./src/theme/ThemeContext";
import { getThemeColors } from "./src/theme/colors";

const Stack = createNativeStackNavigator();

// テーマ対応のナビゲーションコンテナ
// ヘッダーのスタイルをテーマに応じて動的に変更
const ThemedNavigationContainer = () => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background.dark,
          },
          headerTintColor: colors.text.accent,
          headerTitleStyle: {
            fontFamily: "Orbitron-Bold",
            fontSize: 18,
            color: colors.text.accent,
          },
          headerShadowVisible: false,
        }}
      >
        {/* メイン画面：ポモドーロタイマー */}
        <Stack.Screen
          name="FOCUSTEP"
          component={PomodoroScreen}
          options={({ navigation }) => ({
            title: "FOCUSTEP",
            headerRight: () => (
              <HeaderButton
                icon="≡"
                onPress={() => navigation.navigate("Settings")}
              />
            ),
          })}
        />
        {/* 設定画面 */}
        <Stack.Screen
          name="Settings"
          component={SettingScreen}
          options={{ title: "設定" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  // カスタムフォント（Orbitron）の読み込み
  const [fontsLoaded] = useFonts({
    "Orbitron-Regular": require("./assets/fonts/Orbitron-Regular.ttf"),
    "Orbitron-Bold": require("./assets/fonts/Orbitron-Bold.ttf"),
    "Orbitron-Medium": require("./assets/fonts/Orbitron-Medium.ttf"),
  });

  // フォント読み込み完了時にスプラッシュスクリーンを非表示
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // フォント読み込み中は何も表示しない
  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <PomodoroSettingsProvider>
        <ThemedNavigationContainer />
      </PomodoroSettingsProvider>
    </ThemeProvider>
  );
}
