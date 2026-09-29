# 2D-20 · `cafe-2d` · Cà Phê Sài Gòn

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md). Cấu trúc tài liệu theo mẫu chuẩn [letter-2d.md](./letter-2d.md).

---

## 0. Design Read + điều chỉnh v2 (29/09/2026), ưu tiên hơn các mục bên dưới khi mâu thuẫn

**Design Read:** thiệp cưới online cho khách mời của một cặp đôi trẻ, quen nhau ở quán cà phê, cưới thân mật với nhiều bạn bè; ngôn ngữ *quán cà phê vỉa hè Sài Gòn về đêm, bảng phấn, đèn dây*; nghiêng về *lo-fi ấm, thủ công, có duyên* chứ không "dễ thương" gượng ép.
**Dial:** VARIANCE 7 · MOTION 5 · DENSITY 3.

- **Font:** Pangolin (chữ phấn, tên & tiêu đề) + **Lexend** (nội dung). Không dùng Be Vietnam Pro (đã là font của dashboard).
- **Bảng màu khoá:** nền `night`, bảng `board`, chữ `chalk`, nhấn duy nhất cho chữ là `chalk-yellow`; `caramel` chỉ cho nút; `straw-red` chỉ cho ống hút. Radius khoá 12px cho mọi khối và nút.
- **Ảnh:** theo template-spec §2.2, *tường ảnh đèn dây* chứa **toàn bộ** `data.images` (không `images[3..n-2]`), nhịp hàng 2 / 3 ảnh xen kẽ, có Lightbox + "Xem trọn album".
- **Mừng cưới:** phần "thanh toán" của hoá đơn dùng `<GiftButton>` chung thay cho 2 QR mẫu.
- **Nhạc:** nhạc chung `useMusic()`; bỏ C16 radio cassette (trùng chức năng `MusicToggle`).
- **Chuyển chương "rót đầy":** là section cuộn có lớp cà phê dâng theo scrub (không dùng lớp phủ `fixed`), không thể kẹt lớp phủ khi cuộn ngược.
- **Văn phong:** thân mật nhưng lễ độ ("Trân trọng mời bạn ghé quán"), không emoji, không dấu `—` trong chữ hiển thị.

## 1. Concept

**Một câu:** Khách ngồi xuống một quán cà phê vỉa hè Sài Gòn; phin đang nhỏ giọt, bấm vào là ly đầy cà phê và tấm bảng phấn ghi *"Menu hôm nay: Cưới"* hiện ra — mỗi phần của thiệp là một món trong menu.

**Cảm xúc muốn gợi:** thân mật, thư thả, vui kiểu bạn bè ("ghé làm ly cà phê rồi đi đám cưới tụi mình nha"). Ấm, hơi lo-fi.

**Phù hợp với:** cặp đôi yêu cà phê, quen nhau ở quán, cưới nhẹ nhàng/tiệc thân mật, nhiều bạn bè trẻ; ảnh cưới đời thường, tông nâu ấm.

**Khác các mẫu khác ở chỗ:** nền **tối** (gỗ/đêm Sài Gòn) với chữ **viết phấn** trên bảng đen — là mẫu 2D nền tối duy nhất trong nhóm này. Chuyển cảnh chính là **"rót đầy" (T4 biến thể)**: một lớp cà phê/sữa dâng từ dưới lên che kín màn hình (mặt sóng SVG) để chuyển chương. Mỗi món là một "ly nhựa có nhãn dán" hoặc một mục trên bảng phấn, giá tiền là những con số đùa ("Giá: 1 lời chúc").

**Moodboard:** phin nhôm, ly nhựa có đá, ống hút đỏ, ghế nhựa đỏ thấp, bảng đen viết phấn trắng/vàng, tờ hoá đơn giấy nhiệt, đèn dây vàng, ly bạc xỉu tầng sữa – cà phê, gói đường, biển hiệu kẻ tay.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `night` | `#2B1D14` | Nền trang (gỗ tối), chữ trên nền sáng |
| `board` | `#1F2A24` | Bảng phấn (xanh đen) |
| `chalk` | `#F2EEE3` | Chữ phấn trắng trên `board`/`night` |
| `chalk-yellow` | `#E9C46A` | Chữ phấn vàng: tên món, giá, nhấn |
| `latte` | `#F5ECD9` | Surface sáng: hoá đơn, thẻ ly, form |
| `coffee` | `#6F4A2F` | Lớp cà phê trong chuyển cảnh rót |
| `caramel` | `#C58B4E` | Primary: nút, viền thẻ, ống hút nhạt |
| `straw-red` | `#D0402B` | Nhấn hiếm: ống hút đỏ, ghế nhựa, trái tim |
| `ink-soft` | `#6A5646` | Chữ phụ trên `latte` |

Tương phản: `chalk` trên `board` ≈ 13:1 ✅. `chalk-yellow` trên `board` ≈ 9:1 ✅. `chalk` trên `night` ≈ 14:1 ✅. `night` trên `latte` ≈ 14:1 ✅. `ink-soft` trên `latte` ≈ 5.8:1 ✅. Chữ `night` trên `caramel` ≈ 5.6:1 ✅ (nút dùng chữ `night`, **không** dùng chữ trắng trên `caramel` — chỉ ≈ 2.6:1 ❌).

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Pangolin | 40px / 1.1 | 64px | Như viết phấn, `chalk-yellow` |
| Tên món / tiêu đề section | Pangolin | 26px / 1.2 | 36px | |
| Giá, nhãn trên bảng | Pangolin | 18px | 20px | |
| Nội dung | Be Vietnam Pro 400 | 16px / 1.6 | 17px | |
| Nhãn nhỏ, hoá đơn | Be Vietnam Pro 500, VIẾT HOA, tracking 0.12em | 12px | 13px | Hoá đơn dùng `tabular-nums` |

Hai font đều có subset `vietnamese`. Pangolin chỉ có 1 độ đậm (400): không dùng `font-bold` với nó (trình duyệt sẽ tự làm đậm giả, xấu).

### Hình khối và chất liệu
- **Bảng phấn**: `bg-[#1F2A24]`, khung gỗ 10px `border-[#5A3E2B]`, bo `rounded-xl`. Vệt phấn lau mờ: 2–3 `radial-gradient` trắng opacity 0.04–0.06.
- **Chữ phấn**: text-shadow nhẹ nhoè `[text-shadow:0_0_1px_rgba(242,238,227,0.6)]` + lớp mask nhiễu SVG để nét hơi rỗ (component `<Chalk>` bọc chữ).
- **Ly nhựa**: hình thang (`[clip-path:polygon(8%_0,92%_0,82%_100%,18%_100%)]`) có mực nước, đá (ô vuông mờ), ống hút đỏ; **nhãn dán** tròn `latte` trên thân ly chứa nội dung ngắn.
- **Hoá đơn**: `latte`, mép trên/dưới răng cưa (mask), font `tabular-nums`, kẻ gạch ngang `border-dashed`.
- **Ảnh**: dán lên tường bằng băng keo giấy (2 mảnh `bg-[#E9DDBF]/80` xoay ±8° ở góc), hoặc polaroid.
- **Radius**: `0.75rem` mặc định.
- **Motion**: ease chủ đạo `power1.inOut` — chậm, lười biếng, như nhịp nhỏ giọt. Vào 0.8s. Không nảy, riêng giọt cà phê dùng `power2.in` (rơi).

---

## 3. Nhạc

- **Tâm trạng**: lo-fi acoustic: guitar gỗ, Rhodes, trống brush nhẹ, có tiếng mưa/tiếng quán rất nhỏ nền (nếu bài sẵn có); không lời.
- **Tempo**: 75–85 BPM. **Độ dài**: 2:00–3:00, lặp lại.
- **Từ khoá Pixabay**: `lofi coffee acoustic`, `cafe lofi guitar`, `chill coffee shop`
- **Hành vi**:
  - Bắt đầu khi chạm vào phin (C1), âm lượng 0 → 0.6 trong 2s (chậm hơn chuẩn, hợp mood).
  - C16 dựng thành radio cassette trên quầy.
  - Ẩn tab thì tạm dừng.

---

## 4. Cấu trúc trang

Trang chia **3 chương** như 3 lượt gọi món. Giữa các chương là chuyển cảnh **rót đầy** (T4 biến thể, ghim 70svh). Bên trong chương cuộn tự nhiên (T1).

```
┌───────────────────────────┐
│ C1  Phin nhỏ giọt          │ 100svh  (cố định tới khi chạm)
├─── rót đầy (bấm) ─────────┤
│ C2  Bảng phấn "Menu hôm nay"│ 100svh  viết phấn A11
├═ CHƯƠNG 1 · ĐỒ UỐNG ══════┤
│ C3  "Hai ly đen đá" – cặp đôi│ 100svh  2 ly nhựa + images[1],[2]
│ C4  "Bạc xỉu 3 tầng" – chuyện│ 150svh  3 tầng = 3 mốc, ghim + dâng mực
│ C16 Radio cassette         │  60svh
├─── rót đầy (T4) ──────────┤  70svh ghim
├═ CHƯƠNG 2 · HẸN GẶP ══════┤
│ C5+C11 "Hẹn ngày"          │ 100svh  tờ lịch dán lên bảng + đếm ngược
│ C12 Order ticket lịch trình│  80svh
│ C6+C7 "Địa chỉ quán"       │ 140svh  2 lễ + bản đồ
│ C13 Dress code gói đường   │  60svh
├─── rót đầy (T4) ──────────┤  70svh ghim
├═ CHƯƠNG 3 · Ở LẠI CHƠI ═══┤
│ C8  Tường ảnh đèn dây      │ 180svh
│ C14+C15 Hoá đơn            │ 140svh  mừng cưới + xác nhận = "thanh toán"
│ C10 "Hẹn gặp lại"          │ 100svh  ly cạn
└───────────────────────────┘
```

Chiều rộng nội dung: `min(92vw, 460px)` ở giữa. Desktop: hai bên là cảnh quán mờ (ghế nhựa đỏ, đèn dây) dạng lớp parallax A4, `data-speed` 0.8/0.9.

---

## 5. Chi tiết từng section

### C1 · Phin nhỏ giọt (màn mở thiệp)

**Mục đích:** khoảnh khắc chờ phin — chậm lại một nhịp; chạm là "cà phê xong", đồng thời mở khoá nhạc.

**Wireframe (360px):**
```
┌────────────────────────────┐
│   Quân & Hà mời bạn        │  ← Pangolin 22px, chalk
│   một ly cà phê ☕          │
│                            │
│         ┌──────┐           │  ← nắp phin
│         ├──────┤           │  ← thân phin nhôm (SVG)
│         └─┬──┬─┘           │
│           ·                │  ← giọt cà phê rơi (A8, 1 hạt)
│       ┌───────────┐        │
│       │  ~~~~~~   │        │  ← ly thuỷ tinh, mực cà phê thấp
│       │ ▒ sữa ▒▒  │        │     (lớp sữa đặc dưới đáy)
│       └───────────┘        │
│                            │
│   Chạm vào phin để         │  ← Be Vietnam Pro 14px, chalk/70
│   cà phê chảy nhanh hơn    │
└────────────────────────────┘
```

**Nội dung:** *"{tên gọi chú rể} & {tên gọi cô dâu} mời bạn một ly cà phê"*, dòng hướng dẫn *"Chạm vào phin để cà phê chảy nhanh hơn"*. Toàn bộ phin + ly là `<button aria-label="Mở thiệp mời">`.

**Animation vào + chờ:**
| t | Hành động |
|---|---|
| 0.0s | Phin + ly A1 (0.8s) |
| 0.4s | Dòng mời A11 như viết phấn (typewriter, 0.04s/ký tự) |
| 1.2s → lặp | Giọt cà phê: `y: 0 → đáy ly`, `scaleY 1 → 1.4` khi rơi (0.6s, `power2.in`), chạm mặt ly thì gợn tròn `scale 0 → 1, opacity 1 → 0` (0.4s); mỗi giọt cách 1.4s; mực cà phê dâng thêm 1px mỗi giọt (tối đa 20px) |
| lặp | Hơi nước 2 sợi SVG bay lên A12 |

**Khi chạm (timeline "rót đầy", 1.6s):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc bắt đầu |
| 0.0s | Giọt chuyển thành dòng chảy liên tục (dòng SVG `scaleY 0 → 1`, 0.3s) |
| 0.2s | Mực cà phê trong ly dâng đầy (0.6s) |
| 0.6s | **Rót đầy toàn màn hình**: lớp `coffee` với mép trên là sóng SVG dâng từ đáy lên đỉnh viewport (`yPercent 100 → 0`, 0.7s, `power1.inOut`); sóng dịch ngang liên tục |
| 1.3s | Lớp cà phê "khuấy" thành màu bạc xỉu (`coffee → latte` crossfade 0.2s) rồi rút xuống lộ C2 (`yPercent 0 → -100`, 0.3s) |
| 1.6s | Mở khoá cuộn, ScrollSmoother |

**Reduced-motion:** không giọt lặp, không rót; chạm → crossfade 0.3s.
**Edge case:** tên gọi dài → dòng mời xuống 2 dòng; phin/ly giữ nguyên kích thước.

---

### C2 · Bảng phấn "Menu hôm nay"

**Wireframe:**
```
┌────────────────────────────┐
│ ╔════════════════════════╗ │  ← khung gỗ
│ ║  MENU HÔM NAY:         ║ │  ← Pangolin 26px chalk
│ ║       CƯỚI ♥           ║ │  ← Pangolin 44px chalk-yellow
│ ║ ────────────────────── ║ │  ← gạch phấn
│ ║  Minh Quân             ║ │  ← <h1> Pangolin 40px chalk-yellow
│ ║        &               ║ │
│ ║      Thu Hà            ║ │
│ ║ Trân trọng mời bạn ghé ║ │
│ ║ quán vào Thứ Bảy       ║ │
│ ║ 14.11.2026             ║ │  ← ⚠️ date
│ ║   ╭────────╮           ║ │
│ ║   │images[0]│ ← ảnh dán ║ │     băng keo 2 góc, xoay 2°
│ ║   ╰────────╯           ║ │
│ ╚════════════════════════╝ │
└────────────────────────────┘
```
**Animation:**
| t | Hành động |
|---|---|
| 0.0s | Bảng A1 |
| 0.3s | "MENU HÔM NAY:" A11 (0.05s/ký tự) + viên phấn SVG chạy theo con trỏ chữ |
| 1.0s | "CƯỚI ♥" A11 |
| 1.3s | Gạch phấn vẽ A6 (0.4s) |
| 1.6s | Tên A11 theo **từ** (không theo ký tự, để tên dài không mất quá 2s), mỗi từ 0.12s |
| 2.2s | Ảnh dán rơi vào `rotate 8° → 2°` + băng keo "đè" xuống |

**Lưu ý A11:** TextPlugin tách theo ký tự Unicode đã chuẩn hoá NFC, để dấu tiếng Việt không bị hiện tách (vd "ệ" không thành "e" + dấu). Chuẩn hoá bằng `name.normalize("NFC")` trước khi đưa vào.
**Reduced-motion:** hiện toàn bộ chữ, fade 0.3s.

---

### C3 · "Hai ly đen đá" (cặp đôi)

```
┌────────────────────────────┐
│ ĐỒ UỐNG · 01               │
│ Hai ly đen đá  ......  x2  │  ← tên món + giá
│ ┌──────┐      ┌──────┐     │
│ │ ◯ảnh │ │    │ ◯ảnh │ │   │  ← 2 ly nhựa, nhãn dán tròn là
│ │  [1] │ │    │  [2] │ │   │     ảnh chân dung, ống hút đỏ
│ └──────┘      └──────┘     │
│ Chú rể         Cô dâu      │
│ Minh Quân      Thu Hà      │  ← Pangolin 24px
│ Quận 1, TP.HCM Ba Đình, HN │  ← address 14px, tối đa 3 dòng
│ "Đậm vừa, ít đường"  "Nhiều│  ← ghi chú order vui, viết sẵn
│                  sữa"      │
└────────────────────────────┘
```
**Nội dung:** `groom.*`, `bride.*`. Tên bố mẹ ⚠️ → dòng "Con ông … & bà …" dưới tên nếu có. Ghi chú order vui viết sẵn.
**Animation:** 2 ly trượt vào từ 2 bên như được đẩy trên bàn (`x: ∓120 → 0`, `rotate ∓6° → 0`, 0.8s), đá trong ly lắc nhẹ khi dừng (`rotate ±4°`, 2 lần). Nhãn ảnh A3.
**Mobile < 360px:** 1 cột.

---

### C4 · "Bạc xỉu 3 tầng" (chuyện tình, ghim)

**Mục đích:** 3 mốc chuyện tình = 3 tầng của ly bạc xỉu (sữa → cà phê → bọt). Cuộn tới đâu ly dâng tới đó.

**Wireframe (ghim 150svh):**
```
┌────────────────────────────┐
│ ĐỒ UỐNG · 02               │
│ Bạc xỉu ba tầng ... vô giá │
│   ┌──────────────┐         │
│   │░░ bọt ░░░░░░░│ ← tầng 3│  ┌──────────────┐
│   │▓▓ cà phê ▓▓▓▓│ ← tầng 2│  │ ▣ ảnh mốc    │ ← thẻ bên cạnh,
│   │▒▒ sữa ▒▒▒▒▒▒▒│ ← tầng 1│  │ Tầng 2:      │   đổi theo tầng
│   └──────────────┘         │  │ Thương       │
│                            │  │ "…"          │
│  ● ● ○                     │  └──────────────┘
└────────────────────────────┘
```
Trên 360px thẻ nằm **dưới** ly thay vì bên cạnh.

**Nội dung viết sẵn:**
1. *Tầng sữa — Gặp gỡ:* "Ngọt ngào mà không ai để ý, như lần đầu tụi mình gặp nhau." (`images[3]`)
2. *Tầng cà phê — Thương:* "Rồi có những ngày đậm đà, có cả ngày hơi đắng, nhưng luôn muốn uống thêm." (`images[4]`)
3. *Tầng bọt — Về chung nhà:* "Và phần trên cùng nhẹ tênh: tụi mình quyết định cưới." (`images[5]`)

**Animation (scrub):**
| progress | Hành động |
|---|---|
| 0 → 0.33 | Tầng sữa dâng `scaleY 0 → 1` (origin bottom); thẻ 1 A1 |
| 0.33 → 0.66 | Tầng cà phê dâng; ranh giới 2 tầng có sóng nhẹ; thẻ đổi sang 2 (crossfade) |
| 0.66 → 1 | Tầng bọt dâng + vài bong bóng nổi `y` ngẫu nhiên; thẻ 3 |

**Tương tác:** chạm ảnh trong thẻ → A10.
**Reduced-motion:** không ghim; ly vẽ sẵn đủ 3 tầng, 3 thẻ xếp dọc.

---

### C16 · Radio cassette trên quầy

```
┌────────────────────────────┐
│ ┌────────────────────────┐ │
│ │ ◎  ╭──╮ ╭──╮   ◎       │ │  ← cassette, 2 cuộn băng quay
│ │    ╰──╯ ╰──╯           │ │
│ │ Bài hát của chúng tôi  │ │
│ │ [ ▶ / ❚❚ ]  ───●── 1:12│ │
│ └────────────────────────┘ │
│ Chạm để nghe bài hát của   │
│ chúng tôi                  │
└────────────────────────────┘
```
Đồng bộ `<MusicPlayer>`. Hai cuộn băng `rotate 360` lặp (linear, 3s) **chỉ khi đang phát** (tween `paused` theo trạng thái audio).

---

### Rót đầy giữa chương (T4 biến thể)

**Cách làm:** vùng ghim 70svh. Lớp phủ `fixed inset-0` màu `coffee` (chương 1→2) hoặc `latte` (chương 2→3), mép trên là sóng SVG. Scrub: `yPercent 100 → 0` (0–50%), tên chương mới viết phấn hiện trên lớp phủ ("CHƯƠNG 2 · HẸN GẶP"), rồi `yPercent 0 → -100` (50–100%) để lộ chương mới. Sóng dịch ngang bằng tween lặp riêng (`x: -50%`, 3s, linear) chỉ chạy khi lớp phủ đang thấy (`onToggle`).
**z-index:** lớp phủ `z-40` (< 50, dưới nút chung).
**Reduced-motion:** thay bằng tiêu đề chương tĩnh trên dải `coffee` cao 30svh, không ghim.

---

### C5 + C11 · "Hẹn ngày"

```
┌────────────────────────────┐
│ ╔════════════════════════╗ │  ← bảng phấn
│ ║ HẸN NHAU NGÀY          ║ │
│ ║   ┌──────────┐         ║ │  ← tờ lịch nhỏ dán băng keo
│ ║   │ THÁNG 11 │         ║ │
│ ║   │   14     │         ║ │  ← Pangolin 72px, night trên latte
│ ║   │ THỨ BẢY  │         ║ │
│ ║   └──────────┘         ║ │
│ ║ Còn 45 ngày 06:12:33   ║ │  ← A7, chalk-yellow
│ ║ T2 T3 T4 T5 T6 T7 CN   ║ │  ← lịch tháng viết phấn
│ ║ … 13 (14) 15 …         ║ │  ← khoanh phấn vàng A6
│ ╚════════════════════════╝ │
└────────────────────────────┘
```
**Nội dung:** từ `date` ⚠️ (fallback ngày mẫu). Sau ngày cưới: *"Tụi mình đã về chung nhà rồi nè ♥"*.
**Animation:** tờ lịch dán vào (rơi + băng keo); lịch tháng hiện từng hàng A1 stagger 0.06; vòng khoanh phấn vẽ A6 với nét run tay (path không kín).

---

### C12 · Order ticket (lịch trình)

```
┌────────────────────────────┐
│ ┌────────────────────────┐ │  ← phiếu order nhỏ, latte, kẹp gỗ
│ │ ORDER #1411      BÀN VIP│ │
│ │ 17:00  Đón khách     ✓ │ │
│ │ 18:00  Làm lễ        ✓ │ │
│ │ 18:30  Khai tiệc     ✓ │ │
│ │ 20:00  Giao lưu      ✓ │ │
│ │ Ghi chú: ít đá, nhiều  │ │
│ │ yêu thương             │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```
Giờ từ `date` (−1h, 0, +30′, +2h). Số order = `ddMM` của ngày cưới.
**Animation:** phiếu lắc nhẹ trên kẹp khi vào (`rotate -3° → 2° → 0`, 0.8s); dấu ✓ vẽ A6 lần lượt theo scrub.

---

### C6 + C7 · "Địa chỉ quán" (hai lễ + bản đồ)

```
┌────────────────────────────┐
│ ĐỊA CHỈ QUÁN               │
│ ┌──────────┐ ┌───────────┐ │  ← 2 biển hiệu kẻ tay
│ │ LỄ VU QUY│ │ TIỆC CƯỚI │ │     (latte, viền caramel)
│ │ 08:00    │ │ 18:00     │ │
│ │ Tư gia   │ │{venue.name}│ │
│ │ nhà gái  │ │           │ │
│ │{bride.   │ │           │ │
│ │ address} │ │           │ │
│ └──────────┘ └───────────┘ │
│ ┌────────────────────────┐ │
│ │ <MapEmbed/> 16:10       │ │  ← rounded-xl, viền caramel 2px
│ └────────────────────────┘ │
│ [ ⌖ Chỉ đường tới quán ]   │  ← nút caramel, chữ night
└────────────────────────────┘
```
Mobile < 380px: 2 biển hiệu xếp dọc. Bản đồ mount khi cách viewport < 1 màn hình.
**Animation:** biển hiệu đung đưa trên dây treo khi vào (`rotate 4° → -2° → 0`, `transformOrigin: top center`).

---

### C13 · Dress code gói đường

```
┌────────────────────────────┐
│ DRESS CODE                 │
│ Thoải mái, lịch sự, tông   │
│ cà phê sữa                 │
│ ┌─┐ ┌─┐ ┌─┐ ┌─┐            │  ← gói đường dẹt, mỗi gói 1 màu
│ └─┘ └─┘ └─┘ └─┘            │     #F5ECD9 #C58B4E #6F4A2F #2B1D14
│ Kem  Caramel Nâu  Đen      │
└────────────────────────────┘
```
**Animation:** gói đường rơi xuống bàn, stagger 0.08, `rotate` ngẫu nhiên ±15°.

---

### C8 · Tường ảnh đèn dây

```
┌────────────────────────────┐
│ Ở LẠI CHƠI                 │
│ ~•~~•~~~•~~•~~~•~~•~ ← dây đèn│
│  ┌────┐   ┌────┐           │  ← ảnh treo bằng kẹp gỗ trên dây,
│  │ ảnh│   │ ảnh│           │     xoay ±4°
│  └────┘   └────┘           │
│ ~•~~~•~~•~~~•~~~•~~•~      │
│     ┌────┐   ┌────┐        │
│     │ ảnh│   │ ảnh│        │
│     └────┘   └────┘        │
└────────────────────────────┘
```
**Nội dung:** `images[3..n-2]`, 2 ảnh mỗi dây (desktop 3). Dây đèn là SVG path cong, bóng đèn là chấm `chalk-yellow` có quầng (`shadow-[0_0_12px_#E9C46A]`).
**Animation:** dây vẽ A6 khi vào; bóng đèn sáng lần lượt từ trái (opacity 0.3 → 1, stagger 0.05); ảnh đung đưa nhẹ A12 (biên độ 1.5°, mỗi ảnh lệch pha). Chạm ảnh → A10.
**Reduced-motion:** đèn sáng sẵn, không đung đưa.

---

### C14 + C15 · Hoá đơn (mừng cưới + xác nhận tham dự)

**Mục đích:** ghép 2 card thành 1 "tờ hoá đơn" dài: phần trên là xác nhận tham dự ("gọi món"), phần dưới là QR ("thanh toán"). Lời văn đùa: *"Quán không tính tiền, chỉ nhận lời chúc."*

```
┌────────────────────────────┐
│ ┌╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲┐   │  ← mép răng cưa
│ │ CÀ PHÊ HẠNH PHÚC       │   │
│ │ HOÁ ĐƠN #1411          │   │
│ │ ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ │   │
│ │ Tên khách [________]   │   │
│ │ ( ) Sẽ ghé quán        │   │
│ │ ( ) Hẹn dịp khác       │   │
│ │ Số người: [ 1 ▾ ]      │   │
│ │ [ Gọi món ]            │   │
│ │ ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ │   │
│ │ Tạm tính ...... 0 đ    │   │
│ │ Lời chúc ...... vô giá │   │
│ │ ┌──────┐ ┌──────┐      │   │
│ │ │ QR   │ │ QR   │      │   │  ← QR mẫu ⚠️ §8.3
│ │ │ trai │ │ gái  │      │   │
│ │ └──────┘ └──────┘      │   │
│ │ Bản xem thử — không gửi│   │
│ └╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱┘   │
└────────────────────────────┘
```
**Hành vi:**
- Bấm "Gọi món" → phần form thu lại, in thêm dòng *"1 ly hạnh phúc cho {tên} ✓"* (mỗi ký tự in ra như máy in nhiệt: A11 nhanh 0.02s/ký tự) và *"Cảm ơn {tên}! ♥"*. Không gửi dữ liệu. Tên trống → nút disabled.
- Chạm QR → A10.
**Animation vào:** hoá đơn "in ra" từ trên xuống: `clip-path: inset(0 0 100% 0) → inset(0)` theo scrub (như cuộn giấy nhiệt chạy ra).

---

### C10 · "Hẹn gặp lại" (ly cạn)

```
┌────────────────────────────┐
│ ╭──────────────╮           │  ← images[n-1], dán băng keo
│ │   ẢNH CUỐI   │           │
│ ╰──────────────╯           │
│ Cảm ơn bạn đã ghé quán!    │  ← Pangolin 26px chalk-yellow
│ Hẹn gặp nhau ở tiệc cưới   │
│ của Minh Quân & Thu Hà.    │
│        ┌─────┐             │
│        │ ∪   │  ← ly nhựa cạn, chỉ còn đá
│        └─────┘   + dấu môi ♥ trên ống hút
└────────────────────────────┘
```
**Animation (scrub):** ly từ đầy → cạn (`scaleY 1 → 0.05` của lớp cà phê, origin bottom), đá lắc, cuối cùng một trái tim nhỏ bay lên từ ống hút (A12 một lần). Khép lại hành trình bắt đầu bằng ly cà phê ở C1.

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | C2 ảnh dán trên bảng phấn | 4:3 |
| `images[1]` | C3 nhãn ly chú rể (tròn) | 1:1 |
| `images[2]` | C3 nhãn ly cô dâu (tròn) | 1:1 |
| `images[3..5]` | C4 thẻ 3 tầng | 4:5 |
| `images[3..n-2]` | C8 tường ảnh | 4:5 |
| `images[n-1]` | C10 | 4:3 |

`meta.media = { images: 8, videos: 0 }` (C8 cần ≥ 4 ảnh cho 2 dây đèn).

Ảnh chân dung hiển thị tròn 1:1 bằng `object-cover` — ảnh người dùng dọc 4:5 vẫn ổn, khuyến nghị mặt ở giữa (ghi vào nhãn form "Dùng thử" nếu có chỗ; không bắt buộc).

Trường ⚠️: `date` — ngày hẹn, giờ order, số hoá đơn; fallback ngày mẫu. Tên bố mẹ — ẩn dòng. QR — QR mẫu.

---

## 7. Triển khai code

### 7.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/cafe-2d/
├── meta.ts
├── layout.tsx                 # Pangolin + Be_Vietnam_Pro (vietnamese)
├── page.tsx                   # return <CafeInvite />
└── _components/
    ├── cafe-invite.tsx        # "use client" — ghép 3 chương, tokens `t`, SmoothScroll
    ├── phin.tsx               # C1: phin + ly + giọt + timeline rót đầy
    ├── pour-overlay.tsx       # lớp rót đầy dùng chung: C1 (play) và giữa chương (scrub)
    ├── chalk.tsx              # <Chalk> bọc chữ phấn + hook useChalkWrite (TextPlugin)
    ├── plastic-cup.tsx        # ly nhựa + nhãn dán (C3, C10)
    ├── receipt-no.ts          # orderNo(date), scheduleFrom(date)
    ├── receipt-no.test.ts
    ├── sections/
    │   ├── menu-board.tsx     # C2
    │   ├── two-coffees.tsx    # C3
    │   ├── bac-xiu.tsx        # C4
    │   ├── cassette.tsx       # C16
    │   ├── date-board.tsx     # C5+C11
    │   ├── order-ticket.tsx   # C12
    │   ├── cafe-address.tsx   # C6+C7
    │   ├── sugar-dress.tsx    # C13
    │   ├── string-lights.tsx  # C8
    │   ├── receipt.tsx        # C14+C15
    │   └── see-you.tsx        # C10
    └── svg/                   # phin, ly thuỷ tinh, sóng, băng keo, kẹp gỗ, cassette, gói đường
```
Dùng chung `@/kit` (`SmoothScroll`, `OpenGate`, `MusicPlayer`, `Countdown`, `useReducedMotion`, `presets`), `MapEmbed`, `useWedding()`.

### 7.2 Tokens Tailwind
```ts
export const t = {
  root: "min-h-screen bg-[#2B1D14] text-[#F2EEE3] font-(family-name:--font-body)",
  board: "bg-[#1F2A24] border-[10px] border-[#5A3E2B] rounded-xl bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.05),transparent_60%)]",
  chalk: "font-(family-name:--font-display) text-[#F2EEE3] [text-shadow:0_0_1px_rgba(242,238,227,0.6)]",
  chalkY: "font-(family-name:--font-display) text-[#E9C46A]",
  latte: "bg-[#F5ECD9] text-[#2B1D14] rounded-[0.75rem]",
  btn: "bg-[#C58B4E] text-[#2B1D14] rounded-[0.75rem] min-h-11 px-5 font-medium",
  label: "text-[12px] lg:text-[13px] font-medium tracking-[0.12em] uppercase",
  soft: "text-[#6A5646]",
} as const;
```

### 7.3 Rót đầy dùng chung
```tsx
// pour-overlay.tsx — 1 component, 2 cách điều khiển
export function pourTimeline(el: HTMLElement) {
  return gsap.timeline({ defaults: { ease: "power1.inOut" } })
    .fromTo(el, { yPercent: 100 }, { yPercent: 0, duration: 0.5 })
    .to(el.querySelector(".chapter-title"), { autoAlpha: 1, duration: 0.2 })
    .to(el, { yPercent: -100, duration: 0.5 }, "+=0.15");
}
// C1: pourTimeline(overlay).eventCallback("onComplete", onOpened).play()
// Giữa chương:
ScrollTrigger.create({ trigger: zone, start: "top top", end: "+=70%", pin: true, scrub: 0.5,
  animation: pourTimeline(overlay), onToggle: (s) => wave.paused(!s.isActive) });
```
Sóng (`wave`) là tween lặp `x: "-50%"` trên SVG rộng 200%, `paused` mặc định.

### 7.4 Giọt cà phê (C1)
```tsx
const drip = gsap.timeline({ repeat: -1, repeatDelay: 0.8 })
  .fromTo(".drop", { y: 0, scaleY: 1, autoAlpha: 1 }, { y: dropDist, scaleY: 1.4, duration: 0.6, ease: "power2.in" })
  .set(".drop", { autoAlpha: 0 })
  .fromTo(".ripple", { scale: 0, autoAlpha: 1 }, { scale: 1, autoAlpha: 0, duration: 0.4 }, "<")
  .to(".coffee-level", { y: "-=1", duration: 0.2 }, "<");
```
Dừng `drip.kill()` khi bấm mở hoặc reduced-motion. Dừng khi tab ẩn (`document.visibilitychange`).

### 7.5 Viết phấn (A11)
`useChalkWrite(ref, text, { by: "chars" | "words", speed })` dùng `TextPlugin` (`text: { value, delimiter: by === "words" ? " " : "" }`). Luôn `text.normalize("NFC")`. Viên phấn SVG đặt `absolute` và cập nhật vị trí theo `Range.getBoundingClientRect()` của ký tự cuối trong `onUpdate` — **chỉ trên desktop** (mobile bỏ viên phấn, tiết kiệm layout reads).

### 7.6 Logic cần test (`receipt-no.test.ts`)
- `orderNo(new Date(2026,10,14))` → `"1411"`.
- `scheduleFrom(date)` → 4 mốc đúng (−60′, 0, +30′, +120′), định dạng `HH:mm`, qua nửa đêm vẫn đúng (tiệc 23:00 → giao lưu 01:00).

### 7.7 Thứ tự làm
1. `meta.ts`, `layout.tsx`, `page.tsx`, tokens → kiểm dấu tiếng Việt trên Pangolin (nhất là "ỗ", "ữ", "ặ")
2. `receipt-no.ts` + test
3. Section tĩnh của 3 chương, khớp wireframe 360px/1440px
4. `phin.tsx` + `pour-overlay.tsx` + nhạc
5. Rót đầy giữa chương (scrub)
6. `chalk.tsx` + A11; ly bạc xỉu ghim; hoá đơn in ra
7. Tường ảnh đèn dây, ly cạn C10
8. Reduced-motion, tên dài, Lighthouse, checklist §12

---

## 8. Asset cần chuẩn bị
- [ ] SVG: phin (nắp, thân, đế), ly thuỷ tinh, ly nhựa + ống hút, sóng (2 lớp), viên phấn, băng keo giấy, kẹp gỗ, cassette, gói đường, bóng đèn dây, ghế nhựa + đèn dây (nền desktop)
- [ ] Mask nhiễu cho chữ phấn (SVG `feTurbulence` inline)
- [ ] `music.mp3` (Pixabay, lo-fi acoustic 75–85 BPM) + `CREDITS.md`
- [ ] 8 ảnh mẫu tông nâu ấm, bối cảnh quán cà phê (Unsplash/Pexels) ≤ 300KB `.webp`
- [ ] 2 QR mẫu
- [ ] `thumb.webp` 600×800: bảng phấn "MENU HÔM NAY: CƯỚI" + ly cà phê
- [ ] `opengraph-image.png` 1200×630

## 9. Tiêu chí nghiệm thu riêng
- [ ] Từ lúc chạm phin tới lúc cuộn được ≤ 1.8s; nhạc phát ngay khi chạm
- [ ] Viết phấn tên cặp đôi ≤ 2s kể cả tên 50 ký tự (viết theo từ); dấu tiếng Việt không bị hiện tách
- [ ] Mọi chữ trên nền tối đạt ≥ 4.5:1; nút dùng chữ `night` trên `caramel`
- [ ] Lớp rót đầy dùng `z-40`, không che nút chung; không để lại lớp phủ kẹt trên màn hình khi cuộn ngược nhanh
- [ ] Giọt cà phê dừng khi tab ẩn và khi reduced-motion
- [ ] Form hoá đơn: tên trống thì nút disabled; không có request mạng khi bấm "Gọi món"
