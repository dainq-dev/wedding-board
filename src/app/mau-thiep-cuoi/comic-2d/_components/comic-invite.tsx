"use client";

import { weddingDate } from "@/kit/dates";
import { MusicToggle, useMusic } from "@/kit/music";
import { SmoothScroll } from "@/kit/smooth-scroll";
import { useWedding } from "@/wedding/wedding-data-provider";
import { ComicEnd, ComicShow } from "./sections/finale";
import { ComicTop } from "./sections/top";
import { t } from "./tokens";

// Comic 2D (spec docs/templates/comic-2d.md): C1 bìa "Số đặc biệt" + POW! →
// C2 tên & ảnh bìa → C3 nam/nữ chính → C4 ba panel chuyện tình →
// C5+C12+C6+C7 tập cuối → C8 thư viện ảnh → C10 kết + QR.
// Nhạc: useMusic() mặc định dùng chung /music-wedding.mp3.
export function ComicInvite() {
  const { data } = useWedding();
  const { groom, bride, venue, images } = data;
  const date = weddingDate(data);
  const music = useMusic();

  return (
    <div className={t.root}>
      <MusicToggle music={music} className="bg-white/90 text-[#111]" />

      <ComicTop
        onOpen={() => void music.play()}
        groom={groom.name}
        bride={bride.name}
        cover={images[0]}
        groomImg={images[1]}
        brideImg={images[2]}
        images={images}
      />

      <SmoothScroll>
        <main>
          <ComicShow date={date} venue={venue} />
          <ComicEnd images={images} />
        </main>
      </SmoothScroll>
    </div>
  );
}
