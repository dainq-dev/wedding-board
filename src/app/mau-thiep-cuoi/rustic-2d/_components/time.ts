const TZ = "Asia/Ho_Chi_Minh";

/** Ngày / tháng / năm theo giờ Việt Nam. */
export function vnParts(d: Date) {
  const p = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(d);
  const get = (k: string) => Number(p.find((x) => x.type === k)?.value);
  return { day: get("day"), month: get("month"), year: get("year") };
}

/** Lưới tháng bắt đầu Thứ Hai; ô trống là null. */
export function monthGrid(d: Date): (number | null)[] {
  const { month, year } = vnParts(d);
  const lead = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: (number | null)[] = Array.from({ length: lead }, () => null);
  for (let i = 1; i <= days; i++) cells.push(i);
  while (cells.length % 7) cells.push(null);
  return cells;
}

/** Lịch trình quanh giờ tiệc: −60′, 0, +30′, +120′. */
export const SCHEDULE = [
  [-60, "Đón khách", "Mời trà, chụp ảnh cùng cô dâu chú rể"],
  [0, "Làm lễ", "Hai gia đình ra mắt, trao nhẫn"],
  [30, "Khai tiệc", "Cơm quê, rượu nếp, chuyện trò"],
  [120, "Giao lưu", "Hát cùng nhau dưới dây đèn"],
] as const;
