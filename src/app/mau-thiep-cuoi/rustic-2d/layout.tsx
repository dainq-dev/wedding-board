import type { Metadata } from "next";
import { Alex_Brush, Gelasio } from "next/font/google";
import { meta } from "./meta";

// Alex Brush: nét cọ sơn tay lên gỗ. Gelasio: serif ấm, dễ đọc cho nội dung.
const script = Alex_Brush({
  subsets: ["vietnamese"],
  weight: "400",
  variable: "--font-script",
});
const body = Gelasio({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function Rustic2dLayout({
  children,
}: LayoutProps<"/mau-thiep-cuoi/rustic-2d">) {
  return (
    <div className={`${script.variable} ${body.variable}`}>{children}</div>
  );
}
