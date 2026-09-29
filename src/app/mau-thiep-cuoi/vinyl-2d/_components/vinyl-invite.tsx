"use client";

import { useEffect, useRef } from "react";
import { weddingDate } from "@/kit/dates";
import { gsap } from "@/kit/gsap";
import { MusicToggle, useMusic } from "@/kit/music";
import { OpenGate } from "@/kit/open-gate";
import { SmoothScroll } from "@/kit/smooth-scroll";
import { useWedding } from "@/wedding/wedding-data-provider";
import { ASide } from "./sections/a-side";
import { Showtime, SideB } from "./sections/b-side";
import { DISC, DISC_LABEL, t } from "./tokens";

// Đĩa quay 33⅓ vòng/phút khi nhạc chạy, dừng đúng tư thế khi tạm dừng —
// chi tiết đặc trưng của mẫu (spec §6 điểm nhấn).
function Turntable({ playing }: { playing: boolean }) {
  const disc = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = disc.current;
    if (!el) return;
    const spin = gsap.to(el, {
      rotate: 360,
      duration: 1.8,
      repeat: -1,
      ease: "none",
    });
    if (playing) spin.play();
    else spin.pause();
    return () => {
      spin.kill();
    };
  }, [playing]);

  return (
    <span
      ref={disc}
      aria-hidden="true"
      className={`${DISC} fixed bottom-5 left-5 z-40 block size-14 shadow-[0_8px_20px_-8px_rgba(62,39,35,0.6)]`}
    >
      <span className={DISC_LABEL} />
      <span
        aria-hidden
        className="absolute inset-[44%] rounded-full bg-[#F2E3C6]"
      />
    </span>
  );
}

// Vinyl 2D (spec docs/templates/vinyl-2d.md): C1 bìa đĩa + trượt đĩa → Side A
// (tên/portraits/tracklist) → Showtime (ngày/countdown/lịch/bản đồ) → Side B
// (album/QR/cảm ơn). Nhạc mặc định dùng chung; đĩa góc trái quay theo nhạc.
export function VinylInvite() {
  const { data } = useWedding();
  const { groom, bride, venue, images } = data;
  const date = weddingDate(data);
  const music = useMusic();

  return (
    <div className={t.root}>
      <MusicToggle music={music} className="bg-[#FFF4DC]/90 text-[#3E2723]" />

      <OpenGate
        onOpen={() => void music.play()}
        className="bg-[#F2E3C6] text-[#3E2723]"
      >
        <div className="flex flex-col items-center gap-8 px-6 text-center">
          <div className="relative flex items-center">
            <span
              aria-hidden="true"
              className={`${DISC} absolute -right-12 z-0 size-52 lg:size-64`}
            >
              <span className={DISC_LABEL} />
              <span className="absolute inset-[45%] rounded-full bg-[#F2E3C6]" />
            </span>
            <div
              className={`${t.sleeve} relative z-10 size-52 overflow-hidden lg:size-64`}
            >
              {images[0] ? (
                // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
                <img
                  src={images[0]}
                  width={512}
                  height={512}
                  alt={`Bìa đĩa cưới của ${groom} và ${bride}`}
                  className="size-full object-cover"
                />
              ) : null}
            </div>
          </div>
          <button type="button" className={t.btn}>
            Đặt kim lên đĩa
          </button>
          <p className={`${t.label}`}>Chạm để mở thiệp và bật nhạc</p>
        </div>
      </OpenGate>

      <Turntable playing={music.playing} />

      <SmoothScroll>
        <main>
          <ASide
            groom={groom.name}
            bride={bride.name}
            cover={images[0]}
            groomImg={images[1]}
            brideImg={images[2]}
          />
          <Showtime date={date} venue={venue} />
          <SideB images={images} />
        </main>
      </SmoothScroll>
    </div>
  );
}
