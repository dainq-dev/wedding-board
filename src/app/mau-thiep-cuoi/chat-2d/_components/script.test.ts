import { expect, test } from "bun:test";
import { sampleData } from "@/wedding/sample-data";
import { buildScript, photoChunks } from "./script";

const shown = (n: number) => {
  const data = {
    ...sampleData,
    images: Array.from({ length: n }, (_, i) => `/${i}.jpg`),
  };
  const script = buildScript(data);
  const idx = script.flatMap((m) =>
    m.kind === "photos"
      ? Array.from({ length: m.count }, (_, j) => m.start + j)
      : [],
  );
  return { script, idx };
};

test("photoChunks phủ kín khoảng, mỗi tin 1–4 ảnh", () => {
  const c = photoChunks(3, 19);
  expect(c.reduce((s, x) => s + x.count, 0)).toBe(16);
  expect(c.every((x) => x.count >= 1 && x.count <= 4)).toBe(true);
});

test("20 ảnh: album chứa đủ images[3..18], không trùng", () => {
  const { idx } = shown(20);
  expect(idx).toEqual(Array.from({ length: 16 }, (_, i) => i + 3));
});

test("8 ảnh (tối thiểu Dùng thử): đủ images[3..6]", () => {
  expect(shown(8).idx).toEqual([3, 4, 5, 6]);
});

test("kịch bản có đủ các thẻ bắt buộc", () => {
  const kinds = new Set(shown(20).script.map((m) => m.kind));
  for (const k of [
    "invite",
    "event",
    "location",
    "gift",
    "rsvp",
    "final",
    "album",
  ])
    expect(kinds.has(k as never)).toBe(true);
});
