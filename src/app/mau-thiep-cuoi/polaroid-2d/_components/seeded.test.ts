import { describe, expect, test } from "bun:test";
import { nickname, rand, rot, scatter } from "./seeded";

describe("rot", () => {
  test("luôn trong [-8, 8]", () => {
    for (let i = 0; i < 200; i++) {
      const r = rot(i);
      expect(r).toBeGreaterThanOrEqual(-8);
      expect(r).toBeLessThanOrEqual(8);
    }
  });
  test("deterministic: cùng input cùng output", () => {
    for (let i = 0; i < 50; i++) expect(rot(i)).toBe(rot(i));
    expect(rot(3)).toBe(rot(3));
    expect(rand(7, 21)).toBe(rand(7, 21));
  });
  test("không suy biến một giá trị", () => {
    const seen = new Set<number>();
    for (let i = 0; i < 10; i++) seen.add(Math.round(rot(i)));
    expect(seen.size).toBeGreaterThan(3);
  });
});

describe("scatter", () => {
  test("nằm trong bounds (480×660, ảnh 192×260)", () => {
    for (let i = 0; i < 100; i++) {
      const p = scatter(i, 480, 660, 192, 260);
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.x + 192).toBeLessThanOrEqual(480);
      expect(p.y + 260).toBeLessThanOrEqual(660);
    }
  });
  test("đơn vị % (100×100, ảnh 40×40) không tràn mép", () => {
    for (let i = 0; i < 100; i++) {
      const p = scatter(i, 100, 100, 40, 40);
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.x + 40).toBeLessThanOrEqual(100);
      expect(p.y + 40).toBeLessThanOrEqual(100);
    }
  });
  test("vùng nhỏ hơn ảnh → kẹp về 0, không âm", () => {
    const p = scatter(1, 100, 100, 120, 120);
    expect(p.x).toBeGreaterThanOrEqual(0);
    expect(p.y).toBeGreaterThanOrEqual(0);
    expect(p.x).toBeLessThanOrEqual(4);
    expect(p.y).toBeLessThanOrEqual(4);
  });
});

describe("nickname", () => {
  test("lấy từ cuối", () => {
    expect(nickname("Trịnh Đức Hưởng")).toBe("Hưởng");
    expect(nickname("Nguyễn Thu Hà")).toBe("Hà");
    expect(nickname("Minh Quân")).toBe("Quân");
    expect(nickname("Hà")).toBe("Hà");
  });
  test("chịu khoảng trắng thừa", () => {
    expect(nickname("  Lê Thị  Hồng   Nhung  ")).toBe("Nhung");
  });
});
