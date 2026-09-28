// C11 lịch tháng (spec §5 C5+C11). Tuần bắt đầu Thứ Hai.

export type MonthGrid = (number | null)[][];

export const WEEKDAY_HEADERS_VI = [
  "T2",
  "T3",
  "T4",
  "T5",
  "T6",
  "T7",
  "CN",
] as const;

const MONTHS_VI = [
  "tháng một",
  "tháng hai",
  "tháng ba",
  "tháng tư",
  "tháng năm",
  "tháng sáu",
  "tháng bảy",
  "tháng tám",
  "tháng chín",
  "tháng mười",
  "tháng mười một",
  "tháng mười hai",
] as const;

// month: 1..12. Tính bằng UTC để ngày/thứ không lệch theo timezone máy chạy test.
export function monthGrid(year: number, month: number): MonthGrid {
  const firstDow = new Date(Date.UTC(year, month - 1, 1)).getUTCDay(); // 0 = CN
  const lead = (firstDow + 6) % 7; // Thứ Hai = cột 0
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
  const weeks: MonthGrid = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export function monthLabelVi(year: number, month: number): string {
  return `${MONTHS_VI[month - 1]} ${year}`;
}
