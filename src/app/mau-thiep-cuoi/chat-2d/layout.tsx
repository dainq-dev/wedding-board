import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { meta } from "./meta";

// Một font duy nhất như giao diện app nhắn tin.
const sans = Plus_Jakarta_Sans({
  subsets: ["vietnamese"],
  weight: ["300", "500", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function Chat2dLayout({
  children,
}: LayoutProps<"/mau-thiep-cuoi/chat-2d">) {
  return <div className={sans.variable}>{children}</div>;
}
