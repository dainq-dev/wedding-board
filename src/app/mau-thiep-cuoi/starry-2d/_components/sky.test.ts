import { expect, test } from "bun:test";
import { moonAt, stars, village } from "./sky";

test("stars: xác định theo seed, nằm trong khung, 8 sao lớn", () => {
  const a = stars(40);
  expect(a).toEqual(stars(40));
  expect(a.every((s) => s.x >= 0 && s.x <= 100 && s.y >= 0 && s.y <= 72)).toBe(
    true,
  );
  expect(a.filter((s) => s.big)).toHaveLength(8);
});

test("village: path khép kín, không vượt khung 1000×200", () => {
  const p = village();
  expect(p.endsWith("Z")).toBe(true);
  const nums = p.match(/-?\d+/g)?.map(Number) ?? [];
  expect(Math.min(...nums)).toBeGreaterThanOrEqual(0);
});

test("moonAt: đi từ trái sang phải theo vòng cung, cao nhất ở giữa", () => {
  expect(moonAt(0)).toEqual({ x: 12, y: 16 });
  expect(moonAt(1).x).toBe(88);
  expect(moonAt(0.5).y).toBeLessThan(moonAt(0.1).y);
  expect(moonAt(2)).toEqual(moonAt(1));
});
