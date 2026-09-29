import type { Metadata } from "next";
import { Lexend, Pangolin } from "next/font/google";
import { meta } from "./meta";

// Pangolin: nét phấn viết tay cho tên & tiêu đề. Lexend: nội dung, dễ đọc trên nền tối.
const display = Pangolin({
  subsets: ["vietnamese"],
  weight: "400",
  variable: "--font-display",
});
const body = Lexend({
  subsets: ["vietnamese"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function Cafe2dLayout({
  children,
}: LayoutProps<"/mau-thiep-cuoi/cafe-2d">) {
  return (
    <div className={`${display.variable} ${body.variable}`}>{children}</div>
  );
}
