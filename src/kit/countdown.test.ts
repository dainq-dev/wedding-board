import { expect, test } from "bun:test";
import { remaining } from "./countdown";

test("tách ngày giờ phút giây", () => {
  const now = 0;
  const target = new Date((2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1000);
  expect(remaining(target, now)).toEqual({
    days: 2,
    hours: 3,
    minutes: 4,
    seconds: 5,
    done: false,
  });
});

test("đã qua ngày thì done", () => {
  expect(remaining(new Date(0), 1000).done).toBe(true);
});
