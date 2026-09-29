import { describe, expect, test } from "bun:test";
import { monthGrid, monthLabelVi, WEEKDAY_HEADERS_VI } from "./calendar";

describe("monthGrid", () => {
  test("11/2026 bắt đầu Chủ Nhật → 6 ô trống rồi ngày 1 ở cột CN", () => {
    const g = monthGrid(2026, 11);
    expect(g[0]).toEqual([null, null, null, null, null, null, 1]);
    expect(g).toHaveLength(6); // 6 + 30 = 36 ô
    expect(g.at(-1)).toEqual([30]);
  });

  test("02/2026 có 28 ngày, tuần cuối 6 ô", () => {
    const g = monthGrid(2026, 2);
    expect(g[0]?.[6]).toBe(1);
    const flat = g.flat().filter((d): d is number => d !== null);
    expect(flat).toHaveLength(28);
    expect(flat.at(-1)).toBe(28);
    expect(g.at(-1)).toHaveLength(6);
  });

  test("01/2026 bắt đầu Thứ Năm (ngày 1 ở cột T5)", () => {
    const g = monthGrid(2026, 1);
    expect(g[0]?.[3]).toBe(1);
  });

  test("mọi tuần đủ 7 cột (trừ tuần cuối có thể ngắn)", () => {
    for (const g of [
      monthGrid(2026, 11),
      monthGrid(2026, 2),
      monthGrid(2027, 5),
    ]) {
      for (const w of g.slice(0, -1)) expect(w).toHaveLength(7);
    }
  });
});

describe("monthLabelVi", () => {
  test("tên tháng tiếng Việt", () => {
    expect(monthLabelVi(2026, 11)).toBe("tháng mười một 2026");
    expect(monthLabelVi(2026, 1)).toBe("tháng một 2026");
    expect(monthLabelVi(2027, 12)).toBe("tháng mười hai 2027");
  });

  test("header tuần bắt đầu Thứ Hai", () => {
    expect(WEEKDAY_HEADERS_VI[0]).toBe("T2");
    expect(WEEKDAY_HEADERS_VI[6]).toBe("CN");
  });
});
