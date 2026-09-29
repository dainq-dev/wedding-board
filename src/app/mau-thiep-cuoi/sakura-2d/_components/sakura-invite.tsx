"use client";

import { formatDate, weddingDate } from "@/kit/dates";
import { MusicToggle, useMusic } from "@/kit/music";
import { OpenGate } from "@/kit/open-gate";
import { SmoothScroll } from "@/kit/smooth-scroll";
import { useWedding } from "@/wedding/wedding-data-provider";
import { Petals } from "./petals";
import { AlbumSection } from "./sections/album";
import { EventsSection } from "./sections/events";
import { FamiliesSection } from "./sections/families";
import { NamesSection } from "./sections/names";
import { StorySection } from "./sections/story";
import { WhenSection } from "./sections/when";
import { CornerBranch, Flower } from "./svg/decor";
import { t } from "./tokens";

// Sakura 2D (spec docs/templates/sakura-2d.md): C1 mở thiệp → C2 tên → C3 nhà trai/gái
// → C4 chuyện tình → C5+C11 ngày và lịch → C6+C7 lễ, tiệc, bản đồ → C8+C14+C10 album,
// QR mừng cưới, cảm ơn. Nhạc dùng mặc định chung /music-wedding.mp3.
export function SakuraInvite() {
  const { data } = useWedding();
  const { groom, bride, venue, images } = data;
  const date = weddingDate(data);
  const music = useMusic();

  return (
    <div className={t.root}>
      <MusicToggle music={music} className="bg-[#FFF7F8]/90 text-[#5B3A44]" />

      {/* C1 · bấm để mở thiệp: onOpen gọi play() đồng bộ trong click (autoplay policy). */}
      <OpenGate
        onOpen={() => void music.play()}
        className="bg-[#FFF7F8] text-[#5B3A44]"
      >
        <CornerBranch className="absolute top-0 right-0 w-[46vw] max-w-[320px] opacity-80" />
        <div className="flex flex-col items-center">
          <Flower size={52} />
          <button
            type="button"
            className={`${t.btn} mt-6 size-28 rounded-full text-[15px] tracking-[0.15em] uppercase`}
          >
            Mở thiệp
          </button>
          <p className={`${t.caption} ${t.soft} mt-4`}>
            Chạm để mở thiệp và bật nhạc
          </p>
        </div>
      </OpenGate>

      <SmoothScroll>
        <main>
          <Petals />
          <NamesSection
            groom={groom.name}
            bride={bride.name}
            cover={images[0]}
            dateLabel={formatDate(date)}
          />
          <FamiliesSection
            groom={groom.name}
            groomAddress={groom.address}
            groomImg={images[1]}
            bride={bride.name}
            brideAddress={bride.address}
            brideImg={images[2]}
          />
          <StorySection images={images} />
          <WhenSection date={date} />
          <EventsSection
            groomAddress={groom.address}
            brideAddress={bride.address}
            venue={venue}
          />
          <AlbumSection images={images} />
        </main>
      </SmoothScroll>
    </div>
  );
}
