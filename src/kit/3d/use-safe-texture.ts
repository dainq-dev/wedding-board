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
      const s = Math.min(
        1,
        max / Math.max(img.naturalWidth, img.naturalHeight),
      );
      const c = document.createElement("canvas");
      c.width = Math.round(img.naturalWidth * s) || 1;
      c.height = Math.round(img.naturalHeight * s) || 1;
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
