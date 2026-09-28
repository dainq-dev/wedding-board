# 2D-05 · `editorial-2d` · Tạp Chí Cưới

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md).

---

## 1. Concept

**Một câu:** Thiệp là một số tạp chí thời trang đặc biệt, với cặp đôi lên trang bìa: bìa tràn màn hình, lật bìa ra là mục lục, bài phỏng vấn, trang ảnh thời trang và "lịch sự kiện", khép lại bằng bìa sau.

**Cảm xúc muốn gợi:** sang, tự tin, hiện đại, hơi "high-fashion". Khách thấy cặp đôi như ngôi sao trang bìa.

**Phù hợp với:** cặp đôi có bộ ảnh cưới thời trang/studio, thích đen trắng và typography mạnh, cưới khách sạn, rooftop.

**Khác các mẫu khác ở chỗ:**
- **Typography là hình ảnh chính**: tên và tiêu đề cỡ cực lớn, **cắt mép màn hình**, chữ đè lên ảnh.
- **Lưới 12 cột kiểu tạp chí** (trên mobile là lưới 6 cột), số trang và running header ở mọi section như trang in.
- **Mục lục bấm được** nhảy tới từng "bài" (ScrollSmoother `scrollTo`).
- Chuyển cảnh chủ yếu là **T1 với chữ trượt theo dòng** và ảnh parallax `data-speed`; chỉ có 1 cú lật bìa T7 ở đầu. Không pin, không xếp chồng — nhịp nhanh, sắc như lật tạp chí.

**Moodboard:** bìa Vogue/Harper's Bazaar, font Didone tương phản cao, khoảng trắng rộng, dấu đỏ nhỏ như logo tạp chí, ảnh đen trắng full-bleed, pull-quote cỡ lớn.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `paper` | `#FFFFFF` | Nền trang |
| `surface` | `#F3F1EE` | Khối nền phụ (Q&A, lịch sự kiện) |
| `ink` | `#111111` | Chữ, tiêu đề, khối đen |
| `ink-soft` | `#5C5C5C` | Chú thích, running header |
| `red` | `#B91C1C` | Nhấn duy nhất: logo tạp chí, số trang, gạch chân quote |
| `line` | `#D6D3CE` | Kẻ cột, kẻ ngang |

Tương phản: `ink` trên `paper` ≈ 18.9:1 ✅; `ink-soft` trên `paper` ≈ 6.7:1 ✅; `red` trên `paper` ≈ 6.5:1 ✅; trắng trên `ink` ≈ 18.9:1 ✅. Chữ trắng đè ảnh bìa: bắt buộc lớp `bg-gradient-to-b from-black/50 via-transparent to-black/60`.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Logo tạp chí | Playfair Display 900, VIẾT HOA, tracking -0.02em | 64px | 180px | "LOVE", tràn ngang |
| Tên cặp đôi (bìa/tiêu đề) | Playfair Display 900 italic | 56px / 0.9 | 160px | Cắt mép, `whitespace-nowrap` ở desktop |
| Tiêu đề bài | Playfair Display 700 | 32px / 1.05 | 64px | |
| Pull-quote | Playfair Display 400 italic | 28px / 1.2 | 48px | |
| Nhãn / running header | Manrope 700, VIẾT HOA, tracking 0.25em | 10px | 11px | "SỐ ĐẶC BIỆT · THÁNG 11" |
| Nội dung | Manrope 400 | 15px / 1.65 | 16px | 2 cột trên desktop |
| Drop cap | Playfair Display 900 | 64px | 96px | Chữ đầu bài phỏng vấn |

Hai font có subset `vietnamese`. Kiểm tra: Playfair 900 italic với "Nguyễn Thị Hằng" ở 56px — dấu chồng (ễ, ằ) không được chạm dòng trên → line-height tối thiểu 0.95 khi có dấu.

### Hình khối và chất liệu
- **Radius 0**. Kẻ `1px line` giữa các cột.
- **Ảnh**: full-bleed hoặc theo cột lưới, không bo, không bóng.
- **Running header** mỗi section: trái = tên tạp chí, phải = số trang `P. 04` (màu `red`). Đặt trong section (không fixed) để không đè nút chung.
- **Motion**: ease `expo.out` 1.0s cho chữ; ảnh parallax `data-speed` 0.85–1.15. Không nảy, không xoay.

---

## 3. Nhạc

- **Tâm trạng**: chill-house / deep house thời trang, beat nhẹ, như nhạc sàn diễn, không lời.
- **Tempo**: 105–118 BPM. **Độ dài**: 2:30–3:00, lặp.
- **Từ khoá Pixabay**: `fashion chill house`, `runway deep house minimal`
- **Hành vi**: phát khi bấm "Mở số báo" (C1), âm lượng 0 → 0.5 (thấp hơn mẫu khác vì có beat) trong 1.5s. Ẩn tab → dừng.

---

## 4. Cấu trúc trang

```
┌───────────────────────────┐
│ C1  Bìa trước              │ 100svh  fixed → T7 lật bìa
├───────────────────────────┤
│     Mục lục (P.02)         │ 100svh  T1   ← bấm → nhảy tới bài
│ C2  Tiêu đề "số đặc biệt"  │ 100svh  T1   chữ cực lớn cắt mép
│ C3  Phỏng vấn Q&A          │ 160svh  T1   2 cột
│ C4  Pull-quote + chuyện    │ 140svh  T1   lưới 12 cột, A6 gạch chân
│ C8  Fashion spread (ảnh)   │ 240svh  T1   ảnh tràn lề, A4 data-speed
│ C5+C6+C7 Lịch sự kiện      │ 160svh  T1   bảng kiểu "agenda"
│ C15 Phiếu độc giả (RSVP)   │ 100svh  T1
│ C10 Bìa sau                │ 100svh  A9 marquee tên
└───────────────────────────┘
```
Lưới: mobile `grid-cols-6 gap-x-3 px-4`, desktop `grid-cols-12 gap-x-6 px-[6vw]`. Mọi section đặt nội dung theo cột (ghi rõ `col-span` trong wireframe).

---

## 5. Chi tiết từng section

### C1 · Bìa trước

**Wireframe (360px):**
```
┌────────────────────────────┐
│ ←(nút chung)        (♪)    │
│LOVE                        │  ← logo 64px, tràn trái, trắng + chấm đỏ
│SỐ ĐẶC BIỆT · 11/2026       │  ← nhãn 10px
│┌──────────────────────────┐│
││                          ││  ← images[0] full-bleed (object-cover)
││      (ảnh bìa)           ││
││                          ││
││ Minh                     ││  ← tên 56px italic đè ảnh, cắt mép phải
││ Quân &                   ││
││ Thu Hà                   ││
││ "Chúng tôi nói 'Có'"     ││  ← cover line 14px
│└──────────────────────────┘│
│ [ MỞ SỐ BÁO → ]            │  ← nút đen chữ trắng, căn trái (tránh góc
│                            │     dưới phải của nút "Dùng thử")
└────────────────────────────┘
```

**Nội dung:** logo *"LOVE"*, nhãn *"SỐ ĐẶC BIỆT · THÁNG {MM}/{yyyy}"* (từ `date` ⚠️, fallback 11/2026), tên, 2 cover line viết sẵn: *"Chúng tôi nói 'Có'"*, *"Bên trong: toàn bộ lịch trình ngày trọng đại"*.

**Animation vào:**
| t | Hành động |
|---|---|
| 0.0s | Ảnh A3 (clip từ dưới, 1.1s) |
| 0.3s | Logo "LOVE" từng chữ `yPercent 100 → 0` stagger 0.05 (`expo.out`) |
| 0.7s | Tên A2 theo dòng |
| 1.2s | Cover line + nút A1 |

**Khi bấm (tổng 1.1s):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc phát |
| 0.0s | Bìa `rotateY 0 → -110°` quanh mép trái (`origin-left`, `perspective-[2000px]`), 0.9s `power3.inOut`; kèm bóng tối dần trên mục lục phía dưới (`opacity 0.4 → 0`) |
| 0.9s | Bìa `autoAlpha 0`, mở khoá cuộn |

**Reduced-motion:** crossfade 0.3s.
**Edge case:** tên dài → chữ tên co bằng `text-[clamp(2.5rem,14vw,10rem)]` và cho phép xuống dòng; không cắt mép khi tên > 16 ký tự (cắt mép chỉ đẹp với tên ngắn).

---

### Mục lục (P.02)

```
┌────────────────────────────┐
│ LOVE                 P. 02 │  ← running header
│ MỤC LỤC                    │  ← Playfair 32px
│ ────────────────────────── │
│ 04  Số đặc biệt            │  ← mỗi dòng là <a> ≥ 44px cao
│ 06  "Chúng tôi đã gặp nhau │     số trang đỏ, tiêu đề Playfair 20px
│      như thế nào"          │
│ 08  Chuyện tình            │
│ 10  Khoảnh khắc            │
│ 14  Lịch sự kiện           │
│ 16  Thư độc giả            │
│ ┌──────┐ Ảnh nhỏ images[1] │  ← thumbnail cột phải (desktop) /
│ └──────┘ + images[2]       │     dưới cùng (mobile)
└────────────────────────────┘
```
**Hành vi:** bấm → `smoother.scrollTo("#bai-x", true, "top top")` (reduced-motion: `scrollIntoView` tức thời).
**Animation:** các dòng A1 stagger 0.06; đường kẻ ngang A6 từ trái sang.

---

### C2 · Tiêu đề số đặc biệt

```
┌────────────────────────────┐
│ LOVE                 P. 04 │
│ SỐ ĐẶC BIỆT                │
│MINH QUÂN                   │  ← Playfair 900 72px, 2 dòng, tràn
│      & THU HÀ              │     cả hai mép (translateX)
│ ┌───────┐                  │
│ │ Nº 14 │ Số phát hành     │  ← số = ngày cưới; "14.11.2026" nhỏ
│ └───────┘ đặc biệt         │
│ Trân trọng kính mời quý    │  ← Manrope 15px, col-span-5
│ khách đến dự lễ thành hôn  │
│ của chúng tôi.             │
└────────────────────────────┘
```
**Animation:** dòng tên 1 trượt `x: -30% → 0`, dòng 2 `x: 30% → 0`, theo scrub (0 → 60% section), tạo cảm giác hai tên tiến vào nhau. "Nº 14" đếm lên (`snap: 1`).

---

### C3 · Phỏng vấn Q&A

```
┌────────────────────────────┐
│ LOVE                 P. 06 │
│ "CHÚNG TÔI ĐÃ GẶP          │  ← tiêu đề bài
│  NHAU NHƯ THẾ NÀO"         │
│ ┌──────────┐ ┌──────────┐  │
│ │images[1] │ │images[2] │  │  ← 2 chân dung 3:4, col-span-3 mỗi ảnh
│ └──────────┘ └──────────┘  │
│ CHÚ RỂ        CÔ DÂU       │
│ Minh Quân     Thu Hà       │
│ Nhà trai:     Nhà gái:     │
│ {groom.addr}  {bride.addr} │
│ ────────────────────────── │
│ H: Ấn tượng đầu tiên?      │  ← câu hỏi Manrope 700
│ ANH: "Nụ cười…"            │  ← trả lời 400; drop cap ở câu đầu
│ EM: "Anh ấy đến muộn…"     │
│ H: Điều khiến bạn chắc     │
│    chắn?                   │
│ …                          │
└────────────────────────────┘
```
**Nội dung (viết sẵn, 3 cặp hỏi–đáp):**
1. *Ấn tượng đầu tiên?* — Anh: *"Nụ cười của em, và việc em cười trước khi anh kịp nói gì."* — Em: *"Anh ấy đến muộn 15 phút, nhưng mang theo hai ly cà phê."*
2. *Khoảnh khắc biết đây là người ấy?* — Anh: *"Khi em ngủ quên trên vai anh suốt chuyến xe."* — Em: *"Khi anh nhớ món em không ăn được."*
3. *Lời nhắn cho khách mời?* — Cả hai: *"Hãy đến, ăn thật ngon và nhảy thật vui cùng chúng tôi."*
Tên bố mẹ ⚠️ chưa có → không có dòng "Con ông bà…".
**Animation:** ảnh A3; đoạn văn A1 theo từng đoạn; drop cap `scale 0.6 → 1` + `opacity`.
**Desktop:** Q&A chia 2 cột báo (`columns-2 gap-10`), ảnh nằm col 1–5, bài col 7–12.

---

### C4 · Pull-quote + chuyện tình

```
┌────────────────────────────┐
│ LOVE                 P. 08 │
│  "Yêu là cùng nhau nhìn    │  ← pull-quote 28px italic, col 1–6
│   về một hướng."           │
│   ━━━━━━━━━━━━━            │  ← gạch đỏ A6 vẽ dưới quote theo scrub
│ ┌─────────────────┐        │
│ │   images[3]     │ 2019   │  ← ảnh col 1–4, năm + đoạn col 5–6
│ └─────────────────┘ Gặp gỡ │
│      ┌─────────────┐       │
│ 2022 │  images[4]  │       │  ← so le
│ Yêu  └─────────────┘       │
│ ┌─────────────────┐ 2025   │
│ │   images[5]     │ Cầu hôn│
│ └─────────────────┘        │
└────────────────────────────┘
```
**Nội dung:** quote viết sẵn (không ghi tác giả); 3 mốc năm + 1 câu mỗi mốc viết sẵn.
**Animation:** gạch đỏ A6 scrub; ảnh A3 + `data-speed` 0.9/1.1 xen kẽ; năm Playfair 900 `yPercent 100 → 0`.

---

### C8 · Fashion spread (album)

```
┌────────────────────────────┐
│ LOVE                 P. 10 │
│┌──────────────────────────┐│
││        images[0]         ││  ← full-bleed 4:5, data-speed 0.85
│└──────────────────────────┘│
│ Ảnh: bìa · Trang phục cưới │  ← chú thích 10px uppercase
│          ┌───────────────┐ │
│ KHOẢNH   │   images[6]   │ │  ← chữ dọc (writing-mode) cột trái
│ KHẮC     │               │ │     `[writing-mode:vertical-rl]`
│          └───────────────┘ │
│┌────────────┐┌──────────┐  │
││ images[7]  ││images[4] │  │  ← 2 ảnh cột lệch chiều cao
│└────────────┘└──────────┘  │
└────────────────────────────┘
```
**Hành vi:** bấm ảnh → A10 lightbox (nền trắng, chú thích dưới).
**Animation:** A4 `data-speed`; ảnh full-bleed có scale nhẹ `1.08 → 1` scrub. Reduced-motion: tắt data-speed.

---

### C5 + C6 + C7 · Lịch sự kiện

```
┌────────────────────────────┐
│ LOVE                 P. 14 │
│ LỊCH SỰ KIỆN               │
│ ┌────────────────────────┐ │  ← khối surface
│ │ THỨ BẢY                │ │
│ │ 14.11                  │ │  ← Playfair 900 72px
│ │ 2026   CÒN 45 NGÀY     │ │  ← Countdown rút gọn (ngày) + A7 giờ:phút
│ ├────────────────────────┤ │
│ │ 10:00 │ LỄ CƯỚI        │ │  ← bảng agenda, kẻ line
│ │       │ Tư gia nhà trai│ │
│ │       │ {groom.address}│ │
│ ├───────┼────────────────┤ │
│ │ 18:00 │ TIỆC CƯỚI      │ │
│ │       │ {venue.name}   │ │
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │ <MapEmbed> 16:10       │ │  ← grayscale trên wrapper
│ └────────────────────────┘ │
│ CHỈ ĐƯỜNG →                │  ← link đỏ, gạch chân, ≥ 44px vùng bấm
└────────────────────────────┘
```
**Nội dung:** theo `date` ⚠️ (fallback 14.11.2026, lễ 10:00, tiệc 18:00). Đã qua → *"SỐ BÁO ĐÃ PHÁT HÀNH — CẢM ƠN QUÝ ĐỘC GIẢ"*.
**Animation:** hàng bảng A1 stagger 0.1; ngày "14.11" A2 chars. MapEmbed lazy.

---

### C15 · Phiếu độc giả (RSVP, chỉ giao diện)

```
┌────────────────────────────┐
│ LOVE                 P. 16 │
│ THƯ ĐỘC GIẢ                │
│ Tên _____________________  │  ← input gạch chân 1px ink
│ [ SẼ THAM DỰ ][ VẮNG MẶT ] │  ← toggle 2 nút, ô đang chọn nền đen
│ Số khách  − 1 +            │
│ Lời chúc _________________ │
│ [ GỬI TOÀ SOẠN ]           │
│ Bản xem thử — không gửi đi │
└────────────────────────────┘
```
**Hành vi:** gửi → form thu lại, hiện *"Toà soạn đã nhận thư của {tên}. Cảm ơn!"*. Không gửi dữ liệu.

---

### C10 · Bìa sau

```
┌────────────────────────────┐  ← nền ink, chữ trắng
│ LOVE                       │
│ ┌──────────────┐           │
│ │ images[n-1]  │           │  ← ảnh 4:5 col 1–4
│ └──────────────┘           │
│ Cảm ơn đã đọc số đặc biệt  │
│ này. Hẹn gặp bạn ở tiệc!   │
│ ◀ MINH QUÂN & THU HÀ ◀ MIN │  ← A9 marquee, Playfair 900 italic 48px
│ ▮▮▮▮ ▮ ▮▮ (mã vạch)  11/26 │  ← mã vạch SVG + số phát hành
└────────────────────────────┘
```
**Animation:** marquee A9 (`xPercent -50`, 18s linear, lặp). Reduced-motion: marquee đứng yên.

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | C1 bìa + C8 ảnh full-bleed | 3:4 / 4:5 |
| `images[1]` | Mục lục thumb + C3 chú rể | 3:4 |
| `images[2]` | Mục lục thumb + C3 cô dâu | 3:4 |
| `images[3..5]` | C4 ba mốc | 4:3 / 4:5 |
| `images[6..7]` | C8 spread | 4:5 |
| `images[7]` | C10 bìa sau (n = 8) | 4:5 |

`meta.media = { images: 8, videos: 0 }`. `sampleData` có 4 ảnh → **thêm 4 ảnh vào `public/sample/`**.

## 7. Asset cần chuẩn bị
- [ ] SVG: mã vạch trang trí, chấm đỏ logo
- [ ] `music.mp3` + `CREDITS.md`
- [ ] 8 ảnh mẫu kiểu studio/thời trang ≤ 300KB `.webp` (1 ảnh dọc có khoảng trống phía dưới cho tên bìa)
- [ ] `thumb.webp` 600×800 = chính bìa C1, `opengraph-image.png`

## 8. Tiêu chí nghiệm thu riêng
- [ ] Chữ cắt mép không gây cuộn ngang (`overflow-x-clip` trên section, không trên `body`)
- [ ] Tên 50 ký tự: bìa vẫn đọc được (chuyển chế độ xuống dòng, không cắt mép)
- [ ] Mục lục nhảy đúng bài, dùng được bằng bàn phím
- [ ] Playfair 900 italic không đè dấu giữa hai dòng
- [ ] Lighthouse: ảnh bìa là LCP, có `fetchPriority="high"`

---

## 9. Triển khai code

### 9.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/editorial-2d/
├── meta.ts
├── layout.tsx                 # Playfair_Display (weights 400/700/900 + italic, --font-display) + Manrope (--font-body)
├── page.tsx                   # return <EditorialInvite />
└── _components/
    ├── editorial-invite.tsx   # ghép, SmoothScroll, OpenGate
    ├── tokens.ts
    ├── running-header.tsx     # tên tạp chí + số trang
    ├── front-cover.tsx        # C1
    ├── sections/
    │   ├── contents.tsx       # mục lục
    │   ├── headline.tsx       # C2
    │   ├── interview.tsx      # C3
    │   ├── story-quote.tsx    # C4
    │   ├── spread.tsx         # C8 + lightbox
    │   ├── agenda.tsx         # C5 + C6 + C7
    │   ├── reader-letter.tsx  # C15
    │   └── back-cover.tsx     # C10
    ├── cover-fit.ts           # quyết định chế độ tên bìa (cắt mép / xuống dòng)
    └── cover-fit.test.ts
```

### 9.2 Tokens
```ts
export const t = {
  root: "min-h-screen bg-white text-[#111111] font-(family-name:--font-body)",
  display: "font-(family-name:--font-display)",
  grid: "grid grid-cols-6 gap-x-3 px-4 lg:grid-cols-12 lg:gap-x-6 lg:px-[6vw]",
  label: "text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.25em] text-[#5C5C5C]",
  red: "text-[#B91C1C]",
  btn: "min-h-11 bg-[#111111] px-6 text-xs font-bold uppercase tracking-[0.2em] text-white",
  rule: "border-t border-[#D6D3CE]",
} as const;
```

### 9.3 Lật bìa + tên trượt vào nhau
```tsx
// front-cover.tsx
const open = contextSafe(() => {
  music.play();
  gsap.timeline({ onComplete: onOpened })
    .to(".cover", { rotateY: -110, duration: 0.9, ease: "power3.inOut" })   // origin-left
    .to(".cover-shadow", { opacity: 0, duration: 0.9 }, 0)
    .set(".cover", { autoAlpha: 0 });
});

// headline.tsx
useGSAP(() => {
  if (reduced) return;
  const st = { trigger: root.current, start: "top bottom", end: "center center", scrub: 0.5 };
  gsap.from(".line-a", { xPercent: -30, ease: "none", scrollTrigger: st });
  gsap.from(".line-b", { xPercent: 30, ease: "none", scrollTrigger: st });
}, { scope: root, dependencies: [reduced] });
```

### 9.4 Mục lục
```tsx
const go = (id: string) => (reduced ? document.getElementById(id)?.scrollIntoView()
  : ScrollSmoother.get()?.scrollTo(`#${id}`, true, "top top"));
```

### 9.5 Logic cần test
- `coverMode(name1, name2)` → `"bleed"` khi tổng ≤ 16 ký tự, ngược lại `"wrap"`.
- `issueLabel(date)` → `"THÁNG 11/2026"`; không có `date` → fallback.

### 9.6 Thứ tự làm
1. `meta.ts`, layout (Playfair nhiều weight), tokens, thêm 4 ảnh mẫu
2. Lưới 6/12 cột + running header; section tĩnh theo wireframe
3. Bìa C1 + lật + nhạc
4. Mục lục + scrollTo
5. Chữ trượt, A6 gạch chân, data-speed, lightbox, marquee
6. Reduced-motion, tên dài (`coverMode`), Lighthouse, checklist template-spec §12
