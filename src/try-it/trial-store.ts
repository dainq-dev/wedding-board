import type { Person, WeddingData } from "@/wedding/types";
import type { Venue } from "./parse-maps-url";

export const TTL_MS = 6 * 60 * 60 * 1000;

export type TrialRecord = {
  slug: string;
  savedAt: number;
  groom: Person;
  bride: Person;
  venue: Venue;
  images: File[];
  videos: File[];
};

const DB = "wedding-trial";
const STORE = "trials";

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () =>
      req.result.createObjectStore(STORE, { keyPath: "slug" });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run<T>(
  mode: IDBTransactionMode,
  fn: (s: IDBObjectStore) => IDBRequest,
): Promise<T> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const req = fn(db.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const isExpired = (r: TrialRecord, now = Date.now()) =>
  now - r.savedAt > TTL_MS;

export async function loadTrial(slug: string): Promise<TrialRecord | null> {
  const r = await run<TrialRecord | undefined>("readonly", (s) => s.get(slug));
  if (!r) return null;
  if (isExpired(r)) {
    await clearTrial(slug);
    return null;
  }
  return r;
}

export async function saveTrial(r: Omit<TrialRecord, "savedAt">) {
  navigator.storage?.persist?.();
  await run("readwrite", (s) => s.put({ ...r, savedAt: Date.now() }));
}

export const clearTrial = (slug: string) =>
  run("readwrite", (s) => s.delete(slug));

// Blob URL phải được revoke bởi người gọi.
export const toWeddingData = (r: TrialRecord): WeddingData => ({
  groom: r.groom,
  bride: r.bride,
  venue: r.venue,
  images: r.images.map((f) => URL.createObjectURL(f)),
  videos: r.videos.map((f) => URL.createObjectURL(f)),
});
