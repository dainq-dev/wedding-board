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
  const [levels, setLevels] = useState<number[]>(() =>
    Array.from({ length: 18 }, () => 0.15),
  );

  // Web Audio
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const sourceNode = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrame = useRef<number | null>(null);

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

      if (resume) {
        a.play().catch(() => {});
      }
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

      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }

      a.pause();

      if (audioContext.current) {
        audioContext.current.close().catch(() => {});
      }

      audioContext.current = null;
      analyser.current = null;
      sourceNode.current = null;
      audio.current = null;
    };
  }, [src]);

  /* ------------------------------------------------------------------------ */
  /* Fade                                                                     */
  /* ------------------------------------------------------------------------ */

  const fade = useRef(0);

  const fadeTo = useCallback((targetVolume: number, ms = 1500) => {
    const a = audio.current;

    if (!a) return;

    cancelAnimationFrame(fade.current);

    const from = a.volume;
    const to = clamp01(targetVolume);
    const start = performance.now();

    const step = (now: number) => {
      const k = clamp01((now - start) / ms);

      a.volume = clamp01(from + (to - from) * k);

      if (k < 1) {
        fade.current = requestAnimationFrame(step);
      }
    };

    fade.current = requestAnimationFrame(step);
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Web Audio Visualizer                                                     */
  /* ------------------------------------------------------------------------ */

  const setupAnalyser = useCallback(() => {
    const a = audio.current;

    if (!a || sourceNode.current) return;

    try {
      const AudioContextClass =
        window.AudioContext ||
        // @ts-expect-error Safari
        window.webkitAudioContext;

      if (!AudioContextClass) return;

      const context = new AudioContextClass();

      const analyserNode = context.createAnalyser();

      analyserNode.fftSize = 128;
      analyserNode.smoothingTimeConstant = 0.82;

      const source = context.createMediaElementSource(a);

      source.connect(analyserNode);
      analyserNode.connect(context.destination);

      audioContext.current = context;
      analyser.current = analyserNode;
      sourceNode.current = source;
    } catch {
      // Web Audio không khả dụng → music vẫn hoạt động bình thường.
    }
  }, []);

  const startVisualizer = useCallback(() => {
    const analyserNode = analyser.current;

    if (!analyserNode) return;

    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }

    const data = new Uint8Array(analyserNode.frequencyBinCount);

    const update = () => {
      analyserNode.getByteFrequencyData(data);

      const barCount = 18;
      const nextLevels: number[] = [];

      for (let i = 0; i < barCount; i++) {
        const start = Math.floor((i / barCount) * data.length);
        const end = Math.max(
          start + 1,
          Math.floor(((i + 1) / barCount) * data.length),
        );

        let sum = 0;

        for (let j = start; j < end; j++) {
          sum += data[j];
        }

        const average = sum / (end - start);

        // Boost nhẹ để visualizer có chuyển động rõ hơn
        const normalized = clamp01((average / 255) * 1.45);

        nextLevels.push(normalized);
      }

      setLevels(nextLevels);

      animationFrame.current = requestAnimationFrame(update);
    };

    animationFrame.current = requestAnimationFrame(update);
  }, []);

  const stopVisualizer = useCallback(() => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }

    // Không reset ngay về 0 để animation fade-out tự nhiên
    setLevels((current) => current.map((value) => value * 0.65));
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Play / Pause                                                             */
  /* ------------------------------------------------------------------------ */

  const play = useCallback(
    async (fadeMs = 1500) => {
      const a = audio.current;

      if (!a) return;

      a.dataset.wantPlay = "1";

      setupAnalyser();

      if (audioContext.current?.state === "suspended") {
        await audioContext.current.resume().catch(() => {});
      }

      try {
        await a.play();

        fadeTo(muted ? 0 : volume, fadeMs);

        startVisualizer();
      } catch {
        // Browser autoplay policy có thể chặn play().
        // Lần click tiếp theo sẽ play bình thường.
      }
    },
    [
      fadeTo,
      muted,
      setupAnalyser,
      startVisualizer,
      volume,
    ],
  );

  const pause = useCallback(() => {
    const a = audio.current;

    if (!a) return;

    a.dataset.wantPlay = "0";

    fadeTo(0, 250);

    window.setTimeout(() => {
      if (a.dataset.wantPlay === "0") {
        a.pause();
      }
    }, 260);

    stopVisualizer();
  }, [fadeTo, stopVisualizer]);

  const toggle = useCallback(() => {
    if (playing) {
      pause();
    } else {
      play(400);
    }
  }, [pause, play, playing]);

  /* ------------------------------------------------------------------------ */
  /* Volume                                                                   */
  /* ------------------------------------------------------------------------ */

  const changeVolume = useCallback(
    (nextVolume: number) => {
      const a = audio.current;
      const next = clamp01(nextVolume);

      setVolume(next);

      if (next > 0) {
        setMuted(false);
      }

      if (!a) return;

      if (playing) {
        fadeTo(next, 180);
      } else {
        a.volume = next;
      }
    },
    [fadeTo, playing],
  );

  const toggleMute = useCallback(() => {
    const a = audio.current;

    if (!a) return;

    if (muted) {
      setMuted(false);

      if (playing) {
        fadeTo(volume, 180);
      } else {
        a.volume = volume;
      }
    } else {
      setMuted(true);

      fadeTo(0, 180);
    }
  }, [fadeTo, muted, playing, volume]);

  /* ------------------------------------------------------------------------ */
  /* Return                                                                   */
  /* ------------------------------------------------------------------------ */

  return {
    audio,
    playing,
    play,
    pause,
    toggle,
    fadeTo,

    // Extended API
    volume,
    muted,
    changeVolume,
    toggleMute,
    levels,
  };
}

/* -------------------------------------------------------------------------- */
/* Music Toggle                                                               */
/* -------------------------------------------------------------------------- */

// Nút nổi góc trên phải (góc trên trái = Quay lại, dưới phải = Dùng thử).
export function MusicToggle({
  music,
  className = "",
}: {
  music: Music;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  const {
    playing,
    muted,
    volume,
    levels,
    toggle,
    toggleMute,
    changeVolume,
  } = music;

  const displayVolume = muted ? 0 : volume;

  return (
    <div
      className={`fixed top-4 right-4 z-40 flex items-center gap-2 ${className}`}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Expanded controller                                                */}
      {/* ------------------------------------------------------------------ */}

      <div
        className={[
          "flex items-center gap-2 overflow-hidden rounded-full",
          "border border-white/30 bg-white/80 backdrop-blur-xl",
          "shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
          "transition-all duration-300 ease-out",
          expanded
            ? "pointer-events-auto max-w-[240px] translate-x-0 px-3 py-2 opacity-100"
            : "pointer-events-none max-w-0 translate-x-2 px-0 py-2 opacity-0",
        ].join(" ")}
      >
        {/* Mute */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Bật âm lượng" : "Tắt âm lượng"}
          className="flex size-7 shrink-0 items-center justify-center rounded-full text-black/70 transition hover:bg-black/5 hover:text-black"
        >
          {muted || volume === 0 ? (
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M11 5 6 9H3v6h3l5 4V5Z" />
              <path d="m19 9-6 6" />
              <path d="m13 9 6 6" />
            </svg>
          ) : volume < 0.5 ? (
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M11 5 6 9H3v6h3l5 4V5Z" />
              <path d="M15.5 9.5a4 4 0 0 1 0 5" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M11 5 6 9H3v6h3l5 4V5Z" />
              <path d="M15.5 8.5a6 6 0 0 1 0 7" />
              <path d="M18.5 6a10 10 0 0 1 0 12" />
            </svg>
          )}
        </button>

        {/* Volume slider */}
        <div className="relative flex h-5 w-20 items-center">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={displayVolume}
            onChange={(event) =>
              changeVolume(Number(event.target.value))
            }
            aria-label="Âm lượng"
            className="music-volume-slider w-full cursor-pointer"
          />
        </div>

        {/* Volume percentage */}
        <span className="w-8 text-right text-[10px] font-medium tabular-nums text-black/50">
          {Math.round(displayVolume * 100)}
        </span>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Main button                                                         */}
      {/* ------------------------------------------------------------------ */}

      <button
        type="button"
        onClick={toggle}
        onContextMenu={(event) => {
          event.preventDefault();
          setExpanded((value) => !value);
        }}
        onDoubleClick={() => setExpanded((value) => !value)}
        aria-label={playing ? "Tạm dừng nhạc" : "Phát nhạc"}
        aria-pressed={playing}
        className={[
          "group relative flex size-12 shrink-0 items-center justify-center",
          "rounded-full border border-white/40",
          "bg-white/85 backdrop-blur-xl",
          "shadow-[0_8px_30px_rgba(0,0,0,0.14)]",
          "transition-all duration-300",
          "hover:scale-105 hover:bg-white",
          "active:scale-95",
        ].join(" ")}
      >
        {/* Outer pulse */}
        {playing && (
          <>
            <span className="absolute inset-0 rounded-full border border-black/10 animate-[ping_2s_ease-out_infinite]" />

            <span className="absolute -inset-1 rounded-full border border-black/[0.04]" />
          </>
        )}

        {/* Visualizer */}
        <span className="relative flex h-5 items-center justify-center gap-[2px]">
          {levels.map((level, index) => {
            // Chỉ hiển thị 9 bar giữa để tạo cảm giác gọn như waveform
            if (index < 4 || index > 13) return null;

            const height = playing
              ? Math.max(3, 4 + level * 15)
              : 3;

            return (
              <span
                key={index}
                className="w-[2px] rounded-full bg-black/70 transition-[height,opacity] duration-75"
                style={{
                  height,
                  opacity: playing
                    ? 0.45 + level * 0.55
                    : 0.35,
                }}
              />
            );
          })}
        </span>

        {/* Center play icon khi chưa phát */}
        {!playing && (
          <svg
            viewBox="0 0 24 24"
            className="absolute size-5 translate-x-[1px] text-black/75"
            fill="currentColor"
          >
            <path d="M8 5.5v13a1 1 0 0 0 1.53.848l9.5-6.5a1 1 0 0 0 0-1.696l-9.5-6.5A1 1 0 0 0 8 5.5Z" />
          </svg>
        )}

        {/* Pause icon */}
        {playing && (
          <span className="absolute flex items-center gap-[3px]">
            <span className="h-4 w-[2px] rounded-full bg-black/70" />
            <span className="h-4 w-[2px] rounded-full bg-black/70" />
          </span>
        )}
      </button>

      {/* ------------------------------------------------------------------ */}
      {/* Range slider styles                                                */}
      {/* ------------------------------------------------------------------ */}

      <style jsx>{`
        .music-volume-slider {
          appearance: none;
          -webkit-appearance: none;
          height: 3px;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.12);
          outline: none;
        }

        .music-volume-slider::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.7);
          cursor: pointer;
          transition: transform 150ms ease;
        }

        .music-volume-slider::-webkit-slider-thumb:hover {
          transform: scale(1.25);
        }

        .music-volume-slider::-moz-range-thumb {
          width: 10px;
          height: 10px;
          border: 0;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.7);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

export type Music = ReturnType<typeof useMusic>;