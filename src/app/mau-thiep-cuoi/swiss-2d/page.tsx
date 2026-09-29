"use client";

import { useWedding } from "@/kit/wedding-context";
import { SwissInvite } from "./_components/swiss-invite";

export default function Swiss2DPage() {
  const wedding = useWedding();
  return <SwissInvite wedding={wedding} />;
}
