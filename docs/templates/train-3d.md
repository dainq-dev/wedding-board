# 3D-06 · `train-3d` · Chuyến Tàu Thống Nhất

> Spec chi tiết của mẫu. Mã C, A, T xem [todo-list-wedding-page.md §2](../todo-list-wedding-page.md). Tuân thủ [template-spec.md](../template-spec.md).
> Dùng bộ công cụ 3D chung `src/kit/3d/` đã dựng ở [galaxy-3d](./galaxy-3d.md).

---

## 1. Concept

**Một câu:** Khách cầm một tấm vé tàu, được soát vé, rồi ngồi nhìn qua cửa sổ con tàu Thống Nhất chạy từ ga quê chú rể qua ruộng lúa, đèo núi, bờ biển tới ga quê cô dâu, và cuối cùng cả hai cùng xuống ở ga "Hạnh Phúc".

**Cảm xúc muốn gợi:** vui, hoài cổ, rộn ràng như chuyến đi xa về quê. "Hai con người ở hai đầu đất nước, một chuyến tàu nối lại."

**Phù hợp với:** cặp đôi khác tỉnh (Bắc – Nam, miền Trung – Sài Gòn), yêu xa, thích du lịch, phong cách vintage; ảnh cưới chụp ở ga tàu, đường tàu.

**Điểm khác biệt:** mẫu 3D duy nhất **nhìn ngang** (side-scroller): camera đặt cạnh đường ray, nhìn vuông góc, cảnh chạy **từ phải sang trái** với nhiều lớp độ sâu (parallax 3D thật: cột điện gần vụt qua nhanh, núi xa trôi chậm). Tàu có **tốc độ** (tăng tốc, chạy đều, phanh vào ga) quyết định bởi cuộn. **Tên ga lấy từ địa chỉ** hai nhà. Có **bảng giờ tàu split-flap** lật từng ký tự và **đoạn cuộn ngang** trong HTML (album dán trên cửa sổ toa). Nền **sáng** màu giấy vé cũ.

**Moodboard:** vé tàu bìa cứng thời bao cấp, tàu Thống Nhất sơn đỏ kem, bảng giờ tàu lật chữ ở ga Hà Nội cũ, poster du lịch vintage kiểu minh hoạ phẳng, đèo Hải Vân nhìn từ cửa sổ toa.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `ticket` | `#F3E7D3` | Nền trang, nền vé, trời ban ngày trong scene |
| `paper` | `#FFFAF0` | Nền card |
| `rail-red` | `#B3261E` | Màu chủ đạo: thân tàu, tiêu đề, nút, dấu bấm vé |
| `teal` | `#1F4E5F` | Điểm nhấn: sọc tàu, bảng giờ tàu, núi xa |
| `brass` | `#C8A15A` | Viền, đường kẻ, chi tiết đồng |
| `ink` | `#2D2419` | Chữ chính |
| `ink-soft` | `#6A5A47` | Chữ phụ |
| `board` | `#1B1B1B` | Nền bảng split-flap |
| `flap` | `#F5EBD8` | Chữ trên bảng split-flap |

Tương phản: `ink` trên `paper` khoảng 15:1 ✅. `ink-soft` trên `paper` khoảng 6.3:1 ✅. `rail-red` trên `paper` khoảng 6.4:1 ✅ (dùng được cho chữ nhỏ). Chữ `paper` trên `rail-red` khoảng 6.4:1 ✅. `flap` trên `board` khoảng 15:1 ✅. `teal` trên `paper` khoảng 9:1 ✅. `brass` chỉ trang trí (khoảng 2.3:1 ❌ cho chữ).

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Old Standard TT 400 italic | 40px / 1.1 | 72px | |
| Tên ga | Old Standard TT 700, VIẾT HOA, tracking 0.12em | 22px | 32px | Trên biển ga |
| Tiêu đề chương | Roboto Slab 600, VIẾT HOA, tracking 0.25em | 12px | 13px | |
| Ký tự split-flap | Roboto Slab 700 | 28px | 40px | Mỗi ký tự 1 ô cố định chiều rộng |
| Số lớn | Old Standard TT 700 | 80px | 120px | |
| Nội dung | Roboto Slab 300 | 16px / 1.7 | 17px | |
| Chữ vé (in) | Roboto Slab 500, VIẾT HOA | 11px | 12px | "HẠNG: GIƯỜNG NẰM · TOA 5" |

Cả hai font có subset `vietnamese`. Split-flap phải hiển thị chữ có dấu ("HÀ NỘI", "ĐÀ NẴNG") → bộ ký tự lật gồm cả chữ có dấu (§10.4).

### Hình khối và chất liệu
- **Vé tàu (card chính):** `rounded-[0.25rem]`, nền `paper`, viền đôi `brass`, hai mép trái phải **răng cưa lỗ xé** (`mask` hình tròn lặp theo trục y), một đường xé nét đứt dọc chia "cuống vé". Bóng `shadow-[0_8px_20px_-8px_rgba(45,36,25,0.35)]`.
- **Lỗ bấm vé:** hình tròn/ hình sao rỗng (SVG mask) đục qua vé, xuất hiện khi soát vé.
- **Biển ga:** chữ nhật `teal`, chữ `paper`, viền `paper` 3px bên trong (kiểu biển ga Việt Nam).
- **Cửa sổ toa:** `rounded-[1.25rem]` (bo góc lớn), viền `rail-red` dày 10px, bên trong là ảnh hoặc chữ.
- **Hoạ tiết:** dải đường ray (2 đường + tà vẹt) SVG làm vạch ngăn; tem bưu điện nhỏ ở góc vé.
- **Motion:** ease chủ đạo `power1.inOut` (tàu tăng tốc/phanh đều). Các card vào **trượt ngang từ phải** (cùng chiều cảnh chạy), không trượt dọc.

---

## 3. Nhạc
- **Tâm trạng:** acoustic retro vui, ukulele/guitar và harmonica, nhịp đều như bánh tàu, không lời.
- **Tempo:** khoảng 100 BPM. **Độ dài:** 2:00–3:00, lặp.
- **Từ khoá Pixabay:** `vintage travel acoustic`, `train journey happy`, `retro ukulele road trip`
- **Hành vi:**
  - Bắt đầu khi bấm "Soát vé". Âm lượng 0 → 0.55 trong 1.5s.
  - **Còi tàu** (`whistle.mp3` ≤ 60KB) phát 1 lần lúc soát vé và 1 lần khi tàu vào ga cuối.
  - **Tiếng bánh tàu** (`clack.mp3`, loop "xình xịch" ≤ 150KB) âm lượng **theo tốc độ tàu**: `0.25 · speed/maxSpeed`, tắt khi tàu dừng ở ga. `playbackRate` 0.8 → 1.2 theo tốc độ.
  - Ẩn tab thì tạm dừng tất cả.

---

## 4. Cấu trúc trang và chương

Trang HTML dài **1050svh** (tính cả đoạn cuộn ngang C8). Canvas `fixed inset-0 -z-10`.

```
┌───────────────────────────┐
│ #gate    C1  Vé tàu        │ 100svh  soát vé
├───────────────────────────┤
│ #depart  C2+C3 Ga nhà trai │ 130svh  tàu đỗ → chuyển bánh
│ #story   C4  Cửa sổ toa    │ 200svh  lúa → đèo → biển
│ #arrive  C3  Ga nhà gái    │ 110svh  tàu dừng, đón cô dâu
│ #album   C8  Toa ảnh (ngang)│ 220svh  pin + cuộn ngang A5
│ #final   C5+C6+C7 Ga cuối  │ 190svh  bảng split-flap, bản đồ
│ #sunset  C9+C10 Hoàng hôn  │ 100svh
└───────────────────────────┘
```

| Chương | Progress | HTML section | Card | Tàu |
|---|---|---|---|---|
| 0 | màn mở | `#gate` | C1 | đỗ ở ga 1 |
| 1 | 0.00–0.12 | `#depart` | C2 + C3 (chú rể) | đỗ → chuyển bánh (tăng tốc) |
| 2 | 0.12–0.34 | `#story` | C4 | chạy nhanh, 3 vùng cảnh |
| 3 | 0.34–0.45 | `#arrive` | C3 (cô dâu) | phanh, đỗ ga 2, chạy tiếp |
| 4 | 0.45–0.66 | `#album` | C8 | chạy đều (canvas mờ đi 40%) |
| 5 | 0.66–0.90 | `#final` | C5 + C6 + C7 | phanh, đỗ hẳn ở ga "Hạnh Phúc" |
| 6 | 0.90–1.00 | `#sunset` | C9 + C10 | chạy chậm vào hoàng hôn |

### Vị trí tàu và camera
Đường ray chạy theo **+x**. Tàu đi được quãng đường `trainX(p)`, là tích phân của hàm tốc độ theo bảng mốc (đỗ = tốc độ 0):

| progress | Tốc độ tương đối | trainX | Sự kiện |
|---|---|---|---|
| 0.00–0.05 | 0 | 0 | Đỗ ga 1 |
| 0.05–0.12 | 0 → 1 | 0 → 20 | Chuyển bánh |
| 0.12–0.34 | 1 | 20 → 320 | Qua lúa, đèo, biển |
| 0.34–0.38 | 1 → 0 | 320 → 340 | Phanh vào ga 2 |
| 0.38–0.41 | 0 | 340 | Đỗ ga 2 |
| 0.41–0.45 | 0 → 0.6 | 340 → 360 | Chuyển bánh |
| 0.45–0.66 | 0.6 | 360 → 520 | Đoạn album |
| 0.66–0.72 | 0.6 → 0 | 520 → 540 | Phanh vào ga cuối |
| 0.72–0.90 | 0 | 540 | Đỗ ga "Hạnh Phúc" |
| 0.90–1.00 | 0 → 0.3 | 540 → 560 | Lăn bánh vào hoàng hôn |

Camera **đi theo tàu** với độ lệch nhỏ theo keyframe (không bay đâu xa, giữ tinh thần side-scroller):

| progress | camera = `[trainX + dx, y, z]` | lookAt | Ghi chú |
|---|---|---|---|
| 0.00 | `dx 2, y 2.2, z 11` | `[trainX + 2, 1.6, 0]` | Sân ga, thấy đầu máy và biển ga |
| 0.12 | `dx 0, y 1.8, z 9` | `[trainX, 1.5, 0]` | Ngang toa khách, cửa sổ ở giữa màn hình |
| 0.34 | `dx -1, y 2.6, z 12` | `[trainX - 1, 1.4, 0]` | Lùi ra thấy cả biển |
| 0.40 | `dx 3, y 2.2, z 10` | `[trainX + 3, 1.6, 0]` | Ga 2 |
| 0.66 | `dx 0, y 1.8, z 9` | `[trainX, 1.5, 0]` | |
| 0.78 | `dx 6, y 3.2, z 13` | `[trainX + 6, 2.4, -2]` | Nhìn bảng giờ tàu trên sân ga |
| 1.00 | `dx -4, y 3.5, z 18` | `[trainX + 4, 2, -10]` | Kéo xa, tàu nhỏ dần về phía mặt trời |

Camera x lấy **đúng** `trainX` (không lerp trễ) để tàu không trôi trong khung hình; chỉ `dx, y, z` được làm mượt. Thêm rung toa nhẹ `y += sin(t·18)·0.006·speed`.

---

## 5. Các đối tượng trong scene

Phong cách **minh hoạ phẳng**: `meshBasicMaterial` / `meshLambertMaterial flatShading`, màu đặc, không texture ảnh (trừ ảnh người dùng). Ánh sáng: `ambientLight 0.8` + 1 `directionalLight`. Không shadow.

| Đối tượng | Cách dựng | Số lượng (desktop / mobile) |
|---|---|---|
| Đầu máy | box thân `rail-red` + box cabin + sọc `teal` + 2 cylinder đèn pha; bánh = cylinder `#222` quay `rotation.z -= speed·delta/r` | 1 |
| Toa khách | box `#EFE2C8` (kem) + sọc `rail-red` dưới + 6 cửa sổ plane `teal` tối (C8: cửa sổ dán ảnh) | 3 / 2 |
| Đường ray | 2 box dài + tà vẹt `InstancedMesh`, **tái dùng** theo `recycleX` quanh camera | 60 / 40 tà vẹt |
| Lớp gần (z = 4) | cột điện + dây (instanced), bụi cây; chạy qua nhanh nhất vì gần | 12 / 8 |
| Lớp cảnh vùng 1: lúa | plane dài có sọc xanh vàng (vertex color), vài cây cau (cylinder + cone), trâu (low-poly box) | 1 bộ |
| Lớp cảnh vùng 2: đèo | núi `ConeGeometry(…, 5)` `teal` và `#2F6B5A` 3 tầng xa gần, đường hầm (torus nửa) mà tàu **chui qua** ở progress 0.22 (màn hình tối 0.3s) | 1 bộ |
| Lớp cảnh vùng 3: biển | plane `#6FB3C4` phía sau ray, thuyền buồm (2 tam giác), mây | 1 bộ |
| Ga (3 cái) | mái ga (box + prism), sân ga, 1 biển ga; **chữ tên ga là HTML** qua drei `<Html transform>` gắn lên biển (xem §6), biển 3D chỉ là khung | 3 |
| Bảng giờ tàu (ga cuối) | khung box `board` treo trên sân ga; nội dung là **HTML split-flap** qua drei `<Html transform>` | 1 |
| Mây | plane cắt hình mây trắng, lớp xa nhất, trôi chậm | 10 / 6 |
| Trời | `<color attach="background">` đổi theo progress: `#F3E7D3` → `#F6D8A8` (0.90) → `#E98B5A` (1.00); mặt trời đĩa tròn `#F2B45A` hạ dần | — |
| Khói đầu máy | 20 sprite tròn trắng mờ bay lên và ra sau, **tỉ lệ với tốc độ** | 20 / 10 |

**Tái dùng cảnh (quan trọng):** thế giới dài 560 đơn vị nhưng chỉ dựng 3 "bộ cảnh" dài 120 mỗi bộ. Mỗi lớp parallax có hàm `recycleX(x, camX, span)` đưa vật thể ra sau lưng camera về lại phía trước. Vùng cảnh nào hiển thị do progress quyết định (lúa 0.12–0.20, đèo 0.20–0.27, biển 0.27–0.34, sau đó lúa lại).

**Tương tác con trỏ:** kéo ngang **không** điều khiển camera (tránh nhầm với cuộn). Chạm đầu máy → kéo còi (còi + khói bùng). Chạm cửa sổ toa ở C8 → lightbox.

---

## 6. Chi tiết từng section HTML

Card đặt ở **1/3 dưới** màn hình (tàu nằm ở giữa màn hình theo chiều dọc). Card vào bằng **trượt từ phải** `x: 40 → 0` cùng chiều cảnh chạy. Không đặt gì ở 3 góc nút chung.

### C1 · Vé tàu (màn mở)

**Mục đích:** "nghi thức" soát vé; xin quyền nhạc.

**Wireframe (360px):**
```
┌────────────────────────────┐
│ ←                      ♪   │
│  (sân ga, tàu đỗ phía sau) │
│ ╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄╮ │
│ ┆ ĐƯỜNG SẮT HẠNH PHÚC  ✉ ┆ │  ← Roboto Slab 11px, tem góc
│ ┆ VÉ HÀNH KHÁCH · SỐ 0014┆ │
│ ┆┌──────┐                ┆ │
│ ┆│ảnh 0 │  Minh Quân     ┆ │  ← images[0] 1:1 nhỏ; Old Standard italic 24px
│ ┆└──────┘   & Thu Hà     ┆ │
│ ┆ GA ĐI     →    GA ĐẾN  ┆ │
│ ┆ QUẬN 1        BA ĐÌNH  ┆ │  ← tên ga từ địa chỉ (§10.3)
│ ┆ NGÀY 14.11.2026 · TOA ♥┆ │  ← `date` ⚠️
│ ┆┄┄┄┄┄┄┄┄┄ xé ┄┄┄┄┄┄┄┄┄┄┆ │
│ ┆  ╭──────────────────╮  ┆ │
│ ┆  │   SOÁT VÉ  ✂      │  ┆ │  ← nền rail-red, chữ paper
│ ┆  ╰──────────────────╯  ┆ │
│ ╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄╯ │
└────────────────────────────┘
```
**Nội dung:** "ĐƯỜNG SẮT HẠNH PHÚC" · "VÉ HÀNH KHÁCH · SỐ {dd}{MM}" (lấy từ ngày cưới, ví dụ "1411"; chưa có `date` thì "0001") · ảnh `images[0]` · tên hai người · "GA ĐI {stationName(groom.address)} → GA ĐẾN {stationName(bride.address)}" · ngày.

**Timeline khi bấm (2.0s):**
| t (s) | Việc | Ease |
|---|---|---|
| 0.0 | `music.play()` fade 1.5s; còi tàu | — |
| 0.0–0.15 | Kìm bấm (SVG) đi xuống cuống vé; vé `scale 1 → 0.97 → 1` | `power2.in` |
| 0.15 | **Lỗ bấm** hiện (mask hình sao đục qua cuống vé), 6 mảnh giấy vụn rơi | — |
| 0.3–0.9 | Cuống vé **xé rời** theo đường nét đứt: `rotate 0 → 12°`, `y → 60`, `opacity → 0` | `power1.in` |
| 0.6–1.4 | Phần vé còn lại trượt sang trái ra khỏi màn hình `x → -120%` | `power1.inOut` |
| 0.8–2.0 | Scene: khói đầu máy bùng; camera `z 14 → 11` | `power1.inOut` |
| 1.2 | Mở khoá cuộn, gợi ý "Cuộn để tàu chạy ↓" | — |

**Trước khi canvas sẵn sàng:** nền `ticket` + minh hoạ sân ga SVG phẳng (cũng là fallback).
**Reduced-motion:** không xé vé; bấm là vé mờ đi 0.3s.
**Edge case:** địa chỉ rỗng → tên ga mặc định "NHÀ TRAI" / "NHÀ GÁI"; tên dài → vé cho phép tên xuống 2 dòng, ô ảnh không co.

---

### C2 + C3 (chú rể) · Ga nhà trai (0.00–0.12)

**Mục đích:** h1 + giới thiệu chú rể, ga xuất phát.

**Wireframe:**
```
│  ┌───────────────────┐     │
│  │  GA QUẬN 1        │     │  ← biển ga 3D (Html transform), teal
│  └───────────────────┘     │
│ ▀▀[đầu máy][toa][toa]▀▀▀▀  │  ← tàu đỗ
│ ═══════════════════════════│
│   TRÂN TRỌNG KÍNH MỜI      │
│      Minh Quân             │  ← h1, Old Standard italic 40px
│        &                   │
│      Thu Hà                │
│ ╭─────────╮                │
│ │ ảnh     │ CHÚ RỂ         │  ← images[1] khung cửa sổ toa (bo lớn, viền đỏ)
│ │ images1 │ Minh Quân      │
│ │         │ Quận 1, TP.HCM │  ← groom.address
│ ╰─────────╯                │
```
**Nội dung:** "TRÂN TRỌNG KÍNH MỜI" · `<h1>{groom.name} & {bride.name}</h1>` · khối chú rể: "CHÚ RỂ", `groom.name`, `groom.address`, tên bố mẹ ⚠️ (có thì thêm "Con ông … · bà …", không có thì bỏ) · biển ga "GA {stationName(groom.address)}".

**Timeline:**
| Mốc | Việc |
|---|---|
| section vào 60% | h1 A2 theo từ; khối chú rể trượt từ phải `x 40 → 0` (0.8s `power1.out`) |
| progress 0.05 | Biển ga lắc nhẹ (như vừa có tàu rời), tàu bắt đầu lăn bánh |
| progress 0.05–0.12 | Tàu tăng tốc: tiếng bánh tàu to dần; khối chữ trôi sang trái theo cuộn (`x → -30%` scrub, cùng chiều cảnh) |

**Edge case:** `stationName` dài (> 16 ký tự) → biển ga giảm cỡ chữ 22 → 16px, tối đa 2 dòng.

---

### C4 · Cửa sổ toa (0.12–0.34)

**Mục đích:** chuyện tình. Mỗi mốc hiện như một **khung cửa sổ toa**, ứng với một vùng cảnh bên ngoài.

**Wireframe (1 mốc):**
```
│ ▲▲  núi ▲▲▲   ☁           │  ← cảnh đèo chạy qua
│ ▀▀▀[toa][toa][toa]▀▀▀▀▀▀▀  │
│ ═══════════════════════════│
│ ╭━━━━━━━━━━━━━━━━━━━━━━━╮  │  ← cửa sổ toa HTML, viền rail-red 10px
│ ┃ ┌───────────────────┐ ┃  │
│ ┃ │    images[4]       │ ┃  │
│ ┃ └───────────────────┘ ┃  │
│ ┃ KM 0512 · ĐÈO        ┃  │  ← "cột mốc km", teal 12px
│ ┃ THƯƠNG NHAU           ┃  │
│ ┃ Qua bao nhiêu khúc    ┃  │
│ ┃ quanh, mình vẫn chọn  ┃  │
│ ┃ ngồi cạnh nhau.       ┃  │
│ ╰━━━━━━━━━━━━━━━━━━━━━━━╯  │
```
| Mốc | Progress | Vùng cảnh | Cột mốc | Tiêu đề | Nội dung viết sẵn | Ảnh |
|---|---|---|---|---|---|---|
| 1 | 0.12–0.20 | Ruộng lúa | KM 0045 | Lần đầu gặp gỡ | "Một sân ga, một chiếc ghế trống, một người lạ hỏi: chỗ này có ai ngồi chưa?" | `images[3]` |
| 2 | 0.20–0.27 | Đèo (qua hầm ở 0.22) | KM 0512 | Thương nhau | "Qua bao nhiêu khúc quanh, mình vẫn chọn ngồi cạnh nhau." | `images[4]` |
| 3 | 0.27–0.34 | Biển | KM 0935 | Lời hứa | "Ở đoạn đường đẹp nhất, anh hỏi em có muốn đi cùng anh tới ga cuối không." | `images[5]` |

**Section pin (T2), cửa sổ `sticky`:** nội dung cửa sổ đổi giữa 3 mốc theo progress bằng hiệu ứng **"cảnh lướt qua cửa sổ"**: nội dung cũ trượt `x 0 → -100%`, nội dung mới vào `x 100% → 0` (0.6s `power1.inOut`), giống nhìn ra ngoài tàu. Cột mốc km đếm số lên (A11 kiểu đồng hồ cơ, 0.5s).
**Đường hầm (0.22):** scene tối đen 0.3 progress-khoảng rất ngắn; card cửa sổ **không** tối (vẫn đọc được).
**Reduced-motion:** 3 cửa sổ xếp dọc, không pin.

---

### C3 (cô dâu) · Ga nhà gái (0.34–0.45)

**Wireframe:** đối xứng C2+C3 nhưng khối cô dâu **căn phải**, ảnh `images[2]` bên phải:
```
│      ┌───────────────────┐ │
│      │  GA BA ĐÌNH       │ │  ← biển ga
│ ▀▀▀[đầu máy][toa][toa]▀▀▀  │  ← tàu phanh, đỗ
│ ═══════════════════════════│
│  ĐÓN CÔ DÂU LÊN TÀU        │  ← 12px rail-red
│                ╭─────────╮ │
│       CÔ DÂU   │ ảnh     │ │
│       Thu Hà   │ images2 │ │
│ Ba Đình, Hà Nội│         │ │
│                ╰─────────╯ │
```
**Nội dung:** "ĐÓN CÔ DÂU LÊN TÀU" · "CÔ DÂU", `bride.name`, `bride.address`, tên bố mẹ ⚠️ · biển ga "GA {stationName(bride.address)}".
**Timeline:** progress 0.34–0.38 tàu phanh (khói giảm, tiếng bánh tàu nhỏ dần, `playbackRate` giảm); 0.38 tàu đỗ: khối cô dâu trượt từ phải; một **trái tim nhỏ** (SVG `rail-red`) nảy lên trên cửa toa 3D (drei `Html`, 0.6s `back.out`).
**Edge case:** hai địa chỉ cho ra **cùng tên ga** (cùng tỉnh) → ga 2 thêm hậu tố: "GA BA ĐÌNH (NHÀ GÁI)"; logic trong `stationName` được test.

---

### C8 · Toa ảnh (0.45–0.66) — cuộn ngang A5

**Mục đích:** album. Section HTML **pin** và cuộn **ngang** (T5), ảnh dán trên các "cửa sổ toa" nối nhau thành một đoàn tàu HTML dài.

**Wireframe (một khung hình khi đang cuộn ngang):**
```
│  KỶ NIỆM TRÊN TỪNG TOA     │  ← A2, cố định trên cùng
│ ┌──────────────┬───────────│  ← thân toa HTML (nền #EFE2C8, sọc đỏ dưới)
│ │ ╭────────╮   │ ╭────────╮│
│ │ │images3 │   │ │images4 ││  ← cửa sổ bo lớn chứa ảnh
│ │ ╰────────╯   │ ╰────────╯│
│ │ TOA 1        │ TOA 2     │
│ └──────────────┴───────────│
│  ●━━━━○━━━━○━━━━○━━━━○     │  ← thanh tiến độ = 5 toa
│  [ Xem tất cả ảnh ⊞ ]      │
```
**Hành vi:** `images[3..7]` → 5 toa, mỗi toa rộng `80vw` (desktop `40vw`). Pin section, `x: -(scrollWidth - innerWidth)` scrub (A5). Canvas phía sau vẫn chạy nhưng phủ `bg-[#F3E7D3]/40` để ảnh HTML nổi bật. Bánh xe SVG dưới mỗi toa HTML quay theo tiến độ cuộn (`rotation` = quãng đường / bán kính).
**Tương tác:** chạm ảnh → lightbox A10; bàn phím: section có `tabIndex=0`, ←/→ nhảy đúng 1 toa (`scrollTo` vị trí tương ứng của trigger); "Xem tất cả ảnh" → lưới 2 cột.
**Reduced-motion:** không pin; 5 toa xếp dọc như 5 thẻ.
**Edge case:** màn hình rất rộng (1440px) → 5 toa × 40vw = 200vw, vẫn đủ để cuộn ngang; nếu `scrollWidth ≤ innerWidth` thì bỏ pin.

---

### C5 + C6 + C7 · Ga cuối "Hạnh Phúc" (0.66–0.90)

**Mục đích:** ngày giờ và địa điểm. Tàu dừng hẳn, người xem đọc thong thả.

**Wireframe:**
```
│  ┌───────────────────┐     │
│  │  GA HẠNH PHÚC     │     │  ← biển ga 3D
│  └───────────────────┘     │
│ ╔════════════════════════╗ │  ← bảng split-flap (HTML, nền board)
│ ║ GIỜ ĐẾN   ĐIỂM ĐẾN      ║ │  ← 11px brass
│ ║ ┌┐┌┐┌┐┌┐┌┐              ║ │
│ ║ │1││8││:││0││0│ TIỆC    ║ │  ← mỗi ô 1 ký tự lật (A7 biến thể)
│ ║ ┌┐┌┐┌┐┌┐┌┐┌┐┌┐┌┐┌┐┌┐    ║ │
│ ║ │1││4││.││1││1││.││2││0││2││6│ ║ │  ← ngày `date` ⚠️
│ ║ THỨ BẢY                 ║ │
│ ╚════════════════════════╝ │
│ ╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄╮   │  ← vé (card) lịch trình
│ ┆ CÒN 45 NGÀY 06 GIỜ    ┆   │  ← đếm ngược, số lật
│ ┆ ── lịch trình ──      ┆   │
│ ┆ 10:00  Lễ thành hôn   ┆   │
│ ┆ 18:00  Tiệc cưới      ┆   │
│ ╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄╯   │
│ ╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄╮   │
│ ┆ ĐIỂM ĐẾN              ┆   │
│ ┆ {venue.name}          ┆   │
│ ┆ [ <MapEmbed/> 200px ] ┆   │
│ ┆ [ Chỉ đường ➚ ]       ┆   │
│ ╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄╯   │
```
**Nội dung:** bảng split-flap: hàng 1 giờ tiệc `HH:mm` + "TIỆC CƯỚI"; hàng 2 ngày `dd.MM.yyyy`; hàng 3 thứ. Từ `date` ⚠️; chưa có thì ngày mẫu `2026-11-14T18:00` và **ẩn đếm ngược**. Qua ngày cưới: hàng 3 lật thành "ĐÃ ĐẾN GA ♥". Lịch trình C6 hardcode. C7: `venue.name` (rỗng → "Nhà hàng tiệc cưới"), `<MapEmbed>`, "Chỉ đường".

**Bảng split-flap nằm ở đâu:** trên mobile đặt **trong luồng HTML** (card đầu section, không dùng `<Html transform>` để chữ luôn nét và đọc được). Trên desktop (≥ 1024px) có thể gắn vào khung bảng 3D trên sân ga qua drei `<Html transform>`; nếu làm vậy vẫn giữ một bản HTML `sr-only` cho screen reader.

**Timeline:**
| Mốc | Việc |
|---|---|
| progress 0.66–0.72 | Tàu phanh, còi dài lần 2 ở 0.70 |
| section vào 55% | Bảng lật: mỗi ô bắt đầu từ ký tự trống, lật qua dãy ký tự trung gian tới ký tự đích; mỗi lần lật 60ms (`rotateX 0 → -90°` nửa trên, đổi ký tự, nửa dưới `90° → 0`); ô bên phải trễ hơn ô trái 40ms. Tiếng lạch cạch nhỏ (tuỳ chọn, bỏ nếu không có asset) |
| +1.5s | Card lịch trình trượt từ phải; card bản đồ trượt tiếp (stagger 0.2s) |
| mỗi giây | Đếm ngược: chữ số thay đổi thì lật 1 lần (A7) |

**Reduced-motion:** bảng hiện ngay ký tự đích, không lật.
**Edge case:** giờ không tròn (18:30) → vẫn 5 ô; tên thứ dài nhất "CHỦ NHẬT" → hàng 3 cố định 8 ô.

---

### C9 + C10 · Hoàng hôn (0.90–1.00)

**Wireframe:**
```
│            ◐ mặt trời      │
│    ▀▀[tàu]▀▀ →  ━━━━━━━━━  │  ← tàu nhỏ dần về phía mặt trời
│                            │
│   Cảm ơn bạn đã cùng chúng │
│   tôi đi hết chuyến tàu    │
│   này. Hẹn gặp bạn ở ga    │
│   Hạnh Phúc!               │  ← Old Standard italic 24px
│   ╭━━━━━━━━━━━━━━━━━━━╮    │
│   ┃   images[7]        ┃    │  ← cửa sổ toa cuối
│   ╰━━━━━━━━━━━━━━━━━━━╯    │
│    Minh Quân & Thu Hà      │  ← rail-red
│ [ ▶ Xem video của chúng tôi ] │  ← chỉ khi có videos[0]
```
**Timeline:** trời chuyển cam; tàu lăn bánh chậm; câu cảm ơn A2 theo dòng; ảnh trượt từ phải; chữ ký A1.
**Video:** lightbox `<video controls playsInline>`, nhạc và tiếng tàu tạm dừng khi video phát.
**Edge case:** không có video → ẩn nút.

---

## 7. Fallback (không có WebGL hoặc reduced-motion)
- Không mount canvas. Nền `ticket` + **dải cảnh SVG phẳng** cố định ở nửa trên: núi, ruộng, đường ray; con tàu SVG.
- Không reduced-motion (chỉ không có WebGL): tàu SVG chạy ngang theo cuộn (`x` scrub), các lớp SVG parallax A4 (3 tốc độ). Reduced-motion: tất cả đứng yên.
- Biển ga là HTML trong card; C8 vẫn cuộn ngang nếu không reduced-motion (A5 không cần WebGL).
- Tiếng bánh tàu: phát ở âm lượng cố định 0.15 khi đang cuộn (theo tốc độ cuộn), tắt khi reduced-motion.

## 8. Hiệu năng
- `dpr={[1, isMobile ? 1.5 : 2]}`, `frameloop="demand"` trước khi mở, khi tab ẩn, **và khi đang ở đoạn C8** nếu canvas bị phủ > 40% (chỉ render khi progress thay đổi).
- Toàn scene dùng material màu đặc, không texture (trừ ảnh người dùng ở cửa sổ toa C8 nếu làm bản 3D; bản HTML thì không tốn VRAM).
- Tái dùng cảnh bằng `recycleX`, tổng số vật thể mọi lúc ≤ 300; tà vẹt, cột điện, cây, mây đều instanced.
- `<Html transform>` chỉ 3 biển ga (+ tuỳ chọn bảng giờ desktop); ẩn (`visible=false`) khi ga ngoài khung hình để DOM không cập nhật mỗi frame.
- Tiếng bánh tàu: cập nhật `volume/playbackRate` mỗi 150ms, không mỗi frame.

## 9. Dữ liệu và media
| Vị trí | Dùng ở |
|---|---|
| `images[0]` | Ảnh trên vé tàu C1, thumbnail, OG |
| `images[1]` | Cửa sổ chú rể (ga 1) |
| `images[2]` | Cửa sổ cô dâu (ga 2) |
| `images[3..5]` | 3 cửa sổ chuyện tình C4 |
| `images[3..7]` | 5 toa ảnh C8 (dùng lại 3..5, thêm 6, 7) |
| `images[7]` | Cửa sổ toa cuối C10 |
| `videos[0]` | C9 |
| `groom.address`, `bride.address` | Tên ga 1, ga 2 (qua `stationName`) và tuyến trên vé |

`meta.media = { images: 8, videos: 1 }`
`meta`: `styles: ["vintage", "cinematic"]`, `colors: ["red", "beige"]`, `tags: ["tàu hỏa", "hành trình", "yêu xa"]`.

---

## 10. Triển khai code

### 10.1 Cấu trúc
```
src/app/mau-thiep-cuoi/train-3d/
├── meta.ts, layout.tsx (Old_Standard_TT + Roboto_Slab, vietnamese), page.tsx
└── _components/
    ├── train-invite.tsx      # "use client": sections + OpenGate + useScrollProgress + <RailCanvas/>
    ├── rail-canvas.tsx       # dynamic import scene + fallback
    ├── scene.tsx
    ├── follow-rig.tsx        # camera theo trainX + keyframe dx/y/z + rung toa
    ├── motion.ts             # speedAt(p), trainX(p) (tích phân bảng tốc độ) (có test)
    ├── recycle.ts            # recycleX (có test)
    ├── train.tsx             # đầu máy, toa, bánh, khói
    ├── scenery.tsx           # 3 vùng cảnh + lớp gần + mây, chọn vùng theo progress
    ├── stations.tsx          # 3 ga + biển ga Html
    ├── station-name.ts       # stationName(address, other?) (có test)
    ├── train-audio.ts        # còi, bánh tàu theo tốc độ
    ├── split-flap.tsx        # bảng lật (HTML) + flapSequence (có test)
    ├── ticket.tsx            # vé C1 + bấm lỗ + xé cuống
    └── sections/*.tsx
```

### 10.2 Tokens
```ts
export const t = {
  root: "bg-[#F3E7D3] text-[#2D2419] font-(family-name:--font-body)",
  ticket: "rounded-[0.25rem] bg-[#FFFAF0] outline outline-2 outline-[#C8A15A] -outline-offset-4 shadow-[0_8px_20px_-8px_rgba(45,36,25,0.35)] [mask:radial-gradient(circle_at_0_50%,transparent_6px,#000_6.5px)_left/51%_16px_repeat-y,radial-gradient(circle_at_100%_50%,transparent_6px,#000_6.5px)_right/51%_16px_repeat-y]",
  window: "rounded-[1.25rem] border-[10px] border-[#B3261E] bg-[#FFFAF0]",
  sign: "bg-[#1F4E5F] text-[#FFFAF0] outline outline-[3px] outline-[#FFFAF0] -outline-offset-[6px] font-(family-name:--font-display) font-bold uppercase tracking-[0.12em]",
  display: "font-(family-name:--font-display)",
  heading: "text-xs tracking-[0.25em] uppercase font-semibold text-[#B3261E]",
  soft: "text-[#6A5A47]",
  btn: "min-h-11 rounded-[0.25rem] bg-[#B3261E] px-6 font-semibold uppercase tracking-widest text-[#FFFAF0]",
  flapCell: "relative grid h-[1.4em] w-[0.9em] place-items-center rounded-[3px] bg-[#1B1B1B] text-[#F5EBD8] font-bold",
} as const;
```

### 10.3 Tên ga từ địa chỉ
```ts
// station-name.ts
const DROP = /^(tp\.?|thành phố|tỉnh|quận|huyện|thị xã|phường|xã|q\.?|p\.?)\s+/i;
export function stationName(address: string | undefined, fallback: string): string {
  const parts = (address ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!parts.length) return fallback;                 // "NHÀ TRAI" / "NHÀ GÁI"
  const pick = parts.length >= 2 ? parts[parts.length - 2] : parts[0]; // quận/huyện thường đứng áp chót
  const bare = pick.replace(DROP, "");
  return (/^\d+$/.test(bare) ? pick : bare).toLocaleUpperCase("vi-VN"); // "Quận 1" giữ nguyên

}
```
Lấy phần áp chót vì địa chỉ Việt Nam thường là "…, Quận 1, TP.HCM". Chỉ bỏ tiền tố khi phần còn lại không phải số: "Quận 1" giữ nguyên "QUẬN 1", "Huyện Hải Hậu" → "HẢI HẬU". Ghi đủ các ca vào test. Nếu trùng tên với ga kia thì thêm hậu tố "(NHÀ GÁI)".

### 10.4 Split-flap
```ts
// split-flap.tsx
export const FLAP_CHARS = " 0123456789:.ABCDEFGHIJKLMNOPQRSTUVWXYZĂÂĐÊÔƠƯÀẢÃÁẠẰẲẴẮẶẦẨẪẤẬÈẺẼÉẸỀỂỄẾỆÌỈĨÍỊÒỎÕÓỌỒỔỖỐỘỜỞỠỚỢÙỦŨÚỤỪỬỮỨỰỲỶỸÝỴ♥";
export function flapSequence(from: string, to: string, maxSteps = 12): string[] {
  // các ký tự trung gian từ `from` tới `to` theo thứ tự FLAP_CHARS, tối đa maxSteps
  // (nếu xa hơn maxSteps thì nhảy cóc đều) → luôn kết thúc đúng bằng `to`
}
```
Mỗi ô render 2 nửa (trên/dưới) bằng `overflow-hidden h-1/2`; GSAP timeline cho mỗi bước: nửa trên `rotateX 0 → -90` (0.03s), đổi ký tự, nửa dưới `rotateX 90 → 0` (0.03s). Toàn bảng tối đa khoảng 1.2s. Ký tự không có trong `FLAP_CHARS` (ví dụ chữ thường) được `toLocaleUpperCase("vi-VN")` trước; vẫn không có thì hiện thẳng, không lật.

### 10.5 Tốc độ và quãng đường
```ts
// motion.ts
export const SPEED: [p: number, v: number][] = [[0,0],[0.05,0],[0.12,1],[0.34,1],[0.38,0],[0.41,0],[0.45,0.6],[0.66,0.6],[0.72,0],[0.90,0],[1,0.3]];
export function speedAt(p: number): number   // nội suy tuyến tính bảng SPEED
export function trainX(p: number): number    // tích phân speedAt từ 0 → p (hình thang từng đoạn), nhân hệ số để trainX(0.34) ≈ 320
```
Tính sẵn bảng tích luỹ 1 lần ở module scope, `trainX` chỉ tra và nội suy → O(log n).

### 10.6 Logic cần test
- `motion.test.ts`: `speedAt` = 0 trong các khoảng đỗ; `trainX` đơn điệu không giảm; phẳng trong 0.38–0.41 và 0.72–0.90; `trainX(0) = 0`.
- `station-name.test.ts`: "12 Lý Tự Trọng, Quận 1, TP.HCM" → "QUẬN 1"; "Số 5, Ba Đình, Hà Nội" → "BA ĐÌNH"; "Huyện Hải Hậu, Nam Định" → "HẢI HẬU"; "" → fallback; một phần duy nhất "Đà Lạt" → "ĐÀ LẠT".
- `split-flap.test.ts`: `flapSequence(" ", "Đ")` kết thúc bằng "Đ", độ dài ≤ 12; `from === to` trả `[to]`.
- `recycle.test.ts`: `recycleX` luôn trả trong `[camX - span/2, camX + span/2]`.

### 10.7 Thứ tự làm
1. `meta`, `layout`, tokens, sections HTML tĩnh (kể cả vé và split-flap tĩnh); `station-name.ts` + test
2. `motion.ts` + test, tàu + đường ray + follow rig → cuộn thấy tàu chạy/dừng đúng
3. Cảnh 3 vùng + lớp gần + `recycleX`; đường hầm
4. C1 vé (bấm lỗ, xé cuống), nhạc, còi, tiếng bánh tàu theo tốc độ
5. Ga + biển ga, C2/C3, C4 cửa sổ (pin)
6. C8 cuộn ngang A5
7. Split-flap + đếm ngược, bản đồ, hoàng hôn
8. Fallback SVG, reduced-motion, fps, bundle, Lighthouse ≥ 75, checklist §12

## 11. Asset cần chuẩn bị
- [ ] `music.mp3` (Pixabay, ≤ 3MB), `whistle.mp3` (≤ 60KB), `clack.mp3` (loop ≤ 150KB) + `CREDITS.md`
- [ ] SVG: kìm bấm vé, lỗ bấm hình sao, tem, dải đường ray, tàu phẳng (fallback), 3 lớp cảnh phẳng (fallback)
- [ ] 8 ảnh mẫu (có ảnh ga tàu, đường ray) + 1 video ≤ 8MB (Pexels)
- [ ] `thumb.webp` 600×800 (tàu đỏ kem qua đèo), `opengraph-image.png`

## 12. Tiêu chí nghiệm thu riêng
- [ ] Tàu dừng hẳn đúng ở 3 ga, không trôi khi người dùng dừng cuộn; tiếng bánh tàu tắt khi đỗ
- [ ] Tên ga lấy đúng từ địa chỉ trong "Dùng thử" (thử 5 địa chỉ khác kiểu); địa chỉ trống thì hiện "NHÀ TRAI"/"NHÀ GÁI"
- [ ] Bảng split-flap hiển thị đúng chữ có dấu, lật xong ≤ 1.5s, đọc được bằng screen reader
- [ ] Đoạn cuộn ngang C8 dùng được bằng bàn phím, không bị kẹt khi cuộn ngược
- [ ] Cột điện lớp gần chạy nhanh hơn rõ rệt so với núi xa (parallax cảm nhận được)
- [ ] iPhone 12 / Android tầm trung ≥ 50fps (scene phẳng, nhẹ hơn các mẫu 3D khác)
- [ ] Tắt WebGL vẫn đọc đủ thiệp, xem đủ 8 ảnh và video
