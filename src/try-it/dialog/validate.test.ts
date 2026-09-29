import { expect, test } from "bun:test";
import type { Draft } from "./type";
import { isMediaFile, validateDraft } from "./validate";

const person = { name: "An", address: "Huế", birthYear: "1995" };
const ok: Draft = {
  groom: person,
  bride: person,
  mapsUrl: "https://www.google.com/maps/place/X/@16.46,107.59,17z",
  date: "",
};
const need = { images: 6, videos: 0 };

test("đủ thông tin và đủ số ảnh tối thiểu thì hợp lệ", () => {
  expect(validateDraft(ok, { images: 6, videos: 0 }, need, 2008)).toEqual({});
});

test("nhiều ảnh hơn tối thiểu vẫn hợp lệ (không giới hạn trên)", () => {
  expect(validateDraft(ok, { images: 40, videos: 0 }, need, 2008)).toEqual({});
});

test("thiếu ảnh báo đúng số còn thiếu", () => {
  expect(validateDraft(ok, { images: 2, videos: 0 }, need, 2008).images).toBe(
    "Cần thêm 4 ảnh (tối thiểu 6)",
  );
});

test("báo lỗi theo từng trường người", () => {
  const e = validateDraft(
    { ...ok, bride: { name: " ", address: "", birthYear: "1900" } },
    { images: 6, videos: 0 },
    need,
    2008,
  );
  expect(Object.keys(e).sort()).toEqual([
    "bride.address",
    "bride.birthYear",
    "bride.name",
  ]);
});

test("link Maps rỗng / không có toạ độ", () => {
  const c = { images: 6, videos: 0 };
  expect(
    validateDraft({ ...ok, mapsUrl: "" }, c, need, 2008).mapsUrl,
  ).toBeDefined();
  expect(
    validateDraft(
      { ...ok, mapsUrl: "https://maps.app.goo.gl/abc" },
      c,
      need,
      2008,
    ).mapsUrl,
  ).toContain("maps.app.goo.gl");
});

test("isMediaFile: theo MIME, hoặc theo đuôi khi MIME rỗng (HEIC từ thư viện)", () => {
  expect(isMediaFile({ name: "a.jpg", type: "image/jpeg" }, "images")).toBe(
    true,
  );
  expect(isMediaFile({ name: "IMG_1.HEIC", type: "" }, "images")).toBe(true);
  expect(isMediaFile({ name: "clip.mov", type: "" }, "videos")).toBe(true);
  expect(
    isMediaFile({ name: "clip.mov", type: "video/quicktime" }, "images"),
  ).toBe(false);
  expect(isMediaFile({ name: "note.pdf", type: "" }, "images")).toBe(false);
});
