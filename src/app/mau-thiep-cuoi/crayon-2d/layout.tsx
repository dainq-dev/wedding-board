import type { Metadata } from "next";
import { Itim, Mali } from "next/font/google";
import { meta } from "./meta";

// Mali: chữ viết tay tròn trịa như trẻ con. Itim: nội dung dễ đọc, cùng tinh thần.
const display = Mali({
  subsets: ["vietnamese"],
  weight: ["600", "700"],
  variable: "--font-display",
});
const body = Itim({
  subsets: ["vietnamese"],
  weight: "400",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function Crayon2dLayout({
  children,
}: LayoutProps<"/mau-thiep-cuoi/crayon-2d">) {
  return (
    <div className={`${display.variable} ${body.variable}`}>{children}</div>
  );
}
