import { expect, test } from "bun:test";
import { monthGrid, vnParts } from "./time";

test("vnParts theo giờ Việt Nam", () => {
  expect(vnParts(new Date("2026-11-13T20:00:00Z"))).toEqual({
    day: 14,
    month: 11,
    year: 2026,
  });
});

test("monthGrid tháng 11/2026: 6 ô trống đầu, đủ 30 ngày, chia hết cho 7", () => {
  const g = monthGrid(new Date("2026-11-14T18:00:00+07:00"));
  expect(g.slice(0, 7)).toEqual([null, null, null, null, null, null, 1]);
  expect(g.filter(Boolean)).toHaveLength(30);
  expect(g.length % 7).toBe(0);
});
