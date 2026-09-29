import type { WeddingData } from "./types";

// Bộ ảnh cưới mẫu chuẩn: public/wedding-images/0..19.jpeg (spec: mọi mẫu PHẢI
// hiển thị đủ ≥ 20 ảnh này). Thêm ảnh thì tăng SAMPLE_IMAGE_COUNT.
export const SAMPLE_IMAGE_COUNT = 20;

export const sampleData: WeddingData = {
  groom: {
    name: "Minh Quân",
    address: "Quận 1, TP. Hồ Chí Minh",
    birthYear: 1996,
  },
  bride: { name: "Thu Hà", address: "Ba Đình, Hà Nội", birthYear: 1998 },
  venue: { lat: 10.776889, lng: 106.700806, name: "Nhà hàng Tiệc cưới Mẫu" },
  images: Array.from(
    { length: SAMPLE_IMAGE_COUNT },
    (_, i) => `/wedding-images/${i}.jpeg`,
  ),
  date: "2026-11-14T18:00:00+07:00",
  videos: [],
};
