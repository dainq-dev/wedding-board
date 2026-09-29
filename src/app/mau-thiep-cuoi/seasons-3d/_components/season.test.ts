import { expect, test } from "bun:test";
import { buildTree, ORBIT_KFS, sampleOrbit, seasonAt } from "./season";

test("seasonAt đứng yên giữa ranh, lerp tại ranh", () => {
  expect(seasonAt(0.1)).toBe(0);
  expect(seasonAt(0.4)).toBe(1);
  expect(Math.abs(seasonAt(0.3) - 0.5)).toBeLessThan(0.01);
  expect(seasonAt(0.95)).toBe(4);
});

test("seasonAt đơn điệu không giảm", () => {
  let prev = -1;
  for (let p = 0; p <= 1; p += 0.001) {
    const s = seasonAt(p);
    expect(s).toBeGreaterThanOrEqual(prev);
    prev = s;
  }
});

test("sampleOrbit không cắt qua cây", () => {
  const minR = Math.min(...ORBIT_KFS.map((k) => k.r));
  for (let p = 0; p <= 1; p += 0.002) {
    const { pos } = sampleOrbit(ORBIT_KFS, p);
    expect(Math.hypot(pos.x, pos.z)).toBeGreaterThanOrEqual(minR - 1e-6);
  }
  const end = sampleOrbit(ORBIT_KFS, 1).pos;
  expect(Math.hypot(end.x, end.z)).toBeCloseTo(18);
});

test("buildTree ổn định theo seed", () => {
  expect(buildTree(42).length).toBe(63);
  expect(buildTree(42, 4).length).toBe(31);
  expect(buildTree(42)[10].end.toArray()).toEqual(
    buildTree(42)[10].end.toArray(),
  );
});
