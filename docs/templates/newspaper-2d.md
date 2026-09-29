# 2D-19 · `newspaper-2d` · Báo Tin Vui

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md). Cấu trúc tài liệu theo mẫu chuẩn [letter-2d.md](./letter-2d.md).

---

## 1. Concept

**Một câu:** Một số báo đặc biệt của tờ *"Báo Tin Vui"* xoay tít vào màn hình như trong phim đen trắng xưa, dừng lại với dòng tít trang nhất: hai người sắp cưới nhau.

**Cảm xúc muốn gợi:** dí dỏm, hoài cổ, "chuyện của chúng tôi quan trọng tới mức lên báo". Giọng văn nửa trang trọng nửa đùa kiểu phóng sự cũ.

**Phù hợp với:** cặp đôi làm truyền thông/báo chí, thích đồ cổ, phim cũ, ảnh đen trắng; ảnh cưới phong cách film/tương phản cao.

**Khác các mẫu khác ở chỗ:** bố cục **dàn trang báo nhiều cột** (grid 6 cột trên desktop, 2 cột trên mobile), chữ dày đặc có kiểm soát, đường kẻ cột, tít chạy. Chuyển giữa các "trang báo" bằng **lật trang báo khổ lớn** (T7 theo trục dọc giữa, như gập tờ báo), còn bên trong một trang thì cuộn tự nhiên. Ảnh luôn **đen trắng lấm chấm (halftone) rồi chuyển màu** khi vào giữa màn hình.

**Moodboard:** trang nhất báo thập niên 1940, măng-sét chữ đậm có gạch đôi, ảnh in halftone, cột "Rao vặt", phiếu cắt dọc đường chấm có hình cái kéo, mực đen lem nhẹ, giấy ngả vàng, máy in chữ chì.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `desk` | `#EFE6D2` | Nền trang ngoài tờ báo (mặt bàn) |
| `paper` | `#F7F0E1` | Nền tờ báo |
| `paper-dark` | `#E8DDC5` | Khối nền phụ (hộp tin, rao vặt) |
| `ink` | `#1A1A1A` | Chữ, đường kẻ, măng-sét |
| `ink-soft` | `#4A443A` | Chú thích ảnh, byline |
| `red` | `#8B0000` | Nhấn hiếm: chữ "ĐẶC BIỆT", dấu tròn "TIN NÓNG", khoanh ngày |
| `rule` | `#1A1A1A` | Đường kẻ cột 1px, gạch đôi dưới măng-sét |

Tương phản: `ink` trên `paper` ≈ 16:1 ✅. `ink-soft` trên `paper` ≈ 8.9:1 ✅. `red` trên `paper` ≈ 9:1 ✅. Chữ `paper` trên `ink` ≈ 16:1 ✅.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Măng-sét "BÁO TIN VUI" | Playfair Display 900 | 44px / 1 | 96px | Chỉ 1 lần |
| Tít trang nhất (tên cặp đôi) | Playfair Display 900, VIẾT HOA | 34px / 1.05 | 72px | `<h1>` |
| Tít phụ | Playfair Display 700 italic | 20px / 1.2 | 30px | |
| Nhãn chuyên mục | Old Standard TT 700, VIẾT HOA, tracking 0.18em | 12px | 13px | "THỜI SỰ", "RAO VẶT" |
| Nội dung bài | Old Standard TT 400 | 16px / 1.55 | 17px | `text-justify` + `hyphens-auto`, chữ cái đầu to (drop cap) |
| Chú thích ảnh | Old Standard TT 400 italic | 13px | 14px | |

Hai font đều có subset `vietnamese`. `hyphens-auto` với `lang="vi"` gần như không tác dụng (tiếng Việt từ đơn âm ngắn) — chấp nhận, chỉ `text-justify` trên ≥ `sm`, mobile dùng `text-left` để tránh khoảng trắng lớn.

### Hình khối và chất liệu
- **Tờ báo**: rộng `min(96vw, 1100px)`, `radius 0`, bóng mảnh `shadow-[0_2px_0_#d8ccb2,0_20px_40px_-20px_rgba(26,26,26,0.4)]`, mép phải hơi răng cưa (mask) như xé khỏi xấp.
- **Lưới**: mobile 2 cột (`grid-cols-2 gap-x-4`, kẻ `divide-x`), desktop 6 cột. Mọi khối bám lưới.
- **Ảnh halftone**: lớp phủ `bg-[radial-gradient(#1A1A1A_1px,transparent_1.2px)] bg-[length:4px_4px] mix-blend-multiply` + ảnh `grayscale contrast-125`. Khi "in màu": lớp chấm fade còn 0.15 và `grayscale` về 0 (animate qua GSAP trên `filter`… xem ghi chú hiệu năng §9).
- **Vân giấy**: `<PaperGrain/>` opacity 0.06 + vài vệt ố vàng radial-gradient ở góc.
- **Đường kẻ**: 1px `ink` giữa cột; gạch đôi 3px+1px dưới măng-sét.
- **Motion**: ease chủ đạo `power2.out`. Vào 0.6s. Không nảy. Chuyển động "cơ khí", dứt khoát, ít phần tử cùng chuyển động.

---

## 3. Nhạc

- **Tâm trạng**: jazz/swing thập niên 1930–40, âm sắc radio cũ (có tiếng lạo xạo nhẹ), kèn trumpet tắt tiếng, piano stride, không lời.
- **Tempo**: 85–100 BPM. **Độ dài**: 2:00–3:00, lặp lại.
- **Từ khoá Pixabay**: `old jazz vintage radio`, `1940s swing`, `retro gramophone jazz`
- **Hành vi**:
  - Bắt đầu khi bấm "Mở báo" (C1), âm lượng 0 → 0.6 trong 1.5s.
  - C16 dựng thành mục "Làn sóng phát thanh" có nút ▶/❚❚ và đồng bộ nút nổi.
  - Ẩn tab thì tạm dừng.

---

## 4. Cấu trúc trang

Tờ báo có **3 "trang"**. Trong mỗi trang cuộn tự nhiên (T1). Giữa hai trang là **lật trang báo** (T7 biến thể, ghim ngắn 80svh).

```
┌───────────────────────────┐
│ C1  Tờ báo xoay vào        │ 100svh  (cố định tới khi bấm)
├═══════ TRANG 1 ═══════════┤
│ Măng-sét + C2 tít nhất     │ 100svh  ảnh images[0] halftone lớn
│ C3  "Chân dung hai nhân vật"│  90svh  2 cột, images[1], [2]
│ C4  Phóng sự chuyện tình   │ 140svh  bài 3 mốc, images[3..5]
├─── lật trang (T7) ────────┤  80svh ghim
├═══════ TRANG 2 ═══════════┤
│ C5+C11 "Lịch sự kiện"      │ 100svh  hộp ngày + lịch tháng
│ C12 Chương trình buổi lễ   │  70svh
│ C6+C7 Mục Thông báo        │ 140svh  hai lễ + bản đồ
│ C13 Chuyên mục thời trang  │  60svh
│ C16 Làn sóng phát thanh    │  50svh
├─── lật trang (T7) ────────┤  80svh ghim
├═══════ TRANG 3 ═══════════┤
│ C8  Ảnh phóng sự (album)   │ 200svh  masonry, BW → màu
│ C14 Hộp thư mừng cưới      │  70svh
│ C15 Phiếu cắt (RSVP)       │ 100svh
│ C10 Lời toà soạn           │ 100svh  gập báo lại
└───────────────────────────┘
```

Mỗi trang có dải đầu trang nhỏ: *"BÁO TIN VUI · Số đặc biệt · Thứ Bảy, 14.11.2026 · Trang 2"* (⚠️ ngày theo `date`), tránh góc trên-trái bằng `pl-16` trên mobile.

---

## 5. Chi tiết từng section

### C1 · Tờ báo xoay vào (màn mở thiệp)

**Mục đích:** hiệu ứng "tin nóng" kinh điển của phim cũ; bấm để mở nhạc và mở báo.

**Wireframe (360px):**
```
┌────────────────────────────┐
│  (nền desk, vignette tối)  │
│   ┌──────────────────┐     │
│   │ BÁO TIN VUI      │     │  ← tờ báo gập đôi, nghiêng 8°
│   │══════════════════│     │
│   │ QUÂN & HÀ        │     │  ← tít rút gọn, Playfair 900
│   │ SẮP CƯỚI!        │     │
│   │ ▒▒▒ ảnh ▒▒▒ ≡≡≡≡ │     │
│   └──────────────────┘     │
│                            │
│   ( ● TIN NÓNG )           │  ← dấu tròn đỏ
│   [ 📰 Mở báo ]            │  ← nút ink, chữ paper, 48px
│  Số đặc biệt · phát hành   │
│  ngày 14.11.2026           │
└────────────────────────────┘
```

**Nội dung:** mặt gập hiển thị măng-sét, tít *"{tên gọi chú rể} & {tên gọi cô dâu} SẮP CƯỚI!"*, ảnh `images[0]` halftone nhỏ. Nút *"Mở báo"*.

**Animation vào (1.4s, chạy 1 lần):**
| t | Hành động |
|---|---|
| 0.0s | Tờ báo `scale: 0 → 1`, `rotate: 720° → 8°` (1.2s, `power2.out`) |
| 0.0s | Lớp vignette + nhấp nháy khung phim (opacity 0.9 ↔ 1, 3 lần trong 0.6s) |
| 1.2s | Dấu "TIN NÓNG" đập xuống `scale 1.6 → 1` (0.25s) |
| 1.4s | Nút A1 |

**Khi bấm "Mở báo" (1.3s):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc bắt đầu |
| 0.0s | Tờ báo thẳng lại `rotate 8° → 0`, dời vào giữa (0.3s) |
| 0.3s | Mở gập: nửa trên `rotateX -180° → 0` quanh mép giữa (0.7s, `power2.inOut`, `perspective: 1600px`) |
| 0.8s | Tờ báo phóng lên đầy khung `scale → 1` theo chiều rộng tờ báo (0.5s) |
| 1.3s | Mở khoá cuộn, ScrollSmoother |

**Reduced-motion:** không xoay, không nhấp nháy; tờ báo fade in 0.3s; bấm là crossfade.
**Edge case:** tên gọi dài → tít trên mặt gập giảm 24px, tối đa 3 dòng, `break-words`.

---

### C2 · Trang nhất: măng-sét + tít chính

**Wireframe:**
```
┌────────────────────────────┐
│ Số đặc biệt   Giá: 1 nụ cười│  ← dòng trên măng-sét, 11px
│     BÁO TIN VUI            │  ← Playfair 900 44px
│════════════════════════════│
│ Thứ Bảy, 14.11.2026 · Hà Nội│
│────────────────────────────│
│ ĐẶC BIỆT (đỏ)              │
│ MINH QUÂN VÀ THU HÀ        │  ← <h1> 34px
│ CHÍNH THỨC VỀ CHUNG MỘT NHÀ│
│ Hai gia đình xác nhận tin  │  ← tít phụ italic
│ vui, hôn lễ dự kiến diễn ra│
│ vào cuối tuần này          │
│ ┌────────────────────────┐ │
│ │ ▒▒ images[0] halftone ▒ │ │  ← 4:3, full 2 cột
│ └────────────────────────┘ │
│ Ảnh: Phóng viên Tình Yêu   │  ← chú thích italic
│ ┌──────────┬─────────────┐ │
│ │ Q uân và │ …tiếp theo  │ │  ← 2 cột đoạn dẫn, drop cap
│ │ Hà vừa…  │  trang 2    │ │
│ └──────────┴─────────────┘ │
└────────────────────────────┘
```

**Nội dung viết sẵn (đoạn dẫn):** *"Sau nhiều năm bền bỉ bên nhau, anh {groom.name} và chị {bride.name} đã chính thức thông báo về hôn lễ của mình. Theo nguồn tin đáng tin cậy, cả hai sẽ trao nhau lời hứa trăm năm trước sự chứng kiến của gia đình và bạn bè. Toà soạn trân trọng kính mời quý độc giả tới chung vui. (Xem tiếp trang 2)"*. Dòng địa danh sau ngày = phần cuối của `bride.address` sau dấu phẩy cuối (vd "Hà Nội"); rỗng thì bỏ.

**Animation:**
| t | Hành động |
|---|---|
| 0.0s | Măng-sét A2 theo `chars` (từ dưới lên, mask) |
| 0.3s | Gạch đôi vẽ từ trái sang (A6, 0.5s) |
| 0.5s | Tít chính A2 theo `lines`, stagger 0.08 |
| 0.9s | Ảnh A3 (vẫn halftone đen trắng); in màu khi cuộn tới giữa màn hình (§9.4) |
| 1.1s | Đoạn dẫn A1 |

**Edge case:** tên 50 ký tự → tít `text-[26px]`, `break-words`; măng-sét không đổi.

---

### C3 · "Chân dung hai nhân vật"

```
┌────────────────────────────┐
│ NHÂN VẬT                   │
│┌────────────┬─────────────┐│
││ ▒ images[1]│ ▒ images[2] ││  ← halftone 4:5
││ Chú rể     │ Cô dâu      ││
││ MINH QUÂN  │ THU HÀ      ││  ← Playfair 700 20px
││ Nhà trai:  │ Nhà gái:    ││
││ Quận 1,    │ Ba Đình,    ││  ← address
││ TP.HCM     │ Hà Nội      ││
│└────────────┴─────────────┘│
│ "Anh ấy luôn đúng giờ, trừ │  ← trích dẫn vui, italic, viết sẵn
│  khi đi gặp cô ấy."        │
└────────────────────────────┘
```
**Nội dung:** tên, địa chỉ từ `useWedding()`. Tên bố mẹ (⚠️) nếu có → dòng *"Con ông … và bà …"*; không có thì ẩn. Trích dẫn vui viết sẵn, 1 câu mỗi bên.
**Animation:** đường kẻ giữa 2 cột vẽ từ trên xuống (A6, scrub); ảnh A3 stagger 0.15.
**Mobile < 360px:** vẫn 2 cột (ảnh nhỏ lại), vì bố cục song song là bản chất trang báo.

---

### C4 · Phóng sự chuyện tình (bài 3 mốc)

```
┌────────────────────────────┐
│ PHÓNG SỰ                   │
│ HÀNH TRÌNH TỪ NGƯỜI LẠ     │
│ ĐẾN NGƯỜI THƯƠNG           │  ← tít 22px
│ Bài: Toà soạn · Ảnh: …     │
│┌─────────┬────────────────┐│
││ ▒ ảnh 3 │ Chương 1: Gặp ││
││         │ Lần đầu gặp…   ││
│├─────────┴────────────────┤│
││ Chương 2: Thương         ││
││ …           ┌─────────┐  ││
││             │ ▒ ảnh 4 │  ││
││             └─────────┘  ││
│├──────────────────────────┤│
││ ┌─────────┐ Chương 3:    ││
││ │ ▒ ảnh 5 │ Cầu hôn …    ││
│└──────────────────────────┘│
└────────────────────────────┘
```
**Nội dung viết sẵn:**
- *Chương 1 — Gặp gỡ:* "Không ai ngờ một buổi chiều bình thường lại là khởi đầu của một câu chuyện dài. Họ gặp nhau, trò chuyện, và hẹn lần sau."
- *Chương 2 — Thương:* "Những lần hẹn sau dày dần lên. Người quen bắt đầu nhắc tên người này mỗi khi gặp người kia."
- *Chương 3 — Cầu hôn:* "Theo nhân chứng duy nhất có mặt, cô dâu đã đồng ý trước khi chú rể nói hết câu."
**Bố cục:** ảnh và chữ so le trái/phải theo lưới, mỗi chương có **trích dẫn nổi** (pull quote) chữ Playfair italic 20px giữa hai đường kẻ.
**Animation:** A1 cho từng chương; pull quote A2 `lines`.

---

### Lật trang (T7 · gập tờ báo)

**Cách làm:** ghim khu vực 80svh. Trang hiện tại (phần đang ở viewport — dùng một **ảnh chụp giả**: component `<PageFold>` chứa bản sao nửa phải của đầu trang kế tiếp) quay quanh trục dọc giữa `rotateY 0 → -180°`, nửa trái đứng yên; mặt sau của nửa đang lật là nửa trái của trang mới. Scrub theo cuộn.
**Vì sao không lật chính DOM thật:** trang báo dài hàng trăm svh, lật cả khối rất nặng; chỉ lật một "tấm" cao 100svh chứa tiêu đề trang mới (măng-sét nhỏ "TRANG 2 · THÔNG BÁO") là đủ đánh lừa thị giác.
**Reduced-motion:** thay bằng đường kẻ đôi + nhãn "— TRANG 2 —", không ghim.

---

### C5 + C11 · Lịch sự kiện

```
┌────────────────────────────┐
│ BÁO TIN VUI · Trang 2      │
│ LỊCH SỰ KIỆN               │
│┌──────────────────────────┐│  ← hộp viền đôi
││  THỨ BẢY                 ││
││  14                      ││  ← Playfair 900 96px
││  THÁNG MƯỜI MỘT · 2026   ││
││ Còn: 45 ngày 06 giờ 12'  ││  ← A7
│└──────────────────────────┘│
│ T2 T3 T4 T5 T6 T7 CN       │  ← lịch như lịch in báo
│ … 12 13 (14) 15 …          │  ← khoanh bằng vòng mực đỏ A6
└────────────────────────────┘
```
**Nội dung:** ngày cưới từ `date` ⚠️ (fallback ngày mẫu). Sau ngày cưới: *"Sự kiện đã diễn ra thành công tốt đẹp."*
**Animation:** hộp viền vẽ A6; số 14 đếm lên; vòng mực đỏ vẽ tay A6 (không đều, như bút lông).

---

### C12 · Chương trình buổi lễ

```
┌────────────────────────────┐
│ CHƯƠNG TRÌNH               │
│ 17:00 ........ Đón khách   │  ← dòng chấm dẫn (leader dots)
│ 18:00 ........ Làm lễ      │
│ 18:30 ........ Khai tiệc   │
│ 20:00 ........ Giao lưu    │
└────────────────────────────┘
```
Giờ từ `date` (−1h, 0, +30′, +2h). Dòng chấm bằng `bg-[radial-gradient(...)] bg-[length:6px_2px] bg-repeat-x bg-bottom` trên phần tử `flex-1`.
**Animation:** mỗi dòng "đánh máy": giờ hiện trước, chấm chạy `scaleX 0 → 1` từ trái (0.4s), rồi tên mục. Stagger 0.15.

---

### C6 + C7 · Mục Thông báo (hai lễ + bản đồ)

```
┌────────────────────────────┐
│ THÔNG BÁO                  │
│┌────────────┬─────────────┐│
││ LỄ VU QUY  │ TIỆC CƯỚI   ││  ← 2 "mẩu rao" viền mảnh
││ 08:00      │ 18:00       ││
││ Thứ Bảy    │ Thứ Bảy     ││
││ Tư gia nhà │ {venue.name}││
││ gái:       │             ││
││ {bride.    │             ││
││  address}  │             ││
│└────────────┴─────────────┘│
│ BẢN ĐỒ HƯỚNG DẪN           │
│┌──────────────────────────┐│
││ <MapEmbed/> grayscale    ││  ← 16:10, filter grayscale; chạm → màu
│└──────────────────────────┘│
│ [ ⌖ Chỉ đường ]            │
└────────────────────────────┘
```
**Bản đồ:** bọc `<MapEmbed>` trong `div` có `grayscale sepia-[0.3] transition-[filter] duration-500 hover:grayscale-0 focus-within:grayscale-0` (Tailwind utility, không CSS thuần). Trên mobile: bấm lần đầu vào vùng lớp phủ "Chạm để xem bản đồ màu" để bỏ filter, bấm tiếp mới tương tác iframe. Mount khi cách viewport < 1 màn hình.
**Animation:** 2 mẩu rao A1 stagger 0.12.

---

### C13 · Chuyên mục thời trang

```
┌────────────────────────────┐
│ THỜI TRANG                 │
│ Toà soạn gợi ý: trang phục │
│ lịch sự, tông kem–nâu–đen. │
│  ■      ■      ■      ■    │  ← ô vuông màu kiểu bảng màu in
│ Kem   Be    Nâu    Đen     │     #F7F0E1 #E8DDC5 #6B4F3A #1A1A1A
└────────────────────────────┘
```
**Animation:** các ô màu `scaleY 0 → 1` từ đáy, stagger 0.08 (như cột mực in).

---

### C16 · Làn sóng phát thanh

```
┌────────────────────────────┐
│ PHÁT THANH                 │
│ ┌──────────────────────┐   │
│ │ 📻 Bài hát của       │   │
│ │   chúng tôi          │   │
│ │ [ ▶ / ❚❚ ]  ──●── 1:12│   │
│ └──────────────────────┘   │
│ Chạm để nghe bài hát của   │
│ chúng tôi trên sóng Tin Vui│
└────────────────────────────┘
```
Đồng bộ `<MusicPlayer>`. Kim dò sóng SVG lắc `rotate ±4°` khi đang phát (A12), đứng yên khi dừng.

---

### C8 · Ảnh phóng sự (album, BW → màu)

```
┌────────────────────────────┐
│ BÁO TIN VUI · Trang 3      │
│ ẢNH PHÓNG SỰ               │
│┌────────────┬─────────────┐│
││ ▒ ảnh 3    │ ▒ ảnh 4     ││  ← masonry 2 cột, tỉ lệ xen kẽ
││            ├─────────────┤│     4:5 / 1:1 / 3:4
│├────────────┤ ▒ ảnh 5     ││
││ ▒ ảnh 6    │             ││
│└────────────┴─────────────┘│
│ Ảnh 1: … (chú thích số thứ │
│ tự, italic)                │
└────────────────────────────┘
```
**Nội dung:** `images[3..n-2]`, chú thích tự sinh *"Ảnh {i}: Khoảnh khắc đáng nhớ"* (i = 1…). Masonry bằng CSS columns (`columns-2 lg:columns-3 gap-4`, `break-inside-avoid`), không cần thư viện.
**Animation (đặc trưng mẫu):** mỗi ảnh: vào viewport thì A3; khi tâm ảnh đi qua 60%→40% viewport thì **in màu** (scrub): lớp halftone `opacity 1 → 0.15`, ảnh màu (bản sao đặt trên, `opacity 0 → 1`) — xem §9.4.
**Tương tác:** chạm → A10 lightbox (ảnh màu). Phím ←/→ trong lightbox.
**Reduced-motion:** ảnh màu sẵn, halftone nhẹ 0.15, A1 0.3s.

---

### C14 · Hộp thư mừng cưới

```
┌────────────────────────────┐
│ HỘP THƯ                    │
│ Độc giả muốn gửi lời chúc  │
│ mừng xin vui lòng dùng mã  │
│ dưới đây.                  │
│ ┌────────┐ ┌────────┐      │
│ │  QR    │ │  QR    │      │  ← QR mẫu ⚠️ §8.3, viền đôi
│ │nhà trai│ │nhà gái │      │
│ └────────┘ └────────┘      │
└────────────────────────────┘
```
Chạm QR → A10.

---

### C15 · Phiếu cắt (RSVP, chỉ giao diện)

```
┌────────────────────────────┐
│ ✂ ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ │
│ ┊ PHIẾU XÁC NHẬN THAM DỰ  ┊ │  ← viền nét đứt, kéo ở góc
│ ┊ Họ tên: [__________]   ┊ │
│ ┊ ☐ Tôi sẽ đến           ┊ │
│ ┊ ☐ Rất tiếc, không đến  ┊ │
│ ┊ Số người: [ 1 ▾ ]      ┊ │
│ ┊ [ Cắt & gửi phiếu ]    ┊ │
│ ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ │
│ Bản xem thử — không gửi đi │
└────────────────────────────┘
```
**Hành vi:** bấm nút → cây kéo SVG chạy dọc viền nét đứt (MotionPath theo `rect` viền, 1.0s), phiếu tách ra, nghiêng 4° và trượt đi `x: 110%`, để lại dòng *"Toà soạn đã nhận phiếu của {tên}. Cảm ơn! ♥"*. Không gửi dữ liệu. Radio là `<input type="radio">` thật có label (dù vẽ như ô vuông).
**Reduced-motion:** không có kéo chạy; phiếu fade ra.

---

### C10 · Lời toà soạn (gập báo lại)

```
┌────────────────────────────┐
│ LỜI TOÀ SOẠN               │
│ ┌────────────────────────┐ │
│ │ ▒ images[n-1] (màu)    │ │
│ └────────────────────────┘ │
│ Cảm ơn quý độc giả đã theo │
│ dõi số báo đặc biệt này.   │
│ Hẹn gặp quý vị tại tiệc!   │
│   — Minh Quân & Thu Hà     │
│      ─── HẾT ───           │
└────────────────────────────┘
```
**Animation (scrub ở 50svh cuối):** tờ báo gập đôi lại (`rotateX 0 → 180°` nửa dưới), thu nhỏ và xoay nhẹ, đặt lên mặt bàn `desk` — đảo ngược C1. Dấu "ĐÃ ĐỌC" màu đỏ đập lên mặt gập.
**Reduced-motion:** không gập; hiện dòng "— HẾT —".

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | C1 mặt gập (nhỏ), C2 ảnh trang nhất | 4:3 |
| `images[1]` | C3 chú rể | 4:5 |
| `images[2]` | C3 cô dâu | 4:5 |
| `images[3..5]` | C4 ba chương | 4:5 / 1:1 |
| `images[3..n-2]` | C8 ảnh phóng sự | hỗn hợp, `object-cover` |
| `images[n-1]` | C10 | 4:3 |

`meta.media = { images: 8, videos: 0 }` (album cần ≥ 4 ảnh để masonry 2 cột trông đầy: `images[3..6]`).

Trường ⚠️: `date` — ngày phát hành báo, lịch sự kiện, giờ chương trình; fallback ngày mẫu. Tên bố mẹ — ẩn dòng. QR — QR mẫu.

---

## 7. Triển khai code

### 7.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/newspaper-2d/
├── meta.ts
├── layout.tsx                 # Playfair_Display + Old_Standard_TT (vietnamese; Old Standard TT chỉ có 400/700 + italic)
├── page.tsx                   # return <NewspaperInvite />
└── _components/
    ├── newspaper-invite.tsx   # "use client" — ghép 3 trang, tokens `t`, SmoothScroll
    ├── spinning-paper.tsx     # C1 (+ mode "close" cho C10)
    ├── page-header.tsx        # dải đầu trang "BÁO TIN VUI · Trang n"
    ├── page-fold.tsx          # tấm lật giữa 2 trang
    ├── halftone-img.tsx       # <img> BW + lớp chấm + bản màu, prop `colorOn: "scroll"|"always"`
    ├── news-text.ts           # headlineCity(address), leadParagraph(data)
    ├── news-text.test.ts
    ├── sections/
    │   ├── front-page.tsx     # C2
    │   ├── profiles.tsx       # C3
    │   ├── story.tsx          # C4
    │   ├── events-box.tsx     # C5+C11
    │   ├── program.tsx        # C12
    │   ├── notices.tsx        # C6+C7
    │   ├── fashion.tsx        # C13
    │   ├── radio.tsx          # C16
    │   ├── photo-report.tsx   # C8
    │   ├── mailbox.tsx        # C14
    │   ├── coupon.tsx         # C15
    │   └── editorial.tsx      # C10
    └── svg/                   # dấu TIN NÓNG, dấu ĐÃ ĐỌC, kéo, radio, vòng mực
```
Dùng chung: `@/kit` (`SmoothScroll`, `OpenGate`, `MusicPlayer`, `Countdown`, `useReducedMotion`, `presets`), `MapEmbed`, `useWedding()`.

### 7.2 Tokens Tailwind
```ts
export const t = {
  root: "min-h-screen bg-[#EFE6D2] text-[#1A1A1A] font-(family-name:--font-body)",
  sheet: "bg-[#F7F0E1] w-[min(96vw,1100px)] mx-auto shadow-[0_2px_0_#d8ccb2,0_20px_40px_-20px_rgba(26,26,26,0.4)]",
  grid: "grid grid-cols-2 lg:grid-cols-6 gap-x-4 lg:gap-x-6 divide-x divide-[#1A1A1A]",
  masthead: "font-(family-name:--font-display) font-black text-[44px] lg:text-[96px] leading-none text-center",
  headline: "font-(family-name:--font-display) font-black uppercase leading-[1.05] text-[34px] lg:text-[72px]",
  kicker: "text-[12px] lg:text-[13px] font-bold tracking-[0.18em] uppercase",
  body: "text-[16px] lg:text-[17px] leading-[1.55] sm:text-justify",
  dropcap: "first-letter:float-left first-letter:font-(family-name:--font-display) first-letter:text-[56px] first-letter:leading-[0.8] first-letter:mr-2 first-letter:font-black",
  rule2: "border-b-[3px] border-double border-[#1A1A1A]",
  red: "text-[#8B0000]",
} as const;
```

### 7.3 Xoay vào + mở báo (C1)
```tsx
useGSAP(() => {
  gsap.from(".paper", { scale: 0, rotate: 720, duration: 1.2, ease: "power2.out" });
  gsap.from(".stamp", { scale: 1.6, autoAlpha: 0, duration: 0.25, delay: 1.2 });
  open.current = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } })
    .to(".paper", { rotate: 0, duration: 0.3 })
    .fromTo(".paper-top", { rotateX: -180 }, { rotateX: 0, duration: 0.7 }, 0.3) // origin-bottom
    .to(".paper", { scale: () => innerWidth / paperEl.offsetWidth, duration: 0.5 }, 0.8)
    .call(onOpened);
}, { scope: root });
```

### 7.4 Halftone "in màu" theo cuộn
Không animate `filter` trên ảnh lớn (tốn GPU trên mobile). Thay vào đó `halftone-img.tsx` render **2 lớp**: ảnh BW (`grayscale contrast-125` tĩnh) + lớp chấm, và ảnh màu nằm trên với `opacity: 0`. Chỉ tween `opacity`:
```tsx
gsap.timeline({ scrollTrigger: { trigger: el, start: "center 60%", end: "center 40%", scrub: true } })
  .to(colorLayer, { opacity: 1, ease: "none" }, 0)
  .to(dotsLayer, { opacity: 0.15, ease: "none" }, 0);
```
Hai thẻ `<img>` cùng `src` nên trình duyệt chỉ tải 1 lần.

### 7.5 Lật trang (`page-fold.tsx`)
```tsx
gsap.timeline({ scrollTrigger: { trigger: foldZone, start: "top top", end: "+=80%", pin: true, scrub: 0.5 } })
  .to(".fold-right", { rotateY: -180, ease: "none" });        // origin-left, [backface-visibility:hidden] qua class backface-hidden
```
Mặt trước `.fold-right` = nửa phải của footer trang cũ (chú thích "xem tiếp trang sau →"); mặt sau = nửa trái măng-sét nhỏ trang mới.

### 7.6 Logic cần test (`news-text.test.ts`)
- `headlineCity("Ba Đình, Hà Nội")` → `"Hà Nội"`; không có dấu phẩy → cả chuỗi; rỗng → `""`.
- `leadParagraph(data)` chèn đúng `groom.name`, `bride.name`; không chứa `undefined` khi thiếu `venue.name`.
- Ngày phát hành: dùng `Intl.DateTimeFormat("vi-VN", { weekday: "long", … })` → chuỗi bắt đầu hoa ("Thứ Bảy") — viết hàm `capitalize` nhỏ, test 1 case.

### 7.7 Thứ tự làm
1. `meta.ts`, `layout.tsx`, `page.tsx`, tokens → kiểm dấu tiếng Việt trên Old Standard TT
2. `news-text.ts` + test
3. Dàn 3 trang tĩnh theo lưới 2/6 cột ở 360px và 1440px (phần tốn công nhất — ưu tiên đúng lưới trước khi làm animation)
4. `halftone-img.tsx`
5. C1 xoay vào + mở báo + nhạc
6. `page-fold.tsx` lật trang
7. Animation từng section, phiếu cắt RSVP, gập báo C10
8. Reduced-motion, tên dài, Lighthouse, checklist §12

---

## 8. Asset cần chuẩn bị
- [ ] SVG: dấu "TIN NÓNG", dấu "ĐÃ ĐỌC", cây kéo, radio cổ + kim, vòng mực đỏ vẽ tay, trang trí gạch đầu dòng kiểu báo cũ
- [ ] `music.mp3` (Pixabay, jazz/swing radio cũ) + `CREDITS.md`
- [ ] 8 ảnh mẫu tương phản cao, hợp chuyển BW (Unsplash) ≤ 300KB `.webp`
- [ ] 2 QR mẫu
- [ ] `thumb.webp` 600×800: trang nhất với tít lớn và ảnh halftone
- [ ] `opengraph-image.png` 1200×630: măng-sét + tít

## 9. Tiêu chí nghiệm thu riêng
- [ ] Hiệu ứng xoay vào ≤ 1.4s và có thể bấm "Mở báo" ngay khi nút hiện; nhạc phát khi bấm
- [ ] Lưới báo ở 360px: 2 cột, không cuộn ngang, cỡ chữ nội dung ≥ 16px
- [ ] In màu ảnh chỉ tween `opacity`, 60fps khi cuộn album trên điện thoại tầm trung
- [ ] Lật trang giữa trang 1→2→3 mượt, và có bản thay thế khi reduced-motion
- [ ] Bản đồ không bẫy cuộn trên mobile (lớp phủ chạm-để-kích-hoạt)
- [ ] Tên 50 ký tự không làm vỡ tít trang nhất và mặt gập C1
- [ ] Có đúng 1 `<h1>` (tít trang nhất); măng-sét "BÁO TIN VUI" không phải `<h1>`
