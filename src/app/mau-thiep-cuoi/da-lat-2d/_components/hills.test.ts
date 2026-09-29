import { expect, test } from "bun:test";
import { MONTH_LINE, ridge, rng } from "./hills";

test("rng xác định theo seed", () => {
  const a = rng(7);
  const b = rng(7);
  expect([a(), a(), a()]).toEqual([b(), b(), b()]);
});

test("ridge: path khép kín, nằm trong khung 1440×400, giống nhau với cùng seed", () => {
  const p = ridge(3, 260, 30, 24);
  expect(p.startsWith("M0 400")).toBe(true);
  expect(p.endsWith("Z")).toBe(true);
  expect(p).toBe(ridge(3, 260, 30, 24));
  const nums = p.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  expect(Math.min(...nums)).toBeGreaterThanOrEqual(0);
  expect(Math.max(...nums)).toBeLessThanOrEqual(1440);
});

test("đủ câu thơ cho 12 tháng", () => {
  expect(MONTH_LINE).toHaveLength(12);
});
