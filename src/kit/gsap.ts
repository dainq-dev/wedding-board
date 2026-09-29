"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { TextPlugin } from "gsap/TextPlugin";

// Đăng ký một lần. Mọi mẫu import gsap từ đây, không import "gsap" trực tiếp.
gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  ScrollSmoother,
  SplitText,
  DrawSVGPlugin,
  Flip,
  MotionPathPlugin,
  Draggable,
  TextPlugin,
);

export {
  Draggable,
  DrawSVGPlugin,
  Flip,
  gsap,
  MotionPathPlugin,
  ScrollSmoother,
  ScrollTrigger,
  SplitText,
  useGSAP,
};
