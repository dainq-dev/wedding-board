import { expect, test } from "bun:test";
import { buildIcs, weekOf } from "./ics";

const d = new Date("2026-11-14T18:00:00+07:00");

test("buildIcs: giờ UTC, kéo dài 3 giờ, escape dấu phẩy", () => {
  const ics = buildIcs(d, "Đám cưới A, B", "Nhà hàng X; Q1");
  expect(ics).toContain("DTSTART:20261114T110000Z");
  expect(ics).toContain("DTEND:20261114T140000Z");
  expect(ics).toContain("SUMMARY:Đám cưới A\\, B");
  expect(ics).toContain("LOCATION:Nhà hàng X\\; Q1");
});

test("weekOf: tuần T2 9/11 → CN 15/11, đánh dấu ngày cưới", () => {
  const w = weekOf(d);
  expect(w.map((x) => x.day)).toEqual([9, 10, 11, 12, 13, 14, 15]);
  expect(w.findIndex((x) => x.today)).toBe(5);
});
