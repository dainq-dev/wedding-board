import { expect, test } from "bun:test";
import { nightness, SKY_STOPS, skyAt, sunElevation } from "./sky";

test("skyAt trùng mốc ở hai đầu", () => {
  expect(`#${skyAt(0).top.getHexString()}`).toBe(
    SKY_STOPS[0].top.toLowerCase(),
  );
  expect(`#${skyAt(1).top.getHexString()}`).toBe(
    SKY_STOPS[4].top.toLowerCase(),
  );
  expect(`#${skyAt(5).horizon.getHexString()}`).toBe(
    SKY_STOPS[4].horizon.toLowerCase(),
  );
});

test("trời tối dần: độ sáng đỉnh trời giảm từ giờ vàng về đêm", () => {
  const l = (p: number) => skyAt(p).top.getHSL({ h: 0, s: 0, l: 0 }).l;
  expect(l(0.6)).toBeGreaterThan(l(0.8));
  expect(l(0.8)).toBeGreaterThan(l(1));
});

test("nightness 0 ban ngày, 1 cuối trang; mặt trời hạ dần", () => {
  expect(nightness(0.3)).toBe(0);
  expect(nightness(1)).toBe(1);
  expect(sunElevation(0)).toBeGreaterThan(sunElevation(0.5));
  expect(sunElevation(1)).toBeLessThan(0);
});
