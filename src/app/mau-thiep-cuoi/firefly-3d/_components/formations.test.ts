import { expect, test } from "bun:test";
import { arrowPoints, pickEvenly } from "./formations";

const id = (x: number, y: number): [number, number, number] => [x, y, 0];

test("pickEvenly trả đúng n điểm", () => {
  expect(pickEvenly([1, 2, 3, 4, 5, 6], 2, id).length).toBe(6);
  const few = pickEvenly([1, 2], 5, id);
  expect(few.length).toBe(15);
  expect(Array.from(few.slice(12))).toEqual([1, 2, 0]);
  expect(Array.from(pickEvenly([], 3, id))).toEqual(Array(9).fill(0));
});

test("arrowPoints nằm trong hộp mũi tên", () => {
  const a = arrowPoints(120);
  expect(a.length).toBe(360);
  for (let i = 0; i < 120; i++) {
    expect(Math.abs(a[i * 3])).toBeLessThanOrEqual(1);
    expect(a[i * 3 + 1]).toBeGreaterThanOrEqual(-1);
    expect(a[i * 3 + 1]).toBeLessThanOrEqual(2);
  }
});
