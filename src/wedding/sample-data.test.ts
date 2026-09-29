import { expect, test } from "bun:test";
import { sampleData } from "./sample-data";

test("sampleData uses the bundled real wedding images", () => {
  const images = sampleData.images;

  expect(images).toHaveLength(20);
  expect(images.every((src) => /^\/wedding-images\/\d+\.jpeg$/.test(src))).toBe(
    true,
  );
  expect(new Set(images).size).toBe(images.length);
});
