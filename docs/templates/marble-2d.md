# 2D-28 · `marble-2d` · Đá Cẩm Thạch

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md). Mẫu tham chiếu cấu trúc: [letter-2d.md](./letter-2d.md).

---

## 1. Concept

**Một câu:** Một sảnh đá cẩm thạch trắng với những ô cửa vòm; mỗi phần của thiệp được mở ra qua một ô cửa vòm, chữ dát vàng, monogram hai người ở trung tâm.

**Cảm xúc muốn gợi:** sang trọng, trang nghiêm, tĩnh lặng — như bước vào sảnh khách sạn 5 sao hay nhà thờ đá. Ít màu, nhiều khoảng trắng.

**Phù hợp với:** cặp đôi cưới ở khách sạn, trung tâm hội nghị lớn; ảnh cưới studio tông trắng/kem, váy cưới cổ điển. Hợp với gia đình muốn thiệp có **tên bố mẹ hai bên** đầy đủ, trang trọng.

**Khác các mẫu khác ở chỗ:** bố cục **đối xứng tuyệt đối** quanh trục giữa, mọi khung ảnh đều là hình vòm. Chuyển cảnh chủ đạo là **T4 dạng vòm**: section sau được lộ ra qua một ô cửa vòm nở rộng từ giữa màn hình (`clip-path` hình vòm, scrub), giống bước qua cửa sang sảnh kế tiếp. Lịch trình dạng **zigzag trái–phải** quanh một trục vàng.

**Moodboard:** đá Carrara vân xám, lá vàng (gold leaf), cửa vòm kiểu Ý, nến trắng, hoa lan hồ điệp trắng, giấy ép kim, monogram khắc chìm.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `bg` | `#F7F5F2` | Nền đá (dưới lớp vân) |
| `stone` | `#FFFFFF` | Nền khối nội dung, bên trong vòm |
| `vein` | `#C9C4BC` | Vân đá (SVG), đường kẻ mảnh |
| `gold` | `#B08D57` | Màu chủ đạo trang trí: viền vòm, monogram, icon, đường trục |
| `gold-light` | `#E4CFA0` | Điểm sáng trong gradient ánh kim |
| `gold-deep` | `#8A6A3B` | Chữ màu vàng (tiêu đề nhỏ, nhãn), gradient đoạn tối |
| `onyx` | `#1F1F1F` | Khối nền đậm (C5), nút |
| `ink` | `#2A2A2A` | Chữ chính |
| `ink-soft` | `#6E6A64` | Chữ phụ |

Tương phản: `ink` trên `stone` khoảng 14:1 ✅. `ink-soft` trên `stone` khoảng 5.4:1 ✅. `gold-deep` trên `stone` khoảng 4.8:1 ✅ → dùng cho chữ vàng cỡ nhỏ. `gold` trên `stone` chỉ khoảng 3.1:1 ❌ → **chỉ dùng cho chữ ≥ 24px** (tên, số lớn, đạt chuẩn chữ lớn 3:1) và trang trí. `gold-light` trên `onyx` khoảng 11:1 ✅.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Cormorant Garamond 600, VIẾT HOA, tracking 0.12em | 34px / 1.1 | 60px | Chữ vàng ánh kim |
| Monogram | Cormorant Garamond 300 | 88px | 140px | "Q \| H" |
| Tiêu đề section | Cormorant Garamond 600, VIẾT HOA, tracking 0.3em | 15px | 17px | `gold-deep` |
| Số lớn (ngày) | Cormorant Garamond 300 | 104px | 160px | |
| Nội dung | Montserrat 300 | 14px / 1.8 | 15px | tracking 0.02em |
| Nhãn nhỏ | Montserrat 500, VIẾT HOA, tracking 0.25em | 10px | 11px | ⚠️ 10px chỉ dùng cho nhãn phụ, không cho thông tin chính |

Cả hai font có subset `vietnamese`. Montserrat 300 ở 14px khá mảnh; nếu kiểm tra thực tế thấy khó đọc trên màn hình kém, tăng lên 400.

### Hình khối và chất liệu
- **Vòm**: `rounded-t-full rounded-b-2xl` (≈ `9999px 9999px 1rem 1rem`). Viền kép: vòm ngoài viền `1px gold`, vòm trong cách 6px viền `1px gold/50`.
- **Vân đá**: 1 SVG `feTurbulence` (`baseFrequency 0.008 0.02`, `numOctaves 3`) + `feColorMatrix` ra xám nhạt, nhân với `bg`, `opacity-40`. Render **một lần** thành component `<MarbleTexture/>` phủ `fixed inset-0`. Thêm 3–4 path vân "gân lớn" vẽ tay màu `vein`.
- **Chữ ánh kim**: `bg-[linear-gradient(110deg,#8A6A3B_0%,#B08D57_35%,#E4CFA0_50%,#B08D57_65%,#8A6A3B_100%)] bg-clip-text text-transparent bg-[size:250%_100%]`. Hiệu ứng lấp lánh xem 9.4.
- **Đường kẻ**: 1px `gold`, hai đầu có hình thoi nhỏ ◆ 5px.
- **Icon**: nét 1px `gold`, trong vòng tròn 56px viền `gold`: nhẫn, ly champagne, đĩa ăn, nhạc, xe hoa, máy ảnh.
- **Ảnh**: luôn trong vòm; `grayscale-[15%]` cho đồng tông.
- **Motion**: ease `power3.out`. Vào 1.0s, vòm mở 1.2s. Không nảy, không xoay.

---

## 3. Nhạc

- **Tâm trạng**: piano và dàn dây trang trọng, sang trọng, cổ điển; có thể có cello. Không lời.
- **Tempo**: 65–75 BPM. **Độ dài**: 2:30–3:00, lặp.
- **Từ khoá Pixabay**: `elegant piano strings luxury`, `classical wedding cello piano`, `luxury romantic orchestral`
- **Hành vi**: bắt đầu khi bấm monogram (C1), 0 → 0.55 trong 1.5s. C16 là dải "Now playing" mảnh dưới C2. Ẩn tab tạm dừng.

---

## 4. Cấu trúc trang

```
┌───────────────────────────┐
│ C1  Monogram trên đá       │ 100svh (cố định tới khi mở)
│     ── bấm: vòm mở (T4) ── │
├───────────────────────────┤
│ C2  Vòm ảnh bìa + tên      │ 110svh
│ C16 Now playing (mảnh)     │  20svh
│ C3  Hai gia đình (bố mẹ)   │ 110svh
│  ⌒ vòm mở ⌒ (T4 scrub)     │ 100svh (ghim)
│ C5+C11 Ngày cưới (onyx)    │ 130svh
│ C12 Lịch trình zigzag      │ 150svh
│  ⌒ vòm mở ⌒                │ 100svh (ghim)
│ C6+C7 Hai lễ + bản đồ      │ 140svh
│ C13 Dress code             │  70svh
│ C8  Hành lang vòm (album)  │ 180svh (A5 ngang, ghim)
│ C14 Mừng cưới              │  80svh
│ C15 Xác nhận               │ 100svh
│ C10 Lời cảm ơn + monogram  │ 100svh
└───────────────────────────┘
```

Chiều rộng nội dung: `w-[min(88vw,520px)]` căn giữa, trục đối xứng là tâm màn hình. Desktop: hai bên có 2 cột đá trơn (`w-[8vw]`, gradient xám rất nhạt) như cột sảnh, cố định.

---

## 5. Chi tiết từng section

### C1 · Monogram trên đá

**Wireframe (360px):**
```
┌────────────────────────────┐
│  (vân đá phủ toàn màn)     │
│                            │
│        ◆──────◆            │
│       ╭────────╮           │  ← vòm viền kép gold 220×300
│      │          │          │
│      │  Q  │  H │          │  ← monogram 88px, A6 vẽ nét
│      │          │          │
│      │ 14.11.26 │          │  ← Montserrat 11px tracking
│      └──────────┘          │
│                            │
│   MINH QUÂN  &  THU HÀ     │  ← 15px caps gold-deep
│                            │
│   CHẠM ĐỂ MỞ THIỆP         │  ← nhãn 10px ink-soft, nhấp nháy opacity
└────────────────────────────┘
```
**Nội dung:** chữ cái đầu của **tên gọi** (từ cuối cùng): "Minh Quân" → Q, "Thu Hà" → H. Ngày `dd.MM.yy` (⚠️ `date`). Tên đầy đủ viết hoa. Toàn bộ vòm là `<button aria-label="Mở thiệp mời">`.

**Animation vào:**
| t | Hành động |
|---|---|
| 0.0s | Vân đá `opacity 0 → 1` (1.0s) |
| 0.3s | Viền vòm ngoài A6 từ chân trái → đỉnh → chân phải (1.4s), vòm trong trễ 0.2s |
| 0.8s | Monogram A6 vẽ nét chữ (SVG outline từ font, 1.6s) rồi fill vàng `opacity 0 → 1` (0.4s) |
| 2.2s | Tên và dòng "CHẠM ĐỂ MỞ THIỆP" A1 |
| lặp | Lấp lánh chạy qua monogram mỗi 4s (xem 9.4) |

**Khi bấm (T4 dạng vòm, tổng 1.8s):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc bắt đầu |
| 0.0s | Monogram và chữ `opacity → 0`, `scale 1 → 0.96` (0.4s) |
| 0.2s | Lớp phủ C1 được cắt bằng mask hình vòm **đảo ngược**: một lỗ hình vòm ở giữa nở `scale 1 → 12` (1.4s, `power3.inOut`), qua lỗ thấy C2 |
| 1.8s | Gỡ lớp phủ, mở khoá cuộn |

**Reduced-motion:** crossfade 0.3s. **Edge case:** tên > 24 ký tự → dòng tên tách 2 dòng (chú rể / cô dâu), cỡ 13px.

---

### C2 · Vòm ảnh bìa + tên

```
┌────────────────────────────┐
│    ╭──────────────────╮    │
│   │                    │   │  ← images[0] trong vòm, 3:4, rộng 80%
│   │      ẢNH BÌA       │   │
│   │                    │   │
│   └────────────────────┘   │
│  CHÚNG TÔI SẮP VỀ CHUNG    │  ← tiêu đề gold-deep
│  MỘT NHÀ                   │
│        MINH QUÂN           │  ← 34px ánh kim
│            &               │  ← Cormorant italic 28px
│         THU HÀ             │
│   ◆────────────────◆       │
│  THỨ BẢY · 14 . 11 . 2026  │
└────────────────────────────┘
```
**Nội dung:** "CHÚNG TÔI SẮP VỀ CHUNG MỘT NHÀ" (phiên bản Việt của "We are getting married"), tên, ngày.
**Animation:** ảnh A3 nhưng clip theo hình vòm: `clip-path: inset(100% 0 0 0 round 9999px 9999px 16px 16px) → inset(0 round …)` 1.2s. Tên A2 `lines`. Chữ ánh kim lấp lánh 1 lần khi vào.

### C16 · Now playing

```
┌────────────────────────────┐
│  ◆  ▶ Bài hát của chúng tôi │  ← 1 dòng, viền trên/dưới gold 1px
│     ───●──────── 1:12  ◆    │
└────────────────────────────┘
```
Đồng bộ `MusicPlayer`. Nút ▶/❚❚ 44×44.

---

### C3 · Hai gia đình (có bố mẹ)

```
┌────────────────────────────┐
│    HAI GIA ĐÌNH            │
│  ╭──────╮      ╭──────╮    │  ← images[1], images[2] vòm nhỏ 4:5
│  │ chú  │  ◆   │ cô   │    │
│  │ rể   │      │ dâu  │    │
│  └──────┘      └──────┘    │
│  NHÀ TRAI  │   NHÀ GÁI     │  ← cột chia bởi đường gold dọc
│  Ông Nguyễn│  Ông Trần Văn │  ← tên bố mẹ ⚠️
│  Văn A     │  B            │
│  Bà Lê Thị │  Bà Phạm Thị  │
│  C         │  D            │
│  {groom.   │  {bride.      │
│  address}  │  address}     │
│            │               │
│  Trưởng nam│  Út nữ        │  ← ⚠️ thứ bậc: không có dữ liệu → bỏ
│  MINH QUÂN │  THU HÀ       │  ← 20px caps gold
└────────────────────────────┘
```
**Nội dung:** tên bố mẹ ⚠️ (4 trường đề xuất ở §8 todo-list chưa có). Fallback khi không có: bỏ 2 dòng "Ông/Bà", thay bằng dòng "Nhà trai" / "Nhà gái" to hơn; bố cục không để trống. Dòng thứ bậc ("Trưởng nam") **không làm** vì không có dữ liệu.
**Animation:** hai vòm A3 so le 0.15s; hai cột chữ A1 từ trục giữa ra hai bên (`x: ∓20 → 0`). Đường gold dọc A6 từ trên xuống.
**Edge case:** màn < 340px → 1 cột, nhà trai trên, nhà gái dưới. Địa chỉ tối đa 3 dòng.

---

### Vòm mở (T4 scrub) — dùng 2 lần

**Mục đích:** chuyển cảnh đặc trưng. Không có nội dung riêng.

```
┌────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  ← section trước (ghim)
│ ▓▓▓▓▓▓▓╭──────────╮▓▓▓▓▓▓▓ │
│ ▓▓▓▓▓▓│  section  │▓▓▓▓▓▓▓ │  ← section sau lộ qua vòm,
│ ▓▓▓▓▓▓│   sau     │▓▓▓▓▓▓▓ │    vòm nở dần theo scrub
│ ▓▓▓▓▓▓└───────────┘▓▓▓▓▓▓▓ │
└────────────────────────────┘
```
**Timeline (scrub, ghim 100svh):**
| progress | Hành động |
|---|---|
| 0 → 0.15 | Viền vòm vàng A6 vẽ ra ở giữa (kích thước 40% × 50% màn) |
| 0.15 → 0.9 | Section sau (`absolute`, cùng khung ghim) `clip-path: inset(25% 30% 25% 30% round 9999px 9999px 12px 12px) → inset(0% 0% 0% 0% round 0)`; section trước `scale 1 → 1.08`, `opacity 1 → 0.4` |
| 0.9 → 1 | Viền vòm `opacity → 0`, thả ghim |

⚠️ `clip-path` không thuộc nhóm "chỉ transform/opacity" của spec §7. Chấp nhận vì là trọng tâm concept và chỉ có 3 lần (C1 + 2 lần này); nếu fps < 50 trên mobile thì thay bằng vòm SVG `mask` `scale` (transform). Ghi rõ lựa chọn khi review.
**Reduced-motion:** không ghim, section sau hiện bằng fade 0.3s.

---

### C5 + C11 · Ngày cưới (khối onyx)

```
┌────────────────────────────┐
│ ┌────────────────────────┐ │  ← khối onyx, trên cùng bo vòm
│ │  ╭──────────────────╮  │ │
│ │  │  THÁNG MƯỜI MỘT  │  │ │  ← gold-light
│ │  │       14         │  │ │  ← 104px gold ánh kim
│ │  │  THỨ BẢY · 2026  │  │ │
│ │  ├──────────────────┤  │ │
│ │  │ T2 T3 T4 T5 T6 T7 CN│ │  ← lịch chữ #E9E4DC
│ │  │  9 10 11 12 13 ⓮ 15│ │  ← vòng tròn gold quanh ngày
│ │  ├──────────────────┤  │ │
│ │  │ 45 │ 06 │ 12 │ 33│  │ │  ← A7, phân cách bằng gạch gold
│ │  │NGÀY GIỜ PHÚT GIÂY│  │ │
│ │  ╰──────────────────╯  │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Nội dung:** tên tháng tiếng Việt viết hoa; tuần bắt đầu Thứ Hai; đếm ngược tới `date` ⚠️. Đã qua → *"CHÚNG TÔI ĐÃ VỀ CHUNG MỘT NHÀ"*.
**Animation:** số 14 đếm 1 → 14 (0.8s, `snap`), lấp lánh 1 lần. Vòng tròn gold A6 0.9s. A7 lật số. Chữ lịch `#E9E4DC` trên `onyx` khoảng 14:1 ✅.

---

### C12 · Lịch trình zigzag

```
┌────────────────────────────┐
│        LỊCH TRÌNH          │
│              │             │
│   ĐÓN KHÁCH  ◉(ly)         │  ← chữ bên trái, icon trên trục
│      17:00   │             │
│              │             │
│         (nhẫn)◉  LÀM LỄ    │  ← chữ bên phải
│              │   18:00     │
│              │             │
│   KHAI TIỆC  ◉(đĩa)        │
│      18:30   │             │
│              │             │
│         (nhạc)◉  GIAO LƯU  │
│              │   20:00     │
│              ◆             │
└────────────────────────────┘
```
**Nội dung (viết sẵn):** 4 mốc, giờ suy ra từ `date` (đón khách = tiệc −1h, lễ = tiệc, khai tiệc = +30′, giao lưu = +2h; mặc định tiệc 18:00). Mỗi mốc thêm 1 dòng mô tả 13px, ví dụ "Chụp ảnh lưu niệm cùng cô dâu chú rể".
**Animation:** trục vàng A6 theo scrub. Icon vòng tròn `scale 0 → 1` (0.5s `power3.out`) khi trục vẽ tới. Chữ trượt vào từ phía của nó (`x: ∓24 → 0`) + fade.
**Mobile < 340px:** giữ zigzag nhưng thu cột chữ còn 42% mỗi bên, chữ 13px.

---

### C6 + C7 · Hai lễ + bản đồ

```
┌────────────────────────────┐
│ ╭──────────╮ ╭──────────╮  │  ← 2 vòm cạnh nhau (1 cột trên mobile)
│ │ LỄ VU QUY│ │ TIỆC CƯỚI│  │
│ │  08:00   │ │  18:00   │  │
│ │ Tư gia   │ │{venue.   │  │
│ │ nhà gái  │ │  name}   │  │
│ │{bride.   │ │          │  │
│ │ address} │ │          │  │
│ └──────────┘ └──────────┘  │
│ ╭────────────────────────╮ │
│ │  <MapEmbed/> trong vòm │ │  ← MapEmbed bọc khung vòm, 4:5
│ └────────────────────────┘ │
│   [ CHỈ ĐƯỜNG ]            │  ← nút onyx, chữ gold-light
└────────────────────────────┘
```
**Animation:** hai vòm A1 so le 0.12s. Khung bản đồ A3 hình vòm. `MapEmbed` mount khi cách viewport < 1 màn hình.
**Edge case:** thiếu `venue.name` → "Trung tâm tiệc cưới".

### C13 · Dress code

```
┌────────────────────────────┐
│        DRESS CODE          │
│   Trang trọng · Black tie  │
│    ◯     ◯     ◯     ◯     │  ← #FFFFFF(viền) #E9E4DC #B08D57 #1F1F1F
│  Trắng  Kem  Vàng  Đen     │
└────────────────────────────┘
```
Chấm màu là vòng tròn viền gold 1px, `scale 0 → 1` stagger 0.1.

---

### C8 · Hành lang vòm (album, T5)

```
┌────────────────────────────┐
│   KHOẢNH KHẮC              │
│ ╭────╮ ╭────╮ ╭────╮ ╭──   │  ← dãy vòm nằm ngang, trượt
│ │img3│ │img4│ │img5│ │im   │    theo cuộn dọc (A5)
│ │    │ │    │ │    │ │     │
│ └────┘ └────┘ └────┘ └──   │
│  ◆──────●─────────◆        │  ← thanh tiến độ vàng
└────────────────────────────┘
```
**Hành vi:** ghim section, `x: -(scrollWidth - innerWidth)` theo scrub (A5). Ảnh `images[3..6]` (4 vòm), mỗi vòm rộng `68vw` (mobile) / `28vw` (desktop). Mỗi ảnh có `data-speed`-kiểu parallax nhẹ bên trong vòm (`xPercent -8 → 8` khi vòm đi qua). Bấm → A10 lightbox.
**Reduced-motion:** không ghim; thay bằng `overflow-x-auto snap-x` tự vuốt.
**Accessibility:** ảnh là `<button>`; `alt="Ảnh cưới 1/4"`.

---

### C14 · Mừng cưới

```
┌────────────────────────────┐
│        MỪNG CƯỚI           │
│  Sự hiện diện của quý khách│
│  là niềm vinh hạnh của     │
│  gia đình chúng tôi.       │
│ ╭────────╮  ╭────────╮     │  ← QR trong vòm nhỏ ⚠️
│ │  QR    │  │  QR    │     │
│ └────────┘  └────────┘     │
│  NHÀ TRAI     NHÀ GÁI      │
└────────────────────────────┘
```
Bấm QR → A10. QR là ảnh mẫu ⚠️, có chú thích *"Mã QR minh hoạ"*.

### C15 · Xác nhận tham dự (chỉ UI)

```
┌────────────────────────────┐
│    XÁC NHẬN THAM DỰ        │
│  Kính mong quý khách phản  │
│  hồi trước ngày 01.11      │  ← = date − 13 ngày ⚠️
│  ──────────────────────    │  ← input chỉ gạch chân gold
│  Họ và tên                 │
│  ◯ Tôi sẽ tham dự          │
│  ◯ Rất tiếc, tôi vắng mặt  │
│  Số khách  [ 1 ▾ ]         │
│  [   GỬI XÁC NHẬN   ]      │  ← nút onyx
│  Bản xem thử — không gửi.  │
└────────────────────────────┘
```
**Hành vi:** gửi → form fade, hiện *"Trân trọng cảm ơn {tên}."* + monogram nhỏ. Không gửi dữ liệu.

### C10 · Lời cảm ơn

```
┌────────────────────────────┐
│    ╭──────────────╮        │
│   │  images[n-1]   │       │  ← vòm
│   └────────────────┘       │
│  Sự hiện diện của quý khách│
│  là niềm vinh hạnh cho gia │
│  đình chúng tôi.           │
│        Q  │  H             │  ← monogram 64px, lấp lánh
│   MINH QUÂN  &  THU HÀ     │
└────────────────────────────┘
```
**Animation:** ảnh A3 vòm; monogram A6 vẽ lại (đảo C1) rồi lấp lánh lần cuối.

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | C2 vòm bìa | 3:4 |
| `images[1]` | C3 chú rể | 4:5 |
| `images[2]` | C3 cô dâu | 4:5 |
| `images[3..6]` | C8 hành lang vòm | 3:4 |
| `images[7]` (= `n-1`) | C10 ảnh cuối | 3:4 |

`meta.media = { images: 8, videos: 0 }`

Trường chưa chốt ⚠️: `date`; tên bố mẹ (4 trường); QR mừng cưới. Fallback như mô tả ở từng section.

---

## 7. Asset cần chuẩn bị
- [ ] SVG: viền vòm kép (1 path, co giãn bằng `vector-effect="non-scaling-stroke"`), hình thoi ◆, 6 icon lịch trình nét vàng, 3–4 gân vân đá lớn
- [ ] Monogram: path chữ cái Cormorant cho 29 chữ cái Việt in hoa (A…Y, gồm Đ) — xuất outline từ font bằng `opentype.js` 1 lần, lưu `glyphs.ts` (SIL OFL cho phép) → để A6 vẽ nét bất kỳ chữ cái đầu nào
- [ ] `music.mp3` (Pixabay) + `CREDITS.md`
- [ ] 8 ảnh studio tông trắng/kem ≤ 300KB `.webp`
- [ ] `thumb.webp` 600×800: monogram trong vòm trên nền đá
- [ ] `opengraph-image.png` 1200×630

## 8. Tiêu chí nghiệm thu riêng
- [ ] Không chữ nào màu `gold` dưới 24px (dùng `gold-deep`); kiểm bằng axe/Lighthouse
- [ ] Monogram đúng với mọi tên, kể cả tên gọi bắt đầu bằng "Đ" hoặc có dấu ("Ánh" → "A")
- [ ] Vòm mở (T4) ≥ 50fps trên điện thoại tầm trung; nếu không đạt, dùng phương án mask/scale
- [ ] Bố cục đối xứng: trục giữa các section lệch ≤ 1px ở 360 / 768 / 1440
- [ ] Thiếu tên bố mẹ thì C3 vẫn cân đối, không có dòng trống

---

## 9. Triển khai code

### 9.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/marble-2d/
├── meta.ts
├── layout.tsx                 # Cormorant_Garamond (300,600 + italic) + Montserrat (300,500)
├── page.tsx                   # return <MarbleInvite />
└── _components/
    ├── marble-invite.tsx      # "use client" — tokens `t`, ghép section
    ├── marble-texture.tsx     # nền vân đá fixed (SVG filter, render 1 lần)
    ├── monogram.tsx           # C1 + C10, nhận initials, vẽ bằng DrawSVG
    ├── glyphs.ts              # outline chữ cái in hoa
    ├── initials.ts            # tên → chữ cái đầu tên gọi (bỏ dấu, giữ Đ)
    ├── arch.tsx               # khung vòm viền kép dùng chung (children = ảnh/nội dung)
    ├── arch-gate.tsx          # T4 vòm mở (scrub, ghim) — nhận `from`, `to` children
    ├── gold-text.tsx          # chữ ánh kim + lấp lánh
    ├── sections/
    │   ├── cover.tsx          # C2
    │   ├── now-playing.tsx    # C16
    │   ├── families.tsx       # C3
    │   ├── date.tsx           # C5 + C11
    │   ├── schedule.tsx       # C12 zigzag
    │   ├── events.tsx         # C6 + C7
    │   ├── dress.tsx          # C13
    │   ├── gallery.tsx        # C8 (A5)
    │   ├── gift.tsx           # C14
    │   ├── rsvp.tsx           # C15
    │   └── thanks.tsx         # C10
    └── svg/
```

### 9.2 Tokens
```ts
export const t = {
  root: "relative min-h-svh bg-[#F7F5F2] text-[#2A2A2A] font-(family-name:--font-body) font-light",
  display: "font-(family-name:--font-display)",
  heading: "font-(family-name:--font-display) font-semibold uppercase tracking-[0.3em] text-[15px] sm:text-[17px] text-[#8A6A3B]",
  arch: "rounded-t-full rounded-b-2xl border border-[#B08D57]",
  gold: "bg-[linear-gradient(110deg,#8A6A3B_0%,#B08D57_35%,#E4CFA0_50%,#B08D57_65%,#8A6A3B_100%)] bg-[size:250%_100%] bg-clip-text text-transparent",
  onyx: "bg-[#1F1F1F] text-[#E9E4DC]",
  soft: "text-[#6E6A64]",
  btn: "inline-flex h-12 items-center justify-center bg-[#1F1F1F] px-8 text-xs font-medium uppercase tracking-[0.25em] text-[#E4CFA0]",
} as const;
```

### 9.3 Vòm mở T4
```tsx
// arch-gate.tsx (rút gọn)
const ARCH = (i: number) => `inset(${i * 25}% ${i * 30}% ${i * 25}% ${i * 30}% round 9999px 9999px 12px 12px)`;
useGSAP(() => {
  if (reduced) return;
  gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "+=100%", pin: true, scrub: true } })
    .from(".arch-line", { drawSVG: "50% 50%", duration: 0.15 })
    .fromTo(".to-layer", { clipPath: ARCH(1) }, { clipPath: ARCH(0), ease: "power3.inOut", duration: 0.75 }, 0.15)
    .to(".from-layer", { scale: 1.08, opacity: 0.4, duration: 0.75 }, 0.15)
    .to(".arch-line", { opacity: 0, duration: 0.1 });
}, { scope: root, dependencies: [reduced] });
```
GSAP nội suy được `clip-path: inset(... round ...)` khi hai đầu cùng cấu trúc — giữ đúng số giá trị ở cả `from` và `to`.

### 9.4 Chữ ánh kim lấp lánh
Lấp lánh = dịch `background-position` từ `100%` → `0%`. Đây là thuộc tính không phải transform/opacity ⚠️, nên:
- Chỉ áp cho **tối đa 2 phần tử cùng lúc** (tên C2, monogram/số ngày), chạy 1.2s, mỗi 4–6s một lần; chữ ánh kim tĩnh vẫn đẹp khi không chạy.
- Dùng GSAP: `gsap.fromTo(el, { backgroundPosition: "100% 0" }, { backgroundPosition: "0% 0", duration: 1.2, ease: "power2.inOut", repeat: -1, repeatDelay: 4 })`, dừng khi ra khỏi viewport (`ScrollTrigger` `toggleActions: "play pause resume pause"`).
- Reduced-motion: không lấp lánh.
Không cần keyframes trong `globals.css`.

### 9.5 Monogram
`initials(name)`: lấy từ cuối, ký tự đầu, `normalize("NFD")` bỏ dấu (**trừ** `Đ/đ` giữ nguyên thành `Đ`), viết hoa. `glyphs[ch]` trả `d` của path. `monogram.tsx` render 2 path + gạch đứng giữa, DrawSVG `0% → 100%` 1.6s, sau đó `fill-opacity 0 → 1`.

### 9.6 Logic cần test
- `initials`: "Minh Quân" → Q, "Thu Hà" → H, "Trần Đức" → Đ, "Nguyễn Thị Ánh" → A, chuỗi rỗng → "·".
- `rsvpDeadline(date)` = `date − 13 ngày`, định dạng `dd.MM`.
- `scheduleTimes(date)`, lưới lịch tuần bắt đầu Thứ Hai.
File: `marble-2d/_components/initials.test.ts`, `dates.test.ts`.

### 9.7 Thứ tự làm
1. `meta.ts`, `layout.tsx`, `page.tsx`, tokens, `marble-texture.tsx` → nền đúng
2. `arch.tsx` + các section tĩnh, khớp wireframe; kiểm đối xứng ở 3 kích thước
3. `glyphs.ts`, `initials.ts` + test, `monogram.tsx`
4. C1 mở vòm + nhạc
5. `arch-gate.tsx` (T4 scrub), đo fps sớm để quyết định clip-path hay mask
6. Zigzag C12, hành lang vòm C8 (A5)
7. Chữ ánh kim, reduced-motion, tên dài, thiếu bố mẹ
8. Checklist template-spec §12
