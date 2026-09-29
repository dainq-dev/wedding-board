"use client";

import { useWedding } from "@/kit/wedding-context";

export function SwissInvite({ wedding }: { wedding: ReturnType<typeof useWedding> }) {
  return <main aria-label="Wedding invitation">{wedding.data.couple.groom.name} &amp; {wedding.data.couple.bride.name}</main>;
}
