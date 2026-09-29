"use client";

import { weddingDate } from "@/kit/dates";
import { MusicToggle, useMusic } from "@/kit/music";
import { SmoothScroll } from "@/kit/smooth-scroll";
import { useWedding } from "@/wedding/wedding-data-provider";
import { AlbumSection } from "./sections/album";
import { CoupleSection } from "./sections/couple";
import { Gate } from "./sections/gate";
import { WhenSection } from "./sections/when";
import { t } from "./tokens";

// Tropical 2D (spec docs/templates/tropical-2d.md): C1 hoàng hôn + sóng trôi →
// C2 tên & ảnh bìa → C3 cô dâu chú rể → C4 chuyện tình → C5 lịch trình 4 mốc
// (schedule.ts đã test) + bản đồ → C8 album → C10 cảm ơn + QR.
// Nhạc: useMusic() mặc định dùng chung /music-wedding.mp3.
export function TropicalInvite() {
  const { data } = useWedding();
  const { groom, bride, images } = data;
  const date = weddingDate(data);
  const music = useMusic();

  return (
    <div
      className={`${t.root} min-h-dvh text-[16px] leading-[1.7] lg:text-[17px]`}
    >
      <MusicToggle music={music} className="bg-white/85 text-[#1E3A4C]" />

      <Gate
        onOpen={() => void music.play()}
        groom={groom.name}
        bride={bride.name}
      />

      <SmoothScroll>
        <main>
          <CoupleSection
            groom={groom.name}
            bride={bride.name}
            cover={images[0]}
            groomImg={images[1]}
            brideImg={images[2]}
            images={images}
          />
          <WhenSection date={date} />
          <AlbumSection images={images} />
        </main>
      </SmoothScroll>
    </div>
  );
}
