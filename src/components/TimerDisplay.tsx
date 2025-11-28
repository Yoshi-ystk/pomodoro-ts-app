/**
 * タイマーの残り時間を表示するコンポーネント
 */
import React from "react";
import { Text, StyleSheet } from "react-native";

type Props = {
  /** 表示する時間（mm:ss形式の文字列） */
  time: string;
};

export const TimerDisplay: React.FC<Props> = ({ time }) => {
  return (
    <Text
      style={styles.time}
      numberOfLines={1}
      adjustsFontSizeToFit={true}
      minimumFontScale={0.75} // 45 / 60 = 0.75
    >
      {time}
    </Text>
  );
};

const styles = StyleSheet.create({
  time: {
    fontSize: 60,
    fontFamily: "Orbitron-Regular",
    marginBottom: 40,
    width: "100%",
    textAlign: "center",
  },
});
