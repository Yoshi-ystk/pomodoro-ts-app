import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { usePomodoroSettings } from "../features/pomodoro/hooks/usePomodoroSettings";

export const SettingScreen = () => {
  const navigation = useNavigation();
  const {
    settings,
    isLoading,
    saveSettings,
    saveConfig,
    toggleCustomMode,
    defaultConfig,
  } = usePomodoroSettings();

  // ローカル状態で入力値を管理
  const [workLabel, setWorkLabel] = useState("");
  const [shortBreakLabel, setShortBreakLabel] = useState("");
  const [longBreakLabel, setLongBreakLabel] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);
  const [roundsUntilLongBreak, setRoundsUntilLongBreak] = useState(4);

  // 設定を読み込んでローカル状態に反映
  useEffect(() => {
    if (!isLoading && settings) {
      setWorkLabel(settings.phaseLabels.work);
      setShortBreakLabel(settings.phaseLabels.shortBreak);
      setLongBreakLabel(settings.phaseLabels.longBreak);
      setIsCustomMode(settings.useCustomConfig);
      setWorkMinutes(Math.floor(settings.customConfig.workSeconds / 60));
      setShortBreakMinutes(
        Math.floor(settings.customConfig.shortBreakSeconds / 60)
      );
      setLongBreakMinutes(
        Math.floor(settings.customConfig.longBreakSeconds / 60)
      );
      setRoundsUntilLongBreak(settings.customConfig.roundsUntilLongBreak);
    }
  }, [settings, isLoading]);

  // 数値を増減する関数
  const adjustValue = (
    current: number,
    setter: (val: number) => void,
    min: number,
    max: number,
    delta: number
  ) => {
    const newValue = current + delta;
    if (newValue >= min && newValue <= max) {
      setter(newValue);
    }
  };

  // 設定を保存する関数
  const handleSave = async () => {
    try {
      // カスタム設定を保存
      const customConfig = {
        workSeconds: workMinutes * 60,
        shortBreakSeconds: shortBreakMinutes * 60,
        longBreakSeconds: longBreakMinutes * 60,
        roundsUntilLongBreak: roundsUntilLongBreak,
      };

      await saveSettings({
        phaseLabels: {
          work: workLabel.trim() || "作業",
          shortBreak: shortBreakLabel.trim() || "短休憩",
          longBreak: longBreakLabel.trim() || "長休憩",
        },
        useCustomConfig: isCustomMode,
        customConfig: customConfig,
      });

      // カスタムモードがONの場合はconfigにも反映
      if (isCustomMode) {
        await saveConfig(customConfig);
      } else {
        await saveConfig(defaultConfig);
      }

      await toggleCustomMode(isCustomMode);
      Alert.alert("保存完了", "設定を保存しました");
      navigation.goBack();
    } catch (error) {
      Alert.alert("エラー", "設定の保存に失敗しました");
      console.error(error);
    }
  };

  // カスタムモード切替
  const handleToggleCustomMode = (value: boolean) => {
    setIsCustomMode(value);
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

  // ナンバーピッカーコンポーネント
  const NumberPicker = ({
    label,
    value,
    min,
    max,
    onDecrease,
    onIncrease,
    disabled = false,
  }: {
    label: string;
    value: number;
    min: number;
    max: number;
    onDecrease: () => void;
    onIncrease: () => void;
    disabled?: boolean;
  }) => (
    <View style={styles.section}>
      <Text style={[styles.label, disabled && styles.labelDisabled]}>
        {label}
      </Text>
      <View style={styles.numberPickerContainer}>
        <TouchableOpacity
          style={[styles.numberButton, disabled && styles.numberButtonDisabled]}
          onPress={onDecrease}
          disabled={disabled}
        >
          <Text
            style={[
              styles.numberButtonText,
              disabled && styles.numberButtonTextDisabled,
            ]}
          >
            -
          </Text>
        </TouchableOpacity>
        <View
          style={[
            styles.numberDisplay,
            disabled && styles.numberDisplayDisabled,
          ]}
        >
          <Text
            style={[
              styles.numberDisplayText,
              disabled && styles.numberDisplayTextDisabled,
            ]}
          >
            {value}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.numberButton, disabled && styles.numberButtonDisabled]}
          onPress={onIncrease}
          disabled={disabled}
        >
          <Text
            style={[
              styles.numberButtonText,
              disabled && styles.numberButtonTextDisabled,
            ]}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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

        <View style={styles.section}>
          <View style={styles.toggleContainer}>
            <Text style={styles.label}>カスタムモード</Text>
            <Switch
              value={isCustomMode}
              onValueChange={handleToggleCustomMode}
            />
          </View>
        </View>

        <NumberPicker
          label="作業時間（分）"
          value={workMinutes}
          min={15}
          max={60}
          onDecrease={() =>
            adjustValue(workMinutes, setWorkMinutes, 15, 60, -1)
          }
          onIncrease={() => adjustValue(workMinutes, setWorkMinutes, 15, 60, 1)}
          disabled={!isCustomMode}
        />

        <NumberPicker
          label="短休憩時間（分）"
          value={shortBreakMinutes}
          min={3}
          max={10}
          onDecrease={() =>
            adjustValue(shortBreakMinutes, setShortBreakMinutes, 3, 10, -1)
          }
          onIncrease={() =>
            adjustValue(shortBreakMinutes, setShortBreakMinutes, 3, 10, 1)
          }
          disabled={!isCustomMode}
        />

        <NumberPicker
          label="長休憩時間（分）"
          value={longBreakMinutes}
          min={10}
          max={30}
          onDecrease={() =>
            adjustValue(longBreakMinutes, setLongBreakMinutes, 10, 30, -1)
          }
          onIncrease={() =>
            adjustValue(longBreakMinutes, setLongBreakMinutes, 10, 30, 1)
          }
          disabled={!isCustomMode}
        />

        <NumberPicker
          label="1セットあたりの作業回数（回）"
          value={roundsUntilLongBreak}
          min={3}
          max={6}
          onDecrease={() =>
            adjustValue(roundsUntilLongBreak, setRoundsUntilLongBreak, 3, 6, -1)
          }
          onIncrease={() =>
            adjustValue(roundsUntilLongBreak, setRoundsUntilLongBreak, 3, 6, 1)
          }
          disabled={!isCustomMode}
        />

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
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  numberPickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  numberButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  numberButtonDisabled: {
    backgroundColor: "#e0e0e0",
  },
  numberButtonText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  numberButtonTextDisabled: {
    color: "#999",
  },
  numberDisplay: {
    minWidth: 60,
    marginHorizontal: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    alignItems: "center",
  },
  numberDisplayDisabled: {
    backgroundColor: "#e0e0e0",
  },
  numberDisplayText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  numberDisplayTextDisabled: {
    color: "#999",
  },
  labelDisabled: {
    color: "#999",
  },
});
