import { ScrollTrigger } from "@/kit/gsap";

// Chạy `run` một lần khi phần tử cuộn tới. Gọi trong useGSAP để tự kill khi unmount.
export function onceEnter(
  trigger: Element | null,
  run: () => void,
  start = "top 80%",
) {
  if (trigger)
    ScrollTrigger.create({ trigger, start, once: true, onEnter: run });
}
