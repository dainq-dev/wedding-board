import { expect, test } from "bun:test";
import { monthCells, orderNo, scheduleFrom } from "./cafe-time";

const wedding = new Date("2026-11-14T18:00:00+07:00");

test("orderNo = ddMM theo giờ Việt Nam", () => {
  expect(orderNo(wedding)).toBe("1411");
  // 23:30 UTC ngày 13 = 06:30 sáng 14 ở VN
  expect(orderNo(new Date("2026-11-13T23:30:00Z"))).toBe("1411");
});

test("scheduleFrom: 4 mốc −60′, 0, +30′, +120′", () => {
  expect(scheduleFrom(wedding).map((s) => s.time)).toEqual([
    "17:00",
    "18:00",
    "18:30",
    "20:00",
  ]);
});

test("scheduleFrom qua nửa đêm vẫn đúng", () => {
  const late = new Date("2026-11-14T23:00:00+07:00");
  expect(scheduleFrom(late).at(-1)?.time).toBe("01:00");
});

test("monthCells: tháng 11/2026 bắt đầu Chủ Nhật → 6 ô trống đầu", () => {
  const cells = monthCells(wedding);
  expect(cells.slice(0, 7)).toEqual([null, null, null, null, null, null, 1]);
  expect(cells.filter((c) => c !== null)).toHaveLength(30);
  expect(cells.length % 7).toBe(0);
});
