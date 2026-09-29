import type { RefObject } from "react";
import type { Venue } from "../parse-maps-url";

export type Who = "groom" | "bride";

export type PersonDraft = { name: string; address: string; birthYear: string };

export type Draft = {
  groom: PersonDraft;
  bride: PersonDraft;
  mapsUrl: string;
  date: string; // datetime-local, rỗng = dùng ngày mẫu
};

export type MediaItem = { id: string; file: File; url: string };

export type FieldKey =
  | `${Who}.${keyof PersonDraft}`
  | "images"
  | "videos"
  | "mapsUrl";

export type FieldErrors = Partial<Record<FieldKey, string>>;

export type SectionId = "couple" | "media" | "venue" | "date";

export type SectionStatus = { id: SectionId; done: boolean; required: boolean };

export type MediaSlot = {
  label: string;
  item?: MediaItem;
};

export type MediaView = {
  kind: "images" | "videos";
  min: number;
  count: number;
  slots: MediaSlot[];
  error?: string;
  add: (files: Iterable<File>) => void;
  remove: (id: string) => void;
  moveEarlier: (id: string) => void;
};

export type TryItView = {
  templateName: string;
  isTrial: boolean;
  clear: () => Promise<void>;
  dialogRef: RefObject<HTMLDialogElement | null>;
  open: () => void;
  close: () => void;
  draft: Draft;
  setPerson: (who: Who, field: keyof PersonDraft, value: string) => void;
  setMapsUrl: (value: string) => void;
  setDate: (value: string) => void;
  venue: Venue | null;
  images: MediaView;
  videos: MediaView | null;
  errors: FieldErrors;
  showErrors: boolean;
  sections: SectionStatus[];
  missing: string[];
  pending: boolean;
  formError?: string;
  submit: () => void;
  birthYearRange: { min: number; max: number };
};
