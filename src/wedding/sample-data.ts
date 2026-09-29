import type { WeddingData } from "./types";

export const sampleData: WeddingData = {
  groom: {
    name: "Minh Quân",
    address: "Quận 1, TP. Hồ Chí Minh",
    birthYear: 1996,
  },
  bride: { name: "Thu Hà", address: "Ba Đình, Hà Nội", birthYear: 1998 },
  venue: { lat: 10.776889, lng: 106.700806, name: "Nhà hàng Tiệc cưới Mẫu" },
  images: Array.from({ length: 24 }, (_, i) => i + 1).map(
    (i) => `/sample/photo-${i}.svg`,
  ),
  date: "2026-11-14T18:00:00+07:00",
  videos: [],
};
