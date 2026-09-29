import { expect, test } from "bun:test";
import { sampleKeyframes } from "@/kit/3d/keyframes";
import { KEYFRAMES, orbit } from "./keyframes";

test("keyframe camera đầu/cuối và kẹp", () => {
  expect(sampleKeyframes(KEYFRAMES, 0).pos.toArray()).toEqual([0, 0, 60]);
  expect(sampleKeyframes(KEYFRAMES, 1).pos.toArray()).toEqual([0, 0, 26]);
  expect(sampleKeyframes(KEYFRAMES, 5).pos.toArray()).toEqual([0, 0, 26]);
  const z = sampleKeyframes(KEYFRAMES, 0.06).pos.z;
  expect(z).toBeLessThan(60);
  expect(z).toBeGreaterThan(38);
});

test("keyframe sắp tăng dần", () => {
  for (let i = 1; i < KEYFRAMES.length; i++)
    expect(KEYFRAMES[i].at).toBeGreaterThan(KEYFRAMES[i - 1].at);
});

test("quỹ đạo: bắt đầu R=18, hội tụ tại 0.72", () => {
  expect(Math.hypot(...orbit(0))).toBeCloseTo(18);
  expect(Math.hypot(...orbit(0.72))).toBeCloseTo(0);
  expect(Math.hypot(...orbit(0.9))).toBeCloseTo(0);
  expect(Math.hypot(...orbit(0.3))).toBeLessThan(18);
});
