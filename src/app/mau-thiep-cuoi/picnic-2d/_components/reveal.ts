// Trigger "chạy một lần khi section cuộn tới" — dùng trong mọi section của mẫu.
import { ScrollTrigger } from "@/kit/gsap";

export function onceEnter(
  trigger: Element | null,
  run: () => void,
  start = "top 82%",
): void {
  if (!trigger) return;
  ScrollTrigger.create({ trigger, start, once: true, onEnter: run });
}
