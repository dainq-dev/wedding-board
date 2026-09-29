const stamp = (d: Date) =>
  d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
const esc = (s: string) =>
  s.replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");

/** File .ics tạo phía client (không gọi mạng): tiệc cưới kéo dài 3 giờ. */
export function buildIcs(date: Date, title: string, location: string) {
  const end = new Date(date.getTime() + 3 * 3_600_000);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ke Thiep//chat-2d//VI",
    "BEGIN:VEVENT",
    `UID:${stamp(date)}-chat-2d@kethiep`,
    `DTSTAMP:${stamp(date)}`,
    `DTSTART:${stamp(date)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(title)}`,
    `LOCATION:${esc(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/** 7 ngày (T2 → CN) của tuần chứa ngày cưới, theo giờ Việt Nam. */
export function weekOf(date: Date) {
  const vn = new Date(date.getTime() + 7 * 3_600_000); // dịch sang "UTC giả" = giờ VN
  const dow = (vn.getUTCDay() + 6) % 7;
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(vn.getTime() + (i - dow) * 86_400_000);
    return { day: d.getUTCDate(), today: i === dow };
  });
}
