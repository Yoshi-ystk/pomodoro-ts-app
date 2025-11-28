/**
 * 秒数をmm:ss形式の文字列に変換するユーティリティ関数
 *
 * @param totalSeconds - 変換する秒数（0以上の整数）
 * @returns "mm:ss"形式の文字列（例: "25:00", "05:30"）
 *
 * @example
 * formatTime(1500) // "25:00"
 * formatTime(330)  // "05:30"
 * formatTime(5)    // "00:05"
 */
export const formatTime = (totalSeconds: number) => {
  // 分と秒を計算
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;

  // 2桁にゼロパディングして返す
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};
