"use client";

import { useEffect, useState } from "react";
import { CanvasTexture, SRGBColorSpace, type Texture } from "three";

// Load ảnh (kể cả blob: URL) và thu về tối đa `max` px để không tràn VRAM trên iOS.
export function useSafeTexture(url: string | undefined, max = 1024) {
  const [tex, setTex] = useState<Texture | null>(null);
  useEffect(() => {
    if (!url) return;
    let alive = true;
    let made: Texture | null = null;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!alive) return;
      // SVG không khai báo width/height → natural = 0; mặc định khổ 3:4 thay vì canvas 1×1.
      const w = img.naturalWidth || 600;
      const h = img.naturalHeight || 800;
      const s = Math.min(1, max / Math.max(w, h));
      const c = document.createElement("canvas");
      c.width = Math.round(w * s);
      c.height = Math.round(h * s);
      c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
      made = new CanvasTexture(c);
      made.colorSpace = SRGBColorSpace;
      setTex(made);
    };
    img.src = url;
    return () => {
      alive = false;
      made?.dispose();
    };
  }, [url, max]);
  return tex;
}
