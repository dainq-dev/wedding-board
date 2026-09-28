import type { Metadata } from "next";
import { Pacifico, Quicksand } from "next/font/google";
import { meta } from "./meta";

const script = Pacifico({
  subsets: ["vietnamese"],
  weight: "400",
  variable: "--font-script",
});
const sans = Quicksand({ subsets: ["vietnamese"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function BalloonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${script.variable} ${sans.variable}`}>{children}</div>
  );
}
