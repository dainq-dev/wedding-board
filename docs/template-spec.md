# Template Spec — Quy chuẩn tạo 1 mẫu thiệp cưới

> Bắt buộc tuân thủ khi thêm mẫu mới. Đi kèm [0-requirement.md](./0-requirement.md) và [architecture.md](./architecture.md).
> Mẫu tham chiếu: [`src/app/mau-thiep-cuoi/sakura-2d/`](../src/app/mau-thiep-cuoi/sakura-2d/).

Từ khoá: **PHẢI** = bắt buộc, review sẽ chặn. **NÊN** = mặc định làm, bỏ qua phải có lý do.

---

## 1. Cấu trúc file

```
src/app/mau-thiep-cuoi/<slug>/
├── meta.ts              # PHẢI
├── layout.tsx           # PHẢI — font + metadata
├── page.tsx             # PHẢI — chỉ render component chính
├── opengraph-image.png  # NÊN — 1200×630
└── _components/         # mọi component riêng của mẫu
```

- **PHẢI** đặt `slug` dạng `kebab-case`, kết thúc bằng loại công nghệ: `sakura-2d`, `galaxy-3d`.
- **PHẢI** đặt `slug` trong `meta.ts` = tên thư mục.
- **PHẢI** thêm `meta` vào [`src/templates/registry.ts`](../src/templates/registry.ts).
- **KHÔNG** import từ thư mục template khác. Chỉ import từ `@/wedding`, `@/try-it`, `@/components`.
- **KHÔNG** sửa layout chung để phục vụ riêng 1 mẫu. Với `globals.css`, chỉ được thêm keyframes theo §5.

## 2. `meta.ts`

```ts
export const meta: TemplateMeta = {
  slug: "sakura-2d",
  name: "Sakura",                       // ≤ 20 ký tự, không trùng mẫu khác
  description: "…",                     // 1 câu, ≤ 100 ký tự, nói được ý tưởng
  thumbnail: "/templates/sakura-2d/thumb.webp",
  tech: "2d",                           // "2d" | "3d"
  styles: ["minimalist", "floral"],     // chọn từ danh sách chuẩn §2.1
  colors: ["pink", "white"],            // chọn từ danh sách chuẩn §2.1
  tags: ["hoa anh đào"],                // tiếng Việt, tự do, 1–5 tag
  createdAt: "2026-09-28",              // ISO, ngày thêm mẫu
  media: { images: 4, videos: 0 },      // số file BẮT BUỘC khi "Dùng thử"
};
```

### 2.1 Giá trị chuẩn (không tự đặt thêm khi chưa thống nhất)
- `styles`: `minimalist`, `floral`, `vintage`, `modern`, `luxury`, `traditional`, `playful`, `cinematic`
- `colors`: `white`, `pink`, `red`, `gold`, `green`, `blue`, `purple`, `black`, `beige`

### 2.2 Quy tắc `media`
- `images`: **4–12**. Chỉ khai báo số ảnh mẫu thực sự hiển thị. Không khai báo 10 mà chỉ dùng 3.
- `videos`: **0–2**. Mỗi video làm tăng dung lượng lưu trên máy người dùng, chỉ thêm khi layout có chỗ xứng đáng.
- Ảnh/video mẫu trong `sampleData` **PHẢI** ≥ số khai báo. Nếu mẫu cần nhiều hơn, bổ sung vào `public/sample/`.

## 3. `layout.tsx`

```tsx
const serif = Playfair_Display({ subsets: ["vietnamese"], variable: "--font-serif" });

export const metadata: Metadata = { title: meta.name, description: meta.description };

export default function Layout({ children }: LayoutProps<"/mau-thiep-cuoi/<slug>">) {
  return <div className={serif.variable}>{children}</div>;
}
```

- **PHẢI** dùng `next/font` với `subsets: ["vietnamese"]`. Kiểm tra dấu: *Nguyễn Thị Hằng, Trịnh Đức Hưởng*.
- **PHẢI** giới hạn tối đa **2 font** (1 tiêu đề + 1 nội dung).
- **PHẢI** lấy `metadata` từ `meta` (không gõ lại chuỗi).

## 4. `page.tsx` và component chính

```tsx
// page.tsx — Server Component, 1 dòng
export default function Page() { return <SakuraInvite />; }
```

```tsx
// _components/sakura-invite.tsx
"use client";
export function SakuraInvite() {
  const { data } = useWedding();   // PHẢI lấy dữ liệu từ đây
  …
}
```

- **PHẢI** lấy **mọi** dữ liệu cặp đôi từ `useWedding().data`. Không hardcode tên, địa chỉ, ảnh trong JSX, nếu không thì "Dùng thử" sẽ không hoạt động.
- **PHẢI** render đúng `data.images` / `data.videos` theo thứ tự. Người dùng sẽ upload theo thứ tự đó.
- **PHẢI** dùng `<img>` / `<video>` thường (không `next/image`) cho media từ `data`, vì có thể là `blob:` URL.
- **PHẢI** chịu được tên dài (≤ 50 ký tự) mà không vỡ layout.
- **NÊN** chỉ đánh dấu `"use client"` ở component cần, phần tĩnh để Server Component.

### 4.1 Nội dung tối thiểu của 1 thiệp
| Khối | Bắt buộc | Nguồn |
|---|---|---|
| Tên chú rể & cô dâu | ✅ | `data.groom.name`, `data.bride.name` |
| Nhà trai / nhà gái (địa chỉ) | ✅ | `data.groom.address`, `data.bride.address` |
| Album ảnh | ✅ | `data.images` |
| Bản đồ nhà hàng | ✅ | `<MapEmbed venue={data.venue} />` |
| Video | nếu `media.videos > 0` | `data.videos` |
| Lời mời, lịch trình, đếm ngược | tuỳ ý | hardcode trong mẫu |

- **PHẢI** dùng `<MapEmbed>` chung, không tự dựng iframe Google Maps.
- **KHÔNG** hiển thị năm sinh trực tiếp. Nó chỉ dùng cho mẫu cần (vd: tuổi, con giáp).

### 4.2 Không đè lên thành phần chung
Layout chung đã có nút nổi **"← Quay lại"** (góc trên trái) và **"Dùng thử"** (góc dưới phải).
- **PHẢI** chừa 2 góc này, không đặt nội dung quan trọng hay nút bấm ở đó.
- **KHÔNG** dùng `z-index` ≥ 50.

## 5. Style

- **PHẢI** chỉ dùng **Tailwind utility class**. **KHÔNG** viết CSS thuần: không file `.css` / `.module.css` riêng, không `style={{…}}` (trừ giá trị động tính lúc chạy, vd toạ độ particle).
- Giá trị lẻ dùng arbitrary value: `tracking-[0.3em]`, `bg-[#f7e8ec]`, `bg-[radial-gradient(…)]`.
- Font: dùng biến từ `next/font` qua `font-(family-name:--font-script)`.
- Keyframes tự định nghĩa (ngoại lệ duy nhất, vì Tailwind v4 bắt buộc khai báo trong CSS):
  - **PHẢI** thử animation có sẵn (`animate-pulse`, `animate-bounce`…) hoặc GSAP trước.
  - Nếu vẫn cần: thêm vào khối `@theme` trong `globals.css`, **tên bắt đầu bằng slug** để không trùng:
    ```css
    @theme {
      --animate-sakura-2d-fall: sakura-2d-fall 8s linear infinite;
      @keyframes sakura-2d-fall { to { transform: translateY(110vh) rotate(360deg); } }
    }
    ```
    rồi dùng `animate-sakura-2d-fall`.
- **PHẢI** gán màu / font trên phần tử gốc của mẫu, không đặt lên `:root` / `body`.
- **PHẢI** có nền riêng trên phần tử gốc (`min-h-screen bg-…`), không phụ thuộc màu nền mặc định.
- **PHẢI** đạt tương phản chữ ≥ 4.5:1 (chữ trên ảnh cần lớp phủ).

## 6. Responsive (mobile-first)

Thiệp chủ yếu được mở trên điện thoại.
- **PHẢI** thiết kế cho **360px** trước, rồi mở rộng cho `sm` / `lg`.
- **PHẢI** không có thanh cuộn ngang ở 360px.
- **PHẢI** vùng bấm ≥ 44×44px.
- **PHẢI** kiểm tra ở 3 kích thước: 360×740, 768×1024, 1440×900.

## 7. Animation & 3D

### Chung
- **PHẢI** tôn trọng `prefers-reduced-motion`: tắt parallax, particle, auto-scroll; giữ lại fade ngắn.
- **PHẢI** chỉ animate `transform` / `opacity`.
- **PHẢI** không có animation nào chặn việc đọc nội dung > 2 giây (intro dài phải có nút bỏ qua).
- **NÊN** dùng `transition-*` / `animate-*` của Tailwind trước. Chỉ dùng GSAP khi cần timeline / ScrollTrigger.

### 3D (three.js)
- **PHẢI** load scene bằng `next/dynamic(() => import("./scene"), { ssr: false })` bên trong Client Component.
- **PHẢI** có fallback 2D khi không có WebGL hoặc khi `prefers-reduced-motion`. Nội dung thiệp vẫn đọc được đầy đủ.
- **PHẢI** giới hạn `devicePixelRatio` ≤ 2, dừng render loop khi tab ẩn / scene ra khỏi viewport.
- **PHẢI** giải phóng geometry, material, texture, renderer khi unmount.
- **PHẢI** giữ chữ quan trọng (tên, địa chỉ) là **HTML**, không vẽ trong canvas (SEO + accessibility).
- **NÊN** texture ≤ 2048px, định dạng nén (`.webp` / `.ktx2`); model `.glb` ≤ 2MB.

## 8. Âm thanh

- **PHẢI** tắt mặc định; chỉ phát sau khi người dùng bấm.
- **PHẢI** có nút bật/tắt luôn nhìn thấy (không đè §4.2).
- **NÊN** file ≤ 2MB, `.mp3` hoặc `.m4a`.

## 9. Tài nguyên

- **PHẢI** đặt asset riêng trong `public/templates/<slug>/`.
- **PHẢI** dùng ảnh có quyền sử dụng (tự chụp, Unsplash, Pexels…), ghi nguồn vào `public/templates/<slug>/CREDITS.md`.
- **PHẢI** thumbnail tỉ lệ **3:4**, ≥ 600×800, `.webp`.
- **NÊN** ảnh mẫu ≤ 300KB/ảnh.

## 10. Hiệu năng (đo trên mobile, Lighthouse)

| Chỉ số | Mẫu 2D | Mẫu 3D |
|---|---|---|
| Performance | ≥ 90 | ≥ 75 |
| LCP | ≤ 2.5s | ≤ 3.5s |
| CLS | ≤ 0.1 | ≤ 0.1 |
| JS riêng của mẫu (gzip) | ≤ 100KB | ≤ 350KB |

- **PHẢI** không làm tăng JS của trang chủ `/`. So sánh output `bun run build` trước/sau.
- **PHẢI** đặt `width`/`height` hoặc `aspect-*` cho mọi ảnh/video (chống CLS).

## 11. Accessibility

- **PHẢI** dùng đúng 1 `<h1>` (tên cặp đôi). Các khối dùng `<h2>`.
- **PHẢI** có `alt` cho ảnh nội dung; ảnh trang trí dùng `alt=""`.
- **PHẢI** điều hướng được bằng bàn phím, focus nhìn thấy được.
- **PHẢI** `<video>` có `controls` và không tự phát có tiếng.

## 12. Checklist trước khi merge

**Cấu trúc**
- [ ] Thư mục `src/app/mau-thiep-cuoi/<slug>/` đủ `meta.ts`, `layout.tsx`, `page.tsx`
- [ ] `slug` = tên thư mục; đã thêm vào `registry.ts`
- [ ] `styles` / `colors` nằm trong danh sách chuẩn

**Dữ liệu & "Dùng thử"**
- [ ] Mọi dữ liệu cặp đôi lấy từ `useWedding().data`
- [ ] Dùng thử với đúng `media.images` / `media.videos` file → thiệp hiển thị đúng dữ liệu mới
- [ ] Tên 50 ký tự có dấu không vỡ layout
- [ ] Bấm "Xoá dữ liệu dùng thử" → quay về dữ liệu mẫu

**Chất lượng**
- [ ] Chạy tốt ở 360 / 768 / 1440px, không cuộn ngang
- [ ] `prefers-reduced-motion` đã kiểm tra
- [ ] (3D) Tắt WebGL vẫn đọc được thiệp
- [ ] Lighthouse mobile đạt §10
- [ ] Không có CSS thuần; keyframes (nếu có) mang tiền tố slug
- [ ] Không đè nút "Quay lại" / "Dùng thử"
- [ ] Ảnh có nguồn trong `CREDITS.md`

**Build**
- [ ] `bun run build`: route mới hiện `○ (Static)`, JS của `/` không tăng
- [ ] `bunx biome check src` sạch
- [ ] `bun test` pass
