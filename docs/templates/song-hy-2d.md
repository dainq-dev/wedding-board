# 2D-06 · `song-hy-2d` · Song Hỷ

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md).

---

## 1. Concept

**Một câu:** Hai cánh cửa gỗ son đỏ có chữ Song Hỷ mở ra, khách bước vào không gian lễ cưới truyền thống Việt: đỏ thắm, vàng kim, mây lành trôi hai bên, và từng nghi lễ (Vu Quy, Thành Hôn, tiệc) được trình bày trang trọng như thiệp in giấy đỏ.

**Cảm xúc muốn gợi:** trang trọng, sum vầy, may mắn, "đúng lễ". Người lớn tuổi xem cũng thấy quen và vừa ý.

**Phù hợp với:** gia đình coi trọng nghi lễ; cặp đôi muốn một thiệp dùng được cho cả họ hàng; cưới tại tư gia + nhà hàng.

**Khác các mẫu khác ở chỗ:**
- **Màn mở là cánh cửa** (T6: hai cánh `rotateY` ±100° rồi zoom xuyên qua khung cửa).
- **Nền đỏ, nội dung đặt trên "tấm thiệp giấy kem"** có viền hoa văn vàng; hai bên là **mây lành parallax** (A4) trôi suốt trang.
- **Hai lễ riêng dùng địa chỉ nhà gái/nhà trai** đúng phong tục (Vu Quy tại nhà gái, Thành Hôn tại nhà trai).
- **Lịch âm + lịch dương** cạnh nhau.
- Kết bằng **pháo giấy đỏ** (A8) khi tới lời cảm ơn.

**Moodboard:** chữ Hỷ đôi 囍 thếp vàng, cửa gỗ sơn son chạm mây, đèn lồng, hoa văn triện (回), giấy điều, mâm quả, mây cát tường.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `red` | `#9B1B1E` | Nền trang, cửa |
| `red-deep` | `#6B0F12` | Viền cửa, bóng, nền khối đậm |
| `paper` | `#FFF4E0` | Nền tấm thiệp nội dung |
| `paper-shade` | `#F7E6C4` | Khối phụ (lịch âm, QR) |
| `gold` | `#D4A24C` | Chữ Hỷ, viền hoa văn, trang trí |
| `gold-light` | `#F1D08A` | Chữ vàng trên nền đỏ |
| `ink` | `#4A1A0C` | Chữ chính trên nền kem |
| `ink-soft` | `#7A4A34` | Chữ phụ trên nền kem |

Tương phản: `ink` trên `paper` ≈ 13:1 ✅; `ink-soft` trên `paper` ≈ 6.5:1 ✅; `gold-light` trên `red` ≈ 5.6:1 ✅; `gold` trên `red` ≈ 3.5:1 ❌ → `gold` chỉ dùng cho trang trí/chữ ≥ 24px trên nền đỏ, chữ nhỏ dùng `gold-light`; `red` trên `paper` ≈ 7.8:1 ✅ (tiêu đề đỏ trên nền kem). Nút: nền `red`, chữ `paper` ≈ 7.8:1 ✅.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Noto Serif Display 600 | 36px / 1.15 | 60px | Trang trọng, không dùng chữ script |
| Tiêu đề lễ | Noto Serif Display 700, VIẾT HOA, tracking 0.12em | 22px | 30px | "LỄ VU QUY", màu `red` |
| Nhãn nhỏ | Noto Serif 500, VIẾT HOA, tracking 0.2em | 12px | 13px | "NHÀ TRAI", "ÂM LỊCH" |
| Nội dung | Noto Serif 400 | 16px / 1.7 | 18px | |
| Số lớn | Noto Serif Display 400 | 72px | 112px | Ngày |

Hai font có subset `vietnamese`. Chữ Hỷ 囍 **không** dùng font (Noto Serif không có chữ Hán trong subset vietnamese) → vẽ bằng **SVG path** riêng.

### Hình khối và chất liệu
- **Tấm thiệp**: `bg-[#FFF4E0] rounded-lg` + viền đôi vàng (`border-2 border-[#D4A24C]` và `outline outline-1 outline-offset-[-8px] outline-[#D4A24C]/60`), 4 góc có hoa văn triện SVG.
- **Mây lành**: 6 SVG mây (3 mỗi bên), `gold` opacity 0.35, `data-speed` 0.6–1.3 khác nhau.
- **Khung tròn**: ảnh chân dung trong vòng tròn viền vàng + vòng hoa văn ngoài.
- **Nền đỏ**: có hoa văn chìm (chữ Hỷ nhỏ lặp lại, opacity 0.05) bằng `bg-[url(...)]` SVG data-URI.
- **Motion**: ease `power2.out` 0.8s; cửa `power3.inOut`. Không nảy.

---

## 3. Nhạc

- **Tâm trạng**: hoà tấu nhạc cụ dân tộc vui, rộn ràng (sáo, đàn tranh, trống nhỏ), không lời.
- **Tempo**: 85–100 BPM. **Độ dài**: 2:00–3:00, lặp.
- **Từ khoá Pixabay**: `chinese wedding traditional instrumental`, `asian celebration festive`, `guzheng happy`
- **Hành vi**: phát khi bấm vào cửa (C1), âm lượng 0 → 0.6 trong 1.5s. Ẩn tab → dừng.
- ⚠️ Nhạc Pixabay thường mang màu Trung Hoa; ưu tiên bài có đàn tranh/sáo trúc nghe gần nhạc Việt. Chưa kiểm chứng có bài hoà tấu Việt phù hợp.

---

## 4. Cấu trúc trang

```
┌───────────────────────────┐
│ C1  Hai cánh cửa           │ 100svh  fixed → T6 mở cửa + zoom qua
├───────────────────────────┤  ☁ mây lành 2 bên suốt trang (A4)
│ C2  Lễ Thành Hôn + tên     │ 120svh  chữ Hỷ A6
│ C3  Hai khung tròn         │ 100svh
│ C6  Hai lễ: Vu Quy/Thành Hôn│ 140svh
│ C5+C11 Lịch âm & dương     │ 120svh
│ C12 Trình tự ngày cưới     │ 100svh
│ C7  Bản đồ khung mây       │ 100svh
│ C8  Lưới ảnh khung vàng    │ 140svh
│ C14 Mừng cưới              │  80svh
│ C10 Lời cảm ơn + pháo giấy │ 100svh
└───────────────────────────┘
```
Tất cả sau C1 là **T1**: mỗi tấm thiệp kem hiện bằng "mở cuộn": `clip-path: inset(0 50% 0 50%) → inset(0)` từ giữa ra (như trải cuộn thư pháp), 0.9s. Tấm thiệp rộng `min(90vw, 480px)`, nền đỏ + mây ở hai bên.

---

## 5. Chi tiết từng section

### C1 · Hai cánh cửa

**Wireframe (360px):**
```
┌────────────────────────────┐
│ ←(nút chung)        (♪)    │
│ ┌────────────┬───────────┐ │  ← khung cửa red-deep
│ │ ▦▦▦▦▦▦▦▦▦▦ │ ▦▦▦▦▦▦▦▦▦ │ │  ← chấn song trên
│ │            │           │ │
│ │     ╭──────┼──────╮    │ │
│ │     │     囍      │    │ │  ← chữ Hỷ SVG vàng, chia đôi theo 2 cánh
│ │     ╰──────┼──────╯    │ │
│ │    ●       │       ●   │ │  ← 2 vòng nắm cửa vàng
│ │ ▦▦▦▦▦▦▦▦▦▦ │ ▦▦▦▦▦▦▦▦▦ │ │
│ └────────────┴───────────┘ │
│   Minh Quân  ♦  Thu Hà     │  ← gold-light 20px, dưới cửa
│   Chạm vào cửa để vào      │  ← 13px
└────────────────────────────┘
```

**Animation vào:**
| t | Hành động |
|---|---|
| 0.0s | Cửa fade `opacity 0 → 1`, `scale 1.04 → 1` (0.8s) |
| 0.3s | Chữ Hỷ A6 vẽ viền vàng (1.2s) rồi fill `opacity 0 → 1` (0.4s) |
| 1.2s | Tên A1 |
| lặp | Vòng nắm cửa đung đưa `rotate ±6°` (A12, 2.4s) |

**Khi bấm (tổng 2.0s, có "Bỏ qua" không cần vì < 2s):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc phát |
| 0.0s | Vòng nắm cửa gõ 2 lần `rotate 0 → -20 → 0` (0.3s) |
| 0.3s | Hai cánh cửa mở: trái `rotateY 0 → -100°` (`origin-left`), phải `0 → 100°` (`origin-right`), `perspective-[1400px]`, 1.0s `power3.inOut`. Nửa chữ Hỷ đi theo từng cánh |
| 0.6s | Phía sau cửa: nền sáng ấm (radial `gold-light` → `red`) `opacity 0 → 1` |
| 1.2s | T6: cả khung cửa `scale 1 → 2.5`, `opacity → 0` (0.8s `power2.in`) — như bước qua cửa |
| 2.0s | Mở khoá cuộn, mây lành bắt đầu trôi |

**Reduced-motion:** crossfade 0.3s, không mở cánh 3D.

---

### C2 · Lễ Thành Hôn

**Wireframe:**
```
┌────────────────────────────┐
│☁ ┌──────────────────────┐ ☁│
│  │ ◰                  ◳ │  │  ← góc hoa văn triện
│  │        囍            │  │  ← Hỷ 64px, A6
│  │   LỄ THÀNH HÔN       │  │  ← red 22px
│  │ ÔNG … & BÀ …  ⚠️     │  │  ← tên bố mẹ nhà trai (nếu có)
│  │ ÔNG … & BÀ …  ⚠️     │  │  ← tên bố mẹ nhà gái (nếu có)
│  │  Trân trọng báo tin  │  │
│  │  lễ thành hôn của    │  │
│  │  con chúng tôi       │  │
│  │     Minh Quân        │  │  ← Noto Serif Display 36px
│  │        ♦             │  │
│  │      Thu Hà          │  │
│  │ ◱                  ◲ │  │
│  └──────────────────────┘  │
└────────────────────────────┘
```
**Nội dung:** "LỄ THÀNH HÔN"; câu *"Trân trọng báo tin lễ thành hôn của con chúng tôi"*; tên. **⚠️ Tên bố mẹ** chưa có trường (§8.2): khi chưa có → **ẩn hai dòng "Ông … & Bà …"** và đổi câu thành *"Trân trọng báo tin lễ thành hôn của chúng tôi"*; khi có → hiện 2 cột "NHÀ TRAI / NHÀ GÁI" mỗi cột 2 dòng.
**Animation:** tấm thiệp "mở cuộn" (clip-path từ giữa); chữ Hỷ A6; tên A2 theo `chars` stagger 0.03; góc hoa văn A6.

---

### C3 · Hai khung tròn

```
┌────────────────────────────┐
│  ┌──────────────────────┐  │
│  │  ╭────╮      ╭────╮  │  │  ← khung tròn viền vàng, vòng mây ngoài
│  │  │img1│  囍  │img2│  │  │     đường kính 120px (mobile)
│  │  ╰────╯      ╰────╯  │  │
│  │  CHÚ RỂ      CÔ DÂU  │  │
│  │ Minh Quân    Thu Hà  │  │  ← 22px
│  │ NHÀ TRAI     NHÀ GÁI │  │
│  │{groom.addr}{bride.a..}│ │  ← 14px, 3 dòng
│  └──────────────────────┘  │
└────────────────────────────┘
```
**Animation:** ảnh A3 dạng tròn: `clip-path: circle(0% at 50% 50%) → circle(50%)` (1.0s); vòng mây ngoài `rotate 0 → 30°` theo scrub (chậm). Chữ Hỷ nhỏ ở giữa `scale 0 → 1`.
**Mobile < 340px:** hai khung xếp dọc.

---

### C6 · Hai lễ

```
┌────────────────────────────┐
│  ┌──────────────────────┐  │
│  │     LỄ VU QUY        │  │
│  │  08:00 · Thứ Bảy     │  │
│  │  14.11.2026          │  │
│  │  (tức 25/9 năm Bính  │  │  ← ngày âm, tính tự động ⚠️ cần `date`
│  │   Ngọ)               │  │
│  │  Tại tư gia nhà gái  │  │
│  │  {bride.address}     │  │
│  └──────────────────────┘  │
│         ── ♦ ──            │
│  ┌──────────────────────┐  │
│  │    LỄ THÀNH HÔN      │  │
│  │  10:00 · Thứ Bảy     │  │
│  │  Tại tư gia nhà trai │  │
│  │  {groom.address}     │  │
│  └──────────────────────┘  │
└────────────────────────────┘
```
**Nội dung:** giờ viết sẵn (Vu Quy 08:00, Thành Hôn 10:00 cùng ngày `date`). Ngày âm lịch hiển thị kèm dạng *"tức ngày {d} tháng {m} năm {Can Chi}"*.
**Animation:** hai tấm lần lượt "mở cuộn" stagger 0.25; ♦ ở giữa `rotate 45 → 0`.
**Edge case:** Nhà trai và nhà gái cùng địa chỉ (hiếm) → vẫn hiển thị cả hai, không gộp.

---

### C5 + C11 · Lịch âm và dương

```
┌────────────────────────────┐
│  ┌──────────────────────┐  │
│  │ DƯƠNG LỊCH│ ÂM LỊCH  │  │  ← 2 cột, kẻ vàng giữa
│  │   THÁNG 11│ THÁNG 9  │  │
│  │     14    │   25     │  │  ← Noto Serif Display 72px / 56px
│  │   2026    │ BÍNH NGỌ │  │
│  │    THỨ BẢY           │  │
│  ├──────────────────────┤  │
│  │ T2 T3 T4 T5 T6 T7 CN │  │  ← lưới tháng dương; mỗi ô có số âm
│  │  9 10 11 12 13 [14]15│  │     nhỏ 9px góc dưới (ngày 1 âm tô đỏ)
│  │ 21 22 23 24 25 26 27 │  │  ← ngày cưới: ô tròn red, chữ paper
│  ├──────────────────────┤  │
│  │  CÒN 45 NGÀY 06 GIỜ  │  │  ← Countdown A7
│  └──────────────────────┘  │
└────────────────────────────┘
```
**Nội dung:** tính âm lịch từ `date` ⚠️ (fallback 14.11.2026 → giá trị âm tính bằng hàm, **không** hardcode). Qua ngày → *"Chúc mừng hạnh phúc trăm năm"*.
**Animation:** hai số lớn đếm lên (`snap: 1`, 0.8s); ô ngày cưới `scale 0 → 1` + vòng vàng A6; chữ số đếm ngược A7.
⚠️ Ví dụ "25/9 Bính Ngọ" trong wireframe là **minh hoạ**, chưa kiểm; giá trị thật do hàm `solarToLunar` tính.

---

### C12 · Trình tự ngày cưới

```
┌────────────────────────────┐
│  ┌──────────────────────┐  │
│  │  TRÌNH TỰ NGÀY VUI   │  │
│  │ 08:00 ◆ Lễ Vu Quy    │  │  ← trục dọc vàng, mốc hình thoi
│  │   │                  │  │
│  │ 10:00 ◆ Lễ Thành Hôn │  │
│  │   │                  │  │
│  │ 17:00 ◆ Đón khách    │  │
│  │   │                  │  │
│  │ 18:00 ◆ Khai tiệc    │  │
│  └──────────────────────┘  │
└────────────────────────────┘
```
**Nội dung:** viết sẵn; đón khách = giờ tiệc − 1h, khai tiệc = giờ tiệc (`date` ⚠️).
**Animation:** trục A6 scrub; mốc hình thoi `rotate 45°, scale 0 → 1` khi trục tới.

---

### C7 · Bản đồ khung mây

```
┌────────────────────────────┐
│  ┌──────────────────────┐  │
│  │     TIỆC CƯỚI        │  │
│  │  18:00 · Thứ Bảy     │  │
│  │  {venue.name}        │  │
│  │ ☁┌────────────────┐☁ │  │  ← mây vàng ôm 2 góc khung map
│  │  │ <MapEmbed> 4:3 │  │  │
│  │  └────────────────┘  │  │
│  │  [ Chỉ đường ]       │  │  ← nút red, chữ paper
│  └──────────────────────┘  │
└────────────────────────────┘
```
**Animation:** A1; mây 2 góc trượt vào `x: ±30 → 0`. MapEmbed lazy.

---

### C8 · Lưới ảnh khung vàng

```
┌────────────────────────────┐
│       ── KỶ NIỆM ──        │  ← gold-light trên nền đỏ
│ ┌──────────┐ ┌──────────┐  │
│ │ images[3]│ │ images[4]│  │  ← khung vàng 2px + viền trong kem 4px
│ └──────────┘ └──────────┘  │
│ ┌────────────────────────┐ │
│ │       images[0]        │ │  ← ảnh ngang tràn 2 cột
│ └────────────────────────┘ │
│ ┌──────────┐ ┌──────────┐  │
│ │ images[5]│ │ images[1]│  │
│ └──────────┘ └──────────┘  │
└────────────────────────────┘
```
**Hành vi:** bấm → A10 lightbox (nền `red-deep/95`).
**Animation:** A3 từng ảnh stagger 0.1; khung vàng A6 vẽ viền sau khi ảnh hiện.

---

### C14 · Mừng cưới

```
┌────────────────────────────┐
│  ┌──────────────────────┐  │
│  │     MỪNG CƯỚI        │  │
│  │ ┌───────┐ ┌───────┐  │  │  ← mỗi QR đặt trên "phong bao lì xì"
│  │ │  QR   │ │  QR   │  │  │     đỏ có chữ Hỷ nhỏ
│  │ │NHÀ TRAI│ │NHÀ GÁI│  │  │
│  │ └───────┘ └───────┘  │  │
│  └──────────────────────┘  │
└────────────────────────────┘
```
**Hành vi:** bấm phong bao → phong bao trượt xuống, QR trượt lên (0.5s); bấm lần nữa → A10 phóng to. QR mẫu ⚠️ (§8.3).

---

### C10 · Lời cảm ơn + pháo giấy

```
┌────────────────────────────┐
│  ┌──────────────────────┐  │
│  │  ╭──────────╮        │  │
│  │  │ img[n-1] │        │  │  ← khung tròn lớn
│  │  ╰──────────╯        │  │
│  │ Sự hiện diện của quý │  │
│  │ khách là niềm vinh   │  │
│  │ hạnh cho gia đình    │  │
│  │ chúng tôi.           │  │
│  │     囍                │  │
│  │ Minh Quân ♦ Thu Hà   │  │
│  └──────────────────────┘  │
└────────────────────────────┘
```
**Animation:** khi section vào 50%: A8 pháo giấy đỏ + vàng (30 mảnh desktop / 18 mobile), bắn từ 2 góc dưới lên rồi rơi (`physics`-giả: `y` với `power2.out` lên, `power1.in` xuống, `rotation` ngẫu nhiên), chỉ **1 lần**. Chữ Hỷ `scale 1.3 → 1` như đóng dấu.
**Reduced-motion:** không pháo giấy.

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | C8 ảnh ngang lớn + thumb | 3:2 |
| `images[1]` | C3 chú rể + C8 | 1:1 (crop tròn) |
| `images[2]` | C3 cô dâu | 1:1 (crop tròn) |
| `images[3..4]` | C8 | 3:4 |
| `images[5]` | C8 + C10 ảnh cuối | 1:1 |

`meta.media = { images: 6, videos: 0 }`. `sampleData` có 4 ảnh → **thêm 2 ảnh vào `public/sample/`**.

## 7. Asset cần chuẩn bị
- [ ] SVG: chữ Song Hỷ 囍 (1 path, tách được 2 nửa theo trục giữa), cửa gỗ (2 cánh + khung + chấn song), vòng nắm cửa, 3 kiểu mây lành, góc hoa văn triện, phong bao lì xì, hoa văn chìm nền
- [ ] `music.mp3` + `CREDITS.md`
- [ ] 6 ảnh mẫu tông ấm/đỏ ≤ 300KB `.webp`
- [ ] `qr-sample.svg`
- [ ] `thumb.webp` 600×800: cửa đỏ đang hé mở, `opengraph-image.png`

## 8. Tiêu chí nghiệm thu riêng
- [ ] Chữ Hỷ là SVG, hiển thị đúng trên mọi máy (không phụ thuộc font CJK)
- [ ] Ngày âm tính đúng: kiểm với ít nhất 5 ngày đã biết (Tết các năm 2024–2027, 1 tháng nhuận)
- [ ] Vu Quy dùng `bride.address`, Thành Hôn dùng `groom.address`
- [ ] Không có tên bố mẹ → C2 không để dòng trống
- [ ] Cửa mở ≤ 2s, mây parallax tắt khi reduced-motion
- [ ] Chữ `gold` không dùng cho chữ < 24px trên nền đỏ

---

## 9. Triển khai code

### 9.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/song-hy-2d/
├── meta.ts
├── layout.tsx                 # Noto_Serif_Display (--font-display) + Noto_Serif (--font-body), vietnamese
├── page.tsx                   # return <SongHyInvite />
└── _components/
    ├── song-hy-invite.tsx     # ghép, SmoothScroll, OpenGate, lớp mây
    ├── tokens.ts
    ├── lunar.ts               # solarToLunar(date) → { day, month, year, leap, canChi }
    ├── lunar.test.ts
    ├── doors.tsx              # C1 + T6
    ├── clouds.tsx             # mây 2 bên, data-speed
    ├── scroll-card.tsx        # tấm thiệp kem + hiệu ứng mở cuộn
    ├── confetti.tsx           # A8 pháo giấy 1 lần
    ├── sections/
    │   ├── ceremony-title.tsx # C2
    │   ├── couple.tsx         # C3
    │   ├── rituals.tsx        # C6
    │   ├── dual-calendar.tsx  # C5 + C11
    │   ├── program.tsx        # C12
    │   ├── venue.tsx          # C7
    │   ├── gallery.tsx        # C8
    │   ├── gift.tsx           # C14
    │   └── thanks.tsx         # C10
    └── svg/                   # hy.tsx, door.tsx, cloud.tsx, corner.tsx, lixi.tsx
```

### 9.2 Tokens
```ts
export const t = {
  root: "min-h-screen bg-[#9B1B1E] text-[#4A1A0C] font-(family-name:--font-body)",
  display: "font-(family-name:--font-display)",
  card: "rounded-lg bg-[#FFF4E0] border-2 border-[#D4A24C] outline outline-1 -outline-offset-8 outline-[#D4A24C]/60",
  title: "font-(family-name:--font-display) font-bold uppercase tracking-[0.12em] text-[#9B1B1E]",
  label: "text-xs font-medium uppercase tracking-[0.2em] text-[#7A4A34]",
  onRed: "text-[#F1D08A]",
  btn: "min-h-11 rounded-md bg-[#9B1B1E] px-6 text-[#FFF4E0]",
} as const;
```

### 9.3 Cửa mở (C1)
```tsx
const open = contextSafe(() => {
  music.play();
  gsap.timeline({ defaults: { ease: "power3.inOut" }, onComplete: onOpened })
    .to(".knocker", { rotate: -20, duration: 0.15, yoyo: true, repeat: 3 })
    .to(".door-l", { rotateY: -100, duration: 1 }, 0.3)          // origin-left, backface-hidden
    .to(".door-r", { rotateY: 100, duration: 1 }, 0.3)           // origin-right
    .to(".glow", { opacity: 1, duration: 0.8 }, 0.6)
    .to(".doorway", { scale: 2.5, autoAlpha: 0, duration: 0.8, ease: "power2.in" }, 1.2);
});
```
Khung cửa có `perspective-[1400px]` trên cha, mỗi cánh `transform-3d`.

### 9.4 Mở cuộn cho tấm thiệp
```tsx
// scroll-card.tsx
useGSAP(() => {
  if (reduced) return gsap.from(root.current, { autoAlpha: 0, duration: 0.3 });
  gsap.fromTo(root.current, { clipPath: "inset(0% 50% 0% 50%)" },
    { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power2.out",
      scrollTrigger: { trigger: root.current, start: "top 80%", once: true } });
}, { scope: root, dependencies: [reduced] });
```
(clip-path không phải transform — chạy 1 lần/section, 0.9s; chấp nhận, ghi chú trong code.)

### 9.5 Âm lịch
- Viết `lunar.ts` theo thuật toán thiên văn của Hồ Ngọc Đức (tính điểm sóc + trung khí, múi giờ **UTC+7**), khoảng 80 dòng, không thêm thư viện.
- `canChi(year)`: Can = `(year + 6) % 10`, Chi = `(year + 8) % 12` với bảng tên tiếng Việt.
- Test bắt buộc (`lunar.test.ts`): mùng 1 Tết 2024 = 10/02/2024, 2025 = 29/01/2025, 2026 = 17/02/2026, 2027 = 06/02/2027; 1 ngày thuộc tháng nhuận (năm 2025 có tháng 6 nhuận). **⚠️ Người code phải kiểm lại các mốc này với lịch vạn niên trước khi viết test** (chưa đối chiếu nguồn trong lúc viết spec).

### 9.6 Thứ tự làm
1. `meta.ts`, layout, tokens, thêm 2 ảnh mẫu
2. `lunar.ts` + test (làm sớm vì có rủi ro)
3. SVG chữ Hỷ, cửa, mây
4. Section tĩnh C2 → C10 trên `scroll-card`
5. C1 cửa + nhạc
6. Mây parallax, mở cuộn, lịch, pháo giấy, lightbox
7. Reduced-motion, tên dài, Lighthouse, checklist template-spec §12
