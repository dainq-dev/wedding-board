"use client";

import { useEffect, useRef, useState } from "react";

// Nhạc mặc định cho mọi mẫu. Mẫu có bài riêng thì truyền `src`; file riêng
// không tồn tại / lỗi → tự chuyển sang bài mặc định.
export const DEFAULT_MUSIC = "/music-wedding.mp3";

// Nhạc nền: play() phải được gọi trong handler click (autoplay policy).
export function useMusic(src: string = DEFAULT_MUSIC, maxVolume = 0.6) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const a = new Audio(src);
    a.loop = true;
    a.volume = 0;
    a.onplay = () => setPlaying(true);
    a.onpause = () => setPlaying(false);
    a.onerror = () => {
      if (a.src.endsWith(DEFAULT_MUSIC)) return;
      const resume = !a.paused || a.dataset.wantPlay === "1";
      a.src = DEFAULT_MUSIC;
      if (resume) a.play().catch(() => {});
    };
    audio.current = a;
    let hiddenPaused = false;
    const onVis = () => {
      if (document.hidden && !a.paused) {
        hiddenPaused = true;
        a.pause();
      } else if (!document.hidden && hiddenPaused) {
        hiddenPaused = false;
        a.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      a.pause();
      audio.current = null;
    };
  }, [src]);

  const fadeTo = (volume: number, ms = 1500) => {
    const a = audio.current;
    if (!a) return;
    const from = a.volume;
    const start = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / ms);
      a.volume = from + (volume - from) * k;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const play = (fadeMs = 1500) => {
    const a = audio.current;
    if (!a) return;
    a.dataset.wantPlay = "1"; // để onerror phát tiếp bằng bài mặc định
    a.play().catch(() => {});
    fadeTo(maxVolume, fadeMs);
  };
  const pause = () => {
    const a = audio.current;
    if (!a) return;
    a.dataset.wantPlay = "0";
    a.pause();
  };
  const toggle = () => (playing ? pause() : play(400));

  return { audio, playing, play, pause, toggle, fadeTo };
}

export type Music = ReturnType<typeof useMusic>;

// Nút nổi góc trên phải (góc trên trái = Quay lại, dưới phải = Dùng thử).
export function MusicToggle({
  music,
  className = "",
}: {
  music: Music;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={music.toggle}
      aria-label={music.playing ? "Tắt nhạc" : "Bật nhạc"}
      aria-pressed={music.playing}
      className={`fixed top-4 right-4 z-40 flex size-11 items-center justify-center rounded-full bg-white/90 text-lg shadow ${className}`}
    >
      {music.playing ? "♪" : "♪̸"}
    </button>
  );
}
