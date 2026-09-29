# 2D-09 · `botanical-2d` · Vườn Màu Nước

## Design Read

**Đọc là:** thiệp cưới online cho một cặp đôi tổ chức hôn lễ sân vườn, ngôn ngữ màu nước sage dịu và nghi lễ Việt trang trọng, nghiêng về một khu vườn biên tập trên giấy cotton hơn là một trang web trang trí hoa lá.

- **DESIGN_VARIANCE:** 7/10 · Các chương thay đổi nhịp ảnh, lịch, vòm sự kiện và lối vườn, nhưng chỉ dùng một ngôn ngữ vòm và lá.
- **MOTION_INTENSITY:** 6/10 · Khoảnh khắc đi xuyên qua phong bì và lá mép trôi có chủ đích; phần đọc thông tin đứng yên, tôn trọng reduced motion.
- **VISUAL_DENSITY:** 3/10 · Không gian thở rộng, chỉ một tiêu điểm mỗi viewport, lá nằm ngoài cột đọc để ảnh và tên cặp đôi luôn là nhân vật chính.

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md). Mẫu chuẩn tham chiếu: [letter-2d.md](./letter-2d.md).

---

## 1. Concept

**Một câu:** Khách bước qua một ô cửa vòm phủ đầy lá màu nước để vào một khu vườn; cuộn trang như đi dọc lối vườn, hai bên mép màn hình là các lớp lá trôi với tốc độ khác nhau tạo chiều sâu.

**Cảm xúc muốn gợi:** tươi mát, nhẹ nhàng, thanh lịch, "hít một hơi không khí trong lành".

**Phù hợp với:** cưới ngoài trời, sân vườn, tiệc trưa; cặp đôi thích tông xanh sage, hoa trắng; ảnh cưới ngoài thiên nhiên.

**Khác các mẫu khác ở chỗ:**
- Màn mở dùng **T6 zoom xuyên qua**: phong bì trắng có ô cửa sổ hình vòm; bấm → nắp mở, camera "lao" vào ô vòm, ô vòm phóng to thành khung của cả trang. (letter-2d rút thiệp ra khỏi phong bì; mẫu này **đi xuyên** qua phong bì.)
- **Khung vòm là ngôn ngữ hình khối duy nhất**: mọi ảnh, mọi khối nền đều bo vòm trên (`rounded-t-full`). Section chuyển tiếp bằng **"vòm mọc lên"**: khối nền của section sau có đỉnh vòm nhô lên đè đáy section trước.
- **Ba lớp lá ở hai mép màn hình** cố định theo viewport, trôi bằng `data-speed` khác nhau (0.7 / 0.9 / 1.2), cành lá mọc dần (A6) khi đi qua từng section.
- Bố cục một cột, cuộn tự nhiên (T1), không ghim, không cuộn ngang: đọc thoải mái như đi dạo.

**Moodboard:** lá bạch đàn và dương xỉ vẽ màu nước, giấy cotton trắng, hoa rum/hoa hồng trắng, khối xanh sage bo vòm, chữ viết tay mảnh, ánh nắng xuyên lá.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `bg` | `#F7F6F1` | Nền trang, trắng ngà |
| `surface` | `#FFFFFF` | Phong bì, thẻ, form |
| `sage` | `#5F7A5A` | Màu chủ đạo: khối vòm đậm, nút, icon |
| `sage-dark` | `#4A6146` | Hover, chữ nhấn trên nền sáng |
| `sage-mist` | `#C8D5B9` | Khối vòm nhạt, vệt màu nước, đường timeline |
| `leaf-wash` | `#E4EBDC` | Nền lịch, nền phụ |
| `blush` | `#D9A5A0` | Điểm nhấn rất hiếm: trái tim ngày cưới, 1 bông hoa |
| `text` | `#34402F` | Chữ chính |
| `text-soft` | `#6B7565` | Chữ phụ |

Tương phản: `text` trên `bg` ≈ 10.5:1 ✅. `text-soft` trên `surface` ≈ 4.9:1 ✅. Chữ trắng trên `sage` ≈ 4.7:1 ✅. `sage-mist`, `blush` không dùng làm màu chữ.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Great Vibes | 48px / 1.1 | 80px | Tên, chữ ký, số "06" dạng chữ |
| Số ngày lớn | Cormorant Garamond 300 | 120px | 180px | "14" |
| Tiêu đề section | Cormorant Garamond 600, VIẾT HOA, tracking 0.22em | 14px | 16px | "LỊCH TRÌNH" |
| Nội dung | Cormorant Garamond 400 | 19px / 1.6 | 21px | Cormorant nhỏ nên +1px so với mặc định |
| Nhãn nhỏ | Cormorant Garamond 500 italic | 15px | 16px | |

Great Vibes và Cormorant Garamond đều có subset `vietnamese`.

### Hình khối và chất liệu
- **Vòm**: `rounded-t-full` cho ảnh (tỉ lệ 3:4) và cho khối nền section. Ảnh vòm có viền mảnh `1px sage-mist` cách ảnh 8px (vòm lồng vòm, dựng bằng `outline` + `outline-offset-8`).
- **Lá màu nước**: PNG/WebP nền trong suốt (không vẽ bằng SVG path vì cần vân màu nước); cành "mọc" dùng SVG path cuống + ảnh lá gắn trên, cuống vẽ A6, lá `scale 0 → 1` từ gốc.
- **Vệt màu nước**: 3 hình WebP loang `sage-mist` đặt sau tiêu đề, opacity 0.6.
- **Giấy**: `feTurbulence` opacity 0.035 trên `surface`.
- **Icon**: nét 1.25px `sage`, 5 icon lịch trình (ly, nhẫn, đĩa, nốt nhạc, pháo hoa).
- **Motion**: ease `sine.out` (chữ, lá), `power2.inOut` (T6). Vào 1.0s. Không nảy.

---

## 3. Nhạc

- **Tâm trạng**: guitar mộc fingerstyle và piano, ấm, sáng, như buổi sáng trong vườn. Không lời.
- **Tempo**: 70–80 BPM. **Độ dài**: 2:30–3:00, lặp.
- **Từ khoá Pixabay**: `acoustic wedding soft guitar`, `gentle piano guitar morning`
- **Hành vi**:
  - Bắt đầu khi bấm phong bì ở C1. Âm lượng 0 → 0.6 trong 1.5 giây.
  - C16 nằm ngay đầu trang (cùng khối với C2) như ảnh tham khảo.
  - Ẩn tab thì tạm dừng.

---

## 4. Cấu trúc trang

```
┌───────────────────────────┐
│ C1  Phong bì cửa vòm       │ 100svh  (cố định; bấm → T6 zoom qua vòm)
├───────────────────────────┤
│ C16+C2 Thanh nhạc, tên,    │ 110svh   ← mở ra bên trong ô vòm
│        ảnh vòm bìa         │
│ C3  Hai người              │ 100svh
│ C5+C11 "14" + lịch         │ 110svh
│ ╭─ vòm sage đậm mọc lên ─╮ │
│ C6  Hai lễ (khối sage)     │ 110svh   ← chữ trắng trên sage
│ ╰────────────────────────╯ │
│ C12 Lịch trình             │ 110svh
│ C7  Bản đồ                 │  90svh
│ C8  Album vòm (2 cột lệch) │ 150svh
│ C13 Dress code             │  70svh
│ C14 Mừng cưới              │  80svh
│ C15 Xác nhận               │ 100svh
│ C10 Cảm ơn (vòm khép lại)  │ 100svh
└───────────────────────────┘
+ 3 lớp lá cố định ở hai mép (fixed, pointer-events-none, z-10)
```

Cột nội dung `min(88vw, 460px)` căn giữa. Lá mép chiếm tối đa 18vw mỗi bên trên mobile (mờ 70% để không cạnh tranh chữ), 22vw trên desktop.

Chuyển giữa section: T1 (A1/A3). Riêng ranh giới **C5→C6** và **C8→C13** có "vòm mọc lên": khối nền section sau có đỉnh `rounded-t-full` nhô lên 20svh, `yPercent 20 → 0` theo scrub.

---

## 5. Chi tiết từng section

### C1 · Phong bì cửa vòm

**Wireframe (360px):**
```
┌────────────────────────────┐
│ 🌿                     🌿  │  ← cành lá tràn mép (mọc dần)
│   ┌────────────────────┐   │
│   │      ╭──────╮      │   │  ← phong bì trắng, ô cửa vòm cắt rỗng
│   │      │ ảnh  │      │   │     nhìn thấy images[0] mờ phía sau
│   │      │ bìa  │      │   │
│   │      ╰──────╯      │   │
│   │    Minh Quân       │   │  ← Great Vibes 36px
│   │        &           │   │
│   │      Thu Hà        │   │
│   └────────────────────┘   │
│ 🌿    Chạm để mở thiệp  🌿 │  ← italic 15px text-soft
└────────────────────────────┘
```

**Nội dung:** tên hai người, *"Chạm để mở thiệp"*. Toàn bộ phong bì là một `<button aria-label="Mở thiệp mời và phát nhạc">`.

**Animation vào:**
| t | Hành động |
|---|---|
| 0.0s | Phong bì A1 (0.9s) |
| 0.2s | 4 cành lá ở 4 góc mọc: cuống A6 (1.0s), lá `scale 0 → 1` stagger 0.08 |
| 0.6s | Ảnh sau ô vòm `scale 1.15 → 1`, `opacity 0 → 0.85` (1.2s) |
| 1.0s | Tên A2 |
| lặp | Cành lá lay nhẹ `rotate ±1.5°` quanh gốc (A12, 4s) |

**Khi bấm (T6, tổng 1.6s):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc phát |
| 0.0s | Tên + dòng hướng dẫn fade (0.3s) |
| 0.1s | Cành lá góc bung ra ngoài `x/y ±40%`, fade (0.8s) |
| 0.2s | Cả phong bì `scale 1 → 6`, transform-origin = tâm ô vòm (1.2s, `power2.inOut`). Ô vòm phóng to tới khi mép vòm vượt khỏi viewport → ta đã "đi xuyên qua" |
| 0.9s | Ảnh bìa phía sau `opacity → 1`, trở thành ảnh vòm của C2 (cùng phần tử, không đổi ảnh) |
| 1.4s | Phong bì `autoAlpha 0`, mở khoá cuộn, khởi động ScrollSmoother |

**Reduced-motion:** không zoom; crossfade 0.3s sang C2.
**Edge case:** tên dài > 20 ký tự → 28px, 2 dòng; phong bì cao tự động theo nội dung (không cố định chiều cao).

---

### C16 + C2 · Thanh nhạc, tên, ảnh vòm

**Wireframe:**
```
┌────────────────────────────┐
│ ╭────────────────────────╮ │  ← thanh nhạc trắng, rounded-full
│ │ ▶  Chạm để nghe bài hát│ │
│ │    của chúng tôi ──●── │ │
│ ╰────────────────────────╯ │
│        ╭──────────╮        │
│       ╱            ╲       │  ← images[0] vòm 3:4, viền vòm lồng
│      │    ẢNH BÌA   │      │
│      │              │      │
│      └──────────────┘      │
│   TRÂN TRỌNG KÍNH MỜI      │
│     Minh Quân & Thu Hà     │  ← Great Vibes 48px
│   ──── 🌿 ────             │
│   Thứ Bảy · 14.11.2026     │  ← `date` ⚠️
└────────────────────────────┘
```
**Animation:** ảnh đã có sẵn từ T6. Thanh nhạc A1 từ trên (`y: -20`). Tên A2. Dòng kẻ + nhánh lá A6. Ảnh có `data-speed="0.9"`.
**Chuyển sang C3:** T1.

---

### C3 · Hai người

```
┌────────────────────────────┐
│   ╭────╮          ╭────╮   │
│  │ [1]  │        │ [2]  │  │  ← 2 ảnh vòm nhỏ 3:4
│  └──────┘        └──────┘  │
│  CHÚ RỂ           CÔ DÂU   │
│  Minh Quân        Thu Hà   │  ← Great Vibes 30px
│  {groom.address} {bride.…} │  ← line-clamp-3
│         ─── & ───          │
└────────────────────────────┘
```
**Nội dung:** `groom.*`, `bride.*`; tên bố mẹ ⚠️ → dòng *"Trưởng nam ông … bà …"* / *"Trưởng nữ ông … bà …"* nếu có, bỏ nếu không (chữ "Trưởng nam/nữ" cũng ⚠️ vì không biết thứ bậc → dùng "Con ông bà").
**Animation:** ảnh A3 dạng vòm: `clip-path: inset(100% 0 0 0 round 999px 999px 0 0) → inset(0 round 999px 999px 0 0)` (1.1s, `expo.out`), ảnh 2 trễ 0.15s. Một nhành lá nhỏ mọc giữa hai ảnh (A6).
**Mobile < 360px:** 1 cột.

---

### C5 + C11 · "14" và lịch tháng

```
┌────────────────────────────┐
│        THÁNG MƯỜI MỘT      │
│    THỨ BẢY │ 14 │ 2026     │  ← "14" Cormorant 300 120px, sage
│  (vệt màu nước sau số)     │
│ ╭──────────────────────╮   │  ← nền leaf-wash, rounded-t-[3rem]
│ │ T2 T3 T4 T5 T6 T7 CN │   │
│ │  9 10 11 12 13 (♥)15 │   │  ← trái tim blush vẽ A6
│ ╰──────────────────────╯   │
│   45 ngày · 06 giờ · 12 phút│  ← A7
└────────────────────────────┘
```
**Nội dung/fallback:** như letter-2d (tháng bằng chữ, tuần bắt đầu Thứ Hai, đã qua ngày cưới → *"Chúng tôi đã về chung một nhà ♥"*). `date` ⚠️.
**Animation:** "14" đếm lên (0.8s). Vệt màu nước sau số `scale 0.6 → 1`, `opacity 0 → 0.6` (1.2s, `sine.out`) như mực loang. Trái tim A6.
**Chuyển sang C6:** vòm sage đậm mọc lên (xem §4).

---

### C6 · Hai lễ (khối vòm sage)

```
┌────────────────────────────┐
│      ╭──────────────╮      │
│    ╱                  ╲    │  ← khối sage, đỉnh vòm tràn bề ngang
│   │    LỄ VU QUY       │   │  ← chữ trắng
│   │  08:00 · Thứ Bảy   │   │
│   │  Tư gia nhà gái    │   │
│   │  {bride.address}   │   │
│   │     ── 🌿 ──       │   │
│   │    LỄ THÀNH HÔN    │   │
│   │  18:00 · Thứ Bảy   │   │  ← giờ từ `date` ⚠️
│   │  {venue.name}      │   │
│   └────────────────────┘   │
└────────────────────────────┘
```
**Animation:** khối `yPercent 20 → 0` scrub (vòm mọc). Chữ A1 stagger 0.1. Nhánh lá trắng (opacity 0.3) đặt góc dưới khối, `data-speed="1.1"`.

---

### C12 · Lịch trình

```
┌────────────────────────────┐
│        LỊCH TRÌNH          │
│  (ly)   ─── 17:00          │
│          Đón khách         │
│  (nhẫn) ─── 18:00          │  ← trục là một cuống lá cong (SVG)
│          Làm lễ            │     các mốc là chiếc lá gắn trên cuống
│  (đĩa)  ─── 18:30          │
│          Khai tiệc         │
│  (nhạc) ─── 20:00          │
│          Giao lưu          │
└────────────────────────────┘
```
**Nội dung viết sẵn:** giờ tính từ `date` ⚠️ (−1h, 0, +30′, +2h), fallback 18:00.
**Animation:** cuống lá vẽ A6 theo scrub; khi cuống vẽ tới mốc, chiếc lá tại mốc `scale 0 → 1` (từ gốc lá), icon trong vòng tròn vẽ nét (0.6s), chữ A1.

---

### C7 · Bản đồ

```
┌────────────────────────────┐
│        ĐỊA ĐIỂM            │
│  {venue.name}              │
│   ╭──────────────────╮     │
│  │   <MapEmbed>       │    │  ← khung vòm 4:5 (bo vòm trên bằng
│  │                    │    │     wrapper overflow-hidden rounded-t-full)
│  └────────────────────┘    │
│   [ 📍 Chỉ đường ]          │  ← nút sage, rounded-full
└────────────────────────────┘
```
**Lưu ý:** iframe trong khung vòm: bo góc bằng wrapper, không động vào `MapEmbed`. Mount lười.

---

### C8 · Album vòm hai cột lệch

```
┌────────────────────────────┐
│       KHOẢNH KHẮC          │
│  ╭────╮                    │
│ │ [3]  │     ╭────╮        │  ← cột trái data-speed 0.95
│ │      │    │ [4]  │       │     cột phải data-speed 1.08
│ └──────┘    │      │       │     (hai cột trượt lệch nhau)
│  ╭────╮     └──────┘       │
│ │ [5]  │    (ô chữ:        │
│ └──────┘   "Mỗi ngày bên   │
│             nhau là một    │
│             mùa hoa")      │
└────────────────────────────┘
```
**Nội dung:** `images[3..5]` (+ ô chữ Great Vibes để lấp chỗ cho cân).
**Hành vi:** bấm ảnh → A10 lightbox (Flip), nền `bg/95`, ← → và Esc.
**Animation:** mỗi ảnh A3 vòm khi vào. Hai cột trượt lệch nhau bằng `data-speed` (tắt khi reduced-motion).
**Chuyển sang C13:** vòm `sage-mist` mọc lên (xem §4).

---

### C13 · Dress code (trên khối vòm sage-mist)

```
┌────────────────────────────┐
│        DRESS CODE          │
│  Nhẹ nhàng, tông xanh lá   │
│  và trung tính             │
│   🍃     🍃     🍃     🍃   │  ← 4 chiếc lá tô màu (SVG), không phải chấm
│  Sage  Xanh  Kem   Trắng   │     #5F7A5A #C8D5B9 #EFE8DC #FFFFFF
│        nhạt                │
└────────────────────────────┘
```
**Animation:** lá `rotate -30° → 0`, `scale 0 → 1`, stagger 0.08.

---

### C14 · Mừng cưới

```
┌────────────────────────────┐
│        MỪNG CƯỚI           │
│  Sự hiện diện của bạn là   │
│  món quà ý nghĩa nhất.     │
│  ╭──────╮    ╭──────╮      │  ← QR mẫu ⚠️ trong khung vòm nhỏ
│  │  QR  │    │  QR  │      │
│  ╰──────╯    ╰──────╯      │
│  Nhà trai     Nhà gái      │
└────────────────────────────┘
```
**Hành vi:** bấm QR → A10.

---

### C15 · Xác nhận tham dự (chỉ giao diện)

Form trong thẻ trắng `rounded-t-[3rem] rounded-b-2xl`: tên, radio đến/không đến, số người, nút sage *"Gửi lời hồi đáp"*, ghi chú *"Bản xem thử — xác nhận không được gửi đi."* Gửi → form thu lại, hiện một nhành lá mọc (A6) + *"Cảm ơn {tên}! Hẹn gặp bạn trong vườn ♥"*.

---

### C10 · Cảm ơn (vòm khép lại)

```
┌────────────────────────────┐
│       ╭────────╮           │
│      │ ảnh cuối │          │  ← images[5] vòm, nhỏ dần theo scrub
│      └──────────┘          │
│  Cảm ơn bạn đã ghé thăm    │
│  khu vườn nhỏ của chúng tôi│
│    Minh Quân & Thu Hà      │  ← Great Vibes 40px
│ 🌿🌿    (lá mép khép vào) 🌿🌿│
└────────────────────────────┘
```
**Animation (scrub):** đảo ngược C1: 3 lớp lá mép trượt vào giữa (`x` từ mép vào 12vw), ảnh vòm `scale 1 → 0.85`, cuối cùng trang dừng với khung lá bao quanh chữ ký.

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | C1 (sau ô vòm) → C2 ảnh bìa | 3:4 |
| `images[1]` | C3 chú rể | 3:4 |
| `images[2]` | C3 cô dâu | 3:4 |
| `images[3..4]` | C8 album | 3:4 |
| `images[5]` | C8 album + C10 ảnh cuối | 3:4 |

`meta.media = { images: 6, videos: 0 }`. `styles = ["floral"]`, `colors = ["green", "white"]`.

## 7. Asset cần chuẩn bị
- [ ] Lá màu nước WebP nền trong: 8–10 chiếc lá rời + 4 cành góc (mỗi file ≤ 60KB), 3 lớp lá mép (dọc, ≤ 120KB mỗi lớp)
- [ ] 3 vệt màu nước `sage-mist`
- [ ] SVG: phong bì có ô vòm, cuống lá (path cho A6), 5 icon lịch trình, lá dress code
- [ ] `music.mp3` guitar + piano + `CREDITS.md`
- [ ] 6 ảnh mẫu ngoài trời tông xanh (Unsplash) ≤ 300KB `.webp`
- [ ] `thumb.webp` 600×800: phong bì vòm có lá tràn mép
- [ ] `opengraph-image.png` 1200×630
- [ ] Nguồn lá màu nước phải có giấy phép thương mại (ghi vào `CREDITS.md`)

## 8. Tiêu chí nghiệm thu riêng
- [ ] T6: ảnh bìa trong ô vòm và ảnh C2 là **cùng một phần tử**, không nhấp nháy khi chuyển
- [ ] Lá mép không che chữ ở 360px (cột nội dung luôn nằm trong vùng trống)
- [ ] Tổng dung lượng ảnh lá ≤ 700KB; lá mép `loading="eager"`, lá section `loading="lazy"`
- [ ] Mọi ảnh người dùng đều hiển thị trong khung vòm, không méo (`object-cover`)
- [ ] 60fps khi cuộn với 3 lớp lá parallax trên máy tầm trung

---

## 9. Triển khai code

### 9.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/botanical-2d/
├── meta.ts
├── layout.tsx                 # Great_Vibes + Cormorant_Garamond (vietnamese)
├── page.tsx                   # return <BotanicalInvite />
└── _components/
    ├── botanical-invite.tsx   # "use client" — tokens t, ghép section, SmoothScroll
    ├── arch-gate.tsx          # C1 + T6 (zoom qua ô vòm)
    ├── edge-leaves.tsx        # 3 lớp lá mép fixed + đóng lại ở C10
    ├── growing-branch.tsx     # cuống SVG (A6) + lá ảnh (scale), prop `leaves: {at, src, angle}[]`
    ├── arch-image.tsx         # <img> trong khung vòm + A3 vòm
    ├── arch-rise.tsx          # wrapper khối nền có đỉnh vòm mọc lên
    ├── sections/              # hero (C16+C2), couple, date, ceremonies, schedule, map, album, dress, gift, rsvp, thanks
    └── svg/                   # envelope-arch, stem paths, icons
```

### 9.2 Tokens
```ts
export const t = {
  root: "bg-[#F7F6F1] text-[#34402F] font-(family-name:--font-body) text-[19px] lg:text-[21px]",
  card: "bg-white rounded-t-[3rem] rounded-b-2xl",
  sage: "bg-[#5F7A5A] text-white", mist: "bg-[#C8D5B9]", wash: "bg-[#E4EBDC]",
  arch: "rounded-t-full overflow-hidden outline outline-1 outline-offset-8 outline-[#C8D5B9]",
  heading: "text-sm tracking-[0.22em] uppercase font-semibold",
  script: "font-(family-name:--font-script)",
  soft: "text-[#6B7565]",
  btn: "bg-[#5F7A5A] hover:bg-[#4A6146] text-white rounded-full min-h-11 px-6",
} as const;
```

### 9.3 T6 zoom qua ô vòm
```tsx
// arch-gate.tsx (rút gọn)
useGSAP(() => {
  tl.current = gsap.timeline({ paused: true })
    .to(".gate-text", { autoAlpha: 0, duration: 0.3 }, 0)
    .to(".corner-branch", { xPercent: (i) => (i % 2 ? 40 : -40), yPercent: (i) => (i < 2 ? -40 : 40), autoAlpha: 0, duration: 0.8, ease: "sine.in" }, 0.1)
    .to(".envelope", { scale: 6, duration: 1.2, ease: "power2.inOut" }, 0.2) // origin: tâm ô vòm, tính bằng gsap.set lúc mount
    .to(".cover-img", { opacity: 1, duration: 0.5 }, 0.9)
    .set(".envelope", { autoAlpha: 0 })
    .call(onOpened);
}, { scope: root });
```
- `transformOrigin` = toạ độ tâm ô vòm tương đối với phong bì, đo bằng `getBoundingClientRect()` khi mount.
- Ảnh bìa: `position: fixed` trong lúc gate, sau `onOpened` dùng **GSAP Flip** (`Flip.getState` → chuyển vào vị trí vòm C2 → `Flip.from`) để là cùng một phần tử.

### 9.4 Lá mép parallax
- `edge-leaves.tsx` là `fixed inset-y-0` hai bên, **không** nằm trong ScrollSmoother content (fixed bị ảnh hưởng bởi transform của smoother) → render ngoài `#smooth-content`, parallax bằng `ScrollTrigger` scrub trên toàn trang: lớp 1 `yPercent 0 → -10`, lớp 2 `0 → -25`, lớp 3 `0 → -45`.
- Mobile: chỉ 2 lớp, opacity 0.7.

### 9.5 Cành mọc
```tsx
const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 80%" } })
  .from(stem, { drawSVG: "0%", duration: 1, ease: "sine.out" })
  .from(leaves, { scale: 0, transformOrigin: "0% 100%", stagger: 0.08, duration: 0.5, ease: "sine.out" }, 0.3);
```

### 9.6 Logic cần test
- `scheduleFrom(date)` (nếu chưa có trong `@/kit`).
- Lưới tháng (dùng chung `MonthGrid` từ letter-2d nếu đã tách).
- Không có logic thuần riêng khác; phần còn lại kiểm bằng mắt ở 3 kích thước.

### 9.7 Thứ tự làm
1. `meta`, `layout`, `page`, tokens → trang trống có font
2. Section tĩnh, khung vòm, khớp wireframe 360/1440px
3. `arch-gate` + nhạc + Flip ảnh bìa
4. `edge-leaves` parallax
5. `growing-branch`, `arch-rise`, animation từng section
6. Album + lightbox
7. Reduced-motion, tối ưu dung lượng lá, Lighthouse
8. Checklist template-spec §12
