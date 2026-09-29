"use client";

import { useWedding } from "@/kit/wedding-context";

export function SongHyInvite() {
  const wedding = useWedding();

  return (
    <main>
      <p>Song Hỷ</p>
      <h1>{wedding.groom.name} &amp; {wedding.bride.name}</h1>
    </main>
  );
}
