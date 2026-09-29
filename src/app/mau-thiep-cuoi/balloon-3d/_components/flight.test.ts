import { expect, test } from "bun:test";
import { altitudeLabel, FLIGHT_KFS, sampleFlight, skyColors } from "./flight";

test("alt đơn điệu tăng, không tụt", () => {
  let prev = -1;
  for (let i = 0; i <= 200; i++) {
    const { alt } = sampleFlight(FLIGHT_KFS, i / 200);
    expect(alt).toBeGreaterThanOrEqual(prev);
    prev = alt;
  }
  expect(sampleFlight(FLIGHT_KFS, 1).alt).toBe(400);
});

test("kẹp ngoài [0,1]", () => {
  expect(sampleFlight(FLIGHT_KFS, -1).alt).toBe(0);
  expect(sampleFlight(FLIGHT_KFS, 5).alt).toBe(400);
  expect(altitudeLabel(-3)).toBe("0 M");
  expect(altitudeLabel(3)).toBe("∞");
});

test("altitudeLabel", () => {
  expect(altitudeLabel(0)).toBe("0 M");
  expect(altitudeLabel(0.9)).toBe("∞");
  expect(altitudeLabel(0.5)).toBe("2.000 M");
  expect(altitudeLabel(0.1)).toBe("300 M");
});

test("skyColors(0.4) là trắng mây", () => {
  const c = skyColors(0.4);
  expect(c.top.getHexString()).toBe("dceffa");
  expect(c.horizon.getHexString()).toBe("ffffff");
});
