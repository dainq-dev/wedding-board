"use client";

import { useWedding } from "@/kit/wedding-context";

export function AoDaiInvite() {
  const { data } = useWedding();
  return (
    <main>
      <p>{data.couple.groom.name} &amp; {data.couple.bride.name}</p>
    </main>
  );
}
