/**
 * テーマ管理コンテキスト
 * ダークモードとライトモードの切り替えを管理し、AsyncStorageに永続化
 */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Theme } from "./colors";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => Promise<void>;
  setTheme: (theme: Theme) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "@Focustep:theme";

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>("dark");

  // アプリ起動時に保存されたテーマを読み込み
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedTheme === "light" || savedTheme === "dark") {
          setThemeState(savedTheme);
        }
      } catch (error) {
        console.error("テーマの読み込みに失敗しました:", error);
      }
    };
    loadTheme();
  }, []);

  // テーマを設定してAsyncStorageに保存
  const setTheme = useCallback(async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error("テーマの保存に失敗しました:", error);
      throw error;
    }
  }, []);

  // テーマを切り替え（dark ↔ light）
  const toggleTheme = useCallback(async () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    await setTheme(newTheme);
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// テーマコンテキストを使用するフック
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
