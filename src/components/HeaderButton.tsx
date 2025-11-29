/**
 * ヘッダー用のアイコンボタンコンポーネント
 *
 * ナビゲーションヘッダーの右側などに表示するアイコンボタン用。
 * 設定ボタンなど、ヘッダーに配置されるアクションボタンに使用。
 */
import React from "react";
import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";
import { headerButton } from "../theme/colors";

type Props = {
  /** 表示するアイコン（テキスト） */
  icon: string;
  /** ボタンが押された時のコールバック */
  onPress: () => void;
  /** 追加のスタイル（オプション） */
  style?: TouchableOpacityProps["style"];
};

export const HeaderButton: React.FC<Props> = ({ icon, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[headerButton.container, style]}
      activeOpacity={headerButton.activeOpacity}
      onPress={onPress}
    >
      <Text style={headerButton.icon}>{icon}</Text>
    </TouchableOpacity>
  );
};
