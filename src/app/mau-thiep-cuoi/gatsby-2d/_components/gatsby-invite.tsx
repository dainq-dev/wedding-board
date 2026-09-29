"use client";

import { weddingDate } from "@/kit/dates";
import { MusicToggle, useMusic } from "@/kit/music";
import { SmoothScroll } from "@/kit/smooth-scroll";
import { useWedding } from "@/wedding/wedding-data-provider";
import { AlbumSection, WhenSection } from "./sections/bottom";
import { TopSections } from "./sections/top";
import { t } from "./tokens";

// Gatsby 2D (spec docs/templates/gatsby-2d.md): C1 rèm nhung mở hội → C2 tên
// trong khung Deco → C3 chân dung đối xứng → C4 ba chương chuyện tình →
// C5+C12 đêm hội & lịch trình → C7 bản đồ → C8 album → C10 kết + champagne.
// Nhạc: dùng mặc định chung qua useMusic() không truyền src.
export function GatsbyInvite() {
  const { data } = useWedding();
  const { groom, bride, venue, images } = data;
  const date = weddingDate(data);
  const music = useMusic();

  return (
    <div className={t.root}>
      <MusicToggle music={music} className="bg-[#161616]/90 text-[#D4AF37]" />

      <TopSections
        onOpen={() => void music.play()}
        groom={groom.name}
        bride={bride.name}
        cover={images[0]}
        groomImg={images[1]}
        brideImg={images[2]}
      />

      <SmoothScroll>
        <main>
          <WhenSection date={date} venue={venue} />
          <AlbumSection images={images} />
        </main>
      </SmoothScroll>
    </div>
  );
}
