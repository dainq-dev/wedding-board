# 2D-03 · `polaroid-2d` · Sổ Polaroid

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md).

---

## 1. Concept

**Một câu:** Khách mở một cuốn sổ scrapbook bìa vải; bên trong là ảnh polaroid dán băng washi, sticker và chữ viết tay, và cuối cùng là cả một mặt bàn đầy ảnh để khách tự tay xếp lại.

**Cảm xúc muốn gợi:** vui, gần gũi, "đồ tự làm". Giống như lật cuốn sổ kỷ niệm của bạn thân.

**Phù hợp với:** cặp đôi trẻ, nhiều ảnh đời thường, cưới thân mật, sân vườn, café.

**Khác các mẫu khác ở chỗ:**
- **Hai trang đầu lật như sổ thật** (T7, `rotateY` quanh gáy trái), sau đó trang **mở phẳng thành mặt bàn** và cuộn dọc.
- **Mọi thứ đều hơi lệch**: góc xoay ngẫu nhiên nhưng cố định theo seed, không có gì thẳng hàng tuyệt đối.
- **Album là mặt bàn kéo thả được** (Draggable), khách xáo trộn ảnh bằng tay.
- Ease chủ đạo có nảy (`back.out`), khác hẳn các mẫu sang trọng.

**Moodboard:** bìa sổ vải lanh xanh rêu, giấy kraft, băng washi kẻ sọc/chấm bi, sticker trái tim, bút bi xanh, dấu mộc "Just married", ghim bấm.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `kraft` | `#F4EFE6` | Nền trang (giấy kraft nhạt) |
| `desk` | `#E7DDCB` | Nền "mặt bàn" C8, đậm hơn kraft |
| `photo` | `#FFFFFF` | Viền polaroid, note |
| `coral` | `#E07A5F` | Màu chủ đạo: sticker, washi, nút |
| `coral-dark` | `#B85A42` | Nút (chữ trắng), hover |
| `sage` | `#81B29A` | Washi thứ 2, dấu tick |
| `note` | `#F6E27F` | Giấy note vàng C5 |
| `ink` | `#3D405B` | Chữ chính (mực bút bi xanh than) |
| `ink-soft` | `#6B6E86` | Chú thích |
| `cover` | `#4F6B5A` | Bìa sổ vải |

Tương phản: `ink` trên `kraft` ≈ 9:1 ✅; `ink-soft` trên `kraft` ≈ 4.7:1 ✅; trắng trên `coral-dark` ≈ 4.6:1 ✅ (trắng trên `coral` chỉ ≈ 3:1 → không dùng cho chữ nhỏ); `ink` trên `note` ≈ 8.5:1 ✅; chữ trắng trên `cover` ≈ 6:1 ✅.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Patrick Hand | 44px / 1.1 | 68px | Như viết bút dạ |
| Tiêu đề trang | Patrick Hand, gạch chân vẽ tay | 26px | 32px | "Nhà mình", "Hẹn nhau nhé!" |
| Chú thích ảnh | Patrick Hand | 18px | 20px | Dưới polaroid |
| Nội dung | Nunito 400 | 16px / 1.6 | 17px | |
| Nhãn/nút | Nunito 700 | 15px | 15px | |

Hai font có subset `vietnamese`. Kiểm tra dấu Patrick Hand với "Trịnh Đức Hưởng" khi dựng (nét dấu hơi nhỏ, nếu khó đọc thì tăng cỡ +2px).

### Hình khối và chất liệu
- **Polaroid**: `bg-white p-2 pb-10 rounded-[2px] shadow-[0_6px_14px_-6px_rgba(61,64,91,0.45)]`, ảnh vuông 1:1 (đúng khổ polaroid).
- **Washi**: dải `h-6 w-20` bán trong suốt (`bg-[#E07A5F]/70`), mép răng cưa bằng `mask` arbitrary, xoay ±(8–20)°.
- **Góc xoay**: `rot(i) = seeded(i) ∈ [-8°, 8°]`, seed cố định theo index → SSR/CSR khớp, không nhảy khi hydrate.
- **Giấy**: nền kraft có vân sợi (SVG `feTurbulence` opacity 0.05).
- **Motion**: vào `back.out(1.7)` 0.6s; rơi `bounce.out` cho polaroid; ra `power2.in` 0.3s.

---

## 3. Nhạc

- **Tâm trạng**: indie folk vui tươi, ukulele/guitar mộc, huýt sáo, không lời.
- **Tempo**: 95–110 BPM. **Độ dài**: 2:00–2:45, lặp.
- **Từ khoá Pixabay**: `indie folk happy acoustic`, `ukulele cheerful`
- **Hành vi**: phát khi bấm mở bìa sổ (C1), âm lượng 0 → 0.6 trong 1.5s. Nút nổi góc trên phải. Ẩn tab → dừng.

---

## 4. Cấu trúc trang

```
┌───────────────────────────┐
│ C1  Bìa sổ vải             │ 100svh  fixed tới khi mở
├───────────────────────────┤
│ C2  Trang 1: tên + sticker │ 100svh ─┐ Pha "SỔ" — ghim, cuộn = lật trang (T7)
│ C3  Trang 2: hai polaroid  │ 100svh ─┘ 2 lần lật, tổng 200svh cuộn
├───────────────────────────┤ ← trang mở phẳng, bắt đầu cuộn dọc tự nhiên (T1)
│ C4  Sợi chỉ đỏ 3 mốc       │ 160svh
│ C5+C6 Note vàng lịch hẹn   │ 120svh
│ C7  Bản đồ dán băng dính   │ 100svh
│ C8  Mặt bàn ảnh (kéo thả)  │ 140svh
│ C15 Phiếu RSVP xé được     │ 100svh
│ C10 Trang cuối + dấu mộc   │ 100svh
└───────────────────────────┘
```

Khung "trang sổ": `min(94vw, 480px)`, nền `kraft`, có gáy lò xo (spiral) SVG dọc mép trái ở pha SỔ. Desktop: sổ ở giữa, xung quanh là mặt bàn gỗ nhạt và vài vật trang trí (bút, kẹp) parallax A4.

---

## 5. Chi tiết từng section

### C1 · Bìa sổ

**Wireframe (360px):**
```
┌────────────────────────────┐
│ ←(nút chung)               │
│ ┌────────────────────────┐ │
│ │▌                       │ │  ← bìa vải `cover`, gáy lò xo mép trái
│ │▌   ┌──────────────┐    │ │
│ │▌   │ Minh Quân    │    │ │  ← nhãn giấy trắng dán lệch −3°
│ │▌   │    &         │    │ │     Patrick Hand 30px, ink
│ │▌   │ Thu Hà       │    │ │
│ │▌   └──────────────┘    │ │
│ │▌      ♥ sticker        │ │
│ │▌                       │ │
│ │▌   [ Mở sổ ra xem ✎ ]  │ │  ← nút coral-dark, ≥ 44px
│ └────────────────────────┘ │
└────────────────────────────┘
```

**Animation vào:**
| t | Hành động |
|---|---|
| 0.0s | Sổ rơi nhẹ vào `y: -40 → 0`, `rotate: -4 → -1.5` (0.7s, `back.out`) |
| 0.5s | Nhãn tên dán vào `scale 1.2 → 1` (0.3s) |
| 0.8s | Sticker ♥ bật `scale 0 → 1` `back.out(3)` |
| lặp | Nút A12 nhẹ (`y ±4`) |

**Khi bấm (tổng 1.2s):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc phát |
| 0.0s | Sổ xoay thẳng `rotate → 0` (0.2s) |
| 0.2s | Bìa lật `rotateY 0 → -180°` quanh mép trái (`origin-left`, `perspective-[1600px]`), 0.8s `power2.inOut`; mặt sau bìa là giấy kraft có dòng *"Sổ này của hai đứa mình ♥"* |
| 1.0s | Lộ C2 bên dưới. Bìa đã lật ẩn đi (`autoAlpha 0`), mở khoá cuộn |

**Reduced-motion:** crossfade 0.3s thay cho lật.

---

### C2 → C3 · Pha "SỔ": lật 2 trang theo cuộn (T7)

Hai trang được xếp chồng trong một khung ghim (`pin`, 200svh cuộn). Cuộn 0–50% → lật trang 1 (C2) sang trái để lộ trang 2 (C3). Cuộn 50–100% → trang 2 đứng yên 30%, sau đó khung sổ **mở phẳng**: gáy lò xo trượt ra khỏi màn, viền trang mờ đi, chuyển sang cuộn dọc (T1).

**C2 · Trang 1**
```
┌────────────────────────────┐
│▌  Hôm nay tụi mình         │  ← Patrick 22px
│▌  cưới nhau rồi! ✎         │
│▌                           │
│▌     Minh Quân             │  ← A11 typewriter, Patrick 44px
│▌         &                 │
│▌       Thu Hà              │
│▌   ♥   ★    (sticker)      │  ← 3 sticker dán rải rác
│▌  Trân trọng mời bạn đến   │  ← Nunito 16px
│▌  chung vui cùng tụi mình. │
│▌          14 . 11 . 2026   │  ← ngày viết tay, cần `date` ⚠️
└────────────────────────────┘
```
**Animation:** tên A11 (TextPlugin, 0.05s/ký tự, tối đa 1.5s — tên dài thì tăng tốc cho vừa 1.5s). Sticker bật lần lượt `back.out(3)` stagger 0.15 sau khi gõ xong.

**C3 · Trang 2: Nhà mình**
```
┌────────────────────────────┐
│▌  Nhà mình ~~~~            │  ← gạch chân vẽ tay A6
│▌ ┌───────┐                 │
│▌ │img[1] │▬▬ washi         │  ← polaroid xoay −6°
│▌ │       │                 │
│▌ │Chú rể │     ┌───────┐   │  ← chú thích Patrick
│▌ └───────┘     │img[2] │   │  ← xoay +5°, lệch xuống
│▌ {groom.addr}  │Cô dâu │   │
│▌               └───────┘   │
│▌               {bride.addr}│
└────────────────────────────┘
```
**Nội dung:** chú thích *"Chú rể — {groom.name}"*, *"Cô dâu — {bride.name}"*; địa chỉ Nunito 14px, tối đa 3 dòng. Tên bố mẹ ⚠️ chưa có → bỏ.
**Animation:** khi trang 2 lộ ra: polaroid rơi `y: -120 → 0` `bounce.out` 0.7s, stagger 0.2; washi "dán" `scaleX 0 → 1` 0.2s sau khi ảnh chạm.

**Reduced-motion (cả pha SỔ):** không pin, không lật; C2 và C3 là 2 trang nằm dọc, fade 0.3s.

---

### C4 · Sợi chỉ đỏ — chuyện tình

**Wireframe:**
```
┌────────────────────────────┐
│  Chuyện tụi mình ~~~       │
│ ●━━━━━┓                    │  ← ghim bấm + chỉ đỏ (coral) A6 scrub
│ ┌─────┃─┐                  │
│ │img[3]┃ │ "Gặp nhau ở quán │
│ └─────┃─┘  cà phê quen"    │
│       ┗━━━━━━━┓            │
│         ┌─────┃─┐          │  ← zig-zag, polaroid nhỏ 55% rộng
│  "Hẹn   │img[4]┃│          │
│  hò lần └─────┃─┘          │
│  đầu"         ┗━━━━┓       │
│              ┌─────┃┐      │
│   "Và anh    │img[5]│      │
│    hỏi…"     └──────┘      │
└────────────────────────────┘
```
**Nội dung (viết sẵn):**
1. *"Gặp nhau ở quán cà phê quen — cả hai cùng gọi một món."*
2. *"Buổi hẹn đầu tiên, mưa to, ướt hết mà vẫn cười."*
3. *"Và anh hỏi: 'Mình về chung một nhà nhé?'"*
**Animation:** sợi chỉ là 1 path SVG vẽ theo scrub (A6). Khi đầu chỉ tới polaroid nào, polaroid đó "bật" `scale 0.8 → 1`, `rotate 0 → rot(i)` `back.out`; chú thích A11.

---

### C5 + C6 · Note vàng "Hẹn nhau nhé!"

**Wireframe:**
```
┌────────────────────────────┐
│     ┌──────────────────┐   │  ← note vàng xoay 2°, ghim đỏ trên đầu
│     │ Hẹn nhau nhé! ✓  │   │
│     │ Thứ Bảy          │   │
│     │ 14 . 11 . 2026   │   │  ← Patrick 34px
│     │ ☐ 10:00 Lễ cưới  │   │  ← checklist viết tay
│     │    tại nhà trai  │   │
│     │ ☐ 18:00 Tiệc     │   │
│     │    {venue.name}  │   │
│     │ Còn 45 ngày nữa! │   │  ← Countdown rút gọn: chỉ số ngày
│     └──────────────────┘   │
└────────────────────────────┘
```
**Nội dung:** ngày/giờ theo `date` ⚠️ (fallback 14.11.2026 18:00; lễ = 10:00 cùng ngày). Đếm ngược chỉ hiện số ngày (*"Còn {n} ngày nữa!"*, n=0 → *"Hôm nay nè!"*, qua rồi → *"Tụi mình cưới rồi ♥"*).
**Animation:** note bay vào từ phải `x: 60 → 0, rotate: 10 → 2` `back.out`; ghim đập xuống `y: -20 → 0` 0.2s; các ô ☐ lần lượt được tick ✓ (A6 vẽ dấu tick màu `sage`, stagger 0.3s).

---

### C7 · Bản đồ dán băng dính

```
┌────────────────────────────┐
│  Đường đến tiệc ~~~        │
│ ▬▬┌────────────────────┐▬▬ │  ← 2 dải washi ở 2 góc trên
│   │                    │   │
│   │   <MapEmbed> 1:1   │   │  ← khung trắng p-2, xoay −1°
│   │                    │   │
│   └────────────────────┘   │
│    {venue.name}            │
│   [ Mở Google Maps → ]     │  ← coral-dark
└────────────────────────────┘
```
**Animation:** khung A1 + washi `scaleX 0 → 1`. MapEmbed lazy (chỉ mount khi cách viewport < 1 màn hình). Map bên trong **không xoay** (chỉ khung ngoài xoay) để không méo tương tác.

---

### C8 · Mặt bàn ảnh (điểm nhấn)

**Wireframe:**
```
┌────────────────────────────┐
│  Lục lọi album nè ~~       │
│  (kéo ảnh ra để xem)       │
│ ┌────────────────────────┐ │  ← vùng `desk`, cao 110svh, overflow hidden
│ │   ┌───┐    ┌───┐       │ │
│ │ ┌─┴─┐ │  ┌─┴─┐ │  ┌───┐│ │  ← 7 polaroid images[3..9] rải ngẫu nhiên
│ │ │   │─┘  │   │─┘  │   ││ │     (seed), chồng lên nhau
│ │ └───┘ ┌───┐ └───┘ └───┘│ │
│ │       │   │  ┌───┐     │ │
│ │       └───┘  │   │     │ │
│ └────────────────────────┘ │
│  [ Xếp lại gọn ]           │  ← nút phụ, đưa ảnh về lưới 2 cột
└────────────────────────────┘
```
**Hành vi:**
- `Draggable.create(".desk-photo", { bounds: desk, inertia: false, onPress: bringToFront })`. Ảnh đang kéo `scale 1.05`, bóng đậm hơn; thả ra `scale 1`.
- Chạm (không kéo, di chuyển < 5px) → A10 lightbox.
- Nút **"Xếp lại gọn"** → Flip các ảnh về lưới 2 cột (và bấm lần nữa thì rải lại).
- **Cuộn trên mobile:** Draggable `type: "x,y"` chặn cuộn khi chạm lên ảnh, nên vùng `desk` có `touch-action: pan-y` qua class `touch-pan-y` cho nền; chỉ ảnh mới bắt drag. Kéo nhanh theo chiều dọc trên ảnh vẫn là kéo ảnh — chấp nhận, vì nền giữa các ảnh còn trống ≥ 30% để cuộn.
- Bàn phím: mỗi ảnh là `button`, Enter mở lightbox; nút "Xếp lại gọn" cho người không kéo được.

**Animation vào:** ảnh rơi lần lượt từ trên (`y: -100vh → vị trí`, `rotate` ngẫu nhiên, `bounce.out` 0.6s, stagger 0.12).
**Reduced-motion:** không rơi; mặc định ở chế độ lưới 2 cột; vẫn kéo được.

---

### C15 · Phiếu RSVP (chỉ giao diện)

```
┌────────────────────────────┐
│ ┌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐ │  ← viền răng cưa trên (xé từ sổ)
│ │ Bạn có đến không? ✎     │ │
│ │ Tên: ____________       │ │  ← input gạch chân, font Patrick
│ │ ◯ Có chứ!  ◯ Tiếc quá   │ │
│ │ Đi mấy người: [1][2][3] │ │  ← nút chọn ≥ 44px
│ │   [ Gửi tụi mình ]      │ │
│ │ Bản xem thử — không     │ │  ← 12px ink-soft
│ │ gửi đi đâu cả.          │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Hành vi:** bấm Gửi → phiếu "gấp đôi" `scaleY 1 → 0` (0.4s) rồi hiện sticker lớn *"Cảm ơn {tên}! Hẹn gặp nhé ♥"*. Không gửi dữ liệu. Tên trống → nút disabled.

---

### C10 · Trang cuối + dấu mộc

```
┌────────────────────────────┐
│   ┌───────────────┐        │
│   │   img[n-1]    │        │  ← polaroid lớn xoay 3°
│   │               │        │
│   │  Hết sổ rồi!  │        │
│   └───────────────┘        │
│  Cảm ơn bạn đã cùng lật    │
│  những trang này với tụi   │
│  mình.                     │
│   ╔═══════════════╗        │
│   ║ JUST MARRIED  ║        │  ← dấu mộc coral, xoay −12°
│   ║ Quân ♥ Hà     ║        │     viền đôi, chữ Nunito 800
│   ╚═══════════════╝        │
└────────────────────────────┘
```
**Animation:** dấu mộc đập xuống: `scale 1.4 → 1`, `opacity 0 → 1` (0.25s `power4.in`) → rung `x: ±3` 3 lần (0.15s) → mực loang (vòng mờ `scale 1 → 1.15, opacity 0.3 → 0`). Tên trên dấu mộc dùng **tên gọi** (từ cuối).

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | Trang trong mặt sau bìa C1 (polaroid nhỏ) + thumb | 1:1 |
| `images[1]` | C3 chú rể | 1:1 |
| `images[2]` | C3 cô dâu | 1:1 |
| `images[3..5]` | C4 ba mốc (và có mặt trên bàn C8) | 1:1 |
| `images[3..9]` | C8 mặt bàn (7 ảnh) | 1:1 |
| `images[9]` | C10 ảnh cuối | 1:1 |

`meta.media = { images: 10, videos: 0 }`. `sampleData` hiện có 4 ảnh → **phải thêm 6 ảnh vào `public/sample/`**.
Ảnh không vuông vẫn hiển thị `object-cover` trong khung 1:1.

## 7. Asset cần chuẩn bị
- [ ] SVG: gáy lò xo, 3 mẫu washi (mask), 5 sticker (tim, sao, mặt cười, máy ảnh, nhẫn), ghim bấm, ghim đẩy đỏ, gạch chân vẽ tay (3 kiểu), dấu tick, khung dấu mộc
- [ ] Texture vải bìa `.webp` ≤ 60KB (hoặc SVG noise)
- [ ] `music.mp3` + `CREDITS.md`
- [ ] 10 ảnh mẫu vuông ≤ 200KB `.webp`
- [ ] `thumb.webp` 600×800: sổ đang mở hé, `opengraph-image.png`

## 8. Tiêu chí nghiệm thu riêng
- [ ] Lật trang T7 theo cuộn mượt, không nháy mặt sau (dùng `backface-hidden`)
- [ ] Kéo ảnh trên C8 bằng chuột và cảm ứng; trên 360px vẫn cuộn qua được C8 bằng cách vuốt vào nền
- [ ] "Xếp lại gọn" dùng được bằng bàn phím
- [ ] Góc xoay giống nhau giữa server và client (không có cảnh báo hydration)
- [ ] Patrick Hand đọc rõ dấu "Trịnh Đức Hưởng" ở 18px

---

## 9. Triển khai code

### 9.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/polaroid-2d/
├── meta.ts
├── layout.tsx                 # Patrick_Hand (--font-hand) + Nunito (--font-body), vietnamese
├── page.tsx                   # return <PolaroidInvite />
└── _components/
    ├── polaroid-invite.tsx    # "use client": ghép, SmoothScroll, OpenGate
    ├── tokens.ts
    ├── seeded.ts              # rot(i), pos(i) — PRNG mulberry32 cố định seed
    ├── seeded.test.ts
    ├── polaroid.tsx           # khung ảnh + washi + chú thích
    ├── cover.tsx              # C1
    ├── book-pages.tsx         # pha SỔ: C2 + C3, pin + T7
    ├── sections/
    │   ├── red-thread.tsx     # C4
    │   ├── sticky-note.tsx    # C5 + C6
    │   ├── map-page.tsx       # C7
    │   ├── photo-desk.tsx     # C8 Draggable + Flip
    │   ├── rsvp-slip.tsx      # C15
    │   └── last-page.tsx      # C10
    └── svg/
```

### 9.2 Tokens
```ts
export const t = {
  root: "min-h-screen bg-[#F4EFE6] text-[#3D405B] font-(family-name:--font-body)",
  hand: "font-(family-name:--font-hand)",
  soft: "text-[#6B6E86]",
  polaroid: "bg-white p-2 pb-10 rounded-[2px] shadow-[0_6px_14px_-6px_rgba(61,64,91,0.45)]",
  btn: "min-h-11 rounded-full bg-[#B85A42] px-5 font-bold text-white",
  washi: "h-6 w-20 bg-[#E07A5F]/70",
  note: "bg-[#F6E27F] shadow-[0_10px_20px_-10px_rgba(61,64,91,0.4)]",
} as const;
```
Góc xoay là giá trị động → dùng `style={{ rotate: `${rot(i)}deg` }}` (được phép theo spec §5: giá trị tính lúc chạy).

### 9.3 Pha SỔ (T7 theo cuộn)
```tsx
// book-pages.tsx (rút gọn)
useGSAP(() => {
  if (reduced) return;
  gsap.timeline({
    scrollTrigger: { trigger: root.current, start: "top top", end: "+=200%", pin: true, scrub: 0.6 },
  })
    .to(".page-1", { rotateY: -180, ease: "power1.inOut", duration: 1 })   // origin-left, backface-hidden
    .add(dropPhotos(), "-=0.2")                                             // polaroid C3 rơi xuống
    .to({}, { duration: 0.6 })                                              // nghỉ
    .to(".spiral", { xPercent: -120, autoAlpha: 0, duration: 0.4 })
    .to(".book-frame", { borderColor: "transparent", boxShadow: "none", duration: 0.4 }, "<");
}, { scope: root, dependencies: [reduced] });
```

### 9.4 Mặt bàn (C8)
```tsx
useGSAP(() => {
  Draggable.create(".desk-photo", {
    bounds: desk.current, zIndexBoost: true,
    onPress() { gsap.to(this.target, { scale: 1.05, duration: 0.15 }); },
    onRelease() { gsap.to(this.target, { scale: 1, duration: 0.2 }); },
    onClick() { openLightbox(Number(this.target.dataset.i)); },   // onClick chỉ bắn khi không kéo
  });
}, { scope: desk });

const tidy = contextSafe(() => {
  const state = Flip.getState(".desk-photo");
  setMode((m) => (m === "scatter" ? "grid" : "scatter"));   // đổi class layout
  requestAnimationFrame(() => Flip.from(state, { duration: 0.6, ease: "power2.inOut", absolute: true }));
});
```
Lưu ý: sau khi kéo, Draggable ghi `transform` inline — trước khi Flip về lưới phải `gsap.set(".desk-photo", { x: 0, y: 0 })`.

### 9.5 Logic cần test
- `seeded.ts`: `rot(i)` luôn trong [-8, 8], cùng input cùng output; `scatter(i, w, h)` nằm trong bounds.
- `nickname(name)` lấy từ cuối (dùng cho dấu mộc) — nếu `@/kit` đã có `initials`/tương tự thì dùng lại.

### 9.6 Thứ tự làm
1. `meta.ts`, `layout.tsx`, `page.tsx`, tokens, thêm 6 ảnh mẫu
2. `polaroid.tsx`, `seeded.ts` + test
3. Section tĩnh C2 → C10 (chưa animation)
4. C1 bìa lật + nhạc
5. Pha SỔ (pin + lật)
6. C8 mặt bàn Draggable + Flip + lightbox
7. Animation C4, C5, C10
8. Reduced-motion, tên dài, Lighthouse, checklist template-spec §12
