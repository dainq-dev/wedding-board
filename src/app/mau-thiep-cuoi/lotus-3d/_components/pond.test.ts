import { expect, test } from "bun:test";
import { CatmullRomCurve3, Vector3 } from "three";
import { bloomAt, cardVisible, easeRemap, PATH } from "./pond";

test("bloomAt", () => {
  expect(bloomAt("L0", 0.05)).toBe(0);
  expect(bloomAt("L0", 0.2)).toBe(1);
  expect(bloomAt("L0", 0.5)).toBeCloseTo(0.7);
});

test("cardVisible ở ranh", () => {
  expect(cardVisible("L0", 0.09)).toBe(false);
  expect(cardVisible("L0", 0.2)).toBe(true);
  expect(cardVisible("L0", 0.25)).toBe(false);
  expect(cardVisible("L1", 0.46)).toBe(true);
  expect(cardVisible("L1", 0.47)).toBe(false);
});

test("không có hai card C4 cùng hiện", () => {
  for (let p = 0; p <= 1; p += 0.001) {
    const n = (["L1", "L2", "L3"] as const).filter((id) =>
      cardVisible(id, p),
    ).length;
    expect(n).toBeLessThanOrEqual(1);
  }
});

test("easeRemap đơn điệu, 0→0, 1→1", () => {
  expect(easeRemap(0)).toBe(0);
  expect(easeRemap(1)).toBe(1);
  let prev = -1;
  for (let p = 0; p <= 1; p += 0.001) {
    const u = easeRemap(p);
    expect(u).toBeGreaterThanOrEqual(prev);
    prev = u;
  }
});

test("camera không chìm dưới nước (y ≥ 0.3)", () => {
  const curve = new CatmullRomCurve3(
    PATH.map((k) => new Vector3(...k.pos)),
    false,
    "centripetal",
  );
  for (let u = 0; u <= 1; u += 0.002)
    expect(curve.getPoint(u).y).toBeGreaterThanOrEqual(0.3);
});
