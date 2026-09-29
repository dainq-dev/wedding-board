# 2D-07 · `ao-dai-2d` · Áo Dài Tím Huế

> **Design Read:** Đọc là thiệp cưới online cho một cặp đôi yêu nếp Huế, ngôn ngữ lụa tím và thư pháp tiết chế, nghiêng về mỹ học heritage editorial dịu, sâu và rất riêng tư.
>
> **Dials:** `DESIGN_VARIANCE 7/10` · `MOTION_INTENSITY 6/10` · `VISUAL_DENSITY 3/10`.

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md). Mẫu chuẩn tham chiếu: [letter-2d.md](./letter-2d.md).

---

## 1. Concept

**Một câu:** Một dải lụa tím Huế chảy dọc suốt trang như dòng sông Hương; khách "đi thuyền" xuôi theo dòng sông, mỗi khúc quanh là một chương của thiệp, và cuối dòng là một bức tranh lụa trải ngang.

**Cảm xúc muốn gợi:** dịu dàng, trầm lắng, thơ. Giống một buổi chiều trên sông Hương nghe đàn tranh, tà áo dài bay trong gió.

**Phù hợp với:** cặp đôi yêu nét truyền thống Việt, người Huế hoặc có kỷ niệm với Huế, chụp ảnh áo dài/nón lá. Hợp ảnh tông pastel, trong trẻo.

**Khác các mẫu khác ở chỗ:** có **một đường "sông" SVG duy nhất chạy xuyên suốt trang** (không phải mỗi section một đường). Đường này được vẽ dần theo cuộn (A6 scrub), uốn qua trái/phải; nội dung các section **bám theo khúc quanh** của sông (so le trái–phải), không phải một cột giữa. Màn mở là **tấm lụa quét ngang** (T4 inset từ trái sang), album là **tranh lụa cuộn ngang** (T5).

**Moodboard:** lụa tơ tằm tím, nón lá bài thơ, hoa sen trắng, cầu Trường Tiền, chữ thư pháp mềm, mây ngũ sắc nét mảnh, giấy dó.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `bg` | `#F5F0F7` | Nền trang, như giấy dó nhuộm tím rất nhạt |
| `surface` | `#FFFFFF` | Nền khung nội dung, thẻ sự kiện |
| `silk` | `#EDE3F2` | Lớp lụa phụ, nền lịch, nền form |
| `primary` | `#5B2A86` | Tím Huế: dòng sông, nút, tiêu đề |
| `primary-dark` | `#43206A` | Hover, chữ nhấn |
| `accent` | `#C9A0DC` | Tím phớt: hoa văn, viền, dấu chấm trang trí (không dùng cho chữ) |
| `lotus` | `#E9B8C8` | Hồng sen: điểm nhấn hiếm (trái tim trên lịch, cánh sen A8) |
| `gold` | `#B8925A` | Chỉ vàng trên viền nón, gạch chân tiêu đề |
| `text` | `#2E1A40` | Chữ chính |
| `text-soft` | `#6E5A80` | Chữ phụ |

Tương phản: `text` trên `bg` ≈ 14:1 ✅. `text-soft` trên `surface` ≈ 5.6:1 ✅. Chữ trắng trên `primary` ≈ 10:1 ✅. `accent` và `gold` chỉ dùng cho trang trí, không dùng làm màu chữ < 24px.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Ephesis | 52px / 1.05 | 88px | Nét thư pháp mềm; chỉ cho tên, chữ ký, chữ "Hỷ" viết tay |
| Tiêu đề chương | Lora 600 italic | 22px | 28px | Ví dụ *"Khúc thứ nhất · Gặp gỡ"* |
| Nhãn nhỏ | Lora 500, VIẾT HOA, tracking 0.25em | 12px | 13px | "LỄ VU QUY", "NHÀ TRAI" |
| Số lớn (ngày) | Lora 400 | 88px | 128px | |
| Nội dung | Lora 400 | 17px / 1.7 | 19px | |

Ephesis và Lora đều có subset `vietnamese`.

### Hình khối và chất liệu
- **Dòng sông**: 1 `<path>` SVG, stroke `primary` 2px + 1 path song song stroke `accent` 1px lệch 6px (như hai mép lụa). Đầu dòng mảnh, cuối dòng loe rộng.
- **Khung ảnh nón lá**: ảnh cắt theo hình tròn (`rounded-full`), viền 3px `gold` với các nan nón vẽ SVG (12 tia mảnh, opacity 0.35) phủ lên.
- **Khung chữ**: `rounded-2xl` (radius token `1rem`), `bg-white/80 backdrop-blur-sm`, viền `1px accent/40`.
- **Vân lụa**: SVG `feTurbulence` kéo dãn ngang (baseFrequency `0.002 0.08`), opacity 0.05, gợi thớ vải.
- **Hoa văn**: mây ngũ sắc nét mảnh 1px `accent`, đặt ở đầu mỗi chương.
- **Motion**: ease chủ đạo `sine.inOut`, mọi thứ trôi như nước. Vào 1.0s, ra 0.7s. Không nảy.

---

## 3. Nhạc

- **Tâm trạng**: đàn tranh độc tấu hoặc hoà với sáo trúc, âm hưởng ca Huế, chậm, không lời.
- **Tempo**: 55–65 BPM. **Độ dài**: 2:30–3:00, lặp lại.
- **Từ khoá Pixabay**: `vietnamese zither slow`, `guzheng calm traditional`, `asian flute peaceful`
- **Hành vi**:
  - Bắt đầu khi bấm nút "Mở thiệp" ở C1 (thao tác cần thiết cho autoplay policy). Âm lượng 0 → 0.6 trong 1.5 giây.
  - C16 (thanh nhạc trong trang) đồng bộ với nút nổi góc trên phải.
  - Ẩn tab thì tạm dừng, quay lại thì phát tiếp.

---

## 4. Cấu trúc trang

```
┌───────────────────────────┐
│ C1  Tà áo + nút Mở         │ 100svh  (cố định tới khi mở, T4 lụa quét ngang)
├───────────────────────────┤  ┐
│ C2  Tên thư pháp           │ 100svh  │
│ C16 Thanh nhạc             │  50svh  │  Dòng sông SVG chạy xuyên suốt
│ C3  Hai khung nón lá       │ 110svh  │  (A6 scrub, 1 path duy nhất).
│ C4  Ba khúc sông           │ 220svh  │  Nội dung so le trái/phải theo
│ C5+C11 Ngày cưới + lịch    │ 120svh  │  khúc quanh. Chuyển cảnh T1.
│ C6+C7 Hai lễ + bản đồ      │ 140svh  │
│ C13 Sắc áo (dress code)    │  70svh  ┘
├───────────────────────────┤
│ C8  Tranh lụa cuộn ngang   │ pin, ~300svh cuộn (T5 / A5)
├───────────────────────────┤
│ C14 Mừng cưới              │  80svh
│ C15 Xác nhận tham dự       │ 100svh
│ C10 Lời cảm ơn + sen rơi   │ 100svh  (sông đổ ra "biển" hoa sen)
└───────────────────────────┘
```

Chiều rộng nội dung: cột `min(90vw, 480px)`, **không căn giữa cứng**: section lẻ lệch trái (`mr-auto ml-[6vw]`), section chẵn lệch phải, để dòng sông luồn qua khoảng trống bên kia. Dưới `sm` độ lệch còn `4vw`, sông chạy mép. Desktop: sông rộng biên độ lớn hơn, hai bên có mây hoa văn parallax (`data-speed="0.8"` / `"1.15"`).

---

## 5. Chi tiết từng section

### C1 · Tà áo dài (màn mở thiệp)

**Mục đích:** tạo không khí Huế ngay giây đầu, và lấy thao tác bấm để phát nhạc.

**Wireframe (360px):**
```
┌────────────────────────────┐
│  ≈ mây hoa văn ≈           │
│        ╭─────╮             │
│       ╱ nón lá╲            │  ← SVG nón lá nhỏ, gold
│      ╱  ╭───╮  ╲           │
│         │   │   ~~~        │  ← tà áo dài SVG (primary),
│         │   │ ~~~~~~       │     vạt áo bay sang phải (A12)
│         │   │   ~~~~       │
│                            │
│   Minh Quân  &  Thu Hà     │  ← Ephesis 40px
│   ─── Thiệp báo hỷ ───     │  ← Lora italic 15px
│                            │
│     ╭────────────────╮     │
│     │   Mở thiệp  ❀   │     │  ← nút primary, 52px cao
│     ╰────────────────╯     │
└────────────────────────────┘
```

**Nội dung:**
- `{groom.name}` & `{bride.name}`
- Dòng phụ: *"Thiệp báo hỷ"*
- Nút: *"Mở thiệp"* (`aria-label="Mở thiệp mời và phát nhạc"`)

**Animation vào:**
| t | Hành động |
|---|---|
| 0.0s | Nền `bg` + mây fade (0.8s) |
| 0.2s | Tà áo vẽ nét A6 (1.2s) rồi fill fade 0 → 1 (0.4s) |
| 0.8s | Tên A2 theo ký tự, stagger 0.04 |
| 1.4s | Nút A1 |
| lặp | Vạt áo "bay": `skewX 0 ↔ -4°`, `x 0 ↔ 6` (A12, 3s, `sine.inOut`); nón lá `rotate ±2°` |

**Khi bấm (timeline mở, tổng 1.8s):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc bắt đầu, âm lượng tăng dần |
| 0.0s | Nút fade + `scale 0.95` (0.3s) |
| 0.1s | Tấm lụa (`div` nền `primary` với vân lụa) quét vào từ trái: `clip-path: inset(0 100% 0 0) → inset(0 0 0 0)` (0.7s) |
| 0.8s | Đổi lớp dưới: C1 ẩn, C2 hiện sẵn phía dưới |
| 0.8s | Lụa quét ra phải: `inset(0 0 0 0) → inset(0 0 0 100%)` (0.8s) — T4 |
| 1.6s | Mở khoá cuộn, khởi tạo ScrollSmoother; đầu dòng sông bắt đầu vẽ |

**Reduced-motion:** không vẽ tà áo (hiện sẵn), không A12; bấm nút → crossfade 0.3s.
**Edge case:** tên > 18 ký tự: tên xuống 2 dòng, cỡ 32px. Nút luôn ở giữa-dưới, cách đáy ≥ 96px để không chạm nút "Dùng thử" góc dưới phải.

---

### C2 · Tên thư pháp

**Mục đích:** "Trân trọng kính mời" và tên hai người được **viết ra như nét bút lông**.

**Wireframe:**
```
┌────────────────────────────┐
│ ╭──────────────────╮  │    │  ← sông bắt đầu ở mép phải
│ │ TRÂN TRỌNG BÁO   │  │    │
│ │ TIN LỄ THÀNH HÔN │   ╲   │
│ │                  │    │  │
│ │   Minh Quân      │    │  │  ← Ephesis 52px, reveal như nét bút
│ │       &          │   ╱   │
│ │     Thu Hà       │  │    │
│ │ ── ❀ ──          │  │    │
│ │ Thứ Bảy          │  │    │
│ │ 14 · 11 · 2026   │  │    │  ← `date` ⚠️
│ ╰──────────────────╯  │    │
└────────────────────────────┘
```

**Nội dung:** *"TRÂN TRỌNG BÁO TIN LỄ THÀNH HÔN"*, `{groom.name}`, `&`, `{bride.name}`, thứ và ngày (`Intl` vi-VN). Chưa có `date` ⚠️ → dùng ngày mẫu `2026-11-14T18:00`.

**Hiệu ứng "nét bút" (A6 cho chữ):** tên là chữ HTML thật, không phải path. Tạo cảm giác viết tay bằng `clip-path: inset(0 100% 0 0) → inset(0 0 0 0)` trên từng dòng tên, ease `sine.inOut`, 1.4s/dòng, và một "đầu bút" (chấm tròn 6px `primary`) chạy theo mép phải của clip. Không dùng SVG path chữ vì tên là dữ liệu động.

**Timeline (trigger `top 70%`, chạy 1 lần):**
| t | Hành động |
|---|---|
| 0.0s | Nhãn A1 |
| 0.3s | Dòng tên chú rể viết ra (1.4s) |
| 1.5s | `&` fade |
| 1.7s | Dòng tên cô dâu viết ra (1.4s) |
| 2.9s | Ngày A1 |

**Chuyển sang C16:** T1, sông uốn từ phải sang trái đúng lúc C16 lộ ra.
**Reduced-motion:** hiện tất cả, fade 0.3s.
**Edge case:** tên 50 ký tự → `text-balance`, `break-words`, cỡ giảm theo độ dài (≤ 20: 52px, ≤ 35: 40px, còn lại 30px).

---

### C16 · Thanh nhạc

**Wireframe:**
```
┌────────────────────────────┐
│    │   ╭──────────────────╮│
│    ╲   │ ♪  Khúc nhạc     ││  ← lệch phải, rounded-2xl
│     │  │    của chúng tôi ││
│     │  │  ▶/❚❚  ──●──  1:12││
│    ╱   ╰──────────────────╯│
└────────────────────────────┘
```
**Nội dung:** *"Chạm để nghe khúc nhạc của chúng tôi"*.
**Hành vi:** cùng thẻ audio với `<MusicPlayer>`. Thanh tiến độ cập nhật mỗi giây. Nút ▶/❚❚ 48×48px.
**Animation:** A1 từ phải (`x: 30 → 0`). Khi đang phát, 3 vạch sóng nhạc nhỏ dao động `scaleY` (CSS `animate-pulse` lệch delay; tắt khi reduced-motion).

---

### C3 · Hai khung nón lá

**Wireframe:**
```
┌────────────────────────────┐
│  ╭────╮                │   │
│ ( ảnh  )  NHÀ TRAI     ╲   │  ← images[1], tròn 140px, viền gold + nan nón
│  ╰────╯  Minh Quân      │  │     Ephesis 30px
│          {groom.address}│  │
│      │                     │
│   │  NHÀ GÁI    ╭────╮     │  ← images[2], so le sang phải
│   ╲  Thu Hà    ( ảnh  )    │
│    │ {bride.address}╰────╯ │
└────────────────────────────┘
```
**Nội dung:** `groom.name`, `groom.address`, `bride.name`, `bride.address`. Có tên bố mẹ ⚠️ → dòng *"Ông … · Bà …"* nhỏ trên tên; chưa có thì bỏ dòng, không để trống chỗ.
**Animation:** khung tròn A3 dạng tròn: `clip-path: circle(0% at 50% 50%) → circle(50%)` (1.1s, `expo.out`); nan nón `rotate -30° → 0` cùng lúc; chữ A1 trễ 0.3s. Hai khối cách nhau theo trigger riêng (mỗi khối `top 75%`).
**Edge case:** địa chỉ dài → `line-clamp-3`. Mobile < 360px: ảnh 112px.

---

### C4 · Ba khúc sông (chuyện tình)

**Mục đích:** điểm nhấn chính. Dòng sông uốn thành 3 khúc, mỗi khúc là một mốc chuyện tình.

**Wireframe (mỗi khúc ≈ 70svh):**
```
┌────────────────────────────┐
│ KHÚC THỨ NHẤT              │
│ Gặp gỡ            ╭──╮     │
│ ╭────────╮      ─╯  ╰─╮    │  ← sông uốn quanh ảnh
│ │ images │            │    │
│ │  [3]   │     ●───────╯   │  ← chấm mốc trên sông (primary, 12px)
│ ╰────────╯                 │
│ "Mùa thu năm ấy, bên bờ    │
│  sông, hai ta tình cờ…"    │
│                            │
│          KHÚC THỨ HAI      │  ← khúc 2 lệch phải, images[4]
│          Thương nhau       │
│              …             │
│ KHÚC THỨ BA  · Hẹn ước     │  ← images[5]
└────────────────────────────┘
```

**Nội dung viết sẵn:**
1. *Khúc thứ nhất · Gặp gỡ* — "Một chiều thu, giữa bao người qua lại, hai ta tình cờ gặp nhau. Chẳng ai ngờ đó là khởi đầu của một câu chuyện dài."
2. *Khúc thứ hai · Thương nhau* — "Những buổi chiều đi dọc bờ sông, những tin nhắn chúc ngủ ngon. Thương nhau từ những điều nhỏ nhất."
3. *Khúc thứ ba · Hẹn ước* — "Rồi một ngày, anh ngỏ lời. Em gật đầu. Và từ đây, hai dòng sông nhỏ hoà thành một."

**Animation (scrub, gắn với đường sông toàn trang):**
| Tiến độ khúc | Hành động |
|---|---|
| 0 → 0.4 | Sông vẽ tới chấm mốc (A6) |
| 0.35 | Chấm mốc `scale 0 → 1` + vòng sóng lan (`scale 1 → 2.2`, `opacity 0.6 → 0`) |
| 0.4 → 0.7 | Ảnh A3 (clip từ dưới lên), chữ A1 |
| 0.7 → 1 | Sông tiếp tục vẽ sang khúc sau |

Ảnh có `data-speed="0.92"` (ScrollSmoother effects) để trôi chậm hơn chữ.
**Reduced-motion:** sông vẽ sẵn 100%, ảnh/chữ hiện ngay.
**Edge case:** thiếu images[3..5] không xảy ra (media khai báo 6). Nếu `videos` > 0 thì bỏ qua, mẫu này không dùng video.

---

### C5 + C11 · Ngày cưới và lịch

**Wireframe:**
```
┌────────────────────────────┐
│ ╭──────────────────────╮   │
│ │  THÁNG MƯỜI MỘT      │   │  ← nền silk
│ │  Thứ Bảy             │   │
│ │       14             │   │  ← Lora 88px, primary
│ │      2026            │   │
│ │  ── ❀ ──             │   │
│ │  T2 T3 T4 T5 T6 T7 CN│   │
│ │   …  12 13 (✿) 15    │   │  ← ngày cưới trong bông sen lotus
│ │  Còn 45 ngày 06 giờ  │   │  ← A7 (4 ô)
│ ╰──────────────────────╯   │
└────────────────────────────┘
```
**Nội dung:** tên tháng bằng chữ, lịch bắt đầu Thứ Hai, đếm ngược tới `date` ⚠️. Đã qua ngày cưới → *"Đôi ta đã nên duyên vợ chồng ♥"*.
**Animation:** "14" đếm 1 → 14 (0.8s, `snap: 1`). Bông sen quanh ngày: 5 cánh `scale 0 → 1` stagger 0.06 (transform-origin tâm). Chữ số đếm ngược A7.

---

### C6 + C7 · Hai lễ và bản đồ

**Wireframe:**
```
┌────────────────────────────┐
│   │ ╭────────────────────╮ │
│   ╲ │ LỄ VU QUY          │ │
│    ││ 08:00 · Thứ Bảy    │ │
│    ││ Tư gia nhà gái     │ │
│    ││ {bride.address}    │ │
│   ╱ ╰────────────────────╯ │
│ ╭────────────────────╮ │   │
│ │ TIỆC CƯỚI          │  ╲  │
│ │ 18:00 · Thứ Bảy    │   │ │
│ │ {venue.name}       │   │ │
│ │ ┌────────────────┐ │   │ │
│ │ │  <MapEmbed>    │ │  ╱  │  ← 16:10, rounded-xl
│ │ └────────────────┘ │ │   │
│ │ [ ⌖ Chỉ đường ]    │ │   │  ← google.com/maps/dir/?api=1&destination=lat,lng
│ ╰────────────────────╯ │   │
└────────────────────────────┘
```
**Nội dung:** giờ lễ vu quy viết sẵn 08:00; giờ tiệc lấy từ `date` ⚠️ (fallback 18:00). `venue.name` rỗng → *"Nhà hàng tiệc cưới"*.
**Animation:** mỗi thẻ A1 từ phía đối diện sông (`x: ±24`). Map chỉ mount khi section cách viewport < 1 màn hình.

---

### C13 · Sắc áo (dress code)

```
┌────────────────────────────┐
│      SẮC ÁO NGÀY VUI       │
│  Mời quý khách diện tông   │
│  tím pastel và trắng ngà   │
│   ▲     ▲     ▲     ▲      │  ← 4 "tà áo" nhỏ (SVG), fill màu
│  Tím  Tím   Trắng  Hồng    │     #5B2A86 #C9A0DC #FFFFFF #E9B8C8
│  Huế  phớt  ngà    sen     │
└────────────────────────────┘
```
**Animation:** 4 tà áo `y: 20 → 0` + `skewX -6° → 0` stagger 0.1. Mỗi tà áo có `aria-label` tên màu.

---

### C8 · Tranh lụa cuộn ngang (album)

**Mục đích:** khi sông "đổ" vào đây, trang chuyển sang cuộn ngang như trải một bức tranh lụa dài.

**Wireframe (360px, section ghim):**
```
┌────────────────────────────┐
│ ═══ trục gỗ tranh ═══      │  ← thanh trên, gold
│ ┌──────┐ ┌──────┐ ┌──     │
│ │images│ │images│ │im     │  ← ảnh 4:5, cao 58svh
│ │ [0]  │ │ [3]  │ │[4]    │     nền lụa silk giữa các ảnh
│ └──────┘ └──────┘ └──     │
│ ~~ sóng nước mảnh ~~       │
│ ═══ trục gỗ tranh ═══      │
│ ◀ cuộn để xem tiếp ▶  2/6  │
└────────────────────────────┘
```
**Nội dung:** ảnh theo thứ tự `images[0], [3], [4], [5], [1], [2]` (tất cả ảnh, mở đầu bằng ảnh bìa). Giữa ảnh 3 và 4 có một ô chữ Ephesis: *"Trăm năm tình viên mãn"*.
**Animation:** T5: ghim section, track dịch `x: -(scrollWidth - innerWidth)` với `scrub: 1` (A5). Mỗi ảnh có parallax trong khung `xPercent -8 → 8` theo `containerAnimation`. Bấm ảnh → A10 lightbox (GSAP Flip).
**Reduced-motion / màn hẹp khi tắt JS:** không ghim, track thành `overflow-x-auto snap-x snap-mandatory`, vuốt tay.
**Accessibility:** mỗi ảnh là `<button>` có `aria-label="Xem ảnh cưới 2 trên 6"`.

---

### C14 · Mừng cưới

```
┌────────────────────────────┐
│        MỪNG CƯỚI           │
│  Sự hiện diện của quý      │
│  khách là niềm vui lớn     │
│  nhất của gia đình.        │
│ ╭────────╮  ╭────────╮     │
│ │   QR   │  │   QR   │     │  ← QR mẫu ⚠️ (chờ chốt §8.3)
│ │nhà trai│  │ nhà gái│     │
│ ╰────────╯  ╰────────╯     │
└────────────────────────────┘
```
**Hành vi:** bấm QR → A10 phóng to. QR mẫu ghi rõ chữ nhỏ *"Mã QR minh hoạ"*.

---

### C15 · Xác nhận tham dự (chỉ giao diện)

```
┌────────────────────────────┐
│     XÁC NHẬN THAM DỰ       │
│  [ Tên của bạn        ]    │
│  ( ) Tôi sẽ đến            │
│  ( ) Rất tiếc, không đến   │
│  Số người: [ 1 ▾ ]         │
│  ╭──────────────────╮      │
│  │  Gửi xác nhận    │      │
│  ╰──────────────────╯      │
│  Bản xem thử — không gửi đi│
└────────────────────────────┘
```
**Hành vi:** gửi → form thu lại (`height → 0`, 0.5s) và hiện *"Cảm ơn {tên}! Hẹn gặp bạn ở ngày vui ♥"*. Không gửi dữ liệu đi đâu.

---

### C10 · Lời cảm ơn (sen rơi)

```
┌────────────────────────────┐
│  ✿      ✿        ✿         │  ← cánh sen rơi A8
│      ╭────────╮            │
│     (  ảnh cuối )          │  ← images[5], khung tròn nón lá
│      ╰────────╯            │
│  Cảm ơn quý khách đã dành  │
│  thời gian chung vui cùng  │
│  gia đình chúng tôi.       │
│    Minh Quân & Thu Hà      │  ← Ephesis 40px
│ ~~~~~~~~~~~~~~~~~~~~~~~~~~ │  ← sông loe ra thành mặt nước
└────────────────────────────┘
```
**Animation:** dòng sông toàn trang vẽ nốt đoạn cuối và loe thành 3 gợn nước ngang (A6). 24 cánh sen (desktop) / 14 (mobile) rơi chậm với `y`, `x` sine, `rotation`, lặp; chỉ chạy khi section trong viewport. Tắt hoàn toàn khi reduced-motion.

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | C8 ảnh mở đầu tranh lụa | 4:5 |
| `images[1]` | C3 chú rể (tròn) + C8 | 1:1 |
| `images[2]` | C3 cô dâu (tròn) + C8 | 1:1 |
| `images[3]` | C4 khúc 1 + C8 | 4:5 |
| `images[4]` | C4 khúc 2 + C8 | 4:5 |
| `images[5]` | C4 khúc 3 + C8 + C10 | 4:5 |

`meta.media = { images: 6, videos: 0 }`. `meta.styles = ["traditional", "floral"]`, `colors = ["purple", "white"]`.

Trường chưa chốt ⚠️: `date` (fallback ngày mẫu), tên bố mẹ (ẩn dòng), QR (ảnh mẫu).

## 7. Asset cần chuẩn bị
- [ ] SVG: tà áo dài (thân + vạt tách riêng để animate), nón lá, nan nón (overlay), mây hoa văn (2 kiểu), bông sen (5 cánh tách), cánh sen rơi, trục tranh
- [ ] Path dòng sông: 1 path dọc dài (viewBox 100×1000, `preserveAspectRatio="none"`) — 2 biến thể mobile/desktop
- [ ] `music.mp3` đàn tranh (Pixabay) + `CREDITS.md`
- [ ] 6 ảnh mẫu áo dài tông tím/trắng (Unsplash) ≤ 300KB `.webp`
- [ ] `thumb.webp` 600×800: tà áo + tên trên nền tím nhạt
- [ ] `opengraph-image.png` 1200×630

## 8. Tiêu chí nghiệm thu riêng
- [ ] Dòng sông liền mạch từ C2 tới C10, không đứt ở ranh giới section, ở cả 360px và 1440px
- [ ] Sông không bao giờ đè lên chữ (kiểm bằng tên 50 ký tự và địa chỉ 3 dòng)
- [ ] Tranh lụa C8 cuộn ngang mượt, ghim/nhả không giật; resize xoay ngang điện thoại vẫn đúng
- [ ] Từ lúc bấm "Mở thiệp" đến lúc cuộn được ≤ 2 giây, nhạc phát ngay khi bấm
- [ ] Cánh sen dừng khi C10 ra khỏi viewport (kiểm Performance panel)

---

## 9. Triển khai code

### 9.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/ao-dai-2d/
├── meta.ts
├── layout.tsx                 # Ephesis + Lora (subsets: ["vietnamese"]), metadata
├── page.tsx                   # return <AoDaiInvite />
└── _components/
    ├── ao-dai-invite.tsx      # "use client" — tokens t, ghép section, SmoothScroll
    ├── river.tsx              # SVG sông toàn trang (absolute, cao = chiều cao nội dung) + A6 scrub
    ├── silk-gate.tsx          # C1 + T4 lụa quét ngang
    ├── brush-name.tsx         # hiệu ứng viết tên bằng clip-path + đầu bút
    ├── non-la-frame.tsx       # khung ảnh tròn + nan nón
    ├── sections/
    │   ├── names.tsx          # C2
    │   ├── song.tsx           # C16
    │   ├── families.tsx       # C3
    │   ├── story-river.tsx    # C4
    │   ├── date.tsx           # C5 + C11
    │   ├── events.tsx         # C6 + C7
    │   ├── dress.tsx          # C13
    │   ├── silk-scroll.tsx    # C8 (A5)
    │   ├── gift.tsx           # C14
    │   ├── rsvp.tsx           # C15
    │   └── thanks.tsx         # C10 + cánh sen
    ├── name-size.ts           # chọn cỡ chữ theo độ dài tên (+ test)
    └── svg/                   # ao-dai, non-la, cloud, lotus, petal
```
Dùng chung từ `@/kit`: `SmoothScroll`, `OpenGate`, `MusicPlayer`, `Countdown`, `MonthGrid` (nếu đã có từ letter-2d), `useReducedMotion`, `presets`. `MapEmbed` từ `@/components`. Dữ liệu từ `useWedding().data`.

### 9.2 Tokens
```ts
// ao-dai-invite.tsx
export const t = {
  root: "bg-[#F5F0F7] text-[#2E1A40] font-(family-name:--font-body)",
  panel: "bg-white/80 backdrop-blur-sm border border-[#C9A0DC]/40 rounded-2xl",
  silk: "bg-[#EDE3F2]",
  primary: "bg-[#5B2A86] text-white hover:bg-[#43206A]",
  label: "text-xs tracking-[0.25em] uppercase font-medium text-[#5B2A86]",
  chapter: "italic font-semibold text-[22px] lg:text-[28px]",
  script: "font-(family-name:--font-script)",
  soft: "text-[#6E5A80]",
} as const;
```

### 9.3 Dòng sông xuyên trang
```tsx
// river.tsx (rút gọn) — đặt absolute inset-0 trong wrapper của C2→C10, pointer-events-none, z-0
useGSAP(() => {
  if (reduced) return;
  gsap.fromTo(".river-path", { drawSVG: "0%" }, {
    drawSVG: "100%", ease: "none",
    scrollTrigger: { trigger: root.current, start: "top 60%", end: "bottom bottom", scrub: 0.6 },
  });
}, { scope: root, dependencies: [reduced] });
```
- Path dùng `vector-effect="non-scaling-stroke"` để stroke không phình khi SVG giãn theo chiều cao trang.
- Khúc quanh phải khớp vị trí section lệch trái/phải: sinh `d` bằng hàm `riverPath(sectionTops, width)` sau khi đo `offsetTop` các section (chạy lại khi `ScrollTrigger.refresh`). Hàm này thuần, **viết test** (`river-path.test.ts`): số điểm uốn = số section, x luân phiên trái/phải.
- C8 (ghim ngang) nằm **ngoài** wrapper sông: sông dừng ở cuối C13 và nối lại ở C14 bằng một path thứ hai.

### 9.4 Lụa quét (C1, T4)
```tsx
tl.current = gsap.timeline({ paused: true, defaults: { ease: "sine.inOut" } })
  .to(".gate-btn", { opacity: 0, scale: 0.95, duration: 0.3 }, 0)
  .fromTo(".silk", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.7 }, 0.1)
  .set(".gate-content", { autoAlpha: 0 })
  .to(".silk", { clipPath: "inset(0 0 0 100%)", duration: 0.8 })
  .call(onOpened);
```
`clip-path` không phải transform/opacity nhưng chỉ chạy 1.5s một lần trên một lớp, chấp nhận được (giống T4 trong thư viện chung).

### 9.5 Tranh lụa ngang (C8)
```tsx
const tween = gsap.to(track.current, {
  x: () => -(track.current!.scrollWidth - window.innerWidth), ease: "none",
  scrollTrigger: { trigger: section.current, pin: true, scrub: 1, end: () => `+=${track.current!.scrollWidth}`, invalidateOnRefresh: true },
});
imgs.forEach((img) => gsap.fromTo(img, { xPercent: -8 }, { xPercent: 8, ease: "none",
  scrollTrigger: { trigger: img, containerAnimation: tween, start: "left right", end: "right left", scrub: true } }));
```

### 9.6 Logic cần test
- `nameSize(name)` → cỡ chữ theo độ dài.
- `riverPath(tops, width)` → chuỗi `d` hợp lệ, luân phiên trái/phải.
- Định dạng ngày/tháng tiếng Việt (dùng chung với `@/kit` nếu có).

### 9.7 Thứ tự làm
1. `meta.ts`, `layout.tsx`, `page.tsx`, tokens → trang trống có đúng font
2. Section tĩnh C2 → C10 với bố cục so le, khớp wireframe ở 360px và 1440px
3. `silk-gate.tsx` + nhạc
4. `river.tsx` (đo section, sinh path, A6 scrub) — phần khó nhất, làm sớm
5. `brush-name.tsx`, `story-river.tsx`
6. `silk-scroll.tsx` (A5 + lightbox)
7. Cánh sen C10, reduced-motion, tên dài, Lighthouse
8. Checklist template-spec §12
