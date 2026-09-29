"use client";

import { useWedding } from "@/wedding/wedding-data-provider";

export function SongHyInvite() {
  const { data: wedding } = useWedding();

  return (
    <main>
      <p>Song Hỷ</p>
      <h1>
        {wedding.groom.name} &amp; {wedding.bride.name}
      </h1>
    </main>
  );
}
