"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useWedding } from "@/wedding/wedding-data-provider";
import { parseMapsUrl } from "../parse-maps-url";
import { imageSlotLabel, videoSlotLabel } from "../slot-label";
import { saveTrial } from "../trial-store";
import type {
  Draft,
  FieldErrors,
  FieldKey,
  MediaItem,
  MediaView,
  SectionStatus,
  TryItView,
} from "./type";
import { isMediaFile, MIN_YEAR, maxBirthYear, validateDraft } from "./validate";

const MAX_VIDEO = 50 * 1024 * 1024; // ảnh không giới hạn dung lượng
const MAX_YEAR = maxBirthYear(); // module scope: cacheComponents cấm new Date() khi render
const EMPTY_PERSON = { name: "", address: "", birthYear: "" };
const FIELD_ORDER: FieldKey[] = [
  "groom.name",
  "groom.address",
  "groom.birthYear",
  "bride.name",
  "bride.address",
  "bride.birthYear",
  "images",
  "videos",
  "mapsUrl",
];

function useMediaList(kind: "images" | "videos") {
  const [items, setItems] = useState<MediaItem[]>([]);
  const all = useRef(items);
  all.current = items;
  // Blob URL chỉ để xem trước; thu hồi khi gỡ ảnh hoặc rời trang.
  useEffect(
    () => () => {
      for (const it of all.current) URL.revokeObjectURL(it.url);
    },
    [],
  );
  return {
    items,
    add: (files: Iterable<File>) => {
      const next = [...files]
        .filter((f) => isMediaFile(f, kind))
        .map((file) => ({
          id: crypto.randomUUID(),
          file,
          url: URL.createObjectURL(file),
        }));
      if (next.length) setItems((prev) => [...prev, ...next]);
    },
    remove: (id: string) =>
      setItems((prev) => {
        const hit = prev.find((it) => it.id === id);
        if (hit) URL.revokeObjectURL(hit.url);
        return prev.filter((it) => it.id !== id);
      }),
    moveEarlier: (id: string) =>
      setItems((prev) => {
        const i = prev.findIndex((it) => it.id === id);
        if (i <= 0) return prev;
        const next = [...prev];
        [next[i - 1], next[i]] = [next[i], next[i - 1]];
        return next;
      }),
  };
}

function mediaView(
  kind: "images" | "videos",
  list: ReturnType<typeof useMediaList>,
  min: number,
  error: string | undefined,
): MediaView {
  const label = kind === "images" ? imageSlotLabel : videoSlotLabel;
  const n = Math.max(min, list.items.length);
  return {
    kind,
    min,
    count: list.items.length,
    slots: Array.from({ length: n }, (_, i) => ({
      label: label(i),
      item: list.items[i],
    })),
    error,
    add: list.add,
    remove: list.remove,
    moveEarlier: list.moveEarlier,
  };
}

export function useTryItForm(): TryItView {
  const { meta, isTrial, reload, clear } = useWedding();
  const need = meta.media;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState<Draft>({
    groom: EMPTY_PERSON,
    bride: EMPTY_PERSON,
    mapsUrl: "",
    date: "",
  });
  const images = useMediaList("images");
  const videos = useMediaList("videos");
  const [showErrors, setShowErrors] = useState(false);
  const [formError, setFormError] = useState<string>();
  const [pending, startTransition] = useTransition();

  // <Activity> giữ state khi rời trang: đóng dialog khi bị ẩn.
  useLayoutEffect(() => () => dialogRef.current?.close(), []);

  const maxYear = MAX_YEAR;
  const errors: FieldErrors = validateDraft(
    draft,
    { images: images.items.length, videos: videos.items.length },
    need,
    maxYear,
  );
  const has = (...keys: FieldKey[]) => keys.some((k) => errors[k]);

  const sections: SectionStatus[] = [
    {
      id: "couple",
      required: true,
      done: !has(
        ...FIELD_ORDER.filter(
          (k) => k.startsWith("groom") || k.startsWith("bride"),
        ),
      ),
    },
    { id: "media", required: true, done: !has("images", "videos") },
    { id: "venue", required: true, done: !has("mapsUrl") },
    { id: "date", required: false, done: draft.date !== "" },
  ];

  const missing: string[] = [];
  if (!sections[0].done) missing.push("thông tin cô dâu chú rể");
  if (errors.images) missing.push(`${need.images - images.items.length} ảnh`);
  if (errors.videos) missing.push(`${need.videos - videos.items.length} video`);
  if (errors.mapsUrl) missing.push("link bản đồ");

  const submit = () => {
    setFormError(undefined);
    const first = FIELD_ORDER.find((k) => errors[k]);
    if (first) {
      setShowErrors(true);
      dialogRef.current
        ?.querySelector(`[data-field="${first}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (videos.items.some((v) => v.file.size > MAX_VIDEO)) {
      setFormError("Mỗi video tối đa 50MB.");
      return;
    }
    const person = (p: Draft["groom"]) => ({
      name: p.name.trim(),
      address: p.address.trim(),
      birthYear: Number(p.birthYear),
    });
    startTransition(async () => {
      try {
        await saveTrial({
          slug: meta.slug,
          groom: person(draft.groom),
          bride: person(draft.bride),
          // biome-ignore lint/style/noNonNullAssertion: đã kiểm tra ở validateDraft
          venue: parseMapsUrl(draft.mapsUrl)!,
          images: images.items.map((it) => it.file),
          videos: videos.items.map((it) => it.file),
          ...(draft.date
            ? { ceremonyDate: new Date(draft.date).toISOString() }
            : {}),
        });
      } catch (e) {
        setFormError(
          e instanceof DOMException && e.name === "QuotaExceededError"
            ? "Trình duyệt không còn đủ chỗ lưu. Hãy bớt vài ảnh hoặc dùng ảnh nhẹ hơn rồi thử lại."
            : "Chưa lưu được dữ liệu. Vui lòng thử lại.",
        );
        return;
      }
      reload();
      dialogRef.current?.close();
    });
  };

  return {
    templateName: meta.name,
    isTrial,
    clear,
    dialogRef,
    open: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
    draft,
    setPerson: (who, field, value) =>
      setDraft((d) => ({ ...d, [who]: { ...d[who], [field]: value } })),
    setMapsUrl: (mapsUrl) => setDraft((d) => ({ ...d, mapsUrl })),
    setDate: (date) => setDraft((d) => ({ ...d, date })),
    venue: parseMapsUrl(draft.mapsUrl),
    images: mediaView("images", images, need.images, errors.images),
    videos:
      need.videos > 0
        ? mediaView("videos", videos, need.videos, errors.videos)
        : null,
    errors,
    showErrors,
    sections,
    missing,
    pending,
    formError,
    submit,
    birthYearRange: { min: MIN_YEAR, max: maxYear },
  };
}
