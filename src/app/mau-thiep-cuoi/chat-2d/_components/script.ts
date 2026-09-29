import type { WeddingData } from "@/wedding/types";

export type From = "groom" | "bride" | "system";

export type Message =
  | { kind: "day"; label: string }
  | {
      kind: "text";
      from: From;
      text: string;
      typing?: boolean;
      heart?: boolean;
      big?: boolean;
    }
  | { kind: "photos"; from: "bride" | "groom"; start: number; count: number }
  | { kind: "album" }
  | { kind: "invite" }
  | { kind: "event" }
  | { kind: "schedule" }
  | { kind: "location" }
  | { kind: "poll" }
  | { kind: "voice" }
  | { kind: "gift" }
  | { kind: "rsvp" }
  | { kind: "final" };

/** Chia ảnh album thành các tin ảnh 4 / 3 / 4 / 2… để lưới không lặp một kiểu. */
export function photoChunks(from: number, to: number) {
  const sizes = [4, 3, 4, 2];
  const out: { start: number; count: number }[] = [];
  let i = from;
  let k = 0;
  while (i < to) {
    const count = Math.min(sizes[k % sizes.length], to - i);
    out.push({ start: i, count });
    i += count;
    k++;
  }
  return out;
}

/** Toàn bộ kịch bản trò chuyện. Ảnh album = images[3..n-2], images[n-1] dành cho tin cuối. */
export function buildScript(data: WeddingData): Message[] {
  const n = data.images.length;
  const chunks = photoChunks(3, Math.max(3, n - 1));
  const photo = (
    from: "bride" | "groom",
    c?: { start: number; count: number },
  ): Message[] => (c ? [{ kind: "photos", from, ...c }] : []);
  const [first, second, ...rest] = chunks;

  return [
    { kind: "day", label: "12/03/2019" },
    {
      kind: "text",
      from: "groom",
      text: "Chào bạn, mình là bạn của Tuấn. Hôm qua mình ngồi cùng bàn đó.",
    },
    {
      kind: "text",
      from: "bride",
      text: "À nhớ rồi, người gọi nhầm món cho cả bàn.",
      typing: true,
    },
    {
      kind: "text",
      from: "groom",
      text: "Đúng người đó. Cho mình mời bạn ly cà phê để chuộc lỗi nhé?",
    },
    { kind: "text", from: "bride", text: "Để suy nghĩ đã.", typing: true },
    {
      kind: "text",
      from: "bride",
      text: "Suy nghĩ xong rồi. Mai bảy giờ nhé.",
      heart: true,
    },

    { kind: "day", label: "20/10/2020" },
    {
      kind: "text",
      from: "bride",
      text: "Hôm nay là 20/10 đó nha.",
      typing: true,
    },
    { kind: "text", from: "groom", text: "Biết mà. Nhìn ra cửa đi." },
    ...photo("bride", first),
    {
      kind: "text",
      from: "bride",
      text: "Làm người yêu em nha.",
      typing: true,
    },
    { kind: "text", from: "groom", text: "Ừ.", heart: true },

    { kind: "day", label: "02/09/2024" },
    { kind: "text", from: "groom", text: "Em ơi" },
    { kind: "text", from: "groom", text: "Cưới anh nhé?" },
    {
      kind: "text",
      from: "bride",
      text: "Có!",
      typing: true,
      big: true,
      heart: true,
    },
    ...photo("groom", second),

    { kind: "day", label: "Hôm nay" },
    {
      kind: "text",
      from: "system",
      text: `${data.groom.name} và ${data.bride.name} đã ghim một tin nhắn`,
    },
    { kind: "invite" },
    { kind: "event" },
    { kind: "schedule" },
    { kind: "location" },
    { kind: "poll" },
    ...(rest.length
      ? ([
          {
            kind: "text",
            from: "bride",
            text: "Thêm ảnh cưới cho mọi người nè.",
            typing: true,
          },
        ] as Message[])
      : []),
    ...rest.flatMap((c, k) => photo(k % 2 ? "groom" : "bride", c)),
    { kind: "album" },
    { kind: "voice" },
    { kind: "gift" },
    { kind: "rsvp" },
    { kind: "final" },
  ];
}
