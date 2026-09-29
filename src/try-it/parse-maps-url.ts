export type Venue = { lat: number; lng: number; name?: string };

// Ưu tiên !3d!4d (ghim chính xác), fallback @lat,lng (tâm khung nhìn).
// Link rút gọn maps.app.goo.gl không chứa toạ độ → null.
export function parseMapsUrl(url: string): Venue | null {
  const m =
    url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/) ??
    url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (!m) return null;
  const place = url.match(/\/place\/([^/]+)/)?.[1];
  return {
    lat: Number(m[1]),
    lng: Number(m[2]),
    name: place ? decodeURIComponent(place.replace(/\+/g, " ")) : undefined,
  };
}

export const mapEmbedSrc = ({ lat, lng }: Venue) =>
  `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
