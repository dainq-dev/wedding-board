# 2D-21 · `chat-2d` · Tin Nhắn Đầu Tiên

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md). Cấu trúc tài liệu theo mẫu chuẩn [letter-2d.md](./letter-2d.md).

---

## 1. Concept

**Một câu:** Điện thoại của khách sáng lên với thông báo "1 tin nhắn mới"; mở ra là cuộc trò chuyện giữa hai người, từ tin nhắn làm quen đầu tiên tới lời mời cưới được ghim trên cùng.

**Cảm xúc muốn gợi:** dễ thương, gần gũi, hài hước kiểu Gen Z/millennial; khách thấy như đang "đọc trộm" chuyện tình của hai người.

**Phù hợp với:** cặp đôi quen nhau qua mạng/nhắn tin, cặp đôi trẻ, thích sự vui vẻ hơn trang trọng; ảnh cưới đời thường, selfie.

**Khác các mẫu khác ở chỗ:** toàn bộ thiệp nằm **bên trong một khung điện thoại cố định** (trên desktop là điện thoại giữa màn hình; trên mobile khung điện thoại chính là màn hình). Cuộn trang = **cuộn cuộc trò chuyện**: tin nhắn "đang nhập…" rồi pop ra theo scrub. Mọi card (lịch, bản đồ, QR, RSVP) được dựng như **loại tin nhắn đặc biệt** (sự kiện lịch, chia sẻ vị trí, chuyển khoản, bình chọn). Không có "section" trang web nào ngoài khung chat.

**Moodboard:** giao diện nhắn tin phổ biến (không sao chép thương hiệu cụ thể nào), bong bóng bo tròn xanh/hồng, dấu "đang nhập" 3 chấm, reaction ❤️😂, "Đã xem ✓✓", tin nhắn ghim, sticker, ảnh gửi dạng lưới, thanh thông báo màn hình khoá.

**Lưu ý thương hiệu:** không dùng logo, tên, màu nhận diện của Messenger/Zalo/iMessage. Ứng dụng giả có tên *"Thương"* (icon trái tim trong bong bóng chat).

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `bg` | `#EAF2FF` | Nền trang ngoài điện thoại (desktop) và nền khung chat |
| `surface` | `#FFFFFF` | Header chat, thanh nhập, thẻ đặc biệt, bong bóng tin hệ thống |
| `groom` | `#2F6BFF` | Bong bóng tin chú rể (bên phải) |
| `bride` | `#FF5C8A` | Bong bóng tin cô dâu (bên trái) — xem ghi chú tương phản |
| `bride-deep` | `#D93A6A` | Nền bong bóng cô dâu khi cần chữ trắng |
| `ink` | `#0F172A` | Chữ chính |
| `ink-soft` | `#64748B` | Giờ gửi, "Đã xem", nhãn hệ thống |
| `line` | `#DCE5F3` | Viền thẻ, đường chia ngày |
| `lock` | `#0B1020` | Nền màn hình khoá C1 |

Tương phản: trắng trên `groom` ≈ 4.6:1 ✅. Trắng trên `bride` ≈ 3.1:1 ❌ → bong bóng cô dâu dùng **nền `bride-deep`** (trắng ≈ 4.5:1 ✅) và giữ `bride` cho trái tim, reaction, viền. `ink` trên `surface` ≈ 17:1 ✅. `ink-soft` trên `surface` ≈ 4.8:1 ✅, trên `bg` ≈ 4.4:1 ⚠️ → nhãn trên nền `bg` dùng `#556277` (≈ 5.4:1).

> Quyết định: bên trái (người kia) là cô dâu, bên phải ("mình") là chú rể — như điện thoại của chú rể. Đây là quy ước cố định, không đổi theo dữ liệu.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi (header, thẻ mời) | Plus Jakarta Sans 800 | 28px / 1.15 | 40px | |
| Giờ màn hình khoá | Plus Jakarta Sans 300 | 72px / 1 | 88px | |
| Nội dung tin nhắn | Plus Jakarta Sans 500 | 16px / 1.45 | 16px | Cỡ chữ không tăng trên desktop vì khung điện thoại cố định |
| Tiêu đề thẻ đặc biệt | Plus Jakarta Sans 700 | 15px | 15px | |
| Giờ gửi, trạng thái | Plus Jakarta Sans 500 | 12px | 12px | |

Chỉ dùng **1 font** (Plus Jakarta Sans, có subset `vietnamese`) — đúng tinh thần giao diện app. Emoji dùng emoji hệ thống.

### Hình khối và chất liệu
- **Khung điện thoại (desktop ≥ 768px)**: `w-[390px] h-[min(844px,92svh)] rounded-[48px] border-[12px] border-[#0F172A]`, có "đảo" camera. Mobile: không có khung, khung chat full màn hình.
- **Bong bóng**: `rounded-[1.25rem]`, góc gần người gửi `rounded-br-md` (phải) / `rounded-bl-md` (trái); tin liên tiếp cùng người gom nhóm, chỉ tin cuối có "đuôi".
- **Thẻ đặc biệt** (sự kiện, vị trí, QR, bình chọn): `surface`, viền `line`, `rounded-2xl`, rộng 80% khung.
- **Avatar**: tròn 28px, `images[2]` (cô dâu) cạnh tin bên trái.
- **Motion**: ease chủ đạo `back.out(1.5)` cho bong bóng pop (`scale 0.6 → 1`, origin theo phía người gửi); `power2.out` cho mọi thứ khác. Pop 0.35s.

---

## 3. Nhạc

- **Tâm trạng**: pop acoustic dễ thương: ukulele/guitar, huýt sáo, glockenspiel, vỗ tay; vui, sáng, không lời.
- **Tempo**: 95–110 BPM. **Độ dài**: 2:00–3:00, lặp lại.
- **Từ khoá Pixabay**: `cute pop acoustic love`, `ukulele happy romantic`, `whistle acoustic cheerful`
- **Hành vi**:
  - Bắt đầu khi chạm vào thông báo ở màn hình khoá (C1), âm lượng 0 → 0.6 trong 1.5s.
  - (Tuỳ chọn) tiếng "pop" nhỏ khi tin nhắn xuất hiện, âm lượng 0.2, throttle 150ms, chỉ khi nhạc bật. Nếu cảm thấy ồn khi test thì bỏ — không bắt buộc.
  - C16 là tin nhắn thoại (voice message) "Bài hát của chúng tôi".
  - Ẩn tab thì tạm dừng.

---

## 4. Cấu trúc trang

Không có section "trang web". Cuộc trò chuyện được chia thành **các "ngày"** (dải ngày giữa khung chat như app thật), mỗi ngày tương ứng một nhóm card. Cuộn trang điều khiển tiến độ trò chuyện.

```
┌───────────────────────────┐
│ C1  Màn hình khoá           │ 100svh  (cố định tới khi chạm)
├───────────────────────────┤  ← zoom vào thông báo (T6)
│ ┌── Khung chat (pin) ────┐ │
│ │ Header: avatar, tên    │ │  cố định trong khung
│ │ 📌 Tin ghim: Thiệp mời │ │  thanh ghim (C2 rút gọn), chạm → cuộn tới C2
│ ├─ "12/03/2019" ────────┤ │
│ │ C4a Tin làm quen       │ │ 120svh
│ ├─ "20/10/2020" ────────┤ │
│ │ C4b Thương + C8 ảnh    │ │ 160svh  lưới ảnh gửi trong chat
│ ├─ "02/09/2024" ────────┤ │
│ │ C4c Cầu hôn            │ │ 100svh
│ ├─ "Hôm nay" ───────────┤ │
│ │ C2 Thẻ thiệp mời       │ │ 100svh  tin "thiệp mời" + C3 hai nhà
│ │ C5+C11 Sự kiện lịch    │ │  80svh
│ │ C12 Lịch trình (list)  │ │  60svh
│ │ C6+C7 Chia sẻ vị trí   │ │ 100svh
│ │ C13 Bình chọn dress code│ │ 60svh
│ │ C16 Tin nhắn thoại     │ │  40svh
│ │ C14 Mừng cưới          │ │  70svh
│ │ C15 Trả lời (RSVP)     │ │ 100svh  thanh nhập mở rộng
│ │ C10 "Đã xem ✓✓"        │ │  80svh
│ └────────────────────────┘ │  tổng ≈ 1170svh cuộn
└───────────────────────────┘
```

**Cách cuộn:** khung chat được **ghim** (pin) suốt phần thân. Bên trong là một cột tin nhắn cao hơn khung; cuộn trang dịch cột này lên (`y`) và **lần lượt hiện tin** theo scrub. Tin mới luôn xuất hiện ở đáy khung, tin cũ trôi lên — đúng cảm giác app chat. Header và thanh nhập cố định trong khung.

**Vùng an toàn:** trên mobile header chat có `pl-14` (tránh nút Quay lại góc trên-trái), nút nhạc đặt ở góc trên-phải **ngoài** header (header chừa `pr-14`). Thanh nhập đáy chừa `pr-20` (tránh nút Dùng thử góc dưới-phải); nút "gửi" của thanh nhập đặt bên trái nút đó.

---

## 5. Chi tiết từng section

### C1 · Màn hình khoá (màn mở thiệp)

**Mục đích:** khoảnh khắc "có tin nhắn mới"; chạm vào thông báo là mở app và bật nhạc.

**Wireframe (360px):**
```
┌────────────────────────────┐
│         (nền lock +        │
│          images[0] mờ)     │  ← images[0] blur-2xl, opacity 0.5
│                            │
│          18:00             │  ← giờ hiện tại thật (HH:mm)
│      Thứ Ba, 29 tháng 9    │
│                            │
│ ┌────────────────────────┐ │
│ │ ♥ THƯƠNG        bây giờ│ │  ← thẻ thông báo kính mờ
│ │ Thu Hà                 │ │     (surface/70 + backdrop-blur)
│ │ Anh ơi, mình cưới nhé? │ │
│ │ 💍 [Thiệp mời]         │ │
│ └────────────────────────┘ │
│                            │
│   Chạm vào thông báo để mở │  ← 13px, trắng/80
│          ────              │  ← thanh home
└────────────────────────────┘
```

**Nội dung:**
- Giờ/ngày: **thời gian thực của khách** (`new Date()`, cập nhật mỗi phút) — tạo cảm giác "vừa nhận".
- Thông báo từ `{bride.name}`: *"Anh ơi, mình cưới nhé? 💍"* + dòng phụ *"[Thiệp mời]"*.
- Hướng dẫn: *"Chạm vào thông báo để mở"*.
- Toàn bộ thẻ thông báo là `<button aria-label="Mở thiệp mời">`.

**Animation vào:**
| t | Hành động |
|---|---|
| 0.0s | Giờ + ngày A1 (0.6s) |
| 0.8s | Thẻ thông báo trượt xuống từ trên `y: -40 → 0` + `back.out(1.5)` (0.45s), điện thoại "rung": khung `x: ±3` × 4 lần (0.3s) |
| 1.6s | Dòng hướng dẫn A1, sau đó nhấp nháy opacity 1 ↔ 0.5 (lặp, 1.6s) |

**Khi chạm thông báo (T6 zoom xuyên qua, 1.2s):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc bắt đầu |
| 0.0s | Thẻ thông báo `scale 1 → 0.97` (0.1s, phản hồi chạm) |
| 0.1s | Thẻ thông báo phóng thành toàn khung chat: dùng GSAP `Flip` từ thẻ thông báo sang header khung chat (0.7s, `power2.inOut`); nền màn hình khoá mờ đi và trượt lên |
| 0.8s | Header chat, thanh ghim và thanh nhập A1 (0.3s) |
| 1.2s | Mở khoá cuộn; tin đầu tiên của ngày "12/03/2019" hiện |

**Reduced-motion:** không rung, không Flip; crossfade 0.3s.
**Edge case:** tên cô dâu dài → tên trong thông báo `truncate` 1 dòng (tên đầy đủ có ở C2).

---

### Header + thanh ghim (cố định trong khung)

```
┌────────────────────────────┐
│ (Back) ◯ Thu Hà      📞 ⓘ  │  ← avatar images[2], "đang hoạt động"
│        Đang hoạt động      │     nút 📞 ⓘ trang trí, aria-hidden
├────────────────────────────┤
│ 📌 Thiệp cưới Quân ♥ Hà  › │  ← thanh ghim, chạm → cuộn tới C2
└────────────────────────────┘
```
Nút back "‹" trong header là **trang trí**, `aria-hidden`, không bấm được (tránh nhầm với nút Quay lại chung — và nó đặt lệch phải sau `pl-14`). Thanh ghim là `<button>` gọi `smoother.scrollTo(c2Label)` (hoặc `ScrollTrigger` tính vị trí label), cao 44px.

---

### C4a · Tin làm quen ("12/03/2019")

**Wireframe:**
```
┌────────────────────────────┐
│      ── 12/03/2019 ──      │  ← dải ngày, ink-soft
│                ┌─────────┐ │
│                │ Chào bạn│ │  ← chú rể (phải, groom)
│                │ ạ 👋    │ │
│                └─────────┘ │
│                ┌─────────┐ │
│                │ Mình là │ │
│                │ bạn của │ │
│                │ Tuấn đó │ │
│                └─────────┘ │
│ ◯ ┌─────────┐              │  ← cô dâu (trái, bride-deep)
│   │ • • •   │              │  ← "đang nhập…"
│   └─────────┘              │
└────────────────────────────┘
```

**Kịch bản (viết sẵn, không lấy từ form):**
| # | Người | Nội dung |
|---|---|---|
| 1 | chú rể | Chào bạn ạ 👋 |
| 2 | chú rể | Mình là bạn của Tuấn, hôm qua ngồi cùng bàn đó |
| 3 | cô dâu | À nhớ rồi, người gọi nhầm món cho cả bàn 😂 |
| 4 | chú rể | Đúng người đó… mình mời bạn ly cà phê để chuộc lỗi nhé? |
| 5 | cô dâu | Để suy nghĩ đã |
| 6 | cô dâu | Suy nghĩ xong rồi. Mai 7h nhé ☕ |
Tin 6 có reaction ❤️ của chú rể bay vào góc bong bóng.

**Animation (scrub):** mỗi tin chiếm 1 "nhịp" cuộn (~15svh): 40% đầu nhịp hiện "đang nhập…" (3 chấm nảy lặp) ở phía người gửi, 60% sau 3 chấm biến mất và bong bóng pop (`scale 0.6 → 1`, `back.out(1.5)`, origin góc đuôi). Cột tin dịch lên đúng chiều cao bong bóng mới (xem §7.4).
**Reduced-motion:** không có "đang nhập", không scrub: toàn bộ cuộc trò chuyện hiển thị như một trang chat tĩnh cuộn dọc bình thường, không ghim khung.

---

### C4b + C8 · "Thương" và ảnh gửi trong chat ("20/10/2020")

**Wireframe:**
```
┌────────────────────────────┐
│      ── 20/10/2020 ──      │
│ ◯ ┌───────────────┐        │
│   │ Hôm nay là    │        │
│   │ 20/10 đó nha 😤│        │
│   └───────────────┘        │
│          ┌───────────────┐ │
│          │ Biết mà. Nhìn │ │
│          │ ra cửa đi     │ │
│          └───────────────┘ │
│ ◯ ┌─────┬─────┐           │  ← tin ảnh: lưới 2×2 images[3..6]
│   │ ảnh │ ảnh │           │     rounded-2xl, gap-0.5
│   ├─────┼─────┤           │
│   │ ảnh │ +2  │           │  ← ô cuối "+n" nếu > 4 ảnh
│   └─────┴─────┘           │
│ ◯ ┌──────────────────────┐ │
│   │ Làm người yêu em nha │ │
│   └──────────────────────┘ │
│                  ┌───────┐ │
│                  │ Ừ ❤️  │ │
│                  └───────┘ │
└────────────────────────────┘
```

**Kịch bản:** cô dâu "Hôm nay là 20/10 đó nha 😤" → chú rể "Biết mà. Nhìn ra cửa đi" → cô dâu gửi **tin ảnh** (album) → cô dâu "Làm người yêu em nha" (câu đảo vai cho vui) → chú rể "Ừ ❤️".
**Tin ảnh (C8):** `images[3..n-2]` gom trong 1 hoặc 2 tin ảnh (tối đa 4 ô mỗi tin; ô thứ 4 hiện `+k` nếu còn). Chạm ảnh → A10 mở **trình xem ảnh toàn màn hình** (lightbox ngoài khung điện thoại, vuốt/←→ qua tất cả ảnh album).
**Animation:** tin ảnh pop như bong bóng, sau đó từng ô ảnh A3 stagger 0.08.

---

### C4c · Cầu hôn ("02/09/2024")

```
┌────────────────────────────┐
│      ── 02/09/2024 ──      │
│               ┌──────────┐ │
│               │ Em ơi     │ │
│               └──────────┘ │
│               ┌──────────┐ │
│               │ Cưới anh  │ │
│               │ nhé? 💍   │ │
│               └──────────┘ │
│ ◯ ┌ • • • ┐  (nhập…xoá…)  │  ← "đang nhập" hiện, tắt, hiện lại 2 lần
│ ◯ ┌──────────────────────┐ │
│   │ CÓ!!!!! 😭❤️         │ │  ← bong bóng to, chữ 22px
│   └──────────────────────┘ │
│   🎉 (confetti trong khung)│
└────────────────────────────┘
```
**Điểm nhấn:** "đang nhập…" hiện – mất – hiện 2 lần (hồi hộp) trước khi tin "CÓ!!!!!" pop với `scale 0.4 → 1.1 → 1`. Confetti A8: **20 hạt**, chỉ trong khung chat (`overflow-hidden`), màu `groom`/`bride`/vàng, chạy 1.5s, không lặp. Tắt khi reduced-motion.

---

### C2 + C3 · Thẻ thiệp mời ("Hôm nay")

**Mục đích:** nội dung cốt lõi của thiệp, dựng như một **tin nhắn dạng thẻ** do cả hai cùng gửi (tin hệ thống ở giữa).

**Wireframe:**
```
┌────────────────────────────┐
│        ── Hôm nay ──       │
│ ┌────────────────────────┐ │  ← thẻ giữa khung, surface
│ │ ╭────────────────────╮ │ │
│ │ │    images[0] 4:3   │ │ │
│ │ ╰────────────────────╯ │ │
│ │ TRÂN TRỌNG KÍNH MỜI    │ │
│ │ Minh Quân ♥ Thu Hà     │ │  ← <h1> 28px/800
│ │ Thứ Bảy · 14.11.2026   │ │  ← ⚠️ date
│ │ ┌──────────┬─────────┐ │ │
│ │ │◯ images[1]│◯ images[2]│ │  ← C3: 2 avatar tròn 64px
│ │ │ NHÀ TRAI │ NHÀ GÁI │ │ │
│ │ │ Quận 1,  │ Ba Đình,│ │ │  ← address 13px, tối đa 3 dòng
│ │ │ TP.HCM   │ Hà Nội  │ │ │
│ │ └──────────┴─────────┘ │ │
│ └────────────────────────┘ │
│  Quân và Hà đã ghim tin này│  ← tin hệ thống, 12px
└────────────────────────────┘
```
**Nội dung:** tên, ngày (⚠️ fallback ngày mẫu), địa chỉ; tên bố mẹ (⚠️) nếu có → dòng "Ông … & Bà …" dưới NHÀ TRAI/NHÀ GÁI, không có thì ẩn.
**Animation:** thẻ pop từ giữa (`scale 0.8 → 1`, `back.out(1.5)`); ảnh A3; tên A2 `chars` stagger 0.02; sau đó icon 📌 bay từ thẻ lên thanh ghim (Flip nhỏ, 0.5s) — thanh ghim nhấp sáng 1 lần.
**Edge case:** tên 50 ký tự → `<h1>` xuống dòng, 22px; thẻ không cố định chiều cao.

---

### C5 + C11 · Tin "Sự kiện lịch"

```
┌────────────────────────────┐
│ ┌────────────────────────┐ │  ← thẻ sự kiện (từ chú rể, bên phải)
│ │ 📅 SỰ KIỆN             │ │
│ │ Đám cưới Quân ♥ Hà     │ │
│ │ Thứ Bảy, 14 tháng 11   │ │
│ │ 18:00 – 21:00          │ │
│ │ ┌──┬──┬──┬──┬──┬──┬──┐ │ │
│ │ │T2│T3│T4│T5│T6│T7│CN│ │ │  ← lịch tuần chứa ngày cưới
│ │ │ 9│10│11│12│13│14│15│ │ │  ← ô 14 nền groom, chữ trắng
│ │ └──┴──┴──┴──┴──┴──┴──┘ │ │
│ │ Còn 45 ngày 06:12:33   │ │  ← A7
│ │ [ + Thêm vào lịch ]    │ │  ← tải .ics
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Nội dung:** chỉ hiện **1 tuần** chứa ngày cưới (lịch tháng quá lớn cho bong bóng), bấm vào lịch tuần → mở rộng thành lịch tháng (height transition, `aria-expanded`). Đếm ngược tới `date`; sau ngày cưới: *"Sự kiện đã diễn ra ❤️"*.
**Nút "Thêm vào lịch":** tạo file `.ics` phía client (`Blob` + `URL.createObjectURL`, `download="dam-cuoi.ics"`), không gọi mạng. Nội dung: `DTSTART` = `date`, `DTEND` = +3h, `SUMMARY`, `LOCATION` = `venue.name`. ⚠️ Chưa có `date` → vẫn cho tải với ngày mẫu? **Không**: ẩn nút khi đang dùng ngày mẫu fallback, tránh khách lưu ngày sai.
**Animation:** thẻ pop; ô ngày cưới `scale 0 → 1` + vòng sáng `bride`.

---

### C12 · Tin lịch trình (danh sách)

```
┌────────────────────────────┐
│ ◯ ┌──────────────────────┐ │  ← cô dâu gửi
│   │ Lịch trình nè mọi    │ │
│   │ người:               │ │
│   │ 🕔 17:00 Đón khách    │ │
│   │ 💍 18:00 Làm lễ       │ │
│   │ 🍽 18:30 Khai tiệc    │ │
│   │ 🎤 20:00 Giao lưu     │ │
│   └──────────────────────┘ │
│               ┌──────────┐ │
│               │ Nhớ đến  │ │
│               │ sớm nha 😆│ │
│               └──────────┘ │
└────────────────────────────┘
```
Giờ từ `date` (−1h, 0, +30′, +2h). Emoji có `aria-hidden`, nhãn chữ đọc được.
**Animation:** bong bóng pop; 4 dòng A1 stagger 0.08.

---

### C6 + C7 · Tin "Chia sẻ vị trí"

```
┌────────────────────────────┐
│ ┌────────────────────────┐ │  ← thẻ vị trí (chú rể)
│ │ ┌────────────────────┐ │ │
│ │ │  <MapEmbed/> 4:3   │ │ │  ← pointer-events-none, lớp phủ
│ │ └────────────────────┘ │ │     "Chạm để mở bản đồ"
│ │ 📍 {venue.name}        │ │
│ │ Tiệc cưới · 18:00      │ │
│ │ [ Chỉ đường ]          │ │
│ └────────────────────────┘ │
│ ◯ ┌──────────────────────┐ │
│   │ Lễ vu quy 08:00 sáng │ │  ← cô dâu nhắc lễ ở nhà gái
│   │ tại nhà em nhé:      │ │
│   │ {bride.address}      │ │
│   └──────────────────────┘ │
└────────────────────────────┘
```
**Bản đồ:** iframe trong khung chat ghim sẽ bắt thao tác cuộn → iframe luôn `pointer-events-none`; chạm vào thẻ mở **lớp phủ toàn màn hình** (ngoài khung điện thoại, `z-40`) chứa `<MapEmbed>` tương tác được + nút đóng 44px. `MapEmbed` trong thẻ chỉ mount khi tin này sắp xuất hiện (cách 1 nhịp cuộn).
**Link chỉ đường:** `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}`, `target="_blank" rel="noopener"`.

---

### C13 · Tin "Bình chọn" (dress code)

```
┌────────────────────────────┐
│ ┌────────────────────────┐ │
│ │ 📊 BÌNH CHỌN            │ │
│ │ Mặc màu gì đi đám cưới?│ │
│ │ ● Xanh dương   ████ 62%│ │  ← màu #2F6BFF
│ │ ● Hồng         ██▌  31%│ │  ← #FF5C8A
│ │ ● Trắng        ▌     7%│ │  ← #FFFFFF viền
│ │ Chọn gì cũng được, miễn│ │
│ │ là đến! 😄             │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Hành vi:** khách chạm 1 lựa chọn → thanh của lựa chọn đó +1 phiếu giả (số % viết sẵn, chỉ cộng cục bộ, không lưu), hiện dấu ✓. Là `<fieldset>` radio thật.
**Animation:** các thanh `scaleX 0 → giá trị` (origin left) stagger 0.1.

---

### C16 · Tin nhắn thoại

```
┌────────────────────────────┐
│               ┌──────────┐ │
│               │ ▶ ▂▅▇▅▂▇▃ │ │  ← waveform 24 vạch, 1:12
│               │     1:12  │ │
│               └──────────┘ │
│    Bài hát của chúng tôi   │  ← chú thích 12px dưới bong bóng
│    · chạm để nghe          │
└────────────────────────────┘
```
**Hành vi:** nút ▶/❚❚ 44px điều khiển **cùng audio** với `<MusicPlayer>`. Waveform: các vạch đã phát đổi màu trắng đậm theo `currentTime/duration`. Vạch có chiều cao cố định (mảng 24 số viết sẵn), không phân tích âm thanh thật.

---

### C14 · Tin "Mừng cưới"

```
┌────────────────────────────┐
│ ◯ ┌──────────────────────┐ │
│   │ Ai muốn gửi quà thì  │ │
│   │ quét mã nhé, không có│ │
│   │ cũng không sao ❤️    │ │
│   └──────────────────────┘ │
│ ┌──────────┐ ┌──────────┐  │
│ │ QR nhà   │ │ QR nhà   │  │  ← 2 thẻ QR mẫu ⚠️ §8.3
│ │ trai     │ │ gái      │  │
│ └──────────┘ └──────────┘  │
└────────────────────────────┘
```
Chạm QR → A10 phóng to toàn màn hình (ngoài khung).

---

### C15 · Trả lời (RSVP qua thanh nhập)

**Mục đích:** xác nhận tham dự bằng cách "trả lời tin nhắn" — thanh nhập ở đáy khung mở rộng thành form.

```
┌────────────────────────────┐
│ ◯ ┌──────────────────────┐ │
│   │ Bạn có đến được      │ │
│   │ không? 🥺            │ │
│   └──────────────────────┘ │
│ ┌ trả lời nhanh ─────────┐ │
│ │ [Chắc chắn rồi! 🎉]    │ │  ← chip 44px
│ │ [Tiếc quá, bận mất 😢] │ │
│ └────────────────────────┘ │
├────────────────────────────┤
│ Tên bạn: [__________]      │  ← thanh nhập mở rộng
│ Số người: [ − 1 + ]        │
│ [  Gửi  ➤ ]                │
│ Bản xem thử — không gửi đi │
└────────────────────────────┘
```
**Hành vi:**
- Khi tin "Bạn có đến được không?" xuất hiện, thanh nhập đáy khung mở rộng (height transition) thành form.
- Chọn chip + nhập tên → bấm "Gửi" → tin của **khách** xuất hiện bên phải với màu `ink` nền `surface` viền `line` (khác màu chú rể): *"{tên}: Chắc chắn rồi! 🎉 (2 người)"*, rồi cô dâu trả lời *"Yayyy cảm ơn {tên} nhiều nha ❤️"* sau 0.8s "đang nhập…". Form thu gọn về thanh nhập thường.
- **Không gửi dữ liệu đi đâu.** Tên trống → nút disabled.
- Khi input focus trên mobile: bàn phím ảo làm đổi viewport → tạm `ScrollTrigger.normalizeScroll(false)` / `disable()` trigger ghim trong lúc focus (như lich-to-2d), bật lại khi blur, để khung không nhảy.

---

### C10 · "Đã xem ✓✓" (lời cảm ơn)

```
┌────────────────────────────┐
│ ◯ ┌──────────────────────┐ │
│   │ ╭──────────────────╮ │ │  ← tin ảnh images[n-1]
│   │ │   ẢNH CUỐI       │ │ │
│   │ ╰──────────────────╯ │ │
│   │ Cảm ơn mọi người đã  │ │
│   │ đọc tới đây. Hẹn gặp │ │
│   │ ở tiệc cưới nhé! ❤️  │ │
│   └──────────────────────┘ │
│               ┌──────────┐ │
│               │ Minh Quân│ │
│               │ & Thu Hà │ │
│               └──────────┘ │
│                 Đã xem ✓✓  │  ← ✓✓ chuyển xanh groom
└────────────────────────────┘
```
**Animation:** "Đã gửi ✓" → sau 0.6s đổi "Đã xem ✓✓" (✓ thứ hai trượt vào, màu `ink-soft → groom`). Kết thúc: khung chat thu nhỏ về màn hình khoá (đảo ngược Flip C1, scrub ở 40svh cuối) với thông báo mới: *"Minh Quân & Thu Hà: Hẹn gặp bạn ngày 14.11 ❤️"*.
**Reduced-motion:** hiện "Đã xem ✓✓" sẵn, không thu nhỏ.

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | C1 nền màn hình khoá (blur), C2 ảnh thẻ mời | 4:3 |
| `images[1]` | C2+C3 avatar nhà trai | 1:1 (tròn) |
| `images[2]` | Avatar cô dâu trong header + cạnh mọi tin bên trái; C3 nhà gái | 1:1 (tròn) |
| `images[3..n-2]` | C8 tin ảnh (lưới 2×2, `+k`) + lightbox | 1:1 trong lưới, gốc trong lightbox |
| `images[n-1]` | C10 tin ảnh cuối | 4:3 |

`meta.media = { images: 8, videos: 0 }` (album 4 ảnh vừa đúng 1 lưới 2×2).
> Cân nhắc: mẫu này rất hợp 1 video ngắn dạng "tin nhắn video" ở C4b. Giữ `videos: 0` theo §4 bảng mẫu; nếu muốn thêm, spec vị trí sẵn: `videos[0]` là tin video `rounded-2xl` 9:16 max-h 60% khung, `controls`, `playsInline`, `muted` mặc định.

Avatar chú rể không hiển thị trong chat (tin bên phải không có avatar, như app thật) — chỉ xuất hiện ở C3.

Trường ⚠️: `date` — thẻ mời, sự kiện lịch, lịch trình, nút .ics (ẩn khi fallback); tên bố mẹ — ẩn dòng; QR — QR mẫu. Ngày trong kịch bản chuyện tình (2019, 2020, 2024) là chữ mẫu cố định.

---

## 7. Triển khai code

### 7.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/chat-2d/
├── meta.ts
├── layout.tsx                 # Plus_Jakarta_Sans (vietnamese), 1 font
├── page.tsx                   # return <ChatInvite />
└── _components/
    ├── chat-invite.tsx        # "use client" — tokens `t`, dựng script, ghim khung, điều phối
    ├── lock-screen.tsx        # C1 (+ mode "end" cho C10)
    ├── phone-frame.tsx        # khung điện thoại (desktop) / full màn (mobile)
    ├── chat-header.tsx        # header + thanh ghim
    ├── composer.tsx           # thanh nhập + form RSVP (C15)
    ├── script.ts              # buildScript(data, now): Message[] — toàn bộ kịch bản
    ├── script.test.ts
    ├── ics.ts                 # buildIcs(date, venue): string
    ├── ics.test.ts
    ├── messages/
    │   ├── bubble.tsx         # tin chữ (trái/phải/khách), đuôi, reaction
    │   ├── typing.tsx         # "đang nhập…"
    │   ├── day-divider.tsx
    │   ├── photo-grid.tsx     # C8
    │   ├── invite-card.tsx    # C2+C3
    │   ├── event-card.tsx     # C5+C11
    │   ├── location-card.tsx  # C6+C7
    │   ├── poll-card.tsx      # C13
    │   ├── voice-note.tsx     # C16
    │   ├── gift-card.tsx      # C14
    │   └── seen.tsx           # C10
    └── overlays/              # map-overlay.tsx, lightbox dùng A10 chung
```
Dùng chung `@/kit` (`SmoothScroll`, `OpenGate`, `MusicPlayer`, `Countdown`, `useReducedMotion`, `presets`), `MapEmbed`, `useWedding()`.

**Dữ liệu hoá kịch bản:** toàn bộ cuộc trò chuyện là một mảng `Message` sinh từ `buildScript(data, now)`:
```ts
type Message =
  | { kind: "day"; label: string }
  | { kind: "text"; from: "groom" | "bride" | "guest" | "system"; text: string; reaction?: string; big?: boolean }
  | { kind: "photos"; from: "bride"; images: string[] }
  | { kind: "invite" } | { kind: "event" } | { kind: "schedule" } | { kind: "location" }
  | { kind: "poll" } | { kind: "voice" } | { kind: "gift" } | { kind: "rsvp" } | { kind: "seen" };
```
Component chính map mảng này ra DOM; timeline scrub cũng lặp trên chính mảng này → thêm/bớt tin chỉ sửa `script.ts`.

### 7.2 Tokens Tailwind
```ts
export const t = {
  root: "min-h-screen bg-[#EAF2FF] text-[#0F172A] font-(family-name:--font-sans)",
  phone: "md:w-[390px] md:h-[min(844px,92svh)] md:rounded-[48px] md:border-[12px] md:border-[#0F172A] overflow-hidden bg-[#EAF2FF]",
  me: "self-end bg-[#2F6BFF] text-white rounded-[1.25rem] rounded-br-md",
  her: "self-start bg-[#D93A6A] text-white rounded-[1.25rem] rounded-bl-md",
  guest: "self-end bg-white text-[#0F172A] border border-[#DCE5F3] rounded-[1.25rem] rounded-br-md",
  card: "bg-white border border-[#DCE5F3] rounded-2xl w-[80%]",
  meta: "text-[12px] font-medium text-[#556277]",
  bubble: "max-w-[78%] px-4 py-2.5 text-[16px] font-medium leading-[1.45] break-words",
} as const;
```

### 7.3 Mở thiệp (Flip)
```tsx
gsap.registerPlugin(Flip);
function open() {
  music.play();
  const state = Flip.getState(".notif");
  setOpened(true);                       // render header chat với data-flip-id="notif"
  requestAnimationFrame(() => {
    Flip.from(state, { targets: ".chat-header", duration: 0.7, ease: "power2.inOut",
      onComplete: onOpened });           // → OpenGate mở khoá cuộn
    gsap.to(".lock-bg", { yPercent: -100, autoAlpha: 0, duration: 0.7 });
  });
}
```

### 7.4 Cuộn cuộc trò chuyện
```tsx
useGSAP(() => {
  if (reduced) return;                                     // reduced: cột tin tĩnh, không ghim
  const items = gsap.utils.toArray<HTMLElement>(".msg");   // cùng thứ tự với script
  const col = colRef.current!, viewH = () => viewportRef.current!.clientHeight;
  gsap.set(items, { autoAlpha: 0 });
  const tl = gsap.timeline({ scrollTrigger: { trigger: ".chat-zone", start: "top top",
    end: () => `+=${items.length * beat()}`, pin: ".phone", scrub: 0.4, invalidateOnRefresh: true } });
  items.forEach((el) => {
    const typing = el.previousElementSibling?.classList.contains("typing") ? el.previousElementSibling : null;
    if (typing) tl.to(typing, { autoAlpha: 1, duration: 0.4 }).to(typing, { autoAlpha: 0, duration: 0.1 });
    tl.fromTo(el, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)" })
      .to(col, { y: () => Math.min(0, viewH() - (el.offsetTop + el.offsetHeight + 16)), duration: 0.5, ease: "power2.out" }, "<");
  });
}, { scope: root, dependencies: [reduced, script.length] });
```
- `beat()` ≈ 15svh; tin thẻ lớn (invite, location, rsvp) có `data-beats="3"` để dài hơn.
- Chỉ animate `transform`/`opacity` (cột dịch bằng `y`, không đổi `scrollTop`).
- "Đang nhập" là phần tử riêng đứng ngay trước tin trong DOM (`typing.tsx`), chỉ tạo cho tin `text` của groom/bride.
- Thanh ghim → `tl.scrollTrigger` + `labels`: thêm `tl.addLabel("invite")` trước tin invite; bấm ghim gọi `gsap.to(window, { scrollTo: tl.scrollTrigger.labelToScroll("invite") })` (ScrollToPlugin).

### 7.5 Logic cần test
- `script.test.ts`: `buildScript(sample, now)` có đúng 1 tin `invite`, 1 `rsvp`, kết thúc bằng `seen`; số ô ảnh trong các tin `photos` = `images.length - 4` (trừ bìa, 2 chân dung, ảnh cuối); không có chuỗi chứa `undefined`; 9 ảnh album thì chia 2 tin ảnh (4 + 5), tin thứ hai hiện 3 ô + ô `+2`.
- `ics.test.ts`: `buildIcs` có `BEGIN:VCALENDAR`, `DTSTART` định dạng `YYYYMMDDTHHmmss`, escape dấu phẩy/chấm phẩy trong `venue.name`, xuống dòng CRLF.
- Countdown/định dạng ngày dùng `@/kit`, không test lại.

### 7.6 Thứ tự làm
1. `meta.ts`, `layout.tsx`, `page.tsx`, tokens
2. `script.ts` + `ics.ts` + test
3. `phone-frame`, `chat-header`, `bubble`, các thẻ tin — render **tĩnh** toàn bộ script (chính là bản reduced-motion), khớp 360px / 768px / 1440px
4. `lock-screen.tsx` + Flip + nhạc
5. Ghim khung + timeline scrub (§7.4) + "đang nhập…"
6. Tin đặc biệt: bình chọn, tin thoại đồng bộ audio, lớp phủ bản đồ, lightbox, composer RSVP
7. Confetti cầu hôn, "Đã xem ✓✓", thu về màn hình khoá
8. Reduced-motion, tên dài, bàn phím ảo trên iOS/Android, Lighthouse, checklist §12

---

## 8. Asset cần chuẩn bị
- [ ] SVG: icon app "Thương", đảo camera điện thoại, icon 📌/📅/📍/📊 (hoặc dùng emoji hệ thống — quyết định khi làm, ưu tiên emoji để giảm asset)
- [ ] `music.mp3` (Pixabay, pop acoustic 95–110 BPM) + (tuỳ chọn) `pop.mp3` ≤ 0.2s, ghi `CREDITS.md`
- [ ] 8 ảnh mẫu đời thường, selfie, tông sáng (Unsplash/Pexels) ≤ 300KB `.webp`; `images[1]`, `images[2]` mặt ở giữa để cắt tròn
- [ ] 2 QR mẫu
- [ ] `thumb.webp` 600×800: điện thoại với bong bóng chat xanh/hồng và thẻ thiệp mời
- [ ] `opengraph-image.png` 1200×630

## 9. Tiêu chí nghiệm thu riêng
- [ ] Từ lúc chạm thông báo tới lúc cuộn được ≤ 1.3s; nhạc phát ngay khi chạm
- [ ] Không dùng tên/logo/màu nhận diện của ứng dụng nhắn tin có thật
- [ ] Chữ trắng trên bong bóng cô dâu đạt ≥ 4.5:1 (nền `#D93A6A`)
- [ ] Cuộn ngược lên thì tin nhắn ẩn lại đúng thứ tự, không nhảy vị trí cột tin
- [ ] Bản đồ và iframe không bẫy cuộn trong khung ghim; lớp phủ bản đồ đóng được bằng phím Esc
- [ ] Mở bàn phím ảo ở form RSVP không làm khung chat nhảy hay tin nhắn chạy tiếp
- [ ] Header chat, thanh nhập không đè 3 góc của nút chung ở 360px
- [ ] Reduced-motion: toàn bộ cuộc trò chuyện đọc được như trang tĩnh, không ghim
- [ ] Tên 50 ký tự: thông báo C1 cắt 1 dòng, thẻ mời xuống dòng, không tràn bong bóng
