"use client";

import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  CheckIcon,
  ImagesIcon,
  LockSimpleIcon,
  PlusIcon,
  VideoCameraIcon,
  WarningCircleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { type ReactNode, useRef, useState } from "react";
import { MapEmbed } from "@/components/map-embed";
import { useTryItForm } from "./index.logic";
import type { FieldKey, MediaView, SectionId, Who } from "./type";

// Nhận diện Kệ Thiệp (dashboard): nền giấy #F7F5F0, mực #16181A, Prata + Be Vietnam Pro.
const EASE = "ease-[cubic-bezier(0.32,0.72,0,1)]";
const DISPLAY = "font-(family-name:--font-ui-display) font-normal";
const MUTED = "text-[#5E6661]";
const ERR = "text-[#B3261E]";

const STEP_LABEL: Record<SectionId, string> = {
  couple: "Hai bạn",
  media: "Ảnh",
  venue: "Địa điểm",
  date: "Ngày giờ",
};

const SECTION_TITLE: Record<SectionId, string> = {
  couple: "Cô dâu & chú rể",
  media: "Ảnh cưới",
  venue: "Nơi tổ chức",
  date: "Ngày giờ tiệc",
};

export function TryItDialog() {
  const vm = useTryItForm();
  const status = Object.fromEntries(vm.sections.map((s) => [s.id, s]));
  const err = (k: FieldKey) =>
    vm.showErrors || (k === "mapsUrl" && vm.draft.mapsUrl)
      ? vm.errors[k]
      : undefined;
  const requiredDone = vm.sections.filter((s) => s.required && s.done).length;
  const requiredTotal = vm.sections.filter((s) => s.required).length;

  return (
    <>
      <div className="fixed right-4 bottom-4 z-50 flex items-center gap-2 font-(family-name:--font-ui)">
        {vm.isTrial && (
          <button
            type="button"
            onClick={vm.clear}
            className={`min-h-11 rounded-full bg-white/90 px-4 text-sm text-[#16181A] shadow-[0_10px_30px_-12px_rgba(22,24,26,0.35)] ring-1 ring-[#16181A]/8 backdrop-blur transition-transform duration-500 ${EASE} active:scale-[0.98]`}
          >
            Xoá dữ liệu dùng thử
          </button>
        )}
        <button
          type="button"
          onClick={vm.open}
          className={`group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#16181A] py-1.5 pr-1.5 pl-5 text-sm font-medium text-white shadow-[0_14px_34px_-14px_rgba(22,24,26,0.6)] transition-transform duration-500 ${EASE} active:scale-[0.98]`}
        >
          {vm.isTrial ? "Sửa thông tin" : "Dùng thử"}
          <span
            className={`flex size-8 items-center justify-center rounded-full bg-[#F3D9A4] text-[#16181A] transition-transform duration-500 ${EASE} group-hover:translate-x-0.5 group-hover:-translate-y-px`}
          >
            <ArrowUpRightIcon className="size-4" />
          </span>
        </button>
      </div>

      <dialog
        ref={vm.dialogRef}
        aria-labelledby="try-it-title"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 font-(family-name:--font-ui) text-[#16181A] backdrop:bg-[#16181A]/45 backdrop:backdrop-blur-[2px]"
      >
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            vm.submit();
          }}
          className={`absolute inset-x-0 top-[4dvh] bottom-0 flex flex-col overflow-hidden rounded-t-[28px] bg-[#F7F5F0] shadow-[0_-20px_60px_-30px_rgba(22,24,26,0.5)] transition-[translate,opacity] duration-500 ${EASE} starting:translate-y-10 starting:opacity-0 sm:inset-y-3 sm:right-3 sm:left-auto sm:w-[min(560px,calc(100vw-1.5rem))] sm:rounded-[28px]`}
        >
          {/* ---------- Đầu ---------- */}
          <header className="border-b border-[#16181A]/8 px-5 pt-5 pb-4 sm:px-7 sm:pt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="inline-flex rounded-full bg-[#16181A]/5 px-3 py-1 text-[12px] font-medium">
                  Dùng thử · {vm.templateName}
                </p>
                <h2
                  id="try-it-title"
                  className={`${DISPLAY} mt-3 text-[26px] leading-tight sm:text-[30px]`}
                >
                  Xem thiệp với tên và ảnh của hai bạn
                </h2>
              </div>
              <button
                type="button"
                onClick={vm.close}
                aria-label="Đóng"
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-[#16181A]/8 transition-colors hover:bg-[#16181A]/5"
              >
                <XIcon className="size-5" />
              </button>
            </div>
            <p className={`mt-2 flex items-start gap-2 text-[13px] ${MUTED}`}>
              <LockSimpleIcon className="mt-0.5 size-4 shrink-0" />
              Chỉ lưu trên trình duyệt này, tự xoá sau 6 giờ. Không tải lên máy
              chủ, không ai khác xem được.
            </p>
            <ol className="mt-4 grid grid-cols-4 gap-1.5" aria-label="Tiến độ">
              {vm.sections.map((s) => (
                <li key={s.id} className="flex flex-col gap-1.5">
                  <span
                    className={`h-1 rounded-full transition-colors duration-500 ${s.done ? "bg-[#2F6B4F]" : s.required ? "bg-[#16181A]/12" : "bg-[#16181A]/6"}`}
                  />
                  <span
                    className={`truncate text-[11px] ${s.done ? "text-[#2F6B4F]" : MUTED}`}
                  >
                    {STEP_LABEL[s.id]}
                  </span>
                </li>
              ))}
            </ol>
          </header>

          {/* ---------- Nội dung ---------- */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">
            <div className="flex flex-col gap-4">
              <Section
                n={1}
                id="couple"
                done={status.couple.done}
                required
                hint="Hiển thị trên thiệp đúng như bạn nhập."
              >
                <div className="grid gap-6">
                  {(["groom", "bride"] as Who[]).map((who) => (
                    <fieldset key={who} className="grid gap-3">
                      <legend className="mb-3 text-[13px] font-semibold tracking-[0.02em]">
                        {who === "groom" ? "Chú rể" : "Cô dâu"}
                      </legend>
                      <Field
                        label="Họ và tên"
                        field={`${who}.name`}
                        error={err(`${who}.name`)}
                      >
                        {(p) => (
                          <input
                            {...p}
                            value={vm.draft[who].name}
                            onChange={(e) =>
                              vm.setPerson(who, "name", e.target.value)
                            }
                            maxLength={50}
                            autoComplete="off"
                            placeholder={
                              who === "groom"
                                ? "Nguyễn Minh Anh"
                                : "Trần Thu Hà"
                            }
                          />
                        )}
                      </Field>
                      <div className="grid grid-cols-[1fr_7.5rem] gap-3">
                        <Field
                          label="Quê quán"
                          field={`${who}.address`}
                          error={err(`${who}.address`)}
                        >
                          {(p) => (
                            <input
                              {...p}
                              value={vm.draft[who].address}
                              onChange={(e) =>
                                vm.setPerson(who, "address", e.target.value)
                              }
                              maxLength={80}
                              placeholder={who === "groom" ? "Huế" : "Hà Nội"}
                            />
                          )}
                        </Field>
                        <Field
                          label="Năm sinh"
                          field={`${who}.birthYear`}
                          error={err(`${who}.birthYear`)}
                        >
                          {(p) => (
                            <input
                              {...p}
                              value={vm.draft[who].birthYear}
                              onChange={(e) =>
                                vm.setPerson(
                                  who,
                                  "birthYear",
                                  e.target.value.replace(/\D/g, "").slice(0, 4),
                                )
                              }
                              inputMode="numeric"
                              placeholder="1996"
                              className={`${p.className} tabular-nums`}
                            />
                          )}
                        </Field>
                      </div>
                    </fieldset>
                  ))}
                </div>
              </Section>

              <Section
                n={2}
                id="media"
                done={status.media.done}
                required
                hint={`Tối thiểu ${vm.images.min} ảnh${vm.videos ? ` và ${vm.videos.min} video` : ""}. Không giới hạn số lượng hay dung lượng ảnh — càng nhiều, album càng đầy.`}
              >
                <MediaPicker
                  media={vm.images}
                  error={err("images")}
                  note="3 ảnh đầu lần lượt là ảnh bìa, ảnh chú rể, ảnh cô dâu; các ảnh sau vào album. Bấm ← trên ảnh để đổi thứ tự."
                />
                {vm.videos && (
                  <div className="mt-6">
                    <MediaPicker
                      media={vm.videos}
                      error={err("videos")}
                      note="Mỗi video tối đa 50MB."
                    />
                  </div>
                )}
              </Section>

              <Section
                n={3}
                id="venue"
                done={status.venue.done}
                required
                hint="Thiệp sẽ hiện bản đồ và nút chỉ đường tới đây."
              >
                <Field
                  label="Link Google Maps của nhà hàng"
                  field="mapsUrl"
                  error={err("mapsUrl")}
                >
                  {(p) => (
                    <input
                      {...p}
                      value={vm.draft.mapsUrl}
                      onChange={(e) => vm.setMapsUrl(e.target.value)}
                      inputMode="url"
                      placeholder="https://www.google.com/maps/place/…"
                    />
                  )}
                </Field>
                {vm.venue ? (
                  <div className="mt-3 rounded-2xl bg-[#16181A]/4 p-1.5 ring-1 ring-[#16181A]/6">
                    <MapEmbed
                      venue={vm.venue}
                      className="h-44 w-full rounded-[calc(1rem-0.375rem)]"
                    />
                    <p className="flex items-center gap-2 px-2 pt-2 pb-1 text-[13px] text-[#2F6B4F]">
                      <CheckIcon className="size-4 shrink-0" weight="bold" />
                      <span className="truncate">
                        {vm.venue.name ?? "Đã nhận vị trí"}
                      </span>
                    </p>
                  </div>
                ) : (
                  <ol
                    className={`mt-3 grid gap-1.5 rounded-2xl bg-[#16181A]/4 p-4 text-[13px] leading-relaxed ${MUTED}`}
                  >
                    <li>1. Mở Google Maps trên trình duyệt, tìm nhà hàng.</li>
                    <li>2. Bấm vào địa điểm để hiện ghim đỏ.</li>
                    <li>
                      3. Copy toàn bộ URL trên thanh địa chỉ và dán vào đây.
                    </li>
                  </ol>
                )}
              </Section>

              <Section
                n={4}
                id="date"
                done={status.date.done}
                required={false}
                hint="Bỏ trống thì thiệp dùng ngày mẫu."
              >
                <Field label="Ngày & giờ bắt đầu tiệc" field="date" optional>
                  {(p) => (
                    <input
                      {...p}
                      type="datetime-local"
                      value={vm.draft.date}
                      onChange={(e) => vm.setDate(e.target.value)}
                    />
                  )}
                </Field>
              </Section>
            </div>
          </div>

          {/* ---------- Chân ---------- */}
          <footer className="border-t border-[#16181A]/8 bg-[#F7F5F0] px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-7">
            {vm.formError && (
              <p
                role="alert"
                className={`mb-2 flex items-start gap-2 text-[13px] ${ERR}`}
              >
                <WarningCircleIcon className="mt-0.5 size-4 shrink-0" />
                {vm.formError}
              </p>
            )}
            <div className="flex items-center justify-between gap-3">
              <p
                className="min-w-0 text-[13px] leading-snug"
                aria-live="polite"
              >
                {vm.missing.length === 0 ? (
                  <span className="text-[#2F6B4F]">Đã đủ thông tin</span>
                ) : (
                  <>
                    <span className="font-medium">
                      {requiredDone}/{requiredTotal} mục bắt buộc
                    </span>
                    <span className={`block truncate ${MUTED}`}>
                      Còn thiếu: {vm.missing.join(", ")}
                    </span>
                  </>
                )}
              </p>
              <button
                type="submit"
                disabled={vm.pending}
                className={`group inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-[#16181A] py-1.5 pr-1.5 pl-5 text-[15px] font-medium text-white transition-transform duration-500 ${EASE} active:scale-[0.98] disabled:opacity-60`}
              >
                {vm.pending ? "Đang lưu…" : "Xem thiệp"}
                <span
                  className={`flex size-9 items-center justify-center rounded-full bg-[#F3D9A4] text-[#16181A] transition-transform duration-500 ${EASE} group-hover:translate-x-0.5 group-hover:-translate-y-px`}
                >
                  <ArrowUpRightIcon className="size-4" />
                </span>
              </button>
            </div>
          </footer>
        </form>
      </dialog>
    </>
  );
}

function Section({
  n,
  id,
  done,
  required,
  hint,
  children,
}: {
  n: number;
  id: SectionId;
  done: boolean;
  required: boolean;
  hint: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={`try-it-${id}`}
      className="rounded-[24px] bg-white p-5 ring-1 ring-[#16181A]/6 shadow-[0_1px_0_rgba(22,24,26,0.03)] sm:p-6"
    >
      <header className="mb-5 flex items-start gap-3">
        <span
          aria-hidden
          className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[13px] font-medium tabular-nums transition-colors duration-500 ${done ? "bg-[#2F6B4F] text-white" : "bg-[#16181A]/6"}`}
        >
          {done ? <CheckIcon className="size-4" weight="bold" /> : n}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 id={`try-it-${id}`} className={`${DISPLAY} text-[19px]`}>
              {SECTION_TITLE[id]}
            </h3>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${required ? "bg-[#16181A] text-white" : "text-[#5E6661] ring-1 ring-[#16181A]/12"}`}
            >
              {required ? "Bắt buộc" : "Tuỳ chọn"}
            </span>
          </div>
          <p className={`mt-1 text-[13px] leading-relaxed ${MUTED}`}>{hint}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

type InputProps = {
  id: string;
  name: string;
  className: string;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
  "aria-required": boolean;
};

function Field({
  label,
  field,
  error,
  optional = false,
  children,
}: {
  label: string;
  field: string;
  error?: string;
  optional?: boolean;
  children: (p: InputProps) => ReactNode;
}) {
  const id = `try-it-${field}`;
  return (
    <div data-field={field} className="grid gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium">
        {label}
        {optional ? (
          <span className={`font-normal ${MUTED}`}> (tuỳ chọn)</span>
        ) : (
          <span aria-hidden className={ERR}>
            {" "}
            *
          </span>
        )}
      </label>
      {children({
        id,
        name: field,
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? `${id}-err` : undefined,
        "aria-required": !optional,
        className: `h-12 w-full min-w-0 rounded-xl bg-[#F7F5F0] px-4 text-[15px] ring-1 ring-inset outline-none transition-shadow duration-300 placeholder:text-[#16181A]/35 focus:bg-white focus:ring-2 ${error ? "ring-[#B3261E]/70 focus:ring-[#B3261E]" : "ring-[#16181A]/10 focus:ring-[#16181A]"}`,
      })}
      {error && (
        <p id={`${id}-err`} className={`text-[12.5px] leading-snug ${ERR}`}>
          {error}
        </p>
      )}
    </div>
  );
}

function MediaPicker({
  media,
  error,
  note,
}: {
  media: MediaView;
  error?: string;
  note: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const isImg = media.kind === "images";
  const ok = media.count >= media.min;
  const Icon = isImg ? ImagesIcon : VideoCameraIcon;
  const pick = () => input.current?.click();

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: vùng nhận kéo thả; bàn phím dùng các nút chọn file bên trong
    <div
      data-field={media.kind}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        media.add(e.dataTransfer.files);
      }}
      className={`rounded-2xl transition-shadow duration-300 ${over ? "ring-2 ring-[#16181A] ring-offset-4" : ""}`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[13px] font-medium">
          <Icon className="size-4" />
          {isImg ? "Ảnh" : "Video"}
          <span aria-hidden className={ERR}>
            *
          </span>
        </p>
        <span
          className={`rounded-full px-2.5 py-1 text-[12px] font-medium tabular-nums ${ok ? "bg-[#2F6B4F]/10 text-[#2F6B4F]" : "bg-[#16181A]/5"}`}
        >
          {ok
            ? `${media.count} ${isImg ? "ảnh" : "video"}`
            : `${media.count}/${media.min} tối thiểu`}
        </span>
      </div>
      <input
        ref={input}
        type="file"
        accept={isImg ? "image/*" : "video/*"}
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files) media.add(e.target.files);
          e.target.value = ""; // cho phép chọn lại cùng file
        }}
      />
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {media.slots.map((slot, i) => (
          <li key={slot.item?.id ?? `empty-${slot.label}`}>
            {slot.item ? (
              <div className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-[#16181A]/5">
                {isImg ? (
                  // biome-ignore lint/performance/noImgElement: blob: URL xem trước, next/image không xử lý
                  <img
                    src={slot.item.url}
                    alt={slot.label}
                    className="size-full object-cover"
                  />
                ) : (
                  <video
                    src={slot.item.url}
                    muted
                    playsInline
                    preload="metadata"
                    className="size-full object-cover"
                  />
                )}
                <span className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(22,24,26,0.7),transparent)] px-2 pt-6 pb-1.5 text-[11px] font-medium text-white">
                  {slot.label}
                </span>
                <div className="absolute inset-x-1 top-1 flex justify-between">
                  {i > 0 ? (
                    <MiniButton
                      label={`Đưa ${slot.label.toLowerCase()} lên trước`}
                      // biome-ignore lint/style/noNonNullAssertion: đã kiểm tra slot.item
                      onClick={() => media.moveEarlier(slot.item!.id)}
                    >
                      <ArrowLeftIcon className="size-3.5" />
                    </MiniButton>
                  ) : (
                    <span />
                  )}
                  <MiniButton
                    label={`Gỡ ${slot.label.toLowerCase()}`}
                    // biome-ignore lint/style/noNonNullAssertion: đã kiểm tra slot.item
                    onClick={() => media.remove(slot.item!.id)}
                  >
                    <XIcon className="size-3.5" />
                  </MiniButton>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={pick}
                className={`flex aspect-[3/4] w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed px-2 text-center text-[11px] leading-tight transition-colors hover:bg-[#16181A]/4 ${error ? "border-[#B3261E]/50 text-[#B3261E]" : "border-[#16181A]/20 text-[#5E6661]"}`}
              >
                <PlusIcon className="size-5" />
                {slot.label}
              </button>
            )}
          </li>
        ))}
        {ok && (
          <li>
            <button
              type="button"
              onClick={pick}
              className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-1.5 rounded-xl bg-[#16181A]/4 text-[12px] font-medium transition-colors hover:bg-[#16181A]/8"
            >
              <PlusIcon className="size-5" />
              Thêm {isImg ? "ảnh" : "video"}
            </button>
          </li>
        )}
      </ul>
      {error && <p className={`mt-2 text-[12.5px] ${ERR}`}>{error}</p>}
      <p className={`mt-3 text-[12.5px] leading-relaxed ${MUTED}`}>
        {note} Có thể kéo thả nhiều file vào đây.
      </p>
    </div>
  );
}

function MiniButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-8 items-center justify-center rounded-full bg-white/90 text-[#16181A] shadow-sm backdrop-blur transition-transform active:scale-95"
    >
      {children}
    </button>
  );
}
