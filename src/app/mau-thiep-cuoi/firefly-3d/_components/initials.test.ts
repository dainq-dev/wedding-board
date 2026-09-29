import { expect, test } from "bun:test";
import { initials } from "./initials";

test("chữ viết tắt", () => {
  expect(initials("Minh Quân")).toBe("Q");
  expect(initials("Trịnh Đức Hưởng")).toBe("H");
  expect(initials("  thu   hà ")).toBe("H");
  expect(initials("Đức")).toBe("Đ");
  expect(initials("")).toBe("");
});
