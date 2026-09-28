# 2D-24 · `son-mai-2d` · Sơn Mài

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md). Mẫu chuẩn tham chiếu: [letter-2d.md](./letter-2d.md).

---

## 1. Concept

**Một câu:** Khách đứng trước một **bức bình phong sơn mài bốn tấm** đen bóng; bấm vào, người thợ "mài" lớp sơn và vàng lá hiện dần, rồi bình phong mở ra dẫn vào một chuỗi **tấm tranh sơn mài** kể chuyện đám cưới.

**Cảm xúc muốn gợi:** sang trọng, trang nghiêm, đậm chất Việt; chậm rãi như ngắm tranh trong bảo tàng. Ánh vàng lấp lánh trên nền đen sâu.

**Phù hợp với:** cặp đôi thích truyền thống nhưng tinh tế (áo dài, lễ gia tiên), tiệc ở nhà hàng sang, khách sạn; ảnh cưới tông tối, tương phản cao, có áo dài đỏ.

**Khác các mẫu khác ở chỗ:**
- **Hiệu ứng "mài lộ vàng"** là ngôn ngữ chính: mọi hoạ tiết, tiêu đề, khung đều xuất hiện bằng **mask gradient chạy qua** (như giấy nhám mài lớp sơn đen để lộ lớp vàng bên dưới), thay vì fade.
- **Chuyển cảnh bình phong (T7 biến thể nhiều tấm):** giữa các "chương", một bình phong 4 tấm gập kiểu zíc-zắc (`rotateY` luân phiên ±) che màn hình rồi mở ra.
- **Ánh vàng quét** (gradient `background-position`) chạy qua chữ khi hover/khi vào viewport.

**Moodboard:** tranh sơn mài Nguyễn Gia Trí (tinh thần, không sao chép), vàng lá, bạc lá, vỏ trứng khảm, son đỏ, hạc và sen, hộp sơn mài đựng trầu cau, bình phong gỗ.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `bg` | `#120A07` | Nền: sơn then (đen ánh nâu) |
| `surface` | `#1F120C` | Nền tấm tranh |
| `surface-2` | `#2A1810` | Nền khối phụ, input |
| `primary` | `#C9A24A` | Vàng lá: tiêu đề, khung, hoạ tiết, nút |
| `gold-hi` | `#F1D48A` | Điểm sáng của gradient vàng |
| `gold-lo` | `#8C6A24` | Điểm tối của gradient vàng |
| `accent` | `#A4161A` | Son đỏ: khối nhấn, ngày cưới, dấu triện |
| `eggshell` | `#E9DCC0` | Vỏ trứng: hoạ tiết khảm, đường chấm |
| `text` | `#F3E3C3` | Chữ chính |
| `text-soft` | `#BFA98A` | Chữ phụ |

Tương phản: `text` trên `surface` ≈ 14:1 ✅. `text-soft` trên `surface` ≈ 7.8:1 ✅. `primary` trên `bg` ≈ 8.2:1 ✅. `text` trên `accent` ≈ 6.6:1 ✅. Chữ `bg` trên nút `primary` ≈ 8.2:1 ✅.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Noto Serif Display 500 | 40px / 1.15 | 72px | Chữ vàng gradient (`bg-clip-text`) |
| Tiêu đề section | Noto Serif Display 600, VIẾT HOA, tracking 0.25em | 14px | 16px | "LỄ THÀNH HÔN" |
| Chữ Hán trang trí | Noto Serif Display 700 | 56px | 88px | Chỉ "囍" (song hỷ), `aria-hidden` |
| Số lớn (ngày) | Noto Serif Display 300 | 96px | 150px | |
| Nội dung | Noto Serif 400 | 17px / 1.7 | 19px | |
| Nhãn nhỏ | Noto Serif 400 italic | 14px | 15px | |

Hai font nằm trong danh sách đã kiểm subset `vietnamese`. ⚠️ Ký tự "囍" **không** có trong subset vietnamese/latin của Noto Serif Display → vẽ bằng **SVG** (path), không dùng chữ.

### Hình khối và chất liệu
- **Tấm tranh** (`<LacquerPanel>`): `rounded-[0.25rem]`, nền `surface` với lớp "độ bóng" `bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_40%)]`, khung vàng 2 lớp: `border border-[#C9A24A]` + `outline outline-1 outline-offset-4 outline-[#C9A24A]/40`.
- **Vàng gradient** (`t.gold`): `bg-[linear-gradient(110deg,#8C6A24,#C9A24A_35%,#F1D48A_50%,#C9A24A_65%,#8C6A24)] bg-[length:250%_100%] bg-clip-text text-transparent`. Ánh quét = tween `backgroundPosition: "100% 0" → "0% 0"`.
  - Lưu ý: `backgroundPosition` không phải `transform/opacity` → **chỉ chạy 1 lần** khi vào viewport (1.2s), không lặp vô hạn, để không vi phạm tinh thần §7 và không tốn repaint.
- **Mài lộ** (`<RevealGold>`): phần tử có `mask-[linear-gradient(100deg,black_40%,transparent_60%)] mask-size-[300%_100%]`, tween `maskPosition: "100% 0" → "0% 0"`. Cũng chỉ chạy 1 lần.
- **Vỏ trứng khảm**: SVG các mảnh đa giác nhỏ `eggshell` opacity 0.8, xếp thành viền.
- **Hoạ tiết**: hạc bay, hoa sen, mây cuộn, sóng nước — tự vẽ SVG nét vàng 1.25px.
- **Dấu triện**: ô vuông `accent` 40×40, chữ viết tắt tên (xem C2).
- **Motion**: ease chủ đạo `power3.out`. Vào 1.0s, ra 0.6s. Không nảy.

---

## 3. Nhạc

- **Tâm trạng**: thiền, trang trọng, có nhạc cụ dân tộc (đàn nguyệt / đàn tranh / sáo trúc), không lời.
- **Tempo**: 55–70 BPM (mục tiêu ~60). **Độ dài**: 2:30–3:00, lặp.
- **Từ khoá Pixabay**: `asian meditation instrumental`, `zither calm traditional`, `oriental peaceful strings`
- **Hành vi**:
  - Bắt đầu khi bấm "Mài tranh" (C1), âm lượng 0 → 0.6 trong 2 giây (chậm hơn chuẩn cho hợp nhịp thiền).
  - C16 là "hộp sơn mài" có nắp; mở nắp thì thấy trình phát. Cùng thẻ `<audio>` với `<MusicPlayer>`.
  - Ẩn tab thì tạm dừng.

---

## 4. Cấu trúc trang

Trang chia thành **3 chương**, ngăn bằng bình phong:

```
┌───────────────────────────┐
│ C1  Bình phong đen (đóng) │ 100svh  (cố định tới khi mở)
├─ Chương I · Đôi ta ───────┤
│ C2  Tranh chính: tên      │ 100svh
│ C3  Hai tấm tranh dọc     │ 110svh
│ C4  Cuộn tranh ngang (T5) │ ghim, ≈ 220svh
├─ ▓ bình phong ▓ ──────────┤  T7 nhiều tấm (ghim 80svh)
├─ Chương II · Ngày lành ───┤
│ C5+C11 Ngày cưới + lịch   │ 120svh
│ C12 Lịch trình (dải mây)  │ 110svh
│ C6+C7 Hai lễ + bản đồ     │ 150svh
│ C13 Dress code            │  70svh
├─ ▓ bình phong ▓ ──────────┤
├─ Chương III · Tri ân ─────┤
│ C8  Album khung khảm      │ 150svh
│ C16 Hộp sơn mài (nhạc)    │  70svh
│ C14 Mừng cưới             │  80svh
│ C15 Xác nhận tham dự      │ 100svh
│ C10 Lời cảm ơn            │ 100svh
└───────────────────────────┘
```

**Chiều rộng:** tấm tranh `min(92vw, 480px)`, giữa màn hình. Desktop: hai bên có dải hoạ tiết mây vàng chạy dọc (A4 parallax, `data-speed` 0.8).
**Chuyển cảnh trong chương:** T1 với hiệu ứng "mài lộ" (thay A1). **Giữa chương:** bình phong T7.

---

## 5. Chi tiết từng section

### C1 · Bình phong đen (màn mở thiệp)

**Mục đích:** khoảnh khắc "mài tranh" thật chậm; cú bấm để phát nhạc.

**Wireframe (360px):**
```
┌────────────────────────────┐
│ ┌─────┬─────┬─────┬─────┐  │  ← 4 tấm bình phong, đen bóng, khung vàng mờ
│ │     │     │     │     │  │     (tấm hơi lệch góc để thấy khối)
│ │  ░  │  ░  │  ░  │  ░  │  │  ← hoạ tiết hạc/sen ẩn dưới lớp đen
│ │     │ Minh│ Thu │     │  │  ← tên đã lộ sẵn, vàng mờ 40%
│ │     │ Quân│ Hà  │     │  │
│ └─────┴─────┴─────┴─────┘  │
│                            │
│       ┌──────────────┐     │
│       │  MÀI TRANH   │     │  ← nút viền vàng 200×52
│       └──────────────┘     │
│  Chạm để mở thiệp mời      │
└────────────────────────────┘
```

**Nội dung:** `<h1>` gồm `{groom.name}` và `{bride.name}` (tên nằm trên tấm 2 và 3, mỗi tên tối đa 3 dòng, 20px); nút "MÀI TRANH"; dòng *"Chạm để mở thiệp mời"*.

**Animation vào:**
| t | Hành động |
|---|---|
| 0.0s | 4 tấm fade + `y: 20 → 0`, stagger 0.1 (1.0s) |
| 0.6s | Tên hiện mờ (`opacity 0 → 0.4`) |
| 1.2s | Nút A1 |
| lặp | Một vệt sáng bóng (dải trắng 8% xiên) lướt qua bình phong mỗi 5s (`x: -100% → 200%`, 1.4s) — gợi độ bóng của sơn |

**Khi bấm (timeline mở, tổng 2.6s):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc bắt đầu, fade 2s |
| 0.0s | Nút fade |
| 0.1s | Lớp "mài": mask gradient quét qua 4 tấm từ trái sang phải (`maskPosition`, 1.2s, `power2.inOut`) → hạc, sen, mây vàng + vỏ trứng lộ ra |
| 0.9s | Tên `opacity 0.4 → 1`, ánh vàng quét qua chữ (1.0s) |
| 1.6s | Bình phong mở: tấm 1 & 4 `rotateY ±90°`, tấm 2 & 3 `rotateY ∓90°` (gập zíc-zắc về hai mép), `transformOrigin` ở mép ngoài tương ứng, `perspective: 1400px` (0.9s) |
| 2.3s | Lộ C2 phía sau (C2 đã render sẵn dưới bình phong, `scale 1.05 → 1`) |
| 2.6s | Mở khoá cuộn |

**Reduced-motion:** không gập 3D; mask quét thay bằng fade 0.4s, bình phong fade ra 0.3s.
**Edge case:** tên > 16 ký tự: 16px, xuống dòng trong tấm; > 36 ký tự: tên được đặt **dưới** bình phong thay vì trên tấm.

---

### C2 · Tranh chính: tên

```
┌────────────────────────────┐
│ ╔════════════════════════╗ │  ← khung vàng đôi + viền vỏ trứng khảm
│ ║  ╭──────────────────╮  ║ │
│ ║  │  ẢNH BÌA 4:5     │  ║ │  ← images[0], khung vòm nhọn (clip-path)
│ ║  ╰──────────────────╯  ║ │
│ ║        [ 囍 SVG ]       ║ │  ← song hỷ vàng, 56px
│ ║  TRÂN TRỌNG KÍNH BÁO   ║ │
│ ║    LỄ THÀNH HÔN        ║ │
│ ║     Minh Quân          ║ │  ← vàng gradient 40px
│ ║   ─── ❀ sen ❀ ───      ║ │
│ ║       Thu Hà           ║ │
│ ║ THỨ BẢY · 14.11.2026   ║ │  ← ⚠️ `date`
│ ║ Nhằm ngày 24 tháng 9   ║ │  ← ngày âm lịch ⚠️ (xem bên dưới)
│ ║ năm Bính Ngọ    [Q·H]  ║ │  ← dấu triện son đỏ góc phải
│ ╚════════════════════════╝ │
└────────────────────────────┘
```
**Nội dung:** "TRÂN TRỌNG KÍNH BÁO LỄ THÀNH HÔN CỦA", tên, ngày dương. **Ngày âm lịch**: dùng `src/kit/lunar.ts` (todo §2D-18 đã lên kế hoạch). ⚠️ Nếu `lunar.ts` chưa có khi làm mẫu này thì **bỏ dòng âm lịch**, không tự viết lại trong thư mục mẫu. Dấu triện: chữ cái đầu của tên gọi (từ cuối) hai người, "Q·H", xếp dọc.
**Animation:** khung "mài lộ" từ trên xuống (1.0s) → ảnh A3 → 囍 A6 (DrawSVG nét) → tên ánh vàng quét → dấu triện "đóng" (`scale 1.4 → 1`, `rotation -8 → -3`, 0.3s, `power4.in`).

---

### C3 · Hai tấm tranh dọc

```
┌────────────────────────────┐
│ ┌───────────┐┌───────────┐ │  ← 2 tấm dọc như câu đối, khung vàng
│ │ hạc bay   ││ hạc bay   │ │     (hạc hai tấm quay mặt vào nhau)
│ │ images[1] ││ images[2] │ │  ← 3:4
│ │  NHÀ TRAI ││  NHÀ GÁI  │ │
│ │ Minh Quân ││  Thu Hà   │ │  ← vàng 22px
│ │ Quận 1,   ││ Ba Đình,  │ │
│ │ TP.HCM    ││ Hà Nội    │ │
│ └───────────┘└───────────┘ │
└────────────────────────────┘
```
**Nội dung:** `groom.*`, `bride.*`. Tên bố mẹ ⚠️: nếu có, dòng *"Ông … · Bà …"* trên tên, 14px; không có thì bỏ.
**Animation:** hai tấm "mài lộ" ngược chiều nhau (trái quét từ trái, phải quét từ phải), cách 0.2s; hạc A6 nét vàng.
**Mobile < 360px:** 1 cột, hạc chỉ vẽ ở tấm trên.

---

### C4 · Cuộn tranh ngang (chuyện tình, T5)

```
┌────────────────────────────┐
│  CHUYỆN ĐÔI TA             │
│ ┌──────────────────────────┼──► (dải tranh dài 3 khung)
│ │ ~sóng~ [ảnh 3] Gặp gỡ ~mây~ [ảnh 4] Thương ~sen~ [ảnh 5] Hẹn ước
│ └──────────────────────────┼──►
│  ━━━━━●━━━━━━━━━━  1/3      │  ← thanh tiến độ vàng
└────────────────────────────┘
```
**Nội dung viết sẵn:**
1. **Duyên gặp** — *"Giữa muôn người, ta tình cờ gặp nhau vào một mùa thu Hà Nội."*
2. **Tình thương** — *"Qua bao mùa trăng, hai trái tim học cách thương nhau bằng những điều giản dị."*
3. **Hẹn ước** — *"Và nay, xin được cùng nhau nên duyên vợ chồng, trước sự chứng giám của hai họ."*

Ảnh: `images[3..5]`, khung chữ nhật 4:5, giữa các khung là hoạ tiết sóng/mây/sen nối liền thành một bức tranh dài.
**Hành vi:** ghim, A5 (`scrub: 1`). Mỗi khung khi vào giữa màn hình thì "mài lộ" phần chữ của nó (dùng `containerAnimation` của ScrollTrigger).
**Reduced-motion:** không ghim; 3 khung xếp dọc.

---

### Bình phong chuyển chương (T7 nhiều tấm)

```
┌────────────────────────────┐
│ ┌─────┬─────┬─────┬─────┐  │
│ │     │  CHƯƠNG II        │ │  ← tên chương ở giữa, vàng
│ │     │  Ngày lành   │     │ │
│ └─────┴─────┴─────┴─────┘  │
└────────────────────────────┘
```
Section `100svh` ghim `end: "+=80%"`, scrub:
| progress | Hành động |
|---|---|
| 0 → 0.35 | 4 tấm gập vào từ hai mép (`rotateY` ±90° → 0) che màn hình |
| 0.35 → 0.65 | Tên chương "mài lộ" (`maskPosition`), đứng yên để đọc |
| 0.65 → 1 | 4 tấm gập ra theo chiều ngược lại, lộ chương sau |

Tên chương: *"Chương I · Đôi ta"* (hiện ở đầu C2, không có bình phong), *"Chương II · Ngày lành"*, *"Chương III · Tri ân"*.
**Reduced-motion:** chỉ là một tiêu đề chương tĩnh 40svh, không ghim.

---

### C5 + C11 · Ngày cưới và lịch

```
┌────────────────────────────┐
│ ╔════════════════════════╗ │
│ ║  THÁNG MƯỜI MỘT · 2026 ║ │
│ ║   ┌──────────────┐     ║ │
│ ║   │      14      │     ║ │  ← ô son đỏ, số vàng 96px
│ ║   └──────────────┘     ║ │
│ ║   THỨ BẢY              ║ │
│ ║  45 ngày · 06 giờ ·    ║ │  ← A7
│ ║  12 phút · 33 giây     ║ │
│ ╚════════════════════════╝ │
│  T2 T3 T4 T5 T6 T7 CN      │  ← lưới lịch, nét chấm vỏ trứng
│  …  12  13 (✿) 15 …        │  ← hoa sen vàng quanh ngày cưới
└────────────────────────────┘
```
**Nội dung:** như letter-2d C5; sau ngày cưới: *"Đôi ta đã nên duyên vợ chồng"*.
**Animation:** ô son đỏ "mài lộ" từ dưới lên; số 14 đếm lên; sen A6.

---

### C12 · Lịch trình (dải mây)

```
┌────────────────────────────┐
│        LỊCH TRÌNH          │
│  ~~~ mây vàng cuộn ~~~     │  ← đường mây SVG uốn lượn dọc (A6 scrub)
│  17:00 ◆ Đón khách         │
│        ~~~                 │
│  18:00 ◆ Làm lễ            │  ← ◆ dấu thoi son đỏ
│        ~~~                 │
│  18:30 ◆ Khai tiệc         │
│        ~~~                 │
│  20:00 ◆ Tri ân khách      │
└────────────────────────────┘
```
**Nội dung:** 4 mốc tính từ `date` (như letter-2d C12, mốc 4 đổi là *"Tri ân khách"*).
**Animation:** đường mây vẽ theo scrub; mỗi mốc "mài lộ" khi đường mây tới.

---

### C6 + C7 · Hai lễ và bản đồ

```
┌────────────────────────────┐
│ ╔════════════════════════╗ │
│ ║   LỄ GIA TIÊN          ║ │  ← (thay "vu quy" cho hợp không khí)
│ ║   08:00 · Thứ Bảy      ║ │
│ ║   Tư gia nhà gái       ║ │
│ ║   {bride.address}      ║ │
│ ╚════════════════════════╝ │
│ ╔════════════════════════╗ │
│ ║   TIỆC CƯỚI            ║ │
│ ║   18:00 · Thứ Bảy      ║ │
│ ║   {venue.name}         ║ │
│ ║   {venue.address}      ║ │
│ ║ ┌────────────────────┐ ║ │  ← <MapEmbed> 16:10, khung vàng
│ ║ └────────────────────┘ ║ │
│ ║   [ ⌖ CHỈ ĐƯỜNG ]      ║ │
│ ╚════════════════════════╝ │
└────────────────────────────┘
```
**Animation:** hai tấm "mài lộ" lần lượt. Bản đồ lazy như letter-2d.

---

### C13 · Dress code

```
┌────────────────────────────┐
│        DRESS CODE          │
│  Trang trọng · áo dài được │
│  khuyến khích              │
│   ◆     ◆     ◆     ◆      │  ← 4 viên hình thoi (như khảm)
│  Đen   Son   Vàng  Ngà     │     #120A07 #A4161A #C9A24A #E9DCC0
└────────────────────────────┘
```
Viên màu đen có viền vàng để thấy trên nền đen. **Animation:** mỗi viên là ô vuông `rotate-45`; animate `scale 0 → 1` và `rotation 0 → 45` (kết thúc thành hình thoi), stagger 0.1.

---

### C8 · Album khung khảm

```
┌────────────────────────────┐
│        KHOẢNH KHẮC         │
│ ┌──────────┐┌─────┐        │  ← lưới masonry 2 cột, mỗi ảnh có khung
│ │ images[3]││ [4] │        │     vàng + góc vỏ trứng khảm
│ │          │└─────┘        │
│ └──────────┘┌─────┐        │
│ ┌─────┐     │ [5] │        │
│ │ [0] │     └─────┘        │
│ └─────┘                    │
└────────────────────────────┘
```
**Hành vi:** mỗi ảnh "mài lộ" khi vào viewport (mask quét chéo), bấm → A10 lightbox nền `bg/95`. Ảnh dùng lại `images[3..5]` + `images[0]` (4 ảnh). Lightbox có nút ← → và phím mũi tên.

---

### C16 · Hộp sơn mài (nhạc)

```
┌────────────────────────────┐
│   ┌──────────────────────┐ │  ← nắp hộp (khung vàng, hoạ tiết sen)
│   ├──────────────────────┤ │
│   │ ♪ Chạm để nghe bài   │ │
│   │   hát của chúng tôi  │ │
│   │ [ ▶/❚❚ ]  ──●── 1:12 │ │
│   └──────────────────────┘ │
└────────────────────────────┘
```
**Hành vi:** khi vào viewport nắp nâng lên `y: -24`, `rotateX: 25°` (0.8s). Cùng thẻ audio.

---

### C14 · Mừng cưới · C15 · Xác nhận tham dự

- **C14**: hai tấm tranh nhỏ "Hộp mừng nhà trai / nhà gái", mỗi tấm chứa QR mẫu ⚠️; bấm → A10. Câu: *"Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng tôi."*
- **C15**: input nền `surface-2`, viền dưới vàng; nhãn *"Quý danh"*, *"Tôi sẽ tham dự"*, *"Rất tiếc, tôi không thể đến"*, *"Số người"*, nút *"GỬI XÁC NHẬN"*. Bấm Gửi → form thu lại, *"Trân trọng cảm ơn {tên}!"* "mài lộ". **Không gửi dữ liệu đi đâu**; ghi chú *"Bản xem thử — xác nhận không được gửi đi."*

---

### C10 · Lời cảm ơn

```
┌────────────────────────────┐
│ ╔════════════════════════╗ │
│ ║ ╭────────────────────╮ ║ │  ← images[n-1], khung vòm nhọn
│ ║ ╰────────────────────╯ ║ │
│ ║  Gia đình chúng tôi    ║ │
│ ║  trân trọng cảm ơn!    ║ │
│ ║   Minh Quân & Thu Hà   ║ │
│ ║   ~ hạc bay đi ~       ║ │
│ ╚════════════════════════╝ │
└────────────────────────────┘
```
**Animation (scrub):** hai con hạc SVG bay từ góc dưới trái lên góc trên phải theo MotionPath (A6 đường bay mờ + hạc `motionPath` scrub). Cuối section, toàn bộ tấm tranh được phủ lại lớp đen từ phải sang trái chỉ **50%** (mask ngược), để lại tên sáng — khép lại C1.

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | C2 ảnh bìa; C8 ảnh thứ 4 | 4:5 |
| `images[1]` | C3 chú rể | 3:4 |
| `images[2]` | C3 cô dâu | 3:4 |
| `images[3..5]` | C4 cuộn tranh + C8 album | 4:5 |
| `images[n-1]` | C10 (= `images[5]`) | 3:4 |

`meta.media = { images: 6, videos: 0 }`
`meta.styles = ["traditional", "luxury"]`, `meta.colors = ["black", "red", "gold"]`.

## 7. Asset cần chuẩn bị
- [ ] SVG tự vẽ: bình phong 1 tấm (dùng lặp 4 lần, mỗi tấm hoạ tiết khác: hạc, sen, mây, sóng), song hỷ 囍 (path), hạc bay (2 tư thế), hoa sen nhỏ, mây cuộn (dải dài cho C12 và nền desktop), viền vỏ trứng khảm (pattern), khung vòm nhọn
- [ ] `music.mp3` (Pixabay, đàn tranh/nguyệt ~60 BPM) + `CREDITS.md`
- [ ] 6 ảnh mẫu tông tối, có áo dài (Unsplash/Pexels) ≤ 300KB `.webp`
- [ ] `qr-sample.webp`
- [ ] `thumb.webp` 600×800: bình phong đang mở hé, vàng lộ một nửa
- [ ] `opengraph-image.png` 1200×630

## 8. Tiêu chí nghiệm thu riêng
- [ ] Bấm "MÀI TRANH": nhạc phát ngay, cuộn được trong ≤ 2.7 giây
- [ ] Hiệu ứng "mài lộ" (mask) hoạt động trên Safari iOS (cần `-webkit-mask-image`; Tailwind v4 arbitrary `[mask-image:…]` có tự thêm prefix không → kiểm, nếu không thì dùng utility `mask-*` có sẵn của Tailwind v4)
- [ ] Ánh vàng quét / mài lộ chỉ chạy 1 lần mỗi phần tử, không lặp nền
- [ ] Bình phong chuyển chương mượt 60fps, kéo ngược đúng
- [ ] Không có ký tự Hán dạng chữ (tofu) — 囍 là SVG
- [ ] Tên 50 ký tự không vỡ bình phong C1 và khung C2

---

## 9. Triển khai code

### 9.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/son-mai-2d/
├── meta.ts
├── layout.tsx                 # Noto_Serif_Display (--font-display) + Noto_Serif (--font-body), vietnamese
├── page.tsx                   # return <SonMaiInvite />
└── _components/
    ├── son-mai-invite.tsx     # "use client" — tokens t, 3 chương, SmoothScroll
    ├── screen-gate.tsx        # C1 (bình phong đóng → mài → mở), dùng OpenGate
    ├── folding-screen.tsx     # bình phong 4 tấm dùng chung cho C1 và chuyển chương
    ├── chapter-break.tsx      # section ghim chuyển chương
    ├── lacquer-panel.tsx      # khung tranh
    ├── reveal-gold.tsx        # wrapper "mài lộ" (mask) — 1 lần khi vào viewport
    ├── seal.ts                # tính chữ dấu triện từ 2 tên
    ├── seal.test.ts
    ├── sections/
    │   ├── main-panel.tsx     # C2
    │   ├── family-panels.tsx  # C3
    │   ├── story-scroll.tsx   # C4 (A5)
    │   ├── date-panel.tsx     # C5 + C11
    │   ├── cloud-schedule.tsx # C12
    │   ├── events-panel.tsx   # C6 + C7
    │   ├── dress-panel.tsx    # C13
    │   ├── inlay-album.tsx    # C8
    │   ├── lacquer-box.tsx    # C16
    │   ├── gift-panel.tsx     # C14
    │   ├── rsvp-panel.tsx     # C15
    │   └── thanks-panel.tsx   # C10 (MotionPath hạc)
    └── svg/
```
Dùng chung `@/kit`: `SmoothScroll`, `OpenGate`, `MusicPlayer`, `Countdown`, `useReducedMotion`, `presets`, (nếu có) `lunar`. `@/components`: `MapEmbed`. Cần đăng ký thêm **MotionPathPlugin** — ⚠️ `src/kit/gsap.ts` theo todo chưa liệt kê; nếu kit chưa đăng ký thì đề xuất thêm vào kit (không đăng ký riêng trong mẫu), hoặc bỏ MotionPath và cho hạc bay bằng tween `x/y` đường thẳng.

### 9.2 Tokens trong Tailwind
```ts
// son-mai-invite.tsx
export const t = {
  root: "min-h-svh bg-[#120A07] text-[#F3E3C3] font-(family-name:--font-body) overflow-x-clip",
  display: "font-(family-name:--font-display)",
  panel: "rounded-[0.25rem] bg-[#1F120C] bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_40%)] border border-[#C9A24A] outline outline-1 outline-offset-4 outline-[#C9A24A]/40",
  gold: "bg-[linear-gradient(110deg,#8C6A24,#C9A24A_35%,#F1D48A_50%,#C9A24A_65%,#8C6A24)] bg-[length:250%_100%] bg-[position:100%_0] bg-clip-text text-transparent",
  heading: "text-sm tracking-[0.25em] uppercase font-semibold text-[#C9A24A]",
  soft: "text-[#BFA98A]",
  seal: "bg-[#A4161A] text-[#F3E3C3] size-10 grid place-items-center text-xs leading-none",
  btn: "min-h-11 px-6 border border-[#C9A24A] text-[#C9A24A] tracking-[0.2em] uppercase hover:bg-[#C9A24A] hover:text-[#120A07] focus-visible:outline-2 focus-visible:outline-[#F1D48A]",
} as const;
```

### 9.3 "Mài lộ" (reveal-gold.tsx)
```tsx
export function RevealGold({ children, dir = "ltr" }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useGSAP(() => {
    if (reduced) return gsap.from(el.current, { opacity: 0, duration: 0.4 });
    gsap.fromTo(el.current,
      { maskPosition: dir === "ltr" ? "100% 0" : "0% 0" },
      { maskPosition: dir === "ltr" ? "0% 0" : "100% 0", duration: 1.1, ease: "power2.inOut",
        scrollTrigger: { trigger: el.current, start: "top 80%", once: true } });
  }, { scope: el, dependencies: [reduced] });
  return <div ref={el} className="mask-[linear-gradient(100deg,black_40%,transparent_60%)] mask-size-[300%_100%]">{children}</div>;
}
```
GSAP tween `maskPosition` — ⚠️ kiểm gsap 3.15 có tự thêm `-webkit-mask-position` không; nếu không, tween cả `WebkitMaskPosition`.

### 9.4 Bình phong (folding-screen.tsx)
```tsx
// 4 tấm trong container [perspective:1400px] flex
// tấm i: origin mép ngoài: i<2 → origin-left, i>=2 → origin-right; hướng gập luân phiên
const angle = (i: number) => (i % 2 === 0 ? 90 : -90) * (i < 2 ? 1 : -1);
useGSAP(() => {
  const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "+=80%", pin: true, scrub: true } })
    .fromTo(".leaf", { rotateY: (i) => angle(i) }, { rotateY: 0, duration: 0.35, ease: "power2.out" })
    .from(".chapter-title", { opacity: 0, duration: 0.1 }, 0.35)
    .to({}, { duration: 0.2 })
    .to(".leaf", { rotateY: (i) => -angle(i), duration: 0.35, ease: "power2.in" });
}, { scope: root });
```
Dùng chung cho C1 (mode `"gate"`: timeline paused, chỉ pha mở) và chuyển chương (mode `"scroll"`).

### 9.5 Dấu triện
`seal.ts`: `sealChars(groom: string, bride: string): [string, string]` — lấy chữ cái đầu của từ cuối, viết hoa, xử lý khoảng trắng thừa và tên 1 từ. Nếu kit đã có hàm `initials()` (letter-2d đề xuất để trong thư mục letter-2d nên **không import được** — template-spec §1) → viết lại ~5 dòng ở đây.
**Test** (`seal.test.ts`): "Nguyễn Minh Quân" → "Q"; "  Thu   Hà " → "H"; "Ánh" → "Á" (giữ dấu); chuỗi rỗng → "".

### 9.6 Cuộn tranh ngang (C4) với containerAnimation
```tsx
const scroll = gsap.to(track, { x: () => -(track.scrollWidth - innerWidth), ease: "none",
  scrollTrigger: { trigger: section, pin: true, scrub: 1, end: () => `+=${track.scrollWidth}`, invalidateOnRefresh: true } });
gsap.utils.toArray<HTMLElement>(".frame-text").forEach((el) =>
  gsap.fromTo(el, { maskPosition: "100% 0" }, { maskPosition: "0% 0",
    scrollTrigger: { trigger: el, containerAnimation: scroll, start: "left 70%", end: "left 30%", scrub: true } }));
```

### 9.7 Thứ tự làm
1. `meta.ts`, `layout.tsx`, `page.tsx`, tokens `t`
2. `lacquer-panel.tsx` + section tĩnh C2 → C10 theo 3 chương, khớp 360 / 1440px
3. `reveal-gold.tsx`, kiểm tra Safari iOS
4. `folding-screen.tsx` + `screen-gate.tsx` + nhạc
5. `chapter-break.tsx` (2 lần)
6. C4 cuộn ngang + containerAnimation; C10 hạc bay
7. `seal.ts` + test; ngày âm lịch nếu `@/kit/lunar` đã có
8. Reduced-motion, Lighthouse, checklist template-spec §12
