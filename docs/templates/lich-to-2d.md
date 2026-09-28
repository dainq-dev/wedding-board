# 2D-18 · `lich-to-2d` · Lịch Bloc

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md). Cấu trúc tài liệu theo mẫu chuẩn [letter-2d.md](./letter-2d.md).

---

## 1. Concept

**Một câu:** Một cuốn lịch bloc treo tường quen thuộc của mọi nhà Việt; khách xé từng tờ, đếm ngược từ hôm nay tới ngày cưới, và mỗi tờ tiếp theo là một phần của tấm thiệp.

**Cảm xúc muốn gợi:** hoài niệm, ấm áp gia đình, vui như sáng mùng Một xé tờ lịch Tết. Trang trọng vừa phải, rất "Việt".

**Phù hợp với:** cặp đôi thích nét truyền thống nhưng không muốn Song Hỷ quá nghiêm; gia đình quan tâm ngày âm lịch, ngày lành tháng tốt; cưới ở quê hoặc tư gia.

**Khác các mẫu khác ở chỗ:** toàn bộ trang là **một cuốn bloc cố định giữa màn hình**, cuộn trang = **xé tờ**: tờ hiện tại bị kéo lên, cong góc, xoay và rơi khỏi màn hình, để lộ tờ phía dưới (biến thể của T3 nhưng theo chiều ngược: tờ cũ **bay đi**, tờ mới **nằm sẵn bên dưới**). Mỗi tờ theo đúng bố cục tờ lịch thật: số dương to, thứ, dòng âm lịch, câu ca dao ở chân tờ. Đây là mẫu duy nhất **tính ngày âm lịch**.

**Moodboard:** lịch bloc giấy pơ-luya mỏng, số đỏ ngày Chủ nhật, số xanh đen ngày thường, bìa cứng in hình hoa mai/đào, kẹp sắt và đinh treo trên tường vôi, câu ca dao in nghiêng, gáy lịch dính keo đỏ với mép giấy xé nham nhở.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `wall` | `#F7F3EA` | Nền trang: tường vôi |
| `sheet` | `#FFFFFF` | Tờ lịch |
| `sheet-back` | `#F2EEE6` | Mặt sau tờ đang bay đi, các tờ lấp ló bên dưới |
| `red` | `#C1121F` | Màu chủ đạo: số ngày Chủ nhật/ngày cưới, gáy keo, nút, tiêu đề |
| `red-dark` | `#8E0D17` | Hover, chữ đỏ nhỏ cần tương phản cao |
| `navy` | `#003049` | Số ngày thường, khối nhấn thứ hai |
| `gold` | `#C9A227` | Trang trí hiếm: viền bìa, hoa mai (không dùng làm chữ) |
| `ink` | `#1B1B1B` | Chữ chính |
| `ink-soft` | `#5E5A52` | Âm lịch, chú thích |
| `rule` | `#E3DCCD` | Đường kẻ trên tờ lịch |

Tương phản: `ink` trên `sheet` ≈ 17:1 ✅. `ink-soft` trên `sheet` ≈ 6.7:1 ✅. `red` trên `sheet` ≈ 5.9:1 ✅. `navy` trên `sheet` ≈ 13:1 ✅. Trắng trên `red` ≈ 5.9:1 ✅. `gold` trên trắng ≈ 2.4:1 ❌ → chỉ trang trí.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Số dương lịch rất to | Oswald 700 | 168px / 0.9 | 240px | Như số in trên bloc |
| Tên cặp đôi | Oswald 600, VIẾT HOA, tracking 0.06em | 30px / 1.1 | 48px | |
| Tiêu đề tờ (tháng, "THỨ BẢY") | Oswald 500, VIẾT HOA, tracking 0.2em | 15px | 18px | |
| Nội dung, ca dao | Noto Serif 400 / 400 italic | 17px / 1.6 | 19px | Ca dao in nghiêng |
| Âm lịch, nhãn nhỏ | Noto Serif 400 | 13px | 14px | |

Hai font đều có subset `vietnamese`.

### Hình khối và chất liệu
- **Cuốn bloc**: khung `sheet` rộng `min(88vw, 420px)`, tỉ lệ 3:4, bo `rounded-[0.25rem]`. Phía trên là **gáy keo đỏ** cao 18px (`bg-[#C1121F]`) có 2 lỗ treo và 1 đinh trên tường (SVG).
- **Chồng tờ**: phía dưới tờ hiện tại luôn lấp ló 3 mép giấy lệch `y: +2/+4/+6px` màu `sheet-back` để tạo độ dày; độ dày giảm dần khi gần ngày cưới (số tờ còn lại ít).
- **Mép xé**: dải răng cưa không đều ở mép trên của tờ đang bay (SVG path cố định, 3 biến thể dùng xoay vòng).
- **Vân giấy**: `feTurbulence` opacity 0.05, component `<PaperGrain/>`.
- **Icon/hoạ tiết**: hoa mai 5 cánh, bông đào, chữ Hỷ nhỏ ở góc tờ ngày cưới — SVG nét liền màu `red`/`gold`.
- **Motion**: ease chủ đạo `power2.in` cho tờ bị xé (tăng tốc khi rơi), `power2.out` cho nội dung vào. Tờ bay 0.7s. Không nảy.

---

## 3. Nhạc

- **Tâm trạng**: hoà tấu dân ca/nhạc xuân: đàn tranh, sáo trúc, đàn bầu nhẹ trên nền đàn dây; vui, ấm, không lời.
- **Tempo**: 85–95 BPM. **Độ dài**: 2:00–3:00, lặp lại.
- **Từ khoá Pixabay**: `vietnamese folk instrumental`, `asian lunar new year`, `traditional zither happy`
- **Hành vi**:
  - Bắt đầu khi bấm "Xé lịch" (C1), âm lượng 0 → 0.6 trong 1.5s.
  - Mỗi lần xé tờ có tiếng "xoẹt" giấy ngắn (SFX ≤ 0.4s, âm lượng 0.3, **chỉ khi nhạc đang bật**; tắt nhạc thì tắt luôn SFX). Tối đa 1 SFX mỗi 250ms để không ồn khi cuộn nhanh.
  - C16 là tờ lịch "Bài hát của chúng tôi".
  - Ẩn tab thì tạm dừng.

---

## 4. Cấu trúc trang

Cuốn bloc được **ghim giữa màn hình** trong suốt phần thân; mỗi "tờ" tương ứng 1 đoạn cuộn. Tờ cuối cùng bị xé thì bloc thả ghim và trang kết thúc bằng C10.

```
┌───────────────────────────┐
│ C1  Bloc hôm nay           │ 100svh  (cố định tới khi bấm)
├───────────────────────────┤
│ ╔═ Bloc ghim (pin) ══════╗ │
│ ║ Tờ 1  C5+C11 Ngày cưới ║ │ 120svh  (tờ quan trọng nhất, ở trên cùng)
│ ║ Tờ 2  C2 Lời mời       ║ │ 100svh
│ ║ Tờ 3  C3 Nhà trai      ║ │ 100svh
│ ║ Tờ 4  C3 Nhà gái       ║ │ 100svh
│ ║ Tờ 5  C4 Chuyện tình   ║ │ 140svh  (3 mốc = 3 tờ nhỏ "lịch tháng cũ")
│ ║ Tờ 6  C12 Lịch trình   ║ │ 100svh
│ ║ Tờ 7  C6+C7 Hai lễ     ║ │ 140svh
│ ║ Tờ 8  C16 Bài hát      ║ │  70svh
│ ║ Tờ 9  C14 Mừng cưới    ║ │  90svh
│ ║ Tờ 10 C15 Xác nhận     ║ │ 100svh
│ ╚════════════════════════╝ │  ~1060svh ghim, mỗi ranh giới = 1 lần xé
│ C8  Album "bìa lịch"       │ 180svh  thả ghim, lưới ảnh như bìa lịch 12 tháng
│ C10 Lời cảm ơn             │ 100svh
└───────────────────────────┘
```

**Vì sao không ghim C8?** Album nhiều ảnh cần cuộn tự do; đặt album như "tấm bìa cứng phía sau cuốn bloc" sau khi xé hết tờ tạo cái kết tự nhiên: bloc đã mỏng hết, lật ra sau là ảnh.

Chiều cao mỗi tờ trong bảng là **quãng cuộn** để đọc + xé, không phải chiều cao hiển thị (tờ luôn là 3:4). Tờ nhiều chữ (C6+C7) có nội dung cuộn bên trong tờ (xem §5).

Trên desktop: bloc đặt lệch trái 40%, bên phải là cột ảnh `images[0]` lớn dạng "tranh treo tường" (A4 parallax nhẹ). Mobile: chỉ bloc.

---

## 5. Chi tiết từng section

### C1 · Bloc hôm nay (màn mở thiệp)

**Mục đích:** khoảnh khắc "đếm ngày": tờ lịch hiện **đúng ngày hôm nay**, bấm nút là các tờ bị xé liên tục cho tới ngày cưới. Đồng thời là thao tác mở khoá nhạc.

**Wireframe (360px):**
```
┌────────────────────────────┐
│            ⊙ đinh          │
│   ┌──────────────────────┐ │
│   │▓▓▓▓ gáy keo đỏ ▓▓▓▓▓▓│ │
│   │ THÁNG 9 · 2026   ✿   │ │
│   │                      │ │
│   │         29           │ │  ← Oswald 168px, navy (hôm nay)
│   │                      │ │
│   │      THỨ BA          │ │
│   │ Âm lịch: 19/8 Bính Ngọ│ │  ← Noto Serif 13px
│   │ ──────────────────── │ │
│   │ "Còn 46 ngày nữa..." │ │
│   └──────────────────────┘ │
│    ▔▔▔ mép các tờ dưới ▔▔▔ │
│                            │
│   [ ✂ Xé lịch tới ngày     │  ← nút đỏ, 48px
│      cưới của Quân & Hà ]  │
└────────────────────────────┘
```

**Nội dung:**
- Tờ hôm nay: tháng/năm, số ngày, thứ, âm lịch (ngày/tháng + can chi năm).
- Dòng giữa: *"Còn {n} ngày nữa là tới ngày vui"* (n = số ngày tới `date`).
- Nút: *"Xé lịch tới ngày cưới của {tên gọi chú rể} & {tên gọi cô dâu}"*.
- ⚠️ `date` chưa có → dùng ngày mẫu `14.11.2026`. Nếu hôm nay ≥ ngày cưới → tờ hôm nay chính là ngày cưới, nút đổi thành *"Mở thiệp"* và không xé liên tục.

**Animation vào:**
| t | Hành động |
|---|---|
| 0.0s | Đinh + bloc rơi xuống treo lên đinh: `y: -60 → 0`, `rotate: -4° → 0` với 1 lần đung đưa `rotate ±2°` (1.2s tổng, `sine.inOut`) |
| 0.8s | Số ngày A1 |
| 1.2s | Nút A1 |

**Khi bấm nút (timeline xé liên tục, tối đa 2.2s):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc bắt đầu |
| 0.0s | Tờ hôm nay bị xé (xem "chuyển động xé" ở dưới), 0.45s |
| 0.15s → 1.8s | Các tờ trung gian xé liên tục, **mỗi tờ hiển thị số thật** của các ngày giữa hôm nay và ngày cưới; khoảng cách giữa 2 tờ giảm dần từ 0.2s → 0.06s (`expo.in`) |
| 1.8s | Tờ ngày cưới lộ ra; số ngày "đập" `scale 1.15 → 1` (0.3s) |
| 2.2s | Mở khoá cuộn, khởi tạo ScrollSmoother + ghim bloc |

**Giới hạn:** số tờ trung gian hiển thị tối đa **24**. Nếu khoảng cách > 24 ngày thì lấy mẫu đều (vd 120 ngày → mỗi tờ cách 5 ngày) nhưng luôn gồm tờ hôm nay và tờ ngày cưới. Tờ trung gian là component nhẹ (chỉ số + thứ), không render âm lịch để nhanh.

**Chuyển động xé (dùng chung cho C1 và mọi ranh giới tờ):** tờ quay quanh góc trên-phải `transformOrigin: "90% 0%"`, `rotate: 0 → -18°`, `y: 0 → -35%`, `x: 0 → 12%`, sau đó rơi `y → 140vh`, `rotate → -40°`, `opacity → 0`. Mép trên đổi sang SVG mép xé khi bắt đầu chuyển động.

**Reduced-motion:** không xé liên tục; bấm nút là crossfade 0.3s sang tờ ngày cưới.
**Edge case:** tên gọi dài → nút xuống 2–3 dòng, không đổi cỡ chữ nút.

---

### Tờ 1 · C5 + C11 · Ngày cưới (tờ quan trọng nhất)

**Wireframe:**
```
┌────────────────────────────┐
│ ▓▓▓▓▓▓▓ gáy keo ▓▓▓▓▓▓▓▓▓▓ │
│ THÁNG MƯỜI MỘT · 2026  囍  │
│                            │
│           14               │  ← Oswald 168px, red
│                            │
│        THỨ BẢY             │
│ ─────────────────────────  │
│ Âm lịch  6 tháng 10        │
│ năm Bính Ngọ               │
│ ─────────────────────────  │
│  45 : 06 : 12 : 33         │  ← đếm ngược A7, Oswald 28px
│ ngày  giờ  phút  giây      │
│ ┌ lịch tháng mini ───────┐ │
│ │T2 T3 T4 T5 T6 T7 CN    │ │  ← 12px
│ │… 12 13 (14) 15 …       │ │  ← vòng tròn đỏ vẽ tay A6
│ └────────────────────────┘ │
│ "Thuận vợ thuận chồng      │
│  tát biển Đông cũng cạn."  │  ← ca dao, italic
└────────────────────────────┘
```

**Nội dung:** số ngày, tháng bằng chữ, thứ, âm lịch (ngày, tháng, can chi năm — tính bằng `lunar.ts`), đếm ngược tới `date`, lịch tháng mini (tuần bắt đầu Thứ Hai), ca dao cố định. Sau ngày cưới: đếm ngược thay bằng *"Chúng tôi đã về chung một nhà ♥"*.
**Animation:** số ngày đếm `1 → 14` (0.8s, `snap: 1`); vòng tròn đỏ vẽ A6 quanh ô ngày (0.8s); chữ số đếm ngược A7.
**Chuyển sang tờ 2:** chuyển động xé, `scrub`, xem §7.4.

---

### Tờ 2 · C2 · Lời mời

```
┌────────────────────────────┐
│ ▓▓▓▓▓▓▓ gáy keo ▓▓▓▓▓▓▓▓▓▓ │
│ ✿ TRÂN TRỌNG KÍNH MỜI ✿    │
│ ╭────────────────────────╮ │
│ │     ảnh bìa images[0]  │ │  ← 4:3, viền trắng 6px
│ ╰────────────────────────╯ │
│      MINH QUÂN             │  ← <h1> Oswald 600 30px
│          &                 │
│        THU HÀ              │
│ ─────────────────────────  │
│ tới dự lễ thành hôn của    │
│ chúng tôi vào ngày         │
│ 14 · 11 · 2026             │
│ (tức 6 tháng 10 năm Bính Ngọ)│
│ "Trăm năm tính cuộc vuông  │
│  tròn…"                    │
└────────────────────────────┘
```
**Animation:** ảnh A3 1.1s; tên A2 theo `chars` stagger 0.03; ngày A1.
**Edge case:** tên 50 ký tự → cỡ 22px, cho xuống dòng; ảnh thu còn 16:9 để tờ không tràn 3:4.

---

### Tờ 3 & 4 · C3 · Nhà trai / Nhà gái (2 tờ riêng)

```
┌────────────────────────────┐
│ ▓▓▓▓▓▓▓ gáy keo ▓▓▓▓▓▓▓▓▓▓ │
│ NHÀ TRAI                   │  ← nhãn đỏ góc trái như "NGÀY TỐT"
│  ╭──────────╮              │
│  │ images[1]│  4:5         │
│  ╰──────────╯              │
│  Minh Quân                 │  ← Oswald 26px
│  Ông … & Bà …   ⚠️         │  ← chỉ hiện khi có tên bố mẹ
│  Quận 1, TP. Hồ Chí Minh   │  ← {groom.address}
│ ─────────────────────────  │
│ "Con trai trưởng …" ⚠️      │  ← bỏ nếu không có dữ liệu
│ Giờ hoàng đạo: Thìn, Tỵ    │  ← trang trí, viết sẵn
└────────────────────────────┘
```
Tờ 4 tương tự, `images[2]`, `{bride.*}`, nhãn "NHÀ GÁI".
**Lý do tách 2 tờ:** mỗi lần xé = 1 người, nhịp đều; tránh 2 cột chật ở 360px.
**Animation:** ảnh A3; tên A1. Dòng "giờ hoàng đạo" là chữ trang trí cố định (không tính thật), ghi chú trong code để không ai hiểu nhầm là tính toán.

---

### Tờ 5 · C4 · Chuyện tình (3 tờ lịch cũ ghim lên)

```
┌────────────────────────────┐
│ ▓▓▓▓▓▓▓ gáy keo ▓▓▓▓▓▓▓▓▓▓ │
│ NHỮNG NGÀY ĐÁNG NHỚ        │
│ ┌──────┐                   │
│ │ 12   │ ← tờ lịch cũ nhỏ, │
│ │ T3   │   ghim kẹp, xoay  │
│ └──────┘   -5°, ảnh [3]    │
│        ┌──────┐            │
│        │ 20   │  ảnh [4]   │
│        └──────┘            │
│ ┌──────┐                   │
│ │ 02   │  ảnh [5]          │
│ └──────┘                   │
│ Gặp nhau · Thương · Hỏi cưới│
└────────────────────────────┘
```
**Nội dung viết sẵn:** 3 mốc *"Ngày gặp nhau"*, *"Ngày nói thương"*, *"Ngày hỏi cưới"* — mỗi tờ nhỏ có số ngày mẫu cố định và 1 câu: *"Một ngày bình thường bỗng thành ngày đặc biệt."*, *"Từ hôm ấy, lịch nào cũng có tên nhau."*, *"Và chúng tôi bắt đầu đếm ngày."*. Ảnh hiện ở mặt sau tờ nhỏ.
**Tương tác:** chạm tờ nhỏ → lật `rotateY 180°` (0.6s) để xem ảnh; chạm lại lật về. Có `aria-pressed`.
**Animation:** 3 tờ nhỏ rơi vào lần lượt (`y: -30`, `rotate` tới giá trị cuối, stagger 0.2), kẹp ghim bấm xuống.

---

### Tờ 6 · C12 · Lịch trình

```
┌────────────────────────────┐
│ ▓▓▓▓▓▓▓ gáy keo ▓▓▓▓▓▓▓▓▓▓ │
│ VIỆC TRONG NGÀY            │
│ ┌────┬───────────────────┐ │
│ │17:00│ Đón khách         │ │  ← bảng kẻ ô như phần "ghi chú"
│ │18:00│ Làm lễ thành hôn  │ │     của lịch
│ │18:30│ Khai tiệc         │ │
│ │20:00│ Giao lưu          │ │
│ └────┴───────────────────┘ │
│ Giờ tốt · Việc nên làm:    │
│ Cưới hỏi ✓ Tụ họp ✓        │  ← trang trí, chữ đỏ
└────────────────────────────┘
```
**Nội dung:** giờ tính từ `date` như letter-2d (−1h, 0, +30′, +2h).
**Animation:** mỗi dòng như được viết tay: gạch chân đỏ vẽ A6 dưới giờ, stagger 0.2s. Dấu ✓ "đánh" vào sau cùng.

---

### Tờ 7 · C6 + C7 · Hai lễ và bản đồ

```
┌────────────────────────────┐
│ ▓▓▓▓▓▓▓ gáy keo ▓▓▓▓▓▓▓▓▓▓ │
│ LỄ VU QUY                  │
│ 08:00 · Thứ Bảy 14.11      │
│ Tư gia nhà gái             │
│ {bride.address}            │
│ ─────────────────────────  │
│ TIỆC CƯỚI                  │
│ 18:00 · Thứ Bảy 14.11      │
│ {venue.name}               │
│ ┌────────────────────────┐ │
│ │ <MapEmbed/> 16:10      │ │
│ └────────────────────────┘ │
│ [ ⌖ Chỉ đường ]            │
└────────────────────────────┘
```
**Vấn đề:** tờ 3:4 không đủ cao cho bản đồ ở 360px. **Giải pháp:** tờ này cho phép cao hơn (`aspect-auto`, `min-h` = chiều cao tờ chuẩn) và quãng cuộn 140svh: trong 40svh đầu, **nội dung tờ dịch lên** (`y` scrub) để đọc hết phần dưới, sau đó mới xé. Bloc vẫn ghim.
**Bản đồ:** `<MapEmbed>` chỉ mount khi tờ 6 đang hiển thị (tờ 7 là tờ kế tiếp) — tức là trước 1 tờ. Bên trong vùng ghim, iframe bắt sự kiện cuộn → đặt `pointer-events-none` cho iframe cho tới khi người dùng chạm vào nút "Xem bản đồ lớn" (mở `MapEmbed` trong lớp phủ toàn màn hình). Tránh bẫy cuộn trên mobile.

---

### Tờ 8 · C16 · Bài hát

```
┌────────────────────────────┐
│ ▓▓▓▓▓▓▓ gáy keo ▓▓▓▓▓▓▓▓▓▓ │
│ HÔM NAY NGHE GÌ?           │
│ ♪ Bài hát của chúng tôi    │
│   [ ▶ / ❚❚ ]   ──●─── 1:12 │
│ "Chạm để nghe"             │
└────────────────────────────┘
```
Đồng bộ `<MusicPlayer>`. Nốt nhạc SVG nhún A12 khi đang phát, đứng yên khi dừng.

---

### Tờ 9 · C14 · Mừng cưới

```
┌────────────────────────────┐
│ ▓▓▓▓▓▓▓ gáy keo ▓▓▓▓▓▓▓▓▓▓ │
│ MỪNG CƯỚI                  │
│ Sự hiện diện của quý khách │
│ là niềm vui của gia đình.  │
│ ┌────────┐ ┌────────┐      │
│ │  QR    │ │  QR    │      │  ← QR mẫu ⚠️ §8.3
│ │nhà trai│ │nhà gái │      │
│ └────────┘ └────────┘      │
└────────────────────────────┘
```
Chạm QR → A10. Hai QR nằm trên nền "phong bao đỏ" nhỏ (khối `red` bo góc, chữ trắng).

---

### Tờ 10 · C15 · Xác nhận tham dự

```
┌────────────────────────────┐
│ ▓▓▓▓▓▓▓ gáy keo ▓▓▓▓▓▓▓▓▓▓ │
│ GHI VÀO LỊCH NHÉ!          │
│ [ Tên của bạn         ]    │
│ ( ) Tôi sẽ đến             │
│ ( ) Rất tiếc, không đến    │
│ Số người: [ 1 ▾ ]          │
│ [ Khoanh ngày này ]        │
│ Bản xem thử — không gửi đi │
└────────────────────────────┘
```
**Hành vi:** bấm nút → form thu lại, vòng tròn đỏ vẽ tay (A6) khoanh quanh dòng *"Cảm ơn {tên}! Hẹn gặp ngày 14.11 ♥"*. Không gửi dữ liệu.
**Lưu ý ghim:** khi input đang focus (bàn phím mobile mở), **không** cho tờ này bị xé bởi cuộn nhỏ do bàn phím: tạm `ScrollTrigger` `disable()` khi `focusin` trong form và `enable()` khi `focusout`.

---

### C8 · Album "bìa lịch 12 tháng" (thả ghim)

```
┌────────────────────────────┐
│ ALBUM · BÌA LỊCH           │
│ ┌──────────┐┌──────────┐   │
│ │ ảnh 3    ││ ảnh 4    │   │  ← mỗi ảnh là 1 "tháng",
│ │ THÁNG 1  ││ THÁNG 2  │   │     nhãn Oswald đỏ dưới ảnh
│ └──────────┘└──────────┘   │
│ ┌──────────┐┌──────────┐   │
│ │ ảnh 5    ││ ảnh 6    │   │
│ │ THÁNG 3  ││ THÁNG 4  │   │
│ └──────────┘└──────────┘   │
└────────────────────────────┘
```
**Nội dung:** `images[3..n-2]` lưới 2 cột (desktop 3 cột), nhãn "THÁNG i" tăng dần (chỉ trang trí).
**Chuyển tiếp vào:** tờ cuối bị xé → gáy keo trống, bloc **lật ra sau** (`rotateX 0 → 180°` quanh mép trên, 0.8s scrub) để lộ tấm bìa cứng, bìa phóng to thành nền section album (T6 nhẹ). Sau đó thả ghim, cuộn tự nhiên.
**Animation:** mỗi ảnh A3 khi vào viewport, stagger theo hàng. Chạm → A10.
**Reduced-motion:** không lật bìa, album A1 0.3s.

---

### C10 · Lời cảm ơn

```
┌────────────────────────────┐
│ ╭──────────────╮           │  ← images[n-1]
│ │   ẢNH CUỐI   │           │
│ ╰──────────────╯           │
│ Ngày nào có quý khách      │
│ cũng là ngày vui.          │
│ Cảm ơn và hẹn gặp lại!     │
│   MINH QUÂN & THU HÀ       │
│ ┌──────┐                   │
│ │  14  │ ← tờ lịch ngày cưới│
│ │ ♥    │   thu nhỏ, gấp    │
│ └──────┘   làm kỷ niệm     │
└────────────────────────────┘
```
**Animation:** tờ lịch ngày cưới nhỏ (bản sao của tờ 1) bay vào từ trên, xoay nhẹ, đậu lên góc ảnh như được kẹp làm kỷ niệm (0.8s, A1 + rotate).

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | Tờ 2 (C2) ảnh bìa; desktop cột "tranh treo tường" | 4:3 |
| `images[1]` | Tờ 3 nhà trai | 4:5 |
| `images[2]` | Tờ 4 nhà gái | 4:5 |
| `images[3..5]` | Tờ 5 (mặt sau 3 tờ nhỏ) và C8 | 4:5 |
| `images[3..n-2]` | C8 album | 4:5 |
| `images[n-1]` | C10 ảnh cuối | 3:4 |

`meta.media = { images: 7, videos: 0 }`.

Trường ⚠️: `date` (toàn bộ mẫu xoay quanh ngày) — fallback ngày mẫu `14.11.2026 18:00`; tên bố mẹ — ẩn dòng; QR — QR mẫu. Mẫu **không** cần thêm trường giờ âm lịch hay ngày âm: tất cả tính từ `date`.

---

## 7. Triển khai code

### 7.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/lich-to-2d/
├── meta.ts
├── layout.tsx                 # Oswald + Noto_Serif (vietnamese)
├── page.tsx                   # return <LichToInvite />
└── _components/
    ├── lich-to-invite.tsx     # "use client" — ghép, tokens `t`, SmoothScroll
    ├── bloc.tsx               # khung bloc ghim: gáy keo, đinh, mép tờ bên dưới, quản lý stack
    ├── sheet.tsx              # 1 tờ lịch (header tháng + slot nội dung + chân ca dao)
    ├── tear.ts                # tearTo(el, tl?) — tween xé dùng chung C1 & scroll
    ├── opening-flurry.tsx     # C1: tờ hôm nay + xé liên tục
    ├── flurry-days.ts         # pickFlurryDays(today, wedding, max=24)
    ├── flurry-days.test.ts
    ├── sheets/
    │   ├── wedding-day.tsx    # tờ 1 (C5+C11)
    │   ├── invite.tsx         # tờ 2
    │   ├── family.tsx         # tờ 3,4 (prop side)
    │   ├── story.tsx          # tờ 5
    │   ├── schedule.tsx       # tờ 6
    │   ├── events.tsx         # tờ 7
    │   ├── song.tsx           # tờ 8
    │   ├── gift.tsx           # tờ 9
    │   └── rsvp.tsx           # tờ 10
    ├── album-cover.tsx        # C8
    ├── thanks.tsx             # C10
    └── svg/                   # đinh, mép xé ×3, hoa mai, chữ Hỷ, vòng tròn vẽ tay
```
**Âm lịch:** theo ý tưởng gốc đặt ở `src/kit/lunar.ts` (dùng chung). Nếu `@/kit` chưa có hàm này khi làm mẫu, tạo trong `src/kit/` **cùng PR nền tảng**, không để trong `_components/` (sẽ có mẫu khác như `song-hy-2d` cần). API:
```ts
solarToLunar(d: Date, tz = 7): { day: number; month: number; year: number; leap: boolean }
canChiYear(lunarYear: number): string   // 2026 → "Bính Ngọ"
```
Thuật toán Hồ Ngọc Đức (tính điểm sóc + trung khí theo múi giờ +7). Test với các cặp ngày đã biết: 17/02/2026 = 1/1 Bính Ngọ; 29/01/2025 = 1/1 Ất Tỵ; một ngày trong tháng nhuận (vd 2025 nhuận tháng 6: 25/07/2025 = 1/6 nhuận).

Dùng chung: `SmoothScroll`, `OpenGate`, `MusicPlayer`, `Countdown`, `useReducedMotion`, `presets`, `lunar` từ `@/kit`; `MapEmbed` từ `@/components`; `useWedding()`.

### 7.2 Tokens Tailwind
```ts
export const t = {
  root: "min-h-screen bg-[#F7F3EA] text-[#1B1B1B] font-(family-name:--font-body)",
  sheet: "bg-white rounded-[0.25rem] shadow-[0_18px_40px_-18px_rgba(27,27,27,0.35)] aspect-[3/4] w-[min(88vw,420px)]",
  spine: "h-[18px] bg-[#C1121F] rounded-t-[0.25rem]",
  bigDay: "font-(family-name:--font-display) font-bold leading-[0.9] text-[168px] lg:text-[240px]",
  title: "font-(family-name:--font-display) uppercase tracking-[0.2em] text-[15px] lg:text-[18px]",
  red: "text-[#C1121F]",
  navy: "text-[#003049]",
  soft: "text-[#5E5A52]",
  proverb: "italic text-[#5E5A52] border-t border-[#E3DCCD] pt-3",
} as const;
```

### 7.3 Tween xé dùng chung
```ts
// tear.ts
export function tear(el: Element, tl = gsap.timeline()) {
  return tl
    .set(el, { transformOrigin: "90% 0%" })
    .to(el, { rotate: -18, yPercent: -35, xPercent: 12, duration: 0.25, ease: "power1.out" })
    .to(el, { yPercent: 140, rotate: -40, autoAlpha: 0, duration: 0.45, ease: "power2.in" });
}
```
C1: tạo 1 timeline, gọi `tear()` cho từng tờ trung gian ở vị trí thời gian tính trước (`expo.in`). Tờ trung gian render từ `pickFlurryDays()`.

### 7.4 Stack ghim theo cuộn
```tsx
useGSAP(() => {
  if (reduced) return;
  const sheets = gsap.utils.toArray<HTMLElement>(".sheet");        // DOM: tờ 1 ở trên (z cao nhất)
  const master = gsap.timeline({ scrollTrigger: {
    trigger: ".bloc-zone", start: "top top", end: () => `+=${totalScroll()}`,
    pin: ".bloc", scrub: 0.6, snap: { snapTo: "labels", duration: 0.4, ease: "power1.inOut" } } });
  sheets.slice(0, -1).forEach((s, i) => {
    master.addLabel(`s${i}`);
    master.to({}, { duration: readWeight[i] });                     // quãng đọc (tờ 7: scroll nội dung trong tờ)
    tear(s, master);
  });
  master.addLabel("end");
}, { scope: root, dependencies: [reduced] });
```
- `readWeight` lấy từ bảng §4 (chiều cao svh − 30svh cho động tác xé).
- `snap: "labels"` giúp dừng đúng ở mỗi tờ, không dừng giữa lúc tờ đang bay.
- SFX xé: `onUpdate` so sánh label hiện tại, phát khi đổi (throttle 250ms).
- Độ dày mép tờ dưới: `bloc.tsx` nhận `remaining` (số tờ còn lại) → 3/2/1/0 lớp mép.

### 7.5 Reduced-motion
Không ghim, không xé: các tờ xếp dọc cách nhau 24px như "đã xé ra bày trên bàn", mỗi tờ A1 0.3s. C1 bấm nút → crossfade sang tờ ngày cưới.

### 7.6 Logic cần test
- `lunar.ts`: 3 cặp ngày ở §7.1 + ngày cuối năm âm (tháng Chạp).
- `pickFlurryDays(today, wedding, 24)`: luôn có phần tử đầu = today, cuối = wedding; ≤ 24 phần tử; tăng dần; `today >= wedding` → `[wedding]`.
- Định dạng thứ/tháng tiếng Việt qua `Intl.DateTimeFormat("vi-VN")`, không cần test riêng.

### 7.7 Thứ tự làm
1. `meta.ts`, `layout.tsx`, `page.tsx`, tokens
2. `src/kit/lunar.ts` + test (nếu chưa có)
3. `sheet.tsx` + 10 tờ tĩnh + C8, C10, khớp wireframe 360px/1440px (tạm xếp dọc — cũng chính là bản reduced-motion)
4. `bloc.tsx` + stack ghim + `tear()` + snap
5. C1 xé liên tục + nhạc + SFX
6. Tờ 7 cuộn nội dung trong tờ + xử lý iframe
7. Lật bìa sang C8, animation từng tờ
8. Reduced-motion, tên dài, Lighthouse, checklist §12

---

## 8. Asset cần chuẩn bị
- [ ] SVG: đinh treo, gáy keo (lỗ treo), 3 biến thể mép xé, hoa mai, bông đào, chữ Hỷ nhỏ, vòng tròn vẽ tay, kẹp ghim
- [ ] `music.mp3` (Pixabay, dân ca/nhạc xuân hoà tấu) + `tear.mp3` ≤ 0.4s, ghi `CREDITS.md`
- [ ] 7 ảnh mẫu tông ấm, ưu tiên áo dài/không gian gia đình (Unsplash/Pexels) ≤ 300KB `.webp`
- [ ] 2 QR mẫu
- [ ] Danh sách 6–8 câu ca dao về hôn nhân (chọn câu dân gian phổ biến, không có bản quyền) cho chân các tờ
- [ ] `thumb.webp` 600×800: bloc treo tường, tờ ngày cưới số đỏ, 1 tờ đang bay
- [ ] `opengraph-image.png` 1200×630

## 9. Tiêu chí nghiệm thu riêng
- [ ] Âm lịch đúng với các ngày test (kể cả tháng nhuận) — `bun test` pass
- [ ] Xé liên tục ở C1 ≤ 2.2s bất kể còn bao nhiêu ngày; nhạc phát ngay khi bấm
- [ ] Mỗi lần cuộn dừng đúng một tờ (snap), không dừng giữa lúc tờ đang bay
- [ ] Không bẫy cuộn ở tờ bản đồ trên mobile; bàn phím mở ở tờ RSVP không làm xé tờ
- [ ] Xé tờ 60fps trên điện thoại tầm trung (chỉ `transform`, `opacity`)
- [ ] Hôm nay ≥ ngày cưới: C1 hiện tờ ngày cưới, không xé liên tục, đếm ngược đổi câu
- [ ] Tên 50 ký tự không làm tràn tờ 3:4 ở tờ 2, 3, 4
