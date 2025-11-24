import React, { createContext, useContext, ReactNode } from "react";
import { usePomodoroSettings } from "../hooks/usePomodoroSettings";
import type { PomodoroConfig, PomodoroSettings } from "../types/pomodoro";

type PomodoroSettingsContextValue = {
  config: PomodoroConfig;
  settings: PomodoroSettings;
  isLoading: boolean;
  saveConfig: ReturnType<typeof usePomodoroSettings>["saveConfig"];
  saveSettings: ReturnType<typeof usePomodoroSettings>["saveSettings"];
  updatePhaseLabel: ReturnType<typeof usePomodoroSettings>["updatePhaseLabel"];
  getPhaseLabel: ReturnType<typeof usePomodoroSettings>["getPhaseLabel"];
};

const PomodoroSettingsContext =
  createContext<PomodoroSettingsContextValue | null>(null);

type ProviderProps = {
  children: ReactNode;
};

export const PomodoroSettingsProvider = ({ children }: ProviderProps) => {
  const value = usePomodoroSettings();

  return (
    <PomodoroSettingsContext.Provider value={value}>
      {children}
    </PomodoroSettingsContext.Provider>
  );
};

export const usePomodoroSettingsContext = () => {
  const context = useContext(PomodoroSettingsContext);
  if (!context) {
    throw new Error(
      "usePomodoroSettingsContext must be used within PomodoroSettingsProvider"
    );
  }
  return context;
};
