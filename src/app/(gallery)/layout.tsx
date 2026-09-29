import { Be_Vietnam_Pro, Prata } from "next/font/google";
import { templates } from "@/templates/registry";

const body = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600"],
});
const display = Prata({
  subsets: ["vietnamese"],
  weight: "400",
  variable: "--font-display",
});

export default function GalleryLayout({ children }: LayoutProps<"/">) {
  return (
    <div
      className={`${body.className} ${display.variable} flex flex-1 flex-col bg-[#F7F5F0] text-[#16181A]`}
    >
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 pt-6 sm:px-6">
        <span className="flex items-center gap-2 font-(family-name:--font-display) text-2xl">
          <span
            aria-hidden
            className="flex size-8 items-center justify-center rounded-full bg-[#16181A] text-sm text-[#F3D9A4]"
          >
            ♥
          </span>
          Kệ Thiệp
        </span>
        <a
          href="#mau"
          className="rounded-full border border-[#16181A]/10 bg-white px-4 py-2 text-sm transition-colors hover:border-[#16181A]/35"
        >
          {templates.length} mẫu thiệp
        </a>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
        {children}
      </main>
      <footer className="border-t border-[#16181A]/8 py-8 text-center text-sm text-[#5E6661]">
        Kệ Thiệp · Dữ liệu dùng thử chỉ lưu trên trình duyệt của bạn
      </footer>
    </div>
  );
}
