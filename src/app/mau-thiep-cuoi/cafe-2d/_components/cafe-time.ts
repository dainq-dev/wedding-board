// Giờ Việt Nam cố định (thiệp chỉ phục vụ đám cưới ở VN), không phụ thuộc máy khách.
const TZ = "Asia/Ho_Chi_Minh";

function parts(d: Date) {
  const p = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(d);
  const get = (t: string) => Number(p.find((x) => x.type === t)?.value);
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Số order = ddMM của ngày cưới, vd 14/11 → "1411". */
export function orderNo(date: Date) {
  const { day, month } = parts(date);
  return `${pad(day)}${pad(month)}`;
}

/** 4 mốc lịch trình quanh giờ tiệc: −60′, 0, +30′, +120′ (HH:mm). */
export function scheduleFrom(date: Date) {
  return (
    [
      [-60, "Đón khách"],
      [0, "Làm lễ"],
      [30, "Khai tiệc"],
      [120, "Giao lưu"],
    ] as const
  ).map(([min, label]) => {
    const { hour, minute } = parts(new Date(date.getTime() + min * 60_000));
    return { time: `${pad(hour)}:${pad(minute)}`, label };
  });
}

/** Lưới tháng (tuần bắt đầu Thứ Hai); ô trống là null. */
export function monthCells(date: Date): (number | null)[] {
  const { year, month } = parts(date);
  const first = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const lead = (first + 6) % 7;
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: (number | null)[] = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  return cells;
}

export const dayParts = parts;
