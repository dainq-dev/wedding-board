"use client";

import { useWedding } from "@/hooks/use-wedding";

export function BohoInvite() {
  const wedding = useWedding();

  return <main>{wedding.couple.groom} & {wedding.couple.bride}</main>;
}
