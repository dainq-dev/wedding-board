"use client";

import { useEffect } from "react";

// Khoá cuộn trang khi `locked` (vd: trước khi bấm "Mở thiệp").
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [locked]);
}
