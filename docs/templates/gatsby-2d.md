# 2D-13 · `gatsby-2d` · Gatsby

> **Design Read:** Đọc là thiệp cưới Art Deco cho cặp đôi thích tiệc đêm sang trọng, ngôn ngữ nhung đỏ, vàng kim trên nền đen, nghiêng về mỹ học roaring-twenties đối xứng và tiết chế.
>
> **Dials:** `DESIGN_VARIANCE 8/10` · `MOTION_INTENSITY 6/10` · `VISUAL_DENSITY 2/10`.

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md).

---

## 1. Concept

**Một câu:** Một đêm dạ tiệc Art Deco thập niên 1920: rèm nhung kéo ra, khách bước vào sảnh đen–vàng kim, và mỗi thông tin đám cưới hiện lên như một **tấm biển sân khấu** trong khung hình học đối xứng.

**Cảm xúc muốn gợi:** sang trọng, lộng lẫy, hơi "điện ảnh". Khách thấy mình được mời tới một buổi tiệc có dress code.

**Phù hợp với:** cặp đôi cưới buổi tối ở khách sạn / ballroom, thích đen–vàng, ảnh cưới tương phản cao hoặc đen trắng.

**Khác các mẫu khác ở chỗ:** trang là **một sân khấu cố định**: mỗi section được ghim giữa màn hình và chuyển sang section sau bằng **quạt Art Deco mở ra** — một hình bán nguyệt gồm 9 nan vàng xoè từ đáy màn hình, che section cũ rồi thu lại để lộ section mới (biến thể T2 + T4). Không có thẻ trượt, không cuộn ngang; mọi chuyển động đối xứng qua trục giữa.

**Moodboard:** Chrysler Building, poster tiệc 1920s, sunburst vàng kim, gương mạ viền, rèm nhung đỏ đô, ly champagne coupe, lông vũ, ngọc trai, đèn chùm pha lê.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `bg` | `#0C0C0C` | Nền sân khấu |
| `surface` | `#161616` | Nền khung Art Deco, form |
| `gold` | `#D4AF37` | Màu chủ đạo: viền, nan quạt, tiêu đề, số |
| `gold-light` | `#F5E6B8` | Chữ chính (champagne) |
| `gold-dim` | `#8C7424` | Hoạ tiết nền mờ, đường kẻ phụ |
| `velvet` | `#5A0F1B` | Rèm nhung C1, điểm nhấn hiếm (trái tim lịch) |
| `pearl` | `#EDE8DF` | Chuỗi ngọc trai trang trí |
| `text-soft` | `#B8AD8A` | Chữ phụ |

Tương phản: `gold-light` trên `bg` khoảng 16:1 ✅. `gold` trên `bg` khoảng 9.4:1 ✅. `text-soft` trên `surface` khoảng 7.8:1 ✅. Chữ `bg` trên nút `gold` khoảng 9.4:1 ✅. `gold-dim` trên `bg` ≈ 4:1 → chỉ trang trí.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Playfair Display 400 italic | 40px / 1.1 | 72px | `gold-light`, không viết hoa |
| Tiêu đề section | Playfair Display 700, `font-variant: small-caps` (`[font-variant-caps:all-small-caps]`), tracking 0.25em | 18px | 22px | "Lễ Thành Hôn" |
| Số lớn | Playfair Display 400 | 88px | 140px | Chữ số oldstyle `[font-variant-numeric:lining-nums]` |
| Nội dung | Josefin Sans 300 | 16px / 1.7 | 18px | tracking 0.02em |
| Nhãn nhỏ | Josefin Sans 600, VIẾT HOA, tracking 0.3em | 11px | 12px | `gold` |

Cả hai đều có subset `vietnamese`. Josefin Sans có x-height thấp → nội dung không nhỏ hơn 16px. Kiểm dấu chữ nhỏ viết hoa: "LỄ THÀNH HÔN" với small-caps phải hiện đủ dấu.

### Hình khối và chất liệu
- **Khung Art Deco**: SVG đối xứng dùng chung (`<DecoFrame>`), viền đôi 1px + 3px `gold`, góc vát bậc thang 3 nấc, đỉnh có sunburst nhỏ. Không bo góc (`rounded-none`).
- **Sunburst nền**: `repeating-conic-gradient(from 0deg at 50% 100%, #D4AF37 0 1deg, transparent 1deg 10deg)` opacity 0.06, đặt đáy màn hình.
- **Ảnh**: khung vòm nhọn Art Deco (mask SVG hình "cửa sổ Chrysler"), lọc `grayscale(0.3) contrast(1.1)`; có lớp phủ `bg-gradient-to-t from-[#0C0C0C]` để chữ đè lên đạt tương phản.
- **Đường kẻ**: 3 vạch song song + hình thoi ở giữa.
- **Motion**: ease `power4.out` cho vào, `power4.inOut` cho quạt; thời lượng vào 1.0s. Không nảy. Mọi thứ xuất hiện **đối xứng từ trục giữa ra**.

---

## 3. Nhạc

- **Tâm trạng**: electro swing / jazz big band, kèn đồng, có nhịp để "nhún", không lời.
- **Tempo**: 115–128 BPM. **Độ dài**: 2:30–3:00, lặp.
- **Từ khoá Pixabay**: `electro swing 1920s`, `gatsby jazz party`, `vintage swing big band`
- **Hành vi**:
  - Bắt đầu khi bấm "Bước vào dạ tiệc" (C1), fade 0 → 0.6 trong 1.5s.
  - Nút nổi hình ly champagne coupe; đang phát thì có 3 bong bóng nhỏ bay lên (`animate-pulse` không đủ → dùng GSAP repeat).
  - Ẩn tab thì dừng.

---

## 4. Cấu trúc trang

```
┌───────────────────────────┐
│ C1  Rèm nhung + khung Deco │ 100svh  (cố định tới khi mở)
├───────────────────────────┤
│ C2  Tên cặp đôi            │ ┐
│ C3  Hai gia đình           │ │  "Sân khấu": 1 vùng ghim duy nhất,
│ C4  Chuyện tình (3 hồi)    │ │  mỗi section = 1 "màn", 100svh cuộn/màn.
│ C5+C11 Ngày + lịch         │ │  Giữa 2 màn: quạt vàng xoè che → thu lại (≈40svh)
│ C6+C12 Chương trình tối    │ │  Tổng ≈ 8 màn × 140svh ≈ 1120svh
│ C7  Địa điểm + bản đồ      │ │
│ C8  Phòng tranh (album)    │ │
│ C13 Dress code             │ ┘
│ C14+C15 Quà + RSVP         │ 110svh  (hết ghim, cuộn thường)
│ C10 Nâng ly (lời cảm ơn)   │ 100svh
└───────────────────────────┘
```

Nội dung mỗi màn nằm trong `<DecoFrame>` rộng `min(90vw, 460px)`, cao tối đa `86svh`, căn giữa. Desktop: hai cột trang trí đối xứng (cột Art Deco hình bậc thang) ở mép trái/phải giữa màn hình, không chạm các góc.

**Không có cuộn nội bộ trong màn.** Màn nào nhiều nội dung thì chia theo progress: C4 đổi 3 hồi, C8 đổi 2 lượt tranh; C7 giới hạn bản đồ 16:10 để vừa khung.

---

## 5. Chi tiết từng section

### C1 · Rèm nhung (màn mở thiệp)

**Wireframe (360px):**
```
┌────────────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓│▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  ← 2 nửa rèm velvet, nếp gấp = gradient dọc
│▓▓┌────────────────────┐▓▓▓│
│▓▓│   ╱╲  sunburst  ╱╲  │▓▓▓│  ← DecoFrame vàng đè giữa rèm
│▓▓│  YOU ARE INVITED   │▓▓▓│  ← thay bằng "TRÂN TRỌNG KÍNH MỜI"
│▓▓│    Minh Quân       │▓▓▓│  ← Playfair italic 32px
│▓▓│        &           │▓▓▓│
│▓▓│      Thu Hà        │▓▓▓│
│▓▓│  ◆ ─── 14.11.2026 ─── ◆│  ← ⚠️ date
│▓▓└────────────────────┘▓▓▓│
│▓▓ [ BƯỚC VÀO DẠ TIỆC ] ▓▓▓│  ← nút viền gold, chữ gold, 52px
└────────────────────────────┘
```

**Animation vào:**
| t | Hành động |
|---|---|
| 0.0s | Rèm fade in (0.4s) |
| 0.2s | Viền DecoFrame A6 vẽ đối xứng: 2 path trái/phải chạy từ đỉnh xuống đáy cùng lúc (1.4s, `power2.inOut`) |
| 0.9s | Sunburst `scale 0 → 1` từ đáy khung (0.8s) |
| 1.2s | "TRÂN TRỌNG KÍNH MỜI" A2 chars từ giữa ra (`stagger: { from: "center", each: 0.03 }`) |
| 1.5s | Tên fade + `letterSpacing 0.3em → 0` (0.9s) |
| 2.0s | Nút fade; viền nút có ánh kim chạy qua lặp 3s (gradient `x` dịch) |

**Khi bấm (tổng 2.2s):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc bắt đầu |
| 0.0s | DecoFrame `scale 1 → 1.08`, `opacity → 0` (0.6s) |
| 0.3s | Rèm trái `xPercent 0 → -100`, rèm phải `0 → 100`, kèm `skewY ±2°` tạo cảm giác vải (1.3s, `power4.inOut`) |
| 0.5s | Đèn chùm SVG hạ xuống từ trên `y: -100% → 0` (1.2s) rồi đứng đó làm trang trí trên C2 |
| 1.6s | Màn C2 bắt đầu timeline vào |
| 2.2s | Mở khoá cuộn |

Có nút **"Bỏ qua"** nhỏ (không cần — tổng < 2.5s và không chặn đọc nội dung vì C1 đã chứa tên + ngày).
**Reduced-motion:** không vẽ viền, rèm crossfade 0.3s.

---

### Cơ chế "sân khấu" và quạt Art Deco (dùng cho C2 → C13)

Tất cả màn nằm chồng lên nhau (`absolute inset-0`) trong 1 container ghim. Mỗi màn có 1 đoạn progress:
| Đoạn trong mỗi màn (140svh) | Việc |
|---|---|
| 0 → 0.15 | Quạt đang che (thu lại): 9 nan `rotate` từ đứng dựng → nằm ngang, lộ màn mới |
| 0.15 → 0.35 | Timeline vào của màn (không scrub, `play` khi qua mốc, `reverse` khi cuộn ngược) |
| 0.35 → 0.8 | Màn đứng yên để đọc (hoặc C4/C8 chạy nội dung con theo scrub) |
| 0.8 → 1 | Quạt xoè ra che màn hiện tại; ở 1.0 đổi `autoAlpha` màn cũ 0, màn mới 1 |

**Quạt:** SVG bán nguyệt tâm ở giữa đáy màn hình, 9 nan hình nêm màu `gold` xen `gold-dim`, bán kính = đường chéo màn hình. Nan thứ i xoay từ `-90°` (nằm dẹt bên trái) tới vị trí xoè `-80° + i*20°`, stagger `from: "center"` → xoè đối xứng. Dùng scrub nên cuộn ngược thì quạt thu ngược.

---

### C2 · Tên cặp đôi

```
┌────────────────────────────┐
│          ╽ đèn chùm         │
│   ┌──────────────────────┐ │
│   │ ╱╲ vòm Chrysler      │ │  ← images[0] trong mask vòm nhọn 3:4
│   │  ẢNH BÌA             │ │
│   ├──────────────────────┤ │
│   │ THE WEDDING OF       │ │  ← thay bằng "HÔN LỄ CỦA"
│   │   Minh Quân          │ │  ← h1, Playfair italic 40px
│   │  ◆  &  ◆             │ │
│   │     Thu Hà           │ │
│   │ THỨ BẢY · 14.11.2026 │ │
│   └──────────────────────┘ │
└────────────────────────────┘
```
**Nội dung:** "HÔN LỄ CỦA" · `{groom.name}` & `{bride.name}` · ngày ⚠️ `date`.
**Animation vào:** ảnh A3 nhưng mở từ giữa ra (`clip-path: inset(0 50% 0 50%) → inset(0)`, 1.1s, `power4.out`). Vạch ◆ A6 từ giữa ra. Tên A2 `lines`.

---

### C3 · Hai gia đình

```
┌────────────────────────────┐
│ ┌──────────┐◆┌──────────┐  │
│ │ images1  │ │ images2  │  │  ← 2 khung vòm đối xứng qua trục giữa
│ └──────────┘ └──────────┘  │
│  NHÀ TRAI  ║  NHÀ GÁI      │  ← vạch đôi dọc gold ở giữa
│  Minh Quân ║  Thu Hà       │  ← Playfair italic 22px
│  {address} ║  {address}    │  ← Josefin 15px, tối đa 3 dòng
└────────────────────────────┘
```
**Animation:** 2 ảnh trượt vào từ 2 mép `x: ∓60 → 0` cùng lúc (đối xứng), vạch giữa A6 từ trên xuống. Tên bố mẹ ⚠️ → ẩn.
**< 360px:** vẫn 2 cột nhưng ảnh 1:1 và tên 18px (giữ tính đối xứng — không chuyển 1 cột).

---

### C4 · Chuyện tình — "Ba hồi"

Trong 1 màn, đoạn progress 0.35 → 0.8 chia 3 phần; mỗi phần crossfade 1 hồi.
```
┌────────────────────────────┐
│        HỒI THỨ NHẤT         │  ← HỒI THỨ NHẤT / HAI / BA
│   ┌──────────────────┐     │
│   │   images[3+i]    │     │  ← khung bát giác, 1:1
│   └──────────────────┘     │
│   Gặp gỡ                    │
│   "Một buổi tối rực đèn,    │
│    giữa bao nhiêu người…"   │
│      ◇ ◆ ◇                  │  ← chỉ báo hồi
└────────────────────────────┘
```
**Lời viết sẵn:**
1. *Gặp gỡ* — "Một buổi tối rực đèn, giữa bao nhiêu người, ánh mắt ấy dừng lại ở nhau."
2. *Tương tư* — "Những lá thư, những cuộc gọi khuya, những điệu nhảy vụng về đầu tiên."
3. *Lời hứa* — "Dưới ánh đèn chùm, một chiếc nhẫn, một lời 'Đồng ý' — và bữa tiệc bắt đầu."

**Animation:** scrub; ảnh cũ `scale 1 → 1.05, autoAlpha → 0`, ảnh mới `scale 0.95 → 1`. Chỉ báo ◆ di chuyển.

---

### C5 + C11 · Ngày cưới và lịch

```
┌────────────────────────────┐
│    SAVE THE DATE           │  ← "XIN HÃY DÀNH NGÀY"
│  THỨ BẢY ║  14  ║ 2026     │  ← "14" Playfair 88px giữa 2 vạch đôi
│        THÁNG MƯỜI MỘT       │
│  ◆──────────────────────◆  │
│   45   06   12   33        │  ← đếm ngược, mỗi số trong ô thoi viền gold
│  NGÀY  GIỜ  PHÚT GIÂY       │
│ T2 T3 T4 T5 T6 T7 CN        │
│  …  12 13 ◈14◈ 15 …         │  ← ngày cưới: ô thoi velvet viền gold
└────────────────────────────┘
```
**Animation:** "14" đếm lên (0.8s, snap) cùng sunburst nhỏ sau số xoay `rotate 0 → 45`. Đếm ngược A7 mỗi giây. Đã qua ngày: *"Bữa tiệc đã diễn ra — cảm ơn vì đã cùng chúng tôi."*

---

### C6 + C12 · Chương trình tối

```
┌────────────────────────────┐
│     CHƯƠNG TRÌNH TỐI         │
│   17:00 ◆ Đón khách &       │
│           champagne         │
│   18:00 ◆ Lễ thành hôn      │
│   18:30 ◆ Khai tiệc         │
│   20:00 ◆ Khiêu vũ          │
│  ───────────────────────   │
│  LỄ VU QUY · 08:00          │  ← C6: lễ buổi sáng tại {bride.address}
│  {bride.address}            │
└────────────────────────────┘
```
**Nội dung:** giờ từ `date` (−1h/0/+30′/+2h), vu quy 08:00 viết sẵn.
**Animation:** trục dọc A6 từ trên; mỗi ◆ `scale 0 → 1, rotate 45` khi trục tới, dòng chữ trượt ra từ ◆ (`x: -12 → 0`).

---

### C7 · Địa điểm

```
┌────────────────────────────┐
│       ĐỊA ĐIỂM              │
│    {venue.name}             │  ← Playfair italic 26px
│ ┌────────────────────────┐ │
│ │  <MapEmbed> 16:10      │ │  ← viền đôi gold, ảnh bản đồ lọc
│ └────────────────────────┘ │     grayscale bằng class trên wrapper
│  [ ◆ CHỈ ĐƯỜNG ◆ ]          │  ← link maps dir, 48px
└────────────────────────────┘
```
**Lưu ý:** `<MapEmbed>` chỉ mount khi màn C7 sắp tới (progress màn trước > 0.5). Thiếu `venue.name` → "Sảnh tiệc".

---

### C8 · Phòng tranh (album)

Trong 1 màn, 3 khung tranh Art Deco treo đối xứng: 1 lớn giữa, 2 nhỏ hai bên. Progress 0.35 → 0.8 đổi bộ ảnh (images[3..8], 2 lượt × 3 ảnh).
```
┌────────────────────────────┐
│       PHÒNG TRANH           │
│ ┌───┐  ┌────────┐  ┌───┐   │
│ │ a │  │   b    │  │ c │   │  ← b 3:4 lớn, a/c 2:3 nhỏ, cao thấp đối xứng
│ └───┘  └────────┘  └───┘   │
│    Chạm để xem lớn          │
└────────────────────────────┘
```
**Hành vi:** bấm ảnh → A10 lightbox nền đen 95%, điều hướng ← → (phím mũi tên), đóng Esc; nút đóng ở trên-giữa. Đổi lượt: 3 khung lật `rotateY 0 → 90` (ảnh cũ) rồi `-90 → 0` (ảnh mới), stagger `from: "center"`.
**Reduced-motion:** lưới 2 cột 6 ảnh, không ghim.

---

### C13 · Dress code

```
┌────────────────────────────┐
│       DRESS CODE            │
│  Black tie · Lấp lánh 1920s │
│  Gợi ý: đầm sequin, vest    │
│  đen, phụ kiện ngọc trai    │
│   ◆     ◆     ◆     ◆       │  ← ô thoi màu
│  Đen   Vàng  Champagne Đô   │  ← #0C0C0C(viền) #D4AF37 #F5E6B8 #5A0F1B
└────────────────────────────┘
```
**Animation:** 4 ô thoi rơi vào từ trên theo cặp đối xứng (ngoài vào trong).

---

### C14 + C15 · Quà + RSVP (hết ghim)

```
┌────────────────────────────┐
│   HỘP QUÀ MỪNG CƯỚI         │
│ ┌─────────┐ ┌─────────┐    │
│ │ QR ⚠️    │ │ QR ⚠️    │    │  ← khung Deco nhỏ
│ │Nhà trai │ │Nhà gái  │    │
│ └─────────┘ └─────────┘    │
│   ─── ◆ ───                 │
│   LỜI HỒI ÂM               │
│  Quý danh [____________]    │  ← input viền dưới gold, nền surface
│  ◇ Hân hạnh tham dự         │
│  ◇ Tiếc không thể tới       │
│  Số khách [ 1 ▾ ]           │
│  [ GỬI LỜI HỒI ÂM ]         │
│  Bản xem thử — không gửi đi │
└────────────────────────────┘
```
**Hành vi:** QR bấm phóng to. Gửi → form fade, hiện *"Kính chờ {tên} tại dạ tiệc."* trong khung Deco. Không gửi đi đâu.

---

### C10 · Nâng ly

```
┌────────────────────────────┐
│    ┌──────────────┐        │
│    │ images[n-1]  │        │  ← vòm Chrysler
│    └──────────────┘        │
│   🥂  (2 ly coupe SVG)       │  ← cụng ly
│  Cảm ơn quý vị đã tới       │
│  và cùng chúng tôi nâng ly. │
│   Minh Quân & Thu Hà        │
│         ─ ◆ ─               │
└────────────────────────────┘
```
**Animation:** 2 ly nghiêng vào nhau `rotate ∓15 → ∓5` và "cụng" (`x` lại gần, 0.4s) khi vào view; bong bóng A8 (24 hạt, `gold-light` alpha 0.6, tròn 3–8px) bay lên từ miệng ly, lặp 6s rồi dừng hẳn (không vô hạn để tiết kiệm pin). Tắt khi reduced-motion.

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | C2 ảnh bìa | 3:4 |
| `images[1]`, `images[2]` | C3 | 3:4 |
| `images[3..5]` | C4 ba hồi, đồng thời lượt 1 của C8 | 1:1 / 3:4 |
| `images[6..8]` | C8 lượt 2 | 3:4 / 2:3 |
| `images[9]` (= `n-1`) | C10 | 3:4 |

`meta.media = { images: 10, videos: 0 }` (tăng từ 6 để phòng tranh đủ 2 lượt). Nếu muốn giữ 6 ảnh: C8 chỉ 1 lượt (`images[3..5]`) và C10 dùng `images[5]` — ghi rõ khi chốt.
`date` ⚠️, tên bố mẹ ⚠️, QR ⚠️. Không dùng `birthYear`.

## 7. Asset cần chuẩn bị
- [ ] SVG: DecoFrame (path trái/phải tách để vẽ đối xứng), quạt 9 nan, đèn chùm, sunburst, 2 ly coupe, cột bậc thang, mask vòm Chrysler, mask bát giác
- [ ] Rèm nhung: gradient Tailwind (không ảnh)
- [ ] `music.mp3` + `CREDITS.md`
- [ ] 10 ảnh mẫu tương phản cao / B&W (Unsplash) ≤ 300KB `.webp`
- [ ] `thumb.webp` 600×800: rèm hé, khung Deco với tên
- [ ] `opengraph-image.png`

## 8. Tiêu chí nghiệm thu riêng
- [ ] Quạt chuyển màn chạy theo scrub, cuộn ngược thu ngược, 60fps (chỉ `transform` trên 9 nan)
- [ ] Mọi thời điểm chỉ 1 màn có `autoAlpha 1` → trình đọc màn hình: màn ẩn có `aria-hidden` (dùng `autoAlpha` → `visibility:hidden` là đủ)
- [ ] Mọi chuyển động đối xứng qua trục giữa (review bằng mắt ở 360 và 1440)
- [ ] Reduced-motion: không ghim, các section xếp dọc, không quạt, không bong bóng
- [ ] Tab bàn phím tới nút trong màn đang ẩn không được (visibility hidden)
- [ ] Tên 50 ký tự không vượt DecoFrame

---

## 9. Triển khai code

### 9.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/gatsby-2d/
├── meta.ts                    # styles ["luxury","vintage"], colors ["black","gold"], media {10,0}
├── layout.tsx                 # Playfair_Display + Josefin_Sans (vietnamese)
├── page.tsx
└── _components/
    ├── gatsby-invite.tsx      # "use client" — tokens t, SmoothScroll, ghép
    ├── curtain-gate.tsx       # C1
    ├── stage.tsx              # vùng ghim, nhận mảng <Act>, điều khiển quạt + autoAlpha
    ├── fan.tsx                # SVG 9 nan, expose ref các nan
    ├── deco-frame.tsx         # khung dùng chung
    ├── acts/                  # c2-names, c3-families, c4-story, c5-date, c6-program,
    │                          # c7-venue, c8-gallery, c13-dress
    ├── gift-rsvp.tsx          # C14 + C15
    ├── toast.tsx              # C10
    ├── stage-math.ts          # actProgress(p, i, n) → {index, local}
    └── stage-math.test.ts
```

### 9.2 Tokens
```ts
export const t = {
  root: "min-h-screen bg-[#0C0C0C] text-[#F5E6B8] font-(family-name:--font-body) font-light",
  frame: "relative bg-[#161616] outline outline-1 outline-[#D4AF37] outline-offset-[6px] border-[3px] border-[#D4AF37] rounded-none",
  title: "font-(family-name:--font-display) font-bold [font-variant-caps:all-small-caps] tracking-[0.25em] text-[#D4AF37]",
  names: "font-(family-name:--font-display) italic",
  label: "text-[11px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]",
  btn: "min-h-12 border border-[#D4AF37] px-8 uppercase tracking-[0.3em] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0C0C0C] transition-colors",
  soft: "text-[#B8AD8A]",
  sunburst: "bg-[repeating-conic-gradient(from_0deg_at_50%_100%,#D4AF37_0_1deg,transparent_1deg_10deg)] opacity-[0.06]",
} as const;
```

### 9.3 Sân khấu + quạt
```tsx
// stage.tsx (rút gọn)
useGSAP(() => {
  if (reduced) return;
  const acts = gsap.utils.toArray<HTMLElement>(".act");
  const blades = gsap.utils.toArray<SVGElement>(".blade");
  gsap.set(acts, { autoAlpha: 0 }); gsap.set(acts[0], { autoAlpha: 1 });
  gsap.set(blades, { rotation: -90, transformOrigin: "50% 100%" });

  const tl = gsap.timeline({
    scrollTrigger: { trigger: root.current, pin: true, scrub: 0.6, end: () => `+=${acts.length * 1.4 * innerHeight}` },
  });
  acts.forEach((act, i) => {
    tl.addLabel(`act${i}`).to({}, { duration: 1 });              // đọc
    const next = acts[i + 1]; if (!next) return;
    tl.to(blades, { rotation: (k) => -80 + k * 20, stagger: { each: 0.04, from: "center" }, duration: 0.4, ease: "power4.inOut" })
      .set(act, { autoAlpha: 0 }).set(next, { autoAlpha: 1 })
      .to(blades, { rotation: 90, stagger: { each: 0.04, from: "center" }, duration: 0.4, ease: "power4.inOut" })
      .set(blades, { rotation: -90 });
  });
  // timeline vào từng màn: ScrollTrigger riêng dựa trên label không có sẵn → dùng tl.eventCallback("onUpdate")
  // + actProgress() để biết màn hiện tại, gọi enter[i].play() / reverse() khi đổi màn.
}, { scope: root, dependencies: [reduced] });
```
Nội dung "chạy theo scrub" trong màn (C4 3 hồi, C8 đổi lượt) thêm thẳng vào `tl` ở đoạn "đọc" của màn đó thay cho `to({}, {duration:1})`.

### 9.4 Rèm C1
```tsx
tl.current = gsap.timeline({ paused: true, defaults: { ease: "power4.inOut" } })
  .to(".deco-c1", { scale: 1.08, autoAlpha: 0, duration: 0.6 }, 0)
  .to(".curtain-l", { xPercent: -100, skewY: -2, duration: 1.3 }, 0.3)
  .to(".curtain-r", { xPercent: 100, skewY: 2, duration: 1.3 }, 0.3)
  .from(".chandelier", { yPercent: -100, duration: 1.2 }, 0.5)
  .call(onOpened);
```
Viền DecoFrame vẽ bằng `DrawSVGPlugin`: `gsap.from([".deco-l", ".deco-r"], { drawSVG: "0%", duration: 1.4 })`.

### 9.5 Logic cần test
- `stage-math.ts`: `actProgress(p, i, n)` — trả chỉ số màn hiện tại và progress cục bộ 0–1; test biên (p=0, p=1, đúng ranh giới quạt).
- Giờ chương trình từ `date` (−60/0/+30/+120) — nếu kit đã có helper chung thì dùng, không viết lại.

### 9.6 Thứ tự làm
1. Khung file, tokens, `DecoFrame`, font → kiểm dấu small-caps
2. Các màn tĩnh xếp dọc (chính là bản reduced-motion) khớp wireframe
3. `curtain-gate.tsx` + nhạc
4. `stage.tsx` + `fan.tsx`: ghim, quạt, autoAlpha; test `stage-math`
5. Timeline vào từng màn, C4/C8 scrub nội bộ
6. C14/C15, C10 bong bóng
7. Reduced-motion, a11y (màn ẩn), tên dài, Lighthouse
8. Checklist template-spec §12
