import React from "react";
import { Text, StyleSheet } from "react-native";

type Props = { time: string };

export const TimerDisplay: React.FC<Props> = ({ time }) => {
  return <Text style={styles.time}></Text>;
};

const styles = StyleSheet.create({
  time: { fontSize: 64, fontWeight: "bold", marginBottom: 40 },
});
