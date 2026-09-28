# 2D-04 · `film-2d` · Thước Phim

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md).

---

## 1. Concept

**Một câu:** Thiệp cưới là một bộ phim đen trắng: đếm ngược 3-2-1 của máy chiếu, tấm clapperboard đập xuống, và mỗi phần nội dung là một "cảnh" có số cảnh, khung letterbox, rồi khép lại bằng dòng credits cuộn lên.

**Cảm xúc muốn gợi:** điện ảnh, hoài cổ, hơi bí ẩn, "chúng tôi là nhân vật chính".

**Phù hợp với:** cặp đôi mê phim, ảnh cưới đen trắng hoặc tông film, có 1 clip pre-wedding ngắn.

**Khác các mẫu khác ở chỗ:**
- **Nhịp theo cảnh**: mỗi section được ghim và **cắt cảnh** sang cảnh sau (T2: crossfade qua khung đen 0.2s, như cú cắt dựng phim), không trượt.
- **Letterbox động**: hai dải đen trên/dưới co giãn theo từng cảnh (21:9 cho cảnh "điện ảnh", mở hết cho cảnh thông tin).
- **Đoạn cuộn ngang** là một dải film 35mm (A5 / T5) — khung hình có lỗ răng cưa hai mép.
- Lớp **film grain + vệt xước** phủ toàn trang (SVG noise, không canvas).

**Moodboard:** phim noir 1950, bảng clapperboard phấn trắng, leader đếm ngược vòng tròn, poster phim cổ, ánh đèn máy chiếu, vé xem phim xé cuống.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `black` | `#0D0D0D` | Nền trang, letterbox |
| `surface` | `#1A1A1A` | Thẻ, vé, khung phim |
| `frame` | `#262626` | Viền dải film, đường kẻ |
| `silver` | `#F5F5F0` | Tiêu đề, tên |
| `text` | `#E8E8E3` | Chữ chính |
| `text-soft` | `#A3A39C` | Chú thích, nhãn "CẢNH 03" |
| `gold` | `#C9A227` | Nhấn duy nhất: vé, ngày công chiếu, nút |
| `gold-dark` | `#9C7C16` | Hover nút |

Tương phản: `text` trên `black` ≈ 16:1 ✅; `text-soft` trên `black` ≈ 7.5:1 ✅; `gold` trên `black` ≈ 8:1 ✅; chữ `black` trên nút `gold` ≈ 8:1 ✅ (nút dùng chữ đen, không dùng chữ trắng).
Ảnh người dùng: áp `grayscale` mặc định (class `grayscale`), ảnh cuối C10 chuyển dần sang màu (điểm cảm xúc).

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Playfair Display 400 italic | 44px / 1.05 | 88px | Như title card phim cổ |
| Tiêu đề cảnh | Playfair Display 700, VIẾT HOA, tracking 0.15em | 20px | 28px | "CÔNG CHIẾU" |
| Nhãn kỹ thuật | Space Mono 400, VIẾT HOA, tracking 0.2em | 11px | 12px | "CẢNH 03 · TAKE 1 · 35MM" |
| Nội dung | Space Mono 400 | 14px / 1.7 | 15px | |
| Số lớn | Playfair Display 400 italic | 96px | 160px | Đếm ngược leader, ngày |

Hai font có subset `vietnamese`.

### Hình khối và chất liệu
- **Radius 0** mọi nơi (trừ leader tròn).
- **Letterbox**: 2 `div` `fixed` trên/dưới `bg-black h-[var]` → dùng `scaleY` từ `origin-top`/`origin-bottom` để animate (chỉ transform). `z-30`.
- **Film grain**: 1 `<svg>` `fixed inset-0 pointer-events-none z-20 opacity-[0.08] mix-blend-overlay` với `feTurbulence baseFrequency=0.9`; rung vị trí bằng keyframe `film-2d-grain` (steps(6), 0.5s) — khai báo trong `@theme` theo spec §5.
- **Vệt xước**: 2 đường dọc 1px `bg-white/10` nhảy vị trí ngẫu nhiên mỗi 1.2s (GSAP `repeat: -1`, `repeatRefresh`).
- **Dải film**: `bg-[#1A1A1A]` với lỗ răng cưa bằng `bg-[radial-gradient(...)]` lặp (`bg-repeat-x`).
- **Motion**: ease `power4.inOut` cho letterbox và cắt cảnh; chữ `expo.out`.

---

## 3. Nhạc

- **Tâm trạng**: jazz piano noir, contrabass gẩy, có thể có tiếng máy chiếu lách cách ở đầu bài (không bắt buộc), không lời.
- **Tempo**: 75–85 BPM. **Độ dài**: 2:30–3:00, lặp.
- **Từ khoá Pixabay**: `noir jazz piano romantic`, `vintage jazz lounge`
- **Hành vi**:
  - Phát khi bấm "Bấm máy" ở C1, âm lượng 0 → 0.6 trong 1.5s.
  - **Khi video C9 phát**: nhạc nền giảm về 0.1 (1s); video dừng/kết thúc → trở lại 0.6. Video có `controls`, không tự phát (spec §11); người dùng bấm play thì mới có tiếng, lúc đó nhạc nền giảm.
  - Ẩn tab → dừng.

---

## 4. Cấu trúc trang

```
┌───────────────────────────┐
│ C1  Leader 3-2-1           │ 100svh  fixed tới khi bấm
├───────────────────────────┤  letterbox: 21:9 ─┐
│ C2  Title card             │ 150svh  pin  T2  │
│ C3  Hai diễn viên chính    │ 150svh  pin  T2  │ letterbox giữ 21:9
├───────────────────────────┤                   │
│ C4  Dải film ngang 5 khung │ 300svh  pin  T5 (A5) — letterbox mở hết
├───────────────────────────┤
│ C9  Màn chiếu video        │ 120svh       T2  letterbox 21:9 → 16:9
│ C5+C6 Công chiếu + vé      │ 140svh       T2  letterbox mở hết
│ C7  Rạp (bản đồ)           │ 100svh       T1
│ C8  Contact sheet (album)  │ 140svh       T1
│ C10 The End + credits      │ 200svh  A9 dọc (credits theo scrub)
└───────────────────────────┘
```

Chiều rộng chữ `min(90vw, 560px)`; ảnh cảnh tràn chiều ngang trong phạm vi letterbox. Desktop: giữ khung 16:9 ở giữa, hai bên đen.

---

## 5. Chi tiết từng section

### C1 · Leader đếm ngược

**Wireframe (360px):**
```
┌────────────────────────────┐
│ ←(nút chung)               │
│                            │
│        ╭────────╮          │
│      ╭─┼────────┼─╮        │  ← 2 vòng tròn đồng tâm + chữ thập mảnh
│      │ │   3    │ │        │  ← Playfair italic 120px
│      ╰─┼────────┼─╯        │  ← kim quét conic-gradient
│        ╰────────╯          │
│   MINH QUÂN & THU HÀ       │  ← Space Mono 12px tracking 0.3em
│   PRESENT                  │
│                            │
│      [ ▶ BẤM MÁY ]         │  ← nút gold, chữ đen, ≥ 44px
└────────────────────────────┘
```

**Animation vào (lặp):** kim quét 1 vòng/1s (`rotate 0 → 360`, `ease: none`) trên lớp `bg-[conic-gradient(from_0deg,rgba(255,255,255,0.18)_var(--a),transparent_0)]` — biến `--a` animate bằng GSAP (GSAP set CSS var được, không cần CSS thuần). Số lặp 3 → 2 → 3 → 2 … (chờ bấm). Grain + vệt xước chạy.

**Khi bấm (tổng 2.2s, có nút "Bỏ qua" nhỏ góc dưới-trái — không đè góc dưới phải):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc phát |
| 0.0s | Số về "3", quét tiếp 3 → 2 → 1 (mỗi số 0.5s) |
| 1.5s | Flash trắng `opacity 0 → 0.9 → 0` (0.15s) + grain tăng opacity 0.08 → 0.3 → 0.08 |
| 1.65s | T4: lớp C1 `clip-path: inset(0) → inset(50% 0 50% 0)` (đóng thành 1 đường ngang như tắt TV cổ, 0.4s) |
| 1.9s | Letterbox trượt vào tới tỉ lệ 21:9 (`scaleY 0 → 1`, 0.5s) |
| 2.2s | Mở khoá cuộn |

**Reduced-motion:** không quét, không flash; bấm → crossfade 0.3s, letterbox cố định.

---

### C2 · Title card (ghim)

```
┌────────────────────────────┐
│████████████████████████████│  ← letterbox trên
│                            │
│  A FILM BY TWO HEARTS      │  ← Mono 11px text-soft
│                            │
│      Minh Quân             │  ← Playfair italic 44px
│          &                 │
│        Thu Hà              │
│  ────────────────────────  │
│  CÔNG CHIẾU 14.11.2026     │  ← gold, cần `date` ⚠️
│████████████████████████████│  ← letterbox dưới
└────────────────────────────┘
  nền: images[0] grayscale, tối 55%, scale 1.15 → 1 theo scrub (Ken Burns)
```
**Nội dung:** *"MỘT BỘ PHIM CỦA HAI TRÁI TIM"* (hoặc dòng tiếng Anh ở trên làm nhãn phụ), tên, *"CÔNG CHIẾU {dd.MM.yyyy}"*.
**Animation (pin 150svh, scrub):** 0–30%: tên A2 theo dòng; 30–80%: ảnh nền zoom chậm; 80–100%: **cắt cảnh** (T2): cả cảnh `opacity → 0` trong 10% scrub, màn đen giữ 5%, cảnh C3 `opacity 0 → 1`.
**Lớp phủ:** `bg-black/55` trên ảnh để chữ đạt ≥ 4.5:1.

---

### C3 · Hai diễn viên chính

```
┌────────────────────────────┐
│████████████████████████████│
│ CẢNH 02 · DIỄN VIÊN CHÍNH  │
│ ┌──────────┐               │
│ │ images[1]│ TRONG VAI     │  ← ảnh 3:4 grayscale, 50% rộng
│ │          │ CHÚ RỂ        │
│ └──────────┘ Minh Quân     │  ← Playfair italic 28px
│              {groom.addr}  │  ← Mono 12px text-soft
│ ─────────────────────────  │
│   TRONG VAI ┌──────────┐   │
│   CÔ DÂU    │ images[2]│   │  ← đối xứng, ảnh bên phải
│   Thu Hà    │          │   │
│ {bride.addr}└──────────┘   │
│████████████████████████████│
└────────────────────────────┘
```
**Animation (pin 150svh):** thẻ chú rể A3 (clip từ trái sang) ở 0–35%; thẻ cô dâu A3 (từ phải) ở 35–70%; 70–100% cắt cảnh sang C4 và **letterbox mở hết** (`scaleY 1 → 0`) để chuẩn bị đoạn ngang.
**Edge case:** địa chỉ dài → `line-clamp-3`.

---

### C4 · Dải film ngang — chuyện tình (T5 / A5)

```
┌────────────────────────────┐
│ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫  │  ← lỗ răng cưa
│ ┌──────┐┌──────┐┌──────┐   │
│ │img[3]││img[4]││img[5]│ → │  ← dải khung 4:3, rộng 80vw mỗi khung
│ │      ││      ││      │   │     trượt ngang theo cuộn dọc
│ └──────┘└──────┘└──────┘   │
│ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫  │
│ 03A  2019 · Lần đầu gặp    │  ← chú thích dưới mỗi khung (Mono)
│ ▮▮▮▮▯▯▯▯▯  2/5             │  ← thanh tiến độ phim
└────────────────────────────┘
```
**Nội dung (5 khung):** 0 = nhãn *"CHUYỆN TÌNH · 5 KHUNG HÌNH"*, 1–3 = `images[3..5]` với chú thích viết sẵn (*"Lần đầu gặp"*, *"Buổi hẹn đầu tiên"*, *"Lời cầu hôn"*, năm viết sẵn), 4 = `images[6]` *"Và phần tiếp theo…"*.
**Animation:** pin 300svh; `x: -(scrollWidth - innerWidth)` scrub 1. Ảnh giữ đen trắng; khung giữa `scale 1`, khung khác `scale 0.92, opacity 0.6` (tính theo `containerAnimation`). Lỗ răng cưa chạy nhanh hơn 1.1× (cảm giác cuộn phim).
**Reduced-motion:** không pin; các khung xếp dọc, ảnh 4:3 tràn ngang.

---

### C9 · Màn chiếu video

```
┌────────────────────────────┐
│████████████████████████████│
│ CẢNH 04 · TRAILER          │
│ ┌────────────────────────┐ │
│ │                        │ │  ← <video controls playsInline
│ │   ▶  videos[0]         │ │     preload="metadata" poster=images[0]>
│ │                        │ │     16:9, viền frame
│ └────────────────────────┘ │
│  Chạm để xem trailer       │
│████████████████████████████│
└────────────────────────────┘
```
**Hành vi:** không tự phát. Khi `play` → nhạc nền duck về 0.1; `pause`/`ended` → về 0.6. Chỉ render khi `videos.length > 0`; nếu không có video → bỏ cả section (letterbox bỏ qua bước này).
**Animation:** letterbox từ 21:9 co về 16:9 (0.6s) khi section vào; khung video A3.
**`<video>` dùng `aspect-video`** để chống CLS.

---

### C5 + C6 · Công chiếu (vé xem phim)

```
┌────────────────────────────┐
│      ★ CÔNG CHIẾU ★        │
│ ┌──────────────────┬─────┐ │  ← vé surface, viền gold 1px
│ │ ADMIT ONE        │  A  │ │     cuống vé tách bằng đường chấm
│ │ THỨ BẢY          │  D  │ │
│ │ 14 . 11 . 2026   │  M  │ │  ← Playfair italic 36px gold
│ │ ─────────────    │  I  │ │
│ │ 10:00 LỄ CƯỚI    │  T  │ │
│ │  {groom.address} │     │ │
│ │ 18:00 TIỆC CƯỚI  │  1  │ │
│ │  {venue.name}    │     │ │
│ │ CÒN 45:06:12:33  │     │ │  ← Countdown A7, Mono
│ └──────────────────┴─────┘ │
└────────────────────────────┘
```
**Nội dung:** giờ viết sẵn theo `date` ⚠️ (fallback 14.11.2026, lễ 10:00, tiệc 18:00). Đã qua ngày → *"ĐÃ CÔNG CHIẾU · CẢM ƠN KHÁN GIẢ"*.
**Animation:** vé trượt lên như ra khỏi máy in vé (`yPercent 100 → 0`, clip bởi khe phía trên, 0.9s `power4.out`); dòng chữ trên vé cuộn lên kiểu credit (stagger 0.08). Bấm cuống vé → cuống "xé" ra (`rotate 8, x 12`, 0.3s) — chỉ trang trí, bấm lại để gắn vào.

---

### C7 · Rạp chiếu

```
┌────────────────────────────┐
│ CẢNH 06 · ĐỊA ĐIỂM         │
│ {venue.name}               │  ← Playfair italic 28px
│ ┌────────────────────────┐ │
│ │ <MapEmbed> 4:3         │ │  ← bộ lọc grayscale nhẹ trên khung (không
│ └────────────────────────┘ │     đè lên iframe tương tác: filter trên wrapper)
│ [ CHỈ ĐƯỜNG TỚI RẠP → ]    │  ← nút gold chữ đen
└────────────────────────────┘
```
**Animation:** A1. MapEmbed lazy.

---

### C8 · Contact sheet (album)

```
┌────────────────────────────┐
│ CONTACT SHEET · CUỘN 01    │
│ ┌────┬────┬────┐           │
│ │ 1  │ 2  │ 3  │           │  ← lưới 3 cột, ảnh 3:2 grayscale
│ ├────┼────┼────┤           │     số khung Mono 10px dưới mỗi ảnh
│ │ 4  │ ⊚5 │ 6  │           │  ← ⊚ vòng bút gold
│ └────┴────┴────┘           │     khoanh "ảnh được chọn"
└────────────────────────────┘
```
**Nội dung:** `images[3..7]` + `images[0]` (6 ô).
**Hành vi:** bấm ảnh → A10 lightbox, trong lightbox ảnh hiện **màu gốc** (bỏ grayscale).
**Animation:** ô ảnh hiện như phim được rọi đèn: dùng lớp trắng phủ `opacity 0.8 → 0` (stagger 0.06). Vòng khoanh A6.

---

### C10 · The End + credits

```
┌────────────────────────────┐
│     ╭──────────────╮       │
│     │  images[7]   │       │  ← grayscale → màu theo scrub (lớp ảnh màu
│     ╰──────────────╯       │     chồng lên ảnh xám, opacity 0 → 1)
│        The End             │  ← Playfair italic 64px
│  ...hay chỉ mới bắt đầu.   │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─     │
│  ĐẠO DIỄN     TÌNH YÊU     │  ← credits cuộn dọc (A9 dọc theo scrub)
│  CHÚ RỂ       Minh Quân    │
│  CÔ DÂU       Thu Hà       │
│  KHÁCH MỜI    Bạn ♥        │
│  CẢM ƠN ĐÃ XEM             │
└────────────────────────────┘
```
**Animation:** pin 200svh; 0–30%: "The End" A2; 30–100%: khối credits `yPercent 100 → -100`; letterbox đóng dần lại (`scaleY → 2×`) ở 90–100%, còn một dải sáng ở giữa, như hết phim.
**Reduced-motion:** credits hiển thị tĩnh; ảnh màu ngay.

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | C2 nền title + poster video + C8 | 16:9 (crop) |
| `images[1]` | C3 chú rể | 3:4 |
| `images[2]` | C3 cô dâu | 3:4 |
| `images[3..6]` | C4 dải film (4 khung ảnh) | 4:3 |
| `images[3..7]` | C8 contact sheet | 3:2 |
| `images[7]` | C10 ảnh cuối | 4:5 |
| `videos[0]` | C9 trailer | 16:9 |

`meta.media = { images: 8, videos: 1 }`. `sampleData` có 4 ảnh, 0 video → **phải thêm 4 ảnh + 1 video mẫu ngắn (≤ 15s, ≤ 3MB, `.mp4` H.264) vào `public/sample/`**.

## 7. Asset cần chuẩn bị
- [ ] SVG: leader (vòng + chữ thập), clapperboard (nếu dùng làm icon cảnh), lỗ răng cưa, vé, noise grain
- [ ] Keyframe `film-2d-grain` trong `@theme` (tiền tố slug)
- [ ] `music.mp3` + `CREDITS.md`
- [ ] 8 ảnh mẫu (ưu tiên ảnh có tương phản mạnh khi chuyển xám) + 1 video mẫu
- [ ] `thumb.webp` 600×800: leader số "3" trên nền đen, `opengraph-image.png`

## 8. Tiêu chí nghiệm thu riêng
- [ ] Nút "Bỏ qua" ở C1 dùng được; tổng intro ≤ 2.2s
- [ ] Letterbox chỉ dùng `scaleY`, không animate `height`
- [ ] Đoạn ngang C4 không gây cuộn ngang trang ở 360px
- [ ] Video không tự phát; nhạc nền duck đúng khi xem video
- [ ] Không có video (`videos=[]`) → C9 biến mất, không để khung trống
- [ ] Grain không làm tụt FPS (1 lớp SVG tĩnh + transform steps)

---

## 9. Triển khai code

### 9.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/film-2d/
├── meta.ts
├── layout.tsx                 # Playfair_Display (italic, --font-display) + Space_Mono (--font-mono), vietnamese
├── page.tsx                   # return <FilmInvite />
└── _components/
    ├── film-invite.tsx        # ghép, SmoothScroll, OpenGate
    ├── tokens.ts
    ├── film-grain.tsx         # lớp grain + vệt xước
    ├── letterbox.tsx          # 2 dải, API setRatio("21:9" | "16:9" | "open")
    ├── letterbox-ratio.ts     # ratio → scaleY theo viewport
    ├── letterbox-ratio.test.ts
    ├── leader.tsx             # C1
    ├── sections/
    │   ├── title-card.tsx     # C2
    │   ├── cast.tsx           # C3
    │   ├── film-strip.tsx     # C4 (A5)
    │   ├── trailer.tsx        # C9
    │   ├── ticket.tsx         # C5 + C6
    │   ├── cinema.tsx         # C7
    │   ├── contact-sheet.tsx  # C8
    │   └── the-end.tsx        # C10
    └── svg/
```

### 9.2 Tokens
```ts
export const t = {
  root: "min-h-screen bg-[#0D0D0D] text-[#E8E8E3] font-(family-name:--font-mono)",
  display: "font-(family-name:--font-display) italic",
  label: "text-[11px] lg:text-xs uppercase tracking-[0.2em] text-[#A3A39C]",
  btn: "min-h-11 bg-[#C9A227] px-6 uppercase tracking-[0.15em] text-[#0D0D0D] hover:bg-[#9C7C16]",
  frame: "bg-[#1A1A1A] border border-[#262626]",
  photo: "grayscale object-cover",
} as const;
```

### 9.3 Letterbox
```ts
// letterbox-ratio.ts — chiều cao mỗi dải (tỉ lệ của viewport) để vùng giữa có tỉ lệ `r`
export function barFraction(vw: number, vh: number, r: number) {
  const inner = vw / r;
  return inner >= vh ? 0 : (vh - inner) / 2 / vh;   // 0..0.5
}
```
Mỗi dải là `h-1/2` cố định, animate `scaleY: barFraction * 2`. Mobile dọc (360×740) 21:9 → dải ≈ 0.39 → vùng giữa chỉ 155px: **quá hẹp**, nên trên mobile dọc tỉ lệ "21:9" được hiểu là dải cố định 12svh mỗi bên (hàm nhận `min(computed, 0.12)`). Test cả hai nhánh.

### 9.4 Cắt cảnh (T2) giữa cảnh ghim
```tsx
gsap.timeline({ scrollTrigger: { trigger: scene, start: "top top", end: "+=150%", pin: true, scrub: 0.4 } })
  .from(split.lines, { yPercent: 100, stagger: 0.1, ease: "expo.out", duration: 0.3 })
  .fromTo(".bg-photo", { scale: 1.15 }, { scale: 1, ease: "none", duration: 0.5 }, 0)
  .to(scene, { autoAlpha: 0, duration: 0.1 }, 0.8);     // cảnh sau có opacity 0 → 1 trong trigger riêng
```
Đặt `pinSpacing: true`, cảnh sau bắt đầu `autoAlpha: 0` và fade vào ở 5% đầu của nó, tạo khoảng đen ngắn giữa hai cảnh.

### 9.5 Duck nhạc khi xem video
```tsx
<video controls playsInline preload="metadata" poster={images[0]} className="aspect-video w-full"
  onPlay={() => music.fadeTo(0.1)} onPause={() => music.fadeTo(0.6)} onEnded={() => music.fadeTo(0.6)}>
  <source src={videos[0]} />
</video>
```
Cần `MusicPlayer` trong `@/kit` expose `fadeTo(volume)`; nếu chưa có thì đề xuất thêm ở P0 (ghi chú cho người làm kit).

### 9.6 Thứ tự làm
1. `meta.ts`, layout, tokens, thêm ảnh + video mẫu
2. Section tĩnh C2 → C10 (grayscale, bố cục)
3. Grain + letterbox + test `barFraction`
4. C1 leader + nhạc + nút bỏ qua
5. Pin + cắt cảnh C2/C3, đoạn ngang C4
6. Video duck, vé, contact sheet lightbox, credits
7. Reduced-motion, tên dài, Lighthouse, checklist template-spec §12
