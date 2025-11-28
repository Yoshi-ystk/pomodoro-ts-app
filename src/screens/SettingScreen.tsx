/**
 * ポモドーロタイマーの設定画面コンポーネント
 *
 * 以下の設定を変更できる：
 * - フェーズの表示名（作業/短休憩/長休憩）
 * - カスタムモードの有効/無効
 * - カスタムモード時のタイマー設定（作業時間、休憩時間、セット回数）
 *
 * カスタムモードが無効の場合は、タイマー設定は読み取り専用（基本モード）。
 */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { usePomodoroSettings } from "../features/pomodoro/contexts/PomodoroSettingsContext";

export const SettingScreen = () => {
  const navigation = useNavigation();

  // 設定コンテキストから設定と保存関数を取得
  const { settings, isLoading, saveSettings, saveConfig, defaultConfig } =
    usePomodoroSettings();

  /**
   * ローカル状態で入力値を管理
   * 設定を保存する前に、ユーザーの入力値を一時的に保持
   */
  const [workLabel, setWorkLabel] = useState(""); // 作業フェーズの表示名
  const [shortBreakLabel, setShortBreakLabel] = useState(""); // 短休憩フェーズの表示名
  const [longBreakLabel, setLongBreakLabel] = useState(""); // 長休憩フェーズの表示名
  const [isCustomMode, setIsCustomMode] = useState(false); // カスタムモードの有効/無効
  const [workMinutes, setWorkMinutes] = useState(25); // 作業時間（分）
  const [shortBreakMinutes, setShortBreakMinutes] = useState(5); // 短休憩時間（分）
  const [longBreakMinutes, setLongBreakMinutes] = useState(15); // 長休憩時間（分）
  const [roundsUntilLongBreak, setRoundsUntilLongBreak] = useState(4); // 1セットあたりの作業回数

  /**
   * 設定コンテキストから設定を読み込んでローカル状態に反映
   * 設定が読み込まれたら、フォームの初期値を設定
   */
  useEffect(() => {
    if (!isLoading && settings) {
      setWorkLabel(settings.phaseLabels.work);
      setShortBreakLabel(settings.phaseLabels.shortBreak);
      setLongBreakLabel(settings.phaseLabels.longBreak);
      setIsCustomMode(settings.useCustomConfig);
      // 秒数を分に変換して表示
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

  /**
   * 数値を増減する汎用関数
   * 最小値と最大値の範囲内で値を変更
   *
   * @param current - 現在の値
   * @param setter - 値を設定する関数
   * @param min - 最小値
   * @param max - 最大値
   * @param delta - 増減する値（+1または-1）
   */
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

  /**
   * 設定を保存する関数
   * ローカル状態の値を設定コンテキストに保存し、AsyncStorageにも永続化
   */
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

      Alert.alert("保存完了", "設定を保存しました");
      navigation.goBack();
    } catch (error) {
      Alert.alert("エラー", "設定の保存に失敗しました");
      console.error(error);
    }
  };

  /**
   * カスタムモードの切り替え処理
   * カスタムモードが無効の場合、タイマー設定の入力欄が無効化される
   */
  const handleToggleCustomMode = (value: boolean) => {
    setIsCustomMode(value);
  };

  /**
   * 戻るボタンの処理
   * 設定画面を閉じて前の画面に戻る
   */
  const handleBack = () => {
    navigation.goBack();
  };

  // 設定の読み込み中はローディング表示
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  /**
   * 数値入力用のナンバーピッカーコンポーネント
   * +/-ボタンと数値表示で構成され、カスタムモードが無効の場合は無効化される
   */
  const NumberPicker = ({
    label,
    value,
    min,
    max,
    onDecrease,
    onIncrease,
    onValueChange,
    disabled = false,
  }: {
    label: string;
    value: number;
    min: number;
    max: number;
    onDecrease: () => void;
    onIncrease: () => void;
    onValueChange?: (newValue: number) => void;
    disabled?: boolean;
  }) => {
    const [isPressing, setIsPressing] = React.useState(false);
    const pressIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
    const [inputValue, setInputValue] = React.useState(value.toString());

    // 値が変更されたら入力値も更新
    React.useEffect(() => {
      setInputValue(value.toString());
    }, [value]);

    // 長押しの処理
    const handlePressIn = (isIncrease: boolean) => {
      if (disabled) return;

      setIsPressing(true);

      // 最初の1回はすぐに実行
      if (isIncrease) {
        onIncrease();
      } else {
        onDecrease();
      }

      // その後は一定間隔で連続実行
      pressIntervalRef.current = setInterval(() => {
        if (isIncrease) {
          onIncrease();
        } else {
          onDecrease();
        }
      }, 150); // 150msごとに実行
    };

    const handlePressOut = () => {
      setIsPressing(false);
      if (pressIntervalRef.current) {
        clearInterval(pressIntervalRef.current);
        pressIntervalRef.current = null;
      }
    };

    // クリーンアップ
    React.useEffect(() => {
      return () => {
        if (pressIntervalRef.current) {
          clearInterval(pressIntervalRef.current);
        }
      };
    }, []);

    // 直接入力の処理
    const handleInputChange = (text: string) => {
      setInputValue(text);
    };

    const handleInputBlur = () => {
      const numValue = parseInt(inputValue, 10);
      if (
        !isNaN(numValue) &&
        numValue >= min &&
        numValue <= max &&
        onValueChange
      ) {
        onValueChange(numValue);
      } else {
        // 無効な値の場合は元の値に戻す
        setInputValue(value.toString());
      }
    };

    return (
      <View style={styles.section}>
        <Text style={[styles.label, disabled && styles.labelDisabled]}>
          {label}
        </Text>
        <View style={styles.numberPickerContainer}>
          <TouchableOpacity
            style={[
              styles.numberButton,
              disabled && styles.numberButtonDisabled,
            ]}
            onPressIn={() => handlePressIn(false)}
            onPressOut={handlePressOut}
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

          {disabled ? (
            <View style={[styles.numberDisplay, styles.numberDisplayDisabled]}>
              <Text
                style={[
                  styles.numberDisplayText,
                  styles.numberDisplayTextDisabled,
                ]}
              >
                {value}
              </Text>
            </View>
          ) : (
            <TextInput
              style={styles.numberDisplayInput}
              value={inputValue}
              onChangeText={handleInputChange}
              onBlur={handleInputBlur}
              keyboardType="numeric"
              selectTextOnFocus
              maxLength={2}
            />
          )}

          <TouchableOpacity
            style={[
              styles.numberButton,
              disabled && styles.numberButtonDisabled,
            ]}
            onPressIn={() => handlePressIn(true)}
            onPressOut={handlePressOut}
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
  };

  return (
    <View style={styles.container}>
      {/* ヘッダー：戻るボタンとタイトル */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 戻る</Text>
        </TouchableOpacity>
        <Text style={styles.title}>設定</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* フェーズ表示名の設定 */}
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

        {/* カスタムモードの切り替えスイッチ */}
        <View style={styles.section}>
          <View style={styles.toggleContainer}>
            <Text style={styles.label}>カスタムモード</Text>
            <Switch
              value={isCustomMode}
              onValueChange={handleToggleCustomMode}
            />
          </View>
        </View>

        {/* カスタムモード時のタイマー設定（カスタムモードが無効の場合は無効化） */}
        <NumberPicker
          label="作業時間（分）"
          value={workMinutes}
          min={15}
          max={60}
          onDecrease={() =>
            adjustValue(workMinutes, setWorkMinutes, 15, 60, -1)
          }
          onIncrease={() => adjustValue(workMinutes, setWorkMinutes, 15, 60, 1)}
          onValueChange={(newValue) => setWorkMinutes(newValue)}
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
          onValueChange={(newValue) => setWorkMinutes(newValue)}
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
          onValueChange={(newValue) => setWorkMinutes(newValue)}
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
          onValueChange={(newValue) => setWorkMinutes(newValue)}
          disabled={!isCustomMode}
        />

        {/* 設定を保存するボタン */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>保存</Text>
        </TouchableOpacity>
      </ScrollView>
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
    padding: 20,
    paddingBottom: 80,
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
  numberDisplayInput: {
    minWidth: 60,
    marginHorizontal: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  labelDisabled: {
    color: "#999",
  },
});
