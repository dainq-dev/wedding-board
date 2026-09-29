import { describe, expect, it } from "bun:test";
import { beachSchedule, monthCells, vnDay } from "./schedule";

const BASE = new Date("2026-11-14T18:00:00+07:00");

describe("beachSchedule", () => {
  it("trả 4 mốc lệch -2h, -1h, 0, +1h30 theo giờ Việt Nam", () => {
    expect(beachSchedule(BASE).map((slot) => slot.time)).toEqual([
      "16:00",
      "17:00",
      "18:00",
      "19:30",
    ]);
  });

  it("giữ đúng thứ tự nghi thức", () => {
    expect(beachSchedule(BASE).map((slot) => slot.key)).toEqual([
      "welcome",
      "ceremony",
      "dinner",
      "party",
    ]);
  });
});

describe("monthCells", () => {
  it("bắt đầu tuần Thứ Hai và chứa đúng ngày cưới", () => {
    const cells = monthCells(BASE);
    expect(cells[6]).toBe(1);
    expect(cells).toContain(14);
    expect(cells.length % 7).toBe(0);
  });

  it("vnDay đệm 2 chữ số", () => {
    expect(vnDay(BASE)).toBe("14");
  });
});
