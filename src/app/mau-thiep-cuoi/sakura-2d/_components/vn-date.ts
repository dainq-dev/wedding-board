// Tách ngày theo giờ Việt Nam — SSR và client cho cùng kết quả, tránh lệch hydration.
const FORMAT = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Ho_Chi_Minh",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function vnDateParts(d: Date): {
  year: number;
  month: number;
  day: number;
} {
  const parts = FORMAT.formatToParts(d);
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { year: pick("year"), month: pick("month"), day: pick("day") };
}
