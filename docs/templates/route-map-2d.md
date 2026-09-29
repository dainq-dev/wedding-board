# 2D-27 · `route-map-2d` · Bản Đồ Hành Trình

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md). Mẫu tham chiếu cấu trúc: [letter-2d.md](./letter-2d.md).

---

## 0. Design Read + điều chỉnh v2 (29/09/2026), ưu tiên hơn các mục bên dưới khi mâu thuẫn

**Design Read:** thiệp cưới online cho khách mời của một cặp đôi mê xê dịch, hai quê khác nhau; ngôn ngữ *bản đồ giấy cũ, nét mực xanh navy, dấu ✕ đỏ, tem thư*; nghiêng về *editorial phiêu lưu, đồ hoạ phẳng có chiều sâu giấy*.
**Dial:** VARIANCE 8 · MOTION 5 · DENSITY 3.

- **Font:** **Alegreya** (tiêu đề kiểu bản đồ cổ) + **Work Sans** (nội dung). Không dùng Fraunces (bị taste-skill cấm làm mặc định) / Nunito.
- **Đường đi:** thay vì một path khổng lồ phải đo lại theo layout, mỗi chặng giữa hai điểm dừng là một đoạn SVG nét đứt nối liền điểm cuối chặng trước (trái 25% ↔ phải 75%), vẽ dần theo cuộn; nhìn liền một đường suốt trang và không lệch khi đổi kích thước.
- **Minh hoạ:** không vẽ tay núi / sóng / nhà; giấy bản đồ = lưới kinh vĩ tuyến + vết ố; hoa gió bằng gradient hình học.
- **Ảnh:** "bưu thiếp" chứa **toàn bộ** `data.images` (template-spec §2.2), khung tem, có "Xem trọn album". **Mừng cưới:** `<GiftButton>` chung. Nhạc chung, bỏ radio C16.
- Không emoji; không dấu `—` trong chữ hiển thị.

## 1. Concept

**Một câu:** Thiệp là một tấm bản đồ kho báu vẽ tay: một đường nét đứt xuất phát từ nhà chú rể, đi qua các mốc chuyện tình, ghé nhà cô dâu và kết thúc ở dấu ✕ đỏ — nhà hàng tiệc cưới. Người xem cuộn tới đâu, đường được vẽ tới đó, và chiếc la bàn chạy theo.

**Cảm xúc muốn gợi:** vui, tò mò, "cùng lên đường". Mỗi lần dừng chân là một phát hiện nhỏ.

**Phù hợp với:** cặp đôi thích du lịch, phượt, yêu xa rồi về một nhà; cặp đôi hai quê khác nhau (nhà trai một tỉnh, nhà gái một tỉnh). Hợp với ảnh cưới ngoài trời, ảnh du lịch.

**Khác các mẫu khác ở chỗ:** **một SVG path duy nhất dài suốt trang** là xương sống bố cục. Các card không xếp giữa màn hình mà **neo vào điểm dừng** trên path, lúc bên trái lúc bên phải theo đường uốn. Không có chuyển cảnh kiểu ghim/che — chuyển cảnh chính là **đường đi được vẽ tiếp** (A6 scrub toàn trang) + la bàn chạy theo (MotionPath). Kết thúc bằng T6: zoom vào dấu ✕ để đi vào bản đồ thật (`MapEmbed`).

**Moodboard:** bản đồ giấy cũ ố vàng, la bàn đồng, hoa gió (compass rose), tem bưu chính, vé tàu, dấu mộc, hình minh hoạ núi / sóng / cây nét mực.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `bg` | `#F3EAD7` | Nền giấy bản đồ |
| `paper` | `#FBF6EA` | Nền card điểm dừng, nhãn |
| `paper-edge` | `#E6D8BA` | Viền giấy, nếp gấp, đường lưới kinh vĩ tuyến |
| `navy` | `#1F4E79` | Màu chủ đạo: đường đi, tiêu đề, nút |
| `navy-dark` | `#163A5A` | Hover |
| `red` | `#C0392B` | Dấu ✕, điểm dừng hiện tại, ngày cưới |
| `ink` | `#2C2416` | Chữ chính |
| `ink-soft` | `#6B5E48` | Chữ phụ, chú thích tọa độ |
| `sea` | `#9CB8C9` | Mảng biển/sông minh hoạ (không làm chữ) |

Tương phản: `ink` trên `paper` khoảng 14:1 ✅. `ink-soft` trên `paper` khoảng 5.6:1 ✅, trên `bg` khoảng 5.0:1 ✅. Trắng trên `navy` khoảng 8.6:1 ✅. `red` trên `paper` khoảng 5.2:1 ✅ (dùng được cho chữ nhấn). `sea`, `paper-edge` chỉ trang trí.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Fraunces 600 italic, `opsz` lớn | 40px / 1.05 | 72px | Giống chữ tiêu đề bản đồ cổ |
| Tên điểm dừng | Fraunces 600 | 22px | 28px | "Điểm 03 · Nhà cô dâu" |
| Tiêu đề section | Nunito 800, VIẾT HOA, tracking 0.2em | 12px | 13px | |
| Số lớn (ngày) | Fraunces 700 | 72px | 112px | |
| Nội dung | Nunito 400 | 16px / 1.6 | 17px | |
| Toạ độ / chú thích | Nunito 600 italic | 12px | 13px | "10°46′N · 106°42′E" |

Cả hai font có subset `vietnamese`.

### Hình khối và chất liệu
- **Card điểm dừng**: `rounded-lg bg-[#FBF6EA] border-2 border-[#1F4E79]`, bóng cứng lệch `shadow-[4px_4px_0_#1F4E79]` (cảm giác nhãn dán, không bóng mờ).
- **Giấy bản đồ**: lưới kinh vĩ tuyến `bg-[linear-gradient(#E6D8BA_1px,transparent_1px),linear-gradient(90deg,#E6D8BA_1px,transparent_1px)] bg-[size:48px_48px]` + vết ố (2 radial-gradient nâu nhạt `opacity-20`).
- **Đường đi**: `stroke="#1F4E79"`, `stroke-width 3`, `stroke-dasharray "10 8"`, `stroke-linecap round`. Để "vẽ" nét đứt theo scrub, dùng kỹ thuật **mask**: path nét đứt hiển thị, một path nét liền trùng hình làm mask và được DrawSVG (xem 9.4).
- **Điểm dừng**: vòng tròn `navy` 14px; điểm cuối là ✕ `red` 28px nét 4px.
- **Ảnh**: khung như tem thư (viền răng cưa bằng `mask` radial lặp), xoay ±2°.
- **Minh hoạ**: núi, sóng, cây, ngôi nhà vẽ nét mực `navy` 1.5px, rải hai bên path (trang trí, `aria-hidden`).
- **Motion**: đường đi `ease: "none"` theo scrub; phần tử xuất hiện dùng `power2.out` 0.6s; dấu mộc đập xuống `power4.in` 0.25s.

---

## 3. Nhạc

- **Tâm trạng**: acoustic phiêu lưu nhẹ nhàng: guitar mộc, whistle / glockenspiel, tươi sáng, không lời.
- **Tempo**: 95–110 BPM. **Độ dài**: 2:00–3:00, lặp.
- **Từ khoá Pixabay**: `adventure acoustic happy`, `travel ukulele whistle`, `journey folk upbeat`
- **Hành vi**: bắt đầu khi bấm mở cuộn bản đồ (C1), 0 → 0.6 trong 1.5s. C16 là "máy radio" nhỏ ở góc bản đồ (xem C16). Ẩn tab tạm dừng.

---

## 4. Cấu trúc trang

```
┌───────────────────────────┐
│ C1  Cuộn bản đồ (đóng)     │ 100svh
├───────────────────────────┤ ┌─ path SVG tuyệt đối, cao = toàn bộ
│ C2  Tiêu đề bản đồ + hoa   │ │  phần "bản đồ" (≈ 1100svh), vẽ theo
│     gió + chú giải         │ │  scrub; la bàn chạy theo path
│     100svh                 │ │
│ ● 01 Nhà chú rể (C3a)      │ │  ← điểm dừng lệch trái
│      90svh                 │ │
│ ● 02 Nơi gặp nhau (C4-1)   │ │  ← lệch phải
│ ● 03 Lần hẹn đầu (C4-2)    │ │  ← lệch trái
│ ● 04 Lời cầu hôn (C4-3)    │ │  ← lệch phải   (mỗi điểm 90svh)
│ ● 05 Nhà cô dâu (C3b)      │ │  ← lệch trái
│ ● 06 Ngày khởi hành        │ │  ← C5+C11 dạng vé tàu, giữa
│      (120svh)              │ │
│ ● 07 Lịch trình (C12)      │ │  ← chú giải "legend", lệch phải
│ ✕ 08 Kho báu (C6+C7)       │ └─ ← path kết thúc ở ✕
├───────────────────────────┤
│ T6 zoom vào ✕ → bản đồ thật│ 100svh (ghim)
│ C8  Bưu thiếp (album)      │ 120svh
│ C16 Radio                  │  50svh
│ C14 + C15 Hộp thư          │ 140svh
│ C10 Cuộn bản đồ lại        │ 100svh
└───────────────────────────┘
```

Chiều rộng: bản đồ full width; card điểm dừng `w-[min(78vw,360px)]`. Mobile path uốn trong khoảng 12%–88% chiều ngang, card đặt phía ngược với khúc cua. Desktop: bản đồ rộng tối đa `1100px` căn giữa, path uốn rộng hơn, card nằm ngoài khúc cua.

---

## 5. Chi tiết từng section

### C1 · Cuộn bản đồ (màn mở)

**Wireframe (360px):**
```
┌────────────────────────────┐
│                            │
│   ┌──┬──────────────┬──┐   │  ← cuộn giấy nằm ngang: 2 lõi gỗ
│   │▓▓│  BẢN ĐỒ HÀNH  │▓▓│   │     hai đầu, dải giấy hé ở giữa
│   │▓▓│     TRÌNH     │▓▓│   │
│   │▓▓│ Minh Quân &   │▓▓│   │  ← Fraunces 24px
│   │▓▓│   Thu Hà      │▓▓│   │
│   └──┴──────────────┴──┘   │
│      ═══ dây buộc đỏ ═══   │  ← dây red, nút thắt ở giữa
│                            │
│   ( Mở bản đồ )            │  ← nút navy
│  Kéo dây hoặc chạm để mở   │
└────────────────────────────┘
```
**Nội dung:** "BẢN ĐỒ HÀNH TRÌNH" · `{groom.name}` & `{bride.name}` · nút "Mở bản đồ".
**Animation vào:** cuộn giấy lăn vào từ phải `x: 60 → 0, rotate: 8 → 0` (0.8s); dây buộc A6 (0.6s); nút A1. Lặp: la bàn nhỏ trên nút lắc kim `rotate ±12°` 1.6s.

**Khi bấm (tổng 1.8s):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc bắt đầu |
| 0.0s | Dây buộc đứt: hai nửa rơi `y: +40`, `rotate ±30`, `opacity → 0` (0.4s) |
| 0.3s | Dải giấy mở `scaleX 0.35 → 1` từ tâm (0.9s, `power2.inOut`); hai lõi gỗ trượt ra mép `x: ∓45vw` |
| 1.0s | Cuộn giấy phóng to `scale → 3`, `opacity → 0` và lộ C2 phía sau (0.8s) |
| 1.8s | Mở khoá cuộn |

**Reduced-motion:** crossfade 0.3s sang C2. **Edge case:** tên dài → dải giấy cho xuống dòng, cỡ 18px.

---

### C2 · Tiêu đề bản đồ + chú giải

```
┌────────────────────────────┐
│  ✦ hoa gió (compass rose)  │  ← SVG 96px, xoay chậm theo scroll
│                            │
│   Minh Quân                │  ← Fraunces italic 40px
│     &  Thu Hà              │
│  BẢN ĐỒ VỀ CHUNG MỘT NHÀ   │  ← nhãn
│  Tỉ lệ 1 : một đời         │  ← italic 13px, ink-soft
│ ┌─────── CHÚ GIẢI ───────┐ │
│ │ ●  điểm dừng           │ │
│ │ ✕  nơi cất kho báu     │ │
│ │ ┄  đường chúng tôi đi  │ │
│ └────────────────────────┘ │
│  ⌇ path bắt đầu từ đây ↓   │
└────────────────────────────┘
```
**Animation:** tên A2 theo `chars`. Hoa gió `rotate: 0 → 90` theo scrub của toàn C2. Chú giải A1; ký hiệu ┄ trong chú giải tự vẽ (A6, 0.8s).

---

### Điểm 01 · Nhà chú rể (C3 phần nhà trai)

```
┌────────────────────────────┐
│  ●── path đến từ trên      │
│  │ ┌──────────────────┐    │
│  │ │ ĐIỂM 01          │    │
│  │ │ ┌──────┐ Nhà    │    │  ← images[1] khung tem 4:5
│  │ │ │ ảnh  │ chú rể │    │
│  │ │ └──────┘         │    │
│  │ │ Minh Quân        │    │
│  │ │ Quận 1, TP.HCM   │    │  ← groom.address
│  │ │ ⌖ 10°46′N 106°42′E│   │  ← toạ độ trang trí (xem dưới)
│  │ └──────────────────┘    │
│  ╰────────────╮            │
└────────────────────────────┘
```
**Nội dung:** `{groom.name}`, `{groom.address}`. Dòng toạ độ: dữ liệu không có toạ độ nhà trai → hiện toạ độ **trang trí** tạo từ hash của chuỗi địa chỉ (định dạng như thật nhưng không dùng để chỉ đường). Chú thích nhỏ *"(toạ độ minh hoạ)"* chỉ ở `title` attribute. ⚠️ Nếu thấy dễ gây hiểu nhầm, thay bằng dòng "Điểm xuất phát".
Tên bố mẹ ⚠️: nếu có → dòng "Ông … & Bà …" dưới tên.

**Animation (chung cho mọi điểm dừng):**
| Khi | Hành động |
|---|---|
| đầu path chạm vòng tròn điểm dừng | Vòng tròn `scale 0 → 1.4 → 1` (0.4s) và đổi màu `navy → red` trong 0.3s rồi về `navy` |
| cùng lúc | Card A1 từ phía khúc cua (`x: ±30 → 0`), 0.6s |
| +0.3s | Ảnh tem đập xuống như dán tem: `scale 1.2 → 1`, `rotate 0 → ±2°` (0.25s, `power4.in`) |
Điểm "chạm" được tính bằng ScrollTrigger đặt trên chính vòng tròn, `start: "center 60%"` — cùng vị trí mà la bàn đi qua (vì la bàn được đặt ở 60% viewport, xem 9.4).

---

### Điểm 02–04 · Chuyện tình (C4)

Ba card cùng dạng điểm dừng, xen kẽ phải / trái / phải, mỗi card: ảnh tem `images[3]`, `[4]`, `[5]` + tên điểm + 1 câu.

**Nội dung (viết sẵn):**
- **Điểm 02 · Nơi gặp nhau** — *"Hai người lạ, một chuyến đi, và một câu hỏi đường."*
- **Điểm 03 · Lần hẹn đầu** — *"Đi lạc mất hai tiếng, nhưng không ai muốn tìm đường về."*
- **Điểm 04 · Lời cầu hôn** — *"Ở cuối một con dốc, chiếc nhẫn được mở ra. Câu trả lời là: Có."*

**Minh hoạ giữa các điểm:** núi (sau 02), sóng biển (sau 03), cây (sau 04). Mỗi minh hoạ `opacity 0 → 1` khi path đi ngang.

---

### Điểm 05 · Nhà cô dâu (C3 phần nhà gái)

Như Điểm 01 với `images[2]`, `{bride.name}`, `{bride.address}`. Thêm một chiếc "cờ cắm" nhỏ `red` cắm xuống vòng tròn (`y: -20 → 0`, `power4.in`).

---

### Điểm 06 · Ngày khởi hành (C5 + C11)

**Mục đích:** ngày cưới trình bày như **vé tàu / thẻ lên máy bay** — "chuyến đi chung đầu tiên".

```
┌────────────────────────────┐
│ ┌──────────────────┬─────┐ │  ← vé paper, cuống bên phải
│ │ VÉ KHỞI HÀNH     │  ✂  │ │     nét đứt ngăn cuống
│ │ HÀNH KHÁCH       │ 14  │ │
│ │ Minh Quân        │ THG │ │
│ │ & Thu Hà         │ 11  │ │
│ │ TỪ  ── ✈ ──  ĐẾN │     │ │
│ │ Độc thân  Chung  │ GHẾ │ │
│ │           một nhà│ 01A │ │
│ │ THỨ BẢY 14.11.2026│    │ │  ← `date` ⚠️
│ └──────────────────┴─────┘ │
│  T2 T3 T4 T5 T6 T7 CN      │  ← lịch tháng in như mặt sau vé
│  … 13 [14✕] 15             │  ← ngày cưới đánh ✕ đỏ
│  CÒN 45 : 06 : 12 : 33     │  ← A7
└────────────────────────────┘
```
**Animation:** vé trượt ra từ khe (`y: 40 → 0` + `clip-path inset(0 0 100% 0) → inset(0)`, 0.8s). Dấu mộc "ĐÃ XÁC NHẬN" màu `red` đập xuống cuống vé (`scale 1.6 → 1`, `rotate -12°`, 0.25s `power4.in`, rung `x ±2` 0.1s). ✕ trên lịch A6. Đếm ngược A7.
**Edge case:** `date` chưa có ⚠️ → ngày mẫu. Qua ngày cưới → cuống vé đổi thành "ĐÃ KHỞI HÀNH ✓" và câu *"Chúng tôi đã lên đường cùng nhau!"*.

---

### Điểm 07 · Lịch trình (C12) — dạng "chú giải hành trình"

```
┌────────────────────────────┐
│ ┌──── LỊCH TRÌNH NGÀY ───┐ │
│ │ ⚑ 17:00  Tập kết       │ │  ← đón khách
│ │ ⚭ 18:00  Làm lễ        │ │
│ │ ☕ 18:30  Tiếp tế       │ │  ← khai tiệc
│ │ ♫ 20:00  Lửa trại      │ │  ← giao lưu
│ └────────────────────────┘ │
└────────────────────────────┘
```
Icon SVG tự vẽ (cờ, nhẫn, bi đông, đàn), không dùng ký tự emoji. Giờ tính từ `date` như letter-2d (đón khách = tiệc −1h, lễ = tiệc, khai tiệc = +30′, giao lưu = +2h); thiếu giờ → mặc định 18:00.
**Animation:** từng dòng A1 stagger 0.12; icon lắc `rotate -8 → 0` bằng `back.out(3)` (ngoại lệ duy nhất có nảy, nhẹ).

---

### Điểm 08 · Kho báu (C6 + C7) và T6

```
┌────────────────────────────┐
│          ✕                 │  ← path kết thúc, ✕ đỏ 28px
│  ┌──────────────────────┐  │
│  │ KHO BÁU ĐƯỢC CẤT Ở   │  │
│  │ {venue.name}         │  │
│  │ Tiệc cưới 18:00      │  │
│  │ Thứ Bảy, 14.11.2026  │  │
│  │ Lễ vu quy 08:00 tại  │  │
│  │ tư gia nhà gái       │  │  ← dùng bride.address (1 dòng)
│  └──────────────────────┘  │
└────────────────────────────┘
        ↓ cuộn tiếp: T6
┌────────────────────────────┐
│ ┌────────────────────────┐ │
│ │     <MapEmbed/>        │ │  ← lộ ra từ bên trong dấu ✕
│ │     full width 4:5     │ │
│ └────────────────────────┘ │
│  [ ⌖ Chỉ đường tới kho báu]│
└────────────────────────────┘
```
**Animation:** khi path hoàn tất, ✕ được vẽ 2 nét A6 (0.3s mỗi nét). La bàn nhảy vào tâm ✕ và quay 1 vòng `rotate 360` (0.8s).
**T6 (ghim 100svh, scrub):** ✕ `scale 1 → 30` (tâm ✕ là `transform-origin`), bản đồ giấy mờ đi; ở 60% tiến độ, khung `MapEmbed` hiện dưới dạng `clip-path: circle(0% at 50% 50%) → circle(75%)`; thả ghim khi xong.
**Lưu ý:** `MapEmbed` mount trước khi T6 bắt đầu (khi còn cách 1 màn hình), `loading="lazy"`. iframe không nhận `pointer-events` trong lúc ghim để không nuốt cuộn trên mobile (`pointer-events-none` → bật lại khi ghim xong).
**Reduced-motion:** không zoom, ✕ và bản đồ hiện dọc bình thường.

---

### C8 · Bưu thiếp (album)

```
┌────────────────────────────┐
│   BƯU THIẾP TỪ DỌC ĐƯỜNG   │
│ ┌────────────────────────┐ │
│ │ ┌─────────────┐ ┌───┐  │ │  ← bưu thiếp: ảnh bên trái,
│ │ │  images[3]  │ │tem│  │ │     tem + dấu bưu điện bên phải
│ │ │             │ └───┘  │ │
│ │ └─────────────┘ ─────  │ │
│ └────────────────────────┘ │
│         ● ○ ○ ○            │
│    Vuốt để lật bưu thiếp → │
└────────────────────────────┘
```
**Hành vi:** carousel ngang dạng `snap-x snap-mandatory overflow-x-auto` (native, không cần Draggable). Ảnh: `images[3..5]` + `images[0]` (4 bưu thiếp). Bấm bưu thiếp → lật `rotateY 180` (0.6s) xem mặt sau: dòng chữ viết sẵn *"Gửi những người thương, từ chuyến đi của chúng tôi."*; bấm ảnh ở mặt trước lần nữa → A10 lightbox.
**Accessibility:** vùng cuộn có `tabIndex={0}` và `aria-label="Album bưu thiếp"`; nút ← → trên desktop; mỗi ảnh `alt="Bưu thiếp 1/4"`.

---

### C16 · Radio hành trình

```
┌────────────────────────────┐
│  ┌──────────────────────┐  │
│  │ ◉ RADIO DỌC ĐƯỜNG    │  │  ← hộp radio minh hoạ
│  │ ▁▃▅▇▅▃▁  ▶/❚❚        │  │  ← vạch sóng nhảy khi phát
│  │ "Bài hát của chúng   │  │
│  │  tôi"                │  │
│  └──────────────────────┘  │
└────────────────────────────┘
```
Đồng bộ với `MusicPlayer` (cùng audio). Vạch sóng: 7 thanh `scaleY` ngẫu nhiên mỗi 180ms khi đang phát, đứng yên khi dừng hoặc reduced-motion.

---

### C14 + C15 · Hộp thư

```
┌────────────────────────────┐
│   HỘP THƯ HÀNH TRÌNH       │
│ ┌────────────────────────┐ │
│ │ Gửi lời chúc & xác nhận│ │
│ │ [ Tên của bạn       ]  │ │
│ │ (•) Sẽ có mặt  ( ) Bận │ │
│ │ Số người [ 1 ▾ ]       │ │
│ │ [ Bỏ thư ✉ ]           │ │
│ │ Bản xem thử — không gửi│ │
│ └────────────────────────┘ │
│  Quà mừng: ┌──┐ ┌──┐       │  ← QR ⚠️, dán như tem
│            └──┘ └──┘       │
└────────────────────────────┘
```
**Hành vi:** bấm "Bỏ thư" → form gấp thành phong thư (`scaleY → 0.3`, `rotateX 60`), trượt vào khe hộp thư (`y → 80`, `opacity → 0`), hiện *"Thư của {tên} đã tới nơi!"* kèm dấu mộc. Không gửi dữ liệu. QR bấm → A10.

---

### C10 · Cuộn bản đồ lại

```
┌────────────────────────────┐
│  ┌──────────────────────┐  │
│  │ images[n-1] khung tem│  │
│  └──────────────────────┘  │
│  Hành trình mới bắt đầu.   │  ← Fraunces italic 26px
│  Hẹn gặp bạn ở dấu ✕!      │
│     Minh Quân & Thu Hà     │
│   ┌──┬──────────┬──┐       │  ← bản đồ cuộn lại (đảo C1)
└────────────────────────────┘
```
**Animation (scrub):** toàn bộ vùng bản đồ phía trên `scaleX 1 → 0.35` về tâm, hai lõi gỗ trượt vào, dây buộc thắt lại. Gương của C1.

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | C8 bưu thiếp cuối + `og:image` | 3:2 |
| `images[1]` | Điểm 01 nhà chú rể | 4:5 |
| `images[2]` | Điểm 05 nhà cô dâu | 4:5 |
| `images[3..5]` | Điểm 02–04, lặp lại trong C8 | 4:5 (điểm dừng), 3:2 (bưu thiếp, `object-cover`) |
| `images[5]` (= `n-1`) | C10 ảnh cuối | 4:5 |

`meta.media = { images: 6, videos: 0 }`

⚠️ Ảnh bìa `images[0]` không nằm ở màn đầu (C1 là cuộn bản đồ vẽ). Đây là lựa chọn có chủ ý của concept; nếu cần bìa ở đầu, đặt `images[0]` mờ 20% làm nền dải giấy của C1.

---

## 7. Asset cần chuẩn bị
- [ ] SVG: cuộn giấy (dải + 2 lõi gỗ), dây buộc (2 nửa), hoa gió, la bàn, ✕, cờ cắm, 3 minh hoạ (núi, sóng, cây), ngôi nhà, radio, hộp thư, 4 icon lịch trình, khung tem (mask)
- [ ] Path chính: 2 phiên bản `d` (mobile `viewBox 0 0 100 1100`, desktop `viewBox 0 0 100 800`) — vẽ trong Figma/Inkscape, lưu thành hằng trong `route-path.ts`
- [ ] `music.mp3` (Pixabay) + `CREDITS.md`
- [ ] 6 ảnh mẫu du lịch/ngoài trời ≤ 300KB `.webp`
- [ ] `thumb.webp` 600×800: bản đồ đang mở, đường nét đứt, ✕ đỏ
- [ ] `opengraph-image.png` 1200×630

## 8. Tiêu chí nghiệm thu riêng
- [ ] Đầu nét vẽ và la bàn luôn trùng nhau (sai lệch ≤ 8px) ở mọi vị trí cuộn, cả khi resize từ 360 → 1440
- [ ] Mỗi điểm dừng "sáng lên" đúng lúc la bàn đi qua nó
- [ ] Cuộn ngược thì đường bị xoá ngược lại (scrub hai chiều), không kẹt trạng thái
- [ ] T6 không làm iframe bản đồ nuốt thao tác cuộn trên iOS Safari
- [ ] 60fps trên điện thoại tầm trung: chỉ animate `transform`, `opacity`, `stroke-dashoffset` (DrawSVG)

---

## 9. Triển khai code

### 9.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/route-map-2d/
├── meta.ts
├── layout.tsx                 # Fraunces + Nunito (vietnamese)
├── page.tsx                   # return <RouteMapInvite />
└── _components/
    ├── route-map-invite.tsx   # "use client" — tokens `t`, ghép section
    ├── map-scroll.tsx         # C1 (mode "open") + C10 (mode "close")
    ├── route-layer.tsx        # SVG path + mask + la bàn, ScrollTrigger toàn bản đồ
    ├── route-path.ts          # hằng `d` mobile/desktop + toạ độ % của 8 điểm dừng
    ├── stop.tsx               # card điểm dừng dùng chung (side: "left" | "right")
    ├── sections/
    │   ├── map-title.tsx      # C2
    │   ├── ticket.tsx         # Điểm 06: C5 + C11
    │   ├── legend.tsx         # Điểm 07: C12
    │   ├── treasure.tsx       # Điểm 08: C6 + C7 + T6
    │   ├── postcards.tsx      # C8
    │   ├── radio.tsx          # C16
    │   └── mailbox.tsx        # C14 + C15
    ├── fake-coords.ts         # hash địa chỉ → toạ độ trang trí
    └── svg/
```

### 9.2 Tokens
```ts
export const t = {
  root: "relative min-h-svh bg-[#F3EAD7] text-[#2C2416] font-(family-name:--font-body)",
  grid: "bg-[linear-gradient(#E6D8BA_1px,transparent_1px),linear-gradient(90deg,#E6D8BA_1px,transparent_1px)] bg-[size:48px_48px]",
  card: "rounded-lg border-2 border-[#1F4E79] bg-[#FBF6EA] shadow-[4px_4px_0_#1F4E79]",
  display: "font-(family-name:--font-display)",
  label: "text-xs font-extrabold uppercase tracking-[0.2em] text-[#1F4E79]",
  soft: "text-[#6B5E48]",
  btn: "inline-flex h-12 items-center gap-2 rounded-full bg-[#1F4E79] px-6 font-bold text-white hover:bg-[#163A5A]",
} as const;
```

### 9.3 Đặt card theo path
`route-path.ts` export `STOPS: { id, x: number /*% ngang*/, y: number /*% dọc*/, side }[]` cho mobile và desktop. `route-layer.tsx` là `absolute inset-0` phủ toàn vùng bản đồ, SVG `preserveAspectRatio="none"` và `vector-effect="non-scaling-stroke"` để nét không bị kéo giãn. Card `stop.tsx` đặt `absolute` với `top: y%` và `left/right` tuỳ `side` — dùng `style={{ top: \`${y}%\` }}` (giá trị động, được phép theo spec §5). Vòng tròn điểm dừng đặt đúng `x%, y%`.

⚠️ Với `preserveAspectRatio="none"`, `MotionPathPlugin` vẫn tính theo toạ độ SVG → cần `alignOrigin` và `align: "#route"` để GSAP tự quy đổi ma trận; kiểm lại khi resize (gọi `ScrollTrigger.refresh()` sau `resize` debounce 200ms).

### 9.4 Vẽ đường + la bàn theo scrub
```tsx
// route-layer.tsx (rút gọn)
gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin);

useGSAP(() => {
  if (reduced) { gsap.set("#route-mask", { drawSVG: "100%" }); return; }
  const st = { trigger: root.current, start: "top 60%", end: "bottom 60%", scrub: 0.6 };
  gsap.fromTo("#route-mask", { drawSVG: "0%" }, { drawSVG: "100%", ease: "none", scrollTrigger: st });
  gsap.to("#compass", {
    ease: "none", scrollTrigger: st,
    motionPath: { path: "#route", align: "#route", alignOrigin: [0.5, 0.5], autoRotate: false },
  });
}, { scope: root, dependencies: [reduced, isDesktop] });
```
- `#route`: path nét đứt hiển thị, có `mask="url(#route-reveal)"`.
- `#route-mask`: path nét liền **cùng `d`**, nằm trong `<mask id="route-reveal">`, `stroke="white"`, được DrawSVG. Kết quả: nét đứt lộ ra dần mà không làm hỏng `dasharray`.
- La bàn quay kim theo hướng path bằng một tween phụ: `autoRotate` chỉ áp cho kim (`#needle`), thân la bàn đứng yên.
- Vì cùng `start/end` và ease `none`, đầu nét và la bàn luôn trùng nhau (tiêu chí nghiệm thu).

### 9.5 Kích hoạt điểm dừng
```tsx
STOPS.forEach((s) => ScrollTrigger.create({
  trigger: `#dot-${s.id}`, start: "center 60%",
  onEnter: () => pop(s.id), onLeaveBack: () => unpop(s.id),
}));
```
`pop` chạy timeline nhỏ (vòng tròn + card + tem). `unpop` đảo ngược để cuộn lên vẫn đúng.

### 9.6 Logic cần test
- `fakeCoords(address)` ổn định (cùng input → cùng output), luôn nằm trong khoảng lãnh thổ VN (8–23°N, 102–110°E), định dạng `10°46′N · 106°42′E`.
- `STOPS` mobile và desktop có cùng số lượng và thứ tự `id` như path.
- `scheduleTimes(date)` và lưới lịch như các mẫu khác.

### 9.7 Thứ tự làm
1. `meta.ts`, `layout.tsx`, `page.tsx`, tokens, nền giấy
2. Vẽ path mobile/desktop, `route-path.ts`, đặt card tĩnh đúng điểm dừng ở 360 / 768 / 1440
3. `route-layer.tsx`: mask + DrawSVG + la bàn (quan trọng nhất, làm sớm)
4. `map-scroll.tsx` mở/đóng + nhạc
5. Điểm dừng pop, vé tàu, chú giải
6. T6 kho báu + MapEmbed
7. Bưu thiếp, radio, hộp thư
8. Reduced-motion (path vẽ sẵn, không la bàn chạy), resize, checklist template-spec §12
