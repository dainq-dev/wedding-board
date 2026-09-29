# 3D-10 · `lotus-3d` · Đầm Sen

> Spec chi tiết của mẫu. Mã C, A, T xem [todo-list-wedding-page.md §2](../todo-list-wedding-page.md). Tuân thủ [template-spec.md](../template-spec.md).
> Dùng bộ công cụ 3D chung `@/kit/3d` (dựng ở [galaxy-3d](./galaxy-3d.md)): `SceneCanvas`, `useScrollProgress`, `useSafeTexture`, `sampleKeyframes`.

---

## 1. Concept

**Một câu:** Bình minh trên một đầm sen quê; camera lướt sát mặt nước phủ sương, một chú chuồn chuồn dẫn đường, mỗi nụ sen nở ra là một trang của lời mời.

**Cảm xúc muốn gợi:** thanh tịnh, mộc mạc, rất Việt Nam; "thương nhau như sen trong đầm, gần bùn mà chẳng hôi tanh mùi bùn". Chậm, thở đều, như buổi sớm mai.

**Phù hợp với:** cặp đôi yêu nét truyền thống nhưng muốn thiệp hiện đại, gia đình có nhiều người lớn tuổi xem (màu sáng, chữ to, nhịp chậm).

**Cách kể chuyện:** khác galaxy (bay giữa không gian) và balloon (bay lên), camera ở đây **luôn thấp, sát mặt nước** (y 0.4–1.5), đi theo một đường cong **Catmull-Rom** uốn lượn giữa các lá sen như chiếc thuyền nhỏ. **Mỗi card gắn với một bông sen 3D cụ thể**: cánh sen nở ra (theo scrub) đúng lúc card HTML hiện, và khép lại khi đi qua. Mặt nước phản chiếu mọi thứ, kể cả ảnh.

**Moodboard:** đầm sen Tháp Mười lúc 5 giờ sáng, tranh lụa Nguyễn Phan Chánh, sương sữa, xanh lá sen bạc, hồng phấn cánh sen, chữ Noto Serif Display thanh mảnh.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `mist` | `#F6EFE7` | Nền trang, sương, màu trời bình minh phần trên |
| `surface` | `#FFFFFF` / 80% + `backdrop-blur-md` | Nền card |
| `ink` | `#2F2A26` | Chữ chính (trên `mist` ≈ 12.8:1 ✅) |
| `bark` | `#6B5E53` | Chữ phụ (trên `surface` ≈ 6:1 ✅) |
| `lotus` | `#D9577A` | Cánh sen, tên cỡ lớn. Trên `mist` ≈ 3.6:1 → **chỉ chữ ≥ 24px** |
| `lotusDeep` | `#A8395A` | Chữ hồng cỡ nhỏ, nút (trên `mist` ≈ 5.9:1 ✅; chữ trắng trên nút ≈ 6.6:1 ✅) |
| `leaf` | `#4F7D4A` | Lá sen, đường kẻ, icon (trên `mist` ≈ 4.6:1, đủ cho icon) |
| `dawn` | `#F7C9A9` | Mặt trời, ánh bình minh trên nước |
| `water` | `#B9C9C1` | Màu nước cơ bản (trong scene) |

### Typography
| Vai trò | Font | Mobile | Desktop |
|---|---|---|---|
| Tên | Noto Serif Display 300 italic | 44px | 84px |
| Tiêu đề card | Noto Serif Display 400 | 26px | 34px |
| Nhãn ("TRANG II") | Be Vietnam Pro 500, VIẾT HOA, tracking 0.3em | 11px | 12px |
| Số lớn (ngày) | Noto Serif Display 200 | 88px | 128px |
| Câu ca dao | Noto Serif Display 400 italic | 18px / 1.6 | 20px |
| Nội dung | Be Vietnam Pro 300 | 17px / 1.75 | 17px |

Chữ nội dung 17px trên mobile (to hơn các mẫu khác 1px) vì đối tượng xem có nhiều người lớn tuổi.

### Hình khối và chất liệu
- Card: `rounded-2xl` (1rem), `surface`, viền `1px leaf/20%`, rộng tối đa 380px. Góc trên card có một **hoạ tiết cánh sen** SVG nhỏ (1 path) màu `lotus`.
- Cánh sen 3D: `meshStandardMaterial` với **vertex color gradient** trắng ở gốc → `lotus` ở đầu cánh, `side: DoubleSide`, `roughness 0.7`.
- Lá sen: đĩa hơi lõm, `meshStandardMaterial` `leaf`, gân bằng normal map nhỏ.
- Motion: `sine.out` cho mọi thứ; nở hoa kéo dài (scrub); card A1 chậm (1.1s, `y 24`). Không nảy, không nhanh.

---

## 3. Nhạc
- Sáo trúc và đàn bầu (hoặc đàn tranh), tiết tấu rất chậm, có tiếng nước/chim nhẹ phía sau thì tốt, không lời, khoảng 60 BPM, dài 3:00 trở lên.
- Từ khoá Pixabay: `vietnamese bamboo flute`, `zen lotus calm`, `asian flute meditation`, `dan bau`.
- Bắt đầu khi bấm "Mở thiệp". Âm lượng 0 → 0.5 trong **3 giây** (hợp với mặt trời lên).
- **Điểm nhấn**: không có. Mẫu này cố ý giữ nhạc phẳng lặng từ đầu tới cuối; khi mở lightbox giảm về 0.25 để ngắm ảnh.

---

## 4. Cấu trúc trang và chương

Trang HTML dài **850svh**. Canvas `fixed inset-0 -z-10`.

### Lộ trình trên mặt đầm (nhìn từ trên)
```
         (thuỷ tạ)
            ▣  ← P6: C5+C6+C7
           ╱
   ✿  ✿  ✿     ← P4: C4 ba bông sen, chuồn chuồn bay qua
      ╲
       ◈ ◈      ← P5: C8 ảnh cắm trên mặt nước, phản chiếu
      ╱
    ◐   ◑       ← P3: C3 hai lá sen mang chân dung
     ╲ ╱
      ❀         ← P2: C2 nụ sen lớn
      │
      ● camera  ← P1: C1 sương, mặt trời chưa lên
```

| Chương | Progress | HTML section | Card | Bông sen / điểm |
|---|---|---|---|---|
| 0 | màn mở | `#dawn` | C1 | — |
| 1 | 0.00–0.10 | `#mist` | (sương tan, lướt tới) | — |
| 2 | 0.10–0.25 | `#bloom` | C2 | nụ sen lớn L0 |
| 3 | 0.25–0.40 | `#leaves` | C3 | lá chú rể, lá cô dâu |
| 4 | 0.40–0.60 | `#story` | C4 | 3 bông sen L1, L2, L3 |
| 5 | 0.60–0.75 | `#reflection` | C8 | 6 ảnh phản chiếu |
| 6 | 0.75–0.90 | `#pavilion` | C5 + C6 + C7 | thuỷ tạ |
| 7 | 0.90–1.00 | `#petals` | C10 | cánh sen bay lên |

### Đường đi camera
Camera đi theo `CatmullRomCurve3` qua 8 điểm (không nội suy tuyến tính như galaxy), `u = easeRemap(p)` để camera **chậm lại quanh mỗi bông sen** và nhanh hơn khi qua khoảng trống. `lookAt` là một điểm trên chính đường cong ở `u + 0.04` (nhìn về phía trước), trừ các đoạn "ngắm" có mục tiêu riêng.

| progress | Điểm trên đường (x, y, z) | lookAt | Ghi chú |
|---|---|---|---|
| 0.00 | `[0, 0.6, 20]` | theo đường | Sát nước, sương dày |
| 0.18 | `[0, 0.9, 6]` | `[0, 1.4, 0]` (L0) | Dừng trước nụ sen lớn, hơi ngước lên |
| 0.32 | `[0, 1.2, -6]` | `[0, 0.3, -9]` | Giữa hai lá sen, nhìn xuống |
| 0.45 | `[-4, 0.8, -16]` | L1 `[-6, 1.2, -18]` | Bông 1 |
| 0.50 | `[0, 0.9, -20]` | L2 `[0, 1.3, -23]` | Bông 2 |
| 0.56 | `[4, 0.8, -24]` | L3 `[6, 1.2, -26]` | Bông 3 |
| 0.68 | `[0, 0.4, -34]` | `[0, -0.6, -40]` | Rất thấp, nhìn xuống bóng phản chiếu |
| 0.84 | `[0, 1.5, -46]` | `[0, 2, -56]` | Trước thuỷ tạ |
| 1.00 | `[0, 3, -44]` | `[0, 6, -56]` | Ngước lên, cánh sen bay |

`easeRemap`: bảng tra `(p, u)` theo các mốc trên, nội suy tuyến tính rồi `sine.out` trong từng đoạn. Làm mượt thêm `lerp(target, 1 - exp(-3·delta))`.

---

## 5. Các đối tượng trong scene

| Đối tượng | Cách dựng | Số lượng (desktop / mobile) |
|---|---|---|
| Mặt nước | **Desktop**: plane 200×200 với drei `<MeshReflectorMaterial resolution={512} mixStrength={0.8} blur={[300,100]} mirror={0.6} color={water}>`. **Mobile**: không reflector; thay bằng bản sao lật `scale.y = -1` của các vật gần (sen, lá, ảnh) dưới mặt nước + plane nước bán trong suốt `opacity 0.75` phủ lên (giả phản chiếu, rẻ hơn nhiều) | 1 |
| Gợn nước | normal map `ripple.webp` 512px, `offset` trôi chậm theo thời gian (desktop, gắn vào reflector qua `normalMap`) | 1 / 0 |
| Sương | 4–6 plane lớn đứng, texture `mist.webp` mềm, additive tắt, `opacity` giảm theo progress (0.9 → 0.2 trong 0.00–0.12) và trôi ngang | 6 / 3 |
| Mặt trời | sprite additive `dawn`, `y` từ −2 (dưới chân trời) lên 8 trong màn mở; `hemisphereLight` và `directionalLight` ấm tăng theo | 1 |
| Nụ sen / bông sen | `Lotus` component: 3 vòng cánh (6 + 8 + 10 cánh), mỗi cánh là `ShapeGeometry` giọt nước uốn cong (dùng chung 1 geometry); prop `bloom` 0..1 điều khiển góc mở `rotation.x` của từng vòng lệch pha (vòng trong mở sau, stagger); đài sen vàng xanh ở giữa | L0 (scale 2) + L1..L3 + 12 sen trang trí `bloom` cố định / 6 trang trí |
| Lá sen | `CircleGeometry` có khuyết 1 múi, đỉnh giữa lõm (`y` theo khoảng cách tâm); `InstancedMesh` cho lá trang trí | 60 / 30 |
| Lá chân dung (C3) | 2 lá lớn r=1.4; trên mỗi lá dựng 1 plane ảnh 3:4 (`images[1]`, `images[2]`) nghiêng 70° như tấm ảnh dựng trên lá | 2 |
| Chuồn chuồn | thân capsule mảnh + 4 cánh plane trong suốt vỗ bằng `sin(t·40)`; bay theo đường cong riêng từ L0 → L1 → L2 → L3 trong 0.38–0.60 (vị trí theo progress, **không** theo thời gian) | 1 |
| Ảnh phản chiếu (C8) | `images[3..7]` + `images[0]`: 6 plane 3:4 **cắm đứng trên mặt nước** như những tấm lụa, rìa dưới chạm nước; phản chiếu tự có (desktop) hoặc bản sao lật (mobile) | 6 |
| Thuỷ tạ (C7) | nhà lục giác đơn giản: 6 cột cylinder, mái `ConeGeometry(radialSegments 6)` cong nhẹ (sửa đỉnh), sàn gỗ; cầu gỗ box dẫn ra | 1 |
| Cánh sen bay (C10) | `InstancedMesh` dùng lại geometry cánh sen, bay lên xoắn ốc chậm, xoay; màu `lotus` | 80 / 40 |
| Đom đóm sương | drei `<Sparkles color={dawn} size={2} speed={0.2}>` quanh L0 và thuỷ tạ | 40 / 20 |

**Tương tác con trỏ:** rất nhẹ, `lookAt.x += pointer.x · 0.4`. Hover/chạm vào một bông sen trang trí → bông sen đó nở thêm 0.15 rồi khép lại (1.2s), gợn nước lan (ring plane `scale 0 → 3, opacity 0.4 → 0`). Không gyro.

---

## 6. Chi tiết từng section HTML

**Quy ước:** card đặt ở **1/3 trên** màn hình trên mobile (sen và nước ở 2/3 dưới, vì camera thấp nhìn ngang mặt nước). Mỗi card có nhãn "TRANG I, II, III…" như trang của một lá thư mời. Card hiện khi bông sen tương ứng mở > 0.6 (không theo vị trí section), card ẩn khi `bloom` < 0.4, tức là **chuyển tiếp card gắn với trạng thái nở của hoa**, đây là điểm khác biệt chính.

### C1 · Bình minh
```
┌────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  ← sương dày (canvas + overlay mist)
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░      ❀        ░░░░░░░│  ← nụ sen mờ trong sương
│~~~~~~~~~~~~~~~~~~~~~~~~~~~~│  ← mặt nước
│   "Trong đầm gì đẹp bằng    │  ← câu ca dao, italic 18px bark
│        sen…"                │
│   Minh Quân · Thu Hà        │  ← Noto Serif Display 30px lotus
│      ╭──────────────╮      │
│      │   MỞ THIỆP    │      │  ← nút lotusDeep, chữ trắng
│      ╰──────────────╯      │
└────────────────────────────┘
```
**Nội dung:** câu ca dao "Trong đầm gì đẹp bằng sen" (ca dao, không có bản quyền) · `{groom.name} · {bride.name}` · nút "Mở thiệp".

| t | Sự kiện |
|---|---|
| 0.0s | Bấm → nhạc fade in 3s; nút và chữ fade ra 0.6s |
| 0.2–3.0s | **Mặt trời lên**: sprite `y −2 → 3`, ánh sáng `intensity 0.2 → 1`, màu trời lerp xám → `mist` ấm |
| 0.8–3.0s | **Sương tan**: overlay HTML `bg-[#F6EFE7]` opacity 0.85 → 0; plane sương trôi sang hai bên |
| 1.5–3.5s | Camera lướt tới `z 24 → 20` |
| 3.5s | Mở khoá cuộn; gợi ý "Cuộn nhẹ để đi dạo đầm sen" |

Intro dài 3.5s > 2s → **bắt buộc** có nút "Bỏ qua" hiện ngay sau 0.5s (spec §7). **Trước khi canvas sẵn sàng:** nền `mist` + ảnh `fallback-dawn.webp` mờ.

### C2 · Nụ sen lớn, tên (0.10–0.25)
```
│     ── TRANG I ──           │
│   Trân trọng báo tin        │  ← bark 15px
│   lễ thành hôn của          │
│      Minh Quân              │  ← h1, lotus 44px italic, A2 lines
│          &                  │
│       Thu Hà                │
│                            │
│         ❀ (L0 nở)          │  ← canvas
│~~~~~~~~~~~~~~~~~~~~~~~~~~~~│
```
| Progress | Sự kiện |
|---|---|
| 0.10–0.20 | L0 `bloom 0 → 1` (vòng ngoài 0.10–0.16, giữa 0.12–0.18, trong 0.14–0.20) |
| khi bloom > 0.6 | Card A1 (1.1s); tên A2 theo dòng |
| 0.22–0.26 | L0 khép nhẹ về 0.7 khi camera đi qua (không khép hẳn, để vẫn đẹp) |

Không nền card cho tên; chữ trực tiếp trên nền sáng (tương phản đủ vì nền `mist`, sương đã tan).

### C3 · Hai lá sen (0.25–0.40)
Một card ngang có 2 cột (ảnh là 3D trên lá, card chỉ chữ):
```
│ ╭─────────────────────────╮ │
│ │ TRANG II                │ │
│ │ ┌──────────┬──────────┐ │ │
│ │ │ NHÀ TRAI │ NHÀ GÁI  │ │ │
│ │ │ Minh Quân│ Thu Hà   │ │ │
│ │ │ 12 Lê Lợi│ 34 Trần… │ │ │
│ │ └──────────┴──────────┘ │ │
│ ╰─────────────────────────╯ │
│      ◐ ảnh      ảnh ◑      │  ← 2 lá sen mang chân dung (canvas)
```
**Nội dung:** `groom.name`, `groom.address`, `bride.name`, `bride.address`. Tên bố mẹ ⚠️ (rất nên có với mẫu truyền thống): có thì hiện "Ông … · Bà …" trên tên mỗi cột; chưa có dữ liệu thì ẩn dòng, **không** hiện chỗ trống.
Hai lá sen trôi nhẹ về phía nhau (`x` giảm theo progress 0.25–0.38), khoảng cách giữa hai ảnh thu hẹp dần như hai người xích lại gần.

### C4 · Chuyện tình, chuồn chuồn dẫn đường (0.40–0.60)
Chuồn chuồn bay tới bông nào thì bông đó nở và card tương ứng hiện (card trước fade ra):

| Mốc | Bông | Nhãn | Tiêu đề | Nội dung viết sẵn | Ảnh |
|---|---|---|---|---|---|
| 1 | L1 | TRANG III | Duyên | "Gặp nhau giữa muôn người, như chuồn chuồn tình cờ đậu lại một nhành sen." | `images[3]` |
| 2 | L2 | TRANG IV | Thương | "Thương nhau qua nắng qua mưa, qua cả những ngày bùn lầy nhất." | `images[4]` |
| 3 | L3 | TRANG V | Nguyện | "Nguyện cùng nhau nở hoa, và cùng nhau giữ hương cho đến bạc đầu." | `images[5]` |

Ảnh trong card: `<img>` 3:4 rộng 88px bo `rounded-t-full` (hình cánh sen/vòm) đặt bên trái chữ.

| Progress | Sự kiện |
|---|---|
| 0.40–0.46 | Chuồn chuồn L0 → L1, L1 nở; card 1 |
| 0.47–0.52 | → L2, L1 khép về 0.5, L2 nở; card 2 |
| 0.53–0.58 | → L3; card 3 |
| 0.58–0.60 | Chuồn chuồn bay vút lên khỏi khung hình |

### C8 · Ảnh phản chiếu (0.60–0.75)
- Tiêu đề HTML "TRANG VI · Soi bóng" + câu nhỏ "Những khoảnh khắc in bóng xuống mặt đầm." (A1).
- Camera hạ sát mặt nước, ảnh và bóng của ảnh chiếm khung hình. Bấm ảnh 3D → lightbox HTML (A10). Nút "Xem tất cả ảnh" → lưới 2 cột HTML.
- Gợn nước chạy qua bóng ảnh (desktop: normal map; mobile: bản sao lật dao động `scale.y` −1 ± 0.02).

### C5 + C6 + C7 · Thuỷ tạ (0.75–0.90)
```
│ ╭────────────────────────╮ │
│ │ TRANG VII · HẸN NGÀY   │ │
│ │         14             │ │  ← Noto Serif Display 88px ink
│ │   THÁNG MƯỜI MỘT 2026  │ │
│ │   (tức 25 tháng 9 âm)⚠️│ │  ← chỉ khi có date + tính âm lịch
│ │ 45 ngày · 06 giờ · 12 ph│ │  ← A7
│ │ ────────── ❀ ───────── │ │
│ │ Lễ vu quy      08:00   │ │  ← tại nhà gái {bride.address}
│ │ Lễ thành hôn   10:00   │ │  ← tại nhà trai {groom.address}
│ │ Tiệc cưới      18:00   │ │  ← tại {venue.name}
│ │ ┌────────────────────┐ │ │
│ │ │   MapEmbed 200px   │ │ │
│ │ └────────────────────┘ │ │
│ │ [ Chỉ đường ]          │ │
│ ╰────────────────────────╯ │
```
- Lịch trình truyền thống (vu quy / thành hôn / tiệc) viết sẵn, giờ hardcode.
- `date` ⚠️: chưa có → ngày mẫu, ẩn đếm ngược và ẩn dòng âm lịch. Dòng âm lịch chỉ làm nếu dự án có sẵn hàm đổi âm lịch dùng chung; **không** tự viết trong mẫu (ghi chú cho người triển khai, xem §10.5).
- Đã qua ngày cưới → "Chúng tôi đã nên duyên vợ chồng ♥".
- Section dài 150svh, card cuộn tự nhiên; thuỷ tạ ở nửa dưới màn hình.

### C10 · Cánh sen bay (0.90–1.00)
```
│     ❀    ❀      ❀           │  ← cánh sen bay lên (canvas)
│   Tấm lòng như đoá sen      │  ← italic 20px
│   thơm, xin gửi đến bạn      │
│   lời cảm ơn chân thành.    │
│    ┌────────────┐           │
│    │ images[n-1]│           │  ← vòm rounded-t-full, A3
│    └────────────┘           │
│    Minh Quân & Thu Hà       │
```
| Progress | Sự kiện |
|---|---|
| 0.90 | 80 cánh sen tách khỏi các bông trang trí, bay lên xoắn ốc (vị trí theo thời gian, tốc độ nhân theo progress) |
| 0.93 | Câu cảm ơn A1, ảnh A3 |
| 1.00 | Camera ngước lên, cánh sen lấp đầy phần trên màn hình |

### Reduced-motion và edge case (chung)
- Bông sen: reduced-motion → fallback §7 (không 3D). Chuồn chuồn và cánh sen bay tắt.
- Tên 50 ký tự: `text-balance break-words`; cỡ tên 44 → 32px khi `length > 24`.
- Card hiện theo `bloom` nhưng nếu người dùng cuộn cực nhanh qua cả chương thì vẫn phải đảm bảo card **không kẹt ở trạng thái hiện**: mỗi card đồng thời có điều kiện "progress trong khoảng chương", ngoài khoảng là ẩn.

---

## 7. Fallback (không có WebGL hoặc bật reduced-motion)
- Không mount canvas. Nền phần tử gốc `mist` + minh hoạ sen màu nước `fallback-lotus.webp` (cố định phía dưới màn hình, chiếm 40% chiều cao), `fallback-dawn.webp` cho C1.
- **A8 cánh sen**: 24 cánh sen SVG rơi chậm (Tailwind `animate-lotus-3d-drift` khai báo trong `@theme` với tiền tố slug) — **tắt khi reduced-motion**, chỉ chạy khi không có WebGL.
- Card hiện bằng A1 theo viewport (không theo bloom). Chân dung vào card C3 (vòm `rounded-t-full`). Album lưới 2 cột với bóng phản chiếu giả: ảnh lật `-scale-y-100` + `opacity-30` + mask gradient `mask-[linear-gradient(to_bottom,black,transparent)]`.

## 8. Hiệu năng
- `MeshReflectorMaterial` render scene 2 lần → **chỉ desktop** (và chỉ khi `navigator.hardwareConcurrency ≥ 6`), `resolution 512`; mobile dùng giả phản chiếu (§5).
- Mọi cánh sen dùng chung 1 `ShapeGeometry`; bông trang trí và lá dùng `InstancedMesh`.
- Cánh sen bay chỉ mount khi progress > 0.85; chuồn chuồn chỉ mount trong 0.35–0.65.
- `dpr ≤ 1.5` mobile, không shadow, `frameloop="demand"` trước khi mở thiệp / tab ẩn / lightbox mở.

## 9. Dữ liệu và media
| Vị trí | Dùng ở |
|---|---|
| `images[0]` | Thumbnail, OG, 1 trong 6 ảnh phản chiếu C8 |
| `images[1]` / `images[2]` | Ảnh trên lá sen chú rể / cô dâu (C3) |
| `images[3..5]` | Ảnh vòm trong 3 card C4 |
| `images[3..7]` | 5 ảnh phản chiếu C8 (cùng `images[0]` = 6) |
| `images[7]` | Ảnh cuối C10 (`images[n-1]`) |

`meta.media = { images: 8, videos: 0 }`

---

## 10. Triển khai code

### 10.1 Cấu trúc
```
src/app/mau-thiep-cuoi/lotus-3d/
├── meta.ts, layout.tsx, page.tsx
└── _components/
    ├── lotus-invite.tsx      # "use client": sections + dawn gate + <LotusCanvas/>; giữ bloomRef dùng chung với HTML
    ├── lotus-canvas.tsx      # next/dynamic(() => import("./scene"), { ssr: false }) + fallback
    ├── scene.tsx             # <SceneCanvas> + đối tượng
    ├── glide-rig.tsx         # camera theo CatmullRom + easeRemap
    ├── water.tsx             # Reflector (desktop) | giả phản chiếu (mobile)
    ├── lotus.tsx             # 1 bông sen, prop bloom 0..1
    ├── pads.tsx, dragonfly.tsx, pavilion.tsx, petals.tsx, mist.tsx
    ├── pond.ts               # PATH_POINTS, easeRemap, bloomAt(id, p), cardVisible(id, p) (có test)
    └── sections/*.tsx        # dawn, bloom, leaves, story, reflection, pavilion, petals
```
Layout: `Noto_Serif_Display({ subsets: ["vietnamese"], weight: ["200","300","400"], style: ["normal","italic"], variable: "--font-serif" })` + `Be_Vietnam_Pro({ subsets: ["vietnamese"], weight: ["300","500"], variable: "--font-sans" })`.

### 10.2 Tokens
```ts
export const t = {
  root: "min-h-screen bg-[#F6EFE7] text-[#2F2A26] font-(family-name:--font-sans) font-light text-[17px] leading-[1.75]",
  name: "font-(family-name:--font-serif) italic font-light text-[44px] lg:text-[84px] text-[#D9577A] leading-[1.05] text-balance break-words",
  label: "text-[11px] lg:text-xs font-medium uppercase tracking-[0.3em] text-[#4F7D4A]",
  card: "rounded-2xl bg-white/80 backdrop-blur-md border border-[#4F7D4A]/20 p-6 max-w-[380px]",
  verse: "font-(family-name:--font-serif) italic text-lg lg:text-xl text-[#6B5E53]",
  btn: "min-h-11 rounded-full bg-[#A8395A] px-8 text-white tracking-[0.15em] uppercase text-sm",
} as const;
```

### 10.3 Nở hoa và hiện card (logic cần test)
```ts
// pond.ts
export const BLOOMS = {
  L0: { open: [0.10, 0.20], close: [0.22, 0.26], rest: 0.7 },
  L1: { open: [0.40, 0.46], close: [0.47, 0.50], rest: 0.5 },
  L2: { open: [0.47, 0.52], close: [0.53, 0.56], rest: 0.5 },
  L3: { open: [0.53, 0.58], close: [0.60, 0.64], rest: 0.5 },
} as const;
export function bloomAt(id: keyof typeof BLOOMS, p: number): number;          // 0..1
export function cardVisible(id: keyof typeof BLOOMS, p: number): boolean;     // bloom > 0.6 VÀ p trong chương
export function easeRemap(p: number): number;                                 // p → u trên CatmullRom, đơn điệu
```
Test `pond.test.ts`: `bloomAt("L0", 0.05) === 0`, `bloomAt("L0", 0.20) === 1`, `bloomAt("L0", 0.5) === 0.7`; `cardVisible` đúng ở ranh; `easeRemap` đơn điệu tăng, `easeRemap(0) === 0`, `easeRemap(1) === 1`; không có hai card C4 cùng hiện ở bất kỳ p nào (quét p bước 0.001).

### 10.4 Bông sen và đồng bộ HTML
```tsx
// lotus.tsx
useFrame(() => {
  const b = bloomAt(id, progress.current);
  rings.current.forEach((ring, r) => {
    const k = Math.min(1, Math.max(0, b * 1.4 - r * 0.2));           // vòng trong mở sau
    ring.children.forEach((petal) => { petal.rotation.x = MathUtils.lerp(0.1, 1.15 - r * 0.25, k); });
  });
});

// sections/story.tsx — HTML đọc cùng progressRef, không setState mỗi frame
useGSAP(() => {
  ScrollTrigger.create({ trigger: root.current, start: "top top", end: "bottom bottom",
    onUpdate: (s) => cards.forEach((id, i) =>
      gsap.to(refs[i], { autoAlpha: cardVisible(id, s.progress) ? 1 : 0, y: cardVisible(id, s.progress) ? 0 : 24, duration: 1.1, ease: "sine.out", overwrite: "auto" })) });
});
```
Ghi chú: `onUpdate` gọi `gsap.to` nhiều lần; `overwrite: "auto"` tránh chồng tween. Nếu đo thấy tốn, chỉ gọi khi giá trị `cardVisible` đổi (lưu trạng thái trước).

### 10.5 Thứ tự làm
1. `pond.ts` + test (bloomAt, cardVisible, easeRemap)
2. HTML sections + fallback (nền màu nước, A8 cánh sen) → kiểm tra 360px, đây cũng là bản reduced-motion
3. Canvas: nước giả phản chiếu (làm mobile trước) + glide rig
4. `Lotus` component + L0 nở theo scrub, đồng bộ card C2
5. Lá, lá chân dung, 3 bông C4 + chuồn chuồn
6. Ảnh phản chiếu C8, thuỷ tạ, cánh sen bay
7. Desktop: `MeshReflectorMaterial` + gợn nước; màn mở (mặt trời, sương), nhạc
8. Âm lịch: hỏi lại xem `@/wedding` có hàm đổi âm lịch chưa; chưa có thì bỏ dòng âm lịch
9. Đo bundle, Lighthouse mobile ≥ 75, checklist template-spec §12

## 11. Asset cần chuẩn bị
- [ ] `mist.webp` 1024px (sương mềm, tự tạo bằng noise), `ripple.webp` 512px (normal map gợn nước)
- [ ] `fallback-dawn.webp`, `fallback-lotus.webp` (minh hoạ sen màu nước; tự vẽ hoặc chụp từ scene rồi lọc màu nước, ghi nguồn)
- [ ] `petal.svg` (1 path cánh sen, dùng cho card và fallback A8)
- [ ] `music.mp3` (Pixabay) + `CREDITS.md`
- [ ] 8 ảnh mẫu (Pexels, ưu tiên áo dài, sen, tông sáng)
- [ ] `thumb.webp` 3:4, `opengraph-image.png` (chụp L0 nở với mặt trời phía sau)
- [ ] Keyframes `lotus-3d-drift` trong `@theme` của `globals.css` (chỉ cho fallback A8)

## 12. Tiêu chí nghiệm thu riêng
- [ ] Mỗi card C2/C4 chỉ hiện khi bông sen tương ứng đã nở; cuộn nhanh không để card kẹt hoặc 2 card C4 chồng nhau
- [ ] Camera không bao giờ chìm dưới mặt nước (y ≥ 0.3) và không xuyên qua lá/bông sen
- [ ] Mobile không dùng `MeshReflectorMaterial` (kiểm tra `renderer.info` số lần render/frame = 1)
- [ ] Intro có nút "Bỏ qua" hiện trong 0.5s đầu
- [ ] Chữ nội dung 17px trên 360px, tương phản ≥ 4.5:1 trên card
- [ ] Tắt WebGL: minh hoạ sen màu nước, đọc đủ nội dung, xem đủ 8 ảnh
