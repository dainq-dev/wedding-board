# 2D-30 · `starry-2d` · Đêm Đầy Sao

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md). Mẫu tham chiếu cấu trúc: [letter-2d.md](./letter-2d.md).

---

## 1. Concept

**Một câu:** Một bầu trời đêm vẽ bằng những nét cọ xoáy kiểu tranh Van Gogh: trăng lưỡi liềm vàng mở ra thiệp mời, và trong suốt lúc cuộn, mặt trăng đi một vòng cung ngang trời như đồng hồ đếm thời gian của buổi tối, còn các kỷ niệm của hai người được nối thành chòm sao.

**Cảm xúc muốn gợi:** mơ màng, lãng mạn, hơi huyền ảo; cảm giác ngồi ngắm sao cùng nhau một đêm mùa hè.

**Phù hợp với:** cặp đôi thích chủ đề sao / vũ trụ / hội hoạ nhưng muốn thiệp nhẹ, mở nhanh trên mọi điện thoại (không 3D); cưới tối, tiệc ngoài trời có đèn dây. Hợp với ảnh chụp đêm, ảnh có ánh đèn ấm.

**Khác các mẫu khác ở chỗ:**
- Khác `galaxy-3d`: không WebGL, không camera bay — là **tranh 2D phẳng có nét cọ chuyển động**.
- Bố cục có **đường chân trời cố định** ở đáy màn hình (làng + cây bách/cypress đen, như trong tranh), nội dung "mọc lên" từ sau đường chân trời như sao mọc.
- **Mặt trăng là thanh tiến độ**: vị trí trăng trên vòng cung = tiến độ cuộn trang.
- Chuyển cảnh mở: T4 hình tròn **nở ra từ mặt trăng**. Chuyển cảnh giữa section: T1 "mọc từ chân trời" + nét xoáy đổi hướng chảy. Album là **chòm sao** (A6 nối các ngôi sao-ảnh).

**Moodboard:** tranh "Đêm đầy sao" (chỉ lấy tinh thần: nét xoáy, cây bách, làng nhỏ, trăng lưỡi liềm có quầng — **tự vẽ lại**, không dùng bản scan tranh), đèn dây vàng, sao băng, sơn dầu dày.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `night` | `#0E1A3A` | Nền trời, phần tử gốc |
| `night-deep` | `#081028` | Đường chân trời, làng, cây bách |
| `glass` | `#15254F` @ 80% (`bg-[#15254F]/80`) + `backdrop-blur-sm` | Nền card |
| `swirl-1` | `#2B4C8C` | Nét xoáy đậm |
| `swirl-2` | `#6FA3D9` | Nét xoáy sáng, accent |
| `moon` | `#F6C945` | Màu chủ đạo: trăng, sao, tên, nút |
| `moon-glow` | `#FFE59A` | Quầng trăng, sao sáng nhất |
| `star` | `#F1F4FF` | Chữ chính, sao nhỏ |
| `star-soft` | `#AEB8D6` | Chữ phụ |

Tương phản: `star` trên `night` khoảng 15.5:1 ✅, trên `glass` khoảng 13:1 ✅. `star-soft` trên `glass` khoảng 7.5:1 ✅. `moon` trên `night` khoảng 10:1 ✅. `swirl-2` trên `night` khoảng 6.3:1 ✅ (dùng được cho nhãn). Chữ `night` trên nút `moon` khoảng 10:1 ✅.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Great Vibes | 52px / 1.1 | 88px | Màu `moon`, `drop-shadow` quầng vàng nhẹ |
| Tiêu đề section | Lora 500 italic | 24px | 30px | "Đêm ấy, chúng tôi…" |
| Nhãn | Lora 600, VIẾT HOA, tracking 0.25em | 12px | 13px | màu `swirl-2` |
| Số lớn (ngày) | Lora 400 | 88px | 128px | |
| Nội dung | Lora 400 | 17px / 1.7 | 18px | |

Cả hai font có subset `vietnamese`. Great Vibes **chỉ** dùng cho tên và chữ ký (khó đọc ở đoạn dài; dấu tiếng Việt ở cỡ < 32px dễ dính — kiểm "Hằng, Hưởng").

### Hình khối và chất liệu
- **Nét xoáy (swirl)**: 5–7 path SVG xoắn ốc / sóng dày `stroke-width 10–18`, `stroke-dasharray "40 18"` (các vệt cọ đứt đoạn), màu `swirl-1`/`swirl-2` `opacity 0.5–0.8`. Chuyển động "chảy" bằng tween `strokeDashoffset` lặp vô hạn (xem 9.3).
- **Sao**: 40 (mobile) / 80 (desktop) chấm tròn `star` 1–3px, toạ độ sinh 1 lần bằng seed cố định; 8 sao lớn có quầng (`radial-gradient` `moon-glow` → trong suốt, 24–40px).
- **Nhấp nháy**: dùng `animate-pulse` của Tailwind với `animationDelay` / `animationDuration` động (inline style — giá trị tính lúc chạy, được phép). Không cần keyframe riêng.
- **Đường chân trời**: SVG `fixed bottom-0`, cao 18svh (mobile) / 22svh (desktop): đồi thấp, làng mái nhọn, tháp chuông, 1 cây bách đen cao ở trái (lớp gần nhất).
- **Card**: `rounded-2xl bg-[#15254F]/80 backdrop-blur-sm border border-[#6FA3D9]/25`, viền trên có 1 nét cọ vàng ngắn.
- **Ảnh**: bo `rounded-2xl`, hoặc tròn (sao-ảnh trong chòm sao), viền 2px `moon`.
- **Motion**: ease `sine.inOut`. Vào 1.0s. Lặp chậm (xoáy 20–40s/vòng).

---

## 3. Nhạc

- **Tâm trạng**: piano + dàn dây mơ màng, như nhạc ru đêm; có thể có celesta / music box nhẹ. Không lời.
- **Tempo**: 60–72 BPM. **Độ dài**: 2:30–3:00, lặp.
- **Từ khoá Pixabay**: `starry night piano`, `dreamy piano strings night`, `music box lullaby romantic`
- **Hành vi**: bắt đầu khi bấm mặt trăng (C1), 0 → 0.6 trong 2s. C16 là "hộp nhạc" nhỏ trên nóc một mái nhà trong làng. Ẩn tab tạm dừng.

---

## 4. Cấu trúc trang

```
┌───────────────────────────┐
│ C1  Trăng lưỡi liềm        │ 100svh (cố định tới khi mở)
│  ◐ bấm: T4 tròn từ trăng   │
├───────────────────────────┤ ┌─ Lớp nền fixed:
│ C2  Tên dưới trăng         │ │  · trời + sao + nét xoáy
│ C3  Hai vì sao (hai người) │ │  · đường chân trời (đáy)
│ C4  Chòm sao của chúng tôi │ │  · mặt trăng chạy vòng cung
│ C5+C11 Đêm ấy (ngày + lịch)│ │    trái → phải theo tiến độ
│ C12 Lịch trình buổi tối    │ │    cuộn toàn trang
│ C6+C7 Nơi hẹn              │ │
│ C8  Bầu trời kỷ niệm       │ │
│ C16 Hộp nhạc               │ │
│ C14+C15 Gửi lời chúc       │ │
│ C10 Bình minh? Không — sao │ │
│     băng                   │ └─
└───────────────────────────┘
```
Chiều cao (svh): C2 110 · C3 110 · C4 160 · C5+C11 120 · C12 100 · C6+C7 140 · C8 150 · C16 50 · C14+C15 140 · C10 100.

Chiều rộng nội dung: `w-[min(90vw,480px)]` căn giữa; **padding-bottom 20svh** trên mọi section để nội dung không bị đường chân trời che. Desktop: card lệch nhẹ sang phải (`lg:ml-[40vw]`) để lộ cây bách và nét xoáy lớn bên trái — giống bố cục tranh.

---

## 5. Chi tiết từng section

### C1 · Trăng lưỡi liềm (màn mở)

**Wireframe (360px):**
```
┌────────────────────────────┐
│ ≈≈≈ nét xoáy chảy ≈≈≈  ·   │
│  ·    ≈≈≈≈≈≈≈≈≈≈   ✦       │
│          ╭──╮              │
│   ·     ( ◐  )  ← trăng    │  ← nút tròn 120px, quầng moon-glow
│          ╰──╯      ·       │     nhịp thở A12
│  ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈  ·    │
│      Minh Quân             │  ← Great Vibes 40px, moon
│          &                 │
│        Thu Hà              │
│  Chạm vào trăng để mở thiệp│  ← Lora italic 14px, star-soft
│ ▲  ⌂⌂ ⌂ ▲ ⌂⌂ ⌂   ▲▲        │  ← chân trời + cây bách
└────────────────────────────┘
```
**Nội dung:** `{groom.name}` & `{bride.name}`, dòng *"Chạm vào trăng để mở thiệp"*. Trăng là `<button aria-label="Mở thiệp mời">`.

**Animation vào:**
| t | Hành động |
|---|---|
| 0.0s | Trời `opacity 0 → 1` (0.8s); sao hiện ngẫu nhiên, stagger 0.02 |
| 0.3s | Nét xoáy A6 vẽ vào (1.4s), sau đó chuyển sang chảy liên tục |
| 0.6s | Chân trời `y: 40 → 0` (1.0s) |
| 1.0s | Trăng `scale 0.6 → 1`, `rotate -20 → 0` (1.2s); quầng `opacity 0 → 1` |
| 1.6s | Tên A2 theo `chars`, `filter: drop-shadow` sáng dần |
| lặp | Trăng thở `scale 1 ↔ 1.05` 2.5s (A12); quầng `opacity 0.6 ↔ 1` |

**Khi bấm (T4 tròn từ trăng, tổng 1.6s):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc bắt đầu |
| 0.0s | Trăng lóe: quầng `scale 1 → 1.6` (0.3s) |
| 0.2s | Lớp phủ C1 có lỗ tròn tại tâm trăng nở `r: 0 → 150vmax` (1.2s, `sine.inOut`) — qua lỗ thấy C2 (thực tế: lớp C2 `clip-path: circle(0% at {moonX} {moonY}) → circle(150% at …)`) |
| 0.4s | Trăng bay lên góc trên-giữa, thu nhỏ `scale → 0.35`, trở thành "trăng tiến độ" ở vị trí khởi đầu vòng cung |
| 1.6s | Mở khoá cuộn |

**Reduced-motion:** crossfade 0.3s; trăng đặt thẳng vào vị trí vòng cung.
**Edge case:** tên > 20 ký tự → Great Vibes 30px, xuống dòng. `moonX/moonY` lấy từ `getBoundingClientRect()` của nút lúc bấm.

---

### Lớp nền: mặt trăng tiến độ

```
   trái ◜‿‿‿‿‿‿‿‿‿‿‿‿‿‿‿‿◝ phải        ← vòng cung vô hình, top 6svh–16svh
       ◐ (0%)       ◑(50%)      ◑(100%)
```
- Trăng nhỏ (36px) đi theo vòng cung từ 12% → 88% chiều ngang, cao nhất ở giữa, **theo tiến độ cuộn toàn trang** (MotionPath, scrub).
- **Tránh góc**: vòng cung nằm từ 12% đến 88% chiều ngang và thấp hơn vùng nút "Quay lại" (góc trên trái) và nút nhạc (góc trên phải) — `top ≥ 72px`.
- Trăng không bấm được sau khi mở (`pointer-events-none`, `aria-hidden`); nó chỉ là trang trí + chỉ báo tiến độ.
- Pha trăng đổi theo tiến độ: lưỡi liềm (0%) → bán nguyệt (50%) → gần tròn (100%), bằng một hình tròn `night` che dịch `x` (transform).

---

### C2 · Tên dưới trăng

```
┌────────────────────────────┐
│   TRÂN TRỌNG KÍNH MỜI      │  ← nhãn swirl-2
│                            │
│      Minh Quân             │  ← Great Vibes 52px moon
│          &                 │
│        Thu Hà              │
│  ≈≈≈≈ nét cọ vàng ≈≈≈≈     │  ← path A6
│  cùng ngắm sao trong đêm   │  ← Lora italic 18px
│  chung đôi của chúng tôi   │
│   Thứ Bảy · 14.11.2026     │  ← `date` ⚠️
│ (chân trời)                │
└────────────────────────────┘
```
Không card: chữ đặt thẳng trên trời (tương phản đủ vì `night` đồng nhất; nét xoáy phía sau chữ được hạ `opacity 0.3` trong vùng này bằng mask gradient).
**Animation:** "mọc từ chân trời": khối chữ `y: 20svh → 0`, `opacity 0 → 1` (1.2s) như sao mọc; nét cọ A6.

---

### C3 · Hai vì sao

```
┌────────────────────────────┐
│  Hai vì sao lạc...         │  ← tiêu đề Lora italic 24px
│ ┌────────────────────────┐ │
│ │   ◯ images[1]          │ │  ← ảnh tròn 112px, viền moon,
│ │  ✦ CHÚ RỂ              │ │    quầng sáng
│ │   Minh Quân            │ │  ← Great Vibes 32px
│ │   Quận 1, TP.HCM       │ │
│ │ ····· đường sao ·····  │ │  ← chuỗi chấm nối 2 ảnh
│ │          ◯ images[2]   │ │
│ │         ✦ CÔ DÂU       │ │
│ │          Thu Hà        │ │
│ │          Ba Đình, HN   │ │
│ └────────────────────────┘ │
│  ...rồi tìm thấy nhau.     │
└────────────────────────────┘
```
**Nội dung:** `groom.*`, `bride.*`. Tên bố mẹ ⚠️: nếu có → dòng "Con ông … và bà …" 14px `star-soft`; không có → bỏ.
**Animation:** hai ảnh tròn xuất hiện như sao sáng lên (`scale 0 → 1`, quầng `opacity 0 → 1`, so le 0.3s). Chuỗi chấm A6 (dash tròn) nối ảnh 1 → 2 theo scrub.
**Edge case:** địa chỉ ≤ 3 dòng.

---

### C4 · Chòm sao của chúng tôi (chuyện tình)

**Mục đích:** ba kỷ niệm là ba ngôi sao; nối lại thành một chòm sao hình trái tim.

```
┌────────────────────────────┐
│  Chòm sao của chúng tôi    │
│                            │
│       ✦①           ✦②      │  ← sao-ảnh tròn 72px (images[3],[4])
│         ╲         ╱        │
│    ·     ╲   ✦   ╱    ·    │
│           ╲     ╱          │
│            ╲   ╱           │
│             ✦③             │  ← images[5]
│   (các sao nhỏ phụ tạo     │
│    hình trái tim)          │
│ ┌────────────────────────┐ │
│ │ ① Lần đầu gặp          │ │  ← card chú thích đổi theo sao
│ │ "Một đêm hè, ..."      │ │     đang được "chạm tới"
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Nội dung (viết sẵn):**
1. **Lần đầu gặp** — *"Một đêm hè, hai người cùng ngước nhìn một bầu trời."*
2. **Thương nhau** — *"Từ đó, đêm nào cũng có một người để kể chuyện sao."*
3. **Lời hứa** — *"Dưới trăng, một chiếc nhẫn, một lời hứa trọn đời."*

**Hành vi (ghim 160svh, scrub):**
| progress | Hành động |
|---|---|
| 0 → 0.3 | Sao ① sáng lên (ảnh `scale 0 → 1` + quầng); card chú thích ① A1 |
| 0.3 → 0.6 | Đường nối ① → ② A6 qua 2 sao phụ; sao ② sáng; card đổi sang ② (crossfade) |
| 0.6 → 0.9 | Nối ② → ③ → khép hình trái tim; sao ③ sáng; card ③ |
| 0.9 → 1 | Toàn chòm sao sáng rực `opacity` quầng 1, nhấp nháy 1 lần |
Bấm vào sao-ảnh → A10 lightbox.
**Reduced-motion:** không ghim; hiện chòm sao đầy đủ + 3 card chú thích xếp dọc.
**Accessibility:** mỗi sao-ảnh là `<button aria-label="Kỷ niệm 1: Lần đầu gặp">`; card chú thích `aria-live="polite"`.

---

### C5 + C11 · Đêm ấy (ngày + lịch)

```
┌────────────────────────────┐
│ ┌────────────────────────┐ │
│ │  ĐÊM ẤY LÀ             │ │
│ │         14             │ │  ← Lora 88px moon
│ │   Tháng Mười Một, 2026 │ │
│ │ ────────────────────── │ │
│ │ T2 T3 T4 T5 T6 T7 CN   │ │
│ │  9 10 11 12 13 ✦ 15    │ │  ← ngày cưới là ngôi sao 4 cánh vàng
│ │ ────────────────────── │ │
│ │  45 : 06 : 12 : 33     │ │  ← A7
│ │ ngày giờ  phút  giây   │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Nội dung:** tháng tiếng Việt, tuần từ Thứ Hai, đếm ngược `date` ⚠️. Đã qua → *"Đêm ấy đã thành kỷ niệm đẹp nhất của chúng tôi."*
**Animation:** card mọc từ chân trời; "14" sáng dần (`opacity` + `text-shadow` tĩnh sẵn, chỉ animate opacity lớp glow); ngôi sao trên lịch `scale 0 → 1.3 → 1`, `rotate 0 → 45°`. A7 lật số.

---

### C12 · Lịch trình buổi tối

```
┌────────────────────────────┐
│  Lịch trình buổi tối       │
│  17:00 ✦ Đón khách         │  ← trục là 1 "sao băng" dọc
│    │                       │
│  18:00 ✦ Làm lễ            │
│    │                       │
│  18:30 ✦ Khai tiệc         │
│    │                       │
│  20:00 ✦ Ngắm sao & giao lưu│
└────────────────────────────┘
```
**Nội dung:** 4 mốc, giờ suy ra từ `date` (đón khách = tiệc −1h, lễ = tiệc, khai tiệc = +30′, giao lưu = +2h; mặc định tiệc 18:00).
**Animation:** trục là vệt sao băng: path dọc với đầu sáng `moon-glow`, A6 theo scrub; đuôi mờ dần (gradient stroke). Mỗi ✦ sáng lên khi đầu sao băng đi qua, dòng chữ A1.

---

### C6 + C7 · Nơi hẹn

```
┌────────────────────────────┐
│ ┌────────────────────────┐ │
│ │ LỄ VU QUY · 08:00      │ │
│ │ Tư gia nhà gái         │ │
│ │ {bride.address}        │ │
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │ TIỆC CƯỚI · 18:00      │ │
│ │ {venue.name}           │ │
│ │ ┌────────────────────┐ │ │
│ │ │ <MapEmbed/> 4:3    │ │ │  ← viền moon 1px, bo 12px
│ │ └────────────────────┘ │ │
│ │ [ ✦ Chỉ đường ]        │ │  ← nút moon, chữ night
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Animation:** hai card mọc từ chân trời so le 0.2s. `MapEmbed` mount khi gần viewport, `loading="lazy"`. Bản đồ Google nền sáng sẽ chói giữa trời đêm → phủ viền và đặt `opacity-90` cho khung (không đổi màu iframe; `MapEmbed` chung không hỗ trợ dark style ⚠️).

---

### C8 · Bầu trời kỷ niệm (album)

```
┌────────────────────────────┐
│  Bầu trời kỷ niệm          │
│  ✦        ✦                │
│     [img0]      ✦          │  ← ảnh "treo" như sao, kích thước
│  ✦         [img3]          │    khác nhau, rải tự do (toạ độ cố định)
│      [img4]       ✦        │
│  ✦            [img5]       │
│  Chạm vào một vì sao       │
└────────────────────────────┘
```
Ảnh: `images[0]`, `[3]`, `[4]`, `[5]` (4 ảnh), khung bo 1rem viền `moon`, xoay nhẹ ±3°, toạ độ cố định theo index (không random lúc render).
**Hành vi:** A4 parallax: mỗi ảnh `data-speed` khác nhau (0.85–1.15) để có chiều sâu. Bấm → A10 lightbox (nền `night/95`). Khi lightbox mở, sao xung quanh nhấp nháy nhanh hơn 1 nhịp (trang trí).
**Reduced-motion:** lưới 2 cột tĩnh.

---

### C16 · Hộp nhạc

```
┌────────────────────────────┐
│     ⌂ mái nhà trong làng   │
│    ┌──────────────┐        │
│    │ ♪ Hộp nhạc   │        │  ← card nhỏ đặt ngay trên chân trời
│    │ ▶/❚❚  ──●── 1:12│      │
│    └──────────────┘        │
│   ♪ ♫ nốt nhạc bay lên      │  ← 3 nốt `y: 0 → -60`, fade, khi phát
└────────────────────────────┘
```
Đồng bộ `MusicPlayer`. Nốt nhạc tắt khi reduced-motion hoặc đang dừng.

---

### C14 + C15 · Gửi lời chúc

```
┌────────────────────────────┐
│ ┌────────────────────────┐ │
│ │ Gửi một điều ước       │ │
│ │ [ Tên của bạn       ]  │ │
│ │ (•) Tôi sẽ đến         │ │
│ │ ( ) Tiếc quá, không đến│ │
│ │ Số người [ 1 ▾ ]       │ │
│ │ [ Lời chúc ...      ]  │ │  ← textarea 3 dòng, tuỳ chọn
│ │ [ ✦ Gửi lên trời ]     │ │
│ │ Bản xem thử — không gửi│ │
│ │ dữ liệu đi đâu.        │ │
│ └────────────────────────┘ │
│  Mừng cưới: [QR] [QR] ⚠️    │
└────────────────────────────┘
```
**Hành vi:** bấm gửi → card thu nhỏ thành 1 đốm sáng (`scale → 0.05`, 0.6s) rồi bay lên thành **sao băng** vệt chéo qua trời (MotionPath 1.2s), một ngôi sao mới xuất hiện cố định trên trời; hiện *"Cảm ơn {tên}, điều ước đã được gửi lên trời ✦"*. Không gửi dữ liệu. QR bấm → A10, chú thích *"Mã QR minh hoạ"*.

---

### C10 · Sao băng

```
┌────────────────────────────┐
│     ◯ images[n-1]          │  ← ảnh tròn lớn 200px, quầng vàng
│                            │     như mặt trăng tròn
│  Cảm ơn vì đã cùng chúng   │
│  tôi ngắm bầu trời này.    │
│      Minh Quân & Thu Hà    │  ← Great Vibes 40px
│   ↘ sao băng rơi thỉnh     │
│     thoảng                 │
└────────────────────────────┘
```
**Animation:** ở cuối trang, trăng tiến độ đã tới 100% (gần tròn) và "hạ" xuống thay vào vị trí ảnh cuối (crossfade: trăng `opacity → 0` khi ảnh tròn `opacity → 1` tại cùng toạ độ trên desktop; mobile chỉ fade). Sao băng: 1 vệt mỗi 5–8s (A8 rút gọn, tối đa 1 vệt cùng lúc), tắt khi reduced-motion.

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | C8 album (ảnh lớn nhất) + `og:image` | 4:5 |
| `images[1]` | C3 chú rể (tròn) | 1:1 |
| `images[2]` | C3 cô dâu (tròn) | 1:1 |
| `images[3..5]` | C4 sao-ảnh (tròn 1:1) + C8 album (4:5) | 1:1 / 4:5 |
| `images[5]` (= `n-1`) | C10 ảnh tròn cuối | 1:1 |

`meta.media = { images: 6, videos: 0 }`

⚠️ Ảnh bìa `images[0]` không xuất hiện ở C1/C2 (màn đầu là tranh trời đêm). Nếu cần ảnh bìa sớm hơn, đặt `images[0]` tròn 160px dưới tên ở C2 như "vầng trăng thứ hai".

---

## 7. Asset cần chuẩn bị
- [ ] SVG tự vẽ theo phong cách tranh (không scan): 5–7 path nét xoáy (mobile & desktop bố trí khác nhau), trăng lưỡi liềm + quầng, chân trời (đồi, làng, tháp chuông, cây bách), sao 4 cánh, sao băng
- [ ] `stars.ts`: toạ độ sao sinh từ seed cố định (tránh lệch SSR)
- [ ] `music.mp3` (Pixabay) + `CREDITS.md` (ghi rõ minh hoạ "lấy cảm hứng từ Van Gogh, tự vẽ")
- [ ] 6 ảnh mẫu chụp đêm / ánh đèn ấm ≤ 300KB `.webp`
- [ ] `thumb.webp` 600×800: trời xoáy, trăng lưỡi liềm, tên vàng
- [ ] `opengraph-image.png` 1200×630

## 8. Tiêu chí nghiệm thu riêng
- [ ] Nét xoáy chảy liên tục ≥ 55fps trên điện thoại tầm trung (chỉ animate `stroke-dashoffset` + `transform`), tạm dừng khi tab ẩn
- [ ] Trăng tiến độ không bao giờ đè lên nút Quay lại / nút nhạc ở mọi kích thước
- [ ] Không nội dung nào bị đường chân trời che (kiểm ở 360×740 cuối mỗi section)
- [ ] T4 từ trăng mở đúng tâm trăng kể cả khi xoay màn hình trước lúc bấm
- [ ] Không có hydration warning (toạ độ sao, góc ảnh cố định)

---

## 9. Triển khai code

### 9.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/starry-2d/
├── meta.ts
├── layout.tsx                 # Great_Vibes (400) + Lora (400,500,600 + italic), vietnamese
├── page.tsx                   # return <StarryInvite />
└── _components/
    ├── starry-invite.tsx      # "use client" — tokens `t`, ghép section, SmoothScroll
    ├── night-sky.tsx          # nền fixed: sao + nét xoáy chảy
    ├── horizon.tsx            # chân trời fixed (A4 nhẹ cho cây bách)
    ├── progress-moon.tsx      # trăng chạy vòng cung theo tiến độ trang
    ├── moon-gate.tsx          # C1 + T4 tròn
    ├── rise.tsx               # wrapper "mọc từ chân trời" cho card/khối chữ
    ├── stars.ts               # seeded PRNG + toạ độ sao
    ├── sections/
    │   ├── names.tsx          # C2
    │   ├── two-stars.tsx      # C3
    │   ├── constellation.tsx  # C4
    │   ├── date.tsx           # C5 + C11
    │   ├── schedule.tsx       # C12
    │   ├── venue.tsx          # C6 + C7
    │   ├── memory-sky.tsx     # C8
    │   ├── music-box.tsx      # C16
    │   ├── wish.tsx           # C14 + C15
    │   └── shooting-star.tsx  # C10
    └── svg/
```

### 9.2 Tokens
```ts
export const t = {
  root: "relative min-h-svh overflow-x-clip bg-[#0E1A3A] text-[#F1F4FF] font-(family-name:--font-body)",
  card: "rounded-2xl border border-[#6FA3D9]/25 bg-[#15254F]/80 backdrop-blur-sm",
  script: "font-(family-name:--font-script) text-[#F6C945] drop-shadow-[0_0_12px_rgba(246,201,69,0.45)]",
  title: "italic font-medium text-2xl sm:text-3xl",
  label: "text-xs font-semibold uppercase tracking-[0.25em] text-[#6FA3D9]",
  soft: "text-[#AEB8D6]",
  btn: "inline-flex h-12 items-center gap-2 rounded-full bg-[#F6C945] px-6 font-semibold text-[#0E1A3A]",
  section: "relative z-10 pb-[20svh]",
} as const;
```

### 9.3 Nét xoáy chảy + sao
```tsx
// night-sky.tsx (rút gọn)
useGSAP(() => {
  if (reduced) return;
  gsap.utils.toArray<SVGPathElement>(".swirl").forEach((p, i) => {
    gsap.to(p, { strokeDashoffset: i % 2 ? 580 : -580, duration: 20 + i * 4, ease: "none", repeat: -1 });
  });
  gsap.to(".swirl-group", { rotate: 8, transformOrigin: "50% 50%", duration: 40, ease: "sine.inOut", yoyo: true, repeat: -1 });
}, { scope: root, dependencies: [reduced] });

{stars.map((s) => (
  <span key={s.id} className="absolute rounded-full bg-[#F1F4FF] animate-pulse motion-reduce:animate-none"
    style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r, height: s.r,
             animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s` }} />
))}
```
`580` = bội số của chu kỳ dash (40 + 18 = 58) để vòng lặp liền mạch. Tab ẩn: `gsap.globalTimeline.pause()` trong `visibilitychange` (hoặc để `MusicPlayer`/kit xử lý nếu đã có hook chung).

### 9.4 Trăng tiến độ
```tsx
// progress-moon.tsx
gsap.to(moon.current, {
  ease: "none",
  motionPath: { path: "#moon-arc", align: "#moon-arc", alignOrigin: [0.5, 0.5] },
  scrollTrigger: { trigger: document.documentElement, start: "top top", end: "max", scrub: 0.8 },
});
gsap.fromTo(".moon-shadow", { xPercent: 0 }, { xPercent: 90, ease: "none",   // đổi pha trăng
  scrollTrigger: { trigger: document.documentElement, start: "top top", end: "max", scrub: 0.8 } });
```
`#moon-arc` là path SVG `fixed` phủ `inset-x-0 top-[72px] h-[12svh]`, `viewBox 0 0 100 20`, `d="M12 18 Q50 -10 88 18"`.

### 9.5 T4 từ trăng
```tsx
const { left, top, width, height } = moonBtn.current!.getBoundingClientRect();
const at = `${left + width / 2}px ${top + height / 2}px`;
gsap.timeline({ onComplete: onOpened })
  .to(".halo", { scale: 1.6, duration: 0.3 })
  .fromTo(".c2-layer", { clipPath: `circle(0% at ${at})` },
    { clipPath: `circle(150% at ${at})`, duration: 1.2, ease: "sine.inOut" }, 0.2);
```
⚠️ `clip-path` ngoài nhóm transform/opacity (spec §7) — chấp nhận cho 1 lần mở duy nhất, giống T4 của sakura-2d.

### 9.6 Chòm sao C4
Timeline ghim `scrub: true` với 3 nhãn `s1`, `s2`, `s3`; đường nối là 1 path duy nhất (qua các sao phụ, khép thành trái tim), DrawSVG `0% → 33% → 66% → 100%` tương ứng. Card chú thích đổi bằng state `active` cập nhật trong `onUpdate` (`Math.min(2, Math.floor(progress * 3.3))`), chỉ `setState` khi giá trị đổi.

### 9.7 Logic cần test
- `seededStars(seed, count)`: cùng seed → cùng kết quả; `x, y` trong [0, 100], `y` ≤ 80 (không rơi vào chân trời).
- `activeMemory(progress)` → 0 | 1 | 2 đúng ngưỡng.
- `scheduleTimes(date)`, lưới lịch tuần từ Thứ Hai.
File: `starry-2d/_components/stars.test.ts`, `constellation.test.ts`.

### 9.8 Thứ tự làm
1. `meta.ts`, `layout.tsx`, `page.tsx`, tokens, `night-sky` tĩnh + `horizon`
2. Các section tĩnh với `pb-[20svh]`, kiểm không bị che ở 360 / 1440
3. `moon-gate.tsx` + T4 + nhạc
4. Nét xoáy chảy, sao nhấp nháy, đo fps
5. `progress-moon.tsx`, kiểm tránh góc nút chung
6. Chòm sao C4 (ghim), sao băng C12, album parallax, lời chúc thành sao băng
7. Reduced-motion, tên dài (Great Vibes), hydration
8. Checklist template-spec §12
