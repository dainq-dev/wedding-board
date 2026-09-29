# Template Spec — Quy chuẩn tạo 1 mẫu thiệp cưới

> Bắt buộc tuân thủ khi thêm mẫu mới. Đi kèm [0-requirement.md](./0-requirement.md) và [architecture.md](./architecture.md).
> Mẫu tham chiếu: [`src/app/mau-thiep-cuoi/sakura-2d/`](../src/app/mau-thiep-cuoi/sakura-2d/).

Từ khoá: **PHẢI** = bắt buộc, review sẽ chặn. **NÊN** = mặc định làm, bỏ qua phải có lý do.

---

## 0. Đẹp và có gu là điều kiện tiên quyết

> Giao diện **đẹp mắt và có gu** là điều kiện tiên quyết của dự án, đứng trên tính năng, số lượng mẫu và tiến độ. Người nhận thiệp là khách mời thật của một đám cưới thật; một giao diện "cho có" là thất lễ với họ và không cặp đôi nào chọn.

- **PHẢI** đọc [visual-quality.md §8 (Gu thiết kế)](./visual-quality.md) và các skill `taste-skill` / `soft-skill` / `redesign-skill` trong `.claude/skills/taste-skill/` **trước khi** thiết kế hoặc code giao diện.
- **PHẢI** mở đầu spec mẫu (`docs/templates/<slug>.md`) bằng **Design Read + 3 dial** (§8.2) và, với 3D, mục **Art direction** (§3.1). Không có hai mục này thì không bắt đầu code.
- **PHẢI** qua **pre-flight gu** (§8.5): có cá tính riêng, không AI tell, mỗi màn có điểm nhìn chính, nổi bật hơn thiệp cao cấp trên thị trường, dám gửi cho ông bà và sếp.
- Đạt đủ checklist mà giao diện vẫn rập khuôn, vô hồn → **chưa xong**. Checklist chỉ bắt lỗi, không thay được gu.
- **PHẢI** đạt [visual-quality.md](./visual-quality.md): không vi phạm điều kiện chặn §2, rubric §5 mọi mục ≥ 4/5, nộp bộ screenshot §6.
- Build / lint / test pass **không** có nghĩa là xong. Mẫu chỉ `✅ Xong` khi chủ dự án duyệt bằng mắt.
- Không đạt chất lượng ở một phần nào → bỏ phần đó hoặc làm lại, **không** merge bản thô "để sửa sau".

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
- **KHÔNG** import từ thư mục template khác. Chỉ import từ `@/wedding`, `@/try-it`, `@/components`, `@/kit`.
- **PHẢI** import gsap + plugins **chỉ** qua `@/kit/gsap` (đăng ký 1 lần duy nhất).
- **PHẢI** dùng animation qua `@/kit/presets` (A1–A12, xem [todo-list §2.2](./todo-list-wedding-page.md)) — không viết timeline thô khi đã có preset.
- **PHẢI** dùng card mở thiệp từ `@/kit/open-gate`; smooth scroll `@/kit/smooth-scroll`; nhạc `@/kit/music`; đếm ngược `<Countdown>` từ `@/kit/countdown-ui` (logic thô: `@/kit/countdown`).
- **PHẢI** lấy ngày cưới qua `weddingDate(data)` từ `@/kit/dates`. **KHÔNG** dùng raw `data.date` (có thể thiếu → fallback `FALLBACK_DATE`).
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

### 2.2 Ảnh cưới mẫu — **BẮT BUỘC HIỂN THỊ ≥ 20 ẢNH**
- Bộ ảnh mẫu chuẩn: `public/wedding-images/0.jpeg` … `19.jpeg` (qua `sampleData.images`). Đây là ảnh cưới thật, đại diện cho thứ khách mời muốn xem nhất.
- **PHẢI** hiển thị **toàn bộ** ảnh trong `data.images` — với dữ liệu mẫu là **tối thiểu 20 ảnh**. 20 là **mức sàn, không phải mức trần**: bố cục phải tự co giãn khi có 20, 30 hay 50 ảnh.
- **KHÔNG** cắt bớt bằng `images.slice(a, b)` hay chọn tay vài index cho phần album / trưng bày. Được phép dùng riêng vài ảnh ở vị trí vai trò (bìa, chú rể, cô dâu — §4.3), nhưng album / gallery vẫn phải chứa mọi ảnh.
- Ảnh phải là **tâm điểm có thiết kế**: bố cục trưng bày đẹp, chuyển ảnh có nhịp (không phải một lưới ô vuông đều tăm tắp), bấm vào xem lớn được (lightbox).
- Mẫu 3D: ảnh **PHẢI** xuất hiện trong chính cảnh 3D (không chỉ ở lưới HTML) theo [visual-quality.md §3.4](./visual-quality.md).
- `meta.media.images` là số ảnh **bắt buộc upload** khi "Dùng thử" (4–12), không phải số ảnh hiển thị. Bố cục vẫn phải đẹp khi người dùng upload ít hơn 20.
- `videos`: **0–2**. Mỗi video làm tăng dung lượng lưu trên máy người dùng, chỉ thêm khi layout có chỗ xứng đáng.

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

### 4.1b Gửi lời chúc & QR mừng cưới — **BẮT BUỘC**
- **PHẢI** có `<GiftButton />` từ `@/kit/gift` trong mọi mẫu: nút *"Gửi lời chúc"* mở modal hiển thị QR nhận quà mừng (`public/QR-nhan-tien-cuoi.jpg`), có nút lưu mã QR.
- **PHẢI** đặt ở vị trí trân trọng, dễ thấy: phần lời cảm ơn / kết thiệp (hoặc section mừng cưới riêng). Không làm nút nổi đè nội dung.
- **NÊN** truyền `className` để nút khớp tông của mẫu (màu, bo góc, chữ); modal giữ thiết kế chung, không tự chế modal QR khác.
- **KHÔNG** tự dựng QR / thông tin tài khoản riêng trong mẫu.

### 4.2 Không đè lên thành phần chung
Layout chung đã có nút nổi **"← Quay lại"** (góc trên trái) và **"Dùng thử"** (góc dưới phải).
- **PHẢI** chừa 2 góc này, không đặt nội dung quan trọng hay nút bấm ở đó.
- **KHÔNG** dùng `z-index` ≥ 50.

### 4.3 Thứ tự ảnh cố định
`images[0]` ảnh bìa · `images[1]` chú rể · `images[2]` cô dâu · `images[3..]` album (theo [todo-list §2.1](./todo-list-wedding-page.md)).
- Form "Dùng thử" tự hiển thị nhãn cho từng vị trí theo đúng thứ tự này.
- **PHẢI** render `data.images` đúng thứ tự và dùng đúng vai trò từng ảnh (bìa cho card mở, ảnh 1–2 cho chân dung chú rể/cô dâu, phần còn lại cho chuyện tình/album).

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
- **PHẢI** đạt [visual-quality.md §3](./visual-quality.md): art direction viết trước khi code, vật thể hero là model `.glb` hoặc procedural đạt chất lượng model (không primitive thô / flat-shading không chủ đích), HDRI environment + key light + bóng mềm, hậu kỳ (`@react-three/postprocessing`: bloom chọn lọc, vignette, khử răng cưa), ảnh cưới có khung vật liệu.
- **PHẢI** canvas `fixed -z-10` nằm trong phần tử gốc có `isolate` (stacking context), nếu không nền của gốc sẽ che mất toàn bộ cảnh.
- **PHẢI** camera nhìn về phía nội dung sắp tới. Không chép quaternion của `Object3D.lookAt` sang camera (Object3D nhìn +z, camera nhìn −z).
- **PHẢI** material có `map` tải bất đồng bộ được tạo lại khi texture về (`key={tex?.uuid}`), nếu không shader không bật map → khối trắng/đen.
- **NÊN** texture ≤ 2048px, định dạng nén (`.webp` / `.ktx2`); model `.glb` ≤ 2MB, nén Draco/Meshopt bằng `gltf-transform`.

## 8. Âm thanh — **BẮT BUỘC CÓ NHẠC** (theo [todo-list §2.4](./todo-list-wedding-page.md))

- **Mọi trang dùng chung một bài: `public/music-wedding.mp3`** (quyết định của chủ dự án). **KHÔNG** thêm file nhạc / hiệu ứng âm thanh riêng cho từng mẫu.
- **PHẢI** dùng `useMusic()` + `<MusicToggle>` từ `@/kit/music` (hook đã cố định bài nhạc chung) — không tự chế `<audio>` riêng.
- **PHẢI** bắt đầu phát **bên trong click handler của card C1 OpenGate** (Chrome autoplay policy: phát ngoài user gesture sẽ bị chặn).
- **PHẢI** có nút bật/tắt luôn nhìn thấy (không đè §4.2); chưa bấm mở thiệp thì chưa phát.

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
| JS riêng của mẫu (gzip) | ≤ 100KB | ≤ 420KB (gồm hậu kỳ ~60KB) |
| FPS khi cuộn (iPhone 12 / Pixel 6) | ≥ 55 | ≥ 50, tự hạ tầng bằng `PerformanceMonitor` |

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

**Thẩm mỹ & gu** ([visual-quality.md](./visual-quality.md)) — điều kiện tiên quyết, chặn merge
- [ ] Spec mẫu có Design Read + 3 dial (§8.2); giao diện thực tế khớp với nó
- [ ] Pre-flight gu §8.5 đạt hết; không AI tell nào của taste-skill §9
- [ ] Văn phong trang trọng, đúng nghi thức; không emoji trên nút / tiêu đề; không dấu `—` trong chữ hiển thị (§8.4)
- [ ] Không vi phạm mục nào ở §2 (điều kiện chặn) trên cả 3 kích thước
- [ ] (3D) Mục *Art direction* có trong spec mẫu: tham chiếu, 3 hero shot, phong cách hình khối, chất liệu
- [ ] Trưng bày ảnh đẹp với cả 8 và 24 ảnh
- [ ] Tự chấm rubric §5: mọi mục ≥ 4/5, ghi điểm vào PR
- [ ] Bộ screenshot §6 đính kèm PR
- [ ] Chủ dự án đã duyệt trên điện thoại thật (chỉ sau bước này mới `✅ Xong`)

**Build** — điều kiện cần, không phải điều kiện đủ
- [ ] `bun run build`: route mới hiện `○ (Static)`, JS của `/` không tăng
- [ ] `bunx biome check src` sạch
- [ ] `bun test` pass
