import { expect, test } from "bun:test";
import { barFraction, barScale } from "./letterbox-ratio";

const R219 = 21 / 9;

test("nhánh 1: viewport ngắn hơn khung trong → không có dải (0)", () => {
  expect(barFraction(1000, 300, 16 / 9)).toBe(0); // inner 562 >= 300
  expect(barFraction(1440, 500, R219)).toBe(0); // inner 617 >= 500
});

test("nhánh 2: desktop ngang tính đúng (vh - vw/r)/2/vh", () => {
  const f = barFraction(1440, 900, R219);
  expect(f).toBeCloseTo((900 - 1440 / R219) / 2 / 900);
  expect(f).toBeCloseTo(0.157, 3);
});

test("mobile dọc: 21:9 cap 0.12 (12svh mỗi bên), không phải 0.39", () => {
  expect(barFraction(360, 740, R219)).toBe(0.12);
});

test("mobile ngang không bị cap (vh <= vw)", () => {
  const f = barFraction(740, 360, R219);
  expect(f).toBeCloseTo((360 - 740 / R219) / 2 / 360);
});

test("barScale: open = 0, các tỉ lệ = fraction*2 và không vượt 1", () => {
  expect(barScale(1440, 900, "open")).toBe(0);
  expect(barScale(360, 740, "21:9")).toBe(0.24);
  expect(barScale(1440, 900, "16:9")).toBeCloseTo(0.1);
  expect(barScale(1440, 900, "21:9")).toBeLessThanOrEqual(1);
});
