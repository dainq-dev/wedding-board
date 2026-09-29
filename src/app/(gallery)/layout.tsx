import { Be_Vietnam_Pro, Prata } from "next/font/google";
import { templates } from "@/templates/registry";

const body = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["400", "500"],
});
const display = Prata({
  subsets: ["vietnamese"],
  weight: "400",
  variable: "--font-display",
});

export default function GalleryLayout({ children }: LayoutProps<"/">) {
  return (
    <div
      className={`${body.className} ${display.variable} flex flex-1 flex-col bg-[#F2F3EE] text-[#1C2320]`}
    >
      <header className="mx-auto flex w-full max-w-6xl items-baseline justify-between px-4 pt-6">
        <span className="font-(family-name:--font-display) text-2xl">
          Kệ Thiệp
        </span>
        <span className="text-sm text-[#5E6661]">
          {templates.length} mẫu thiệp
        </span>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4">{children}</main>
    </div>
  );
}
