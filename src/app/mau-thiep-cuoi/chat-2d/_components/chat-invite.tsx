"use client";

import {
  ArrowUpIcon,
  CaretLeftIcon,
  ChecksIcon,
  PhoneIcon,
} from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { formatDate, weddingDate } from "@/kit/dates";
import { gsap, ScrollTrigger, useGSAP } from "@/kit/gsap";
import { AlbumSheet, Lightbox } from "@/kit/lightbox";
import { MusicToggle, useMusic } from "@/kit/music";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { useScrollLock } from "@/kit/use-scroll-lock";
import { useWedding } from "@/wedding/wedding-data-provider";
import { Avatar, Bubble, Day, Photos, Row } from "./bubbles";
import {
  AlbumCard,
  EventCard,
  Gift,
  InviteCard,
  LocationCard,
  PinnedBar,
  Poll,
  Rsvp,
  Schedule,
  Voice,
} from "./cards";
import { LockScreen } from "./lock-screen";
import { buildScript, type Message } from "./script";
import { t } from "./tokens";

// Tin Nhắn Đầu Tiên (docs/templates/chat-2d.md): màn hình khoá → khung chat cuộn nội bộ như app thật.
export function ChatInvite() {
  const { data } = useWedding();
  const { groom, bride, images, venue } = data;
  const date = weddingDate(data);
  const music = useMusic();
  const reduced = useReducedMotion();
  const scroller = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);
  const [photo, setPhoto] = useState<number | null>(null);
  const [album, setAlbum] = useState(false);
  useScrollLock(true); // trang không cuộn; chỉ khung chat cuộn

  useGSAP(
    () => {
      const box = scroller.current;
      if (!opened || reduced || !box) return;
      const msgs = gsap.utils.toArray<HTMLElement>("[data-msg]", box);
      gsap.set(msgs, { autoAlpha: 0 });
      // Hàng đợi: tin vào khung cùng lúc thì hiện lần lượt, như đang nhắn thật.
      let free = 0;
      const show = (m: HTMLElement) => {
        const now = gsap.ticker.time;
        const at = Math.max(now, free);
        const pop = m.querySelector<HTMLElement>("[data-pop]") ?? m;
        const typing = m.querySelector<HTMLElement>("[data-typing]");
        const right = m.dataset.side === "right";
        // Cuộn nhanh (tồn > 1s) thì bỏ "đang nhập" để nội dung không bị trễ.
        const rush = at - now > 1;
        const tl = gsap.timeline({ delay: at - now });
        tl.set(m, { autoAlpha: 1 }).set(pop, { autoAlpha: 0 });
        if (typing && !rush)
          tl.to(typing, { autoAlpha: 1, duration: 0.15 })
            .fromTo(
              typing.querySelectorAll("[data-dot]"),
              { y: 0 },
              {
                y: -4,
                duration: 0.2,
                stagger: 0.1,
                yoyo: true,
                repeat: 3,
                ease: "sine.inOut",
              },
            )
            .to(typing, { autoAlpha: 0, duration: 0.1 });
        tl.fromTo(
          pop,
          {
            autoAlpha: 0,
            scale: 0.6,
            transformOrigin: right ? "100% 100%" : "0% 100%",
          },
          {
            autoAlpha: 1,
            scale: 1,
            duration: rush ? 0.2 : 0.35,
            ease: pop.querySelector(".text-\\[30px\\]")
              ? "back.out(3)"
              : "back.out(1.5)",
          },
        );
        const extras = pop.querySelectorAll("[data-heart]");
        if (extras.length)
          tl.from(extras, { scale: 0, duration: 0.3, ease: "back.out(3)" });
        const photos = pop.querySelectorAll("[data-photo]");
        if (photos.length)
          tl.from(
            photos,
            {
              scale: 1.15,
              autoAlpha: 0,
              duration: 0.5,
              stagger: 0.08,
              ease: "power2.out",
            },
            "<",
          );
        free = at + tl.duration() - 0.05;
      };
      for (const m of msgs)
        ScrollTrigger.create({
          scroller: box,
          trigger: m,
          start: "top 96%",
          once: true,
          onEnter: () => show(m),
        });
    },
    { dependencies: [opened, reduced] },
  );

  const script = buildScript(data);
  const view = (i: number) => images[i] && setPhoto(i);
  const her = <Avatar src={images[2]} name={bride.name} />;
  const last = images.length - 1;

  const render = (m: Message, key: number) => {
    switch (m.kind) {
      case "day":
        return <Day key={key} label={m.label} />;
      case "text":
        if (m.from === "system")
          return (
            <Row key={key} side="center">
              <p className={t.meta}>{m.text}</p>
            </Row>
          );
        return (
          <Row
            key={key}
            side={m.from === "groom" ? "right" : "left"}
            avatar={her}
            typing={m.typing}
          >
            <Bubble
              side={m.from === "groom" ? "right" : "left"}
              text={m.text}
              heart={m.heart}
              big={m.big}
            />
          </Row>
        );
      case "photos":
        return (
          <Row
            key={key}
            side={m.from === "groom" ? "right" : "left"}
            avatar={her}
          >
            <Photos
              images={images}
              start={m.start}
              count={m.count}
              side={m.from === "groom" ? "right" : "left"}
              onView={view}
            />
          </Row>
        );
      case "invite":
        return (
          <Row key={key} side="center">
            <InviteCard data={data} date={date} onView={view} />
          </Row>
        );
      case "event":
        return (
          <Row key={key} side="right">
            <EventCard data={data} date={date} />
          </Row>
        );
      case "schedule":
        return (
          <Row key={key} side="left" avatar={her} typing>
            <Schedule date={date} />
          </Row>
        );
      case "location":
        return (
          <div key={key} className="flex flex-col gap-2">
            <Row side="right">
              <LocationCard data={data} date={date} />
            </Row>
            <Row side="left" avatar={her} typing>
              <Bubble
                side="left"
                text={`Lễ vu quy lúc 8 giờ sáng ở nhà em nhé: ${bride.address}`}
              />
            </Row>
          </div>
        );
      case "poll":
        return (
          <Row key={key} side="left" avatar={her}>
            <Poll />
          </Row>
        );
      case "album":
        return (
          <Row key={key} side="left" avatar={her}>
            <AlbumCard count={images.length} onOpen={() => setAlbum(true)} />
          </Row>
        );
      case "voice":
        return (
          <Row key={key} side="right">
            <Voice music={music} />
            <p className={`${t.meta} mt-1`}>
              Bài hát của tụi mình, chạm để nghe
            </p>
          </Row>
        );
      case "gift":
        return (
          <Row key={key} side="left" avatar={her} typing>
            <Gift />
          </Row>
        );
      case "rsvp":
        return (
          <Row key={key} side="right">
            <Rsvp />
          </Row>
        );
      case "final":
        return (
          <div key={key} className="flex flex-col gap-2 pb-4">
            {images[last] && last > 2 && (
              <Row side="left" avatar={her}>
                <Photos
                  images={images}
                  start={last}
                  count={1}
                  side="left"
                  onView={view}
                />
              </Row>
            )}
            <Row side="left" avatar={her} typing>
              <Bubble
                side="left"
                text="Cảm ơn mọi người đã đọc tới đây. Hẹn gặp ở tiệc cưới nhé!"
                heart
              />
            </Row>
            <Row side="right">
              <Bubble side="right" text={`${groom.name} & ${bride.name}`} />
              <p className={`${t.meta} mt-1 flex items-center gap-1`}>
                Đã xem <ChecksIcon className="size-4 text-[#2F6BFF]" />
              </p>
            </Row>
          </div>
        );
    }
  };

  return (
    <div className="min-h-[100svh] bg-[#EAF2FF] font-(family-name:--font-sans) text-[#0F172A] md:flex md:h-[100svh] md:items-center md:justify-center md:gap-14 md:px-8 lg:gap-24 bg-[radial-gradient(ellipse_at_20%_20%,rgba(47,107,255,0.10),transparent_55%),radial-gradient(ellipse_at_85%_80%,rgba(217,58,106,0.10),transparent_50%)]">
      <MusicToggle music={music} className="bg-white/80 text-[#0F172A]" />
      {!opened && (
        <LockScreen
          bride={bride.name}
          cover={images[0]}
          onOpen={() => {
            music.play(1500);
            setOpened(true);
          }}
        />
      )}

      {/* Desktop: chữ lớn bên trái, điện thoại bên phải. */}
      <aside className="hidden max-w-sm md:block">
        <p className="text-[clamp(4rem,9vw,8rem)] leading-[0.9] font-extrabold tracking-[-0.05em] text-[#2F6BFF] tabular-nums">
          {formatDate(date).slice(0, 5).replace("/", ".")}
        </p>
        <p className="mt-6 text-[32px] leading-tight font-extrabold tracking-[-0.02em]">
          Tin nhắn đầu tiên
        </p>
        <p className="mt-4 max-w-[30ch] text-[16px] leading-relaxed text-[#475569]">
          Cuộn trong điện thoại để đọc chuyện của hai đứa, từ lời chào làm quen
          tới tấm thiệp được ghim trên cùng.
        </p>
        <p className="mt-8 text-[14px] font-medium text-[#556277]">
          {venue.name}
        </p>
      </aside>

      <div className="relative flex h-[100svh] w-full flex-col overflow-hidden bg-[#EAF2FF] md:h-[min(860px,94svh)] md:w-[390px] md:shrink-0 md:rounded-[52px] md:border-[12px] md:border-[#0F172A] md:shadow-[0_40px_80px_-30px_rgba(15,23,42,0.45)]">
        <header className="flex items-center gap-3 border-b border-[#DCE5F3] bg-white/90 py-3 pr-20 pl-16 backdrop-blur md:pr-4 md:pl-4">
          <CaretLeftIcon aria-hidden="true" className="size-5 text-[#2F6BFF]" />
          <Avatar src={images[2]} name={bride.name} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-bold">{bride.name}</p>
            <p className="flex items-center gap-1.5 text-[12px] text-[#556277]">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-[#22C55E]"
              />
              Đang hoạt động
            </p>
          </div>
          <PhoneIcon
            aria-hidden="true"
            className="hidden size-5 text-[#2F6BFF] md:block"
          />
        </header>
        <PinnedBar
          onClick={() =>
            scroller.current?.querySelector("#chat-invite")?.scrollIntoView({
              behavior: reduced ? "auto" : "smooth",
              block: "start",
            })
          }
        />
        <div
          ref={scroller}
          className="flex-1 overflow-y-auto overscroll-contain"
        >
          <div className="flex flex-col gap-2 px-3 pt-2 pb-8">
            {script.map(render)}
          </div>
        </div>
        <div
          aria-hidden="true"
          className="flex items-center gap-2 border-t border-[#DCE5F3] bg-white/90 py-2.5 pr-24 pl-3 md:pr-3"
        >
          <span className="flex h-10 flex-1 items-center rounded-full bg-[#F4F8FF] px-4 text-[14px] text-[#94A3B8]">
            Nhắn tin
          </span>
          <span className="flex size-10 items-center justify-center rounded-full bg-[#2F6BFF] text-white">
            <ArrowUpIcon weight="bold" className="size-4" />
          </span>
        </div>
      </div>

      <Lightbox
        images={images}
        index={photo}
        onIndex={setPhoto}
        onClose={() => setPhoto(null)}
      />
      <AlbumSheet
        images={images}
        open={album}
        onPick={(i) => {
          setAlbum(false);
          setPhoto(i);
        }}
        onClose={() => setAlbum(false)}
      />
    </div>
  );
}
