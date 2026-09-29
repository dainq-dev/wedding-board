import { formatDate, formatTime } from "@/kit/dates";

// Giờ tiệc mặc định khi dữ liệu thiếu giờ cụ thể (spec C12 fallback 18:30).
export const DEFAULT_DINNER_MINUTES = 18 * 60 + 30;

export type BeachSlotKey = "welcome" | "ceremony" | "dinner" | "party";

export type BeachSlot = {
  key: BeachSlotKey;
  minutes: number;
  time: string;
};

const OFFSETS: readonly { key: BeachSlotKey; minutes: number }[] = [
  { key: "welcome", minutes: -120 },
  { key: "ceremony", minutes: -60 },
  { key: "dinner", minutes: 0 },
  { key: "party", minutes: 90 },
];

// 4 mốc tính từ giờ tiệc trong `date`, xử lý đúng khi vượt nửa đêm.
export function beachSchedule(date: Date): BeachSlot[] {
  const base = date.getTime();
  return OFFSETS.map((slot) => ({
    key: slot.key,
    minutes: slot.minutes,
    time: formatTime(new Date(base + slot.minutes * 60_000)),
  }));
}

// Ngày/tháng/năm theo giờ Việt Nam (tránh lệch ngày do múi giờ máy).
function vnYmd(date: Date): { y: number; m: number; d: number } {
  const [d, m, y] = formatDate(date).split("/").map(Number);
  return { y, m, d };
}

// Lưới lịch tháng, tuần bắt đầu Thứ Hai. Ô trống = "".
export function monthCells(date: Date): (number | "")[] {
  const { y, m } = vnYmd(date);
  const start = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells: (number | "")[] = Array.from({ length: start }, () => "");
  for (let day = 1; day <= days; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push("");
  return cells;
}

export function vnDay(date: Date): string {
  return String(vnYmd(date).d).padStart(2, "0");
}

export function vnMonthYear(date: Date): { month: string; year: string } {
  const { m, y } = vnYmd(date);
  return { month: String(m).padStart(2, "0"), year: String(y) };
}
