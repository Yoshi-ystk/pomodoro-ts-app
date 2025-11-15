import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function App() {
  // 残り時間(秒)
  const [seconds, setSeconds] = useState(25 * 60);
  // タイマーの動作状態
  const [isRunning, setIsRunning] = useState(false);

  // タイマー処理
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  // mm:ss形式に変換
  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{formatTime(seconds)}</Text>
      <View style={styles.buttonRow}>
        <Button
          title={isRunning ? "一時停止" : "開始"}
          onPress={() => setIsRunning(!isRunning)}
        />
        <Button title="リセット" onPress={() => setSeconds(25 * 60)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  time: { fontSize: 64, fontWeight: "bold", marginBottom: 40 },
  buttonRow: { flexDirection: "row", gap: 10 },
});
