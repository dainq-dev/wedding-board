import { expect, test } from "bun:test";
import {
  boatAt,
  DAWN_STOPS,
  dawnAt,
  lotusField,
  PATH_LENGTH,
  rng,
  sunElevation,
} from "./dawn";

test("dawnAt khớp mốc đầu / cuối và kẹp ngoài [0,1]", () => {
  expect(`#${dawnAt(0).horizon.getHexString()}`).toBe(
    DAWN_STOPS[0].horizon.toLowerCase(),
  );
  expect(`#${dawnAt(9).top.getHexString()}`).toBe(
    DAWN_STOPS[3].top.toLowerCase(),
  );
});

test("mặt trời lên dần, camera tiến về phía trước và luôn trên mặt nước", () => {
  expect(sunElevation(1)).toBeGreaterThan(sunElevation(0));
  let prevZ = Number.POSITIVE_INFINITY;
  for (let p = 0; p <= 1; p += 0.01) {
    const b = boatAt(p, p * 10);
    expect(b.z).toBeLessThanOrEqual(prevZ);
    expect(b.y).toBeGreaterThan(1);
    prevZ = b.z;
  }
  expect(boatAt(1, 0).z).toBeCloseTo(8 - PATH_LENGTH);
});

test("rng xác định theo seed", () => {
  const a = rng(5);
  const b = rng(5);
  expect([a(), a(), a()]).toEqual([b(), b(), b()]);
});

test("cụm sen chừa lối giữa cho thuyền", () => {
  for (const f of lotusField(60))
    expect(Math.abs(f.x)).toBeGreaterThanOrEqual(2.2);
});
