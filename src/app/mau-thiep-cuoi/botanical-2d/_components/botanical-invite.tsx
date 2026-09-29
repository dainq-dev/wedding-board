"use client";

import { useWedding } from "@/kit/wedding-provider";

export function BotanicalInvite({ data }: { data: ReturnType<typeof useWedding>["data"] }) {
  return (
    <main>
      <h1>{data.couple.bride.name} &amp; {data.couple.groom.name}</h1>
      <p>{data.wedding.date}</p>
    </main>
  );
}
