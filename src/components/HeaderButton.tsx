/**
 * ヘッダー用のアイコンボタンコンポーネント
 * ナビゲーションヘッダーに表示するアイコンボタン（設定ボタンなど）
 */
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { getHeaderButton } from "../theme/colors";

type Props = {
  /** 表示するアイコン（テキスト） */
  icon: string;
  /** ボタンが押された時のコールバック */
  onPress: () => void;
  /** 追加のスタイル（オプション） */
  style?: TouchableOpacityProps["style"];
};

export const HeaderButton: React.FC<Props> = ({ icon, onPress, style }) => {
  const { theme } = useTheme();
  const headerButton = getHeaderButton(theme);

  return (
    <TouchableOpacity
      style={[headerButton.container, style]}
      activeOpacity={headerButton.activeOpacity}
      onPress={onPress}
    >
      <Text style={[headerButton.icon, styles.iconText]}>{icon}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconText: {
    paddingBottom: 10,
    paddingLeft: 15,
  },
});
