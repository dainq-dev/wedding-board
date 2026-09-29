"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Nhạc mặc định cho mọi mẫu. Mẫu có bài riêng thì truyền `src`; file riêng
// không tồn tại / lỗi → tự chuyển sang bài mặc định.
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

export const DEFAULT_MUSIC = "/music-wedding.mp3";

// Nhạc nền: play() phải được gọi trong handler click (autoplay policy).
export function useMusic(src: string = DEFAULT_MUSIC, maxVolume = 0.6) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(maxVolume);
  const [muted, setMuted] = useState(false);
  const fade = useRef(0);

  useEffect(() => {
    const a = new Audio(src);
    a.loop = true;
    a.volume = 0;
    a.onplay = () => setPlaying(true);
    a.onpause = () => setPlaying(false);
    a.onerror = () => {
      if (a.src.endsWith(DEFAULT_MUSIC)) return;
      const resume = a.dataset.wantPlay === "1";
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
      cancelAnimationFrame(fade.current);
      a.pause();
      audio.current = null;
    };
  }, [src]);

  const fadeTo = useCallback((target: number, ms = 1500) => {
    const a = audio.current;
    if (!a) return;
    cancelAnimationFrame(fade.current);
    const from = a.volume;
    const to = clamp01(target);
    const start = performance.now();
    const step = (now: number) => {
      const k = clamp01((now - start) / ms);
      a.volume = clamp01(from + (to - from) * k);
      if (k < 1) fade.current = requestAnimationFrame(step);
    };
    fade.current = requestAnimationFrame(step);
  }, []);

  const play = useCallback(
    async (fadeMs = 1500) => {
      const a = audio.current;
      if (!a) return;
      a.dataset.wantPlay = "1";
      try {
        await a.play();
        fadeTo(muted ? 0 : volume, fadeMs);
      } catch {
        // Autoplay bị chặn → lần bấm sau sẽ phát.
      }
    },
    [fadeTo, muted, volume],
  );

  const pause = useCallback(() => {
    const a = audio.current;
    if (!a) return;
    a.dataset.wantPlay = "0";
    fadeTo(0, 250);
    window.setTimeout(() => {
      if (a.dataset.wantPlay === "0") a.pause();
    }, 260);
  }, [fadeTo]);

  const toggle = useCallback(() => {
    if (playing) pause();
    else play(400);
  }, [pause, play, playing]);

  const changeVolume = useCallback(
    (next: number) => {
      const v = clamp01(next);
      setVolume(v);
      setMuted(v === 0);
      const a = audio.current;
      if (!a) return;
      if (playing) fadeTo(v, 150);
      else a.volume = v;
    },
    [fadeTo, playing],
  );

  const toggleMute = useCallback(() => {
    const next = !muted;
    setMuted(next);
    if (playing) fadeTo(next ? 0 : volume, 180);
  }, [fadeTo, muted, playing, volume]);

  return {
    audio,
    playing,
    play,
    pause,
    toggle,
    fadeTo,
    volume,
    muted,
    changeVolume,
    toggleMute,
  };
}

export type Music = ReturnType<typeof useMusic>;

const BARS = [0, 0.35, 0.15, 0.5] as const;

// Thanh nhạc nổi góc trên phải (góc trên trái = Quay lại, dưới phải = Dùng thử).
// `className` áp lên pill: mẫu truyền bg-/text- riêng thì thay tông mặc định.
export function MusicToggle({
  music,
  className = "",
}: {
  music: Music;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const { playing, muted, volume, toggle, toggleMute, changeVolume } = music;
  const shown = muted ? 0 : volume;
  const tone = [
    /(^|\s)bg-/.test(className) ? "" : "bg-black/45",
    /(^|\s)text-/.test(className) ? "" : "text-white",
  ].join(" ");
  // Popover chỉ lấy class màu của mẫu (bỏ pointer-events… để khi ẩn không bắt click).
  const skin = className
    .split(/\s+/)
    .filter((c) => /^!?(bg|text)-/.test(c))
    .join(" ");

  return (
    <div
      className={`fixed top-4 right-4 z-40 flex h-12 items-center gap-1 rounded-full border border-white/20 p-1 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl ${tone} ${className}`}
    >
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Tạm dừng nhạc" : "Phát nhạc"}
        aria-pressed={playing}
        className="flex h-10 items-center gap-2 rounded-full pr-3 pl-1 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-current"
      >
        {/* Đĩa than: xoay khi phát, dừng tại chỗ khi tạm dừng. */}
        <span
          aria-hidden="true"
          className={`relative flex size-8 items-center justify-center rounded-full bg-[repeating-radial-gradient(circle,#1a1a1a_0_1.5px,#2b2b2b_1.5px_3px)] animate-[spin_4s_linear_infinite] motion-reduce:animate-none ${playing ? "" : "[animation-play-state:paused]"}`}
        >
          <span className="size-2.5 rounded-full bg-current ring-2 ring-black/60" />
          <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_30deg,transparent_0_15%,rgba(255,255,255,0.25)_20%,transparent_30%)]" />
        </span>
        <span aria-hidden="true" className="flex h-4 items-end gap-[3px]">
          {BARS.map((delay) => (
            <span
              key={delay}
              className={`w-[3px] origin-bottom rounded-full bg-current ${playing ? "h-4 animate-kit-music-eq motion-reduce:animate-none" : "h-1 opacity-60"}`}
              style={playing ? { animationDelay: `-${delay}s` } : undefined}
            />
          ))}
        </span>
      </button>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Ẩn âm lượng" : "Chỉnh âm lượng"}
        aria-expanded={open}
        className="flex size-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-current"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`size-4 fill-none stroke-current stroke-2 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {/* Popover âm lượng thả xuống — không kéo dài pill (tránh đè nút Quay lại ở 360px). */}
      <div
        className={`absolute top-[calc(100%+8px)] right-0 flex items-center gap-1 rounded-full border border-white/20 p-1 pr-4 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-[opacity,transform] duration-200 ${tone} ${skin} ${open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          onClick={toggleMute}
          tabIndex={open ? 0 : -1}
          aria-label={muted ? "Bật tiếng" : "Tắt tiếng"}
          className="flex size-9 shrink-0 items-center justify-center rounded-full hover:bg-white/10"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="size-4 fill-none stroke-current stroke-[1.8]"
          >
            <path d="M11 5 6 9H3v6h3l5 4V5Z" />
            {shown === 0 ? (
              <path d="m16 9 6 6m0-6-6 6" />
            ) : (
              <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a9 9 0 0 1 0 12" />
            )}
          </svg>
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={shown}
          tabIndex={open ? 0 : -1}
          onChange={(e) => changeVolume(Number(e.target.value))}
          aria-label="Âm lượng"
          className="h-1 w-24 cursor-pointer accent-current"
        />
      </div>
    </div>
  );
}
