"use client";

import { formatDate, formatTime, weddingDate } from "@/kit/dates";
import { MusicToggle, useMusic } from "@/kit/music";
import { SmoothScroll } from "@/kit/smooth-scroll";
import { useWedding } from "@/wedding/wedding-data-provider";
import { CeremonySection } from "./sections/ceremony";
import { FinaleSection } from "./sections/finale";
import { Gate } from "./sections/gate";
import { WhenSection } from "./sections/when";
import { t } from "./tokens";

// Song Hỷ 2D (spec docs/templates/song-hy-2d.md): C1 cửa son → C2 lễ thành hôn →
// C3 hai khung tròn → C6 hai lễ → C5+C11 ngày và lịch → C12 trình tự →
// C7 bản đồ → C8 album → C14 QR mừng cưới → C10 cảm ơn. Nhạc mặc định chung.
export function SongHyInvite() {
  const { data } = useWedding();
  const { groom, bride, venue, images } = data;
  const date = weddingDate(data);
  const music = useMusic();

  return (
    <div className={t.root}>
      <MusicToggle music={music} className="bg-[#6B0F12]/90 text-[#F1D08A]" />

      <Gate onOpen={() => void music.play()} />

      <SmoothScroll>
        <main>
          <CeremonySection
            groom={groom.name}
            groomAddress={groom.address}
            groomImg={images[1]}
            bride={bride.name}
            brideAddress={bride.address}
            brideImg={images[2]}
            dateLabel={`${formatDate(date)} · ${formatTime(date)}`}
          />
          <WhenSection date={date} />
          <FinaleSection venue={venue} images={images} />
        </main>
      </SmoothScroll>
    </div>
  );
}
