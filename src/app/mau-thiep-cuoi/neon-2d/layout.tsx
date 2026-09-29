import type { Metadata } from "next";
import { Epilogue, Unbounded } from "next/font/google";
import { meta } from "./meta";

// Unbounded: chữ biển hiệu tròn, rộng như ống neon uốn. Epilogue: nội dung gọn, đọc tốt trên nền tối.
const display = Unbounded({
  subsets: ["vietnamese"],
  weight: ["300", "500", "600"],
  variable: "--font-display",
});
const body = Epilogue({
  subsets: ["vietnamese"],
  weight: ["400", "500"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function Neon2dLayout({
  children,
}: LayoutProps<"/mau-thiep-cuoi/neon-2d">) {
  return (
    <div className={`${display.variable} ${body.variable}`}>{children}</div>
  );
}
