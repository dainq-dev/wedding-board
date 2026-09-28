"use client";

import {
  startTransition,
  useActionState,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { MapEmbed } from "@/components/map-embed";
import { useWedding } from "@/wedding/wedding-data-provider";
import { parseMapsUrl } from "./parse-maps-url";
import { saveTrial } from "./trial-store";

const MAX_IMAGE = 10 * 1024 * 1024;
const MAX_VIDEO = 50 * 1024 * 1024;
const MIN_YEAR = 1940;
const MAX_YEAR = new Date().getFullYear() - 18;

type State = { error?: string };

function files(fd: FormData, key: string) {
  return fd
    .getAll(key)
    .filter((f): f is File => f instanceof File && f.size > 0);
}

function person(fd: FormData, who: "groom" | "bride") {
  return {
    name: String(fd.get(`${who}Name`)).trim(),
    address: String(fd.get(`${who}Address`)).trim(),
    birthYear: Number(fd.get(`${who}BirthYear`)),
  };
}

export function TryItDialog() {
  const { meta, isTrial, reload, clear } = useWedding();
  const dialog = useRef<HTMLDialogElement>(null);
  const [mapsUrl, setMapsUrl] = useState("");
  const venue = parseMapsUrl(mapsUrl);
  const { images: needImages, videos: needVideos } = meta.media;

  const [state, submit, pending] = useActionState<State, FormData>(
    async (_prev, fd) => {
      const images = files(fd, "images");
      const videos = files(fd, "videos");
      const groom = person(fd, "groom");
      const bride = person(fd, "bride");
      for (const p of [groom, bride])
        if (p.birthYear < MIN_YEAR || p.birthYear > MAX_YEAR)
          return {
            error: `Năm sinh phải trong khoảng ${MIN_YEAR}–${MAX_YEAR}.`,
          };
      if (images.length !== needImages)
        return {
          error: `Cần đúng ${needImages} ảnh (đang có ${images.length}).`,
        };
      if (videos.length !== needVideos)
        return {
          error: `Cần đúng ${needVideos} video (đang có ${videos.length}).`,
        };
      if (images.some((f) => f.size > MAX_IMAGE))
        return { error: "Mỗi ảnh tối đa 10MB." };
      if (videos.some((f) => f.size > MAX_VIDEO))
        return { error: "Mỗi video tối đa 50MB." };
      if (!venue)
        return {
          error:
            "Link Google Maps không hợp lệ. Mở link trên trình duyệt máy tính rồi copy URL trên thanh địa chỉ.",
        };
      try {
        await saveTrial({
          slug: meta.slug,
          groom,
          bride,
          venue,
          images,
          videos,
        });
      } catch (e) {
        if (e instanceof DOMException && e.name === "QuotaExceededError")
          return {
            error: "Trình duyệt hết dung lượng, hãy giảm kích thước file.",
          };
        throw e;
      }
      reload();
      dialog.current?.close();
      return {};
    },
    {},
  );

  // <Activity> giữ state khi rời trang: đóng dialog khi bị ẩn.
  useLayoutEffect(() => () => dialog.current?.close(), []);

  return (
    <>
      <div className="fixed right-4 bottom-4 z-50 flex gap-2">
        {isTrial && (
          <button
            type="button"
            onClick={clear}
            className="rounded-full bg-white/90 px-4 py-2 text-sm shadow"
          >
            Xoá dữ liệu dùng thử
          </button>
        )}
        <button
          type="button"
          onClick={() => dialog.current?.showModal()}
          className="rounded-full bg-black px-5 py-2 text-sm text-white shadow"
        >
          Dùng thử
        </button>
      </div>

      <dialog
        ref={dialog}
        className="m-auto w-full max-w-lg rounded-xl p-0 backdrop:bg-black/50"
      >
        <form
          // Không dùng action={submit}: React tự reset form sau action, người dùng sẽ mất file đã chọn khi lỗi.
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            startTransition(() => submit(fd));
          }}
          className="flex flex-col gap-4 p-6 text-sm"
        >
          <h2 className="text-lg font-semibold">Dùng thử mẫu {meta.name}</h2>
          <p className="text-zinc-500">
            Dữ liệu chỉ lưu trên trình duyệt này, tự xoá sau 6 giờ, không ai
            khác xem được.
          </p>

          {(["groom", "bride"] as const).map((who) => (
            <fieldset key={who} className="grid gap-2">
              <legend className="font-medium">
                {who === "groom" ? "Chú rể" : "Cô dâu"}
              </legend>
              <input
                name={`${who}Name`}
                required
                maxLength={50}
                placeholder="Họ tên"
                aria-label="Họ tên"
                className="rounded border px-3 py-2"
              />
              <input
                name={`${who}Address`}
                required
                placeholder="Địa chỉ"
                aria-label="Địa chỉ"
                className="rounded border px-3 py-2"
              />
              <input
                name={`${who}BirthYear`}
                required
                type="number"
                min={MIN_YEAR}
                max={MAX_YEAR}
                placeholder="Năm sinh"
                aria-label="Năm sinh"
                className="rounded border px-3 py-2"
              />
            </fieldset>
          ))}

          <label className="grid gap-1">
            Ảnh (đúng {needImages} ảnh, ≤ 10MB/ảnh)
            <input
              name="images"
              type="file"
              accept="image/*"
              multiple
              required
            />
          </label>
          {needVideos > 0 && (
            <label className="grid gap-1">
              Video (đúng {needVideos} video, ≤ 50MB/video)
              <input
                name="videos"
                type="file"
                accept="video/*"
                multiple
                required
              />
            </label>
          )}

          <label className="grid gap-1">
            Link Google Maps nhà hàng
            <input
              name="mapsUrl"
              required
              value={mapsUrl}
              onChange={(e) => setMapsUrl(e.target.value)}
              placeholder="https://www.google.com/maps/place/..."
              className="rounded border px-3 py-2"
            />
          </label>
          {venue && <MapEmbed venue={venue} className="h-48 w-full rounded" />}

          {state.error && (
            <p role="alert" className="text-red-600">
              {state.error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className="px-4 py-2"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            >
              {pending ? "Đang lưu…" : "Xem thiệp của tôi"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
