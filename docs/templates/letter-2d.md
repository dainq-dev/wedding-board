# 2D-02 · `letter-2d` · Phong Thư Sáp

> **Design Read:** Đọc là thiệp cưới dạng thư tay cho cặp đôi hoài niệm, ngôn ngữ giấy kraft, dấu sáp và chữ viết tay, nghiêng về mỹ học heritage epistolary cổ điển, nhịp chậm, đậm nghi thức mở thư.
>
> **Dials:** `DESIGN_VARIANCE 7/10` · `MOTION_INTENSITY 5/10` · `VISUAL_DENSITY 2/10`.

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md).

---

## 1. Concept

**Một câu:** Khách nhận được một phong bì giấy mỹ thuật niêm dấu sáp. Mở ra, từng tấm thiệp được rút ra lần lượt, giống như lấy thiệp giấy thật ra khỏi phong bì.

**Cảm xúc muốn gợi:** trân trọng, chậm rãi, cảm giác "được mời riêng". Giống lúc cầm tấm thiệp in đẹp trong tay chứ không phải lướt một trang web.

**Phù hợp với:** cặp đôi thích phong cách cổ điển, tối giản, cưới trong nhà hàng hoặc sân vườn. Hợp với ảnh cưới tông màu ấm và trung tính.

**Khác các mẫu khác ở chỗ:** toàn bộ trang được dựng như một **chồng thiệp giấy**. Khi cuộn, tấm thiệp mới **trượt lên che tấm cũ**, còn tấm cũ lùi xuống và tối đi (T3). Không có "trang web", chỉ có các tấm giấy.

**Moodboard:** phong bì kraft và giấy cotton, sáp xanh olive, hoa rum (calla lily), kẹp giấy bằng đồng, chữ viết tay mực nâu, viền răng cưa của tem thư.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `bg` | `#EFE8DC` | Nền trang, như mặt bàn phủ vải lanh |
| `paper` | `#FBF8F2` | Nền của mọi tấm thiệp |
| `paper-shade` | `#F1EADF` | Mặt trong phong bì, nền card phụ |
| `olive` | `#6B7B5A` | Màu chủ đạo: dấu sáp, nút, khối nền đậm |
| `olive-dark` | `#4E5B41` | Hover, chữ trên nền sáng cần nhấn |
| `wax` | `#8A3B2E` | Điểm nhấn hiếm dùng: trái tim trên lịch, chấm dress code |
| `ink` | `#3B362E` | Chữ chính |
| `ink-soft` | `#7A7266` | Chữ phụ, chú thích |
| `line` | `#D9CFBF` | Đường kẻ, viền thiệp |

Tương phản: `ink` trên `paper` khoảng 11:1 ✅. `ink-soft` trên `paper` khoảng 4.7:1 ✅. Chữ trắng trên `olive` khoảng 4.9:1 ✅.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Pinyon Script | 44px / 1.1 | 72px | Chỉ dùng cho tên và chữ ký |
| Tiêu đề section | Cormorant Garamond 600, VIẾT HOA, tracking 0.2em | 14px | 16px | Ví dụ "LỄ THÀNH HÔN" |
| Số lớn (ngày) | Cormorant Garamond 300 | 96px | 144px | |
| Nội dung | Cormorant Garamond 400 | 18px / 1.6 | 20px | |
| Nhãn nhỏ | Cormorant Garamond 500 italic | 14px | 15px | |

Cả hai font đã kiểm là có subset `vietnamese`.

### Hình khối và chất liệu
- **Tấm thiệp**: `rounded-sm`, bóng `shadow-[0_10px_30px_-10px_rgba(59,54,46,0.35)]`, viền `1px line`.
- **Thiệp có viền tem**: dùng `mask` hình tròn lặp lại ở mép, viết bằng arbitrary value Tailwind.
- **Vân giấy**: SVG `feTurbulence` rất mờ (opacity 0.04) phủ lên `paper`, đặt thành 1 component `<PaperGrain/>`.
- **Icon**: nét mảnh 1.25px, màu `olive`, phong cách vẽ tay (tự vẽ SVG, 6 icon: nhẫn, ly, đĩa ăn, nhà, đồng hồ, định vị).
- **Ảnh**: khung vòm (`rounded-t-full`) hoặc polaroid (viền trắng dày, xoay ±3°).
- **Motion**: ease chủ đạo `power3.inOut`. Thời lượng: vào 0.9s, ra 0.6s. Không có gì nảy (không dùng `back`, `elastic`).

---

## 3. Nhạc

- **Tâm trạng**: piano và dàn dây nhẹ, lãng mạn cổ điển, không có lời.
- **Tempo**: 60–70 BPM. **Độ dài**: 2:30–3:00, lặp lại.
- **Từ khoá Pixabay**: `romantic piano strings wedding`, `elegant classical love`
- **Hành vi**:
  - Bắt đầu khi bấm dấu sáp (C1). Âm lượng tăng 0 → 0.6 trong 2 giây.
  - Section C16 hiện thanh phát nhạc đồng bộ với nút nổi.
  - Ẩn tab thì tạm dừng, quay lại thì phát tiếp.

---

## 4. Cấu trúc trang

```
┌───────────────────────────┐
│ C1  Phong bì               │ 100svh  (cố định cho tới khi mở)
├───────────────────────────┤
│ C2  Thiệp mời chính        │ 100svh  ─┐
│ C16 Bài hát                │  60svh   │
│ C3  Hai gia đình           │ 100svh   │  Chồng thiệp (T3):
│ C5  Ngày cưới + lịch       │ 120svh   │  mỗi tấm trượt lên
│ C12 Lịch trình             │ 120svh   │  che tấm trước
│ C6  Hai lễ + C7 bản đồ     │ 140svh   │
│ C13 Dress code             │  80svh   │
│ C8  Album                  │ 160svh  ─┘
│ C14 Mừng cưới              │  80svh
│ C15 Xác nhận tham dự       │ 100svh
│ C10 Lời cảm ơn             │ 100svh  (phong bì đóng lại)
└───────────────────────────┘
```

Chiều rộng nội dung: tấm thiệp rộng `min(92vw, 440px)` và luôn nằm giữa màn hình. Trên desktop hai bên là nền vải lanh cùng vài cành hoa rum trang trí (A4 parallax).

---

## 5. Chi tiết từng section

### C1 · Phong bì (màn mở thiệp)

**Mục đích:** tạo khoảnh khắc "mở thư", đồng thời bấm vào đây là thao tác người dùng cần có để trình duyệt cho phép phát nhạc.

**Wireframe (360px):**
```
┌────────────────────────────┐
│        Minh Quân           │  ← tên, Pinyon 32px
│            &               │
│         Thu Hà             │
│                            │
│   ┌────────────────────┐   │
│   │ ╲                ╱ │   │  ← phong bì paper-shade
│   │   ╲     (●)    ╱   │   │  ← dấu sáp olive, 72px, chữ viết tắt "Q&H"
│   │     ╲        ╱     │   │
│   └────────────────────┘   │
│  ✿ hoa rum đè lên góc      │
│                            │
│  Chạm vào dấu sáp để mở    │  ← italic 14px, ink-soft
│         thiệp mời          │
└────────────────────────────┘
```

**Nội dung:**
- Tên: `{groom.name}` & `{bride.name}`
- Chữ viết tắt trên dấu sáp: chữ cái đầu của **tên gọi** (từ cuối cùng trong họ tên). "Minh Quân" thành **Q**, "Thu Hà" thành **H**, hiển thị "Q & H".
- Dòng hướng dẫn: *"Chạm vào dấu sáp để mở thiệp mời"*

**Animation (timeline):**
| t | Hành động |
|---|---|
| 0.0s | Phong bì fade + `y: 30 → 0` (0.9s) |
| 0.4s | Tên A2 theo từng ký tự |
| 1.2s | Hoa rum trượt vào từ góc |
| sau đó, lặp | Dấu sáp "thở" `scale 1 ↔ 1.04` (A12, 2s) |

**Khi bấm vào dấu sáp (timeline mở, tổng 2.4s):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc bắt đầu, âm lượng tăng dần |
| 0.0s | Dấu sáp nứt: tách 2 nửa `x ±20`, `rotate ±15`, opacity → 0 (0.5s) |
| 0.3s | Nắp phong bì lật `rotateX 0 → 180°` quanh mép trên (0.8s, `perspective: 1200px`) |
| 0.9s | Tấm thiệp C2 trượt lên khỏi phong bì `y: 60% → -10%` (0.9s) |
| 1.6s | Phong bì trượt xuống ra khỏi màn hình và fade; tấm thiệp phóng lên kích thước đầy đủ |
| 2.4s | Mở khoá cuộn (trước đó `overflow: hidden`), bắt đầu ScrollSmoother |

**Reduced-motion:** bỏ lật nắp, thay bằng crossfade 0.3s.
**Trường hợp đặc biệt:** tên dài hơn 20 ký tự thì giảm cỡ chữ còn 26px và cho xuống dòng.

---

### C2 · Thiệp mời chính

**Mục đích:** nội dung cốt lõi. Chỉ đọc card này cũng đủ biết ai cưới, cưới ngày nào.

**Wireframe:**
```
┌────────────────────────────┐
│ ┌────────────────────────┐ │
│ │      ╭──────────╮      │ │  ← ảnh bìa images[0], khung vòm 3:4
│ │      │  ẢNH BÌA │      │ │
│ │      ╰──────────╯      │ │
│ │  TRÂN TRỌNG KÍNH MỜI   │ │  ← tiêu đề section
│ │                        │ │
│ │      Minh Quân         │ │  ← Pinyon 44px
│ │          &             │ │
│ │        Thu Hà          │ │
│ │  ───────  ✿  ───────   │ │  ← đường kẻ + hoa nhỏ
│ │   THỨ BẢY · 14.11.2026 │ │  ← cần `date` ⚠️
│ └────────────────────────┘ │
└────────────────────────────┘
```

**Nội dung:**
- "TRÂN TRỌNG KÍNH MỜI"
- Tên chú rể & tên cô dâu
- Thứ và ngày (định dạng `EEEE · dd.MM.yyyy` tiếng Việt). Nếu chưa có trường `date` thì dùng ngày mẫu viết sẵn.

**Animation:** ảnh A3 (clip từ dưới lên, 1.1s). Tên A2 stagger 0.03. Đường kẻ A6 vẽ từ giữa ra hai bên.
**Chuyển sang C16:** T3. C2 bị ghim (`pin`), C16 trượt lên từ dưới. Trong lúc đó C2 `scale 1 → 0.92`, `filter: brightness(0.85)`, `y: -4%`.

---

### C16 · Bài hát của chúng tôi

**Wireframe:**
```
┌────────────────────────────┐
│  ┌──────────────────────┐  │  ← tấm thiệp nhỏ, lệch trái, xoay -2°
│  │ ♪ Chạm để nghe       │  │
│  │   bài hát của        │  │
│  │   chúng tôi          │  │
│  │ ◀◀   ▶/❚❚   ▶▶       │  │  ← chỉ nút ▶/❚❚ hoạt động
│  │ ──●──────────  1:12  │  │  ← thanh tiến độ thật
│  └──────────────────────┘  │
└────────────────────────────┘
```
**Hành vi:** đồng bộ với `<MusicPlayer>` (cùng một thẻ audio). Thanh tiến độ cập nhật mỗi giây. Hai nút ◀◀ ▶▶ chỉ để trang trí, đặt `aria-hidden`.
**Animation:** A1, sau đó xoay `-6° → -2°`.

---

### C3 · Hai gia đình

**Wireframe:**
```
┌────────────────────────────┐
│ ┌──────────┐  ┌──────────┐ │
│ │ polaroid │  │ polaroid │ │  ← images[1], images[2], xoay -3° / +3°
│ │  chú rể  │  │  cô dâu  │ │     kẹp giấy đồng ở mép trên
│ └──────────┘  └──────────┘ │
│   NHÀ TRAI       NHÀ GÁI   │
│  Minh Quân       Thu Hà    │  ← Pinyon 28px
│  Quận 1,        Ba Đình,   │  ← address, 16px, tối đa 3 dòng
│  TP.HCM         Hà Nội     │
└────────────────────────────┘
```
**Nội dung:** `groom.name`, `groom.address`, `bride.name`, `bride.address`. Nếu có tên bố mẹ (⚠️ đang chờ chốt) thì thêm dòng "Ông … & Bà …" ở trên tên.
**Animation:** hai polaroid rơi vào từ trên (`y: -40`, `rotate` từ 0 tới ±3°), cách nhau 0.15s. Kẹp giấy "bấm" xuống (`y: -6 → 0`, 0.2s) sau khi ảnh đã chạm vị trí.
**Mobile < 360px:** chuyển sang 1 cột.

---

### C5 + C11 · Ngày cưới và lịch

**Wireframe:**
```
┌────────────────────────────┐
│ ┌────────────────────────┐ │  ← khối nền olive, chữ paper
│ │     THÁNG MƯỜI MỘT     │ │
│ │  THỨ BẢY │ 14 │ 2026   │ │  ← "14" Cormorant 96px
│ │                        │ │
│ │  CÒN                   │ │
│ │  45 : 06 : 12 : 33     │ │  ← A7
│ │ ngày  giờ  phút  giây  │ │
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │  ← nền paper
│ │  T2 T3 T4 T5 T6 T7 CN  │ │
│ │   2  3  4  5  6  7  8  │ │
│ │   9 10 11 12 13 (♥) 15 │ │  ← ngày cưới trong trái tim màu wax
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Nội dung:** tên tháng viết bằng chữ tiếng Việt; lịch bắt đầu từ Thứ Hai; đếm ngược tới `date`. Khi đã qua ngày cưới thì hiện *"Chúng tôi đã về chung một nhà ♥"*.
**Animation:** số "14" đếm từ 1 lên 14 (0.8s, `snap`). Trái tim được vẽ bằng A6 quanh ô ngày. Mỗi chữ số đếm ngược lật (A7) khi thay đổi.

---

### C12 · Lịch trình

**Wireframe:**
```
┌────────────────────────────┐
│        LỊCH TRÌNH          │
│   (ly)  17:00  Đón khách   │
│    │                       │
│   (nhẫn)18:00  Làm lễ      │  ← icon tròn viền olive
│    │                       │
│   (đĩa) 18:30  Khai tiệc   │
│    │                       │
│   (nhạc)20:00  Giao lưu    │
└────────────────────────────┘
```
**Nội dung (viết sẵn, không lấy từ form):** 4 mốc như trên, giờ tính từ `date` (đón khách = giờ tiệc − 1h, làm lễ = giờ tiệc, khai tiệc = +30′, giao lưu = +2h).
**Animation:** trục dọc A6 theo scrub. Mỗi mốc A1 khi trục vẽ tới. Icon A6 vẽ nét trong 0.6s.

---

### C6 + C7 · Hai lễ và bản đồ

**Wireframe:**
```
┌────────────────────────────┐
│ ┌────────────────────────┐ │
│ │      LỄ VU QUY         │ │
│ │  08:00 · Thứ Bảy       │ │
│ │  Tư gia nhà gái        │ │
│ │  {bride.address}       │ │
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │      TIỆC CƯỚI         │ │
│ │  18:00 · Thứ Bảy       │ │
│ │  {venue.name}          │ │
│ │ ┌────────────────────┐ │ │
│ │ │   Google Map       │ │ │  ← <MapEmbed>, 16:10, bo 2px
│ │ └────────────────────┘ │ │
│ │  [ ⌖ Chỉ đường ]       │ │  ← link google.com/maps/dir/?api=1&destination=lat,lng
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Animation:** hai thẻ xếp chồng lệch nhau (thẻ 2 `y: +12, rotate: 1.5°`). Khi cuộn tới, thẻ 2 trượt ra nằm dưới thẻ 1.
**Lưu ý:** iframe bản đồ `loading="lazy"`, và chỉ tạo khi section cách viewport dưới 1 màn hình để không làm chậm lần tải đầu.

---

### C13 · Dress code

```
┌────────────────────────────┐
│        DRESS CODE          │
│   Trang nhã · tông trung   │
│         tính               │
│    ●     ●     ●     ●     │  ← #FBF8F2 #D9CFBF #6B7B5A #3B362E
│  Kem   Be   Olive   Nâu    │
└────────────────────────────┘
```
**Animation:** các chấm màu `scale 0 → 1` stagger 0.08.

---

### C8 · Album (chồng ảnh vuốt)

**Wireframe:**
```
┌────────────────────────────┐
│        KHOẢNH KHẮC         │
│      ┌──────────┐          │
│     ┌┴─────────┐│          │  ← chồng polaroid images[3..5]
│    ┌┴─────────┐││          │     xoay ngẫu nhiên ±4°
│    │  ẢNH     │┘│          │
│    │          │─┘          │
│    └──────────┘            │
│       ● ○ ○                │
│  Vuốt để xem ảnh tiếp →    │
└────────────────────────────┘
```
**Hành vi:** GSAP Draggable trên ảnh trên cùng. Vuốt quá 30% chiều rộng thì ảnh bay ra và xếp xuống đáy chồng. Bấm vào ảnh thì A10 mở lightbox. Trên desktop có thêm nút ← →.
**Accessibility:** hỗ trợ phím mũi tên; mỗi ảnh có `alt="Ảnh cưới 1/3"`.

---

### C14 · Mừng cưới

```
┌────────────────────────────┐
│        MỪNG CƯỚI           │
│  Sự hiện diện của bạn là   │
│  món quà ý nghĩa nhất.     │
│ ┌─────────┐  ┌─────────┐   │
│ │   QR    │  │   QR    │   │  ← QR mẫu (⚠️ chờ chốt §8.3)
│ │ nhà trai│  │ nhà gái │   │
│ └─────────┘  └─────────┘   │
└────────────────────────────┘
```
**Hành vi:** bấm vào QR thì phóng to (A10) để dễ quét.

---

### C15 · Xác nhận tham dự (chỉ là giao diện)

```
┌────────────────────────────┐
│    XÁC NHẬN THAM DỰ        │
│  [ Tên của bạn        ]    │
│  ( ) Tôi sẽ đến            │
│  ( ) Rất tiếc, không đến   │
│  Số người: [ 1 ▾ ]         │
│  [ Gửi xác nhận ]          │
└────────────────────────────┘
```
**Hành vi:** bấm "Gửi" thì form thu lại (`height → 0`) và hiện *"Cảm ơn {tên}! ♥"*. **Không gửi dữ liệu đi đâu.** Dưới nút có ghi chú nhỏ: *"Bản xem thử — xác nhận không được gửi đi."*

---

### C10 · Lời cảm ơn (phong bì đóng lại)

```
┌────────────────────────────┐
│      ╭──────────╮          │  ← images[n-1], khung vòm
│      │  ẢNH CUỐI│          │
│      ╰──────────╯          │
│  Rất hân hạnh được đón     │
│  tiếp quý khách!           │
│                            │
│     Minh Quân & Thu Hà     │  ← Pinyon, như chữ ký
│   ┌────────────────────┐   │
│   │ ╲      (●)       ╱ │   │  ← phong bì đóng, dấu sáp nguyên vẹn
│   └────────────────────┘   │
└────────────────────────────┘
```
**Animation (scrub):** tấm thiệp thu nhỏ và trượt vào phong bì, nắp gập xuống, dấu sáp "đóng" lại (scale 1.3 → 1). Đây là thao tác đảo ngược của C1, khép lại câu chuyện.

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | C2 ảnh bìa | 3:4 |
| `images[1]` | C3 chú rể | 4:5 |
| `images[2]` | C3 cô dâu | 4:5 |
| `images[3..4]` | C8 album | 4:5 |
| `images[5]` | C10 ảnh cuối | 3:4 |

`meta.media = { images: 6, videos: 0 }`

## 7. Asset cần chuẩn bị
- [ ] SVG: phong bì (thân + nắp tách riêng), dấu sáp (2 nửa), hoa rum (2 kiểu), kẹp giấy, 6 icon lịch trình
- [ ] `music.mp3` (Pixabay) + ghi vào `CREDITS.md`
- [ ] 6 ảnh mẫu tông ấm (Unsplash) ≤ 300KB `.webp`
- [ ] `thumb.webp` 600×800: phong bì đang mở hé
- [ ] `opengraph-image.png` 1200×630

## 8. Tiêu chí nghiệm thu riêng
- [ ] Từ lúc bấm dấu sáp tới lúc cuộn được: ≤ 2.5 giây, và nhạc phát ngay khi bấm
- [ ] T3 xếp chồng mượt 60fps trên điện thoại tầm trung (chỉ animate `transform`, `opacity`, `filter: brightness`)
- [ ] Vuốt album được bằng cả chạm và phím mũi tên
- [ ] Tên 50 ký tự không làm vỡ phong bì và C2

---

## 9. Triển khai code

### 9.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/letter-2d/
├── meta.ts
├── layout.tsx                 # Pinyon_Script + Cormorant_Garamond (vietnamese), metadata
├── page.tsx                   # return <LetterInvite />
└── _components/
    ├── letter-invite.tsx      # "use client" — ghép các section + SmoothScroll + timeline tổng
    ├── envelope.tsx           # C1 + C10 (dùng chung SVG, prop `mode: "open" | "close"`)
    ├── card-stack.tsx         # wrapper T3: nhận children là các <PaperCard>
    ├── paper-card.tsx         # 1 tấm thiệp: nền paper, vân giấy, viền
    ├── sections/
    │   ├── invite-card.tsx    # C2
    │   ├── song-card.tsx      # C16
    │   ├── families-card.tsx  # C3
    │   ├── date-card.tsx      # C5 + C11
    │   ├── schedule-card.tsx  # C12
    │   ├── events-card.tsx    # C6 + C7
    │   ├── dress-card.tsx     # C13
    │   ├── album-stack.tsx    # C8 (Draggable)
    │   ├── gift-card.tsx      # C14
    │   └── rsvp-card.tsx      # C15
    └── svg/                   # envelope-body, envelope-flap, wax-seal, calla-lily, clip, icons
```
Dùng chung từ `@/kit`: `SmoothScroll`, `OpenGate`, `MusicPlayer`, `Countdown`, `useReducedMotion`, `presets` (A1–A12).
Dùng chung từ `@/components`: `MapEmbed`. Dữ liệu lấy từ `useWedding()`.

### 9.2 Tokens trong Tailwind (không viết CSS thuần)
Khai báo một lần trong `letter-invite.tsx` rồi dùng lại:
```ts
// letter-invite.tsx
export const t = {
  root: "bg-[#EFE8DC] text-[#3B362E] font-(family-name:--font-body)",
  paper: "bg-[#FBF8F2] border border-[#D9CFBF] rounded-sm shadow-[0_10px_30px_-10px_rgba(59,54,46,0.35)]",
  olive: "bg-[#6B7B5A] text-[#FBF8F2]",
  heading: "text-sm tracking-[0.2em] uppercase font-semibold",
  script: "font-(family-name:--font-script)",
  soft: "text-[#7A7266]",
} as const;
```
Section nào cũng import `t` và ghép bằng template string. Không dùng thêm thư viện `clsx`.

### 9.3 Luồng mở thiệp (C1)
```tsx
// envelope.tsx (rút gọn)
const tl = useRef<gsap.core.Timeline>(null);
useGSAP(() => {
  tl.current = gsap.timeline({ paused: true, defaults: { ease: "power3.inOut" } })
    .to(".seal-l", { x: -20, rotate: -15, opacity: 0, duration: 0.5 }, 0)
    .to(".seal-r", { x: 20, rotate: 15, opacity: 0, duration: 0.5 }, 0)
    .to(".flap", { rotateX: 180, duration: 0.8 }, 0.3)          // flap: origin-top [transform-style:preserve-3d]
    .to(".peek-card", { yPercent: -70, duration: 0.9 }, 0.9)
    .to(".envelope", { yPercent: 120, opacity: 0, duration: 0.8 }, 1.6)
    .call(onOpened);                                            // → OpenGate mở khoá cuộn
}, { scope: root });

<button aria-label="Mở thiệp mời" onClick={() => { music.play(); tl.current?.play(); }}>
  <WaxSeal initials={initials(groom.name, bride.name)} />
</button>
```
`initials()` lấy từ cuối cùng của mỗi tên → `"Q & H"`. Viết test trong `letter-2d/_components/initials.test.ts`.

### 9.4 Chồng thiệp T3
```tsx
// card-stack.tsx
useGSAP(() => {
  const cards = gsap.utils.toArray<HTMLElement>(".paper-card");
  cards.forEach((card, i) => {
    const next = cards[i + 1];
    if (!next) return;
    ScrollTrigger.create({
      trigger: card, start: "top top", endTrigger: next, end: "top top",
      pin: true, pinSpacing: false,
    });
    gsap.to(card, {
      scale: 0.92, yPercent: -4, filter: "brightness(0.85)", ease: "none",
      scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
    });
  });
}, { scope: root, dependencies: [reduced] });
```
Khi reduced-motion: không tạo trigger nào, các card nằm dọc bình thường.

### 9.5 Album (C8)
- `Draggable.create(top, { type: "x", onDragEnd })`. Nếu `|x| > width * 0.3` thì `gsap.to(top, { x: ±150%, rotate: ±20 })`, sau đó đưa ảnh xuống đáy chồng (đổi thứ tự trong state), rồi reset `x: 0`.
- Bắt `keydown` ArrowLeft/ArrowRight trên container có `tabIndex={0}`.

### 9.6 Ngày giờ
Dùng `Intl.DateTimeFormat("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })`, không cần thư viện ngày tháng. Lưới lịch: tự tính ngày đầu tháng (`getDay()`, chuyển để tuần bắt đầu từ Thứ Hai) trong `date-card.tsx`, khoảng 15 dòng code.

### 9.7 Thứ tự làm
1. `meta.ts`, `layout.tsx`, `page.tsx`, tokens `t` → trang trắng có font đúng
2. Các section tĩnh C2 → C10 (chưa có animation), khớp wireframe ở 360px và 1440px
3. `envelope.tsx` với timeline mở thiệp và nhạc
4. `card-stack.tsx` (T3)
5. Animation riêng của từng section
6. Album Draggable
7. Reduced-motion, kiểm tra tên dài, chấm Lighthouse
8. Chạy checklist ở template-spec §12
