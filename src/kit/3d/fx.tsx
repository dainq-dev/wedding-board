"use client";

import {
  Bloom,
  EffectComposer,
  Noise,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";

// Hậu kỳ chuẩn cho mẫu 3D (visual-quality §3.3): bloom chọn lọc (ngưỡng cao để
// chỉ nguồn sáng mới toả), vignette, film grain nhẹ, tone mapping.
// Ảnh cưới vẽ ở PhotoLayer (HUD, sau hậu kỳ) nên không bị tone map → được chọn
// ACES cho cảnh để màu trời / ánh sáng có độ tương phản điện ảnh.
const TONE = {
  aces: ToneMappingMode.ACES_FILMIC,
  agx: ToneMappingMode.AGX,
  neutral: ToneMappingMode.NEUTRAL,
} as const;

export function CinematicFX({
  mobile,
  bloom = 0.7,
  threshold = 0.82,
  vignette = 0.45,
  grain = 0.035,
  tone = "neutral",
}: {
  mobile: boolean;
  bloom?: number;
  threshold?: number;
  vignette?: number;
  grain?: number;
  tone?: keyof typeof TONE;
}) {
  return (
    <EffectComposer multisampling={mobile ? 0 : 4}>
      <Bloom
        mipmapBlur
        intensity={mobile ? bloom * 0.75 : bloom}
        luminanceThreshold={threshold}
        luminanceSmoothing={0.18}
      />
      <Vignette offset={0.28} darkness={vignette} />
      <Noise
        premultiply
        blendFunction={BlendFunction.SOFT_LIGHT}
        opacity={grain}
      />
      <ToneMapping mode={TONE[tone]} />
    </EffectComposer>
  );
}
