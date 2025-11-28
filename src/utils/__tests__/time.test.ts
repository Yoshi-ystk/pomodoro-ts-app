import { formatTime } from "../time";

describe("formatTime", () => {
  it("0秒を正しくフォーマットする", () => {
    expect(formatTime(0)).toBe("00:00");
  });

  it("59秒を正しくフォーマットする", () => {
    expect(formatTime(59)).toBe("00:59");
  });

  it("60秒（1分）を正しくフォーマットする", () => {
    expect(formatTime(60)).toBe("01:00");
  });

  it("61秒を正しくフォーマットする", () => {
    expect(formatTime(61)).toBe("01:01");
  });

  it("150秒（2分30秒）を正しくフォーマットする", () => {
    expect(formatTime(150)).toBe("02:30");
  });

  it("600秒（10分）を正しくフォーマットする", () => {
    expect(formatTime(600)).toBe("10:00");
  });

  it("1500秒（25分）を正しくフォーマットする", () => {
    expect(formatTime(1500)).toBe("25:00");
  });

  it("300秒（5分）を正しくフォーマットする", () => {
    expect(formatTime(300)).toBe("05:00");
  });

  it("900秒（15分）を正しくフォーマットする", () => {
    expect(formatTime(900)).toBe("15:00");
  });

  it("3599秒（59分59秒）を正しくフォーマットする", () => {
    expect(formatTime(3599)).toBe("59:59");
  });

  it("3600秒（60分）を正しくフォーマットする", () => {
    expect(formatTime(3600)).toBe("60:00");
  });

  it("秒数が1桁の場合、ゼロパディングされる", () => {
    expect(formatTime(5)).toBe("00:05");
    expect(formatTime(125)).toBe("02:05");
  });

  it("分数が1桁の場合、ゼロパディングされる", () => {
    expect(formatTime(60)).toBe("01:00");
    expect(formatTime(540)).toBe("09:00");
  });
});
