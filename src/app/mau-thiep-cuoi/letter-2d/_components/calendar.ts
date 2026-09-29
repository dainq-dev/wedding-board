// Lịch và ngày giờ cho card C5+C11+C12. Mọi phép chia ngày/tháng đều chốt
// theo múi giờ Asia/Ho_Chi_Minh (qua Intl formatToParts) để server và client
// không lệch số ngày (tránh lỗi hydration khi date gần nửa đêm).

const TZ = "Asia/Ho_Chi_Minh";

const partsOf = (date: Date) => {
  const p = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(p.find((x) => x.type === type)?.value ?? 0);
  const weekdayShort = p.find((x) => x.type === "weekday")?.value ?? "Mon";
  // en-GB: Mon/Tue/... → chỉ số tuần, Thứ Hai = 0.
  const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return {
    year: get("year"),
    month: get("month"), // 1–12
    day: get("day"),
    weekdayIndex: Math.max(0, WEEK.indexOf(weekdayShort)),
  };
};

const MONTH_WORDS = [
  "Một",
  "Hai",
  "Ba",
  "Bốn",
  "Năm",
  "Sáu",
  "Bảy",
  "Tám",
  "Chín",
  "Mười",
  "Mười Một",
  "Mười Hai",
] as const;

// "THÁNG MƯỜI MỘT" (month 1–12).
export const monthNameVi = (month: number) =>
  `Tháng ${MONTH_WORDS[(month - 1 + 12) % 12]}`;

// 14.11.2026 — ngày dấu chấm theo wireframe C2.
export const dottedDate = (date: Date) => {
  const { year, month, day } = partsOf(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(day)}.${pad(month)}.${year}`;
};

export type MonthGrid = {
  year: number;
  month: number;
  cells: (number | null)[];
};

// Lưới tháng, tuần bắt đầu Thứ Hai; ô trống đầu tháng = null.
export const buildMonthGrid = (date: Date): MonthGrid => {
  const { year, month } = partsOf(date);
  const first = new Date(Date.UTC(year, month - 1, 1));
  const jsDay = first.getUTCDay(); // 0 = CN
  const lead = (jsDay + 6) % 7; // số ô trống trước ngày 1 (T2 = 0)
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: (number | null)[] = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return { year, month, cells };
};

const minus = (date: Date, minutes: number) =>
  new Date(date.getTime() - minutes * 60_000);
const plus = (date: Date, minutes: number) =>
  new Date(date.getTime() + minutes * 60_000);

export type ScheduleTime = {
  icon: "glass" | "rings" | "plate" | "music";
  label: string;
  time: string;
};

// 4 mốc C12, giờ suy từ date: đón khách = tiệc − 1h, làm lễ = giờ tiệc,
// khai tiệc = +30′, giao lưu = +2h.
export const scheduleTimes = (
  date: Date,
  fmtTime: (d: Date) => string,
): ScheduleTime[] => [
  { icon: "glass", label: "Đón khách", time: fmtTime(minus(date, 60)) },
  { icon: "rings", label: "Làm lễ", time: fmtTime(date) },
  { icon: "plate", label: "Khai tiệc", time: fmtTime(plus(date, 30)) },
  { icon: "music", label: "Giao lưu", time: fmtTime(plus(date, 120)) },
];

export const weddingParts = partsOf;
