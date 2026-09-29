"use client";

import { weddingDate } from "@/kit/dates";
import { MusicToggle, useMusic } from "@/kit/music";
import { OpenGate } from "@/kit/open-gate";
import { SmoothScroll } from "@/kit/smooth-scroll";
import { useWedding } from "@/wedding/wedding-data-provider";
import { AlbumSection } from "./sections/album";
import { CoupleSection } from "./sections/couple";
import { WhenSection } from "./sections/when";
import { t } from "./tokens";

// Picnic 2D (spec docs/templates/picnic-2d.md): C1 khăn gấp → C2 tên trên thiệp
// menu → C3 chân dung dán trên khăn → C4 chuyện tình ba món → C5+C11 ngày và
// lịch → C6+C12 thực đơn lịch trình → C7 bản đồ → C8 album → C10+C14 cảm ơn, QR.
// Nhạc: mặc định dùng chung qua useMusic() không truyền src.
export function PicnicInvite() {
  const { data } = useWedding();
  const { groom, bride, venue, images } = data;
  const date = weddingDate(data);
  const music = useMusic();

  return (
    <div className={t.root}>
      <MusicToggle music={music} className="bg-white/90 text-[#2B2D42]" />

      {/* C1 · khăn caro gấp gọn giữa nền caro lớn; bấm là "trải khăn" mở thiệp. */}
      <OpenGate
        onOpen={() => void music.play()}
        className={`${t.checker} text-[#2B2D42]`}
      >
        <div className="flex flex-col items-center gap-6 px-6 text-center">
          <div className={`${t.card} -rotate-3 px-10 py-7`}>
            <p className={t.title}>Picnic cưới</p>
            <p className={`${t.soft} mt-1 text-[15px] break-words`}>
              của {groom.name} &amp; {bride.name}
            </p>
          </div>
          <button type="button" className={t.btn}>
            Trải khăn thôi!
          </button>
          <p className={`${t.label}`}>Chạm để mở thiệp và bật nhạc</p>
        </div>
      </OpenGate>

      <SmoothScroll>
        <main>
          <CoupleSection
            groom={groom.name}
            bride={bride.name}
            groomImg={images[1]}
            brideImg={images[2]}
            images={images}
          />
          <WhenSection date={date} venue={venue} />
          <AlbumSection images={images} />
        </main>
      </SmoothScroll>
    </div>
  );
}
