import { expect, test } from "bun:test";
import { initials, sealMonogram } from "./initials";

test("initials lấy chữ cái đầu của tên gọi", () => {
  expect(initials("Minh Quân")).toBe("Q");
  expect(initials("Thu Hà")).toBe("H");
  expect(initials("Trịnh Đức Hưởng")).toBe("H");
  expect(initials("  thu   hà ")).toBe("H");
  expect(initials("Đức")).toBe("Đ");
});

test("initials chuỗi rỗng trả về rỗng", () => {
  expect(initials("")).toBe("");
  expect(initials("   ")).toBe("");
});

test("sealMonogram ghép hai chữ cái đầu", () => {
  expect(sealMonogram("Minh Quân", "Thu Hà")).toBe("Q & H");
  expect(sealMonogram("Nguyễn Văn An", "Trần Thị Bình")).toBe("A & B");
});
