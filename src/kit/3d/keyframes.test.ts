import { expect, test } from "bun:test";
import { type Keyframe, range, sampleKeyframes } from "./keyframes";

const kfs: Keyframe[] = [
  { at: 0, pos: [0, 0, 10], look: [0, 0, 0] },
  { at: 0.5, pos: [10, 0, 10], look: [0, 0, 0] },
  { at: 1, pos: [10, 10, 0], look: [0, 0, -5] },
];

test("đầu, giữa, cuối", () => {
  expect(sampleKeyframes(kfs, 0).pos.toArray()).toEqual([0, 0, 10]);
  expect(sampleKeyframes(kfs, 0.5).pos.toArray()).toEqual([10, 0, 10]);
  expect(sampleKeyframes(kfs, 1).pos.toArray()).toEqual([10, 10, 0]);
});

test("giữa hai keyframe nằm giữa hai vị trí", () => {
  const x = sampleKeyframes(kfs, 0.25).pos.x;
  expect(x).toBeGreaterThan(0);
  expect(x).toBeLessThan(10);
});

test("kẹp ngoài [0,1]", () => {
  expect(sampleKeyframes(kfs, -1).pos.toArray()).toEqual([0, 0, 10]);
  expect(sampleKeyframes(kfs, 2).pos.toArray()).toEqual([10, 10, 0]);
});

test("range", () => {
  expect(range(0.3, 0.2, 0.4)).toBeCloseTo(0.5);
  expect(range(0.1, 0.2, 0.4)).toBe(0);
});
