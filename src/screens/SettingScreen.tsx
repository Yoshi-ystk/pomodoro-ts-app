import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { usePomodoroSettings } from "../features/pomodoro/hooks/usePomodoroSettings";

export const SettingScreen = () => {
  const navigation = useNavigation();
  const { settings, isLoading, saveSettings } = usePomodoroSettings();

  // ローカル状態で入力値を管理
  const [workLabel, setWorkLabel] = useState("");
  const [shortBreakLabel, setShortBreakLabel] = useState("");
  const [longBreakLabel, setLongBreakLabel] = useState("");

  // 設定を読み込んでローカル状態に反映
  useEffect(() => {
    if (!isLoading && settings) {
      setWorkLabel(settings.phaseLabels.work);
      setShortBreakLabel(settings.phaseLabels.shortBreak);
      setLongBreakLabel(settings.phaseLabels.longBreak);
    }
  }, [settings, isLoading]);

  // 設定を保存する関数
  const handleSave = async () => {
    try {
      await saveSettings({
        phaseLabels: {
          work: workLabel.trim() || "作業",
          shortBreak: shortBreakLabel.trim() || "短休憩",
          longBreak: longBreakLabel.trim() || "長休憩",
        },
      });
      Alert.alert("保存完了", "設定を保存しました");
      navigation.goBack();
    } catch (error) {
      Alert.alert("エラー", "設定の保存に失敗しました");
      console.error(error);
    }
  };

  // 戻るボタンの処理
  const handleBack = () => {
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 戻る</Text>
        </TouchableOpacity>
        <Text style={styles.title}>設定</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>作業フェーズの表示名</Text>
          <TextInput
            style={styles.input}
            value={workLabel}
            onChangeText={setWorkLabel}
            placeholder="例: 作業"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>短休憩フェーズの表示名</Text>
          <TextInput
            style={styles.input}
            value={shortBreakLabel}
            onChangeText={setShortBreakLabel}
            placeholder="例: 短休憩"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>長休憩フェーズの表示名</Text>
          <TextInput
            style={styles.input}
            value={longBreakLabel}
            onChangeText={setLongBreakLabel}
            placeholder="例: 長休憩"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>保存</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
