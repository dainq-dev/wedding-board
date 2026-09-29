import { describe, expect, test } from "bun:test";
import { densityCount } from "./density";

describe("densityCount", () => {
  test("đầu trang: 6 cánh ở 0–10%", () => {
    expect(densityCount(0)).toBe(6);
    expect(densityCount(0.05)).toBe(6);
    expect(densityCount(0.1)).toBe(6);
  });

  test("giữa trang: nội suy 6→14 ở 10–60%", () => {
    expect(densityCount(0.35)).toBe(10);
    expect(densityCount(0.6)).toBe(14);
  });

  test("60–90%: 14→22", () => {
    expect(densityCount(0.75)).toBe(18);
    expect(densityCount(0.9)).toBe(22);
  });

  test("cuối trang: tối đa 30 (desktop)", () => {
    expect(densityCount(1)).toBe(30);
  });

  test("mobile: chặn trên bằng max=20", () => {
    expect(densityCount(1, 20)).toBe(20);
    expect(densityCount(0.95, 20)).toBe(20);
    expect(densityCount(0, 20)).toBe(6);
  });

  test("clamp ngoài khoảng 0..1", () => {
    expect(densityCount(-0.5)).toBe(6);
    expect(densityCount(1.5)).toBe(30);
  });

  test("đơn điệu không giảm theo tiến độ", () => {
    let prev = 0;
    for (let p = 0; p <= 1.0001; p += 0.01) {
      const n = densityCount(p);
      expect(n).toBeGreaterThanOrEqual(prev);
      prev = n;
    }
  });
});
