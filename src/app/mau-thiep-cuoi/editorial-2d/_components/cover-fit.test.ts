import { expect, test } from "bun:test";
import { FALLBACK_DATE, weddingDate } from "@/kit/dates";
import {
  barcodeIssue,
  coverMode,
  dayMonth,
  dottedDate,
  issueLabel,
  issueNumber,
} from "./cover-fit";

const date = new Date("2026-11-14T18:00:00+07:00");

test("coverMode: tên ngắn cắt mép, tên dài xuống dòng", () => {
  // "Minh"(4) + "Quân"(5) + "Thu Hà"(6) → tổ 9/11 ≤ 16 → bleed
  expect(coverMode("Minh Quân", "Thu Hà")).toBe("bleed");
  expect(coverMode("Nguyễn Thị Hằng", "Trịnh Đức Hưởng")).toBe("wrap");
  // biên: tổng đúng 16 → bleed, 17 → wrap
  expect(coverMode("a".repeat(8), "b".repeat(8))).toBe("bleed");
  expect(coverMode("a".repeat(8), "b".repeat(9))).toBe("wrap");
  expect(coverMode("  Minh  ", " Thu Hà ")).toBe("bleed");
});

test("issueNumber = ngày cưới", () => {
  expect(issueNumber(date)).toBe(14);
});

test("issueLabel: THÁNG MM/YYYY", () => {
  expect(issueLabel(date)).toBe("THÁNG 11/2026");
});

test("không có date → fallback 11/2026 (spec C1 ⚠️)", () => {
  const d = weddingDate({ date: undefined } as never);
  expect(d.toISOString()).toBe(new Date(FALLBACK_DATE).toISOString());
  expect(issueLabel(d)).toBe("THÁNG 11/2026");
  expect(issueNumber(d)).toBe(14);
});

test("ngày/tên in theo kiểu số báo", () => {
  expect(dayMonth(date)).toBe("14.11");
  expect(dottedDate(date)).toBe("14.11.2026");
  expect(barcodeIssue(date)).toBe("11/26");
});

test("múi giờ: 15.11 00:30 +07 vẫn là ngày 15, không lệch về 14", () => {
  const late = new Date("2026-11-14T17:30:00Z"); // 00:30 ngày 15 giờ VN
  expect(issueNumber(late)).toBe(15);
  expect(dayMonth(late)).toBe("15.11");
});
