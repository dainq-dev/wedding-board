"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import type { Music } from "@/kit/music";
import { clipReveal } from "@/kit/presets";
import { onceEnter } from "../reveal";
import { Clapper } from "../svg/clapper";
import { t } from "../tokens";

// C9 · Màn chiếu video. Không tự phát; phát → duck nhạc nền về 0.1 (spec §3).
export function Trailer({
  src,
  poster,
  music,
}: {
  src: string;
  poster?: string;
  music: Music;
}) {
  const frame = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = frame.current;
    if (!el) return;
    gsap.set(el, { clipPath: "inset(100% 0 0 0)" });
    onceEnter(el, () => clipReveal(el));
  });

  const restore = () => music.fadeTo(music.muted ? 0 : music.volume, 1000);

  return (
    <section data-lb="16:9" className="flex min-h-[120svh] items-center">
      <div className="mx-auto w-[min(90vw,960px)]">
        <p className={`${t.scene} flex items-center gap-2`}>
          <Clapper /> Cảnh 04 · Trailer
        </p>
        <div ref={frame} className={`mt-4 p-1 ${t.frame}`}>
          <video
            controls
            playsInline
            preload="metadata"
            poster={poster}
            className="aspect-video w-full bg-black"
            onPlay={() => music.fadeTo(0.1, 1000)}
            onPause={restore}
            onEnded={restore}
          >
            <source src={src} />
            <track kind="captions" />
          </video>
        </div>
        <p className={`${t.label} mt-3 text-center`}>Chạm để xem trailer</p>
      </div>
    </section>
  );
}
