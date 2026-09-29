# 3D-07 · `seasons-3d` · Bốn Mùa Yêu

> Spec chi tiết của mẫu. Mã C, A, T xem [todo-list-wedding-page.md §2](../todo-list-wedding-page.md). Tuân thủ [template-spec.md](../template-spec.md).
> Dùng bộ công cụ 3D chung `@/kit/3d` (dựng ở [galaxy-3d](./galaxy-3d.md)): `SceneCanvas`, `useScrollProgress`, `useSafeTexture`, `sampleKeyframes`.

---

## 1. Concept

**Một câu:** Một cây duy nhất đứng giữa đồi cỏ tròn; camera đi một vòng 360° quanh cây, mỗi góc phần tư là một mùa, và mỗi mùa là một giai đoạn tình yêu, từ lúc nảy mầm tới khi nở rộ.

**Cảm xúc muốn gợi:** dịu dàng, bền bỉ, "yêu nhau qua đủ bốn mùa". Nhịp đều như một bản nhạc thính phòng, không có cú sốc thị giác nào.

**Phù hợp với:** cặp đôi yêu nhau lâu năm, thích thiên nhiên, muốn thiệp tươi sáng (nền sáng, khác hẳn các mẫu 3D nền tối).

**Cách kể chuyện:** khác galaxy (camera bay tự do qua nhiều điểm), ở đây **camera chỉ quay trên một quỹ đạo tròn quanh một vật thể duy nhất**. Cuộn = kim đồng hồ của năm. Thế giới đổi màu, không đổi chỗ. Một "bánh xe mùa" HTML nhỏ ở mép trái cho người xem biết mình đang ở đâu trong năm.

**Moodboard:** tranh diorama low-poly, ảnh time-lapse một cái cây qua bốn mùa, giấy màu pastel, chữ serif Playfair cổ điển trên nền kem.

---

## 2. Design tokens

### Màu
Nền thay đổi theo mùa (lerp liên tục theo progress, cả `scene.background` lẫn nền HTML):

| Token | Hex | Dùng cho |
|---|---|---|
| `spring` | `#FDEEF2` | Nền mùa xuân, màn mở cuối |
| `summer` | `#E8F6E9` | Nền mùa hạ |
| `autumn` | `#FBE8D3` | Nền mùa thu |
| `winter` | `#EEF3F8` | Nền mùa đông |
| `ink` | `#1F2937` | Chữ chính (tương phản trên cả 4 nền ≥ 12:1 ✅) |
| `muted` | `#4B5563` | Chữ phụ (≥ 6.8:1 trên 4 nền ✅) |
| `ember` | `#C2410C` | Tên, số lớn, nút (trên `autumn` 4.7:1 ✅; trên `spring` 4.9:1 ✅) |
| `leaf` | `#16A34A` | Chi tiết trang trí, chấm bánh xe mùa. **Không dùng cho chữ nhỏ** (chỉ 3.1:1) |
| `paper` | `#FFFFFF` / 75% + `backdrop-blur-sm` | Nền card |

Màu hạt và tán lá theo mùa (chỉ dùng trong scene): xuân `#F9A8D4` · hạ `#4ADE80` · thu `#F97316` · đông `#FFFFFF`.

### Typography
| Vai trò | Font | Mobile | Desktop |
|---|---|---|---|
| Tên | Playfair Display 500 italic | 44px | 80px |
| Nhãn mùa ("MÙA XUÂN") | Manrope 600, VIẾT HOA, tracking 0.3em | 11px | 12px |
| Tiêu đề card | Playfair Display 500 | 26px | 34px |
| Số lớn (ngày) | Playfair Display 400 | 80px | 120px |
| Nội dung | Manrope 400 | 16px / 1.7 | 17px |

### Hình khối và chất liệu
- Card: `rounded-[1.25rem]`, `paper`, bóng `shadow-[0_8px_30px_rgb(0_0_0/0.06)]`, rộng tối đa 400px.
- Scene phong cách **low-poly flat shading** (`flatShading: true`), không texture, chỉ màu đỉnh; nhẹ và hợp mobile.
- Ảnh trong scene: "ảnh treo" hình chữ nhật 3:4 có dây mảnh treo trên cành.
- Motion: mọi chuyển động camera `sine.inOut`; card A1 `power2.out` 0.9s. Hạt rơi có gió, lắc ngang hình sin.

---

## 3. Nhạc
- Dàn dây thính phòng hiện đại (violin, cello, pizzicato), sáng sủa, không lời, khoảng 85 BPM, dài 2:30–3:00.
- Từ khoá Pixabay: `romantic strings seasons`, `light classical strings wedding`, `pizzicato romantic`.
- Bắt đầu khi bấm "Mở thiệp". Âm lượng 0 → 0.6 trong 1.5 giây (chuẩn §2.4).
- **Điểm nhấn**: không cắt nhạc theo mùa (một file duy nhất). Khi vào mùa đông (progress 0.70) áp `BiquadFilterNode` lowpass 20000 → 2500Hz trong 1.5s cho cảm giác "âm thanh bị tuyết phủ", khi quay về xuân (0.85) mở lại. Nếu Web Audio lỗi thì bỏ qua, nhạc vẫn phát bình thường.

---

## 4. Cấu trúc trang và chương

Trang HTML dài **800svh**. Canvas `fixed inset-0 -z-10`. `progress` 0 → 1 theo cuộn toàn trang.

```
┌ #gate    100svh  C1        cây trơ cành
├ #spring  150svh  C2 + C3   XUÂN   góc 0°
├ #summer  150svh  C4        HẠ     góc 90°
├ #autumn  150svh  C8        THU    góc 180°
├ #winter  150svh  C5+C6+C7  ĐÔNG   góc 270°
└ #bloom   100svh  C10       XUÂN   góc 360° (trở về)
```

| Chương | Progress | HTML section | Card | Mùa |
|---|---|---|---|---|
| 0 | màn mở | `#gate` | C1 | cành trơ |
| 1 | 0.00–0.30 | `#spring` | C2 + C3 | xuân |
| 2 | 0.30–0.50 | `#summer` | C4 | hạ |
| 3 | 0.50–0.70 | `#autumn` | C8 | thu |
| 4 | 0.70–0.85 | `#winter` | C5 + C6 + C7 | đông |
| 5 | 0.85–1.00 | `#bloom` | C10 | xuân nở rộ |

Mỗi ranh giới chương có vùng chuyển mùa rộng **0.04 progress** (vd 0.28–0.32) để màu, hạt và tán lá lerp mượt; ngoài vùng này mùa đứng yên.

### Keyframe camera
Camera **luôn nằm trên quỹ đạo trụ** quanh gốc cây `[0,0,0]`, nên keyframe viết theo toạ độ trụ `(θ, r, y)` rồi đổi ra `[r·sin θ, y, r·cos θ]`. Nội suy θ, r, y (không nội suy vector) để camera đi theo cung tròn, không cắt ngang qua cây.

| progress | θ | r | y | lookAt | Ghi chú |
|---|---|---|---|---|---|
| 0.00 | 0° | 16 | 3 | `[0,3,0]` | Toàn cảnh cây và đồi |
| 0.15 | 30° | 11 | 4 | `[0,4,0]` | Tiến gần tán hoa hồng |
| 0.30 | 90° | 12 | 2.5 | `[0,3,0]` | Sang hạ |
| 0.40 | 120° | 9 | 5 | `[0,5,0]` | Nhìn lên tán lá, nắng xuyên |
| 0.50 | 180° | 10 | 3.5 | `[0,3.5,0]` | Sang thu, thấy ảnh treo |
| 0.62 | 220° | 7 | 3 | `[1,3,0]` | Lướt dọc các ảnh treo |
| 0.70 | 270° | 14 | 4 | `[0,2,0]` | Sang đông, lùi xa |
| 0.85 | 330° | 12 | 1.5 | `[0,3,0]` | Thấp, thấy đèn trên cây |
| 1.00 | 360° | 18 | 6 | `[0,3,0]` | Trở về xuân, kéo xa và cao |

Hàm `sampleOrbit(kfs, p)` giống `sampleKeyframes` của kit nhưng nội suy trên `(θ, r, y)`; làm mượt thêm bằng `lerp(target, 1 - exp(-4·delta))` như galaxy.

---

## 5. Các đối tượng trong scene

| Đối tượng | Cách dựng | Số lượng (desktop / mobile) |
|---|---|---|
| Đồi | `CylinderGeometry(12, 13, 1, 24)` dẹt, `flatShading`, màu cỏ lerp theo mùa (xuân `#A7D7A0`, hạ `#6CBF6A`, thu `#C9A45C`, đông `#F1F5F9`) | 1 |
| Thân và cành | Tự sinh bằng hàm đệ quy (L-system đơn giản, seed cố định): mỗi cành là `CylinderGeometry` thon, gộp bằng `mergeGeometries` thành 1 mesh | 1 mesh (~60 cành / ~35 cành) |
| Tán lá | `InstancedMesh` icosahedron nhỏ ở đầu cành; `scale` theo mùa: cành trơ 0 → xuân 0.6 → hạ 1 → thu 0.8 → đông 0.3; màu instance lerp theo mùa | 400 / 200 |
| **Hệ hạt duy nhất** | `Points` + `ShaderMaterial`; uniforms `uSeason` (0..4 thực), `uTime`; mỗi hạt có seed; shader trộn 4 kiểu chuyển động (§5.1) | 1500 / 700 |
| Ảnh treo (C8) | `images[3..8]` là plane 3:4 (0.9×1.2), dây `Line` drei từ điểm trên cành; lắc nhẹ `rotation.z = sin(t + i)·0.05` | 6 |
| Ảnh chân dung (C3) | `images[1]`, `images[2]` là hai plane đứng hai bên gốc cây, hơi nghiêng vào nhau 10° | 2 |
| Đèn dây mùa đông | `InstancedMesh` sphere r=0.05 `meshBasicMaterial` vàng `#FDE68A`, rải dọc cành; `opacity` chỉ > 0 khi mùa đông; nhấp nháy theo seed | 120 / 60 |
| Nắng mùa hạ | 1 `directionalLight` cường độ lerp theo mùa + drei `<Sparkles color="#FEF08A" size={3}>` quanh tán, chỉ bật khi hạ | 1 |
| Ánh sáng | `hemisphereLight` màu trời/đất lerp theo mùa; **không shadow** (tiết kiệm; mobile theo chuẩn) | 1 |

### 5.1 Hệ hạt theo mùa (điểm nhấn)
Trong vertex shader, tính 4 vị trí rồi trộn theo trọng số mùa:
- **Xuân**: cánh hoa rơi chậm, xoay tròn (`y` giảm 0.4/s, `x += sin(t·1.3 + seed)·0.6`).
- **Hạ**: đom đóm bay lơ lửng quanh tán (`y` dao động ±0.5 quanh độ cao ban đầu), size nhỏ, sáng.
- **Thu**: lá rơi nhanh hơn, bị gió thổi ngang (`x += t·0.8` quấn vòng trong bán kính 12).
- **Đông**: tuyết rơi thẳng, rất chậm, size nhỏ trắng.
`y` quấn vòng bằng `mod` trong khoảng [0, 10] nên không cần cập nhật mảng từ CPU. Màu cũng trộn theo `uSeason`. CPU chỉ cập nhật 2 uniform mỗi frame.

`uSeason` tính từ progress: `seasonAt(p)` trả số thực, ví dụ 0.30 → 1.0 (hạ), 0.29 → 0.75 (đang chuyển). Hàm này được test.

**Tương tác con trỏ:** kéo ngang (pointer) cộng thêm tối đa ±8° vào θ (làm mượt), giúp người dùng "nhìn quanh cây" nhưng khi thả ra thì trôi về quỹ đạo gốc. Mobile: không gyro (mẫu này không cần).

---

## 6. Chi tiết từng section HTML

Card xen kẽ trái/phải theo mùa để không che thân cây (cây luôn ở giữa màn hình). Trên 360px card nằm ở **nửa dưới** màn hình, cây ở nửa trên.

**Bánh xe mùa** (chung cho mọi chương): vòng tròn 44px `fixed left-4 top-1/2`, chia 4 cung màu mùa, kim chỉ xoay theo θ (`rotation` gán thẳng từ progress). Bấm vào một cung → `scrollTo` đầu chương đó. Không đè 3 góc chung.

### C1 · Màn mở
```
┌────────────────────────────┐
│                            │
│          ╲ │ ╱             │  ← cây trơ cành (canvas)
│           ╲│╱              │
│            │               │
│      ▁▁▁▁▁▁▁▁▁▁▁▁          │  ← đồi
│      BỐN MÙA YÊU           │  ← nhãn Manrope 11px muted
│  Minh Quân  &  Thu Hà      │  ← Playfair italic 28px ember
│                            │
│     ╭────────────────╮     │
│     │  ✿ MỞ THIỆP    │     │  ← nút ember, chữ trắng, A12
│     ╰────────────────╯     │
└────────────────────────────┘
```
**Nội dung:** "Bốn mùa yêu" · `{groom.name} & {bride.name}` · nút "Mở thiệp".

| t | Sự kiện |
|---|---|
| 0.0s | Bấm → nhạc fade in 1.5s; nút scale 0.95 rồi fade ra 0.3s |
| 0.2–1.8s | **Cây đâm chồi**: tán lá `scale` 0 → 0.6 stagger theo khoảng cách tới gốc (từ thân ra ngọn), `back.out(1.4)` |
| 0.8–2.0s | Nền lerp từ trắng `#FFFFFF` sang `spring`; hạt xuân bắt đầu rơi (`uSeason` = 0 nhưng mật độ 0 → 1) |
| 1.0–2.4s | Camera từ `r 20` về `r 16` |
| 2.4s | Mở khoá cuộn, hiện gợi ý "Cuộn để đi qua bốn mùa ↓" (A12) |

Có nút "Bỏ qua" nhỏ sau 0.5s. **Trước khi canvas sẵn sàng:** nền `spring` + SVG cây tĩnh 2 màu.

### C2 · Tên (0.00–0.15), căn giữa phía dưới
```
│            ❀               │
│   MÙA XUÂN · GẶP NHAU       │  ← nhãn mùa
│   Trân trọng kính mời      │  ← muted 14px
│        Minh Quân           │  ← h1, ember 44px, A2 chars
│            &               │
│         Thu Hà             │
```
Không có nền card (chữ trực tiếp trên nền pastel). A2 chạy khi section vào 50% viewport.

### C3 · Cặp đôi (0.15–0.30), hai card nhỏ hai bên
```
│┌───────────┐┌───────────┐ │
││ NHÀ TRAI  ││ NHÀ GÁI   │ │  ← 2 cột 50/50, card paper
││ Minh Quân ││ Thu Hà    │ │
││ 12 Lê Lợi,││ 34 Trần…  │ │
││ Quận 1    ││           │ │
│└───────────┘└───────────┘ │
```
**Nội dung:** `groom.name`, `groom.address`, `bride.name`, `bride.address`. Tên bố mẹ ⚠️ (chưa chốt): nếu có thì thêm dòng "Con ông … & bà …" trên tên, nếu không thì ẩn dòng đó. Ảnh chân dung là plane 3D hai bên gốc cây (§5), không nằm trong card. Card A1 stagger 0.15s.

### C4 · Chuyện tình (0.30–0.50, mùa hạ)
Ba card nhỏ, mỗi card chiếm ~1/3 chương, lần lượt trái → phải → trái. Mỗi card kèm ảnh thumbnail tròn 72px (HTML `<img>`) để người xem thấy ảnh ngay cả khi không nhìn scene.

| Mốc | Tiêu đề | Nội dung viết sẵn | Ảnh |
|---|---|---|---|
| 1 | Nảy mầm | "Chúng tôi gặp nhau vào một ngày rất bình thường, không ai ngờ đó là hạt mầm đầu tiên." | `images[3]` |
| 2 | Xanh lá | "Những mùa hè rong ruổi, những buổi chiều không muốn về, tình yêu cứ thế lớn lên." | `images[4]` |
| 3 | Kết trái | "Rồi một ngày, anh hỏi, em gật đầu. Cây đã đủ lớn để che chở cho cả hai." | `images[5]` |

| Thời điểm (progress) | Sự kiện |
|---|---|
| 0.30–0.32 | Chuyển mùa xuân → hạ (màu, hạt, tán lá scale 0.6 → 1) |
| 0.33 / 0.39 / 0.45 | Card 1/2/3 A1 vào; card trước fade 0 + `y -20` |
| 0.40 | Camera nhìn lên tán, Sparkles nắng bật |

### C8 · Album (0.50–0.70, mùa thu)
Tiêu đề HTML "MÙA THU · KỶ NIỆM" (A2). Ảnh là 6 plane treo trên cành. Camera lướt dọc (keyframe 0.50–0.62). Bấm ảnh 3D (`onClick` R3F, con trỏ `pointer` khi hover) → lightbox HTML (A10) hiện ảnh gốc. Nút "Xem tất cả ảnh" mở lưới 2 cột HTML (không bắt người xem "săn" ảnh trong 3D).

### C5 + C6 + C7 · Ngày, sự kiện, địa điểm (0.70–0.85, mùa đông)
```
│ ╭────────────────────────╮ │
│ │ MÙA ĐÔNG · VỀ CHUNG NHÀ│ │
│ │         14             │ │  ← ember 80px
│ │   THÁNG 11 · 2026      │ │
│ │  45 ngày 06 giờ 12 phút│ │  ← A7
│ │ ────────────────────── │ │
│ │ ❄ Lễ thành hôn   17:00 │ │
│ │ ❄ Tiệc cưới      18:00 │ │
│ │ ────────────────────── │ │
│ │ Nhà hàng {venue.name}  │ │
│ │ ┌────────────────────┐ │ │
│ │ │    MapEmbed 180px  │ │ │
│ │ └────────────────────┘ │ │
│ │ [ Chỉ đường ]          │ │
│ ╰────────────────────────╯ │
```
- Ngày cần `date` ⚠️. Chưa có trường này → dùng ngày mẫu viết sẵn trong mẫu và ẩn đếm ngược. Đã qua ngày cưới → "Chúng tôi đã về chung một nhà ♥".
- Giờ sự kiện viết sẵn. Card này dài (~1.3 màn hình mobile) nên dùng một card cuộn tự nhiên, không ghim.
- Đèn dây trên cây bật lần lượt (stagger theo seed) khi vào 0.72.

### C10 · Kết (0.85–1.00, trở lại xuân)
```
│   Cảm ơn bạn đã đi cùng     │
│   chúng tôi qua bốn mùa.    │  ← Playfair 26px
│  ┌──────────────┐           │
│  │  images[n-1] │           │  ← ảnh 3:4, A3
│  └──────────────┘           │
│   Minh Quân & Thu Hà        │
```
| Progress | Sự kiện |
|---|---|
| 0.85–0.89 | Đông → xuân, tuyết hoá cánh hoa (cùng hệ hạt) |
| 0.90–1.00 | Tán lá scale 0.3 → 1.2 ("nở rộ" hơn cả xuân đầu), hạt tăng mật độ ×1.5 |
| 0.95 | Câu cảm ơn A1, ảnh cuối A3 |

### Reduced-motion và edge case (chung)
- Reduced-motion → fallback §7 (không mount canvas), bánh xe mùa vẫn hiện nhưng không xoay mượt (đổi theo chương).
- Tên 50 ký tự: tên dùng `text-balance` + `break-words`, cỡ chữ giảm 1 bậc khi `name.length > 24`.
- Ít hơn 9 ảnh ở chế độ "Dùng thử" không xảy ra (form ép đủ 9); nhưng vẫn lọc `images.filter(Boolean)` để không tạo plane rỗng.

---

## 7. Fallback (không có WebGL hoặc bật reduced-motion)
- Không mount canvas. Nền là 4 ảnh minh hoạ `fallback-spring|summer|autumn|winter.webp` (cảnh chụp từ scene) `fixed inset-0`, **crossfade** theo chương bằng `opacity` (ScrollTrigger `toggleActions`, không scrub; reduced-motion thì đổi tức thì).
- Ảnh chân dung vào card C3 (vòm tròn 120px), ảnh chuyện tình giữ thumbnail, album thành lưới 2 cột.
- Hạt tắt hoàn toàn.
- Kiểm tra WebGL: `!!document.createElement("canvas").getContext("webgl2")` (kit).

## 8. Hiệu năng
- `dpr={[1, isMobile ? 1.5 : 2]}`; `frameloop="demand"` trước khi mở thiệp và khi tab ẩn.
- Toàn scene ≈ 3 draw call cho cây + lá + đèn (merge và instancing) + 1 cho hạt + 8 plane ảnh. Mục tiêu ≥ 55fps trên Android tầm trung.
- Hạt tính hoàn toàn trên GPU; không `new` object trong `useFrame`.
- Texture ảnh qua `useSafeTexture` (≤ 1024px).

## 9. Dữ liệu và media
| Vị trí | Dùng ở |
|---|---|
| `images[0]` | Thumbnail, OG, nền lightbox |
| `images[1]` / `images[2]` | Plane chân dung hai bên gốc cây (C3) |
| `images[3..5]` | Thumbnail tròn ba mốc C4 |
| `images[3..8]` | 6 ảnh treo trên cành (C8) |
| `images[8]` | Ảnh cuối C10 (`images[n-1]`) |

`meta.media = { images: 9, videos: 0 }` (bản sơ bộ ghi 8; tăng lên 9 để C10 có ảnh riêng không trùng album. Nếu muốn giữ 8 thì C10 dùng lại `images[0]`).

---

## 10. Triển khai code

### 10.1 Cấu trúc
```
src/app/mau-thiep-cuoi/seasons-3d/
├── meta.ts, layout.tsx, page.tsx
└── _components/
    ├── seasons-invite.tsx    # "use client": HTML sections + gate + SeasonWheel + <SeasonsCanvas/>
    ├── seasons-canvas.tsx    # next/dynamic(() => import("./scene"), { ssr: false }) + fallback
    ├── scene.tsx             # <SceneCanvas> + đối tượng bên dưới, lerp background
    ├── orbit-rig.tsx         # camera theo sampleOrbit
    ├── tree.tsx              # thân (merge) + tán (InstancedMesh) + đèn
    ├── season-particles.tsx  # Points + shader §5.1
    ├── hanging-photos.tsx    # C8 + chân dung C3
    ├── season.ts             # seasonAt, seasonColor, ORBIT_KFS, sampleOrbit, buildTree(seed) (có test)
    ├── season-wheel.tsx      # bánh xe mùa HTML
    └── sections/*.tsx        # gate, spring, summer, autumn, winter, bloom
```
Layout: `Playfair_Display({ subsets: ["vietnamese"], style: ["normal","italic"], variable: "--font-serif" })` + `Manrope({ subsets: ["vietnamese"], variable: "--font-sans" })`.

### 10.2 Tokens
```ts
export const t = {
  root: "min-h-screen text-[#1F2937] font-(family-name:--font-sans)",
  bg: { spring: "bg-[#FDEEF2]", summer: "bg-[#E8F6E9]", autumn: "bg-[#FBE8D3]", winter: "bg-[#EEF3F8]" },
  name: "font-(family-name:--font-serif) italic font-medium text-[44px] lg:text-[80px] text-[#C2410C] leading-[1.05]",
  label: "text-[11px] lg:text-xs font-semibold uppercase tracking-[0.3em] text-[#4B5563]",
  card: "rounded-[1.25rem] bg-white/75 backdrop-blur-sm shadow-[0_8px_30px_rgb(0_0_0/0.06)] p-6 max-w-[400px]",
  btn: "min-h-11 rounded-full bg-[#C2410C] px-7 text-white",
} as const;
```
Nền HTML: không đổi class theo mùa (gây re-render); gán `style={{ backgroundColor }}` qua ref trong `onUpdate` của ScrollTrigger (giá trị động, được phép theo spec §5).

### 10.3 Mùa và quỹ đạo (logic cần test)
```ts
// season.ts
export const SEASON_STOPS = [0, 0.30, 0.50, 0.70, 0.85] as const; // xuân, hạ, thu, đông, xuân lại
const BLEND = 0.02;
export function seasonAt(p: number): number {
  // trả 0..4, đứng yên giữa các ranh, lerp smoothstep trong ±BLEND quanh mỗi ranh
}
export type OrbitKf = { at: number; theta: number; r: number; y: number; look: [number, number, number] };
export function sampleOrbit(kfs: OrbitKf[], p: number): { pos: Vector3; look: Vector3 }
```
Test `season.test.ts`: `seasonAt(0.1) === 0`; `seasonAt(0.40) === 1`; `seasonAt(0.30)` ≈ 0.5 ± 0.01; `seasonAt(0.95) === 4`; hàm đơn điệu không giảm; `sampleOrbit` luôn cho `|pos.xz| === r` nội suy (không cắt qua cây: khoảng cách tới trục ≥ min r); `buildTree(42)` cho cùng số cành mỗi lần (seed cố định).

### 10.4 Rig và hạt
```tsx
// orbit-rig.tsx
const pos = useMemo(() => new Vector3(), []), look = useMemo(() => new Vector3(), []);
useFrame(({ camera, pointer }, delta) => {
  const s = sampleOrbit(ORBIT_KFS, progress.current);
  const k = 1 - Math.exp(-4 * delta);
  pos.lerp(s.pos.applyAxisAngle(Y, pointer.x * 0.14), k); // ±8°
  look.lerp(s.look, k);
  camera.position.copy(pos); camera.lookAt(look);
});

// season-particles.tsx
const mat = useRef<ShaderMaterial>(null);
useFrame((_, dt) => {
  mat.current!.uniforms.uTime.value += dt;
  mat.current!.uniforms.uSeason.value = seasonAt(progress.current);
});
```

### 10.5 Thứ tự làm
1. `season.ts` + test (seasonAt, sampleOrbit, buildTree)
2. HTML sections tĩnh + bánh xe mùa, cuộn được, nền đổi màu → kiểm tra bố cục 360px
3. Canvas: đồi + cây (merge) + orbit rig
4. Tán lá instancing theo mùa + lerp màu nền/ánh sáng
5. Hệ hạt shader 4 mùa
6. Ảnh chân dung, ảnh treo, raycast → lightbox
7. Màn mở (đâm chồi), nhạc + lowpass mùa đông
8. Fallback 4 ảnh, đo bundle, Lighthouse mobile ≥ 75, checklist template-spec §12

## 11. Asset cần chuẩn bị
- [ ] `fallback-spring|summer|autumn|winter.webp` (chụp từ scene, 1080×1920, ≤ 200KB)
- [ ] `tree-static.svg` (placeholder trước khi canvas sẵn sàng)
- [ ] `music.mp3` (Pixabay) + `CREDITS.md`
- [ ] 9 ảnh mẫu (Pexels, có ảnh ngoài trời hợp 4 mùa)
- [ ] `thumb.webp` 3:4, `opengraph-image.png` (chụp cảnh thu có ảnh treo)

## 12. Tiêu chí nghiệm thu riêng
- [ ] Cuộn nhanh: camera luôn đi theo cung tròn, **không bao giờ xuyên qua thân cây**
- [ ] Ranh giới mùa: màu nền HTML và `scene.background` khớp nhau (không lệch dải màu ở mép canvas)
- [ ] Chỉ có **một** `Points` trong scene (kiểm tra bằng `renderer.info.render.calls`)
- [ ] Bánh xe mùa bấm được (≥ 44px), cuộn đúng chương, không đè nút chung
- [ ] Android tầm trung ≥ 50fps suốt trang
- [ ] Tắt WebGL: vẫn thấy 4 ảnh mùa crossfade và đọc đủ nội dung
