import type { WeddingData } from "@/wedding/types";

// Ngày mẫu khi WeddingData chưa có `date` (⚠️ trường đang chờ chốt).
export const FALLBACK_DATE = "2026-11-14T18:00:00+07:00";

export const weddingDate = (data: WeddingData) =>
  new Date(data.date ?? FALLBACK_DATE);

const fmt = (opts: Intl.DateTimeFormatOptions) => (d: Date) =>
  new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    ...opts,
  }).format(d);

export const formatWeekday = fmt({ weekday: "long" });
export const formatDate = fmt({
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
export const formatTime = fmt({
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});
export const formatMonth = fmt({ month: "long", year: "numeric" });
