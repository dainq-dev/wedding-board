import { gsap } from "@/kit/gsap";

const MASK = "linear-gradient(100deg, #000 42%, transparent 58%)";

/** "Mài lộ vàng": mask gradient quét từ trái sang phải để lộ phần tử (chạy một lần). */
export function grind(targets: gsap.TweenTarget, vars: gsap.TweenVars = {}) {
  gsap.set(targets, {
    maskImage: MASK,
    WebkitMaskImage: MASK,
    maskSize: "300% 100%",
    WebkitMaskSize: "300% 100%",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "100% 0",
    WebkitMaskPosition: "100% 0",
  });
  return gsap.to(targets, {
    maskPosition: "0% 0",
    WebkitMaskPosition: "0% 0",
    duration: 1.3,
    ease: "power2.inOut",
    ...vars,
  });
}

/** Ánh vàng quét qua chữ gradient (background-position), một lần. */
export function shine(targets: gsap.TweenTarget, vars: gsap.TweenVars = {}) {
  return gsap.fromTo(
    targets,
    { backgroundPosition: "100% 0" },
    { backgroundPosition: "0% 0", duration: 1.4, ease: "power3.out", ...vars },
  );
}
