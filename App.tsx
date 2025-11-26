import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { PomodoroSettingsProvider } from "./src/features/pomodoro/contexts/PomodoroSettingsContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PomodoroScreen } from "./src/features/pomodoro/screens/PomodoroScreen";
import { SettingScreen } from "./src/screens/SettingScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PomodoroSettingsProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="FOCUSTEP"
            component={PomodoroScreen}
            options={{ title: "FOCUSTEP" }}
          />
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
