export type Person = { name: string; address: string; birthYear: number };

export type WeddingData = {
  groom: Person;
  bride: Person;
  venue: { lat: number; lng: number; name?: string };
  date?: string; // ISO; ⚠️ chưa có trong form "Dùng thử" → dùng FALLBACK_DATE của @/kit/dates
  images: string[]; // /public path hoặc blob: URL từ "Dùng thử"
  videos: string[];
};

export type TemplateMeta = {
  slug: string; // = tên thư mục trong app/mau-thiep-cuoi/
  name: string;
  description: string;
  thumbnail: string;
  tech: "2d" | "3d";
  styles: string[];
  colors: string[];
  tags: string[];
  createdAt: string;
  media: { images: number; videos: number };
};
