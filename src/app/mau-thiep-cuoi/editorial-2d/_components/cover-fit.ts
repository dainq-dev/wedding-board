// Logic an toàn cho tên trên bìa + nhãn số báo (spec §9.5). Pure, test được.

export type CoverMode = "bleed" | "wrap";

// Cắt mép chỉ đẹp với tên ngắn; tên dài phải xuống dòng, không cắt.
export const BLEED_MAX = 16;

export function coverMode(name1: string, name2: string): CoverMode {
  return name1.trim().length + name2.trim().length <= BLEED_MAX
    ? "bleed"
    : "wrap";
}

const TZ = "Asia/Ho_Chi_Minh";

const pick = (
  d: Date,
  opts: Intl.DateTimeFormatOptions,
  type: "day" | "month" | "year",
) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: TZ, ...opts })
    .formatToParts(d)
    .find((p) => p.type === type)?.value ?? "";

// Số phát hành = ngày của ngày cưới (14 với 14.11.2026).
export function issueNumber(d: Date): number {
  return Number(pick(d, { day: "2-digit" }, "day"));
}

// "THÁNG 11/2026" cho nhãn bìa; `d` luôn qua weddingDate() nên có fallback.
export function issueLabel(d: Date): string {
  const o = { month: "2-digit", year: "numeric" } as const;
  return `THÁNG ${pick(d, o, "month")}/${pick(d, o, "year")}`;
}

// "14.11" cho ngày lớn trang sự kiện.
export function dayMonth(d: Date): string {
  const o = { day: "2-digit", month: "2-digit" } as const;
  return `${pick(d, o, "day")}.${pick(d, o, "month")}`;
}

// "14.11.2026" kiểu số báo.
export function dottedDate(d: Date): string {
  return `${dayMonth(d)}.${pick(d, { year: "numeric" }, "year")}`;
}

// "11/26" cho ô mã vạch bìa sau.
export function barcodeIssue(d: Date): string {
  const o = { month: "2-digit", year: "numeric" } as const;
  return `${pick(d, o, "month")}/${pick(d, o, "year").slice(2)}`;
}
