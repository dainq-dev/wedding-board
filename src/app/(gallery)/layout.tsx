import { Be_Vietnam_Pro } from "next/font/google";

const font = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["400", "600"],
});

export default function GalleryLayout({ children }: LayoutProps<"/">) {
  return (
    <div className={`${font.className} flex flex-1 flex-col bg-zinc-50`}>
      <header className="border-b bg-white px-4 py-4">
        <div className="mx-auto max-w-6xl text-xl font-semibold">
          Mẫu thiệp cưới online
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {children}
      </main>
    </div>
  );
}
