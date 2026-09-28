import { expect, test } from "bun:test";
import { parseMapsUrl } from "./parse-maps-url";

test("ưu tiên toạ độ ghim !3d!4d và decode tên", () => {
  const url =
    "https://www.google.com/maps/place/Ph%C3%A2n+hi%E1%BB%87u+GTVT/@10.8390529,106.7824432,15z/data=!4m6!3m5!1s0x0:0x0!8m2!3d10.845696!4d106.794172!16s";
  expect(parseMapsUrl(url)).toEqual({
    lat: 10.845696,
    lng: 106.794172,
    name: "Phân hiệu GTVT",
  });
});

test("fallback về @lat,lng", () => {
  expect(parseMapsUrl("https://www.google.com/maps/@10.5,-106.25,15z")).toEqual(
    {
      lat: 10.5,
      lng: -106.25,
      name: undefined,
    },
  );
});

test("link rút gọn trả null", () => {
  expect(parseMapsUrl("https://maps.app.goo.gl/abc123")).toBeNull();
});
