import { parseMapsUrl } from "../parse-maps-url";
import type { Draft, FieldErrors, Who } from "./type";

export const MIN_YEAR = 1940;
export const maxBirthYear = (now = new Date()) => now.getFullYear() - 18;

type Counts = { images: number; videos: number };

/** Lỗi theo từng trường; object rỗng = hợp lệ. */
export function validateDraft(
  draft: Draft,
  counts: Counts,
  need: Counts,
  maxYear = maxBirthYear(),
): FieldErrors {
  const e: FieldErrors = {};
  for (const who of ["groom", "bride"] as Who[]) {
    const p = draft[who];
    if (!p.name.trim()) e[`${who}.name`] = "Nhập họ tên";
    if (!p.address.trim()) e[`${who}.address`] = "Nhập quê quán / địa chỉ";
    const y = Number(p.birthYear);
    if (!p.birthYear.trim()) e[`${who}.birthYear`] = "Nhập năm sinh";
    else if (!Number.isInteger(y) || y < MIN_YEAR || y > maxYear)
      e[`${who}.birthYear`] = `Năm sinh từ ${MIN_YEAR} đến ${maxYear}`;
  }
  if (counts.images < need.images)
    e.images = `Cần thêm ${need.images - counts.images} ảnh (tối thiểu ${need.images})`;
  if (counts.videos < need.videos)
    e.videos = `Cần thêm ${need.videos - counts.videos} video (tối thiểu ${need.videos})`;
  if (!draft.mapsUrl.trim()) e.mapsUrl = "Dán link Google Maps của nhà hàng";
  else if (!parseMapsUrl(draft.mapsUrl))
    e.mapsUrl =
      "Link chưa có toạ độ. Link rút gọn maps.app.goo.gl chưa hỗ trợ, hãy mở link trên máy tính rồi copy URL trên thanh địa chỉ.";
  return e;
}
