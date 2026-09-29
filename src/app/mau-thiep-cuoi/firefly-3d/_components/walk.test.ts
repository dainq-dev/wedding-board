import { expect, test } from "bun:test";
import { walk } from "./walk";

test("walk(0) = 0 và đơn điệu không giảm", () => {
  expect(walk(0)).toBe(0);
  let prev = 0;
  for (let i = 0; i <= 1000; i++) {
    const w = walk(i / 1000);
    expect(w).toBeGreaterThanOrEqual(prev - 1e-12);
    prev = w;
  }
});

test("phẳng trong các trạm dừng", () => {
  for (const [a, b, w] of [
    [0.15, 0.21, 0.14],
    [0.26, 0.3, 0.24],
    [0.32, 0.36, 0.3],
    [0.38, 0.42, 0.36],
    [0.62, 0.76, 0.8],
    [0.9, 1, 0.92],
  ])
    for (let p = a; p <= b; p += 0.005) expect(walk(p)).toBeCloseTo(w, 9);
});
