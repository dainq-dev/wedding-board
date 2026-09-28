# 2D-23 · `neon-2d` · Neon Sài Gòn

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md). Mẫu chuẩn tham chiếu: [letter-2d.md](./letter-2d.md).

---

## 1. Concept

**Một câu:** Một đêm mưa trên con hẻm Sài Gòn: tấm biển neon "ĐANG MỞ CỬA" chập chờn rồi bật sáng, và mỗi thông tin đám cưới là **một tấm biển hiệu neon khác nhau** treo dọc con hẻm, phản chiếu xuống mặt đường ướt.

**Cảm xúc muốn gợi:** lãng mạn kiểu phim điện ảnh về đêm, hơi hoài niệm, trẻ trung, "thành phố của hai đứa mình".

**Phù hợp với:** cặp đôi trẻ, sống ở thành phố, ảnh cưới chụp đêm / đường phố / tông tím hồng; tiệc ở nhà hàng, rooftop.

**Khác các mẫu khác ở chỗ:**
- **Chuyển cảnh bằng "cúp điện"** (biến thể T2): khi sang section mới, biển cũ chập chờn tắt, màn hình tối 1 nhịp, rồi biển mới bật sáng. Nhịp sáng/tắt là ngôn ngữ chuyển cảnh chính của mẫu.
- Mỗi section có **phản chiếu** dưới đáy (bản sao `scaleY(-1)` mờ dần bằng mask gradient) như biển hiệu soi xuống vũng nước.
- **Mưa** là lớp hạt dài chạy suốt trang (A8), và có **1 video** (C9) chiếu như màn hình LED quảng cáo đầu hẻm.

**Moodboard:** biển hiệu ống neon uốn chữ, cửa cuốn, vũng nước phản chiếu ánh hồng/xanh, xe máy chạy vệt đèn, kính cửa hàng tiện lợi đọng hơi nước, chữ tiếng Việt kiểu biển hiệu cũ.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `bg` | `#0A0612` | Nền trang: bầu trời đêm |
| `street` | `#120B1F` | Mặt đường, nền khối phía dưới |
| `surface` | `#140D24` @ 80% | Kính mờ (`bg-[#140D24]/80 backdrop-blur-md`) |
| `primary` | `#FF3CAC` | Neon hồng: tên, tiêu đề, nút |
| `accent` | `#2BD2FF` | Neon xanh: ngày giờ, đường kẻ, icon |
| `amber` | `#FFB547` | Neon cam hiếm dùng: trái tim trên lịch, biển "MỞ CỬA" |
| `text` | `#F5F3FF` | Chữ chính |
| `text-soft` | `#B8B0D6` | Chữ phụ |
| `tube-off` | `#3A2A4A` | Ống neon khi tắt |

Tương phản: `text` trên `bg` ≈ 18:1 ✅. `text-soft` trên `surface`(trên nền bg) ≈ 8.9:1 ✅. `primary` trên `bg` ≈ 5.9:1 ✅. `accent` trên `bg` ≈ 10.5:1 ✅. Chữ `bg` trên nút `primary` ≈ 5.9:1 ✅ (nút dùng chữ tối, không dùng chữ trắng trên hồng: trắng/hồng chỉ 3.1:1 ❌).

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Unbounded 600 | 34px / 1.1 | 64px | Chữ neon: `drop-shadow` 3 lớp |
| Tiêu đề biển | Unbounded 500, VIẾT HOA, tracking 0.12em | 16px | 20px | "TIỆC CƯỚI" |
| Số lớn (ngày) | Unbounded 300 | 84px | 136px | neon `accent` |
| Nội dung | Be Vietnam Pro 400 | 16px / 1.6 | 18px | |
| Nhãn nhỏ | Be Vietnam Pro 500, VIẾT HOA, tracking 0.1em | 12px | 13px | |

Cả hai font nằm trong danh sách đã kiểm subset `vietnamese`. Unbounded có dấu tiếng Việt khá cao: đặt `leading-[1.15]` tối thiểu để dấu không đè dòng trên.

### Hình khối và chất liệu
- **Chữ neon** (`t.neonPink`, `t.neonCyan`): `text-[#FFE3F3] drop-shadow-[0_0_2px_#FF3CAC] drop-shadow-[0_0_8px_#FF3CAC] drop-shadow-[0_0_24px_#FF3CAC]`. Lõi chữ gần trắng, quầng màu. Tailwind v4 cho phép chồng nhiều `drop-shadow-[…]` qua `filter`; nếu không chồng được thì dùng 1 arbitrary `[filter:drop-shadow(…)_drop-shadow(…)]`.
- **Khung biển**: `rounded-2xl` (1rem), viền ống neon `border-2 border-[#2BD2FF] shadow-[0_0_12px_#2BD2FF,inset_0_0_12px_#2BD2FF]`, nền `surface` kính mờ.
- **Phản chiếu** (`<Reflection>`): bản sao `aria-hidden` của biển, `-scale-y-100 opacity-35 blur-[2px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]`.
- **Mưa**: 40 vệt (mobile 24) `w-px h-[60px] bg-gradient-to-b from-transparent to-[#B8B0D6]/50`, rơi chéo 10°.
- **Nhấp nháy neon**: keyframe riêng — **ngoại lệ §5** được ghi trong todo. Khai báo `--animate-neon-2d-flicker` trong `@theme` (xem §9.2). Chỉ animate `opacity`.
- **Motion**: ease chủ đạo `power2.out`. Bật neon: `steps(1)` ở pha chập chờn, `power2.out` ở pha sáng hẳn. Vào 0.6s, ra 0.3s.

---

## 3. Nhạc

- **Tâm trạng**: synthwave / retrowave lãng mạn, pad ấm, bass chậm, không lời.
- **Tempo**: 90–105 BPM (mục tiêu ~100). **Độ dài**: 2:00–3:00, lặp.
- **Từ khoá Pixabay**: `synthwave romantic night`, `retrowave chill love`, `city night synth`
- **Hành vi**:
  - Bắt đầu khi bấm biển "MỞ CỬA" (C1), âm lượng 0 → 0.6 trong 1.5 giây.
  - C16 là "máy cassette" trong ô cửa sổ, cùng thẻ `<audio>` với `<MusicPlayer>`.
  - Khi video C9 đang phát có tiếng: **giảm nhạc nền về 0.15**, dừng video thì trả về 0.6 (duck). Video mặc định `muted`.
  - Ẩn tab thì tạm dừng.

---

## 4. Cấu trúc trang

```
┌───────────────────────────┐
│ C1  Biển "MỞ CỬA"          │ 100svh  (cố định tới khi mở)
├───────────────────────────┤
│ C2  Biển tên (chữ neon)    │ 100svh ─┐
│ C3  Hai ô cửa sổ           │ 100svh  │  "Cúp điện" (T2 biến thể):
│ C5+C11 Biển ngày + lịch    │ 100svh  │  mỗi section ghim, biển cũ
│ C6+C7 Biển tiệc + bản đồ   │ 130svh  │  chập chờn tắt, biển mới bật
│ C12 Bảng giờ kiểu bến xe   │ 100svh ─┘
├───────────────────────────┤
│ C9  Màn LED (video)        │ 100svh  T4 clip mở từ đường kẻ ngang
│ C8  Dải ảnh cửa kính       │ 140svh  T1, ảnh hiện sau hơi nước
│ C16 Cassette               │  60svh
│ C13 Dress code (3 ống màu) │  70svh
│ C14 Mừng cưới              │  80svh
│ C15 Xác nhận tham dự       │ 100svh
│ C10 Biển "HẸN GẶP LẠI"     │ 100svh  (cửa cuốn kéo xuống)
└───────────────────────────┘
```

**Lớp nền cố định** (ngoài `#smooth-content`, `z-0`, `pointer-events-none`): gradient trời đêm + dãy nhà silhouette + mưa A8. Nội dung ở `z-10`. Không đè 3 góc chung.
**Chiều rộng:** biển rộng `min(90vw, 460px)`; desktop có thêm dãy biển hiệu mờ hai bên (A4 parallax).

---

## 5. Chi tiết từng section

### C1 · Biển "MỞ CỬA" (màn mở thiệp)

**Mục đích:** khoảnh khắc bật đèn biển hiệu; cú bấm để phát nhạc.

**Wireframe (360px):**
```
┌────────────────────────────┐
│  ░ mưa ░   ░      ░   ░    │
│   ┌──────────────────────┐ │
│   │  ĐANG  MỞ  CỬA       │ │  ← ống neon tắt (tube-off), Unbounded 28px
│   │  ─────────────────   │ │
│   │  Minh Quân ♥ Thu Hà  │ │  ← tên nhỏ 18px, cũng là ống neon
│   └──────────────────────┘ │
│   ┊ phản chiếu mờ ┊        │
│                            │
│      ┌──────────────┐      │
│      │ ⏻  BẬT ĐÈN  │      │  ← nút 180×52, viền accent
│      └──────────────┘      │
│  Chạm để bật biển và mở    │
│         thiệp mời          │
└────────────────────────────┘
```

**Nội dung:** `{groom.name}` ♥ `{bride.name}` (là `<h1>`); dòng *"Chạm để bật biển và mở thiệp mời"*; nút "BẬT ĐÈN".

**Animation vào:**
| t | Hành động |
|---|---|
| 0.0s | Mưa bắt đầu (lớp nền) |
| 0.3s | Biển (tắt) fade `opacity 0 → 1` (0.8s) |
| 1.0s | Nút A1 |
| lặp | Chữ "MỞ" thỉnh thoảng loé mờ (`animate-neon-2d-flicker` với `opacity` tối đa 0.35) — gợi ý biển sắp sáng |

**Khi bấm (timeline mở, tổng 1.9s):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc bắt đầu |
| 0.0s | Lớp "sáng" của biển chập chờn: `opacity` 0 → 1 → 0.2 → 1 → 0 → 1 (6 bước, `steps(1)`, 0.7s) |
| 0.0s | Nút co `scale 0.95` rồi fade |
| 0.7s | Quầng sáng quanh biển `opacity 0 → 1`, nền trời sáng lên tông hồng (`opacity` lớp gradient hồng 0 → 0.35, 0.8s) |
| 0.9s | Phản chiếu dưới biển sáng theo |
| 1.2s | Biển `scale 1 → 0.8`, `y: -30%` (0.7s), nhường chỗ C2 |
| 1.9s | Mở khoá cuộn |

**Reduced-motion:** không chập chờn; bấm là lớp sáng fade 0.3s. Keyframe flicker bị bỏ (`motion-reduce:animate-none`).
**Accessibility:** nhấp nháy ≤ 3 lần/giây ở mọi thời điểm (WCAG 2.3.1): 6 bước trong 0.7s ≈ 4.3 chuyển trạng thái/giây nhưng chỉ ~2 lần "tắt→sáng" thật mỗi giây và diện tích nhỏ (< 25% màn hình). Giữ nguyên thông số, không tăng.
**Edge case:** tên dài > 24 ký tự: tên trên biển C1 xuống 2 dòng, 15px.

---

### C2 · Biển tên (chữ neon)

**Wireframe:**
```
┌────────────────────────────┐
│    TRÂN TRỌNG KÍNH MỜI     │  ← nhãn nhỏ, text-soft
│                            │
│      MINH QUÂN             │  ← Unbounded 34px, neon hồng, viết hoa
│         ♥                  │  ← neon amber
│       THU HÀ               │
│  ──────────────────────    │  ← ống neon xanh A6
│   THỨ BẢY · 14.11.2026     │  ← accent, cần `date` ⚠️
│ ┌────────────────────────┐ │
│ │  ảnh bìa images[0] 4:5 │ │  ← viền ống neon xanh, lớp phủ tím 20%
│ └────────────────────────┘ │
│ ┊ phản chiếu ảnh + chữ ┊   │
└────────────────────────────┘
```
**Nội dung:** "TRÂN TRỌNG KÍNH MỜI", tên (viết hoa bằng `uppercase`, dữ liệu gốc không đổi), ngày `EEEE · dd.MM.yyyy`. Thiếu `date` ⚠️ → hằng số mẫu.
**Animation:**
| t | Hành động |
|---|---|
| 0.0s | Viền ngoài của chữ tên (SVG text stroke) A6 vẽ 1.0s — "uốn ống neon" |
| 0.8s | Lõi chữ + quầng bật sáng kiểu chập chờn ngắn (3 bước, 0.3s) |
| 1.1s | Đường kẻ A6, ngày A1 |
| 1.3s | Ảnh A3 |

**Kỹ thuật tên:** SVG `<text>` với `stroke` chỉ để vẽ viền; chữ HTML thật (có thể đọc/SEO) đặt chồng lên và fade in sau. Với tên dài, SVG dùng `textLength` không được (méo chữ) → tính `viewBox` từ `getBBox()` sau khi font tải (`document.fonts.ready`).

---

### Chuyển cảnh "cúp điện" (dùng cho C2 → C3 → C5 → C6 → C12)

Mỗi section trong nhóm được ghim 1 màn hình (`pin: true`, `end: "+=60%"`). Trong đoạn ghim, theo scrub:
| progress | Hành động |
|---|---|
| 0 → 0.6 | Đọc bình thường |
| 0.6 → 0.75 | Biển hiện tại chập chờn (`opacity` 1 → 0.3 → 0.9 → 0.1, dùng keyframes trong tween `keyframes: [...]`) |
| 0.75 → 0.85 | Tối hẳn (`opacity 0`), chỉ còn mưa |
| 0.85 → 1 | Section kế tiếp (đã nằm dưới, `pinSpacing: false` kiểu chồng) bật sáng 2 bước rồi `opacity 1` |

Thực hiện như T2: section sau có `-mt-[100svh]` để nằm đè đúng vị trí, section trước ghim. Vì scrub nên kéo ngược sẽ "bật lại" biển cũ — đúng ý.
**Reduced-motion:** không ghim, các section cuộn dọc bình thường, fade 0.3s.

---

### C3 · Hai ô cửa sổ

```
┌────────────────────────────┐
│  ┌──────────┐┌──────────┐  │  ← 2 ô cửa sổ có rèm, đèn vàng bên trong
│  │ images[1]││ images[2]│  │     4:5, viền neon hồng / xanh
│  │  chú rể  ││  cô dâu  │  │
│  └──────────┘└──────────┘  │
│   NHÀ TRAI     NHÀ GÁI     │  ← biển nhỏ neon
│   Minh Quân    Thu Hà      │  ← Unbounded 18px
│   Quận 1,      Ba Đình,    │  ← body 14px, text-soft
│   TP.HCM       Hà Nội      │
└────────────────────────────┘
```
**Nội dung:** `groom.*`, `bride.*`. Tên bố mẹ ⚠️: nếu có thì dòng *"Con ông … & bà …"* 13px; không có thì bỏ.
**Animation:** hai cửa sổ "bật đèn" lệch nhau 0.3s: lớp ảnh `opacity 0 → 1` + quầng vàng; biển NHÀ TRAI / NHÀ GÁI bật kiểu chập chờn ngắn.
**Mobile < 360px:** 1 cột.

---

### C5 + C11 · Biển ngày và lịch

```
┌────────────────────────────┐
│   ┌──────────────────────┐ │
│   │   THÁNG MƯỜI MỘT     │ │
│   │        14            │ │  ← Unbounded 84px, neon xanh
│   │  THỨ BẢY · 2026      │ │
│   └──────────────────────┘ │
│  45 : 06 : 12 : 33         │  ← kiểu đồng hồ LED 7 đoạn (Unbounded 300)
│ ngày  giờ  phút  giây      │
│  T2 T3 T4 T5 T6 T7 CN      │
│  …  12  13 (♥) 15 …        │  ← ♥ neon amber quanh ngày cưới
└────────────────────────────┘
```
**Nội dung:** như letter-2d C5 nhưng câu sau ngày cưới: *"Hai đứa mình đã về chung một nhà ♥"*.
**Animation:** số "14" "bật" từng đoạn (opacity các chữ số 0→1 lần lượt 3 bước). Countdown dùng A7 với `rotateX` rất nhỏ (flip nhanh 0.25s) để giống bảng LED. Trái tim A6.

---

### C6 + C7 · Biển tiệc và bản đồ

```
┌────────────────────────────┐
│ ┌────────────────────────┐ │
│ │ LỄ VU QUY · 08:00      │ │  ← biển ngang nhỏ, neon xanh
│ │ Tư gia nhà gái         │ │
│ │ {bride.address}        │ │
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │ TIỆC CƯỚI · 18:00      │ │  ← biển lớn, neon hồng
│ │ {venue.name}           │ │
│ │ {venue.address}        │ │
│ │ ┌────────────────────┐ │ │
│ │ │ <MapEmbed> 16:10   │ │ │  ← lớp phủ tím 10% bên ngoài iframe
│ │ └────────────────────┘ │ │
│ │ [ ⌖ CHỈ ĐƯỜNG ]        │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Animation:** sau khi biển bật sáng (chuyển cảnh cúp điện), mũi tên neon "→" cạnh nút chỉ đường chạy `x: 0 → 6` lặp (A12 biến thể, 1s).
**Lưu ý:** bản đồ lazy như letter-2d; **không** áp `filter` lên iframe (Google Maps trong iframe không đổi màu được và filter tốn hiệu năng) — chỉ đặt lớp phủ màu `pointer-events-none` mỏng ở viền.

---

### C12 · Bảng giờ kiểu bến xe

```
┌────────────────────────────┐
│  ┌──────────────────────┐  │  ← bảng LED đen, chữ accent
│  │ GIỜ    │ SỰ KIỆN     │  │
│  │ 17:00  │ ĐÓN KHÁCH   │  │
│  │ 18:00  │ LÀM LỄ      │  │
│  │ 18:30  │ KHAI TIỆC   │  │
│  │ 20:00  │ QUẨY HẾT MÌNH│ │
│  └──────────────────────┘  │
└────────────────────────────┘
```
**Nội dung:** 4 mốc tính từ `date` như letter-2d C12 (mốc 4 đổi chữ "QUẨY HẾT MÌNH").
**Animation:** A11 typewriter từng dòng, ký tự hiện kiểu "lật bảng" (mỗi ô chữ quay vòng qua 3 ký tự ngẫu nhiên A–Z rồi dừng ở ký tự đúng, 0.4s). Reduced-motion: hiện thẳng.

---

### C9 · Màn LED (video)

```
┌────────────────────────────┐
│ ────────────────────────── │  ← đường kẻ ngang neon, mở dần thành màn
│ ┌────────────────────────┐ │
│ │                        │ │  ← <video> videos[0], 9:16 trên mobile
│ │        VIDEO           │ │     (object-cover), 16:9 desktop
│ │                        │ │     controls, muted, playsInline, preload="none"
│ └────────────────────────┘ │
│   ▶ Xem thước phim của     │
│     chúng mình             │
└────────────────────────────┘
```
**Chuyển vào (T4):** màn clip `inset(50% 0 50% 0) → inset(0)` theo scrub (như TV cũ bật). Lớp scanline `bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.25)_0_1px,transparent_1px_3px)]` phủ trên video, `pointer-events-none`.
**Hành vi:** không tự phát có tiếng (template-spec §11). Khi `play` + `!muted` → duck nhạc nền (§3). `poster` = `images[0]`.
**Edge case:** `data.videos.length === 0` (không nên xảy ra vì media khai báo 1) → ẩn cả section.

---

### C8 · Dải ảnh sau cửa kính đọng hơi nước

```
┌────────────────────────────┐
│       KHOẢNH KHẮC          │
│ ┌──────────┐               │  ← ảnh lệch trái/phải xen kẽ, 70vw
│ │ images[3]│  ░ hơi nước ░ │
│ └──────────┘               │
│            ┌──────────┐    │
│            │ images[4]│    │
│            └──────────┘    │
│ ┌──────────┐               │
│ │ images[5]│               │
│ └──────────┘               │
└────────────────────────────┘
```
**Hành vi:** mỗi ảnh có lớp "hơi nước" phía trên (`backdrop-blur-md bg-white/10`). Theo scrub khi ảnh vào giữa màn hình, lớp này bị "lau" từ trái sang phải: animate `clip-path: inset(0 0 0 0%) → inset(0 0 0 100%)` của lớp hơi nước. Lưu ý `backdrop-blur` tốn GPU: chỉ bật cho ảnh đang gần viewport (toggle class bằng `ScrollTrigger` `toggleClass`). Bấm ảnh → A10.
**Reduced-motion:** không có lớp hơi nước.

---

### C16 · Cassette

```
┌────────────────────────────┐
│  ┌──────────────────────┐  │
│  │ ◯══════════◯  A-SIDE │  │  ← băng cassette, 2 cuộn băng quay khi phát
│  │ ♪ Chạm để nghe bài   │  │
│  │   hát của chúng mình │  │
│  │ [ ▶/❚❚ ]  ──●── 1:12 │  │
│  └──────────────────────┘  │
└────────────────────────────┘
```
**Hành vi:** 2 cuộn quay `rotation += 360` (2s, `none`, lặp) khi audio đang phát, dừng khi pause (`tween.pause()` theo event `play`/`pause` của audio).

---

### C13 · Dress code

```
┌────────────────────────────┐
│        DRESS CODE          │
│   Tối màu · điểm neon      │
│   ┃     ┃     ┃     ┃      │  ← 4 ống neon dọc
│  Đen  Tím   Hồng  Xanh     │     #0A0612 #6B4FA0 #FF3CAC #2BD2FF
│  "Một chút lấp lánh là     │
│   vừa đẹp!"                │
└────────────────────────────┘
```
**Animation:** 4 ống bật sáng lần lượt (stagger 0.15, `steps(2)`).

---

### C14 · Mừng cưới · C15 · Xác nhận tham dự

- **C14**: hai "biển ATM" nhỏ neon xanh, mỗi biển chứa QR mẫu ⚠️ (nhà trai / nhà gái); bấm → A10. Câu: *"Sự hiện diện của bạn đã là món quà rồi."*
- **C15**: form kính mờ; input viền `accent`, focus viền `primary` + quầng. Nhãn: *"Tên của bạn"*, *"Mình sẽ đến"*, *"Tiếc quá, không đến được"*, *"Số người"*, nút *"GỬI"*. Bấm Gửi → form thu `height → 0`, biển *"CẢM ƠN {tên}!"* bật sáng kiểu chập chờn. **Không gửi dữ liệu đi đâu**; ghi chú *"Bản xem thử — xác nhận không được gửi đi."*

---

### C10 · "HẸN GẶP LẠI" (cửa cuốn)

```
┌────────────────────────────┐
│ ┌────────────────────────┐ │
│ │  ảnh cuối images[n-1]  │ │  ← 3:4
│ └────────────────────────┘ │
│   Cảm ơn bạn đã ghé qua    │
│   con hẻm của chúng mình!  │
│   HẸN GẶP LẠI              │  ← neon hồng
│   Minh Quân & Thu Hà       │
│ ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤ │  ← cửa cuốn kéo xuống theo scrub
└────────────────────────────┘
```
**Animation (scrub):** cửa cuốn (`repeating-linear-gradient` ngang) `yPercent: -100 → 0` từ trên xuống, dừng ở 65% chiều cao để vẫn thấy tên; biển "HẸN GẶP LẠI" vẫn sáng trên cửa. Đảo ngược cảm giác "mở cửa" của C1.

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | C2 ảnh bìa, poster của video C9 | 4:5 |
| `images[1]` | C3 chú rể | 4:5 |
| `images[2]` | C3 cô dâu | 4:5 |
| `images[3..4]` | C8 dải ảnh | 4:5 |
| `images[5]` | C8 ảnh thứ 3 **và** C10 ảnh cuối | 3:4 |
| `videos[0]` | C9 màn LED | 9:16 mobile / 16:9 desktop (`object-cover`) |

`meta.media = { images: 6, videos: 1 }`
`meta.styles = ["modern", "cinematic"]`, `meta.colors = ["black", "pink"]`.
⚠️ Cần kiểm `public/sample/` đã có ít nhất 1 video mẫu ≤ 5MB; chưa có thì bổ sung (template-spec §2.2).

## 7. Asset cần chuẩn bị
- [ ] SVG: biển "ĐANG MỞ CỬA" (2 lớp: tắt / sáng), dãy nhà silhouette (2 lớp parallax), khung cửa sổ có rèm, cassette (2 cuộn tách riêng), cửa cuốn (có thể thuần gradient), 4 ống neon
- [ ] Keyframe `neon-2d-flicker` trong `@theme` (xem §9.2)
- [ ] `music.mp3` synthwave ~100 BPM (Pixabay) + `CREDITS.md`
- [ ] 6 ảnh mẫu chụp đêm/đường phố tông tím hồng ≤ 300KB `.webp`; 1 video mẫu ≤ 5MB `.mp4` (H.264, 720p)
- [ ] `qr-sample.webp`
- [ ] `thumb.webp` 600×800: biển tên neon + phản chiếu mặt đường
- [ ] `opengraph-image.png` 1200×630

## 8. Tiêu chí nghiệm thu riêng
- [ ] Bấm "BẬT ĐÈN": nhạc phát ngay, cuộn được trong ≤ 2 giây
- [ ] Không có nhấp nháy nào vượt 3 lần/giây trên vùng > 25% màn hình; reduced-motion không nhấp nháy
- [ ] Chuyển cảnh "cúp điện" kéo ngược vẫn đúng (biển cũ bật lại)
- [ ] Mưa + drop-shadow neon giữ 60fps trên điện thoại tầm trung (mưa chỉ animate `transform`; nếu tụt fps, giảm còn 16 vệt)
- [ ] Video không tự phát có tiếng; phát có tiếng thì nhạc nền giảm
- [ ] Mọi chữ nhỏ ≥ 4.5:1 (không dùng chữ trắng trên nền hồng)
- [ ] Tên 50 ký tự không làm vỡ biển C1, C2 (SVG viền tự co)

---

## 9. Triển khai code

### 9.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/neon-2d/
├── meta.ts
├── layout.tsx                 # Unbounded (--font-display) + Be_Vietnam_Pro (--font-body), vietnamese
├── page.tsx                   # return <NeonInvite />
└── _components/
    ├── neon-invite.tsx        # "use client" — tokens t, ghép section, SmoothScroll
    ├── night-backdrop.tsx     # lớp nền cố định: trời, nhà, mưa (A8)
    ├── open-sign.tsx          # C1 dùng OpenGate
    ├── neon-text.tsx          # chữ neon: SVG stroke (vẽ) + HTML thật
    ├── reflection.tsx         # bản sao phản chiếu (aria-hidden)
    ├── blackout-stack.tsx     # chuyển cảnh "cúp điện" cho nhóm C2–C12
    ├── flap-text.ts           # sinh chuỗi ký tự trung gian cho bảng giờ
    ├── flap-text.test.ts
    ├── sections/
    │   ├── name-sign.tsx      # C2
    │   ├── windows.tsx        # C3
    │   ├── date-sign.tsx      # C5 + C11
    │   ├── events-sign.tsx    # C6 + C7
    │   ├── departure-board.tsx# C12
    │   ├── led-screen.tsx     # C9
    │   ├── steamy-gallery.tsx # C8
    │   ├── cassette.tsx       # C16
    │   ├── dress-tubes.tsx    # C13
    │   ├── gift-atm.tsx       # C14
    │   ├── rsvp-sign.tsx      # C15
    │   └── shutter.tsx        # C10
    └── svg/
```
Dùng chung `@/kit`: `SmoothScroll`, `OpenGate`, `MusicPlayer`, `Countdown`, `useReducedMotion`, `presets`. `@/components`: `MapEmbed`.

### 9.2 Tokens và keyframe
```ts
// neon-invite.tsx
export const t = {
  root: "min-h-svh bg-[#0A0612] text-[#F5F3FF] font-(family-name:--font-body) overflow-x-clip",
  display: "font-(family-name:--font-display) leading-[1.15]",
  glass: "rounded-2xl bg-[#140D24]/80 backdrop-blur-md border-2 border-[#2BD2FF] shadow-[0_0_12px_#2BD2FF,inset_0_0_12px_#2BD2FF]",
  neonPink: "text-[#FFE3F3] [filter:drop-shadow(0_0_2px_#FF3CAC)_drop-shadow(0_0_8px_#FF3CAC)_drop-shadow(0_0_24px_#FF3CAC)]",
  neonCyan: "text-[#E6FAFF] [filter:drop-shadow(0_0_2px_#2BD2FF)_drop-shadow(0_0_8px_#2BD2FF)]",
  label: "text-xs tracking-[0.1em] uppercase font-medium text-[#B8B0D6]",
  btn: "min-h-11 px-6 rounded-2xl bg-[#FF3CAC] text-[#0A0612] font-semibold focus-visible:outline-2 focus-visible:outline-[#2BD2FF]",
} as const;
```
Keyframe (ngoại lệ §5, thêm vào `@theme` trong `globals.css`):
```css
@theme {
  --animate-neon-2d-flicker: neon-2d-flicker 4s steps(1) infinite;
  @keyframes neon-2d-flicker {
    0%, 100% { opacity: 0; } 92% { opacity: 0.35; } 94% { opacity: 0.05; } 96% { opacity: 0.3; }
  }
}
```
Dùng `animate-neon-2d-flicker motion-reduce:animate-none`. Mọi nhấp nháy khác làm bằng GSAP.

### 9.3 Luồng mở thiệp (C1)
```tsx
// open-sign.tsx (rút gọn)
useGSAP(() => {
  tl.current = gsap.timeline({ paused: true })
    .to(".sign-lit", { keyframes: { opacity: [0, 1, 0.2, 1, 0, 1] }, duration: 0.7, ease: "steps(1)" }, 0)
    .to(".open-btn", { scale: 0.95, opacity: 0, duration: 0.3 }, 0)
    .to(".sky-pink", { opacity: 0.35, duration: 0.8, ease: "power2.out" }, 0.7)
    .to(".sign", { scale: 0.8, yPercent: -30, duration: 0.7, ease: "power2.out" }, 1.2)
    .call(onOpened, [], 1.9);
}, { scope: root });
```
Với `keyframes` mảng + `ease: "steps(1)"`: kiểm lại trên gsap 3.15 rằng `easeEach` mặc định không làm mượt giữa các bước; nếu có, đặt `keyframes: { opacity: [...], easeEach: "steps(1)" }`.

### 9.4 Chuyển cảnh "cúp điện"
```tsx
// blackout-stack.tsx
useGSAP(() => {
  if (reduced) return;
  const scenes = gsap.utils.toArray<HTMLElement>(".scene");
  scenes.forEach((scene, i) => {
    const next = scenes[i + 1];
    if (!next) return;
    gsap.set(next, { opacity: 0 });
    gsap.timeline({
      scrollTrigger: { trigger: scene, start: "top top", end: "+=60%", pin: true, scrub: true },
    })
      .to({}, { duration: 0.6 })
      .to(scene, { keyframes: { opacity: [1, 0.3, 0.9, 0.1, 0] }, duration: 0.25, ease: "none" })
      .to(next, { keyframes: { opacity: [0, 0.8, 0.2, 1] }, duration: 0.15, ease: "none" });
  });
}, { scope: root, dependencies: [reduced] });
```
Các `.scene` sau cái đầu có class `-mt-[100svh]` (khi không reduced) để nằm chồng. Cần kiểm `pinSpacing` sao cho section kế tiếp không bị đẩy xuống thêm; nếu rối, phương án B: một section ghim duy nhất chứa 5 "biển" `absolute inset-0`, timeline scrub dài `+=500%` crossfade lần lượt — đơn giản và chắc chắn hơn. **Khuyến nghị làm phương án B trước.**

### 9.5 Bảng giờ kiểu lật
`flap-text.ts`: `flapFrames(target: string, steps = 3, rand = Math.random): string[]` — trả về `steps` chuỗi trung gian (giữ nguyên dấu cách, ký tự ngẫu nhiên A–Z cùng độ dài) và cuối cùng là `target`. Component đổi text theo `gsap.delayedCall` mỗi 0.12s.
**Test** (`flap-text.test.ts`): độ dài mỗi frame = độ dài target; frame cuối = target; dấu cách giữ nguyên; target có dấu tiếng Việt ("QUẨY") vẫn trả đúng frame cuối.

### 9.6 Duck nhạc khi video phát
```tsx
<video … onVolumeChange={sync} onPlay={sync} onPause={() => music.fadeTo(0.6)} />
function sync(e) { const v = e.currentTarget; music.fadeTo(!v.paused && !v.muted ? 0.15 : 0.6); }
```
Nếu `MusicPlayer` trong `@/kit` chưa có `fadeTo`, dùng `gsap.to(audioEl, { volume, duration: 0.6 })` trên cùng thẻ audio qua context — ⚠️ phụ thuộc API thực tế của kit.

### 9.7 Thứ tự làm
1. `meta.ts`, `layout.tsx`, `page.tsx`, tokens `t`, keyframe `@theme`
2. `night-backdrop.tsx` (tĩnh, chưa mưa) + các section tĩnh C2 → C10, khớp 360 / 1440px
3. `neon-text.tsx` + `reflection.tsx`
4. `open-sign.tsx` + nhạc
5. `blackout-stack.tsx` (phương án B)
6. C12 lật bảng, C9 video + duck, C8 lau hơi nước, C16 cassette, C10 cửa cuốn
7. Mưa A8, đo fps, reduced-motion, kiểm tra nhấp nháy
8. Lighthouse, checklist template-spec §12
