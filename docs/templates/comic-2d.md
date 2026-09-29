# 2D-15 · `comic-2d` · Truyện Tranh

> **Design Read:** Đọc là thiệp cưới truyện tranh pop-art cho cặp đôi playful, ngôn ngữ panel viền mực, chấm halftone và bong bóng thoại, nghiêng về mỹ học comic-print rực rỡ nhưng lưới chặt chẽ.
>
> **Dials:** `DESIGN_VARIANCE 8/10` · `MOTION_INTENSITY 6/10` · `VISUAL_DENSITY 3/10`.

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md).

---

## 1. Concept

**Một câu:** Thiệp là một **cuốn truyện tranh pop art "Số đặc biệt"** kể chuyện hai nhân vật chính đi tới đám cưới: bìa bật chữ "POW!", mỗi trang chia panel, lời kể nằm trong bong bóng thoại và hộp dẫn truyện.

**Cảm xúc muốn gợi:** hài hước, năng lượng, tự trào. Khách đọc thiệp như đọc truyện, cười ở từng khung.

**Phù hợp với:** cặp đôi vui tính, fan truyện tranh/siêu anh hùng, tiệc trẻ trung. Ảnh cưới biểu cảm, tạo dáng lầy.

**Khác các mẫu khác ở chỗ:**
- Bố cục là **lưới panel không đều** (1 panel to + 2 nhỏ, 3 panel ngang…), mỗi trang một kiểu lưới — không có "cột nội dung ở giữa".
- Chuyển trang bằng **lật trang giấy T7** (`rotateY` quanh gáy trái), ghim theo cuộn.
- Trong 1 trang, panel hiện **giật cục theo `steps()`** như khung hình hoạt hình, không mượt — cố ý.
- Ảnh được lọc **halftone chấm Ben-Day** bằng lớp phủ gradient + `mix-blend-multiply`.

**Moodboard:** Roy Lichtenstein, chấm Ben-Day, viền đen dày, chữ SFX "POW! BAM! WOW!", bong bóng thoại trắng đuôi nhọn, hộp dẫn truyện vàng, tia tốc độ, giấy truyện ngả vàng.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `paper` | `#FFF9E6` | Nền trang truyện |
| `panel` | `#FFFFFF` | Nền panel, bong bóng thoại |
| `red` | `#E63946` | SFX, nền panel nhấn, chấm Ben-Day đỏ |
| `blue` | `#1D3557` | Nền bìa, nút, panel đêm |
| `sky` | `#A8DADC` | Chấm Ben-Day xanh, nền panel phụ |
| `yellow` | `#FFD60A` | Hộp dẫn truyện, nền SFX |
| `ink` | `#111111` | Viền panel 3px, chữ chính |

Tương phản: `ink` trên `panel` 18.9:1 ✅; `ink` trên `yellow` ~14:1 ✅; chữ trắng trên `blue` ~12.6:1 ✅; chữ trắng trên `red` ~4.0:1 → chỉ cho chữ ≥ 24px (SFX, tiêu đề Bangers); chữ nhỏ trên `red` phải dùng `ink` (~4.7:1 ✅).

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| SFX / tên trên bìa | Bangers | 56px / 0.95 | 104px | Viền chữ `[-webkit-text-stroke:2px_#111]` + bóng cứng `4px 4px 0 #111` |
| Tiêu đề trang ("CHƯƠNG 2") | Bangers, tracking 0.05em | 32px | 44px | |
| Bong bóng thoại / dẫn truyện | Nunito 800 VIẾT HOA (giới hạn 2 font nên không thêm font viết tay) | 15px / 1.35 | 17px | Chữ in hoa kiểu letterer truyện |
| Nội dung dài (địa chỉ, form) | Nunito 600 | 16px / 1.5 | 17px | Không viết hoa để dễ đọc địa chỉ |
| Nhãn nhỏ | Nunito 900, VIẾT HOA | 12px | 13px | |

Bangers và Nunito có subset `vietnamese`. **Cần kiểm kỹ Bangers với dấu chồng** (*"NGUYỄN THỊ HẰNG"*) — Bangers rất cao và hẹp, dấu hai tầng dễ đè dòng trên: dùng `leading-[1.15]` tối thiểu cho chữ có dấu, và tên cặp đôi đặt trong khối riêng có `pt-2`.

### Hình khối và chất liệu
- **Panel**: `border-[3px] border-[#111] rounded-none bg-white`, khoảng cách giữa panel (gutter) 10px, bóng cứng `shadow-[6px_6px_0_#111]`.
- **Ben-Day**: `bg-[radial-gradient(#E63946_28%,transparent_30%)] bg-[size:10px_10px]` (hoặc `sky`) làm nền panel nhấn.
- **Halftone ảnh**: ảnh `grayscale contrast-125` + lớp phủ `bg-[radial-gradient(#111_30%,transparent_32%)] bg-[size:6px_6px] mix-blend-multiply opacity-30`, và lớp màu `bg-[#E63946] mix-blend-screen opacity-20` → giả in 2 màu.
- **Bong bóng thoại**: `rounded-[50%]` hoặc `rounded-3xl`, viền 3px, đuôi nhọn là SVG tam giác nhỏ đặt `absolute`. Hộp dẫn truyện: chữ nhật `yellow` viền 3px, ở góc trên-trái **của panel** (không phải góc màn hình).
- **SFX**: chữ Bangers trong khung nổ (SVG ngôi sao 12 cánh răng cưa) màu `yellow`/`red`.
- **Tia tốc độ**: `repeating-conic-gradient` từ tâm, `ink` alpha 0.15.
- **Motion**: panel xuất hiện dùng ease `steps(3)` (giật 3 khung); SFX dùng `back.out(2)`; lật trang `power2.inOut`. Vào 0.45s.

---

## 3. Nhạc

- **Tâm trạng**: nhạc hoạt hình vui nhộn, pizzicato/kèn/xylophone, nhịp nhanh, không lời.
- **Tempo**: 120–140 BPM. **Độ dài**: 1:30–2:30, lặp (nhạc hoạt hình dễ gây mệt → chọn bài có đoạn nhẹ, âm lượng 0.5 thay vì 0.6).
- **Từ khoá Pixabay**: `funny cartoon upbeat`, `comedy playful pizzicato`, `quirky happy cartoon`
- **Hành vi**: bắt đầu khi bấm "MỞ TRUYỆN!" (C1), fade 0 → 0.5 trong 1.5s. Ẩn tab dừng.

---

## 4. Cấu trúc trang

```
┌───────────────────────────┐
│ C1  Bìa "Số đặc biệt"      │ 100svh  (cố định tới khi mở)
├───────────────────────────┤  Mỗi TRANG được ghim, panel hiện theo
│ Trang 1  C2  Nhân vật chính│  scrub, cuối trang lật T7 sang trang sau.
│ Trang 2  C3  Hai gia đình  │  Mỗi trang ≈ 180svh cuộn (100 đọc + 80 lật)
│ Trang 3  C4  Chuyện tình   │  (4 panel)
│ Trang 4  C5+C11 Ngày cưới  │
│ Trang 5  C6+C12 Kế hoạch   │
│ Trang 6  C7  Địa điểm      │
│ Trang 7  C8  Album (6 panel)│
│ Trang 8  C13+C14+C15       │  (trang "phụ lục")
│ Bìa sau  C10 "HẾT… mà chưa │  100svh, không ghim
│          hết!"             │
└───────────────────────────┘
```

Khổ trang: `w-[min(94vw,520px)] aspect-[2/3] max-h-[88svh]` căn giữa; trên desktop hiển thị như cuốn truyện mở (trang trái là trang đã lật mờ đi, trang phải là trang hiện tại). Nền ngoài trang: `blue` + tia tốc độ.

**Lưới panel từng trang (360px, định nghĩa bằng `grid-template-areas` arbitrary):**
| Trang | Lưới |
|---|---|
| 1 | 1 panel lớn trên (ảnh bìa) + 2 panel dưới |
| 2 | 2 panel dọc cạnh nhau + 1 panel ngang dưới |
| 3 | 4 panel so le (Z) |
| 4 | 1 panel "splash" toàn trang |
| 5 | 3 panel ngang xếp dọc |
| 6 | 1 panel ngang + 1 panel lớn (bản đồ) |
| 7 | lưới 2×3 |
| 8 | 3 panel không đều |

---

## 5. Chi tiết từng section

### C1 · Bìa truyện (màn mở thiệp)

**Wireframe (360px):**
```
┌────────────────────────────┐
│ ┌────────────────────────┐ │
│ │SỐ ĐẶC BIỆT  #1  2026 ⚠️│ │  ← dải tiêu đề đỏ trên cùng
│ │ ╔════════════════════╗ │ │
│ │ ║ HÔN LỄ CỦA         ║ │ │  ← Bangers 40px, vàng viền đen
│ │ ║ THẾ KỶ!            ║ │ │
│ │ ║  images[0]         ║ │ │  ← ảnh halftone, tia tốc độ phía sau
│ │ ║  (halftone)        ║ │ │
│ │ ║ ✸POW!✸             ║ │ │  ← SFX nổ bật ra
│ │ ╚════════════════════╝ │ │
│ │ MINH QUÂN & THU HÀ     │ │  ← h1 Bangers 36px
│ │ [ MỞ TRUYỆN! ]         │ │  ← nút vàng viền đen, bóng cứng, 52px
│ └────────────────────────┘ │
└────────────────────────────┘
```

**Animation vào:**
| t | Hành động |
|---|---|
| 0.0s | Bìa `scale 0.9 → 1` (`steps(3)`, 0.3s) |
| 0.2s | Tia tốc độ xoay chậm `rotate 0 → 360` (40s, lặp, `ease: none`) |
| 0.4s | "HÔN LỄ CỦA THẾ KỶ!" bật từng từ `scale 0 → 1.2 → 1` (`back.out(2)`, stagger 0.12) |
| 0.9s | **"POW!"** nổ: `scale 0 → 1.4 → 1`, `rotate -20 → -8` (0.4s) + màn hình rung `x: ±4` 3 lần (0.15s) |
| 1.2s | Nút bật lên; lặp: nút lắc nhẹ `rotate ±3°` mỗi 3s |

**Khi bấm (tổng 1.4s):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc bắt đầu |
| 0.0s | SFX mới **"BAM!"** thay POW (0.25s) |
| 0.2s | Bìa lật T7: `rotateY 0 → -160°` quanh mép trái (`perspective-[1600px]`, 0.9s, `power2.inOut`), mặt sau bìa là `blue` |
| 0.6s | Trang 1 (dưới bìa) chạy timeline vào |
| 1.2s | Mở khoá cuộn |

**Reduced-motion:** không rung, không lật; bìa fade 0.3s.
**Edge case:** tên > 22 ký tự: 26px, 2 dòng; tên 50 ký tự: 20px, có thể 3 dòng, khối tên co giãn chiều cao (bìa `aspect-[2/3]` nhưng `min-h` thay vì `h` cố định).

---

### Trang 1 · C2 Nhân vật chính

```
┌────────────────────────────┐
│ ┌────────────────────────┐ │
│ │▌DẪN TRUYỆN: Ở một      │ │  ← hộp vàng
│ │ thành phố nọ, có hai   │ │
│ │ người sắp làm một việc │ │
│ │ trọng đại…             │ │
│ └────────────────────────┘ │
│ ┌──────────┐┌────────────┐ │
│ │ MINH     ││ THU HÀ     │ │  ← 2 panel nhân vật: tên Bangers
│ │ QUÂN     ││            │ │     + nhãn "NHÂN VẬT CHÍNH #1/#2"
│ │ ○ chấm đỏ││ ○ chấm xanh│ │     nền Ben-Day
│ └──────────┘└────────────┘ │
│  ( TRÂN TRỌNG KÍNH MỜI! )  │  ← bong bóng thoại từ panel phải
│  ( 14.11.2026 ⚠️ nhé! )     │
└────────────────────────────┘
```
**Nội dung:** hộp dẫn truyện viết sẵn như trên; `{groom.name}`, `{bride.name}`; bong bóng: "TRÂN TRỌNG KÍNH MỜI BẠN TỚI ĐÁM CƯỚI TỤI MÌNH!" + ngày.
**Animation (scrub trong trang):** hộp dẫn truyện → panel trái → panel phải → bong bóng, mỗi cái `clip-path inset(0 100% 0 0) → inset(0)` với `ease: steps(3)` (A3 kiểu giật).

---

### Trang 2 · C3 Hai gia đình

```
┌────────────────────────────┐
│ ┌──────────┐ ┌──────────┐  │
│ │images1   │ │images2   │  │  ← halftone, 2 panel dọc
│ │ (Nói:    │ │ (Nói:    │  │
│ │ "Nhà anh │ │ "Còn nhà │  │  ← bong bóng thoại
│ │  ở đây!")│ │  em nè!")│  │
│ └──────────┘ └──────────┘  │
│ ┌────────────────────────┐ │
│ │ NHÀ TRAI: {groom.addr} │ │  ← panel ngang, chữ Nunito 600 thường
│ │ NHÀ GÁI:  {bride.addr} │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```
Tên bố mẹ ⚠️ → ẩn. Địa chỉ dài: panel ngang tự cao lên (không cố định chiều cao).

---

### Trang 3 · C4 Chuyện tình (4 panel)

| Panel | Ảnh | Hộp dẫn / thoại (viết sẵn) | SFX |
|---|---|---|---|
| 1 | `images[3]` | Dẫn: "CHƯƠNG 1: CUỘC GẶP GỠ ĐỊNH MỆNH" · Thoại nam: "Xin lỗi, chỗ này có ai ngồi chưa?" | — |
| 2 | `images[4]` | Dẫn: "VÀI THÁNG SAU…" · Thoại nữ: "Anh lại tới muộn!" | **HỨ!** |
| 3 | `images[5]` | Dẫn: "MỘT BUỔI TỐI NỌ…" · Thoại nam: "Em đồng ý chứ?" | **BA-DUM!** |
| 4 | tia tốc độ + chữ | Thoại nữ (to): "ĐỒNG Ý!!!" | **WOW!** |

Lưới Z: panel 1 trái-trên, 2 phải, 3 trái-dưới, 4 ngang dưới cùng.
**Animation:** từng panel `steps(3)`; SFX bật `back.out(2)` sau panel 0.1s.

---

### Trang 4 · C5 + C11 Ngày cưới (splash page)

```
┌────────────────────────────┐
│ ✸✸ tia tốc độ đỏ-vàng ✸✸    │
│   NGÀY TRỌNG ĐẠI!          │  ← Bangers 40px
│      ┌──────────┐          │
│      │ 14.11    │          │  ← Bangers 96px trong khung nổ
│      │ 2026     │          │
│      └──────────┘          │
│ (CÒN 45 NGÀY 06 GIỜ 12 PHÚT│  ← bong bóng thoại chứa đếm ngược
│  NỮA THÔI!)                │
│ ┌T2 T3 T4 T5 T6 T7 CN────┐ │  ← lịch nhỏ trong panel góc
│ │ … 13 (✸14) 15 …        │ │     ngày cưới là khung nổ nhỏ đỏ
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Animation:** khung nổ "14.11" zoom `scale 3 → 1` (`steps(4)`) + rung trang. Đếm ngược A7. Qua ngày: bong bóng "TỤI MÌNH CƯỚI RỒI! HẾT PHẦN 1!".

---

### Trang 5 · C6 + C12 Kế hoạch tác chiến

```
┌────────────────────────────┐
│ ┌──────────────────────────┐│
│ │ 08:00 LỄ VU QUY          ││  ← panel 1: icon nhẫn, {bride.address}
│ └──────────────────────────┘│
│ ┌──────────────────────────┐│
│ │ 17:00 ĐÓN KHÁCH · 18:00  ││  ← panel 2
│ │ LỄ THÀNH HÔN             ││
│ └──────────────────────────┘│
│ ┌──────────────────────────┐│
│ │ 18:30 KHAI TIỆC · 20:00  ││  ← panel 3: SFX "CHEERS!"
│ │ QUẨY!                    ││
│ └──────────────────────────┘│
└────────────────────────────┘
```
Giờ từ `date` (−1h/0/+30′/+2h), vu quy 08:00 viết sẵn. Dẫn truyện: "KẾ HOẠCH TÁC CHIẾN NGÀY Đ".

---

### Trang 6 · C7 Địa điểm

```
┌────────────────────────────┐
│ ┌────────────────────────┐ │
│ │▌ĐỊA ĐIỂM BÍ MẬT…       │ │  ← hộp dẫn
│ │ … {venue.name}!        │ │
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │ <MapEmbed>             │ │  ← panel lớn, viền 3px, không halftone
│ │                        │ │
│ └────────────────────────┘ │
│   [ ➜ CHỈ ĐƯỜNG! ]          │  ← nút bong bóng vàng
└────────────────────────────┘
```
Mount `<MapEmbed>` khi trang 5 bắt đầu lật. Thiếu `venue.name` → "NHÀ HÀNG TIỆC CƯỚI".

---

### Trang 7 · C8 Album (lưới 2×3)

6 ô: `images[3..7]` (5 ảnh) + ô thứ 6 là panel chữ "CÒN NỮA…" (xem §6). 3 ảnh đầu trùng C4 nhưng khác lọc: ở album ảnh **màu thật, không halftone** — dẫn truyện: "PHẦN NGOẠI TRUYỆN: ẢNH MÀU!".
**Hành vi:** bấm panel → A10 lightbox (ảnh màu, nền `ink` 90%, nút đóng trên-giữa), ← → và Esc.
**Animation:** 6 panel hiện theo thứ tự đọc truyện (trái→phải, trên→dưới), `steps(3)` stagger 0.15.

---

### Trang 8 · C13 + C14 + C15 Phụ lục

```
┌────────────────────────────┐
│┌──────────────┐┌──────────┐│
││ TRANG PHỤC:  ││ QR ⚠️     ││  ← dress code + QR nhà trai
││ Mặc màu tươi!││ nhà trai ││
││ ● ● ● ●      │└──────────┘│
│└──────────────┘┌──────────┐│
│                │ QR ⚠️     ││
│                │ nhà gái  ││
│                └──────────┘│
│┌──────────────────────────┐│
││ PHIẾU ĐĂNG KÝ NHÂN VẬT   ││  ← RSVP
││ Tên: [__________]        ││
││ [ THAM GIA! ] [ VẮNG ]   ││
││ Số người [ - 1 + ]       ││
││ [ GỬI! ]                 ││
││ Bản xem thử — không gửi đi││
│└──────────────────────────┘│
└────────────────────────────┘
```
Dress code màu: `#E63946 #1D3557 #FFD60A #FFFFFF` — *"Rực rỡ như bìa truyện!"*.
**Hành vi:** QR bấm phóng to. Gửi → SFX "ĐÃ NHẬN!" nổ và bong bóng *"Hẹn gặp {tên} ở chương tiếp theo!"*. Không gửi đi đâu.
Trang 8 **không lật tiếp** — hết ghim, cuộn thường sang bìa sau.

---

### C10 · Bìa sau

```
┌────────────────────────────┐
│  HẾT…                      │  ← Bangers 56px
│    …MÀ CHƯA HẾT!           │
│ ┌────────────────────────┐ │
│ │ images[n-1] halftone   │ │
│ └────────────────────────┘ │
│ (Cảm ơn bạn đã đọc tới     │  ← bong bóng
│  trang cuối! Đón xem tập 2:│
│  "Cuộc sống hôn nhân"!)    │
│ MINH QUÂN & THU HÀ         │
│ ▮▮▌▌▮ mã vạch  GIÁ: 1 NỤ CƯỜI│  ← chi tiết bìa sau truyện
└────────────────────────────┘
```
**Animation:** "…MÀ CHƯA HẾT!" bật sau 0.5s; confetti hình SFX nhỏ (★ ✸) A8 18 hạt, 1 lần, tắt khi reduced-motion.

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | C1 bìa | 3:4 |
| `images[1]`, `images[2]` | Trang 2 | 2:3 |
| `images[3..5]` | Trang 3 (halftone) | 4:3 / 1:1 |
| `images[3..7]` | Trang 7 album (màu) | 1:1 |
| `images[7]` (= `n-1`) | C10 bìa sau | 3:4 |

`meta.media = { images: 8, videos: 0 }` (như bản tóm tắt). Với 8 ảnh, album trang 7 = `images[3..7]` (5 ảnh) + 1 ô panel chữ "CÒN NỮA…" ở ô thứ 6 → lưới vẫn 2×3. C10 = `images[7]` trùng ảnh cuối album — chấp nhận (bìa sau là halftone).

`date` ⚠️ (số phát hành "#1 2026" và trang 4), tên bố mẹ ⚠️, QR ⚠️. Không dùng `birthYear`.

## 7. Asset cần chuẩn bị
- [ ] SVG: khung nổ 12 cánh (2 kiểu), đuôi bong bóng (4 hướng), icon nhẫn/ly/đĩa, mã vạch
- [ ] Halftone, Ben-Day, tia tốc độ: gradient Tailwind (không ảnh)
- [ ] `music.mp3` + `CREDITS.md`
- [ ] 8 ảnh mẫu biểu cảm (Unsplash) ≤ 300KB `.webp`
- [ ] `thumb.webp` 600×800: bìa với "POW!"
- [ ] `opengraph-image.png`

## 8. Tiêu chí nghiệm thu riêng
- [ ] Lật trang T7 theo scrub, cuộn ngược lật ngược, 60fps; mặt sau trang không nháy (dùng `backface-hidden`)
- [ ] Panel hiện đúng thứ tự đọc truyện; chữ trong panel đọc được ngay khi panel hiện hết (không bị cắt bởi steps)
- [ ] Bangers với tên có dấu 2 tầng không đè dòng; tên 50 ký tự không tràn bìa
- [ ] Halftone không làm chữ phủ lên ảnh kém tương phản (chữ không đè trực tiếp lên ảnh; bong bóng có nền trắng)
- [ ] Reduced-motion: không ghim, không lật, không rung, trang xếp dọc
- [ ] Màn hình rung chỉ ≤ 0.2s và tối đa 2 lần trong toàn thiệp

---

## 9. Triển khai code

### 9.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/comic-2d/
├── meta.ts                    # styles ["playful"], colors ["red","blue"], media {8,0}
├── layout.tsx                 # Bangers + Nunito (vietnamese)
├── page.tsx
└── _components/
    ├── comic-invite.tsx       # "use client" — tokens t, SmoothScroll, ghép
    ├── cover-gate.tsx         # C1 + SFX + lật bìa
    ├── book.tsx               # vùng ghim, danh sách <Page>, điều khiển lật T7 + panel steps
    ├── page.tsx               # 1 trang: prop `grid` (grid-areas) + children <Panel>
    ├── panel.tsx              # viền, Ben-Day tuỳ chọn, halftone tuỳ chọn
    ├── balloon.tsx            # bong bóng thoại (prop tail) + caption box
    ├── sfx.tsx                # khung nổ + chữ
    ├── pages/                 # p1-heroes … p8-appendix
    ├── back-cover.tsx         # C10
    ├── album-slots.ts         # chia images vào 6 ô (thiếu → ô chữ "CÒN NỮA…")
    └── album-slots.test.ts
```
Lưu ý tên file `page.tsx` trong `_components` không bị Next coi là route (nằm trong thư mục `_`), nhưng để tránh nhầm, đặt là `comic-page.tsx`.

### 9.2 Tokens
```ts
export const t = {
  root: "min-h-screen bg-[#1D3557] text-[#111] font-(family-name:--font-body)",
  page: "bg-[#FFF9E6] border-[3px] border-[#111] p-2.5 grid gap-2.5",
  panel: "relative overflow-hidden border-[3px] border-[#111] bg-white shadow-[6px_6px_0_#111]",
  sfx: "font-(family-name:--font-display) text-[#FFD60A] [-webkit-text-stroke:2px_#111] [text-shadow:4px_4px_0_#111] leading-[1.15]",
  caption: "bg-[#FFD60A] border-[3px] border-[#111] px-2 py-1 text-[15px] font-extrabold uppercase leading-[1.35]",
  balloon: "relative bg-white border-[3px] border-[#111] rounded-3xl px-3 py-2 text-[15px] font-extrabold uppercase",
  benday: "bg-[radial-gradient(#E63946_28%,transparent_30%)] bg-[size:10px_10px]",
  halftone: "pointer-events-none absolute inset-0 bg-[radial-gradient(#111_30%,transparent_32%)] bg-[size:6px_6px] mix-blend-multiply opacity-30",
  btn: "min-h-12 bg-[#FFD60A] border-[3px] border-[#111] px-6 font-(family-name:--font-display) text-2xl shadow-[4px_4px_0_#111] active:translate-x-1 active:translate-y-1 active:shadow-none",
} as const;
```
`[-webkit-text-stroke:…]` là arbitrary property Tailwind, hợp lệ theo spec §5.

### 9.3 Cuốn truyện: panel steps + lật trang
```tsx
// book.tsx (rút gọn)
useGSAP(() => {
  if (reduced) return;
  const pages = gsap.utils.toArray<HTMLElement>(".comic-page");
  gsap.set(pages, { zIndex: (i) => pages.length - i, transformOrigin: "0% 50%", transformPerspective: 1600 });
  const tl = gsap.timeline({
    scrollTrigger: { trigger: root.current, pin: true, scrub: 0.5, end: () => `+=${pages.length * 1.8 * innerHeight}` },
  });
  pages.forEach((page, i) => {
    const panels = page.querySelectorAll(".panel, .balloon, .caption");
    tl.fromTo(panels, { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0% 0 0)", ease: "steps(3)", stagger: 0.25, duration: 0.3 });
    tl.to({}, { duration: 0.6 });                                  // dừng để đọc
    if (i < pages.length - 1)
      tl.to(page, { rotationY: -165, duration: 0.8, ease: "power2.inOut" });
  });
}, { scope: root, dependencies: [reduced] });
```
- Mỗi trang có `[backface-visibility:hidden]`; mặt sau là 1 div con xoay 180° màu `paper` tối hơn.
- `clip-path` không phải `transform/opacity` → **ngoại lệ có chủ đích** (A3 trong thư viện chung cũng dùng clip-path); giữ số phần tử animate cùng lúc ≤ 6.

### 9.4 SFX nổ + rung
```ts
export const pow = (el: Element, shakeTarget: Element) =>
  gsap.timeline()
    .fromTo(el, { scale: 0, rotation: -20 }, { scale: 1, rotation: -8, duration: 0.4, ease: "back.out(2)" })
    .to(shakeTarget, { x: 4, duration: 0.05, repeat: 3, yoyo: true, ease: "none" }, "<0.1")
    .set(shakeTarget, { x: 0 });
```
Không gọi rung khi reduced-motion.

### 9.5 Logic cần test
- `album-slots.ts`: `albumSlots(images, from=3, slots=6)` → mảng 6 phần tử, thiếu thì `null` (hiện ô "CÒN NỮA…"); test với 8, 10, 4 ảnh.
- Giờ kế hoạch từ `date`, lưới lịch: dùng helper chung.

### 9.6 Thứ tự làm
1. Khung file, tokens, font → kiểm Bangers với dấu 2 tầng ở 360px
2. `panel`, `balloon`, `sfx`, `comic-page` + 8 trang tĩnh xếp dọc (= bản reduced-motion)
3. `cover-gate.tsx` + nhạc + POW
4. `book.tsx`: ghim + panel steps + lật trang
5. Album lightbox, RSVP
6. Bìa sau + confetti
7. Reduced-motion, tên dài, Lighthouse
8. Checklist template-spec §12
