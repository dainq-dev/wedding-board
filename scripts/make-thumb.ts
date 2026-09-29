// bun scripts/make-thumb.ts <slug>
// Đổi public/templates/<slug>/thumb.svg → thumb.webp 600×800.
// sharp cài qua ignoreScripts nên binary native CÓ THỂ thiếu — thử import
// trước, thất bại thì báo để orchestrator quyết meta.thumbnail dùng .svg.

const slug = process.argv[2];
if (!slug || slug.startsWith("--")) {
  console.error("Usage: bun scripts/make-thumb.ts <slug>");
  process.exit(1);
}

let sharpMod: typeof import("sharp") | undefined;
try {
  sharpMod = await import("sharp");
} catch {
  // binary native chưa tải về (ignoreScripts) hoặc sharp chưa cài
}
if (typeof sharpMod?.default !== "function") {
  console.error("sharp binary thiếu — thumbnail giữ dạng SVG");
  process.exit(1);
}

const dir = `public/templates/${slug}`;
const src = Bun.file(`${dir}/thumb.svg`);
if (!(await src.exists())) {
  console.error(`Không thấy: ${dir}/thumb.svg`);
  process.exit(1);
}

await sharpMod
  .default(await src.bytes(), { density: 300 }) // svg raster ở 300dpi mới nét khi ép về 600×800
  .resize(600, 800, { fit: "inside" })
  .webp({ quality: 82 })
  .toFile(`${dir}/thumb.webp`);
console.log(`${dir}/thumb.webp`);

export {};
